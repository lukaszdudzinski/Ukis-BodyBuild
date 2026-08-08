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

        // 2. Volume & Intensity Analytics
        let analyticsContentHtml = '';
        
        let totalVolume = 0;
        let totalWorkouts = trainings.length;
        let thisMonthWorkouts = [];
        let thisMonthVolume = 0;

        if (trainings.length === 0) {
            analyticsContentHtml = '<p style="text-align: center; color: #888;">Za mało danych treningowych do przeprowadzenia analizy.</p>';
        } else {
            // Calculate total volume for each training
            const workoutsWithVolume = trainings.map(t => {
                let vol = 0;
                let volBody = 0;
                let volMachine = 0;

                t.exercises.forEach(ex => {
                    const exName = ex.name ? ex.name.toLowerCase() : '';
                    const isBodyweight65 = exName.includes('pompk');
                    const isBodyweight100 = exName.includes('podciąg') || exName.includes('drąż') || exName.includes('brzuszk') || exName.includes('wspięcia');
                    
                    if (ex.sets) {
                        ex.sets.forEach(set => {
                            let weightForVolume = set.weight;
                            if (isBodyweight65) {
                                weightForVolume += (measurements.length > 0 ? (measurements[0].weight * 0.65) : 0);
                            } else if (isBodyweight100) {
                                weightForVolume += (measurements.length > 0 ? measurements[0].weight : 0);
                            }
                            
                            const setTonnage = weightForVolume * set.reps;
                            vol += setTonnage;
                            if (isBodyweight65 || isBodyweight100) {
                                volBody += setTonnage;
                            } else {
                                volMachine += setTonnage;
                            }
                        });
                    }
                });
                return { date: new Date(t.date), volume: vol, volBody, volMachine };
            });

            // Sort by date descending
            workoutsWithVolume.sort((a, b) => b.date - a.date);
            
            let totalVolBody = 0;
            let totalVolMachine = 0;

            workoutsWithVolume.forEach(w => {
                totalVolume += w.volume;
                totalVolBody += w.volBody;
                totalVolMachine += w.volMachine;
            });

            const thisMonth = new Date().getMonth();
            const thisYear = new Date().getFullYear();
            
            thisMonthWorkouts = workoutsWithVolume.filter(w => w.date.getMonth() === thisMonth && w.date.getFullYear() === thisYear);
            
            thisMonthWorkouts.forEach(w => thisMonthVolume += w.volume);

            analyticsContentHtml = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
                    <div style="background: rgba(0,0,0,0.5); border: 1px solid #00BFFF; padding: 15px; border-radius: 8px; text-align: center; grid-column: span 2;">
                        <div style="font-size: 2em; color: #00BFFF; font-weight: bold; margin-bottom: 5px;">${totalWorkouts}</div>
                        <div style="font-size: 0.8em; color: #aaa; text-transform: uppercase;">Wszystkich Treningów</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.5); border: 1px solid #E91E63; padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5em; color: #E91E63; font-weight: bold; margin-bottom: 5px;">${Math.round(totalVolMachine)} kg</div>
                        <div style="font-size: 0.7em; color: #aaa; text-transform: uppercase;">Tonaż Żelastwa</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.5); border: 1px solid #2ECC71; padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5em; color: #2ECC71; font-weight: bold; margin-bottom: 5px;">${Math.round(totalVolBody)} kg</div>
                        <div style="font-size: 0.7em; color: #aaa; text-transform: uppercase;">Tonaż Ciała <span style="cursor:help;" title="Liczone automatycznie na podstawie wagi użytkownika">ℹ️</span></div>
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
        } // End of trainings if/else block

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
                            <button onclick="alert('BF% (Body Fat) to procentowa zawartość tkanki tłuszczowej.\\n\\nMężczyźni:\\n< 6%: Startowa forma (Ekstremalnie niski)\\n6-14%: Atletyczna\\n14-18%: Fitness\\n18-25%: Przeciętna\\n> 25%: Podwyższona\\n\\nKobiety:\\n< 14%: Startowa forma\\n14-21%: Atletyczna\\n21-25%: Fitness\\n25-32%: Przeciętna\\n> 32%: Podwyższona')" style="position: absolute; right: 15px; top: 15px; background: none; border: none; color: #00BFFF; font-size: 1.2em; cursor: pointer;">ℹ️</button>
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
                            <button onclick="alert('FFMI to wskaźnik masy mięśniowej.\\n\\nMężczyźni:\\n< 18: Poniżej przeciętnej\\n18-20: Przeciętna muskulatura\\n20-22: Dobra (Wysportowany)\\n22-25: Doskonała\\n> 25: Genetyczna elita / wspomaganie\\n\\nKobiety:\\n< 15: Poniżej przeciętnej\\n15-17: Przeciętna muskulatura\\n17-19: Dobra (Wysportowana)\\n19-21: Doskonała\\n> 21: Genetyczna elita')" style="position: absolute; right: 15px; top: 15px; background: none; border: none; color: #2ECC71; font-size: 1.2em; cursor: pointer;">ℹ️</button>
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
                            <button onclick="alert('WHR (Waist-to-Hip Ratio) to wskaźnik proporcji obwodu talii do bioder.\\n\\nMężczyźni:\\n< 0.90: Zdrowe proporcje (Niskie ryzyko)\\n0.90 - 1.0: Umiarkowane ryzyko\\n> 1.0: Typ jabłka (Podwyższone ryzyko otyłości brzusznej)\\n\\nKobiety:\\n< 0.80: Zdrowe proporcje (Niskie ryzyko)\\n0.80 - 0.85: Umiarkowane ryzyko\\n> 0.85: Typ jabłka (Podwyższone ryzyko)')" style="position: absolute; right: 15px; top: 15px; background: none; border: none; color: #9B59B6; font-size: 1.2em; cursor: pointer;">ℹ️</button>
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
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(textToShare)
                .then(() => alert("Twój progres został skopiowany do schowka! Możesz go wkleić na Facebooku lub Instagramie."))
                .catch(err => console.error("Błąd kopiowania", err));
        }
    }
};

window.AnalyticsUI = AnalyticsUI;
