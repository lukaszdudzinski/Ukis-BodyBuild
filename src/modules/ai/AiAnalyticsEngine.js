export const AiAnalyticsEngine = {
    generate: async (days, sleepData) => {
        const workerUrl = localStorage.getItem('dietWorkerUrl') || 'https://uki-dieta.lukasz-dudzinski.workers.dev';
        if (!workerUrl) throw new Error("Brak URL do API AI.");

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
        const startStr = startDate.toISOString().split('T')[0];
        const endStr = endDate.toISOString().split('T')[0];

        // Pobierz dane
        const trainings = await window.DatabaseManager.getTrainings();
        const recentTrainings = trainings.filter(t => t.date >= startStr && t.date <= endStr);
        
        const dietLogs = await window.DatabaseManager.getDietLogsByDateRange(startStr, endStr);
        const measurements = await window.DatabaseManager.getMeasurements();
        const latestMeasurement = measurements.length > 0 ? measurements[measurements.length - 1] : null;

        // Pobierz ustawienia (cel treningowy)
        let cel = "Brak ustalonego celu. Poinformuj użytkownika, by uzupełnił cel (masa/redukcja/utrzymanie) w ustawieniach.";
        try {
            const setStr = localStorage.getItem('uki_bodybuild_settings');
            if (setStr) {
                const settings = JSON.parse(setStr);
                if (settings.goal) cel = settings.goal;
            }
        } catch(e) {}

        // Pobierz historię analiz do kontekstu trendu (ostatnie 4)
        const pastAnalyses = await window.DatabaseManager.getAiAnalyses();
        const recentAnalyses = pastAnalyses.slice(0, 4);

        // Złóż prompt
        const userData = {
            okres_dni: days,
            cel_treningowy_uzytkownika: cel,
            sredni_sen_godziny: sleepData !== null && sleepData !== undefined
                ? sleepData
                : 'BRAK DANYCH — poinformuj użytkownika wprost, że do pełnej analizy regeneracji musi zacząć wpisywać dane o śnie.',
            treningi: recentTrainings.map(t => ({
                data: t.date,
                nazwa: t.name,
                czas_sekundy: t.duration_seconds,
                cwiczenia: t.exercises.map(e => ({
                    nazwa: e.name,
                    serie: e.sets ? e.sets.map(s => `${s.weight}kg x ${s.reps}`) : [],
                    dropsety: e.sets ? e.sets.filter(s => s.type === 'dropset').length : 0
                }))
            })),
            dieta_logs_kalorie_suma: dietLogs.reduce((sum, log) => sum + (log.calories || 0), 0),
            dieta_braki: dietLogs.length === 0 ? 'BRAK DANYCH - upomnij o konieczności logowania posiłków!' : 'Zarejestrowano posiłki.',
            pomiary_historia: measurements.slice(-5) // ostatnie 5 pomiarów do weryfikacji trendu (waga, obwody)
        };

        const systemPrompt = `Jesteś wirtualnym trenerem personalnym i ekspertem ds. fizjologii, kulturystyki i dietetyki o imieniu Trener Edward z aplikacji premium Uki's BodyBuild.
Oczekuje się od Ciebie wyczerpującej, głębokiej i merytorycznej analizy z prawdziwego zdarzenia. Płacę za to, więc nie spłycaj analizy. Bądź merytoryczny, profesjonalny i analityczny. To ma być gruba analiza dająca konkretne zalecenia i badająca trendy.

Oto dane użytkownika z ostatnich ${days} dni w formacie JSON:
${JSON.stringify(userData, null, 2)}

Jeśli użytkownik miał poprzednie analizy (historia z ostatnich tygodni), oto ich streszczenie (musisz do nich nawiązać, by pokazać czy idziemy w dobrym kierunku!):
${recentAnalyses.map(a => `Data: ${a.date}, Konkluzja: ${a.content.substring(0, 200)}...`).join('\n')}

Twoja analiza w formacie Markdown MUSI pokrywać dokładnie te punkty (bez pomijania!):
1. **Analiza Objętości i Tonażu**: Czy objętość i ciężary są optymalne? Czy grozi przetrenowanie? 
2. **Poprawność Splitu / FBW**: Zbadaj jak łączone są partie mięśniowe w poszczególne dni.
3. **Regeneracja (Odstępy i Sen) oraz Nawodnienie**: Analiza odstępów między treningami.
4. **Odżywianie vs Cel (${cel})**: 
   - Przeanalizuj zarejestrowane kalorie. Czy w kontekście wybranego Celu zjada za mało, czy za dużo? 
   - Jeśli brakuje danych żywieniowych - musisz wyraźnie zaznaczyć, że do pełnej analizy musi to uzupełnić!
5. **Analiza Pomiarów Ciała w czasie (Trend)**: 
   - Spójrz na sekcję "pomiary_historia" (ostatnie 5 wpisów).
   - Jeśli buduje masę: czy waga i obwody rosną? Jeśli redukuje: czy waga i obwody spadają? Jakie konkretnie kroki podjąć (np. uciąć kalorie, dołożyć trening)? Zwróć uwagę na wahania.
6. **Analiza Długoterminowa (Kierunek)**: Porównaj obecny tydzień do poprzednich analiz (jeśli są). Czy idziemy w dobrą stronę?
7. **Podsumowanie i Motywacja**: Zwieńcz profesjonalnym akcentem i wyznacz wektor działania na kolejny tydzień.`;

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
        return data.response || "Błąd generowania.";
    }
};

window.AiAnalyticsEngine = AiAnalyticsEngine;
