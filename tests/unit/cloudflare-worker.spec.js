const { test, expect } = require('@playwright/test');
const fs = require('fs'); const path = require('path');

// Worker Cloudflare (proxy Gemini) uruchamiany w Node z podmienionym fetch — bez sieci i bez klucza.
// Moduł ES ładowany z data: URL, bo package.json ma "type": "commonjs".
const WORKER_SRC = fs.readFileSync(path.join(__dirname, '../../backend/cloudflare-worker.js'), 'utf8');
const loadWorker = async () =>
  (await import('data:text/javascript;base64,' + Buffer.from(WORKER_SRC).toString('base64'))).default;

const MEAL = { food_name: 'Owsianka', calories: 420, protein: 15, carbs: 70, fat: 9 };
const HIGH_DEMAND = 'This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.';

const geminiOk = (parts) => new Response(JSON.stringify({
  candidates: [{ content: { parts, role: 'model' }, finishReason: 'STOP' }],
}), { status: 200, headers: { 'Content-Type': 'application/json' } });
const geminiErr = (code, status, message, details) => new Response(
  JSON.stringify({ error: { code, message, status, ...(details ? { details } : {}) } }),
  { status: code, headers: { 'Content-Type': 'application/json' } }
);
const quota429 = (quotaId, retryDelay) => geminiErr(429, 'RESOURCE_EXHAUSTED', 'You exceeded your current quota, please check your plan and billing details.', [
  { '@type': 'type.googleapis.com/google.rpc.QuotaFailure', violations: [{ quotaId }] },
  { '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay },
]);

// Uruchamia worker; `responses` to kolejne odpowiedzi Gemini (funkcje albo Response).
async function run({ body = { contextText: 'owsianka z bananem' }, env = { GEMINI_API_KEY: 'k' }, responses }) {
  const worker = await loadWorker();
  const calls = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), payload: JSON.parse(init.body) });
    const next = responses[calls.length - 1];
    if (!next) throw new Error(`nieoczekiwane zapytanie nr ${calls.length}`);
    return typeof next === 'function' ? next() : next;
  };
  try {
    const req = new Request('https://worker.test/', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
    const res = await worker.fetch(req, env, {});
    const text = await res.text();
    let json = null; try { json = JSON.parse(text); } catch (e) {}
    return { res, text, json, calls, models: calls.map(c => c.url.match(/models\/([^:]+):/)[1]) };
  } finally {
    globalThis.fetch = realFetch;
  }
}

test.describe('cloudflare-worker.js (proxy Gemini)', () => {
  test('domyślnie gemini-3.8-flash i odpowiedź jako JSON (responseMimeType)', async () => {
    const r = await run({ responses: [geminiOk([{ text: JSON.stringify(MEAL) }])] });
    expect(r.models).toEqual(['gemini-3.8-flash']);
    expect(r.calls[0].payload.generationConfig.responseMimeType).toBe('application/json');
    expect(r.res.status).toBe(200);
    expect(r.json).toEqual(MEAL);
    expect(r.res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  test('tryb czatu: bez responseMimeType, odpowiedź tekstowa', async () => {
    const r = await run({ body: { contextText: 'hej', action: 'chat' }, responses: [geminiOk([{ text: 'Do roboty! 💪' }])] });
    expect(r.calls[0].payload.generationConfig).toBeUndefined();
    expect(r.json).toEqual({ response: 'Do roboty! 💪' });
  });

  test('modele ze zmiennych GEMINI_MODEL i GEMINI_FALLBACK_MODEL', async () => {
    const r = await run({
      env: { GEMINI_API_KEY: 'k', GEMINI_MODEL: 'model-a', GEMINI_FALLBACK_MODEL: 'model-b' },
      responses: [geminiErr(503, 'UNAVAILABLE', HIGH_DEMAND), geminiOk([{ text: JSON.stringify(MEAL) }])],
    });
    expect(r.models).toEqual(['model-a', 'model-b']);
  });

  test('503 na głównym modelu: zapasowy gemini-3.5-flash-lite odpowiada', async () => {
    const r = await run({ responses: [geminiErr(503, 'UNAVAILABLE', HIGH_DEMAND), geminiOk([{ text: JSON.stringify(MEAL) }])] });
    expect(r.models).toEqual(['gemini-3.8-flash', 'gemini-3.5-flash-lite']);
    expect(r.res.status).toBe(200);
    expect(r.json).toEqual(MEAL);
  });

  test('503 na obu modelach: przekazuje kod 503, komunikat Google i model', async () => {
    const r = await run({ responses: [geminiErr(503, 'UNAVAILABLE', HIGH_DEMAND), geminiErr(503, 'UNAVAILABLE', HIGH_DEMAND)] });
    expect(r.res.status).toBe(503);
    expect(r.res.headers.get('Content-Type')).toContain('application/json');
    expect(r.json.error).toContain('high demand');
    expect(r.json.status).toBe(503);
    expect(r.json.model).toBe('gemini-3.5-flash-lite');
  });

  test('429 dzienny limit głównego modelu: zapasowy ma osobny limit i odpowiada', async () => {
    const r = await run({ responses: [quota429('GenerateRequestsPerDayPerProjectPerModel-FreeTier', '3600s'), geminiOk([{ text: JSON.stringify(MEAL) }])] });
    expect(r.res.status).toBe(200);
    expect(r.json).toEqual(MEAL);
  });

  test('429 na obu modelach (limit na minutę): kod 429, quota=minute, retryAfterSec', async () => {
    const r = await run({ responses: [quota429('GenerateRequestsPerMinutePerProjectPerModel-FreeTier', '20s'), quota429('GenerateRequestsPerMinutePerProjectPerModel-FreeTier', '37s')] });
    expect(r.res.status).toBe(429);
    expect(r.json.quota).toBe('minute');
    expect(r.json.retryAfterSec).toBe(37);
  });

  test('429 na obu modelach (limit dzienny): quota=day', async () => {
    const r = await run({ responses: [quota429('GenerateRequestsPerDayPerProjectPerModel-FreeTier', '3600s'), quota429('GenerateRequestsPerDayPerProjectPerModel-FreeTier', '3600s')] });
    expect(r.res.status).toBe(429);
    expect(r.json.quota).toBe('day');
  });

  test('400 (błąd zapytania): bez modelu zapasowego, kod 400', async () => {
    const r = await run({ responses: [geminiErr(400, 'INVALID_ARGUMENT', 'Invalid image')] });
    expect(r.calls.length).toBe(1);
    expect(r.res.status).toBe(400);
    expect(r.json.error).toContain('Invalid image');
  });

  test('Google zwraca HTML zamiast JSON: worker nie wybucha, kod 503 w JSON-ie', async () => {
    const html = () => new Response('<html><body>Service Unavailable</body></html>', { status: 503, headers: { 'Content-Type': 'text/html' } });
    const r = await run({ responses: [html, html] });
    expect(r.res.status).toBe(503);
    expect(r.json.error).toContain('HTTP 503');
  });

  test('odpowiedź w kilku częściach, z myślami, wstępem i ```json: czysty JSON posiłku', async () => {
    const r = await run({ responses: [geminiOk([
      { text: 'Rozważam porcję...', thought: true },
      { text: 'Oto wynik:\n```json\n{"food_name":"Owsianka","calories":420,' },
      { text: '"protein":15,"carbs":70,"fat":9}\n```' },
    ])] });
    expect(r.res.status).toBe(200);
    expect(r.json).toEqual(MEAL);
  });

  test('brak treści (filtr bezpieczeństwa): kod 422 z czytelnym komunikatem', async () => {
    const blocked = () => new Response(JSON.stringify({ candidates: [{ finishReason: 'SAFETY' }] }), { status: 200 });
    const r = await run({ responses: [blocked] });
    expect(r.res.status).toBe(422);
    expect(r.json.error).toContain('filtry bezpieczeństwa');
  });

  test('model zwrócił tekst bez JSON-a: kod 502, reason=invalid_output', async () => {
    const r = await run({ responses: [geminiOk([{ text: 'Nie widzę jedzenia na zdjęciu.' }])] });
    expect(r.res.status).toBe(502);
    expect(r.json.reason).toBe('invalid_output');
  });
});
