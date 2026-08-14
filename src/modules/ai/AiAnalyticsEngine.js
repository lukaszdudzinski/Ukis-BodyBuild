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

        // Pobierz historię analiz do kontekstu
        const pastAnalyses = await window.DatabaseManager.getAiAnalyses();
        const recentAnalyses = pastAnalyses.slice(0, 2);

        // Złóż prompt
        const userData = {
            okres_dni: days,
            sredni_sen_godziny: sleepData !== null && sleepData !== undefined
                ? sleepData
                : 'BRAK DANYCH — użytkownik nie podał danych o śnie. Poinformuj go w raporcie że analiza regeneracji jest niepełna i poproś o podanie snu przy następnej analizie.',
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
            pomiary: latestMeasurement ? { waga: latestMeasurement.weight, bf: latestMeasurement.bf || 'brak' } : 'brak'
        };

        const systemPrompt = `Jesteś wirtualnym trenerem personalnym i ekspertem ds. fizjologii o imieniu Trener Edward z aplikacji Uki's BodyBuild.
Twoim zadaniem jest wykonanie profesjonalnej, wnikliwej i merytorycznej analizy ${days}-dniowej użytkownika.
Zrezygnuj z przesadnego humoru na rzecz twardych faktów i naukowego podejścia, zachowując jednak szacunek i motywacyjny, kumpelski ton trenera.
Oto dane użytkownika z ostatnich ${days} dni w formacie JSON:
${JSON.stringify(userData, null, 2)}

Jeśli użytkownik miał poprzednie analizy, oto ich streszczenie (pamiętaj co radziłeś!):
${recentAnalyses.map(a => `Data: ${a.date}, Audyt: ${a.content.substring(0, 300)}...`).join('\n')}

Twoja analiza powinna być sformatowana w Markdown i koncentrować się na merytoryce:
1. **Analiza Objętości i Tonażu**: Czy objętość (liczba serii na poszczególne partie) i tonaż (przerzucony ciężar) są optymalne? Czy nie ma ryzyka przetrenowania?
2. **Ocena Podziału Treningowego (Split)**: Czy dobór ćwiczeń i partii mięśniowych w poszczególne dni miał logiczny sens? Co poprawić?
3. **Regeneracja i Nawodnienie**: Przeanalizuj sen i dni wolne w stosunku do intensywności treningów. Zwróć uwagę na znaczenie nawodnienia przy takim wysiłku.
4. **Merytoryczne Wnioski na Przyszłość**: Zwieńcz analizę oceną (1-10) opartą o fakty oraz konkretną radą treningową na nadchodzące dni.`;

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
