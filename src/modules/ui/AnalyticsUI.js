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
            // Check if older than configured days
            const reminderDaysStr = localStorage.getItem('uki-bodybuild-reminder') || '30';
            const reminderDays = parseInt(reminderDaysStr, 10);
            
            if (reminderDays > 0) {
                measurements.sort((a, b) => new Date(b.date) - new Date(a.date));
                const lastMeasurement = measurements[0];
                const daysSinceMeasurement = Math.floor((new Date() - new Date(lastMeasurement.date)) / (1000 * 60 * 60 * 24));
                
                if (daysSinceMeasurement >= reminderDays) {
                    measurementReminderHtml = `
                        <div style="background: rgba(255, 68, 68, 0.1); border-left: 4px solid #ff4444; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                            <strong style="color: #ff4444;">Czas na pomiary! 📏</strong>
                            <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #ddd;">Minęło ${daysSinceMeasurement} dni od Twojego ostatniego wpisu. Wejdź w "Pomiary Ciała" i zaktualizuj swoje wymiary!</p>
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
        }
        
        html += measurementReminderHtml;

        // 2. Volume, Cardio & Intensity Analytics
        let analyticsContentHtml = "";
        
        let totalVolume = 0;
        let totalWorkouts = trainings.length;
        let thisMonthWorkouts = [];
        let thisMonthVolume = 0;
        let totalCalories = 0;
        let cardioCount = 0;
        let classesCount = 0;
        let strengthCount = 0;

        if (trainings.length === 0) {
            analyticsContentHtml = "<p style=\"text-align: center; color: #888;\">Za mało danych treningowych do przeprowadzenia analizy.</p>";
        } else {
            // Calculate total volume and smartwatch metrics for each training
            const workoutsWithVolume = trainings.map(t => {
                let vol = 0;
                let volBody = 0;
                let volMachine = 0;

                const exercises = t.exercises || [];
                exercises.forEach(ex => {
                    const exName = ex.name ? ex.name.toLowerCase() : "";
                    const isBodyweight65 = exName.includes("pompk");
                    const isBodyweight100 = exName.includes("podciąg") || exName.includes("drąż") || exName.includes("brzuszk") || exName.includes("wspięcia");
                    
                    if (ex.sets) {
                        ex.sets.forEach(set => {
                            let weightForVolume = (set.weight !== undefined && set.weight !== null) ? Number(set.weight) : 0;
                            if (isBodyweight65) {
                                weightForVolume += (measurements.length > 0 ? (measurements[0].weight * 0.65) : 0);
                            } else if (isBodyweight100) {
                                weightForVolume += (measurements.length > 0 ? measurements[0].weight : 0);
                            }
                            
                            const setTonnage = weightForVolume * (set.reps ? Number(set.reps) : 0);
                            vol += setTonnage;
                            if (isBodyweight65 || isBodyweight100) {
                                volBody += setTonnage;
                            } else {
                                volMachine += setTonnage;
                            }
                        });
                    }
                });

                const sw = t.smartwatch || {};
                const calories = sw.calories ? Number(sw.calories) : 0;
                const hr = sw.hr ? Number(sw.hr) : null;
                const type = t.type || (vol > 0 ? "strength" : (calories > 0 ? "classes" : "strength"));
                const durationMinutes = t.duration_seconds ? Math.round(t.duration_seconds / 60) : null;

                return { 
                    id: t.id,
                    name: t.name || "",
                    date: new Date(t.date), 
                    volume: vol, 
                    volBody, 
                    volMachine, 
                    type,
                    calories, 
                    hr, 
                    durationMinutes,
                    duration_seconds: t.duration_seconds || 0
                };
            });

            // Sort by date descending
            workoutsWithVolume.sort((a, b) => b.date - a.date);
            
            let totalVolBody = 0;
            let totalVolMachine = 0;

            workoutsWithVolume.forEach(w => {
                totalVolume += w.volume;
                totalVolBody += w.volBody;
                totalVolMachine += w.volMachine;
                if (w.calories > 0) totalCalories += w.calories;
                if (w.type === "cardio") cardioCount++;
                else if (w.type === "classes") classesCount++;
                else strengthCount++;
            });

            const thisMonth = new Date().getMonth();
            const thisYear = new Date().getFullYear();
            
            thisMonthWorkouts = workoutsWithVolume.filter(w => w.date.getMonth() === thisMonth && w.date.getFullYear() === thisYear);
            thisMonthWorkouts.forEach(w => thisMonthVolume += w.volume);

            const maxStrengthVol = Math.max(...workoutsWithVolume.filter(w => w.type === "strength" || w.volume > 0).map(wo => wo.volume), 1);
            const maxCardioCalories = Math.max(...workoutsWithVolume.filter(w => w.type === "cardio" || w.type === "classes" || w.volume === 0).map(wo => wo.calories), 1);

            analyticsContentHtml = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 25px;">
                    <div style="background: rgba(0,0,0,0.5); border: 1px solid #00BFFF; padding: 12px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.8em; color: #00BFFF; font-weight: bold; margin-bottom: 3px;">${totalWorkouts}</div>
                        <div style="font-size: 0.75em; color: #aaa; text-transform: uppercase;">Wszystkich Treningów</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.5); border: 1px solid #FF9800; padding: 12px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.8em; color: #FF9800; font-weight: bold; margin-bottom: 3px;">${totalCalories > 0 ? totalCalories.toLocaleString("pl-PL") : "0"} <span style="font-size: 0.6em;">kcal</span></div>
                        <div style="font-size: 0.75em; color: #aaa; text-transform: uppercase;">Spalone (Smartwatch)</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.5); border: 1px solid #E91E63; padding: 12px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.4em; color: #E91E63; font-weight: bold; margin-bottom: 3px;">${Math.round(totalVolMachine)} kg</div>
                        <div style="font-size: 0.7em; color: #aaa; text-transform: uppercase;">Tonaż Żelastwa</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.5); border: 1px solid #2ECC71; padding: 12px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.4em; color: #2ECC71; font-weight: bold; margin-bottom: 3px;">${Math.round(totalVolBody)} kg</div>
                        <div style="font-size: 0.7em; color: #aaa; text-transform: uppercase;">Tonaż Ciała <span style="cursor:help;" title="Liczone automatycznie na podstawie wagi użytkownika">ℹ️</span></div>
                    </div>
                </div>
                
                <h4 style="color: #00BFFF; border-bottom: 1px solid rgba(0,191,255,0.2); padding-bottom: 5px; margin-bottom: 15px;">Zaawansowana Analityka (PRO)</h4>
                
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 0 0 10px 0; font-size: 1.05em; color: #fff;">W tym miesiącu: <strong>${thisMonthWorkouts.length}</strong> aktywności, w tym <strong>${thisMonthVolume > 0 ? (thisMonthVolume >= 1000 ? (thisMonthVolume/1000).toFixed(1) + " t" : thisMonthVolume + " kg") : "0 kg"}</strong> tonażu siłowego!</p>
                    ${thisMonthWorkouts.length >= 8 
                        ? '<p style="color: #2ECC71; margin: 0; font-weight: bold;">🔥 Konsekwencja mistrza! Świetna robota!</p>' 
                        : '<p style="color: #00BFFF; margin: 0;">💪 Każda sesja przybliża Cię do życiowej formy. Nie przestawaj!</p>'}
                </div>
                
                <h5 style="color: #FFD700; margin-top: 15px; margin-bottom: 5px;">📈 Ostatnie 10 sesji treningowych (Wykres Hybrydowy)</h5>
                <p style="font-size: 0.8em; color: #aaa; margin: 0 0 12px 0;">Pasek pokazuje zaangażowanie sesji (Zielony/Żółty = Tonaż siłowy, Ognisty = Zajęcia zorganizowane / Hyrox, Niebieski = Cardio).</p>
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 25px;">
                    ${workoutsWithVolume.slice(0,10).reverse().map(w => {
                        const dateStr = new Date(w.date).toLocaleDateString('pl-PL', {weekday:'short', day:'numeric', month:'short'});
                        const isCardioOrClasses = (w.type === "cardio" || w.type === "classes") || (w.volume === 0 && (w.calories > 0 || w.duration_seconds > 0));
                        
                        let barPct = 10;
                        let barColor = "#FF9800";
                        let displayVal = "";
                        let typeBadge = "";

                        if (isCardioOrClasses) {
                            const isClasses = w.type === "classes" || (!w.type && w.volume === 0);
                            typeBadge = isClasses ? "🔥 Zajęcia" : "🏃 Cardio";
                            barColor = isClasses ? "#FF5722" : "#00BFFF";
                            
                            const calVal = w.calories > 0 ? w.calories : (w.durationMinutes ? w.durationMinutes * 7 : 200);
                            barPct = Math.min(100, Math.max(15, Math.round((calVal / Math.max(maxCardioCalories, 500)) * 100)));
                            
                            if (w.calories > 0) {
                                displayVal = `${w.calories} kcal`;
                            } else if (w.durationMinutes) {
                                displayVal = `⏱️ ${w.durationMinutes} min`;
                            } else {
                                displayVal = `Aktywność`;
                            }
                            
                            if (w.hr) {
                                displayVal += ` <span style="font-size: 0.85em; opacity: 0.85;">(💓${w.hr})</span>`;
                            }
                        } else {
                            typeBadge = "🏋️ Siła";
                            barPct = Math.min(100, Math.max(8, Math.round((w.volume / maxStrengthVol) * 100)));
                            barColor = barPct >= 80 ? "#2ECC71" : (barPct >= 50 ? "#FFD700" : "#FF9800");
                            
                            const volStr = w.volume >= 1000 ? (w.volume/1000).toFixed(1) + " t" : Math.round(w.volume) + " kg";
                            displayVal = volStr;
                            if (w.calories > 0) {
                                displayVal += ` <span style="font-size: 0.8em; opacity: 0.85;">(🔥${w.calories})</span>`;
                            }
                        }

                        const workoutNameDisplay = w.name ? `<span style="color: #888; font-size: 0.8em; margin-left: 6px;">${w.name}</span>` : "";

                        return '<div style="background: rgba(255,255,255,0.04); border-radius: 6px; padding: 8px 12px; border-left: 3px solid ' + barColor + ';">'
                            + '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">'
                            + '<span style="font-size: 0.85em; color: #ccc;">' + dateStr + ' <span style="font-size: 0.8em; color: #aaa; background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; margin-left: 4px;">' + typeBadge + '</span>' + workoutNameDisplay + '</span>'
                            + '<span style="font-size: 0.85em; color: ' + barColor + '; font-weight: bold;">' + displayVal + '</span>'
                            + '</div>'
                            + '<div style="background: rgba(255,255,255,0.08); border-radius: 3px; height: 6px; overflow: hidden;">'
                            + '<div style="height: 100%; width: ' + barPct + '%; background: ' + barColor + '; border-radius: 3px; transition: width 0.6s ease;"></div>'
                            + '</div>'
                            + '</div>';
                    }).join('')}
                </div>
            `;
            
            // Highlight of recent progress
            if (workoutsWithVolume.length >= 2) {
                const latest = workoutsWithVolume[0];
                const prev = workoutsWithVolume[1];
                let trendIcon = "📈";
                let trendColor = "#2ECC71";
                let trendTitle = "Porównanie z poprzednią sesją";
                let trendText = "";

                const latestIsCardio = (latest.type === "cardio" || latest.type === "classes" || latest.volume === 0);
                const prevIsCardio = (prev.type === "cardio" || prev.type === "classes" || prev.volume === 0);

                if (latestIsCardio) {
                    trendIcon = "🔥";
                    trendColor = latest.type === "classes" ? "#FF5722" : "#00BFFF";
                    trendTitle = "Aktywność Tlenowa";
                    trendText = `Ostatnia sesja to świetny wysiłek (${latest.type === "classes" ? "Zajęcia zorganizowane" : "Cardio"})! ${latest.calories > 0 ? "Spaliłeś ok. " + latest.calories + " kcal" : "Czas trwania: " + (latest.durationMinutes || 0) + " min"}${latest.hr ? " przy tętnie " + latest.hr + " bpm" : ""}. Regeneracja siłowa zachowana!`;
                } else if (!prevIsCardio && latest.volume > 0) {
                    const diff = latest.volume - prev.volume;
                    if (diff > 0) {
                        trendIcon = "📈";
                        trendColor = "#2ECC71";
                        trendText = `Zwiększyłeś objętość o ${Math.abs(diff)} kg w porównaniu do poprzedniej sesji siłowej! Rewelacja!`;
                    } else if (diff < 0) {
                        trendIcon = "📉";
                        trendColor = "#ff4444";
                        trendText = `Tym razem ${Math.abs(diff)} kg mniej niż ostatnio. Odpocznij jeśli trzeba, ważna jest technika!`;
                    } else {
                        trendIcon = "➖";
                        trendColor = "#aaa";
                        trendText = `Utrzymujesz dokładnie ten sam poziom obciążenia siłowego (${latest.volume} kg). Stabilność też jest ważna!`;
                    }
                } else {
                    trendIcon = "💪";
                    trendColor = "#2ECC71";
                    trendText = `Solidna sesja siłowa: ${latest.volume >= 1000 ? (latest.volume/1000).toFixed(1) + " t" : latest.volume + " kg"} tonażu! Dobry powrót do żelastwa po przerwie tlenowej.`;
                }
                
                analyticsContentHtml += `
                    <div style="background: rgba(0,0,0,0.3); border: 1px solid ${trendColor}; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <strong style="color: ${trendColor};">${trendIcon} ${trendTitle}</strong>
                        <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #ccc;">${trendText}</p>
                    </div>
                `;
            }
        }
        // --- MUSCLE ATLAS (Regeneration) ---
        let muscleAtlasHtml = '<h4 style="color: #00BFFF; border-bottom: 1px solid rgba(0,191,255,0.2); padding-bottom: 5px; margin-bottom: 15px; margin-top: 25px;">Regeneracja i Atlas Mięśni</h4>';
        
        if (trainings.length === 0) {
            muscleAtlasHtml += '<p style="color: #888;">Brak danych treningowych do analizy regeneracji.</p>';
        } else {
            const now = Date.now();
            const last48h = now - (48 * 60 * 60 * 1000);
            
            const recentTrainings = trainings.filter(t => {
                const tTime = t.startTime || new Date(t.date).getTime();
                return tTime > last48h;
            });

            const muscles = {
                chest: { name: 'Klatka Piersiowa', keywords: ['klat', 'wycisk', 'rozpięt', 'pompk'], status: 'green' },
                back: { name: 'Plecy', keywords: ['plec', 'wiosł', 'drąż', 'martw', 'szrug', 'podciąg'], status: 'green' },
                legs: { name: 'Nogi', keywords: ['nog', 'przys', 'wykrok', 'suwn', 'łyd'], status: 'green' },
                shoulders: { name: 'Barki', keywords: ['bark', 'żołnierz', 'unoszen'], status: 'green' },
                arms: { name: 'Ramiona (Bic/Tric)', keywords: ['bic', 'tric', 'uginan', 'francusk'], status: 'green' },
                core: { name: 'Brzuch', keywords: ['brzuch', 'plank', 'desk', 'brzus'], status: 'green' }
            };

            recentTrainings.forEach(t => {
                if (t.exercises) {
                    t.exercises.forEach(ex => {
                        const exName = ex.name ? ex.name.toLowerCase() : '';
                        Object.keys(muscles).forEach(key => {
                            if (muscles[key].keywords.some(kw => exName.includes(kw))) {
                                muscles[key].status = 'red';
                            }
                        });
                    });
                }
            });

            let atlasCards = '';
            let tiredCount = 0;
            
            Object.keys(muscles).forEach(key => {
                const m = muscles[key];
                if (m.status === 'red') tiredCount++;
                const bg = m.status === 'red' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(46, 204, 113, 0.1)';
                const border = m.status === 'red' ? '#E74C3C' : '#2ECC71';
                const icon = m.status === 'red' ? '🔴 Zmęczone' : '🟢 Zregenerowane';
                
                atlasCards += `
                    <div style="background: ${bg}; border: 1px solid ${border}; padding: 10px; border-radius: 8px; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                        <strong style="color: #fff; font-size: 0.9em; margin-bottom: 5px;">${m.name}</strong>
                        <span style="font-size: 0.8em; color: ${border}; font-weight: bold;">${icon}</span>
                    </div>
                `;
            });

            muscleAtlasHtml += `
                <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border: 1px solid #00BFFF; margin-bottom: 20px;">
                    <p style="margin: 0 0 15px 0; font-size: 0.9em; color: #ccc;">Analiza na podstawie treningów z ostatnich 48 godzin. Partie oznaczone na czerwono potrzebują jeszcze odpoczynku przed kolejnym ostrym treningiem!</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        ${atlasCards}
                    </div>
                    ${tiredCount > 3 ? '<p style="color: #ff9800; font-size: 0.9em; margin: 15px 0 0 0; font-weight: bold; text-align: center;">Trener Edward radzi: "Zluzuj trochę gacie, przetrenowałeś pół ciała! Jutro zrób cardio albo odpocznij."</p>' : ''}
                </div>
            `;
        }
        
        analyticsContentHtml += muscleAtlasHtml;

        // 3. Advanced Analytics (FFMI, WHR, BF%)
            let advancedHtml = '<h4 style="color: #00BFFF; border-bottom: 1px solid rgba(0,191,255,0.2); padding-bottom: 5px; margin-bottom: 15px; margin-top: 25px;">Analiza składu ciała</h4>';
            
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

                const gender = localStorage.getItem('uki-bodybuild-gender') || 'male';

                let missingForBF = [];
                if (!height) missingForBF.push("Wzrost");
                if (!waist) missingForBF.push("Talia");
                if (!neck) missingForBF.push("Szyja");
                if (gender === 'female' && !hips) missingForBF.push("Biodra");

                let bf = null;
                let bfHtml = '';
                if (missingForBF.length === 0) {
                    if (gender === 'male') {
                        const val = 1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height);
                        bf = (495 / val) - 450;
                    } else {
                        const val = 1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.22100 * Math.log10(height);
                        bf = (495 / val) - 450;
                    }
                    bf = Math.max(2, Math.min(60, bf)); // sanity clamping

                    let bfText = "";
                    if (gender === 'male') {
                        if(bf < 6) bfText = "Ekstremalnie niski (Startowa forma)";
                        else if(bf < 14) bfText = "Wysportowana sylwetka (Atletyczna)";
                        else if(bf < 18) bfText = "Dobra kondycja (Fitness)";
                        else if(bf < 25) bfText = "Przeciętna sylwetka";
                        else bfText = "Podwyższony poziom tkanki tłuszczowej";
                    } else {
                        if(bf < 14) bfText = "Ekstremalnie niski (Startowa forma)";
                        else if(bf < 21) bfText = "Wysportowana sylwetka (Atletyczna)";
                        else if(bf < 25) bfText = "Dobra kondycja (Fitness)";
                        else if(bf < 32) bfText = "Przeciętna sylwetka";
                        else bfText = "Podwyższony poziom tkanki tłuszczowej";
                    }

                    bfHtml = `
                        <div style="background: rgba(0,0,0,0.5); border: 1px solid #00BFFF; padding: 15px; border-radius: 8px; margin-bottom: 15px; position: relative;">
                            <strong style="color: #00BFFF; font-size: 1.2em;">Szacunkowy BF%</strong>
                            <button onclick="window.AnalyticsUI.showInfoModal('bf', ${bf})" style="position: absolute; right: 15px; top: 15px; background: none; border: none; color: #00BFFF; font-size: 1.2em; cursor: pointer;">ℹ️</button>
                            <div style="font-size: 2em; font-weight: bold; margin: 10px 0;">${bf.toFixed(1)} %</div>
                            <p style="margin: 0; font-size: 0.9em; font-weight: bold; color: #fff;">${bfText}</p>
                            <p style="margin: 5px 0 0 0; font-size: 0.8em; color: #aaa;">Tkanka tłuszczowa wg wzoru US Navy</p>
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

                    let ffmiText = "";
                    if (gender === 'male') {
                        if(normalizedFfmi < 18) ffmiText = "Poniżej przeciętnej";
                        else if(normalizedFfmi < 20) ffmiText = "Przeciętna muskulatura";
                        else if(normalizedFfmi < 22) ffmiText = "Dobra muskulatura (Wysportowany)";
                        else if(normalizedFfmi < 25) ffmiText = "Doskonała muskulatura";
                        else ffmiText = "Genetyczna elita (lub doping)";
                    } else {
                        if(normalizedFfmi < 15) ffmiText = "Poniżej przeciętnej";
                        else if(normalizedFfmi < 17) ffmiText = "Przeciętna muskulatura";
                        else if(normalizedFfmi < 19) ffmiText = "Dobra muskulatura (Wysportowana)";
                        else if(normalizedFfmi < 21) ffmiText = "Doskonała muskulatura";
                        else ffmiText = "Genetyczna elita";
                    }

                    ffmiHtml = `
                        <div style="background: rgba(0,0,0,0.5); border: 1px solid #2ECC71; padding: 15px; border-radius: 8px; margin-bottom: 15px; position: relative;">
                            <strong style="color: #2ECC71; font-size: 1.2em;">FFMI (Index Beztłuszczowy)</strong>
                            <button onclick="window.AnalyticsUI.showInfoModal('ffmi', ${normalizedFfmi})" style="position: absolute; right: 15px; top: 15px; background: none; border: none; color: #2ECC71; font-size: 1.2em; cursor: pointer;">ℹ️</button>
                            <div style="font-size: 2em; font-weight: bold; margin: 10px 0;">${normalizedFfmi.toFixed(1)}</div>
                            <p style="margin: 0; font-size: 0.9em; font-weight: bold; color: #fff;">${ffmiText}</p>
                            <p style="margin: 5px 0 0 0; font-size: 0.8em; color: #aaa;">Wskaźnik suchej masy mięśniowej</p>
                        </div>
                    `;
                }

                let whrHtml = '';
                if (waist && hips) {
                    const whr = waist / hips;
                    
                    let whrText = "";
                    if (gender === 'male') {
                        if(whr < 0.90) whrText = "Zdrowe proporcje (Niskie ryzyko)";
                        else if(whr < 1.0) whrText = "Umiarkowane ryzyko";
                        else whrText = "Typ jabłka (Podwyższone ryzyko)";
                    } else {
                        if(whr < 0.80) whrText = "Zdrowe proporcje (Niskie ryzyko)";
                        else if(whr < 0.85) whrText = "Umiarkowane ryzyko";
                        else whrText = "Typ jabłka (Podwyższone ryzyko)";
                    }

                    whrHtml = `
                        <div style="background: rgba(0,0,0,0.5); border: 1px solid #9B59B6; padding: 15px; border-radius: 8px; margin-bottom: 15px; position: relative;">
                            <strong style="color: #9B59B6; font-size: 1.2em;">WHR (Talia-Biodra)</strong>
                            <button onclick="window.AnalyticsUI.showInfoModal('whr', ${whr})" style="position: absolute; right: 15px; top: 15px; background: none; border: none; color: #9B59B6; font-size: 1.2em; cursor: pointer;">ℹ️</button>
                            <div style="font-size: 2em; font-weight: bold; margin: 10px 0;">${whr.toFixed(2)}</div>
                            <p style="margin: 0; font-size: 0.9em; font-weight: bold; color: #fff;">${whrText}</p>
                            <p style="margin: 5px 0 0 0; font-size: 0.8em; color: #aaa;">Proporcje sylwetki</p>
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
                
                let historyChartHtml = '';
                if (sortedMeasurements.length > 1) {
                    historyChartHtml += '<h5 style="color: #00BFFF; margin-top: 25px; margin-bottom: 15px;">Historia poziomu tkanki tłuszczowej (BF%)</h5>';
                    historyChartHtml += '<div style="display: flex; align-items: flex-end; gap: 8px; height: 140px; padding: 10px 10px 30px 10px; background: rgba(255,255,255,0.05); border-radius: 8px; overflow-x: auto;">';
                    
                    const chartData = sortedMeasurements.slice(0, 10).reverse();
                    
                    chartData.forEach(m => {
                        let hBf = null;
                        let missingForHbf = false;
                        if (!m.height || !m.waist || !m.neck) missingForHbf = true;
                        if (gender === 'female' && !m.hips) missingForHbf = true;

                        if (!missingForHbf) {
                            if (gender === 'male') {
                                const val = 1.0324 - 0.19077 * Math.log10(m.waist - m.neck) + 0.15456 * Math.log10(m.height);
                                hBf = (495 / val) - 450;
                            } else {
                                const val = 1.29579 - 0.35004 * Math.log10(m.waist + m.hips - m.neck) + 0.22100 * Math.log10(m.height);
                                hBf = (495 / val) - 450;
                            }
                            hBf = Math.max(2, Math.min(60, hBf));
                        }
                        
                        if (hBf) {
                            const heightPct = Math.min(100, (hBf / 40) * 100);
                            const dateShort = new Date(m.date).toLocaleDateString('pl-PL', {day:'numeric', month:'short'});
                            
                            historyChartHtml += `
                                <div style="display: flex; flex-direction: column; align-items: center; min-width: 40px;">
                                    <div style="font-size: 0.75em; color: #fff; margin-bottom: 5px;">${hBf.toFixed(1)}%</div>
                                    <div style="width: 25px; height: ${heightPct}%; background: #00BFFF; border-radius: 4px 4px 0 0; min-height: 5px; max-height: 100px;"></div>
                                    <div style="font-size: 0.65em; color: #aaa; margin-top: 8px; transform: rotate(-45deg); transform-origin: top left; white-space: nowrap;">${dateShort}</div>
                                </div>
                            `;
                        }
                    });
                    historyChartHtml += '</div>';
                }

                advancedHtml += `<div style="display: flex; flex-direction: column;">${bfHtml}${ffmiHtml}${whrHtml}</div>${trendsHtml}${historyChartHtml}`;
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

        html += analyticsContentHtml;
        container.innerHTML = html;
    },

    shareProgress: async (monthWorkouts, monthVolume, totalVolume) => {
        const gender = localStorage.getItem('uki-bodybuild-gender') || 'male';
        const didText = gender === 'female' ? 'zrobiłam' : 'zrobiłem';
        const liftedText = gender === 'female' ? 'przerzuciłam' : 'przerzuciłem';
        const textToShare = `W tym miesiącu ${didText} ${monthWorkouts} treningów i ${liftedText} ${monthVolume} kg! 🔥 Buduję formę z Uki's BodyBuild! 💪 Dołącz do nas: https://lukaszdudzinski.github.io/Ukis-BodyBuild/`;
        try {
            // Fetch avatar and nickname from settings
            const settingsStr = localStorage.getItem('uki_bodybuild_settings');
            let avatar = localStorage.getItem('uki-bodybuild-avatar') || null;
            let nickname = 'BodyBuilder';
            if (settingsStr) {
                const settings = JSON.parse(settingsStr);
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
            if (error.name === 'AbortError') {
                // User cancelled the share dialog, do nothing.
                return;
            }
            // Fallback: Copy to clipboard if writeText fails due to lack of focus or unsupported share API
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(textToShare);
                    alert("Skopiowano tekst do schowka. Możesz go wkleić do wybranej aplikacji.");
                } else {
                    window.prompt("Udostępnianie graficzne niedostępne na tym urządzeniu. Skopiuj swój wynik poniżej (Ctrl+C / Cmd+C):", textToShare);
                }
            } catch(e) {
                console.error("Fallback również zawiódł", e);
                window.prompt("Skopiuj swój wynik poniżej (Ctrl+C / Cmd+C):", textToShare);
            }
        }
    },

    showInfoModal: (type, value) => {
        let modal = document.getElementById('analytics-info-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'analytics-info-modal';
            modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box; backdrop-filter: blur(5px); flex-direction: column; opacity: 0; transition: opacity 0.3s;';
            document.body.appendChild(modal);
        }

        const gender = localStorage.getItem('uki-bodybuild-gender') || 'male';
        let title, color, desc, ranges, minVal, maxVal;

        if (type === 'bf') {
            title = 'Szacunkowy BF% (Tkanka Tłuszczowa)';
            color = '#00BFFF';
            desc = 'BF% obrazuje jak dużą część Twojej masy stanowi tłuszcz. Utrzymanie go w ryzach zmniejsza ryzyko chorób układu krążenia i cukrzycy typu 2. Zbyt niski poziom również jest niezdrowy i może zaburzać gospodarkę hormonalną!';
            if (gender === 'male') {
                ranges = [
                    { label: 'Startowa', max: 6, color: '#e74c3c' },
                    { label: 'Atletyczna', max: 14, color: '#3498db' },
                    { label: 'Fitness', max: 18, color: '#2ecc71' },
                    { label: 'Przeciętna', max: 25, color: '#f1c40f' },
                    { label: 'Wysoka', max: 40, color: '#e67e22' }
                ];
            } else {
                ranges = [
                    { label: 'Startowa', max: 14, color: '#e74c3c' },
                    { label: 'Atletyczna', max: 21, color: '#3498db' },
                    { label: 'Fitness', max: 25, color: '#2ecc71' },
                    { label: 'Przeciętna', max: 32, color: '#f1c40f' },
                    { label: 'Wysoka', max: 45, color: '#e67e22' }
                ];
            }
            minVal = 2; maxVal = ranges[ranges.length-1].max;
        } else if (type === 'ffmi') {
            title = 'FFMI (Index Beztłuszczowy)';
            color = '#2ECC71';
            desc = 'FFMI to miernik czystej masy mięśniowej niezależny od wzrostu. Im wyższy, tym jesteś bardziej muskularny. Dobrze rozwinięta tkanka mięśniowa to pancerz ochronny stawów, lepszy metabolizm i wyższa wrażliwość insulinowa!';
            if (gender === 'male') {
                ranges = [
                    { label: 'Niska', max: 18, color: '#f1c40f' },
                    { label: 'Przeciętna', max: 20, color: '#3498db' },
                    { label: 'Dobra', max: 22, color: '#2ecc71' },
                    { label: 'Doskonała', max: 25, color: '#9b59b6' },
                    { label: 'Elita', max: 30, color: '#e74c3c' }
                ];
            } else {
                ranges = [
                    { label: 'Niska', max: 15, color: '#f1c40f' },
                    { label: 'Przeciętna', max: 17, color: '#3498db' },
                    { label: 'Dobra', max: 19, color: '#2ecc71' },
                    { label: 'Doskonała', max: 21, color: '#9b59b6' },
                    { label: 'Elita', max: 26, color: '#e74c3c' }
                ];
            }
            minVal = 13; maxVal = ranges[ranges.length-1].max;
        } else if (type === 'whr') {
            title = 'WHR (Talia do Bioder)';
            color = '#9B59B6';
            desc = 'WHR określa typ sylwetki (jabłko vs gruszka). Typ "jabłka" oznacza gromadzenie tłuszczu wokół narządów wewnętrznych (tłuszcz wisceralny), co drastycznie podnosi ryzyko zawałów, zatorów oraz zespołu metabolicznego!';
            if (gender === 'male') {
                ranges = [
                    { label: 'Zdrowo', max: 0.90, color: '#2ecc71' },
                    { label: 'Umiark.', max: 1.0, color: '#f1c40f' },
                    { label: 'Ryzyko', max: 1.3, color: '#e74c3c' }
                ];
            } else {
                ranges = [
                    { label: 'Zdrowo', max: 0.80, color: '#2ecc71' },
                    { label: 'Umiark.', max: 0.85, color: '#f1c40f' },
                    { label: 'Ryzyko', max: 1.2, color: '#e74c3c' }
                ];
            }
            minVal = 0.6; maxVal = ranges[ranges.length-1].max;
        }

        // Generate bars
        let currentPos = minVal;
        const totalSpan = maxVal - minVal;
        let barsHtml = '';
        ranges.forEach(r => {
            const span = r.max - currentPos;
            const pct = (span / totalSpan) * 100;
            barsHtml += `<div style="width: ${pct}%; background: ${r.color}; height: 100%; border-right: 1px solid rgba(0,0,0,0.3);" title="${r.label}"></div>`;
            currentPos = r.max;
        });

        const pointerPct = Math.max(0, Math.min(100, ((value - minVal) / totalSpan) * 100));

        modal.innerHTML = `
            <div style="background: #1e1e1e; padding: 25px; border-radius: 12px; width: 100%; max-width: 400px; border-top: 5px solid ${color}; box-shadow: 0 10px 30px rgba(0,0,0,0.8); position: relative; box-sizing: border-box;">
                <h3 style="color: ${color}; margin-top: 0; font-size: 1.4em;">${title}</h3>
                <p style="color: #ddd; font-size: 0.95em; line-height: 1.5; margin-bottom: 25px;">${desc}</p>
                
                <div style="position: relative; height: 30px; margin-bottom: 30px;">
                    <!-- The Gauge -->
                    <div style="display: flex; height: 16px; border-radius: 8px; overflow: hidden; width: 100%; box-sizing: border-box; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);">
                        ${barsHtml}
                    </div>
                    <!-- Pointer -->
                    <div style="position: absolute; left: ${pointerPct}%; top: 12px; transform: translateX(-50%); text-align: center; z-index: 2;">
                        <div style="width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 10px solid #fff; margin: 0 auto;"></div>
                        <strong style="color: #fff; background: #000; padding: 3px 8px; border-radius: 4px; display: inline-block; margin-top: 4px; font-size: 1.1em; border: 1px solid ${color};">${Number(value).toFixed(2)}</strong>
                    </div>
                </div>

                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; font-size: 0.85em; color: #888; margin-top: 15px; margin-bottom: 20px; line-height: 1.3;">
                    ${ranges.map(r => `<span style="color: ${r.color}; margin: 2px;">${r.label}</span>`).join('')}
                </div>

                <div style="text-align: center;">
                    <button onclick="document.getElementById('analytics-info-modal').style.opacity='0'; setTimeout(()=>document.getElementById('analytics-info-modal').style.display='none', 300);" style="background: #333; color: #fff; border: 1px solid #555; padding: 10px 30px; border-radius: 6px; font-weight: bold; font-size: 1em; cursor: pointer; display: inline-block;">Zamknij</button>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        setTimeout(() => modal.style.opacity = '1', 10);
    }
};

window.AnalyticsUI = AnalyticsUI;
