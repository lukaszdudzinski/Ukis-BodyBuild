/**
 * Uki's BodyBuild - Gemini AI Proxy Worker
 * 
 * Instrukcja wdrożenia na Cloudflare (Darmowe, zajmuje 2 minuty):
 * 1. Zaloguj się na dash.cloudflare.com
 * 2. Przejdź do zakładki "Workers & Pages" -> "Create Application" -> "Create Worker"
 * 3. Nadaj mu nazwę np. "ukis-diet-ai" i kliknij "Deploy"
 * 4. Kliknij "Edit code" (Edytuj kod) na górze po prawej stronie.
 * 5. Wklej cały poniższy kod, zastępując domyślny.
 * 6. Zanim zapiszesz, wejdź w Settings (Ustawienia) workera na stronie Cloudflare, 
 *    znajdź sekcję "Variables and Secrets" i dodaj zmienną o nazwie:
 *    GEMINI_API_KEY
 *    Jako wartość wklej swój klucz od Google (ten który podałeś mi wyżej). Zaznacz jako Encrypt/Secret.
 * 7. Kliknij "Deploy" (Zapisz). Skopiuj URL Twojego workera (np. https://ukis-diet-ai.twojanazwa.workers.dev)
 * 8. Wklej ten URL w Ustawieniach w aplikacji Uki's BodyBuild!
 *
 * Opcjonalne zmienne (Variables, zwykły tekst) — tylko modele z DARMOWEGO planu Gemini:
 *    GEMINI_MODEL           (domyślnie gemini-3.8-flash)
 *    GEMINI_FALLBACK_MODEL  (domyślnie gemini-3.5-flash-lite; używany przy 429/5xx głównego modelu)
 */

const DEFAULT_MODEL = "gemini-3.8-flash";
const DEFAULT_FALLBACK_MODEL = "gemini-3.5-flash-lite";

// Kody, przy których warto spróbować modelu zapasowego (osobna pula mocy i osobny limit darmowy).
const FALLBACK_STATUSES = [429, 500, 502, 503, 504];

// Błąd z prawdziwym kodem HTTP i polami dla aplikacji (status, model, quota, retryAfterSec, reason).
class UpstreamError extends Error {
  constructor(message, status, extra = {}) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

// Szczegóły 429 z Gemini: limit dzienny czy minutowy i po ilu sekundach ponowić.
const quotaInfo = (geminiError) => {
  const details = Array.isArray(geminiError?.details) ? geminiError.details : [];
  const quotaIds = details.flatMap(d => (d.violations || []).map(v => v.quotaId || ""));
  const retry = details.find(d => typeof d.retryDelay === "string");
  const info = {};
  if (quotaIds.some(id => /PerMinute/i.test(id))) info.quota = "minute";
  else if (quotaIds.some(id => /PerDay/i.test(id))) info.quota = "day";
  if (retry) info.retryAfterSec = Math.ceil(parseFloat(retry.retryDelay));
  return info;
};

// Jedno wywołanie Gemini; zwraca tekst odpowiedzi (bez części „myślowych”) albo rzuca UpstreamError.
const callGemini = async (model, apiKey, payload) => {
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const geminiResponse = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const rawText = await geminiResponse.text();
  let geminiData = null;
  try { geminiData = JSON.parse(rawText); } catch (e) { /* np. strona HTML błędu Google */ }

  if (!geminiResponse.ok) {
    const message = geminiData?.error?.message || `HTTP ${geminiResponse.status} ${geminiResponse.statusText || ""}`.trim();
    const extra = geminiResponse.status === 429 ? quotaInfo(geminiData?.error) : {};
    throw new UpstreamError(`Google API Błąd: ${message}`, geminiResponse.status, extra);
  }

  const parts = geminiData?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts) || parts.length === 0) {
    throw new UpstreamError("Google API nie zwróciło żadnych danych (prawdopodobnie zdjęcie naruszyło filtry bezpieczeństwa).", 422);
  }
  return parts.filter(p => !p.thought && typeof p.text === "string").map(p => p.text).join("");
};

// Wyciąga obiekt JSON z tekstu modelu (wstęp, ```json, komentarz po nim). Zwraca obiekt albo null.
const extractJson = (text) => {
  const tryParse = (s) => {
    try {
      const v = JSON.parse(s);
      return v && typeof v === "object" && !Array.isArray(v) ? v : null;
    } catch (e) {
      return null;
    }
  };
  const trimmed = (text || "").replace(/```(?:json)?/gi, "").trim();
  const direct = tryParse(trimmed);
  if (direct) return direct;
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  return start !== -1 && end > start ? tryParse(trimmed.slice(start, end + 1)) : null;
};

export default {
  async fetch(request, env, ctx) {
    // 1. Obsługa CORS (Zezwolenie na zapytania z przeglądarki)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // W celach produkcyjnych możesz tu wpisać domenę apki zamiast *
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Jeśli przeglądarka wysyła zapytanie OPTIONS (preflight), od razu zwracamy OK
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const jsonResponse = (data, status = 200) => new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    try {
      // 2. Pobieramy zdjęcia wysłane z naszej aplikacji oraz opcjonalny kontekst
      const body = await request.json();
      const { imageBase64, images, contextText, action } = body;

      // Normalizujemy listę zdjęć (obsługujemy tablicę `images` lub pojedyncze `imageBase64`)
      let imageList = [];
      if (Array.isArray(images) && images.length > 0) {
        imageList = images.filter(img => typeof img === 'string' && img.trim().length > 0);
      } else if (imageBase64 && typeof imageBase64 === 'string' && imageBase64.trim().length > 0) {
        imageList = [imageBase64];
      }

      if (imageList.length === 0 && (!contextText || contextText.trim().length === 0)) {
        return new Response(JSON.stringify({ error: "Brak zdjęcia lub tekstu" }), { status: 400, headers: corsHeaders });
      }

      // 3. Sprawdzamy czy dodałeś klucz GEMINI w Cloudflare Secrets
      const GEMINI_API_KEY = env.GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        return new Response(JSON.stringify({ error: "Brak skonfigurowanego klucza Gemini na serwerze Cloudflare!" }), { status: 500, headers: corsHeaders });
      }

      // 4. Budujemy zapytanie do Google Gemini Pro Vision
      let prompt = ``;
      
      if (action === "chat") {
          // Tryb Trenera AI "Edwarda"
          prompt += `Jesteś Edward, twardym, zmotywowanym i inspirującym trenerem personalnym oraz dietetykiem z wieloletnim doświadczeniem. Otrzymujesz zapytanie od podopiecznego: "${contextText}".
Twoim celem jest odpowiadać krótko, na temat, merytorycznie i zabawnie (dodając emotikony), budując motywację. Bądź wymagający, ale serdeczny.
Zwróć TYLKO czystą treść odpowiedzi (tekst/markdown). Nie dodawaj żadnego JSONa.`;
      } else {
          // Domyślny tryb (analiza diety)
          if (imageList.length > 1) {
              prompt += `Otrzymujesz ${imageList.length} zdjęć posiłków lub etykiet diety pudełkowej / dań.
TWOJE ZADANIE:
1. Przeanalizuj DOKŁADNIE KAŻDE z ${imageList.length} załączonych zdjęć.
2. Zidentyfikuj wszystkie posiłki oraz etykiety cateringowe z wartościami odżywczymi widoczne na KAŻDYM zdjęciu. Jeśli na zdjęciach są naklejki / etykiety z podanymi kaloriami i makroskładnikami (np. catering dietetyczny), bezwzględnie przepisz te wartości.
3. ZSUMUJ kalorie (kcal) oraz makroskładniki (białko, węglowodany, tłuszcz) ZE WSZYSTKICH ZAŁĄCZONYCH ZDJĘĆ w jeden łączny wynik całkowity (łączna suma kalorii, białka, węglowodanów i tłuszczu).
4. W polu "food_name" podaj zwięzłą listę wszystkich zidentyfikowanych dań/pudełek połączonych znakiem "+" (np. "Obiad: Łosoś z kaszą + Podwieczorek: Sernik fit").
`;
              if (contextText && contextText.trim().length > 0) {
                  prompt += `\nUżytkownik dostarczył dodatkowy opis słowny: "${contextText}". Weź go pod uwagę.\n`;
              }
          } else if (imageList.length === 1) {
              prompt += `Przeanalizuj to zdjęcie posiłku. Jeśli na zdjęciu widoczna jest etykieta z cateringu dietetycznego / wartościami odżywczymi, bezwzględnie przepisz z niej dokładne wartości kalorii i makroskładników. `;
              if (contextText && contextText.trim().length > 0) {
                  prompt += `\nUżytkownik dostarczył dodatkowy opis słowny posiłku: "${contextText}". Zignoruj zdjęcie jeśli jest niewyraźne lub nie przedstawia jedzenia, i oprzyj się w 100% na tym tekście.\n`;
              } else {
                  prompt += `\nJeśli zdjęcie jest niewyraźne lub nie ma na nim jedzenia, spróbuj mimo to odgadnąć, lub zwróć zera.\n`;
              }
          } else {
              prompt += `Oceń kaloryczność posiłku wyłącznie na podstawie tego opisu: "${contextText}".\n`;
          }

          prompt += `
Zwróć TYLKO czysty obiekt JSON (bez znaczników markdown \`\`\`json). 
Format:
{
  "food_name": "nazwa potrawy lub suma potraw po polsku",
  "calories": liczba kcal (całkowita suma),
  "protein": liczba białka w gramach (całkowita suma),
  "carbs": liczba węglowodanów w gramach (całkowita suma),
  "fat": liczba tłuszczy w gramach (całkowita suma)
}`;
      }

      const parts = [ { text: prompt } ];
      
      for (const img of imageList) {
          let mimeType = "image/jpeg";
          let base64Data = img;
          if (img.startsWith("data:")) {
              const mimeMatch = img.match(/^data:([^;]+);base64,/);
              if (mimeMatch) mimeType = mimeMatch[1];
              base64Data = img.split(',')[1];
          } else if (img.includes(',')) {
              base64Data = img.split(',')[1];
          }
          parts.push({
              inline_data: {
                  mime_type: mimeType,
                  data: base64Data
              }
          });
      }

      const geminiPayload = {
        contents: [{
          parts: parts
        }]
      };
      // Analiza diety: wymuszamy czysty JSON (bez wstępów i markdownu), czat zostaje tekstowy
      if (action !== "chat") {
        geminiPayload.generationConfig = { responseMimeType: "application/json" };
      }

      // 5. Wywołanie Gemini: model główny, a przy przeciążeniu/limicie model zapasowy (oba darmowe)
      const models = [env.GEMINI_MODEL || DEFAULT_MODEL, env.GEMINI_FALLBACK_MODEL || DEFAULT_FALLBACK_MODEL]
        .filter((m, i, all) => m && all.indexOf(m) === i);
      let rawText = null;
      let usedModel = models[0];
      let lastError = null;
      for (const model of models) {
        usedModel = model;
        try {
          rawText = await callGemini(model, GEMINI_API_KEY, geminiPayload);
          break;
        } catch (err) {
          err.model = model;
          lastError = err;
          if (!(err instanceof UpstreamError) || !FALLBACK_STATUSES.includes(err.status)) throw err;
        }
      }
      if (rawText === null) throw lastError;

      // 6. Odpowiedź do aplikacji
      if (action === "chat") {
          return jsonResponse({ response: rawText.trim() });
      }

      const meal = extractJson(rawText);
      if (!meal) {
        const err = new UpstreamError("Model AI zwrócił odpowiedź bez danych JSON.", 502, { reason: "invalid_output" });
        err.model = usedModel;
        throw err;
      }
      return jsonResponse(meal);

    } catch (err) {
      // Prawdziwy kod HTTP (429/503/…) i szczegóły, żeby aplikacja wiedziała, czy ponawiać
      const status = err instanceof UpstreamError ? err.status : 500;
      return jsonResponse({
        error: err.message,
        status,
        ...(err.model ? { model: err.model } : {}),
        ...(err.extra || {})
      }, status);
    }
  }
};
