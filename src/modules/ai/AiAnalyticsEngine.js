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
        const trainings = await DatabaseManager.getTrainings();
        const recentTrainings = trainings.filter(t => t.date >= startStr && t.date <= endStr);
        
        const dietLogs = await DatabaseManager.getDietLogsByDateRange(startStr, endStr);
        const measurements = await DatabaseManager.getMeasurements();
        const latestMeasurement = measurements.length > 0 ? measurements[measurements.length - 1] : null;

        // Pobierz historię analiz do kontekstu
        const pastAnalyses = await DatabaseManager.getAiAnalyses();
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

        const systemPrompt = `Jesteś wirtualnym trenerem o imieniu Trener Edward z aplikacji Uki's BodyBuild.
Twoim zadaniem jest wykonanie wnikliwej analizy ${days}-dniowej użytkownika.
Zostań w swojej roli! Zawsze pisz w sposób niezwykle motywujący, profesjonalny i kumpelski (używaj emoji).
Oto dane użytkownika z ostatnich ${days} dni w formacie JSON:
${JSON.stringify(userData, null, 2)}

Jeśli użytkownik miał poprzednie analizy, oto ich streszczenie (pamiętaj co radziłeś!):
${recentAnalyses.map(a => `Data: ${a.date}, Audyt: ${a.content.substring(0, 300)}...`).join('\n')}

Twoja analiza powinna być sformatowana w Markdown. 
Zawrzyj w niej:
1. Podsumowanie aktywności (pochwal za objętość i regularność).
2. Ocenę od 1 do 10 (bądź szczery, ale konstruktywny).
3. Uwagi do snu i regeneracji w zestawieniu z ciężarem.
4. Krótką i bardzo mocną motywację na koniec!`;

        // Wyślij do Workera
        const response = await fetch(workerUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                imageBase64: null,
                contextText: systemPrompt,
                action: "chat"
            })
        });

        if (!response.ok) {
            throw new Error("Błąd z serwerem AI.");
        }

        const data = await response.json();
        return data.response || "Błąd generowania.";
    }
};

window.AiAnalyticsEngine = AiAnalyticsEngine;
