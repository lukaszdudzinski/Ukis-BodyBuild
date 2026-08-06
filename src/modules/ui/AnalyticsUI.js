import { DatabaseManager } from '../db/DatabaseManager.js';
import { ShareUtils } from '../../utils/ShareUtils.js';

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
                    <div style="background: rgba(0,0,0,0.3); border: 1px solid ${trendColor}; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <strong style="color: ${trendColor};">${trendIcon} Progres z ostatniej sesji</strong>
                        <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #ccc;">${trendText}</p>
                    </div>
                `;
            }

            // 3. Advanced Analytics (FFMI, WHR, BF%)
            let advancedHtml = '<h4 style="color: #00BFFF; border-bottom: 1px solid rgba(0,191,255,0.2); padding-bottom: 5px; margin-bottom: 15px; margin-top: 25px;">Zaawansowana Analityka</h4>';
            
            if (measurements.length > 0) {
                // sort measurements correctly
                const sortedMeasurements = [...measurements].sort((a, b) => new Date(b.date) - new Date(a.date));
                const last = sortedMeasurements[0];
                const first = sortedMeasurements[sortedMeasurements.length - 1];

                const weight = last.weight;
                const height = last.height;
                const waist = last.waist;
                const neck = last.neck;
                const hips = last.hips;

                let missingForBF = [];
                if (!height) missingForBF.push("Wzrost");
                if (!waist) missingForBF.push("Talia");
                if (!neck) missingForBF.push("Szyja");

                let bf = null;
                let bfHtml = '';
                if (missingForBF.length === 0) {
                    const val = 1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height);
                    bf = (495 / val) - 450;
                    bf = Math.max(2, Math.min(60, bf)); // sanity clamping

                    bfHtml = `
                        <div style="background: rgba(0,0,0,0.5); border: 1px solid #00BFFF; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                            <strong style="color: #00BFFF; font-size: 1.2em;">Szacunkowy BF%</strong>
                            <div style="font-size: 2em; font-weight: bold; margin: 10px 0;">${bf.toFixed(1)} %</div>
                            <p style="margin: 0; font-size: 0.8em; color: #aaa;">Tkanka tłuszczowa (wzór US Navy)</p>
                        </div>
                    `;
                } else {
                    bfHtml = `
                        <div style="background: rgba(255, 68, 68, 0.1); border-left: 4px solid #ff4444; padding: 15px; margin-bottom: 15px; border-radius: 4px;">
                            <strong style="color: #ff4444;">Brak danych do wyliczenia BF%</strong>
                            <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #ddd;">Uzupełnij: ${missingForBF.join(", ")} w zakładce Pomiary Ciała.</p>
                        </div>
                    `;
                }

                let ffmiHtml = '';
                if (bf !== null && weight && height) {
                    const leanMass = weight * (1 - (bf / 100));
                    const heightM = height / 100;
                    let ffmi = leanMass / (heightM * heightM);
                    const normalizedFfmi = ffmi + 6.1 * (1.8 - heightM);

                    ffmiHtml = `
                        <div style="background: rgba(0,0,0,0.5); border: 1px solid #2ECC71; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                            <strong style="color: #2ECC71; font-size: 1.2em;">FFMI (Index Beztłuszczowy)</strong>
                            <div style="font-size: 2em; font-weight: bold; margin: 10px 0;">${normalizedFfmi.toFixed(1)}</div>
                            <p style="margin: 0; font-size: 0.8em; color: #aaa;">Wskaźnik suchej masy mięśniowej</p>
                        </div>
                    `;
                }

                let whrHtml = '';
                if (waist && hips) {
                    const whr = waist / hips;
                    whrHtml = `
                        <div style="background: rgba(0,0,0,0.5); border: 1px solid #9B59B6; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                            <strong style="color: #9B59B6; font-size: 1.2em;">WHR (Talia-Biodra)</strong>
                            <div style="font-size: 2em; font-weight: bold; margin: 10px 0;">${whr.toFixed(2)}</div>
                            <p style="margin: 0; font-size: 0.8em; color: #aaa;">Proporcje sylwetki</p>
                        </div>
                    `;
                } else {
                    whrHtml = `
                        <div style="background: rgba(255, 68, 68, 0.1); border-left: 4px solid #ff4444; padding: 15px; margin-bottom: 15px; border-radius: 4px;">
                            <strong style="color: #ff4444;">Brak danych do wyliczenia WHR</strong>
                            <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #ddd;">Uzupełnij Talię i Biodra, by poznać ten wskaźnik.</p>
                        </div>
                    `;
                }
                
                let trendsHtml = '';
                if (sortedMeasurements.length > 1) {
                    trendsHtml += '<h5 style="color: #00BFFF; margin-top: 15px; margin-bottom: 10px;">Zmiany (od pierwszego wpisu)</h5>';
                    
                    const dict = { weight: 'Waga', chest: 'Klatka', waist: 'Talia', hips: 'Biodra', thigh: 'Udo', biceps: 'Biceps', neck: 'Szyja' };
                    let diffs = '';
                    
                    for (const [key, label] of Object.entries(dict)) {
                        if (last[key] && first[key]) {
                            const v = last[key] - first[key];
                            if (v !== 0) {
                                const sign = v > 0 ? '+' : '';
                                const color = v > 0 ? (key==='waist' ? '#ff4444' : '#2ECC71') : (key==='waist' ? '#2ECC71' : '#ff4444');
                                const arrow = v > 0 ? '↗️' : '↘️';
                                const unit = key === 'weight' ? 'kg' : 'cm';
                                diffs += `<div style="display: flex; justify-content: space-between; margin-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 5px;">
                                            <span>${label}</span>
                                            <strong style="color: ${color};">${arrow} ${sign}${v.toFixed(1)} ${unit}</strong>
                                          </div>`;
                            }
                        }
                    }
                    if(diffs) {
                        trendsHtml += `<div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">${diffs}</div>`;
                    }
                }

                advancedHtml += `<div style="display: flex; flex-direction: column;">${bfHtml}${ffmiHtml}${whrHtml}</div>${trendsHtml}`;
            } else {
                 advancedHtml += '<p style="text-align: center; color: #888;">Dodaj pomiary ciała, aby uzyskać zaawansowaną analitykę (BF%, FFMI, WHR).</p>';
            }

            analyticsContentHtml += advancedHtml;

            // Share Button
            analyticsContentHtml += `
                <div style="text-align: center; margin-top: 25px;">
                    <button onclick="window.AnalyticsUI.shareProgress(${thisMonthWorkouts.length}, ${thisMonthVolume}, ${totalVolume})" class="action-button" style="background-color: #3b5998; border-color: #3b5998; color: white; width: 100%; max-width: 300px;">
                        📤 Udostępnij swój progres
                    </button>
                    <p style="font-size: 0.8em; color: #888; margin-top: 10px;">Pochwal się na Facebooku lub Instagramie!</p>
                </div>
            `;
        }

        html += analyticsContentHtml;
        container.innerHTML = html;
    },

    shareProgress: async (monthWorkouts, monthVolume, totalVolume) => {
        const textToShare = `W tym miesiącu zrobiłem ${monthWorkouts} treningów i przerzuciłem ${monthVolume} kg! 🔥 Buduję formę z Uki's BodyBuild! 💪`;
        
        try {
            // Fetch avatar and nickname from settings
            const settingsStr = localStorage.getItem('uki_bodybuild_settings');
            let avatar = null;
            let nickname = 'BodyBuilder';
            if (settingsStr) {
                const settings = JSON.parse(settingsStr);
                avatar = settings.avatar || null;
                nickname = settings.nickname || 'BodyBuilder';
            }

            const statsList = [
                { label: 'Treningi w tym miesiącu', value: String(monthWorkouts) },
                { label: 'Ciężar przerzucony w miesiącu', value: `${monthVolume} kg`, color: '#00BFFF' },
                { label: 'Całkowita objętość', value: `${totalVolume} kg` }
            ];

            await ShareUtils.generateAndShareImage("Raport Progresu", statsList, avatar, nickname, textToShare);
            
        } catch (error) {
            console.log('Błąd podczas udostępniania:', error);
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(textToShare)
                .then(() => alert("Twój progres został skopiowany do schowka! Możesz go wkleić na Facebooku lub Instagramie."))
                .catch(err => console.error("Błąd kopiowania", err));
        }
    }
};

window.AnalyticsUI = AnalyticsUI;
