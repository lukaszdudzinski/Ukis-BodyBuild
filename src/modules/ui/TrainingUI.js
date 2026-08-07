import { DatabaseManager } from '../db/DatabaseManager.js';
import { TrainingComponent } from '../../components/TrainingComponent.js';

let currentTraining = {
    date: null,
    startTime: null,
    timerInterval: null,
    exercises: [],
    name: '',
    isPaused: false,
    pauseStartTime: null,
    totalPausedTime: 0
};

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let trainingDates = new Set(); // Stores dates in YYYY-MM-DD format
let allTrainingsCache = [];
let selectedDate = new Date().toISOString().split('T')[0];

export const TrainingUI = {
    init: () => {
        const container = document.getElementById('training-dashboard');
        if (container) {
            container.innerHTML = TrainingComponent.render();
        }

        const startNewBtn = document.getElementById('start-new-session-btn');
        if (startNewBtn) {
            startNewBtn.addEventListener('click', () => TrainingUI.startTraining(null));
        }

        const addExerciseBtn = document.getElementById('add-exercise-to-plan-btn');
        if (addExerciseBtn) {
            addExerciseBtn.addEventListener('click', TrainingUI.addExercise);
        }

        const addSupersetBtn = document.getElementById('add-superset-to-plan-btn');
        if (addSupersetBtn) {
            addSupersetBtn.addEventListener('click', TrainingUI.addSuperset);
        }

        const finishBtn = document.getElementById('finish-training-btn');
        if (finishBtn) {
            finishBtn.addEventListener('click', TrainingUI.finishTraining);
        }

        const pauseBtn = document.getElementById('pause-training-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', TrainingUI.togglePause);
        }

        const continueBtn = document.getElementById('continue-session-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => TrainingUI.continueTraining());
        }

        // Calendar listeners
        const prevMonthBtn = document.getElementById('cal-prev-month');
        if (prevMonthBtn) prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            TrainingUI.renderCalendar();
        });
        
        const nextMonthBtn = document.getElementById('cal-next-month');
        if (nextMonthBtn) nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            TrainingUI.renderCalendar();
        });

        document.addEventListener('tabChanged', (e) => {
            if(e.detail && e.detail.tab === 'training-dashboard') {
                TrainingUI.loadHistoryAndCalendar();
            }
        });

        TrainingUI.loadHistoryAndCalendar();
    },

    loadHistoryAndCalendar: async () => {
        try {
            const records = await DatabaseManager.getTrainings();
            allTrainingsCache = records;
            trainingDates.clear();
            records.forEach(rec => {
                trainingDates.add(rec.date);
            });
            TrainingUI.renderCalendar();
            
            // Automatically select and show options for the currently selected date (defaults to today)
            if (selectedDate) {
                TrainingUI.handleDayClick(selectedDate);
            }
        } catch (err) {
            console.error("Error loading training history:", err);
        }
    },

    renderCalendar: () => {
        const grid = document.getElementById('training-calendar-grid');
        const monthYearLabel = document.getElementById('cal-month-year');
        if (!grid || !monthYearLabel) return;

        const months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
        monthYearLabel.textContent = `${months[currentMonth]} ${currentYear}`;

        let html = '';
        const daysOfWeek = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
        daysOfWeek.forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let i = 0; i < adjustedFirstDay; i++) {
            html += `<div class="calendar-day empty"></div>`;
        }

        const todayDate = new Date().toISOString().split('T')[0];

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasTraining = trainingDates.has(dateStr);
            const isToday = dateStr === todayDate;
            const isSelected = dateStr === selectedDate;

            let classes = 'calendar-day';
            if (hasTraining) classes += ' has-training';
            if (isToday) classes += ' today';
            if (isSelected) classes += ' selected';

            html += `
                <div class="${classes}" onclick="window.TrainingUI.handleDayClick('${dateStr}')">
                    ${day}
                    ${hasTraining ? '<div class="training-dot"></div>' : ''}
                </div>
            `;
        }
        grid.innerHTML = html;
    },

    handleDayClick: (dateStr) => {
        selectedDate = dateStr;
        TrainingUI.renderCalendar(); // To update the 'selected' visual state
        
        const panel = document.getElementById('day-action-panel');
        const label = document.getElementById('selected-day-label');
        
        const emptyState = document.getElementById('day-action-empty-state');
        const existingState = document.getElementById('day-action-existing-state');
        const existingPreview = document.getElementById('existing-training-preview');
        const historyList = document.getElementById('history-sessions-list');
        
        if (!panel) return;
        panel.style.display = 'block';
        label.textContent = `Opcje dla: ${dateStr}`;

        const existingTrainingsOnDay = allTrainingsCache.filter(t => t.date === dateStr);

        // Always show emptyState which now contains "start new session"
        if (emptyState) emptyState.style.display = 'block';

        if (existingTrainingsOnDay.length > 0) {
            // Day has trainings
            if (existingState) existingState.style.display = 'block';
            
            if (existingPreview) {
                let html = '';
                existingTrainingsOnDay.forEach(existingTraining => {
                    const nameDisplay = existingTraining.name ? `<strong style="color: #00BFFF; font-size: 1.1em;">${existingTraining.name}</strong><br>` : '';
                    html += `
                        <div style="background-color: #222; border: 1px solid #444; margin-bottom: 15px; border-radius: 8px; padding: 15px; text-align: left;">
                            ${nameDisplay}
                            <span style="font-size: 0.9em;">Czas treningu: ${TrainingUI.formatTime(existingTraining.duration_seconds)}</span><br>
                            <span style="font-size: 0.8em; color: #888;">Liczba ćwiczeń: ${existingTraining.exercises.length}</span>
                            <div style="margin-top: 10px; display: flex; gap: 8px;">
                                <button onclick="window.TrainingUI.continueTraining(${existingTraining.id})" class="action-button pulse" style="flex: 1; background-color: #2ECC71; border-color: #2ECC71; color: #fff; font-size: 0.9em; padding: 8px;">▶ Kontynuuj</button>
                                <button onclick="window.TrainingUI.deleteTraining(${existingTraining.id})" class="action-button" style="flex: 1; background-color: rgba(231, 76, 60, 0.1); border-color: rgba(231, 76, 60, 0.3); color: #E74C3C; font-size: 0.9em; padding: 8px;">🗑 Usuń</button>
                            </div>
                        </div>
                    `;
                });
                existingPreview.innerHTML = html;
            }
        } else {
            // Day has no training
            if (existingState) existingState.style.display = 'none';

            if (historyList) {
                // Build recent history for copying
                let historyHtml = '<h5 style="color: #ccc; margin-bottom: 10px;">📋 Skopiuj sesję treningową:</h5>';
                const recentTrainings = allTrainingsCache.slice(0, 5); // Take last 5
                
                if (recentTrainings.length === 0) {
                    historyHtml += `<p style="color: #888; font-size: 0.9em; font-style: italic;">Brak sesji w historii do skopiowania.</p>`;
                } else {
                    recentTrainings.forEach((rec, idx) => {
                        const nameDisplay = rec.name ? `<strong style="color: #00BFFF; font-size: 1.1em;">${rec.name}</strong> <span style="color: #aaa; font-size: 0.9em;">(${rec.date})</span>` : `<strong style="color: #00BFFF; font-size: 1.1em;">${rec.date}</strong>`;
                        
                        let exercisesPreview = '';
                        if (rec.exercises && rec.exercises.length > 0) {
                            rec.exercises.forEach(ex => {
                                exercisesPreview += `<div style="margin-bottom: 8px;"><strong>${ex.name || 'Brak nazwy'}</strong> <span style="font-size: 0.8em; color: #888;">(${ex.type === 'cardio' ? 'Cardio' : 'Siłowe'})</span><br>`;
                                if (ex.sets && ex.sets.length > 0) {
                                    exercisesPreview += `<ul style="margin: 3px 0 0 0; padding-left: 20px; font-size: 0.9em; color: #ccc;">`;
                                    ex.sets.forEach((s, i) => {
                                        exercisesPreview += `<li>Seria ${i+1}: <strong style="color: #00BFFF;">${s.weight} kg</strong> x <strong>${s.reps} powt.</strong></li>`;
                                    });
                                    exercisesPreview += `</ul>`;
                                } else {
                                    exercisesPreview += `<span style="font-size: 0.9em; color: #888; padding-left: 10px;">Brak zapisanych serii</span>`;
                                }
                                exercisesPreview += `</div>`;
                            });
                        } else {
                            exercisesPreview = `<p style="font-size: 0.9em; color: #888;">Brak zapisanych ćwiczeń.</p>`;
                        }

                        historyHtml += `
                            <div class="history-item-container" style="background-color: #222; border: 1px solid #444; margin-bottom: 10px; border-radius: 8px; padding: 12px; text-align: left;">
                                <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="window.TrainingUI.toggleHistoryPreview(${idx})">
                                    <div style="flex: 1;">
                                        ${nameDisplay}<br>
                                        <span style="font-size: 0.85em; color: #ccc;">Czas: ${TrainingUI.formatTime(rec.duration_seconds)} | Ćwiczeń: ${rec.exercises.length}</span>
                                    </div>
                                    <div style="color: #00BFFF; font-size: 1.2em; padding-left: 10px;">
                                        <span id="preview-icon-${idx}">▼</span>
                                    </div>
                                </div>
                                <div id="preview-content-${idx}" style="display: none; margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                                    <div style="margin-bottom: 15px;">
                                        <h6 style="color: #ccc; margin-top: 0; margin-bottom: 10px;">Podgląd ćwiczeń:</h6>
                                        ${exercisesPreview}
                                    </div>
                                    <button onclick="window.TrainingUI.startTraining(${idx})" class="action-button" style="width: 100%; background-color: #2ECC71; border-color: #2ECC71; color: #fff; font-weight: bold;">
                                        📋 Skopiuj do tego dnia
                                    </button>
                                </div>
                            </div>
                        `;
                    });
                }
                historyList.innerHTML = historyHtml;
            }
        }
        
        // Scroll to panel
        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },

    deleteTraining: async (id) => {
        if (confirm("Czy na pewno chcesz bezpowrotnie usunąć ten trening?")) {
            await DatabaseManager.deleteTraining(id);
            if (typeof TrainingUI.loadHistoryAndCalendar === 'function') {
                await TrainingUI.loadHistoryAndCalendar();
            }
        }
    },

    toggleHistoryPreview: (idx) => {
        const content = document.getElementById(`preview-content-${idx}`);
        const icon = document.getElementById(`preview-icon-${idx}`);
        if (!content || !icon) return;
        if (content.style.display === 'none') {
            content.style.display = 'block';
            icon.textContent = '▲';
        } else {
            content.style.display = 'none';
            icon.textContent = '▼';
        }
    },

    formatTime: (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    },

    updateTimer: () => {
        if (!currentTraining || currentTraining.isPaused) return;

        const now = Date.now();
        const duration = Math.floor((now - currentTraining.startTime - currentTraining.totalPausedTime) / 1000);
        
        // Coach Edward AI
        if (duration === 900 || duration === 1800 || duration === 2700) {
            try {
                if ('speechSynthesis' in window) {
                    const msg = new SpeechSynthesisUtterance("Jak Ci idzie? Ćwicz, a nie siedzisz w telefonie!");
                    msg.lang = 'pl-PL';
                    const voices = window.speechSynthesis.getVoices();
                    const maleVoice = voices.find(v => v.lang.includes('pl') && v.name.toLowerCase().includes('male'));
                    if (maleVoice) msg.voice = maleVoice;
                    window.speechSynthesis.speak(msg);
                }
            } catch(e) {}
        }

        document.getElementById('training-timer').innerText = TrainingUI.formatTime(duration);
    },

    togglePause: () => {
        const pauseBtn = document.getElementById('pause-training-btn');
        if (!pauseBtn) return;

        if (currentTraining.isPaused) {
            // Wznów
            currentTraining.isPaused = false;
            currentTraining.totalPausedTime += (Date.now() - currentTraining.pauseStartTime);
            currentTraining.pauseStartTime = null;
            pauseBtn.innerHTML = '⏸ Pauza';
            pauseBtn.style.backgroundColor = '#f39c12';
            pauseBtn.style.borderColor = '#f39c12';
        } else {
            // Zapauzuj
            currentTraining.isPaused = true;
            currentTraining.pauseStartTime = Date.now();
            pauseBtn.innerHTML = '▶ Wznów';
            pauseBtn.style.backgroundColor = '#2ECC71';
            pauseBtn.style.borderColor = '#2ECC71';
        }
    },

    continueTraining: (trainingId) => {
        const existingTraining = trainingId !== undefined 
            ? allTrainingsCache.find(t => t.id === trainingId)
            : allTrainingsCache.find(t => t.date === selectedDate);
        if (!existingTraining) return;

        document.getElementById('training-calendar-view').style.display = 'none';
        document.getElementById('active-training-view').style.display = 'block';

        currentTraining = {
            id: existingTraining.id,
            date: selectedDate,
            startTime: Date.now() - (existingTraining.duration_seconds * 1000), // Simulate started in the past
            timerInterval: null,
            exercises: JSON.parse(JSON.stringify(existingTraining.exercises)),
            name: existingTraining.name || '',
            isPaused: false,
            pauseStartTime: null,
            totalPausedTime: 0
        };

        const nameInput = document.getElementById('training-name-input');
        if (nameInput) {
            nameInput.value = currentTraining.name;
        }

        TrainingUI.renderCurrentExercises();
        currentTraining.timerInterval = setInterval(TrainingUI.updateTimer, 1000);
    },

    startTraining: (copyFromIndex = null) => {
        document.getElementById('training-calendar-view').style.display = 'none';
        document.getElementById('active-training-view').style.display = 'block';
        
        currentTraining = {
            date: selectedDate,
            startTime: Date.now(),
            exercises: [],
            name: '',
            isPaused: false,
            pauseStartTime: null,
            totalPausedTime: 0,
            socialPhotos: [],
            smartwatch: { calories: null, hr: null }
        };
        
        const nameInput = document.getElementById('training-name-input');
        if (nameInput) {
            nameInput.value = '';
        }

        if (copyFromIndex !== null && allTrainingsCache[copyFromIndex]) {
            const rec = allTrainingsCache[copyFromIndex];
            currentTraining.exercises = rec.exercises.map(ex => ({
                id: Math.random().toString(36).substr(2, 9),
                type: ex.type || 'strength',
                name: ex.name || '',
                sets: ex.sets.map(s => ({ ...s }))
            }));
            if (rec.name && nameInput) {
                currentTraining.name = rec.name;
                nameInput.value = rec.name;
            }
        }
        
        // If empty, start with one empty exercise block
        if (currentTraining.exercises.length === 0) {
            TrainingUI.addExercise();
        } else {
            TrainingUI.renderCurrentExercises();
        }

        currentTraining.timerInterval = setInterval(TrainingUI.updateTimer, 1000);
    },

    addExercise: () => {
        currentTraining.exercises.push({
            id: Date.now().toString(),
            type: 'strength',
            name: '',
            sets: []
        });
        TrainingUI.renderCurrentExercises();
        
        // Focus the newly added exercise name input
        setTimeout(() => {
            const inputs = document.querySelectorAll('.exercise-name-input');
            if (inputs.length > 0) {
                inputs[inputs.length - 1].focus();
                inputs[inputs.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    },

    addSuperset: () => {
        currentTraining.exercises.push({
            id: Date.now().toString(),
            type: 'superset',
            name: '',
            exercises: [
                { id: Date.now().toString() + '-1', type: 'strength', name: '', sets: [] },
                { id: Date.now().toString() + '-2', type: 'strength', name: '', sets: [] }
            ]
        });
        TrainingUI.renderCurrentExercises();
    },

    getExerciseById: (id) => {
        for (let ex of currentTraining.exercises) {
            if (ex.id === id) return ex;
            if (ex.type === 'superset' && ex.exercises) {
                const nested = ex.exercises.find(e => e.id === id);
                if (nested) return nested;
            }
        }
        return null;
    },

    updateExerciseField: (exerciseId, field, value) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (exercise) {
            exercise[field] = value;
        }
    },

    handleCopyCheckbox: (exerciseId, checked) => {
        window.TrainingUI.updateExerciseField(exerciseId, 'autoCopy', checked);
        if (checked) {
            const exercise = TrainingUI.getExerciseById(exerciseId);
            if (exercise && exercise.sets && exercise.sets.length > 0) {
                const lastSet = exercise.sets[exercise.sets.length - 1];
                const w = document.getElementById(`weight-${exerciseId}`);
                const r = document.getElementById(`reps-${exerciseId}`);
                if (w) w.value = lastSet.weight;
                if (r) r.value = lastSet.reps;
            }
        }
    },

    startCardio: (exerciseId) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (!exercise) return;
        if (!exercise.cardioSeconds) exercise.cardioSeconds = 0;
        if (exercise.cardioInterval) return; // already running

        exercise.cardioInterval = setInterval(() => {
            exercise.cardioSeconds++;
            const display = document.getElementById(`cardio-display-${exerciseId}`);
            if (display) {
                display.innerText = window.TrainingUI.formatTime(exercise.cardioSeconds);
            }
            // Zapisujemy na żywo w minutach by backend chwycił
            exercise.duration_minutes = Math.round(exercise.cardioSeconds / 60);
        }, 1000);
        
        document.getElementById(`cardio-btn-start-${exerciseId}`).style.opacity = '0.5';
        document.getElementById(`cardio-btn-stop-${exerciseId}`).style.opacity = '1';
    },

    stopCardio: (exerciseId) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (!exercise || !exercise.cardioInterval) return;
        clearInterval(exercise.cardioInterval);
        exercise.cardioInterval = null;
        document.getElementById(`cardio-btn-start-${exerciseId}`).style.opacity = '1';
        document.getElementById(`cardio-btn-stop-${exerciseId}`).style.opacity = '0.5';
    },

    addSet: (exerciseId, isDropset = false) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (!exercise) return;
        
        const weightInput = document.getElementById(`weight-${exerciseId}`);
        const repsInput = document.getElementById(`reps-${exerciseId}`);

        const bodyweightKeywords = ['brzuch', 'brzuski', 'podciąganie', 'pompki', 'plank', 'deska'];
        const isBodyweight = exercise.name && bodyweightKeywords.some(kw => exercise.name.toLowerCase().includes(kw));

        let wVal = weightInput.value;
        let rVal = repsInput.value;

        if (isBodyweight) {
            if (!rVal) {
                alert("Podaj ilość powtórzeń!");
                return;
            }
            if (!wVal) wVal = "0";
        } else {
            if (!wVal || !rVal) {
                alert("Podaj ciężar i ilość powtórzeń!");
                return;
            }
        }

        exercise.sets.push({
            weight: parseFloat(wVal),
            reps: parseInt(rVal, 10),
            type: isDropset ? 'dropset' : 'normal'
        });

        TrainingUI.renderCurrentExercises();

        // Refill the inputs if autoCopy is enabled
        if (exercise.autoCopy) {
            setTimeout(() => {
                const w = document.getElementById(`weight-${exerciseId}`);
                const r = document.getElementById(`reps-${exerciseId}`);
                if(w) w.value = weightInput.value;
                if(r) r.value = repsInput.value;
            }, 50);
        } else {
            setTimeout(() => {
                const w = document.getElementById(`weight-${exerciseId}`);
                const r = document.getElementById(`reps-${exerciseId}`);
                if(w) w.value = '';
                if(r) r.value = '';
            }, 50);
        }
    },

    removeSet: (exerciseId, setIndex) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (exercise) {
            exercise.sets.splice(setIndex, 1);
            TrainingUI.renderCurrentExercises();
        }
    },

    renderCurrentExercises: () => {
        const list = document.getElementById('current-exercises-list');
        if (currentTraining.exercises.length === 0) {
            list.innerHTML = '';
            return;
        }

        let html = '';
        const renderExerciseForm = (ex, isNested = false) => {
            let exerciseDetailsHtml = '';
            if (ex.type === 'cardio') {
                const cTime = ex.cardioSeconds || (ex.duration_minutes ? ex.duration_minutes * 60 : 0);
                exerciseDetailsHtml = `
                    <div style="margin-top: 15px; text-align: center;">
                        <label style="color: #ccc; font-size: 0.9em;">Czas trwania Cardio (Stoper):</label><br>
                        <div style="font-size: 2.2em; color: #00BFFF; margin: 10px 0; font-family: monospace;" id="cardio-display-${ex.id}">${window.TrainingUI.formatTime(cTime)}</div>
                        <div style="display: flex; gap: 10px; justify-content: center;">
                            <button id="cardio-btn-start-${ex.id}" onclick="window.TrainingUI.startCardio('${ex.id}')" style="background: #2ECC71; color: white; border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; ${ex.cardioInterval ? 'opacity: 0.5;' : ''}">▶ Start</button>
                            <button id="cardio-btn-stop-${ex.id}" onclick="window.TrainingUI.stopCardio('${ex.id}')" style="background: #E74C3C; color: white; border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; ${!ex.cardioInterval ? 'opacity: 0.5;' : ''}">⏹ Stop</button>
                        </div>
                    </div>
                `;
            } else {
                exerciseDetailsHtml = `
                    <div style="margin-bottom: 10px;">
                        ${(ex.sets || []).map((set, i) => {
                            const isDropset = set.type === 'dropset';
                            const style = isDropset ? 'padding: 6px 0 6px 20px; border-bottom: 1px dashed rgba(255,152,0,0.3); font-size: 0.95em; color: #ccc; border-left: 3px solid #FF9800;' : 'padding: 8px 0; border-bottom: 1px solid rgba(0,191,255,0.2); font-size: 1em;';
                            const prefix = isDropset ? '↳ 🔥 Dropset:' : `Seria ${i + 1}:`;
                            return `
                                <div style="display: flex; justify-content: space-between; ${style}">
                                    <span>${prefix} <strong style="color: ${isDropset ? '#FF9800' : '#00BFFF'};">${set.weight} kg</strong> x <strong>${set.reps} powt.</strong></span>
                                    <button onclick="window.TrainingUI.removeSet('${ex.id}', ${i})" style="background: transparent; border: none; color: #ff4444; font-size: 1.2em; cursor: pointer;">&times;</button>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 15px;">
                        <input type="number" id="weight-${ex.id}" placeholder="kg" style="min-width: 60px; flex: 1; padding: 12px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff; font-size: 1.25em; text-align: center; box-sizing: border-box;" inputmode="decimal">
                        <span style="color: #aaa; font-weight: bold; font-size: 1.25em;">X</span>
                        <input type="number" id="reps-${ex.id}" placeholder="powt" style="min-width: 60px; flex: 1; padding: 12px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff; font-size: 1.25em; text-align: center; box-sizing: border-box;" inputmode="numeric">
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button onclick="window.TrainingUI.addSet('${ex.id}', false)" style="background: #00BFFF; color: #fff; border: none; padding: 12px; border-radius: 4px; cursor: pointer; flex: 1; font-weight: bold; font-size: 1.1em; box-sizing: border-box;">+ Seria</button>
                        <button onclick="window.TrainingUI.addSet('${ex.id}', true)" style="background: #FF9800; color: #fff; border: none; padding: 12px; border-radius: 4px; cursor: pointer; flex: 1; font-weight: bold; font-size: 1.1em; box-sizing: border-box;">🔥 Dropset</button>
                    </div>
                    <div style="margin-top: 10px; text-align: center;">
                        <label style="color: #ccc; font-size: 0.9em; display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="checkbox" onchange="window.TrainingUI.handleCopyCheckbox('${ex.id}', this.checked)" ${ex.autoCopy ? 'checked' : ''} style="width: 18px; height: 18px;">
                            Skopiuj dane z poprzedniej serii
                        </label>
                    </div>
                `;
            }
            
            return `
                <div style="background-color: ${isNested ? 'rgba(0,0,0,0.2)' : '#1e1e1e'}; border: 1px solid ${isNested ? '#E91E63' : '#333'}; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <div style="margin-bottom: 15px;">
                        <input type="text" class="exercise-name-input" placeholder="Nazwa ćwiczenia (np. Wyciskanie)" value="${ex.name}" onchange="window.TrainingUI.updateExerciseField('${ex.id}', 'name', this.value)" style="display: block; width: 100%; padding: 15px; margin-bottom: 10px; border-radius: 6px; border: 1px solid ${isNested ? '#E91E63' : '#00BFFF'}; background: #222; color: #fff; font-size: 1.1em; box-sizing: border-box; text-align: center;">
                        <select onchange="window.TrainingUI.updateExerciseField('${ex.id}', 'type', this.value); window.TrainingUI.renderCurrentExercises();" style="display: block; width: 100%; padding: 15px; border-radius: 6px; border: 1px solid ${isNested ? '#E91E63' : '#00BFFF'}; background: #222; color: #fff; font-size: 1.1em; box-sizing: border-box; text-align: center;">
                            <option value="strength" ${ex.type === 'strength' ? 'selected' : ''}>Siłowe</option>
                            <option value="cardio" ${ex.type === 'cardio' ? 'selected' : ''}>Cardio</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 15px; text-align: center;">
                        <label class="action-button" style="display: inline-block; background-color: #333; border-color: #555; color: #fff; cursor: pointer; width: 100%; box-sizing: border-box; text-shadow: 0 1px 3px rgba(0,0,0,0.8);">
                            📷 Zrób zdjęcie maszyny
                            <input type="file" accept="image/*" capture="environment" style="display: none;" onchange="window.TrainingUI.handleMachinePhoto(event, '${ex.id}')">
                        </label>
                        ${ex.machinePhoto ? `<img src="${ex.machinePhoto}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; margin-top: 10px; border: 1px solid ${isNested ? '#E91E63' : '#00BFFF'};" alt="Maszyna">` : ''}
                    </div>
                    ${exerciseDetailsHtml}
                </div>
            `;
        };

        let inSupersetGroup = false;

        currentTraining.exercises.forEach((ex, index) => {
            const nextEx = currentTraining.exercises[index + 1];
            const isMainForSuperset = nextEx && nextEx.type === 'superset';

            if (isMainForSuperset && ex.type !== 'superset') {
                // Rozpoczynamy elegancki blok łączony
                html += `<div style="background: rgba(233, 30, 99, 0.03); border: 2px solid #E91E63; border-radius: 12px; padding: 15px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(233, 30, 99, 0.15); position: relative;">`;
                html += `<div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #111; color: #E91E63; padding: 0 15px; font-size: 0.8em; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; border: 1px solid #E91E63; border-radius: 20px;">Blok Łączony</div>`;
                inSupersetGroup = true;
            }

            if (ex.type === 'superset') {
                if (inSupersetGroup) {
                    // Dodajemy ładny łącznik z ikoną
                    html += `<div style="display: flex; justify-content: center; margin: -10px 0 15px 0;">
                                <div style="background: #E91E63; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2em; box-shadow: 0 0 10px #E91E63; z-index: 2;">🔗</div>
                             </div>`;
                }
                
                html += `
                    <div style="background: linear-gradient(145deg, #2a0815, #1a050d); border: 1px solid rgba(233, 30, 99, 0.5); padding: 15px; border-radius: 8px; margin-bottom: ${inSupersetGroup ? '0' : '15px'}; box-shadow: inset 0 0 10px rgba(0,0,0,0.5);">
                        <h4 style="color: #E91E63; margin-top: 0; margin-bottom: 15px; text-align: center; text-transform: uppercase; font-size: 0.9em; letter-spacing: 1px;">Superseria Dodatkowa</h4>
                        ${ex.exercises.map(nestedEx => renderExerciseForm(nestedEx, true)).join('')}
                    </div>
                `;
                
                if (inSupersetGroup) {
                    html += `</div>`; // Zamykamy główny blok superserii
                    inSupersetGroup = false;
                }
            } else {
                html += renderExerciseForm(ex, false);
            }
        });
        
        list.innerHTML = html;
    },

    compressImage: (file, callback) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = event => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800; // Kompresja do 800px żeby nie zapchać bazy Storage
                let scaleSize = 1;
                if (img.width > MAX_WIDTH) scaleSize = MAX_WIDTH / img.width;
                canvas.width = img.width * scaleSize;
                canvas.height = img.height * scaleSize;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                callback(canvas.toDataURL('image/jpeg', 0.65)); // 65% quality
            }
        };
    },

    handleMachinePhoto: (event, exerciseId) => {
        const file = event.target.files[0];
        if (!file) return;
        TrainingUI.compressImage(file, (compressedDataUrl) => {
            const exercise = TrainingUI.getExerciseById(exerciseId);
            if (exercise) {
                exercise.machinePhoto = compressedDataUrl;
                TrainingUI.renderCurrentExercises();
            }
        });
    },

    handleTrainingPhoto: (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (!currentTraining.socialPhotos) currentTraining.socialPhotos = [];
        if (currentTraining.socialPhotos.length >= 3) {
            alert("Możesz dodać maksymalnie 3 zdjęcia z treningu!");
            return;
        }

        TrainingUI.compressImage(file, (compressedDataUrl) => {
            currentTraining.socialPhotos.push(compressedDataUrl);
            TrainingUI.renderTrainingPhotos();
        });
    },

    removeTrainingPhoto: (index) => {
        if(currentTraining.socialPhotos) {
            currentTraining.socialPhotos.splice(index, 1);
            TrainingUI.renderTrainingPhotos();
        }
    },

    renderTrainingPhotos: () => {
        const container = document.getElementById('training-photos-container');
        if(!container) return;
        let html = '';
        const photos = currentTraining.socialPhotos || [];
        
        photos.forEach((photo, idx) => {
            html += `
                <div style="position: relative; width: 80px; height: 100px;">
                    <img src="${photo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px; border: 1px solid #00BFFF;">
                    <button onclick="window.TrainingUI.removeTrainingPhoto(${idx})" style="position: absolute; top: -5px; right: -5px; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-weight: bold; font-size: 12px; display: flex; align-items: center; justify-content: center;">x</button>
                </div>
            `;
        });

        if (photos.length < 3) {
            html += `
                <label style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 80px; height: 100px; border: 1px dashed #00BFFF; border-radius: 6px; cursor: pointer; background: rgba(0, 191, 255, 0.1);">
                    <span style="font-size: 1.5em; color: #00BFFF;">+</span>
                    <input type="file" accept="image/*" style="display: none;" onchange="window.TrainingUI.handleTrainingPhoto(event)">
                </label>
            `;
        }
        container.innerHTML = html;
    },

    finishTraining: async () => {
        if(confirm("Czy na pewno chcesz zakończyć i zapisać ten trening?")) {
            if (currentTraining.timerInterval) {
                clearInterval(currentTraining.timerInterval);
            }

            if (currentTraining.isPaused) {
                currentTraining.totalPausedTime += (Date.now() - currentTraining.pauseStartTime);
            }

            const duration = Math.floor((Date.now() - currentTraining.startTime - currentTraining.totalPausedTime) / 1000);
            
            // Filter out empty exercises, supporting nested supersets without throwing TypeError
            const validExercises = currentTraining.exercises.filter(ex => {
                if (ex.type === 'superset' && Array.isArray(ex.exercises)) {
                    return ex.exercises.some(subEx => (subEx.name && subEx.name.trim() !== '') || (subEx.sets && subEx.sets.length > 0));
                }
                return (ex.name && ex.name.trim() !== '') || (ex.sets && ex.sets.length > 0);
            });

            const nameInput = document.getElementById('training-name-input');
            const trainingName = nameInput ? nameInput.value.trim() : '';

            const calInput = document.getElementById('smartwatch-calories');
            const hrInput = document.getElementById('smartwatch-hr');
            if (calInput && calInput.value) currentTraining.smartwatch.calories = parseInt(calInput.value, 10);
            if (hrInput && hrInput.value) currentTraining.smartwatch.hr = parseInt(hrInput.value, 10);

            try {
                if (currentTraining.id) {
                    await DatabaseManager.updateTraining({
                        id: currentTraining.id,
                        date: currentTraining.date,
                        duration_seconds: duration,
                        exercises: validExercises,
                        name: trainingName,
                        socialPhotos: currentTraining.socialPhotos,
                        smartwatch: currentTraining.smartwatch
                    });
                } else {
                    await DatabaseManager.addTraining({
                        date: currentTraining.date,
                        duration_seconds: duration,
                        exercises: validExercises,
                        name: trainingName,
                        socialPhotos: currentTraining.socialPhotos,
                        smartwatch: currentTraining.smartwatch
                    });
                }
                alert("Trening zapisany pomyślnie!");

                // Trener Edward AI - Gratulacje
                setTimeout(async () => {
                    if (window.ChatUI && window.DatabaseManager) {
                        try {
                            const trainings = await window.DatabaseManager.getTrainings();
                            const count = trainings.length;
                            if (count === 1) {
                                window.ChatUI.showContextualBubble("Świetna robota z pierwszym treningiem! Oby tak dalej! 💪", true);
                            } else if (count % 7 === 0) {
                                window.ChatUI.showContextualBubble(`Niesamowite! Masz już na koncie ${count} treningów! Konsekwencja to klucz do sukcesu! 🏆`, true);
                            } else if (Math.random() > 0.7) {
                                window.ChatUI.showContextualBubble("Dobra robota dzisiaj! Odpocznij, zjedz coś zdrowego i wracaj silniejszy! 🚀", true);
                            }
                        } catch(e) { console.error(e) }
                    }
                }, 1500);

            } catch (err) {
                console.error("Error saving training:", err);
                alert("Błąd zapisu treningu!");
            }

            document.getElementById('active-training-view').style.display = 'none';
            document.getElementById('training-calendar-view').style.display = 'block';
            TrainingUI.loadHistoryAndCalendar();
        }
    }
};

window.TrainingUI = TrainingUI;
