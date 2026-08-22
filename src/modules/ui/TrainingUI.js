import { DatabaseManager } from '../db/DatabaseManager.js';
import { TrainingComponent } from '../../components/TrainingComponent.js';
import { ExerciseCatalog, ExerciseCategories } from '../../data/ExerciseCatalog.js';

let currentTraining = {
    date: null,
    startTime: null,
    timerInterval: null,
    exercises: [],
    name: '',
    type: 'strength',
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
        TrainingUI.injectCatalogModalHTML();

        const container = document.getElementById('training-dashboard');
        if (container) {
            container.innerHTML = TrainingComponent.render();
            
            // Add Datalist for Exercise Catalog if not exists
            if (!document.getElementById('exercise-catalog-list')) {
                const dataList = document.createElement('datalist');
                dataList.id = 'exercise-catalog-list';
                ExerciseCatalog.forEach(exName => {
                    const option = document.createElement('option');
                    option.value = exName;
                    dataList.appendChild(option);
                });
                container.appendChild(dataList);
            }
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

        const saveTemplateBtn = document.getElementById('save-as-template-btn');
        if (saveTemplateBtn) {
            saveTemplateBtn.addEventListener('click', TrainingUI.saveAsTemplate);
        }

        const loadTemplateBtn = document.getElementById('load-template-session-btn');
        if (loadTemplateBtn) {
            loadTemplateBtn.addEventListener('click', TrainingUI.loadTemplatesDialog);
        }

        const cancelBtn = document.getElementById('cancel-training-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', TrainingUI.cancelTraining);
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

        // Smart Assistant - Trainer Edward visibility check
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                if (currentTraining && currentTraining.startTime && !currentTraining.isPaused && document.getElementById('active-training-view').style.display !== 'none') {
                    // Update timer immediately
                    TrainingUI.updateTimer();
                    // Show bubble
                    if (window.ChatUI) {
                        window.ChatUI.showContextualBubble("Trenuj, a nie siedzisz w telefonie! 📱💪", true);
                    }
                }
            }
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
        
        // Draft check
        setTimeout(() => {
            const draft = TrainingUI.loadDraft();
            if (draft && (!currentTraining || !currentTraining.timerInterval)) {
                if (confirm("Wykryto niezapisany trening (draft) z poprzedniej sesji. Czy chcesz go przywrócić? Jeśli klikniesz Anuluj, zostanie on usunięty.")) {
                    TrainingUI.restoreDraft(draft);
                } else {
                    TrainingUI.clearDraft();
                }
            }
        }, 500);
    },

    injectCatalogModalHTML: () => {
        if (document.getElementById('catalog-modal-overlay')) return;
        const html = `
            <div id="catalog-modal-overlay" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 10000; justify-content: center; align-items: center; padding: 20px;">
                <div style="background: #1e1e1e; width: 100%; max-width: 500px; border-radius: 12px; border: 1px solid rgba(0, 191, 255, 0.3); display: flex; flex-direction: column; max-height: 85vh;">
                    <div style="padding: 15px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center;">
                        <h3 id="catalog-modal-title" style="margin: 0; color: #00BFFF; font-size: 1.3em;">Wybierz partię</h3>
                        <button onclick="document.getElementById('catalog-modal-overlay').style.display='none';" style="background: none; border: none; color: #aaa; font-size: 1.8rem; cursor: pointer; padding: 0; line-height: 1;">&times;</button>
                    </div>
                    <div id="catalog-modal-content" style="padding: 15px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 10px;">
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    },

    openCatalogModal: (exerciseId) => {
        const overlay = document.getElementById('catalog-modal-overlay');
        const content = document.getElementById('catalog-modal-content');
        const title = document.getElementById('catalog-modal-title');
        
        title.innerText = "Wybierz partię";
        content.innerHTML = '';
        
        Object.keys(ExerciseCategories).forEach(cat => {
            const btn = document.createElement('button');
            btn.innerText = cat;
            btn.style.cssText = 'background: #333; color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #444; font-size: 1.1em; cursor: pointer; text-align: left; font-weight: bold; margin-bottom: 5px;';
            btn.onclick = () => TrainingUI.selectCategory(cat, exerciseId);
            content.appendChild(btn);
        });
        
        overlay.style.display = 'flex';
    },

    selectCategory: (category, exerciseId) => {
        const content = document.getElementById('catalog-modal-content');
        const title = document.getElementById('catalog-modal-title');
        
        title.innerText = category;
        content.innerHTML = '';
        
        const backBtn = document.createElement('button');
        backBtn.innerText = '⬅ Powrót do partii';
        backBtn.style.cssText = 'background: rgba(0,191,255,0.1); color: #00BFFF; padding: 10px; border-radius: 8px; border: 1px solid rgba(0,191,255,0.3); font-size: 1em; cursor: pointer; margin-bottom: 10px; font-weight: bold;';
        backBtn.onclick = () => TrainingUI.openCatalogModal(exerciseId);
        content.appendChild(backBtn);
        
        ExerciseCategories[category].forEach(exName => {
            const btn = document.createElement('button');
            btn.innerText = exName;
            btn.style.cssText = 'background: #222; color: #ccc; padding: 12px 15px; border-radius: 6px; border: 1px solid #333; font-size: 0.95em; cursor: pointer; text-align: left; transition: all 0.2s; margin-bottom: 5px;';
            btn.onclick = () => {
                TrainingUI.updateExerciseField(exerciseId, 'name', exName);
                document.getElementById('catalog-modal-overlay').style.display = 'none';
                TrainingUI.renderCurrentExercises();
            };
            content.appendChild(btn);
        });
    },

    getTemplates: () => {
        try {
            const templates = localStorage.getItem('uki_workout_templates');
            return templates ? JSON.parse(templates) : [];
        } catch (e) {
            console.error("Error reading templates", e);
            return [];
        }
    },

    saveAsTemplate: () => {
        if (!currentTraining || !currentTraining.exercises || currentTraining.exercises.length === 0) {
            if (window.ChatUI) window.ChatUI.showContextualBubble("Hej, nie masz żadnych ćwiczeń żeby zapisać szablon! Dodaj coś najpierw. 😅");
            else alert("Dodaj ćwiczenia przed zapisaniem szablonu.");
            return;
        }

        const templateName = prompt("Podaj nazwę planu treningowego (np. 'Plan Masa: Push Wtorek'):");
        if (!templateName || templateName.trim() === '') return;

        // Clone current training and remove specific data
        const template = {
            id: Date.now(),
            name: templateName.trim(),
            type: currentTraining.type || 'strength',
            exercises: currentTraining.exercises.map(ex => {
                const newEx = { ...ex, cardioInterval: null };
                // Keep the structure but reset weights/reps? Or maybe keep them as baseline. Let's keep them as baseline.
                return newEx;
            })
        };

        const templates = TrainingUI.getTemplates();
        templates.push(template);
        localStorage.setItem('uki_workout_templates', JSON.stringify(templates));
        
        if (window.ChatUI) window.ChatUI.showContextualBubble(`Elegancko! Plan Treningowy "${template.name}" zapisany. 💪 Możesz go załadować przy kolejnym treningu.`);
        else alert(`Plan Treningowy "${template.name}" został zapisany.`);
    },

    loadTemplatesDialog: () => {
        const templates = TrainingUI.getTemplates();
        if (templates.length === 0) {
            if (window.ChatUI) window.ChatUI.showContextualBubble("Nie masz jeszcze żadnych zapisanych planów treningowych. Zapisz jakiś podczas treningu! 📝");
            else alert("Brak zapisanych planów treningowych.");
            return;
        }

        let html = `
            <div id="templates-modal-overlay" onclick="if(event.target.id === 'templates-modal-overlay') { this.remove(); window.TrainingUI.renderCalendar(); }" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; justify-content: center; align-items: center; padding: 16px; box-sizing: border-box;">
                <div style="background: #1e1e1e; border: 1px solid #FF9800; border-radius: 14px; width: 100%; max-width: 480px; max-height: 85vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 15px 50px rgba(0,0,0,0.7); box-sizing: border-box;">
                    
                    <!-- Fixed Header with Title and Close X -->
                    <div style="padding: 16px 20px; border-bottom: 1px solid rgba(255,152,0,0.3); display: flex; justify-content: space-between; align-items: center; background: #181818; flex-shrink: 0;">
                        <div>
                            <h3 style="color: #FF9800; margin: 0; font-size: 1.15em;">Szablony Planów Treningowych</h3>
                            <p style="color: #888; font-size: 0.8em; margin: 3px 0 0 0;">Wybierz zapisany plan by rozpocząć sesję:</p>
                        </div>
                        <button onclick="document.getElementById('templates-modal-overlay').remove(); window.TrainingUI.renderCalendar();" style="background: rgba(255,255,255,0.1); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; font-size: 1.4em; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1;">&times;</button>
                    </div>

                    <!-- Scrollable Cards Container -->
                    <div style="padding: 16px; overflow-y: auto; flex: 1; -webkit-overflow-scrolling: touch; display: flex; flex-direction: column; gap: 12px;">
        `;

        let schedules = [];
        try {
            schedules = JSON.parse(localStorage.getItem('uki_workout_schedules') || '[]');
        } catch(e) {}

        templates.forEach(t => {
            let typeLabel = 'Trening Siłowy';
            if (t.type === 'cardio') typeLabel = 'Cardio';
            else if (t.type === 'classes') typeLabel = 'Zajęcia zorganizowane';
            
            let durationInfo = t.duration_seconds ? `<br>Przewidywany czas: ${TrainingUI.formatTime(t.duration_seconds)}` : '';
            
            const mySchedule = schedules.find(s => s.templateId === t.id) || { daysOfWeek: [] };
            const days = [
                { num: 1, name: 'Pn' }, { num: 2, name: 'Wt' }, { num: 3, name: 'Śr' }, 
                { num: 4, name: 'Czw' }, { num: 5, name: 'Pt' }, { num: 6, name: 'Sb' }, { num: 0, name: 'Nd' }
            ];

            let daysHtml = `<div style="display: flex; gap: 4px; justify-content: center; flex-wrap: wrap; margin-top: 5px; padding-top: 10px; border-top: 1px dashed #444;">
                <div style="width: 100%; text-align: center; font-size: 0.85em; color: #888; margin-bottom: 4px;">📅 Automatyczny Harmonogram w Kalendarzu:</div>`;
            days.forEach(d => {
                const isSelected = mySchedule.daysOfWeek.includes(d.num);
                const bg = isSelected ? '#FF9800' : 'rgba(255,255,255,0.05)';
                const col = isSelected ? '#000' : '#888';
                const border = isSelected ? '#FF9800' : '#444';
                daysHtml += `<button onclick="window.TrainingUI.toggleScheduleDay(${t.id}, ${d.num})" style="background: ${bg}; color: ${col}; border: 1px solid ${border}; border-radius: 12px; padding: 4px 10px; font-size: 0.85em; font-weight: bold; cursor: pointer; transition: all 0.2s;">${d.name}</button>`;
            });
            daysHtml += `</div>`;

            html += `
                <div style="background: #2a2a2a; padding: 15px; border-radius: 10px; border: 1px solid #444; display: flex; flex-direction: column; gap: 10px;">
                    <div style="text-align: center; border-bottom: 1px solid #444; padding-bottom: 8px;">
                        <strong style="color: #00BFFF; font-size: 1.1em;">${t.name}</strong>
                    </div>
                    <div style="font-size: 0.9em; color: #bbb; text-align: center; line-height: 1.5;">
                        Typ: ${typeLabel}<br>
                        Ilość ćwiczeń w treningu: ${t.exercises && t.exercises.length ? t.exercises.length : 0}
                        ${durationInfo}
                    </div>
                    <div style="display: flex; gap: 10px; width: 100%; margin-top: 4px; box-sizing: border-box;">
                        <button onclick="window.TrainingUI.startFromTemplate(${t.id})" class="action-button" style="flex: 1; background: #2ECC71; border: 1px solid #2ECC71; color: #fff; padding: 12px 10px; font-weight: bold; border-radius: 8px; font-size: 0.95em; cursor: pointer;">▶ Wybierz</button>
                        <button onclick="window.TrainingUI.deleteTemplate(${t.id})" class="action-button" style="flex: 1; background: rgba(231, 76, 60, 0.2); border: 1px solid rgba(231, 76, 60, 0.4); color: #E74C3C; padding: 12px 10px; font-weight: bold; border-radius: 8px; font-size: 0.95em; cursor: pointer;">Usuń</button>
                    </div>
                    ${daysHtml}
                </div>
            `;
        });

        html += `
                    </div>

                    <!-- Fixed Footer with Close Button -->
                    <div style="padding: 12px 16px; border-top: 1px solid #333; background: #181818; flex-shrink: 0;">
                        <button onclick="document.getElementById('templates-modal-overlay').remove(); window.TrainingUI.renderCalendar();" class="action-button" style="width: 100%; background: #444; border: 1px solid #555; color: #eee; padding: 11px; border-radius: 8px; font-weight: bold; font-size: 0.95em; cursor: pointer;">Zamknij</button>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('templates-modal-overlay');
        if (existingModal) existingModal.remove();
        document.body.insertAdjacentHTML('beforeend', html);
    },

    toggleScheduleDay: (templateId, dayNum) => {
        let schedules = [];
        try { schedules = JSON.parse(localStorage.getItem("uki_workout_schedules") || "[]"); } catch(e) {}
        
        let sched = schedules.find(s => s.templateId === templateId);
        if (!sched) {
            sched = { templateId: templateId, daysOfWeek: [] };
            schedules.push(sched);
        }
        
        const idx = sched.daysOfWeek.indexOf(dayNum);
        if (idx > -1) {
            sched.daysOfWeek.splice(idx, 1);
        } else {
            sched.daysOfWeek.push(dayNum);
        }
        
        // Remove empty schedules
        schedules = schedules.filter(s => s.daysOfWeek.length > 0);
        
        localStorage.setItem("uki_workout_schedules", JSON.stringify(schedules));
        TrainingUI.loadTemplatesDialog(); // Re-render modal to show updated colors
        
        // Refresh calendar if its open
        const calendarEl = document.getElementById("calendar-grid");
        if (calendarEl && window.CalendarUI) {
            window.CalendarUI.renderCalendar(window.CalendarUI.currentDate);
        }
    },

    restorePlannedTraining: (dateStr) => {
        let exceptions = [];
        try { exceptions = JSON.parse(localStorage.getItem("uki_schedule_exceptions") || "[]"); } catch(e) {}
        
        exceptions = exceptions.filter(e => e.date !== dateStr);
        
        localStorage.setItem("uki_schedule_exceptions", JSON.stringify(exceptions));
        TrainingUI.renderCalendar();
        TrainingUI.handleDayClick(dateStr);
    },

    skipPlannedTraining: (dateStr, templateId) => {
        let exceptions = [];
        try { exceptions = JSON.parse(localStorage.getItem("uki_schedule_exceptions") || "[]"); } catch(e) {}
        
        exceptions.push({
            date: dateStr,
            templateId: templateId,
            status: "skipped"
        });
        
        localStorage.setItem("uki_schedule_exceptions", JSON.stringify(exceptions));
        TrainingUI.renderCalendar();
    },

    deleteTemplate: (id) => {
        if (confirm("Na pewno usunąć ten plan treningowy?")) {
            let templates = TrainingUI.getTemplates();
            templates = templates.filter(t => t.id !== id);
            localStorage.setItem('uki_workout_templates', JSON.stringify(templates));
            const modal = document.getElementById('templates-modal-overlay');
            if (modal) modal.remove();
            TrainingUI.loadTemplatesDialog(); // Refresh
        }
    },

    startFromTemplate: (templateId) => {
        const modal = document.getElementById('templates-modal-overlay');
        if (modal) modal.remove();

        const templates = TrainingUI.getTemplates();
        const template = templates.find(t => t.id === templateId);
        if (!template) return;

        // Initialize new session from template
        document.getElementById('training-calendar-view').style.display = 'none';
        document.getElementById('active-training-view').style.display = 'block';

        currentTraining = {
            date: selectedDate, // Use selected day instead of today!
            startTime: Date.now(),
            timerInterval: null,
            exercises: JSON.parse(JSON.stringify(template.exercises || [])), // deep copy
            name: template.name,
            type: template.type || 'strength',
            isPaused: false,
            pauseStartTime: null,
            totalPausedTime: 0
        };

        const nameInput = document.getElementById('training-name-input');
        if (nameInput) nameInput.value = currentTraining.name || '';
        
        const typeSelect = document.getElementById('training-type-select');
        if (typeSelect) {
            typeSelect.value = currentTraining.type;
            if (typeof window.TrainingUI.handleTypeChange === 'function') {
                window.TrainingUI.handleTypeChange(currentTraining.type);
            }
        }

        const manualToggle = document.getElementById('manual-duration-toggle');
        if (manualToggle) manualToggle.checked = false;
        const manualInputs = document.getElementById('manual-duration-inputs');
        if (manualInputs) manualInputs.style.display = 'none';

        const calInput = document.getElementById('smartwatch-calories');
        const hrInput = document.getElementById('smartwatch-hr');
        if (calInput) calInput.value = '';
        if (hrInput) hrInput.value = '';

        const pauseBtn = document.getElementById('pause-training-btn');
        if(pauseBtn) {
            pauseBtn.innerHTML = '⏸ Pauza';
            pauseBtn.style.backgroundColor = '#f39c12';
            pauseBtn.style.borderColor = '#f39c12';
        }

        TrainingUI.renderCurrentExercises();
        currentTraining.timerInterval = setInterval(TrainingUI.updateTimer, 1000);
        TrainingUI.saveDraft();
        
        if (window.ChatUI) {
            window.ChatUI.showContextualBubble("Ogień! 🔥 Plan Treningowy załadowany, zegar tyka – bierzemy się do roboty! 💪", true);
        }
    },

    saveDraft: () => {
        if (!currentTraining || !currentTraining.startTime) return;
        // Kopiujemy obiekt by nie zepsuć setIntervals
        const draftCopy = { ...currentTraining, timerInterval: null };
        if (draftCopy.exercises) {
            draftCopy.exercises = draftCopy.exercises.map(ex => ({ ...ex, cardioInterval: null }));
        }

        const nameInput = document.getElementById('training-name-input');
        if (nameInput) draftCopy.name = nameInput.value;

        const manualToggle = document.getElementById('manual-duration-toggle');
        const hoursInput = document.getElementById('manual-training-hours');
        const minutesInput = document.getElementById('manual-training-minutes');
        if (manualToggle && manualToggle.checked) {
            draftCopy.manualTime = {
                hours: hoursInput ? hoursInput.value : '',
                minutes: minutesInput ? minutesInput.value : ''
            };
        }

        const calInput = document.getElementById('smartwatch-calories');
        const hrInput = document.getElementById('smartwatch-hr');
        if ((calInput && calInput.value) || (hrInput && hrInput.value)) {
            draftCopy.smartwatch = {
                calories: calInput ? calInput.value : '',
                hr: hrInput ? hrInput.value : ''
            };
        }

        try {
            localStorage.setItem('uki_active_training_draft', JSON.stringify(draftCopy));
        } catch(e) {
            console.warn("Nie udało się zapisać draftu treningu", e);
        }
    },

    loadDraft: () => {
        try {
            const draft = localStorage.getItem('uki_active_training_draft');
            if (draft) return JSON.parse(draft);
        } catch(e) {}
        return null;
    },

    clearDraft: () => {
        localStorage.removeItem('uki_active_training_draft');
    },

    restoreDraft: (draft) => {
        document.getElementById('training-calendar-view').style.display = 'none';
        document.getElementById('active-training-view').style.display = 'block';
        
        currentTraining = draft;
        
        const nameInput = document.getElementById('training-name-input');
        if (nameInput) nameInput.value = currentTraining.name || '';
        
        TrainingUI.renderCurrentExercises();
        if (currentTraining.socialPhotos && currentTraining.socialPhotos.length > 0) {
            TrainingUI.renderTrainingPhotos();
        }

        if (currentTraining.manualTime) {
            const manualToggle = document.getElementById('manual-duration-toggle');
            if (manualToggle && !manualToggle.checked) {
                manualToggle.checked = true;
                const manualContainer = document.getElementById('manual-duration-inputs');
                if (manualContainer) manualContainer.style.display = 'flex';
            }
            const hoursInput = document.getElementById('manual-training-hours');
            const minutesInput = document.getElementById('manual-training-minutes');
            if (hoursInput && currentTraining.manualTime.hours) hoursInput.value = currentTraining.manualTime.hours;
            if (minutesInput && currentTraining.manualTime.minutes) minutesInput.value = currentTraining.manualTime.minutes;
        }

        if (currentTraining.smartwatch) {
            const calInput = document.getElementById('smartwatch-calories');
            const hrInput = document.getElementById('smartwatch-hr');
            if (calInput && currentTraining.smartwatch.calories) calInput.value = currentTraining.smartwatch.calories;
            if (hrInput && currentTraining.smartwatch.hr) hrInput.value = currentTraining.smartwatch.hr;
        }
        
        // Zawsze zakładamy że był zablokowany/zatrzymany przy przywracaniu, dajemy pause
        if (!currentTraining.isPaused) {
            currentTraining.isPaused = true;
            currentTraining.pauseStartTime = Date.now();
            const pauseBtn = document.getElementById('pause-training-btn');
            if(pauseBtn) {
                pauseBtn.innerHTML = '▶ Wznów';
                pauseBtn.style.backgroundColor = '#2ECC71';
                pauseBtn.style.borderColor = '#2ECC71';
            }
        }
        
        currentTraining.timerInterval = setInterval(TrainingUI.updateTimer, 1000);
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
                TrainingUI.handleDayClick(selectedDate, true);
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
        
        let schedules = [];
        try { schedules = JSON.parse(localStorage.getItem('uki_workout_schedules') || '[]'); } catch(e) {}
        let exceptions = [];
        try { exceptions = JSON.parse(localStorage.getItem('uki_schedule_exceptions') || '[]'); } catch(e) {}

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dateObj = new Date(currentYear, currentMonth, day);
            const dow = dateObj.getDay();
            const hasTraining = trainingDates.has(dateStr);
            const isToday = dateStr === todayDate;
            const isSelected = dateStr === selectedDate;
            
            // Harmonogram działa dla wybranego dnia
            const isScheduledDay = schedules.some(s => s.daysOfWeek.includes(dow));
            const isPlanned = (dateStr >= todayDate) && isScheduledDay;
            const isException = exceptions.some(e => e.date === dateStr && e.status === 'skipped');
            
            let dotHtml = '';
            if (hasTraining) {
                dotHtml = '<div class="training-dot" style="background-color: #2ECC71; box-shadow: 0 0 5px #2ECC71;"></div>'; // Green
            } else if (isPlanned && !isException) {
                dotHtml = '<div class="training-dot" style="background-color: #FF9800; box-shadow: 0 0 5px #FF9800;"></div>'; // Orange (Future/Today planned)
            } else if (isScheduledDay && isException) {
                dotHtml = '<div class="training-dot" style="background-color: #E74C3C; box-shadow: 0 0 5px #E74C3C;"></div>'; // Red solid (Explicitly Skipped)
            }

            let classes = 'calendar-day';
            if (hasTraining) classes += ' has-training';
            if (isToday) classes += ' today';
            if (isSelected) classes += ' selected';

            html += `
                <div class="${classes}" onclick="window.TrainingUI.handleDayClick('${dateStr}')">
                    ${day}
                    ${dotHtml}
                </div>
            `;
        }
        grid.innerHTML = html;

        const container = grid.parentElement;
        if (container && !document.getElementById('cal-legend')) {
            const legendHtml = `
                <div id="cal-legend" style="display: flex; justify-content: center; gap: 15px; margin-top: 15px; font-size: 0.8em; color: #aaa; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #2ECC71; box-shadow: 0 0 5px #2ECC71;"></div> Wykonany
                    </div>
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #FF9800; box-shadow: 0 0 5px #FF9800;"></div> Zaplanowany
                    </div>
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #E74C3C; box-shadow: 0 0 5px #E74C3C;"></div> Pominięty
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', legendHtml);
        }
    },

    handleDayClick: (dateStr, preventScroll = false) => {
        selectedDate = dateStr;
        TrainingUI.renderCalendar(); // To update the 'selected' visual state
        
        const panel = document.getElementById('day-action-panel');
        const label = document.getElementById('selected-day-label');
        
        const emptyState = document.getElementById('day-action-empty-state');
        const existingState = document.getElementById('day-action-existing-state');
        const existingPreview = document.getElementById('existing-training-preview');
        const plannedState = document.getElementById('day-action-planned-state');
        const plannedPreview = document.getElementById('planned-training-preview');
        const postponeBtn = document.getElementById('postpone-planned-btn');
        const cancelPlannedBtn = document.getElementById('cancel-planned-btn');
        const historyList = document.getElementById('history-sessions-list');
        
        if (!panel) return;
        panel.style.display = 'block';
        label.textContent = `Opcje dla: ${dateStr}`;

        const existingTrainingsOnDay = allTrainingsCache.filter(t => t.date === dateStr);

        // Always show emptyState which now contains "start new session"
        if (emptyState) emptyState.style.display = 'block';
        
        let isPlanned = false;
        if (plannedState) {
            plannedState.style.display = 'none'; // hide by default
            
            let schedules = [];
            try { schedules = JSON.parse(localStorage.getItem("uki_workout_schedules") || "[]"); } catch(e) {}
            let exceptions = [];
            try { exceptions = JSON.parse(localStorage.getItem("uki_schedule_exceptions") || "[]"); } catch(e) {}
            
            const dateObj = new Date(dateStr);
            const dow = dateObj.getDay();
            const sched = schedules.find(s => s.daysOfWeek.includes(dow));
            const isException = exceptions.some(e => e.date === dateStr && e.status === "skipped");
            
            if (sched && existingTrainingsOnDay.length === 0) {
                if (!isException) {
                    isPlanned = true;
                    plannedState.style.display = 'block';
                    
                    let templates = [];
                    try { templates = JSON.parse(localStorage.getItem("uki_workout_templates") || "[]"); } catch(e) {}
                    const template = templates.find(t => t.id === sched.templateId);
                    const tName = template ? template.name : "Nieznany szablon";
                    const typeLabel = template ? (template.type === "cardio" ? "Cardio" : (template.type === "classes" ? "Zajęcia zorganizowane" : "Trening Siłowy")) : "";
                    
                    if (plannedPreview) {
                        plannedPreview.innerHTML = `
                            <div style="background-color: #222; border: 1px solid #FF9800; border-radius: 8px; padding: 15px;">
                                <strong style="color: #FF9800; font-size: 1.1em;">${tName}</strong><br>
                                <span style="font-size: 0.9em; color: #aaa;">${typeLabel} ${template && template.exercises ? `| Ćwiczeń: ${template.exercises.length}` : ""}</span>
                                <div style="margin-top: 10px;">
                                    <button onclick="window.TrainingUI.startFromTemplate(${sched.templateId})" class="action-button pulse" style="width: 100%; background-color: #FF9800; border-color: #FF9800; color: #000; font-weight: bold; padding: 10px;">▶ Rozpocznij ten plan</button>
                                </div>
                            </div>
                        `;
                    }
                    if (postponeBtn) {
                        postponeBtn.style.display = 'block';
                        postponeBtn.onclick = () => {
                            window.TrainingUI.skipPlannedTraining(dateStr, sched.templateId);
                            alert("Trening dzisiejszy przełożony. Jutro musisz go wywołać ręcznie z kalendarza lub szablonów.");
                            TrainingUI.handleDayClick(dateStr);
                        };
                    }
                    if (cancelPlannedBtn) {
                        cancelPlannedBtn.style.display = 'block';
                        cancelPlannedBtn.onclick = () => {
                            window.TrainingUI.skipPlannedTraining(dateStr, sched.templateId);
                            TrainingUI.handleDayClick(dateStr);
                        };
                    }
                } else {
                    // Odwołany trening
                    plannedState.style.display = 'block';
                    if (plannedPreview) {
                        plannedPreview.innerHTML = `
                            <div style="background-color: rgba(231, 76, 60, 0.1); border: 1px dashed #E74C3C; border-radius: 8px; padding: 15px;">
                                <strong style="color: #E74C3C; font-size: 1.1em;">Trening odwołany</strong><br>
                                <span style="font-size: 0.9em; color: #aaa;">Ten dzień został celowo pominięty z harmonogramu.</span>
                                <div style="margin-top: 10px;">
                                    <button onclick="window.TrainingUI.restorePlannedTraining('${dateStr}')" class="action-button" style="width: 100%; background-color: transparent; border: 1px solid #E74C3C; color: #E74C3C; padding: 10px;">Przywróć trening na dziś</button>
                                </div>
                            </div>
                        `;
                    }
                    if (postponeBtn) postponeBtn.style.display = 'none';
                    if (cancelPlannedBtn) cancelPlannedBtn.style.display = 'none';
                }
            }
        }

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
                                <button onclick="window.TrainingUI.viewTraining(${existingTraining.id})" class="action-button" style="flex: 1; background-color: #3498db; border-color: #3498db; color: #fff; font-size: 0.9em; padding: 8px;">🔍 Podgląd</button>
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
                let historyHtml = '<h5 style="color: #ccc; margin-bottom: 10px;">📋 Ostatnie treningi (wybierz, aby skopiować na dziś):</h5>';
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
        if (!preventScroll) {
            panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
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
        
        // Coach Edward AI co 15 min (900s)
        const edwardInterval = 900;
        if (duration > 0 && Math.floor(duration / edwardInterval) > (currentTraining.lastEdwardIndex || 0)) {
            currentTraining.lastEdwardIndex = Math.floor(duration / edwardInterval);
            
            const messages = [
                "Jak Ci idzie? Ćwicz, a nie siedzisz w telefonie!",
                "Jedziesz! Pamiętaj o oddechu!",
                "Nie odpuszczaj, to buduje charakter!",
                "Czas na kolejną serię. Pokaż na co Cię stać!"
            ];
            const msgText = messages[Math.floor(Math.random() * messages.length)];

            if (window.ChatUI) {
                window.ChatUI.showContextualBubble(`⏱ ${msgText}`, true);
            }

            try {
                if ('speechSynthesis' in window) {
                    const msg = new SpeechSynthesisUtterance(msgText);
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

    cancelTraining: () => {
        if (confirm("Czy na pewno chcesz anulować i porzucić ten trening? Ta akcja jest nieodwracalna i wyczyści cały brudnopis!")) {
            if (currentTraining && currentTraining.timerInterval) {
                clearInterval(currentTraining.timerInterval);
            }
            if (currentTraining && currentTraining.exercises) {
                currentTraining.exercises.forEach(ex => {
                    if (ex.cardioInterval) clearInterval(ex.cardioInterval);
                    if (ex.exercises) {
                        ex.exercises.forEach(nex => {
                            if (nex.cardioInterval) clearInterval(nex.cardioInterval);
                        });
                    }
                });
            }
            TrainingUI.clearDraft();
            currentTraining = null;
            document.getElementById('active-training-view').style.display = 'none';
            document.getElementById('training-calendar-view').style.display = 'block';
            TrainingUI.loadHistoryAndCalendar();
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

    viewTraining: (trainingId) => {
        const rec = allTrainingsCache.find(t => t.id === trainingId);
        if (!rec) return;
        
        let html = `
            <div id="view-modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box;">
                <div style="background: #222; border: 1px solid #3498db; border-radius: 12px; width: 100%; max-width: 500px; max-height: 80vh; overflow-y: auto; padding: 20px; color: #fff;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                        <h3 style="color: #3498db; margin: 0;">Podgląd Treningu</h3>
                        <button onclick="document.getElementById('view-modal-overlay').remove()" style="background: transparent; border: none; color: #fff; font-size: 1.5em; cursor: pointer;">&times;</button>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong style="color: #00BFFF; font-size: 1.2em;">${rec.date} ${rec.name ? ' - ' + rec.name : ''}</strong><br>
                        <span style="color: #aaa; font-size: 0.9em;">Czas trwania: ${TrainingUI.formatTime(rec.duration_seconds)}</span><br>
                        <span style="color: #aaa; font-size: 0.9em;">Ćwiczeń: ${rec.exercises.length}</span>
                    </div>
                    <h4 style="color: #00BFFF; margin-bottom: 10px;">Zapisane ćwiczenia:</h4>
        `;
        
        rec.exercises.forEach((ex, i) => {
            html += `
                <div style="margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 5px;">
                    <div style="color: #fff; font-weight: bold; margin-bottom: 5px;">${i+1}. ${ex.name || 'Nieznane ćwiczenie'}</div>
                    <div style="padding-left: 10px; border-left: 2px solid #00BFFF;">
                        ${(!ex.sets || ex.sets.length === 0) ? '<em style="color: #777;">Brak serii</em>' : ''}
                        ${(ex.sets || []).map((set, sIdx) => `<div>Seria ${sIdx + 1}: ${set.weight} kg x ${set.reps} powt.</div>`).join('')}
                    </div>
                </div>
            `;
        });

        html += `
                    <button onclick="document.getElementById('view-modal-overlay').remove()" class="action-button" style="width: 100%; margin-top: 20px; background: #555; border-color: #555; color: #fff;">Zamknij</button>
                </div>
            </div>
        `;
        const existingModal = document.getElementById('view-modal-overlay');
        if (existingModal) existingModal.remove();
        document.body.insertAdjacentHTML('beforeend', html);
    },

    startTraining: (copyFromIndex = null) => {
        document.getElementById('training-calendar-view').style.display = 'none';
        document.getElementById('active-training-view').style.display = 'block';
        
        currentTraining = {
            date: selectedDate,
            startTime: Date.now(),
            exercises: [],
            name: '',
            type: 'strength',
            isPaused: false,
            pauseStartTime: null,
            totalPausedTime: 0,
            socialPhotos: [],
            smartwatch: { calories: null, hr: null }
        };

        const typeSelect = document.getElementById('training-type-select');
        if (typeSelect) typeSelect.value = 'strength';
        TrainingUI.handleTypeChange('strength');
        
        const nameInput = document.getElementById('training-name-input');
        if (nameInput) {
            nameInput.value = '';
            setTimeout(() => nameInput.focus(), 50);
        }

        const smartwatchHr = document.getElementById('smartwatch-hr');
        const smartwatchCal = document.getElementById('smartwatch-calories');
        if(smartwatchHr) smartwatchHr.value = '';
        if(smartwatchCal) smartwatchCal.value = '';

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
    toggleSign: (inputId) => {
        const el = document.getElementById(inputId);
        if(el) {
            let val = parseFloat(el.value || '0');
            el.value = (val * -1).toString();
        }
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

    addNestedSuperset: (supersetId) => {
        const superset = currentTraining.exercises.find(e => e.id === supersetId);
        if (superset) {
            superset.exercises.push({
                id: Date.now().toString() + '-' + Math.random().toString(36).substr(2,5),
                type: 'strength',
                name: '',
                sets: []
            });
            TrainingUI.renderCurrentExercises();
        }
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
        
        TrainingUI.renderCurrentExercises();
    },

    stopCardio: (exerciseId) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (!exercise || !exercise.cardioInterval) return;
        clearInterval(exercise.cardioInterval);
        exercise.cardioInterval = null;
        TrainingUI.renderCurrentExercises();
    },

    updateCardioManual: (exerciseId, minutes) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (exercise) {
            let m = parseInt(minutes, 10);
            if (isNaN(m) || m < 0) m = 0;
            exercise.cardioSeconds = m * 60;
            exercise.duration_minutes = m;
            TrainingUI.saveDraft();
        }
    },

    addSet: (exerciseId, isDropset = false) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (!exercise) return;
        
        const weightInput = document.getElementById(`weight-${exerciseId}`);
        const repsInput = document.getElementById(`reps-${exerciseId}`);

        const bodyweightKeywords = ['brzuch', 'brzus', 'podciąg', 'podciag', 'pompk', 'plank', 'deska', 'drąż', 'draz'];
        const isBodyweight = exercise.name && bodyweightKeywords.some(kw => exercise.name.toLowerCase().includes(kw));

        let wVal = "0";
        let rVal = "0";

        if (weightInput && repsInput) {
            wVal = weightInput.value;
            rVal = repsInput.value;

            if (isBodyweight) {
                if (!rVal) { alert("Podaj ilość powtórzeń!"); return; }
                if (!wVal) wVal = "0";
            } else {
                if (!wVal || !rVal) { alert("Podaj ciężar i ilość powtórzeń!"); return; }
            }
        } else {
            // Experimental mode - sklonuj ostatnią serię
            if (exercise.sets && exercise.sets.length > 0) {
                const lastSet = exercise.sets[exercise.sets.length - 1];
                wVal = lastSet.weight;
                rVal = lastSet.reps;
            } else {
                wVal = "0";
                rVal = "10";
            }
        }

        const newSet = {
            weight: parseFloat(wVal),
            reps: parseInt(rVal, 10),
            type: isDropset ? 'dropset' : 'normal'
        };
        
        // 1RM & PR Logic
        if (!isBodyweight && newSet.weight > 0 && newSet.reps > 0) {
            const current1RM = newSet.weight * (1 + (newSet.reps / 30));
            let maxHistorical1RM = 0;
            
            if (exercise.name && allTrainingsCache) {
                const exNameLower = exercise.name.toLowerCase().trim();
                allTrainingsCache.forEach(t => {
                    if (t.exercises) {
                        t.exercises.forEach(e => {
                            if (e.name && e.name.toLowerCase().trim() === exNameLower && e.sets) {
                                e.sets.forEach(s => {
                                    const s1RM = s.weight * (1 + (s.reps / 30));
                                    if (s1RM > maxHistorical1RM) maxHistorical1RM = s1RM;
                                });
                            }
                        });
                    }
                });
            }
            
            // Check within current training as well, in case they did multiple sets today
            exercise.sets.forEach(s => {
                const s1RM = s.weight * (1 + (s.reps / 30));
                if (s1RM > maxHistorical1RM) maxHistorical1RM = s1RM;
            });
            
            if (current1RM > maxHistorical1RM && maxHistorical1RM > 0) {
                newSet.isPR = true;
                if (window.ChatUI) {
                    window.ChatUI.showContextualBubble(`🏆 Nowy Rekord Życiowy (PR)! 💪 Świetna forma, idziesz jak czołg! 🐗🔥`);
                }
            } else if (maxHistorical1RM === 0) {
                // First time doing this exercise or no history
                newSet.isPR = true; // First baseline is technically a PR, but maybe we don't spam
            }
        }

        exercise.sets.push(newSet);

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

    toggleSetCompletion: (exerciseId, setIndex, isCompleted) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (exercise && exercise.sets[setIndex]) {
            exercise.sets[setIndex].isCompleted = isCompleted;
            TrainingUI.renderCurrentExercises();
        }
    },

    updateSetInline: (exerciseId, setIndex, field, value) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (exercise && exercise.sets[setIndex]) {
            exercise.sets[setIndex][field] = parseFloat(value) || 0;
            TrainingUI.saveDraft();
        }
    },

    updateSetStepper: (exerciseId, setIndex, delta) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (exercise && exercise.sets[setIndex]) {
            let newVal = parseInt(exercise.sets[setIndex].reps) + delta;
            if (newVal < 0) newVal = 0;
            exercise.sets[setIndex].reps = newVal;
            
            // Update DOM element directly
            const inputEl = document.getElementById(`exp-reps-${exerciseId}-${setIndex}`);
            if (inputEl) inputEl.value = newVal;
            
            TrainingUI.saveDraft();
            if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(20);
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
                        <label style="color: #ccc; font-size: 0.9em;">Czas trwania Cardio (Stoper lub wpisz ręcznie):</label><br>
                        
                        <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin: 10px 0;">
                            <div style="font-size: 2.2em; color: #00BFFF; font-family: monospace; display: ${ex.cardioInterval ? 'block' : 'none'};" id="cardio-display-${ex.id}">${window.TrainingUI.formatTime(cTime)}</div>
                            <div style="display: ${ex.cardioInterval ? 'none' : 'flex'}; align-items: center; gap: 5px; justify-content: center;" id="cardio-input-wrap-${ex.id}">
                                <input type="number" id="cardio-manual-min-${ex.id}" value="${Math.floor(cTime/60)}" onchange="window.TrainingUI.updateCardioManual('${ex.id}', this.value)" style="width: 80px; padding: 10px; border-radius: 6px; border: 1px solid #00BFFF; background: #222; color: #00BFFF; font-size: 1.6em; text-align: center; font-weight: bold;" inputmode="numeric">
                                <span style="color: #888; font-size: 1.2em;">min</span>
                            </div>
                        </div>

                        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 10px;">
                            <button id="cardio-btn-start-${ex.id}" onclick="window.TrainingUI.startCardio('${ex.id}')" style="background: #2ECC71; color: white; border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; ${ex.cardioInterval ? 'opacity: 0.5;' : ''}">▶ Start</button>
                            <button id="cardio-btn-stop-${ex.id}" onclick="window.TrainingUI.stopCardio('${ex.id}')" style="background: #E74C3C; color: white; border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; ${!ex.cardioInterval ? 'opacity: 0.5;' : ''}">⏹ Stop</button>
                        </div>
                    </div>
                `;
            } else {
                exerciseDetailsHtml = `
                    <div style="margin-bottom: 10px;">
                        ${(() => {
                            let seriesCount = 0;
                            return (ex.sets || []).map((set, i) => {
                                const isDropset = set.type === 'dropset';
                                if (!isDropset) seriesCount++;
                                const style = isDropset ? 'padding: 6px 0 6px 4px; border-bottom: 1px dashed rgba(255,152,0,0.3); font-size: 0.95em; color: #ccc; border-left: 3px solid #FF9800;' : 'padding: 8px 0; border-bottom: 1px solid rgba(0,191,255,0.2); font-size: 1em;';
                                const prefix = isDropset ? '↳ 🔥' : `Seria ${seriesCount}:`;
                                
                                let prBadge = '';
                                let ormText = '';
                                if (!ex.type || ex.type === 'strength') {
                                    if (set.isPR) {
                                        prBadge = `<span style="font-size: 0.7em; background: #FFD700; color: #000; padding: 2px 4px; border-radius: 4px; font-weight: bold; margin-left: 4px; box-shadow: 0 0 8px rgba(255, 215, 0, 0.6); animation: pulse 1s infinite; display: inline-block; white-space: nowrap;">🏆 Rekord!</span>`;
                                    }
                                    if (set.weight > 0 && set.reps > 0) {
                                        const orm = Math.round(set.weight * (1 + (set.reps / 30)));
                                        ormText = `<span style="font-size: 0.75em; color: #888; margin-left: 8px;">(Max: ~${orm} kg)</span>`;
                                    }
                                }

                                return `
                                    <div style="padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05); width: 100%; box-sizing: border-box; ${style} ${set.isCompleted ? 'background: rgba(46, 204, 113, 0.15); border-radius: 4px;' : ''}">
                                        
                                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 2px; width: 100%; flex-wrap: nowrap; overflow: hidden;">
                                            <!-- Lewa strona: Checkbox + Seria -->
                                            <div style="display: flex; align-items: center; gap: 2px; flex-shrink: 0;">
                                                <input type="checkbox" ${set.isCompleted ? 'checked' : ''} onchange="window.TrainingUI.toggleSetCompletion('${ex.id}', ${i}, this.checked)" style="transform: scale(1.2); cursor: pointer; accent-color: #2ECC71; margin-right: 2px;">
                                                <span style="font-size: 0.9em; font-weight: bold; white-space: nowrap; ${set.isCompleted ? 'opacity: 0.6;' : ''}">${prefix}</span>
                                            </div>
                                            
                                            <!-- Środek: Wpisywanie ciężaru i powtórzeń -->
                                            <div style="display: flex; align-items: center; justify-content: center; gap: 2px; flex: 1; min-width: 0;">
                                                ${localStorage.getItem('uki-experimental-numpad') === 'on' ? `
                                                    <!-- Numpad dla Ciężaru -->
                                                    <input type="text" readonly id="exp-weight-${ex.id}-${i}" class="training-input-large" value="${set.weight}" onclick="window.NumpadUI.open(this, '${ex.id}', ${i}, 'Podaj ciężar (kg)')" style="width: 70px; box-sizing: border-box; background: rgba(0,0,0,0.3); border: 1px solid #444; color: ${isDropset ? '#FF9800' : '#00BFFF'}; font-weight: bold; text-align: center; border-radius: 6px; font-size: 1.1em; padding: 6px; cursor: pointer;"> 
                                                    <span style="font-size: 0.85em; color: #888;">kg</span>
                                                    <span style="color: #666; font-size: 0.85em; margin: 0 4px;">x</span>
                                                    <!-- Steppery dla Powtórzeń -->
                                                    <div style="display: flex; gap: 2px; align-items: center;">
                                                        <button onclick="window.TrainingUI.updateSetStepper('${ex.id}', ${i}, -1)" style="background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; padding: 6px 12px; font-weight: bold; font-size: 1.1em;">-</button>
                                                        <input type="text" id="exp-reps-${ex.id}-${i}" readonly value="${set.reps}" style="width: 45px; box-sizing: border-box; background: transparent; border: none; color: #fff; font-weight: bold; text-align: center; font-size: 1.1em; padding: 2px;">
                                                        <button onclick="window.TrainingUI.updateSetStepper('${ex.id}', ${i}, 1)" style="background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; padding: 6px 12px; font-weight: bold; font-size: 1.1em;">+</button>
                                                    </div>
                                                ` : `
                                                    <!-- Klasyczne inputy -->
                                                    <input type="number" class="training-input-large" value="${set.weight}" onchange="window.TrainingUI.updateSetInline('${ex.id}', ${i}, 'weight', this.value)" style="width: 62px; box-sizing: border-box; background: rgba(0,0,0,0.3); border: 1px solid #444; color: ${isDropset ? '#FF9800' : '#00BFFF'}; font-weight: bold; text-align: center; border-radius: 6px; font-size: 1.05em; padding: 2px;" inputmode="decimal"> 
                                                    <span style="font-size: 0.85em; color: #888;">kg</span>
                                                    <span style="color: #666; font-size: 0.85em; margin: 0 2px;">x</span>
                                                    <input type="number" class="training-input-large" value="${set.reps}" onchange="window.TrainingUI.updateSetInline('${ex.id}', ${i}, 'reps', this.value)" style="width: 54px; box-sizing: border-box; background: rgba(0,0,0,0.3); border: 1px solid #444; color: #fff; font-weight: bold; text-align: center; border-radius: 6px; font-size: 1.05em; padding: 2px;" inputmode="numeric">
                                                `}
                                            </div>
                                            
                                            <!-- Prawa strona: Przycisk usunięcia X -->
                                            <button onclick="window.TrainingUI.removeSet('${ex.id}', ${i})" style="background: transparent; border: none; color: #ff4444; font-size: 1.3em; line-height: 1; cursor: pointer; padding: 4px 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">&times;</button>
                                        </div>
                                        
                                        ${(prBadge || ormText) ? `
                                        <div style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 4px;">
                                            ${prBadge} ${ormText}
                                        </div>
                                        ` : ''}
                                    </div>
                                `;
                            }).join('');
                        })()}
                    </div>

                    ${localStorage.getItem('uki-experimental-numpad') === 'on' ? '' : `
                    <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 15px;">
                        <div style="display: flex; flex: 1; min-width: 80px; gap: 5px;">
                            ${(ex.name && ['brzuch', 'brzus', 'podciąg', 'podciag', 'pompk', 'plank', 'deska', 'drąż', 'draz'].some(kw => ex.name.toLowerCase().includes(kw))) ? 
                            `<button onclick="window.TrainingUI.toggleSign('weight-${ex.id}')" style="background: #444; color: #fff; border: none; padding: 12px; border-radius: 4px; font-weight: bold; cursor: pointer; border: 1px solid #666;" title="Zmień ciężar na ujemny (odciążenie z gum)">+/-</button>` 
                            : ''}
                            <input type="${(ex.name && ['brzuch', 'brzus', 'podciąg', 'podciag', 'pompk', 'plank', 'deska', 'drąż', 'draz'].some(kw => ex.name.toLowerCase().includes(kw))) ? 'text' : 'number'}" id="weight-${ex.id}" class="training-input-large" placeholder="kg" style="flex: 1; min-width: 40px; padding: 12px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff; font-size: 1.4em; text-align: center; box-sizing: border-box;" inputmode="decimal">
                        </div>
                        <span style="color: #aaa; font-weight: bold; font-size: 1.25em;">X</span>
                        <input type="number" id="reps-${ex.id}" class="training-input-large" placeholder="powt" style="min-width: 60px; flex: 1; padding: 12px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff; font-size: 1.4em; text-align: center; box-sizing: border-box;" inputmode="numeric">
                    </div>
                    `}
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button onclick="window.TrainingUI.addSet('${ex.id}', false)" style="background: #00BFFF; color: #fff; border: none; padding: 12px; border-radius: 4px; cursor: pointer; flex: 1; font-weight: bold; font-size: 1.1em; box-sizing: border-box;">${localStorage.getItem('uki-experimental-numpad') === 'on' ? '➕ Dodaj Serię (Klon)' : '+ Seria'}</button>
                        <button onclick="window.TrainingUI.addSet('${ex.id}', true)" style="background: #FF9800; color: #fff; border: none; padding: 12px; border-radius: 4px; cursor: pointer; flex: 1; font-weight: bold; font-size: 1.1em; box-sizing: border-box;">🔥 Dropset</button>
                    </div>
                    ${localStorage.getItem('uki-experimental-numpad') === 'on' ? '' : `
                    <div style="margin-top: 10px; text-align: center;">
                        <label style="color: #ccc; font-size: 0.9em; display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="checkbox" onchange="window.TrainingUI.handleCopyCheckbox('${ex.id}', this.checked)" ${ex.autoCopy ? 'checked' : ''} style="width: 18px; height: 18px;">
                            Skopiuj dane z poprzedniej serii
                        </label>
                    </div>
                    `}
                `;
            }
            
            return `
                <div style="background: ${isNested ? 'linear-gradient(145deg, #2a0815, #1a050d)' : '#1e1e1e'}; border: 1px solid ${isNested ? '#E91E63' : '#333'}; padding: 15px; border-radius: 8px; margin-bottom: 15px; ${isNested ? 'box-shadow: 0 0 10px rgba(233, 30, 99, 0.2);' : ''}">
                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                            <input type="text" class="exercise-name-input" placeholder="Wpisz nazwę..." value="${ex.name}" onchange="window.TrainingUI.updateExerciseField('${ex.id}', 'name', this.value); window.TrainingUI.renderCurrentExercises();" style="flex: 1; min-width: 0; padding: 15px; border-radius: 6px; border: 1px solid ${isNested ? '#E91E63' : '#00BFFF'}; background: #222; color: #fff; font-size: 1.1em; box-sizing: border-box; text-align: center;">
                            <button onclick="window.TrainingUI.openCatalogModal('${ex.id}')" style="background: rgba(0,191,255,0.1); color: #00BFFF; border: 1px solid ${isNested ? '#E91E63' : '#00BFFF'}; border-radius: 6px; padding: 0 15px; cursor: pointer; font-weight: bold; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">📚<br><span style="font-size: 0.7em;">Katalog</span></button>
                        </div>
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
                    <div style="margin-bottom: ${inSupersetGroup ? '0' : '15px'};">
                        ${ex.exercises.map(nestedEx => renderExerciseForm(nestedEx, true)).join('')}
                        <div style="text-align: center; margin-top: -5px; margin-bottom: 15px;">
                            <button onclick="window.TrainingUI.addNestedSuperset('${ex.id}')" style="background: rgba(233, 30, 99, 0.2); border: 1px dashed #E91E63; color: #E91E63; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.9em;">+ Kolejne ćwiczenie (Superseria)</button>
                        </div>
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
        TrainingUI.saveDraft();
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

    handleTypeChange: (type) => {
        if (!currentTraining) return;
        currentTraining.type = type;
        const exercisesContainer = document.getElementById('exercises-container-section');
        const classContainer = document.getElementById('class-type-container');
        
        if (type === 'strength') {
            exercisesContainer.style.display = 'block';
            classContainer.style.display = 'none';
        } else if (type === 'cardio') {
            exercisesContainer.style.display = 'none';
            classContainer.style.display = 'none';
        } else if (type === 'class') {
            exercisesContainer.style.display = 'none';
            classContainer.style.display = 'block';
        }
    },

    handleClassChange: (className) => {
        if (!currentTraining) return;
        if (className === 'custom') {
            const customName = prompt("Wpisz nazwę zajęć:");
            if (customName) {
                currentTraining.name = customName;
                const nameInput = document.getElementById('training-name-input');
                if (nameInput) nameInput.value = customName;
            }
        } else {
            currentTraining.name = className;
            const nameInput = document.getElementById('training-name-input');
            if (nameInput) nameInput.value = className;
        }
    },

    finishTraining: async () => {
        if(confirm("Czy na pewno chcesz zakończyć i zapisać ten trening?")) {
            if (currentTraining.timerInterval) {
                clearInterval(currentTraining.timerInterval);
            }

            if (currentTraining.isPaused) {
                currentTraining.totalPausedTime += (Date.now() - currentTraining.pauseStartTime);
            }

            let duration = Math.floor((Date.now() - currentTraining.startTime - currentTraining.totalPausedTime) / 1000);
            
            const manualToggle = document.getElementById('manual-duration-toggle');
            if (manualToggle && manualToggle.checked) {
                const hoursInput = document.getElementById('manual-training-hours');
                const minutesInput = document.getElementById('manual-training-minutes');
                const hrs = hoursInput ? parseInt(hoursInput.value, 10) || 0 : 0;
                const mins = minutesInput ? parseInt(minutesInput.value, 10) || 0 : 0;
                if (hrs > 0 || mins > 0) {
                    duration = (hrs * 3600) + (mins * 60);
                }
            }
            
            // Filter out empty exercises, supporting nested supersets without throwing TypeError
            const validExercises = currentTraining.exercises.filter(ex => {
                if (ex.type === 'superset' && Array.isArray(ex.exercises)) {
                    return ex.exercises.some(subEx => (subEx.name && subEx.name.trim() !== '') || (Array.isArray(subEx.sets) && subEx.sets.length > 0));
                }
                return (ex.name && ex.name.trim() !== '') || (Array.isArray(ex.sets) && ex.sets.length > 0);
            });

            const nameInput = document.getElementById('training-name-input');
            const trainingName = nameInput ? nameInput.value.trim() : '';

            const calInput = document.getElementById('smartwatch-calories');
            const hrInput = document.getElementById('smartwatch-hr');
            if ((calInput && calInput.value) || (hrInput && hrInput.value)) {
                if (!currentTraining.smartwatch) currentTraining.smartwatch = {};
                if (calInput && calInput.value) currentTraining.smartwatch.calories = parseInt(calInput.value, 10);
                if (hrInput && hrInput.value) currentTraining.smartwatch.hr = parseInt(hrInput.value, 10);
            }

            // Safety cleanup for cardioIntervals to avoid circular reference crashes in DB storage
            currentTraining.exercises.forEach(ex => {
                if (ex.cardioInterval) {
                    clearInterval(ex.cardioInterval);
                    delete ex.cardioInterval;
                }
            });

            // Ensure exercises_json doesn't break if validExercises is empty
            const exercisesToSave = validExercises.length > 0 ? validExercises : [];

            try {
                if (currentTraining.id) {
                    await DatabaseManager.updateTraining({
                        id: currentTraining.id,
                        date: currentTraining.date,
                        duration_seconds: duration,
                        exercises: exercisesToSave,
                        name: trainingName,
                        type: currentTraining.type || 'strength',
                        socialPhotos: currentTraining.socialPhotos,
                        smartwatch: currentTraining.smartwatch
                    });
                } else {
                    await DatabaseManager.addTraining({
                        date: currentTraining.date,
                        duration_seconds: duration,
                        exercises: exercisesToSave,
                        name: trainingName,
                        type: currentTraining.type || 'strength',
                        socialPhotos: currentTraining.socialPhotos,
                        smartwatch: currentTraining.smartwatch
                    });
                }
                
                if (window.AchievementsSystem) {
                    window.AchievementsSystem.checkPostTrainingAchievements({
                        exercises: exercisesToSave
                    });
                }
                
                TrainingUI.clearDraft(); // Czyścimy brudnopis po sukcesie
                alert("Trening zapisany pomyślnie!");
                
                // Hide active view and show calendar
                document.getElementById('active-training-view').style.display = 'none';
                document.getElementById('training-calendar-view').style.display = 'block';
                TrainingUI.loadHistoryAndCalendar();

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
                
                // Awaryjne zrzucenie treningu do logów i pliku lokalnego
                try {
                    localStorage.setItem('uki_active_training_draft', JSON.stringify({
                        ...currentTraining, 
                        isCrashRecovery: true,
                        crashError: err.toString()
                    }));
                } catch(e) {}
                
                if (window.ukiLogError) {
                    window.ukiLogError("KRYTYCZNY Błąd podczas zapisu w finishTraining", err ? err.stack || err.toString() : '');
                } else {
                    // Fallback jeśli ukiLogError nie istnieje
                    console.error("KRYTYCZNY Błąd:", err);
                }
                
                alert("Wystąpił błąd podczas zapisywania treningu! Bez obaw - twoje dane zostały zrzucone jako kopia zapasowa do pamięci i będziesz mógł je przywrócić po odświeżeniu aplikacji.");
                return; // Przerwij żeby nie znikał ekran (nie przełączaj widoków)
            }

            document.getElementById('active-training-view').style.display = 'none';
            document.getElementById('training-calendar-view').style.display = 'block';
            TrainingUI.loadHistoryAndCalendar();
        }
    }
};

window.TrainingUI = TrainingUI;
