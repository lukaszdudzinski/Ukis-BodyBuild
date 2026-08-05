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
            TrainingUI.renderHistoryList(records);
            // Hide day action panel initially
            document.getElementById('day-action-panel').style.display = 'none';
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

        const existingTraining = allTrainingsCache.find(t => t.date === dateStr);

        if (existingTraining) {
            // Day already has training
            if (emptyState) emptyState.style.display = 'none';
            if (existingState) existingState.style.display = 'block';
            
            if (existingPreview) {
                const nameDisplay = existingTraining.name ? `<strong style="color: #00BFFF; font-size: 1.2em;">${existingTraining.name}</strong><br>` : '';
                existingPreview.innerHTML = `
                    ${nameDisplay}
                    <span>Czas treningu: ${TrainingUI.formatTime(existingTraining.duration_seconds)}</span><br>
                    <span style="font-size: 0.9em; color: #888;">Liczba ćwiczeń: ${existingTraining.exercises.length}</span>
                `;
            }
        } else {
            // Day has no training
            if (emptyState) emptyState.style.display = 'block';
            if (existingState) existingState.style.display = 'none';

            if (historyList) {
                // Build recent history for copying
                let historyHtml = '<h5 style="color: #ccc; margin-bottom: 10px;">📋 Skopiuj sesję treningową:</h5>';
                const recentTrainings = allTrainingsCache.slice(0, 5); // Take last 5
                
                if (recentTrainings.length === 0) {
                    historyHtml += `<p style="color: #888; font-size: 0.9em; font-style: italic;">Brak sesji w historii do skopiowania.</p>`;
                } else {
                    recentTrainings.forEach((rec, idx) => {
                        const nameDisplay = rec.name ? `<strong style="color: #00BFFF;">${rec.name}</strong> (${rec.date})` : `<strong style="color: #00BFFF;">${rec.date}</strong>`;
                        const exNames = rec.exercises.map(e => e.name).filter(n => n).join(', ');
                        const preview = exNames.length > 30 ? exNames.substring(0, 30) + '...' : exNames;
                        historyHtml += `
                            <button onclick="window.TrainingUI.startTraining(${idx})" class="action-button" style="width: 100%; margin-bottom: 5px; background-color: #333; border: 1px solid #555; text-align: left; padding: 10px;">
                                ${nameDisplay}<br>
                                <span style="font-size: 0.85em; color: #ccc;">Czas treningu: ${TrainingUI.formatTime(rec.duration_seconds)} | ${rec.exercises.length} ćw. ${preview ? `(${preview})` : ''}</span>
                            </button>
                        `;
                    });
                }
                historyList.innerHTML = historyHtml;
            }
        }
        
        // Scroll to panel
        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

    continueTraining: () => {
        const existingTraining = allTrainingsCache.find(t => t.date === selectedDate);
        if (!existingTraining) return;

        document.getElementById('training-calendar-view').style.display = 'none';
        document.getElementById('active-training-view').style.display = 'block';

        currentTraining = {
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

    updateExerciseField: (exerciseId, field, value) => {
        const exercise = currentTraining.exercises.find(e => e.id === exerciseId);
        if (exercise) {
            exercise[field] = value;
        }
    },

    addSet: (exerciseId) => {
        const exercise = currentTraining.exercises.find(e => e.id === exerciseId);
        if (!exercise) return;
        
        const weightInput = document.getElementById(`weight-${exerciseId}`);
        const repsInput = document.getElementById(`reps-${exerciseId}`);

        if (!weightInput.value || !repsInput.value) {
            alert("Podaj ciężar i ilość powtórzeń!");
            return;
        }

        exercise.sets.push({
            weight: parseFloat(weightInput.value),
            reps: parseInt(repsInput.value, 10)
        });

        // Keep the input values so the next set is easier to log!
        TrainingUI.renderCurrentExercises();
        
        // Refill the inputs
        setTimeout(() => {
            const w = document.getElementById(`weight-${exerciseId}`);
            const r = document.getElementById(`reps-${exerciseId}`);
            if(w) w.value = weightInput.value;
            if(r) r.value = repsInput.value;
        }, 50);
    },

    removeSet: (exerciseId, setIndex) => {
        const exercise = currentTraining.exercises.find(e => e.id === exerciseId);
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
        currentTraining.exercises.forEach((ex, exIndex) => {
            html += `
                <div style="background: rgba(0,0,0,0.4); border: 1px solid #00BFFF; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="margin-bottom: 10px;">
                        <input type="text" class="exercise-name-input" placeholder="Nazwa ćwiczenia (np. Wyciskanie)" value="${ex.name}" onchange="window.TrainingUI.updateExerciseField('${ex.id}', 'name', this.value)" style="display: block; width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 4px; border: 1px solid #00BFFF; background: #222; color: #fff; font-size: 1em; box-sizing: border-box; text-align: center;">
                        <select onchange="window.TrainingUI.updateExerciseField('${ex.id}', 'type', this.value)" style="display: block; width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #00BFFF; background: #222; color: #fff; font-size: 1em; box-sizing: border-box; text-align: center;">
                            <option value="strength" ${ex.type === 'strength' ? 'selected' : ''}>Siłowe</option>
                            <option value="cardio" ${ex.type === 'cardio' ? 'selected' : ''}>Cardio</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 15px; text-align: center;">
                        <label class="action-button" style="display: inline-block; background-color: #333; border-color: #555; color: #fff; cursor: pointer; width: 100%; box-sizing: border-box;">
                            📷 Zrób zdjęcie maszyny
                            <input type="file" accept="image/*" capture="environment" style="display: none;">
                        </label>
                    </div>
                    
                    <div style="margin-bottom: 10px;">
                        ${ex.sets.map((set, i) => `
                            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(0,191,255,0.2); font-size: 1em;">
                                <span>Seria ${i + 1}: <strong style="color: #00BFFF;">${set.weight} kg</strong> x <strong>${set.reps} powt.</strong></span>
                                <button onclick="window.TrainingUI.removeSet('${ex.id}', ${i})" style="background: transparent; border: none; color: #ff4444; font-size: 1.2em; cursor: pointer;">&times;</button>
                            </div>
                        `).join('')}
                    </div>

                    <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 15px;">
                        <input type="number" id="weight-${ex.id}" placeholder="kg" style="min-width: 60px; flex: 1; padding: 10px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff; font-size: 1em; text-align: center; box-sizing: border-box;" inputmode="decimal">
                        <span style="color: #aaa; font-weight: bold;">X</span>
                        <input type="number" id="reps-${ex.id}" placeholder="powt" style="min-width: 60px; flex: 1; padding: 10px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff; font-size: 1em; text-align: center; box-sizing: border-box;" inputmode="numeric">
                        <button onclick="window.TrainingUI.addSet('${ex.id}')" style="background: #00BFFF; color: #fff; border: none; padding: 10px; border-radius: 4px; cursor: pointer; min-width: 80px; flex: 1; font-weight: bold; box-sizing: border-box;">+ Seria</button>
                    </div>
                </div>
            `;
        });
        
        list.innerHTML = html;
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
                await DatabaseManager.addTraining({
                    date: currentTraining.date,
                    duration_seconds: duration,
                    exercises: validExercises,
                    name: trainingName
                });
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
