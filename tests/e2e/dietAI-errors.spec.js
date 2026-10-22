const { test, expect } = require('../fixtures');
const { VARIANTS, openVariant } = require('../helpers/neighbors');

// Odporność DietAI na błędy workera/Gemini: przeciążenie (503), limit (429), odpowiedź niebędąca
// JSON-em (Safari: „The string did not match the expected pattern”) i brak sieci.
// Worker jest podmieniony przez page.route pod adresem z tego samego pochodzenia (bez CORS).
// Prawdziwy worker jest zablokowany, żeby test nigdy nie zużył limitu Gemini.

const MOCK_URL = 'http://localhost:8080/__dietai-mock';
const SECRET_TEXT = 'tajny opis posilku 4711';
const GOOD_MEAL = { food_name: 'Owsianka z bananem', calories: 420, protein: 15, carbs: 70, fat: 9 };
const HIGH_DEMAND = 'This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.';

const ENGINE_PATH = (variant) =>
  variant.classic ? '/classic-app/src/modules/diet/DietAIEngine.js' : '/src/modules/diet/DietAIEngine.js';

async function setupDiet(page, variant, responder) {
  const calls = [];
  await page.route(/workers\.dev/, (route) => route.abort());
  await page.route(MOCK_URL, async (route) => {
    calls.push(route.request().postDataJSON());
    await responder(route, calls.length);
  });
  await page.addInitScript((url) => {
    localStorage.setItem('dietWorkerUrl', url);
    // BackupUI po 5 s pyta (confirm) o kopię zapasową; ten dialog zasłoniłby alert DietAI.
    localStorage.setItem('uki_backup_frequency', 'never');
  }, MOCK_URL);
  await openVariant(page, variant);
  // Krótkie przerwy między próbami, żeby test nie czekał kilkunastu sekund.
  await page.evaluate(async (enginePath) => {
    const { DietAIEngine } = await import(enginePath);
    DietAIEngine.retryDelaysMs = [5, 5, 5];
    DietAIEngine.retryJitterMs = 0;
  }, ENGINE_PATH(variant));
  await page.evaluate(() => window.switchTab('diet-dashboard'));
  // DietUI.init podpina przycisk „Analizuj” dopiero po wczytaniu posiłków z bazy (lista wypełniona).
  await expect(page.locator('#diet-logs-list')).toContainText('Jeszcze nic');
  await page.locator('#diet-context-input').fill(SECRET_TEXT);
  return calls;
}

async function analyzeExpectingAlert(page) {
  const dialogPromise = page.waitForEvent('dialog');
  await page.locator('#diet-analyze-btn').click();
  const dialog = await dialogPromise;
  const message = dialog.message();
  await dialog.accept();
  return message;
}

async function lastDietLog(page) {
  return page.evaluate(() => {
    const logs = JSON.parse(localStorage.getItem('uki_error_logs') || '[]');
    const entry = logs.find((l) => l.msg === 'DietAI Error');
    return entry ? `${entry.msg}: ${entry.stack}` : null;
  });
}

const json = (status, body) => ({ status, contentType: 'application/json', body: JSON.stringify(body) });

for (const variant of VARIANTS) {
  test.describe(`DietAI: obsługa błędów (${variant.name})`, () => {
    test('przeciążenie 503 dwa razy, potem poprawny wynik: ponawia i pokazuje posiłek', async ({ page }) => {
      const calls = await setupDiet(page, variant, (route, n) =>
        n <= 2
          ? route.fulfill(json(503, { error: `Google API Błąd: ${HIGH_DEMAND}`, status: 503, model: 'gemini-3.8-flash' }))
          : route.fulfill(json(200, GOOD_MEAL))
      );
      await page.locator('#diet-analyze-btn').click();
      await expect(page.locator('#diet-result-modal-overlay')).toBeVisible();
      await expect(page.locator('#diet-result-kcal-display')).toHaveValue('420');
      expect(calls.length).toBe(3);
      expect(calls[0].contextText).toBe(SECRET_TEXT);
    });

    test('stary worker (500 + „high demand”) bez przerwy: 4 próby, czytelny komunikat i log z kodem HTTP', async ({ page }) => {
      const calls = await setupDiet(page, variant, (route) =>
        route.fulfill({ status: 500, body: JSON.stringify({ error: `Google API Błąd: ${HIGH_DEMAND}` }) })
      );
      const message = await analyzeExpectingAlert(page);
      expect(message).toContain('przeciążone');
      expect(calls.length).toBe(4);
      const log = await lastDietLog(page);
      expect(log).toContain('HTTP 500');
      expect(log).toContain('próby 4/4');
      expect(log).not.toContain(SECRET_TEXT);
    });

    test('nowy worker 503 bez przerwy: log zawiera model zgłoszony przez worker', async ({ page }) => {
      await setupDiet(page, variant, (route) =>
        route.fulfill(json(503, { error: `Google API Błąd: ${HIGH_DEMAND}`, status: 503, model: 'gemini-3.5-flash-lite' }))
      );
      const message = await analyzeExpectingAlert(page);
      expect(message).toContain('przeciążone');
      const log = await lastDietLog(page);
      expect(log).toContain('HTTP 503');
      expect(log).toContain('model gemini-3.5-flash-lite');
    });

    test('429 z wyczerpanym dziennym limitem: bez ponawiania, komunikat o limicie', async ({ page }) => {
      const calls = await setupDiet(page, variant, (route) =>
        route.fulfill(json(429, {
          error: 'Google API Błąd: You exceeded your current quota, please check your plan and billing details.',
          status: 429,
          quota: 'day',
        }))
      );
      const message = await analyzeExpectingAlert(page);
      expect(message).toContain('limit');
      expect(calls.length).toBe(1);
    });

    test('429 z limitem na minutę: bez ponawiania, komunikat z czasem oczekiwania', async ({ page }) => {
      const calls = await setupDiet(page, variant, (route) =>
        route.fulfill(json(429, {
          error: 'Google API Błąd: You exceeded your current quota, please check your plan and billing details.',
          status: 429,
          quota: 'minute',
          retryAfterSec: 37,
        }))
      );
      const message = await analyzeExpectingAlert(page);
      expect(message).toContain('37 s');
      expect(message).not.toContain('jutro');
      expect(calls.length).toBe(1);
    });

    test('200 z tekstem przed i po JSON-ie: wyciąga obiekt i pokazuje posiłek', async ({ page }) => {
      await setupDiet(page, variant, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: `Oto analiza: ${JSON.stringify(GOOD_MEAL)}\nSmacznego!` })
      );
      await page.locator('#diet-analyze-btn').click();
      await expect(page.locator('#diet-result-kcal-display')).toHaveValue('420');
    });

    test('200 w znacznikach ```json: pokazuje posiłek', async ({ page }) => {
      await setupDiet(page, variant, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: '```json\n' + JSON.stringify(GOOD_MEAL) + '\n```' })
      );
      await page.locator('#diet-analyze-btn').click();
      await expect(page.locator('#diet-result-kcal-display')).toHaveValue('420');
    });

    test('200 ze stroną HTML: czytelny komunikat zamiast SyntaxError, bezpieczny fragment w logu', async ({ page }) => {
      const base64 = 'A'.repeat(300);
      const calls = await setupDiet(page, variant, (route) =>
        route.fulfill({ status: 200, contentType: 'text/html', body: `<html><body>Blad ${base64}</body></html>` })
      );
      const message = await analyzeExpectingAlert(page);
      expect(message).toContain('nieprawidłową odpowiedź');
      expect(message).not.toContain('SyntaxError');
      expect(calls.length).toBe(4);
      const log = await lastDietLog(page);
      expect(log).toContain('HTTP 200');
      expect(log).toContain('[base64]');
      expect(log).not.toContain('<html>');
      expect(log).not.toContain(base64);
    });

    test('nowy worker 502 invalid_output (model bez JSON-a): ponawia i pokazuje komunikat o nieprawidłowej odpowiedzi', async ({ page }) => {
      const calls = await setupDiet(page, variant, (route) =>
        route.fulfill(json(502, { error: 'Model AI zwrócił odpowiedź bez danych JSON.', status: 502, reason: 'invalid_output', model: 'gemini-3.8-flash' }))
      );
      const message = await analyzeExpectingAlert(page);
      expect(message).toContain('nieprawidłową odpowiedź');
      expect(message).not.toContain('przeciążone');
      expect(calls.length).toBe(4);
    });

    test('brak sieci: ponawia i pokazuje komunikat o połączeniu', async ({ page }) => {
      const calls = await setupDiet(page, variant, (route) => route.abort('internetdisconnected'));
      const message = await analyzeExpectingAlert(page);
      expect(message).toContain('Brak połączenia');
      expect(calls.length).toBe(4);
    });
  });
}
