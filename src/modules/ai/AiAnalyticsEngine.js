export const AiAnalyticsEngine = {
    generate: async (days, params = {}) => {
        const workerUrl = localStorage.getItem('dietWorkerUrl') || 'https://uki-dieta.lukasz-dudzinski.workers.dev';
        if (!workerUrl) throw new Error("Brak URL do API AI.");

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
        const startStr = startDate.toISOString().split('T')[0];
        const endStr = endDate.toISOString().split('T')[0];

        // Pobierz dane
        const trainings = await window.DatabaseManager.getTrainings();
        const recentTrainings = (trainings || []).filter(t => t.date >= startStr && t.date <= endStr);
        
        let dietLogs = [];
        try {
            dietLogs = await window.DatabaseManager.getDietLogsByDateRange(startStr, endStr);
        } catch(e) {
            console.warn("Błąd pobierania diet logs:", e);
        }

        const measurements = await window.DatabaseManager.getMeasurements();

        let cel = params.goal || localStorage.getItem('dietGoal') || "Budowa masy mięśniowej";
        let staz = params.experience || localStorage.getItem('trainingExperience') || "1-3 lata (Średniozaawansowany)";
        let sleepData = params.sleepHours;

        // Podsumowanie makroskładników
        let totalKcal = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;

        const detailedMeals = (dietLogs || []).map(l => {
            totalKcal += (l.calories || 0);
            totalProtein += (l.protein || 0);
            totalCarbs += (l.carbs || 0);
            totalFat += (l.fat || 0);
            return {
                data: l.date,
                posilek: l.food_name || 'Posiłek',
                typ: l.meal_type || 'Inne',
                kalorie_kcal: l.calories || 0,
                bialko_g: l.protein || 0,
                weglowodany_g: l.carbs || 0,
                tluszcz_g: l.fat || 0
            };
        });

        const activeDaysCount = Math.max(1, days);
        const dietSummary = {
            liczba_zalogowanych_posilkow: dietLogs.length,
            suma_kalorie_kcal: totalKcal,
            srednia_dzienna_kalorie_kcal: Math.round(totalKcal / activeDaysCount),
            suma_bialko_g: Math.round(totalProtein),
            srednia_dzienna_bialko_g: Math.round(totalProtein / activeDaysCount),
            suma_weglowodany_g: Math.round(totalCarbs),
            srednia_dzienna_weglowodany_g: Math.round(totalCarbs / activeDaysCount),
            suma_tluszcz_g: Math.round(totalFat),
            srednia_dzienna_tluszcz_g: Math.round(totalFat / activeDaysCount),
            posilki_szczegoly: detailedMeals
        };

        // Pobierz szablony planów
        let plans = "Brak utworzonych planów.";
        try {
            const tStr = localStorage.getItem('uki_workout_templates');
            if (tStr) {
                const tObj = JSON.parse(tStr);
                if (Array.isArray(tObj) && tObj.length > 0) {
                    plans = tObj.map(p => p.name).join(', ');
                }
            }
        } catch(e) {}

        // Pobierz historię analiz do kontekstu trendu (ostatnie 4)
        const pastAnalyses = await window.DatabaseManager.getAiAnalyses();
        const recentAnalyses = (pastAnalyses || []).slice(0, 4);

        // Złóż prompt
        const userData = {
            okres_dni: days,
            cel_treningowy_uzytkownika: cel,
            staz_treningowy: staz,
            zapisane_plany_treningowe: plans,
            sredni_sen_godziny: sleepData !== null && sleepData !== undefined
                ? `${sleepData} godz. na dobę`
                : 'BRAK DANYCH — poinformuj użytkownika wprost, że do pełnej analizy regeneracji musi wpisywać dane o śnie.',
            treningi: recentTrainings.map(t => ({
                data: t.date,
                nazwa: t.name || 'Trening',
                czas_sekundy: t.duration_seconds || 0,
                cwiczenia: (t.exercises || []).map(e => ({
                    nazwa: e.name || 'Ćwiczenie',
                    serie: e.sets ? e.sets.map(s => `${s.weight || 0}kg x ${s.reps || 0}`) : [],
                    dropsety: e.sets ? e.sets.filter(s => s.type === 'dropset' || s.isDropset).length : 0
                }))
            })),
            pelne_dane_diety_makroskladniki: dietSummary,
            pomiary_historia: (measurements || []).slice(-5) // ostatnie 5 pomiarów do weryfikacji trendu (waga, obwody)
        };

        const systemPrompt = `Jesteś wirtualnym trenerem personalnym i ekspertem ds. fizjologii, kulturystyki i dietetyki o imieniu Trener Edward z aplikacji premium Uki's BodyBuild.
Oczekuje się od Ciebie wyczerpującej, głębokiej i merytorycznej analizy z prawdziwego zdarzenia. Płacę za to, więc nie spłycaj analizy. Bądź merytoryczny, profesjonalny i analityczny. To ma być potężna analiza dająca konkretne zalecenia i badająca trendy.

Oto pełne dane użytkownika z ostatnich ${days} dni w formacie JSON (w tym dokładne rozbicie posiłków, białka, węgli, tłuszczy, stażu i regeneracji):
${JSON.stringify(userData, null, 2)}

Jeśli użytkownik miał poprzednie analizy (historia z ostatnich tygodni), oto ich streszczenie (musisz do nich nawiązać, by pokazać czy idziemy w dobrym kierunku!):
${recentAnalyses.map(a => `Data: ${a.date}, Konkluzja: ${a.content.substring(0, 200)}...`).join('\n')}

Twoja analiza w formacie Markdown MUSI pokrywać dokładnie te punkty (bez pomijania!):
1. **Analiza Objętości i Tonażu**: Czy objętość i ciężary są optymalne pod staż (${staz})? Czy grozi przetrenowanie?
2. **Poprawność Splitu / Doboru Ćwiczeń**: Zbadaj jak łączone są partie mięśniowe w poszczególne dni.
3. **Regeneracja (Odstępy i Sen) oraz Nawodnienie**: Analiza odstępów między treningami i snu (${userData.sredni_sen_godziny}).
4. **Odżywianie i Pełne Makroskładniki vs Cel (${cel})**: 
   - Dokładnie przeanalizuj zarejestrowane kalorie oraz BIAŁKO, WĘGLOWODANY i TŁUSZCZE (średnie dzienne: ${dietSummary.srednia_dzienna_kalorie_kcal} kcal, B: ${dietSummary.srednia_dzienna_bialko_g}g, W: ${dietSummary.srednia_dzienna_weglowodany_g}g, T: ${dietSummary.srednia_dzienna_tluszcz_g}g). 
   - Skomentuj ilość białka na kg masy ciała i proporcje makroskładników w kontekście celu (${cel}).
   - Jeśli liczba zalogowanych posiłków jest niska (${dietSummary.liczba_zalogowanych_posilkow}) - zaznacz to i zmotywuj do regularnego logowania!
5. **Analiza Pomiarów Ciała w czasie (Trend)**: 
   - Spójrz na sekcję "pomiary_historia" (ostatnie 5 wpisów).
   - Jeśli buduje masę: czy waga i obwody rosną? Jeśli redukuje: czy waga i obwody spadają? Jakie konkretnie kroki podjąć? Zwróć uwagę na wahania.
6. **Analiza Długoterminowa (Kierunek)**: Porównaj obecny okres do poprzednich analiz. Czy idziemy w dobrą stronę?
7. **Podsumowanie i Gotowy Plan Treningowy**: 
   - Podsumuj kluczowe wnioski.
   - Na samym końcu analizy ZAWSZE przygotuj sekcję:
### 📋 Proponowany Plan Treningowy od Edwarda
Zaproponuj konkretną jednostkę treningową w czytelnej liście:
- [Nazwa ćwiczenia] - [Liczba serii] serii x [Liczba powtórzeń] powtórzeń (np. 4 serie x 10-12 powtórzeń, ciężar startowy X kg).`;

        // Wyślij do Workera
        const response = await fetch(workerUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                images: [],
                imageBase64: null,
                contextText: systemPrompt,
                action: "chat"
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            if (errText.includes("exceeded your current quota") || errText.includes("Quota exceeded") || response.status === 429) {
                throw new Error("Darmowy limit zapytań AI został wyczerpany na dziś. Wróć i spróbuj ponownie jutro!");
            }
            throw new Error(`Cloudflare: ${errText}`);
        }

        const data = await response.json();
        const respText = data.response || data.error || "";
        
        if (respText && (respText.includes("exceeded your current quota") || respText.includes("Quota exceeded"))) {
            throw new Error("Darmowy limit zapytań AI został wyczerpany na dziś. Wróć i spróbuj ponownie jutro!");
        }
        
        return data.response || "Błąd generowania.";
    }
};

window.AiAnalyticsEngine = AiAnalyticsEngine;
