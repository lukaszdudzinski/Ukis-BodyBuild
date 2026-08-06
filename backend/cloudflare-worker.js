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
 */

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

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    try {
      // 2. Pobieramy zdjęcie wysłane z naszej aplikacji oraz opcjonalny kontekst
      const { imageBase64, contextText } = await request.json();

      if (!imageBase64) {
        return new Response(JSON.stringify({ error: "Brak zdjęcia" }), { status: 400, headers: corsHeaders });
      }

      // 3. Sprawdzamy czy dodałeś klucz GEMINI w Cloudflare Secrets
      const GEMINI_API_KEY = env.GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        return new Response(JSON.stringify({ error: "Brak skonfigurowanego klucza Gemini na serwerze Cloudflare!" }), { status: 500, headers: corsHeaders });
      }

      // 4. Budujemy zapytanie do Google Gemini Pro Vision
      let prompt = `Przeanalizuj to zdjęcie posiłku. `;
      
      if (contextText && contextText.trim().length > 0) {
        prompt += `\nUżytkownik dostarczył dodatkowy kontekst / opis słowny posiłku: "${contextText}". Weź to pod uwagę (szczególnie przy nazwie i składnikach których nie widać).\n`;
      }

      prompt += `
Zwróć TYLKO czysty obiekt JSON (bez znaczników markdown \`\`\`json). 
Format:
{
  "food_name": "nazwa potrawy po polsku",
  "calories": liczba kcal (całkowita),
  "protein": liczba białka w gramach,
  "carbs": liczba węglowodanów w gramach,
  "fat": liczba tłuszczy w gramach
}`;

      // Zaktualizowano model do najnowszego gemini-3.6-flash (Sierpień 2026)
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const geminiPayload = {
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64.split(',')[1] // Usuwamy "data:image/jpeg;base64," jeśli jest
              }
            }
          ]
        }]
      };

      const geminiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiPayload)
      });

      const geminiData = await geminiResponse.json();

      if (!geminiResponse.ok) {
        throw new Error(`Google API Błąd: ${geminiData.error?.message || geminiResponse.statusText}`);
      }

      // 5. Ekstrakcja danych i odpowiedź do aplikacji
      if (!geminiData.candidates || geminiData.candidates.length === 0) {
        throw new Error("Google API nie zwróciło żadnych danych (prawdopodobnie zdjęcie naruszyło filtry bezpieczeństwa).");
      }

      const rawText = geminiData.candidates[0].content.parts[0].text;
      
      // Czasem Gemini zwraca z markdownem, usuwamy go
      const cleanJsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      return new Response(cleanJsonStr, { 
        headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
        } 
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
  }
};
