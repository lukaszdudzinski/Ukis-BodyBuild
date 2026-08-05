import { DatabaseManager } from '../db/DatabaseManager.js';

export const AnalyticsUI = {
    init: () => {
        document.addEventListener('tabChanged', (e) => {
            if(e.detail && e.detail.tab === 'analytics-dashboard') {
                AnalyticsUI.loadAnalytics();
            }
        });
    },

    loadAnalytics: async () => {
        const container = document.getElementById('analytics-content');
        if (!container) return;
        
        container.innerHTML = '<p style="text-align: center; color: #aaa;">Ładowanie danych...</p>';

        try {
            const trainings = await DatabaseManager.getTrainings();
            const measurements = await DatabaseManager.getMeasurements();
            
            AnalyticsUI.renderAnalytics(container, trainings, measurements);
        } catch (err) {
            console.error("Error loading analytics:", err);
            container.innerHTML = '<p style="text-align: center; color: #ff4444;">Błąd ładowania statystyk.</p>';
        }
    },

    renderAnalytics: (container, trainings, measurements) => {
        let html = '';

        // 1. Measurement Reminder Logic
        let measurementReminderHtml = '';
        if (measurements.length === 0) {
            measurementReminderHtml = `
                <div style="background: rgba(255, 165, 0, 0.1); border-left: 4px solid orange; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                    <strong style="color: orange;">Brak pomiarów ciała!</strong>
                    <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #ddd;">Aby śledzić swój progres sylwetkowy, przejdź do zakładki "Pomiary Ciała" i dodaj pierwszy wpis.</p>
                </div>
            `;
        } else {
            // Check if older than 30 days
            measurements.sort((a, b) => new Date(b.date) - new Date(a.date));
            const lastMeasurement = measurements[0];
            const daysSinceMeasurement = Math.floor((new Date() - new Date(lastMeasurement.date)) / (1000 * 60 * 60 * 24));
            
            if (daysSinceMeasurement > 30) {
                measurementReminderHtml = `
                    <div style="background: rgba(255, 68, 68, 0.1); border-left: 4px solid #ff4444; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                        <strong style="color: #ff4444;">Czas na pomiary! 📏</strong>
                        <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #ddd;">Minęło ${daysSinceMeasurement} dni od Twojego ostatniego wpisu (z dnia ${lastMeasurement.date}). Wejdź w "Pomiary Ciała" i zaktualizuj swoje wymiary!</p>
                    </div>
                `;
            } else {
                measurementReminderHtml = `
                    <div style="background: rgba(0, 191, 255, 0.1); border-left: 4px solid #00BFFF; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                        <strong style="color: #00BFFF;">Pomiary pod kontrolą ✅</strong>
                        <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #ddd;">Ostatni pomiar robiłeś ${daysSinceMeasurement} dni temu. Trzymaj tak dalej!</p>
                    </div>
                `;
            }
        }
        
        html += measurementReminderHtml;

        // 2. Volume & Intensity Analytics
        let analyticsContentHtml = '';
        if (trainings.length === 0) {
            analyticsContentHtml = '<p style="text-align: center; color: #888;">Za mało danych treningowych do przeprowadzenia analizy.</p>';
        } else {
            let totalVolume = 0;
            let totalWorkouts = trainings.length;
            
            // Calculate total volume for each training
            const workoutsWithVolume = trainings.map(t => {
                const vol = t.exercises.reduce((sum, ex) => {
                    return sum + ex.sets.reduce((sSum, set) => sSum + (set.weight * set.reps), 0);
                }, 0);
                return { date: new Date(t.date), volume: vol };
            });

            // Sort by date descending
            workoutsWithVolume.sort((a, b) => b.date - a.date);
            
            workoutsWithVolume.forEach(w => totalVolume += w.volume);

            const thisMonth = new Date().getMonth();
            const thisYear = new Date().getFullYear();
            
            const thisMonthWorkouts = workoutsWithVolume.filter(w => w.date.getMonth() === thisMonth && w.date.getFullYear() === thisYear);
            
            let thisMonthVolume = 0;
            thisMonthWorkouts.forEach(w => thisMonthVolume += w.volume);

            analyticsContentHtml = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
                    <div style="background: rgba(0,0,0,0.5); border: 1px solid #00BFFF; padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 2em; color: #00BFFF; font-weight: bold; margin-bottom: 5px;">${totalWorkouts}</div>
                        <div style="font-size: 0.8em; color: #aaa; text-transform: uppercase;">Wszystkich Treningów</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.5); border: 1px solid #00BFFF; padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5em; color: #00BFFF; font-weight: bold; margin-bottom: 5px;">${totalVolume} kg</div>
                        <div style="font-size: 0.8em; color: #aaa; text-transform: uppercase;">Przerzucony Ciężar</div>
                    </div>
                </div>
                
                <h4 style="color: #00BFFF; border-bottom: 1px solid rgba(0,191,255,0.2); padding-bottom: 5px; margin-bottom: 15px;">Aktywność w tym miesiącu</h4>
                
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 0 0 10px 0; font-size: 1.1em; color: #fff;">Zrobiłeś <strong>${thisMonthWorkouts.length}</strong> treningów, podnosząc łącznie <strong>${thisMonthVolume} kg</strong>!</p>
                    ${thisMonthVolume > 10000 
                        ? '<p style="color: #2ECC71; margin: 0; font-weight: bold;">🔥 Jesteś prawdziwą bestią! Świetna robota!</p>' 
                        : '<p style="color: #00BFFF; margin: 0;">💪 Każdy kilogram przybliża Cię do celu. Nie przestawaj!</p>'}
                </div>
            `;
            
            // Highlight of recent progress (simplistic comparison of last 2 workouts)
            if (workoutsWithVolume.length >= 2) {
                const diff = workoutsWithVolume[0].volume - workoutsWithVolume[1].volume;
                const trendIcon = diff > 0 ? '📈' : (diff < 0 ? '📉' : '➖');
                const trendColor = diff > 0 ? '#2ECC71' : (diff < 0 ? '#ff4444' : '#aaa');
                const trendText = diff > 0 ? `Zwiększyłeś objętość o ${Math.abs(diff)} kg w porównaniu do poprzedniej sesji! Rewelacja!` : `Odpocznij jeśli trzeba. Ważna jest technika!`;
                
                analyticsContentHtml += `
                    <div style="background: rgba(0,0,0,0.3); border: 1px solid ${trendColor}; padding: 15px; border-radius: 8px;">
                        <strong style="color: ${trendColor};">${trendIcon} Progres z ostatniej sesji</strong>
                        <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #ccc;">${trendText}</p>
                    </div>
                `;
            }
        }

        html += analyticsContentHtml;
        container.innerHTML = html;
    }
};

window.AnalyticsUI = AnalyticsUI;
