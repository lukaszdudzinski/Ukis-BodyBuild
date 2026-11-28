// wyglad: zar
import { DatabaseManager } from '../db/DatabaseManager.js';
import { ShareUtils } from '../../utils/ShareUtils.js';
import { ikona } from '../wyglad/ikony.js';

// Encje HTML dla tekstów z bazy i z obcego pliku (nazwy treningów i ćwiczeń) wstawianych przez innerHTML.
const esc = (s) => String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
// Argument funkcji w atrybucie onclick="…": literał JS (JSON.stringify), a potem encje HTML (wzór z TrainingUI.js).
const jsArg = (v) => esc(JSON.stringify(v ?? null));

export const HistoryUI = {
    init: () => {
        document.addEventListener('tabChanged', (e) => {
            if(e.detail && e.detail.tab === 'history-dashboard') {
                HistoryUI.loadHistory();
            }
        });
    },

    formatTime: (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    },

    loadHistory: async () => {
        try {
            const records = await DatabaseManager.getTrainings();
            window._cachedTrainingsHistory = records;
            HistoryUI.renderHistoryList(records);
        } catch (err) {
            console.error("Error loading training history:", err);
        }
    },

    renderHistoryList: (records) => {
        const container = document.getElementById('history-grouped-list');
        if (!container) return;

        if (records.length === 0) {
            // Import: przycisk „Importuj” w nagłówku Historii (index.html).
            container.innerHTML = '<p class="z-mut z-hist-pusto">Brak zarejestrowanych treningów.</p>';
            return;
        }

        // Group records by Month-Year
        const grouped = {};
        records.forEach(rec => {
            const dateObj = new Date(rec.date);
            const monthYear = dateObj.toLocaleString('pl-PL', { month: 'long', year: 'numeric' });
            if (!grouped[monthYear]) {
                grouped[monthYear] = [];
            }
            grouped[monthYear].push(rec);
        });

        let templates = [];
        try {
            const tmp = localStorage.getItem('uki_workout_templates');
            if (tmp) templates = JSON.parse(tmp);
        } catch(e) {}
        const templateNames = templates.map(t => (t.name || '').toLowerCase().trim());

        const serie = (sets) => (!sets || sets.length === 0)
            ? '<div class="z-hist-seria z-mut"><em>Brak serii</em></div>'
            : sets.map((set, sIdx) => `<div class="z-hist-seria z-mut">Seria ${sIdx + 1}: ${esc(set.weight)} kg × ${esc(set.reps)} powt.</div>`).join('');

        let html = ''; // Import: przycisk „Importuj” w nagłówku Historii (index.html).
        for (const [monthYear, monthRecords] of Object.entries(grouped)) {
            html += `<section class="z-hist-miesiac-grupa"><h3 class="z-hist-miesiac z-mut">${esc(monthYear)}</h3>`;

            monthRecords.forEach((rec, idx) => {
                // Serie i objętość liczymy też w ćwiczeniach wewnątrz superserii.
                const plaskie = rec.exercises.flatMap(ex => (ex.type === 'superset' && Array.isArray(ex.exercises)) ? ex.exercises : [ex]);
                const totalSets = plaskie.reduce((sum, ex) => sum + (ex.sets ? ex.sets.length : 0), 0);
                const totalVolume = plaskie.reduce((sum, ex) => {
                    if (!ex.sets) return sum;
                    return sum + ex.sets.reduce((sSum, set) => sSum + (set.weight * set.reps), 0);
                }, 0);
                const cardId = `history-card-${monthYear.replace(/\s/g, '-')}-${idx}`;
                const isTemplate = rec.name && templateNames.includes(rec.name.toLowerCase().trim());
                const isNotebook = rec.source === 'zeszyt';
                // Ikona rodzaju: Zeszyt, szablon, cardio, zajęcia, a domyślnie trening siłowy.
                const rodzaj = isNotebook ? 'notebook'
                    : isTemplate ? 'star'
                    : rec.type === 'cardio' ? 'activity'
                    : rec.type === 'classes' ? 'users'
                    : 'dumbbell';
                const czas = isNotebook ? `${rec.exercises.length} ćwiczeń` : HistoryUI.formatTime(rec.duration_seconds);
                const idArg = jsArg(String(rec.id));
                const kcal = (rec.smartwatch && rec.smartwatch.calories) ? rec.smartwatch.calories : '--';

                const cwiczenia = rec.exercises.map((ex, i) => {
                    if (ex.type === 'superset' && ex.exercises && ex.exercises.length > 0) {
                        return `<div class="z-hist-cw z-hist-cw-blok">
                            <div class="z-hist-blok">${i + 1}. Blok Łączony (Superseria)</div>
                            ${ex.exercises.map((nestedEx, nIdx) => `
                                <div class="z-hist-cw-nazwa">${i + 1}.${nIdx + 1}. ${esc(nestedEx.name || 'Nieznane ćwiczenie')}</div>
                                <div class="z-hist-serie">${serie(nestedEx.sets)}</div>`).join('')}
                        </div>`;
                    }
                    return `<div class="z-hist-cw">
                        <div class="z-hist-cw-nazwa">${i + 1}. ${esc(ex.name || 'Nieznane ćwiczenie')}</div>
                        <div class="z-hist-serie">${serie(ex.sets)}</div>
                    </div>`;
                }).join('');

                html += `
                    <div class="log-card z-card z-hist-karta">
                        <button type="button" class="z-hist-gora" aria-expanded="false" aria-controls="${cardId}" onclick="window.HistoryUI.toggleCard(this)">
                            <span class="z-hist-ico z-ic z-card">${ikona(rodzaj, 22)}</span>
                            <span class="z-hist-tekst">
                                <strong class="z-hist-nazwa">${esc(rec.name || rec.date)}</strong>
                                <span class="z-hist-meta z-mut">${esc(rec.date)} · ${esc(czas)}</span>
                            </span>
                            <span class="z-hist-chevron z-hist-chevron-dol">${ikona('chevron-down', 20)}</span>
                            <span class="z-hist-chevron z-hist-chevron-gora">${ikona('chevron-up', 20)}</span>
                        </button>

                        <div id="${cardId}" class="z-hist-szczegoly" hidden>
                            <div class="z-hist-staty">
                                <div class="z-card z-stat"><strong>${isNotebook ? '—' : HistoryUI.formatTime(rec.duration_seconds)}</strong><span class="z-mut">Czas</span></div>
                                <div class="z-card z-stat"><strong>${totalSets}</strong><span class="z-mut">Serie</span></div>
                                <div class="z-card z-stat"><strong>${totalVolume} kg</strong><span class="z-mut">Objętość</span></div>
                                <div class="z-card z-stat"><strong>${esc(kcal)}</strong><span class="z-mut">kcal</span></div>
                            </div>

                            <div class="z-hist-lista">${cwiczenia}</div>

                            <div class="z-hist-akcje">
                                ${isNotebook ? `<button type="button" class="z-ghost" data-testid="open-in-notebook" onclick="window.NotebookUI.openDay(${jsArg(String(rec.date))})">Otwórz w Zeszycie</button>` : ''}
                                <button type="button" class="z-ghost" onclick="window.HistoryUI.shareTraining(${idArg})">${ikona('share', 18)}Udostępnij</button>
                                <button type="button" class="z-ghost" onclick="window.HistoryUI.exportTraining(${idArg})">${ikona('download', 18)}Eksportuj</button>
                                <button type="button" class="z-ghost" onclick="window.HistoryUI.saveAsTemplateFromHistory(${idArg})">${ikona('copy', 18)}Jako szablon</button>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `</section>`;
        }

        container.innerHTML = html;
    },

    // Zwijanie i rozwijanie wiersza: aria-expanded na przycisku, karta z akcentem (z-alert), ikona w kole akcentu.
    toggleCard: (btn) => {
        const body = document.getElementById(btn.getAttribute('aria-controls'));
        if (!body) return;
        const otwarty = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', String(otwarty));
        body.hidden = !otwarty;
        const karta = btn.closest('.z-card');
        if (karta) karta.classList.toggle('z-alert', otwarty);
        const ico = btn.querySelector('.z-hist-ico');
        if (ico) {
            ico.classList.toggle('z-ic-acc', otwarty);
            ico.classList.toggle('z-card', !otwarty);
        }
    },

    saveAsTemplateFromHistory: (trainingId) => {
        const records = window._cachedTrainingsHistory || [];
        const rec = records.find(r => String(r.id) === String(trainingId));
        if (!rec) {
            alert("Nie znaleziono treningu.");
            return;
        }

        const templateName = prompt("Podaj nazwę dla nowego Planu Treningowego (np. 'Z historii: Klatka'):", `Z planu: ${rec.name || rec.date}`);
        if (!templateName || templateName.trim() === '') return;

        const template = {
            id: Date.now(),
            name: templateName.trim(),
            type: rec.type || 'strength',
            duration_seconds: rec.duration_seconds || 0,
            exercises: JSON.parse(JSON.stringify(rec.exercises)).map(ex => {
                const newEx = { ...ex, cardioInterval: null };
                return newEx;
            })
        };

        let templates = [];
        try {
            const tmps = localStorage.getItem('uki_workout_templates');
            if (tmps) templates = JSON.parse(tmps);
        } catch(e) {}
        
        templates.push(template);
        localStorage.setItem('uki_workout_templates', JSON.stringify(templates));
        alert(`Plan Treningowy "${template.name}" został zapisany!`);
        HistoryUI.loadHistory(); // Odśwież widok by zaktualizować ikony gwiazdek
    },

    shareTraining: async (trainingId) => {
        // Zamiast robić await na DB (co na iOS może zgubić uprawnienie do navigator.share ze względu na czas oczekiwania), szukamy w pamięci:
        const records = window._cachedTrainingsHistory || [];
        const rec = records.find(r => String(r.id) === String(trainingId));
        
        if (!rec) {
            alert("Błąd: Nie znaleziono treningu w pamięci. Odśwież stronę i spróbuj ponownie.");
            return;
        }

        const totalVolume = rec.exercises.reduce((sum, ex) => {
            if (!ex.sets) return sum;
            return sum + ex.sets.reduce((sSum, set) => sSum + (set.weight * set.reps), 0);
        }, 0);
        const exercisesCount = rec.exercises.length;
        const dateStr = rec.date;

        const gender = localStorage.getItem('uki-bodybuild-gender') || 'male';
        const finishedText = gender === 'female' ? 'ukończyłam' : 'ukończyłem';
        const didText = gender === 'female' ? 'Zrobiłam' : 'Zrobiłem';
        const liftedText = gender === 'female' ? 'przerzuciłam' : 'przerzuciłem';
        const textToShare = `Właśnie ${finishedText} trening (${dateStr})! ${didText} ${exercisesCount} ćwiczeń i ${liftedText} ${totalVolume} kg! 🔥 Uki's BodyBuild 💪 Dołącz do nas: https://lukaszdudzinski.github.io/Ukis-BodyBuild/`;
        
        try {
            // Fetch avatar and nickname from settings
            const settingsStr = localStorage.getItem('uki_bodybuild_settings');
            let avatar = localStorage.getItem('uki-bodybuild-avatar') || null;
            let nickname = 'BodyBuilder';
            if (settingsStr) {
                const settings = JSON.parse(settingsStr);
                nickname = settings.nickname || 'BodyBuilder';
            }

            await ShareUtils.generateTrainingReceipt(rec, avatar, nickname);
            
        } catch (error) {
            console.log('Błąd podczas udostępniania:', error);
            // Fallback: Copy to clipboard using prompt if writeText fails due to lack of focus
            try {
                window.prompt("Udostępnianie graficzne niedostępne na tym urządzeniu. Skopiuj swój wynik poniżej (Ctrl+C / Cmd+C):", textToShare);
            } catch(e) {
                console.error("Fallback również zawiódł", e);
            }
        }
    },

    exportTraining: async (trainingId) => {
        const records = window._cachedTrainingsHistory || [];
        const rec = records.find(r => String(r.id) === String(trainingId));
        if (!rec) {
            alert("Nie znaleziono treningu.");
            return;
        }
        
        // Prepare clean object for export
        const exportData = {
            ukiExportType: 'training',
            version: window.APP_VERSION,
            data: rec
        };
        
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `trening_${rec.date.replace(/-/g, '')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    importTraining: async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const jsonString = event.target.result;
                const importedData = JSON.parse(jsonString);
                
                if (importedData.ukiExportType !== 'training' || !importedData.data) {
                    alert("To nie jest poprawny plik z pojedynczym treningiem Uki's BodyBuild.");
                    return;
                }
                
                const rec = importedData.data;
                // Nowy wpis dostaje własny identyfikator z bazy (addTraining), więc stary id z pliku nie koliduje.
                delete rec.id;
                
                // Prompt user to confirm
                if (confirm(`Czy na pewno chcesz zaimportować trening "${rec.name}" z dnia ${rec.date}?`)) {
                    await window.DatabaseManager.addTraining(rec);
                    alert("Trening został pomyślnie zaimportowany!");
                    HistoryUI.loadHistory();
                }
            } catch (err) {
                console.error(err);
                alert("Błąd podczas importu treningu. Upewnij się, że plik jest prawidłowy.");
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset input
    }
};

window.HistoryUI = HistoryUI;
