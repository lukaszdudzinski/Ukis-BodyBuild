import { DatabaseManager } from '../db/DatabaseManager.js';
import { TrainingComponent } from '../../components/TrainingComponent.js';

let currentTraining = {
    startTime: null,
    timerInterval: null,
    exercises: []
};

export const TrainingUI = {
    init: () => {
        const container = document.getElementById('training-dashboard');
        if (container) {
            container.innerHTML = TrainingComponent.render();
        }

        const startBtn = document.getElementById('start-training-btn');
        if (startBtn) {
            startBtn.addEventListener('click', TrainingUI.startTraining);
        }

        const finishBtn = document.getElementById('finish-training-btn');
        if (finishBtn) {
            finishBtn.addEventListener('click', TrainingUI.finishTraining);
        }

        const addExerciseBtn = document.getElementById('add-exercise-btn');
        if (addExerciseBtn) {
            addExerciseBtn.addEventListener('click', TrainingUI.addExercise);
        }

        // Listen to tab switch to re-render history if needed
        document.addEventListener('tabChanged', (e) => {
            if(e.detail && e.detail.tab === 'training-dashboard') {
                TrainingUI.renderHistory();
            }
        });

        TrainingUI.renderHistory();
    },

    formatTime: (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    },

    updateTimer: () => {
        if (!currentTraining.startTime) return;
        const now = Date.now();
        const diffSeconds = Math.floor((now - currentTraining.startTime) / 1000);
        document.getElementById('training-timer').innerText = TrainingUI.formatTime(diffSeconds);
    },

    startTraining: () => {
        document.getElementById('training-calendar-view').style.display = 'none';
        document.getElementById('active-training-view').style.display = 'block';
        
        currentTraining = {
            startTime: Date.now(),
            exercises: []
        };
        
        currentTraining.timerInterval = setInterval(TrainingUI.updateTimer, 1000);
        TrainingUI.renderCurrentExercises();
    },

    addExercise: () => {
        const typeSelect = document.getElementById('exerciseType');
        const nameInput = document.getElementById('exerciseName');
        const photoInput = document.getElementById('exercisePhoto'); // Not handling base64 fully for exercises yet to save complexity

        if (!nameInput.value.trim()) {
            alert("Podaj nazwę ćwiczenia!");
            return;
        }

        currentTraining.exercises.push({
            id: Date.now().toString(),
            type: typeSelect.value,
            name: nameInput.value.trim(),
            sets: []
        });

        nameInput.value = '';
        TrainingUI.renderCurrentExercises();
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

        weightInput.value = '';
        repsInput.value = '';
        TrainingUI.renderCurrentExercises();
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
            list.innerHTML = '<p style="color: #888; font-size: 0.9em; text-align: center;">Dodaj pierwsze ćwiczenie.</p>';
            return;
        }

        let html = '';
        currentTraining.exercises.forEach((ex, exIndex) => {
            html += `
                <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0, 191, 255, 0.4); padding: 10px; border-radius: 8px; margin-bottom: 15px;">
                    <h5 style="margin: 0 0 10px 0; color: #fff; font-size: 1.1em;">
                        ${exIndex + 1}. ${ex.name} <span style="font-size: 0.8em; color: #aaa;">(${ex.type === 'strength' ? 'Siłowe' : 'Cardio'})</span>
                    </h5>
                    
                    <div style="margin-bottom: 10px;">
                        ${ex.sets.map((set, i) => `
                            <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.9em;">
                                <span>Seria ${i + 1}: <strong>${set.weight} kg</strong> x <strong>${set.reps} powt.</strong></span>
                                <button onclick="window.TrainingUI.removeSet('${ex.id}', ${i})" style="background: transparent; border: none; color: #ff4444; font-size: 1.2em; cursor: pointer;">&times;</button>
                            </div>
                        `).join('')}
                    </div>

                    <div style="display: flex; gap: 5px; align-items: center;">
                        <input type="number" id="weight-${ex.id}" placeholder="kg" style="width: 60px; padding: 5px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff;">
                        <span style="color: #aaa;">x</span>
                        <input type="number" id="reps-${ex.id}" placeholder="powt" style="width: 60px; padding: 5px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff;">
                        <button onclick="window.TrainingUI.addSet('${ex.id}')" style="background: #00BFFF; color: #fff; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; flex-grow: 1;">+ Seria</button>
                    </div>
                </div>
            `;
        });
        
        list.innerHTML = html;
    },

    finishTraining: async () => {
        if(confirm("Czy na pewno chcesz zakończyć i zapisać trening?")) {
            if (currentTraining.timerInterval) {
                clearInterval(currentTraining.timerInterval);
            }

            const duration = Math.floor((Date.now() - currentTraining.startTime) / 1000);
            const todayDate = new Date().toISOString().split('T')[0];

            try {
                await DatabaseManager.addTraining({
                    date: todayDate,
                    duration_seconds: duration,
                    exercises: currentTraining.exercises
                });
                alert("Trening zapisany!");
            } catch (err) {
                console.error("Error saving training:", err);
                alert("Błąd zapisu treningu!");
            }

            // Reset UI
            document.getElementById('active-training-view').style.display = 'none';
            document.getElementById('training-calendar-view').style.display = 'block';
            TrainingUI.renderHistory();
        }
    },

    renderHistory: async () => {
        const container = document.getElementById('training-list');
        if (!container) return;

        try {
            const records = await DatabaseManager.getTrainings();
            
            if (records.length === 0) {
                container.innerHTML = '<p style="color: #888; text-align: center; font-style: italic;">Brak zarejestrowanych treningów.</p>';
                return;
            }

            let html = '';
            records.forEach(rec => {
                const totalSets = rec.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
                const totalVolume = rec.exercises.reduce((sum, ex) => {
                    return sum + ex.sets.reduce((sSum, set) => sSum + (set.weight * set.reps), 0);
                }, 0);

                html += `
                    <div class="log-card" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                            <strong style="color: #00BFFF; font-size: 1.1em;">🏋️ ${rec.date}</strong>
                            <span style="color: #aaa;">Czas: ${TrainingUI.formatTime(rec.duration_seconds)}</span>
                        </div>
                        <div style="font-size: 0.9em; line-height: 1.5;">
                            <div><strong>Ćwiczeń:</strong> ${rec.exercises.length}</div>
                            <div><strong>Wszystkich serii:</strong> ${totalSets}</div>
                            <div><strong>Przerzucony ciężar:</strong> ${totalVolume} kg</div>
                        </div>
                        <div style="margin-top: 10px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 10px; font-size: 0.85em; color: #ccc;">
                            ${rec.exercises.map(ex => `<div>- ${ex.name} (${ex.sets.length} serii)</div>`).join('')}
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
        } catch (err) {
            console.error("Error loading training history:", err);
            container.innerHTML = '<p style="color: #ff4444; text-align: center;">Błąd ładowania historii treningów.</p>';
        }
    }
};

// Expose to window for inline onclick handlers in innerHTML
window.TrainingUI = TrainingUI;
