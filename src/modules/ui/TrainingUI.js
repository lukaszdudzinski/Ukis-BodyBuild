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
                            <div style="margin-top: 10px;">
                                <button onclick="window.TrainingUI.continueTraining(${existingTraining.id})" class="action-button pulse" style="width: 100%; background-color: #2ECC71; border-color: #2ECC71; color: #fff; font-size: 0.9em; padding: 8px;">▶ Kontynuuj ten trening</button>
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
        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        if (!currentTraining.startTime || currentTraining.isPaused) return;
        const now = Date.now();
        const diffSeconds = Math.floor((now - currentTraining.startTime - currentTraining.totalPausedTime) / 1000);
        document.getElementById('training-timer').innerText = TrainingUI.formatTime(diffSeconds);
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
            totalPausedTime: 0
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

    addSet: (exerciseId, isDropset = false) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (!exercise) return;
        
        const weightInput = document.getElementById(`weight-${exerciseId}`);
        const repsInput = document.getElementById(`reps-${exerciseId}`);

        if (!weightInput.value || !repsInput.value) {
            alert("Podaj ciężar i ilość powtórzeń!");
            return;
        }

        exercise.sets.push({
            weight: parseFloat(weightInput.value),
            reps: parseInt(repsInput.value, 10),
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
            // clear them
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
                exerciseDetailsHtml = `
                    <div style="margin-top: 15px; text-align: center;">
                        <label style="color: #ccc; font-size: 0.9em;">Czas trwania (minuty):</label><br>
                        <input type="number" id="cardio-time-${ex.id}" value="${ex.duration_minutes || ''}" onchange="window.TrainingUI.updateExerciseField('${ex.id}', 'duration_minutes', this.value)" placeholder="np. 30" style="width: 100%; max-width: 200px; padding: 10px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff; font-size: 1.2em; text-align: center; margin-top: 5px;" inputmode="numeric">
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
                        <input type="number" id="weight-${ex.id}" placeholder="kg" style="min-width: 60px; flex: 1; padding: 10px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff; font-size: 1em; text-align: center; box-sizing: border-box;" inputmode="decimal">
                        <span style="color: #aaa; font-weight: bold;">X</span>
                        <input type="number" id="reps-${ex.id}" placeholder="powt" style="min-width: 60px; flex: 1; padding: 10px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff; font-size: 1em; text-align: center; box-sizing: border-box;" inputmode="numeric">
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button onclick="window.TrainingUI.addSet('${ex.id}', false)" style="background: #00BFFF; color: #fff; border: none; padding: 10px; border-radius: 4px; cursor: pointer; flex: 1; font-weight: bold; box-sizing: border-box;">+ Seria</button>
                        <button onclick="window.TrainingUI.addSet('${ex.id}', true)" style="background: #FF9800; color: #fff; border: none; padding: 10px; border-radius: 4px; cursor: pointer; flex: 1; font-weight: bold; box-sizing: border-box;">🔥 Dropset</button>
                    </div>
                    <div style="margin-top: 10px; text-align: center;">
                        <label style="color: #ccc; font-size: 0.85em; display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="checkbox" onchange="window.TrainingUI.updateExerciseField('${ex.id}', 'autoCopy', this.checked)" ${ex.autoCopy ? 'checked' : ''} style="width: 16px; height: 16px;">
                            Kopiuj ciężar do następnej serii
                        </label>
                    </div>
                `;
            }
            
            return `
                <div style="background-color: ${isNested ? 'rgba(0,0,0,0.2)' : '#1e1e1e'}; border: 1px solid ${isNested ? '#E91E63' : '#333'}; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <div style="display: flex; gap: 10px;">
                        <input type="text" class="exercise-name-input" placeholder="Nazwa ćwiczenia (np. Wyciskanie)" value="${ex.name}" onchange="window.TrainingUI.updateExerciseField('${ex.id}', 'name', this.value)" style="display: block; width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 4px; border: 1px solid ${isNested ? '#E91E63' : '#00BFFF'}; background: #222; color: #fff; font-size: 1em; box-sizing: border-box; text-align: center;">
                        <select onchange="window.TrainingUI.updateExerciseField('${ex.id}', 'type', this.value); window.TrainingUI.renderCurrentExercises();" style="display: block; width: 100%; padding: 10px; border-radius: 4px; border: 1px solid ${isNested ? '#E91E63' : '#00BFFF'}; background: #222; color: #fff; font-size: 1em; box-sizing: border-box; text-align: center;">
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

        currentTraining.exercises.forEach((ex) => {
            if (ex.type === 'superset') {
                html += `
                    <div style="background: linear-gradient(145deg, #2a0815, #1a050d); border: 1px solid #E91E63; padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 4px 15px rgba(233, 30, 99, 0.2);">
                        <h4 style="color: #E91E63; margin-top: 0; margin-bottom: 15px; text-align: center; text-transform: uppercase; font-size: 0.9em; letter-spacing: 1px;">🔗 Superseria</h4>
                        ${ex.exercises.map(nestedEx => renderExerciseForm(nestedEx, true)).join('')}
                    </div>
                `;
            } else {
                html += renderExerciseForm(ex, false);
            }
        });
        
        list.innerHTML = html;
    },

    handleMachinePhoto: (event, exerciseId) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const exercise = TrainingUI.getExerciseById(exerciseId);
            if (exercise) {
                // Compress image? To save space, we should ideally compress, but let's use DataURL for now.
                exercise.machinePhoto = e.target.result;
                TrainingUI.renderCurrentExercises();
            }
        };
        reader.readAsDataURL(file);
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
            
            // Filter out empty exercises
            const validExercises = currentTraining.exercises.filter(ex => ex.name.trim() !== '' || ex.sets.length > 0);

            const nameInput = document.getElementById('training-name-input');
            const trainingName = nameInput ? nameInput.value.trim() : '';

            try {
                if (currentTraining.id) {
                    await DatabaseManager.updateTraining({
                        id: currentTraining.id,
                        date: currentTraining.date,
                        duration_seconds: duration,
                        exercises: validExercises,
                        name: trainingName
                    });
                } else {
                    await DatabaseManager.addTraining({
                        date: currentTraining.date,
                        duration_seconds: duration,
                        exercises: validExercises,
                        name: trainingName
                    });
                }
                alert("Trening zapisany pomyślnie!");
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
