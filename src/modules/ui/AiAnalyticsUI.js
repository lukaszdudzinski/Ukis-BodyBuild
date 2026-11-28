// wyglad: zar
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { AiAnalyticsEngine } from '../ai/AiAnalyticsEngine.js';
import { ikona } from '../wyglad/ikony.js';
import { bezpiecznyHtml } from '../wyglad/bezpiecznyHtml.js';

// Encje HTML dla tekstów wstawianych przez innerHTML (treść analizy pochodzi z AI).
const esc = (s) => String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
// Argument funkcji w atrybucie onclick="…": literał JS, a potem encje HTML (wzór z TrainingUI.js).
const jsArg = (v) => esc(JSON.stringify(v ?? null));

// Wywiad: żetony stażu i celu. `wartosc` to dokładnie to, co dawały opcje listy rozwijanej (trafia do AI i do localStorage).
const STAZ = [
    { wartosc: 'Początkujący (< 1 rok)', etykieta: '< 1 rok', pasuje: (z) => z.includes('Początkujący') },
    { wartosc: '1-3 lata (Średniozaawansowany)', etykieta: '1–3 lata', pasuje: (z) => z.includes('1-3 lata') },
    { wartosc: '3-5 lat (Zaawansowany)', etykieta: '3–5 lat', pasuje: (z) => z.includes('3-5 lat') },
    { wartosc: '5+ lat (Weteran / Zawodnik)', etykieta: '5+ lat', pasuje: (z) => z.includes('5+') },
];
const CEL = [
    { wartosc: 'Budowa masy mięśniowej (Hipertrofia)', etykieta: 'Hipertrofia', pasuje: (z) => z === 'bulk' || z.includes('mas') },
    { wartosc: 'Redukcja tkanki tłuszczowej (Spalanie tłuszczu)', etykieta: 'Rzeźba', pasuje: (z) => z === 'cut' || z.includes('reduk') },
    { wartosc: 'Rekompozycja i utrzymanie formy', etykieta: 'Rekompozycja', pasuje: (z) => z === 'maintenance' || z.includes('utrzy') },
    { wartosc: 'Budowa siły maksymalnej', etykieta: 'Siła', pasuje: (z) => z.includes('sił') },
];
// Jak `selected` na liście: ostatnia pasująca opcja wygrywa, bez dopasowania pierwsza.
const wybrana = (opcje, zapisane) => opcje.reduce((acc, o, i) => (o.pasuje(zapisane) ? i : acc), 0);

const zetony = (opcje, aktywna) => opcje.map((o, i) =>
    `<button type="button" class="z-chip${i === aktywna ? ' z-on' : ''}" aria-pressed="${i === aktywna}" data-wartosc="${esc(o.wartosc)}">${esc(o.etykieta)}</button>`).join('');

const MIESIACE = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];

export const AiAnalyticsUI = {
    render: async (container) => {
        container.innerHTML = `
            <div class="ai-ekran">
                <div class="ai-kafle">
                    <button type="button" id="ai-gen-weekly-btn" class="z-card z-hero ai-kafel">
                        <span class="ai-kafel-ikona">${ikona('sparkles', 22)}</span>
                        <span class="z-big">7 dni</span>
                        <span class="ai-kafel-nazwa">Analiza tygodniowa</span>
                    </button>
                    <button type="button" id="ai-gen-monthly-btn" class="z-card ai-kafel">
                        <span class="ai-kafel-ikona z-hi">${ikona('line-chart', 22)}</span>
                        <span class="z-big">30 dni</span>
                        <span class="ai-kafel-nazwa">Analiza miesięczna</span>
                    </button>
                </div>
                <div id="ai-status-bar" class="z-card ai-status" role="status" style="display:none;">
                    Trener Edward analizuje... To może potrwać kilkanaście sekund.
                </div>

                <div class="ai-sekcja-hd">
                    <h3 class="ai-sekcja-tyt">${ikona('clock', 18)} Historia analiz</h3>
                    <span class="z-mut">Archiwum postępów</span>
                </div>
                <div id="ai-history-list">
                    <p class="z-mut ai-pusto">Ładowanie historii...</p>
                </div>
            </div>
        `;

        const wymagajPro = (dni) => () => {
            if (window.PremiumUI && !window.PremiumUI.checkPremium()) {
                window.PremiumUI.showPremiumPaywall();
                return;
            }
            AiAnalyticsUI.openInterviewModal(dni);
        };
        document.getElementById('ai-gen-weekly-btn').addEventListener('click', wymagajPro(7));
        document.getElementById('ai-gen-monthly-btn').addEventListener('click', wymagajPro(30));

        await AiAnalyticsUI.loadHistory();
    },

    loadHistory: async () => {
        const listContainer = document.getElementById('ai-history-list');
        if (!listContainer) return;

        let analyses = [];
        try {
            analyses = await window.DatabaseManager.getAiAnalyses();
        } catch (e) {
            listContainer.innerHTML = '<p class="z-card ai-pusto ai-blad">Błąd ładowania historii analiz.</p>';
            return;
        }

        if (!analyses || analyses.length === 0) {
            listContainer.innerHTML = `<div class="z-card ai-puste">
                <span class="ai-kafel-ikona z-hi">${ikona('bot', 28)}</span>
                <p class="z-sub">Brak historii analiz.<br>Wygeneruj pierwszą — Edward czeka!</p>
            </div>`;
            return;
        }

        const grouped = {};
        analyses.forEach(a => {
            const d = new Date(a.date);
            const year = d.getFullYear();
            const monthKey = year + '-' + String(d.getMonth()).padStart(2, '0');
            const monthName = MIESIACE[d.getMonth()] + ' ' + year;
            if (!grouped[year]) grouped[year] = {};
            if (!grouped[year][monthKey]) grouped[year][monthKey] = { name: monthName, items: [] };
            grouped[year][monthKey].items.push(a);
        });

        let html = '';
        const years = Object.keys(grouped).sort((a, b) => b - a);

        years.forEach((year, yi) => {
            const totalInYear = Object.values(grouped[year]).reduce((s, m) => s + m.items.length, 0);
            html += `<details class="ai-rok"${yi === 0 ? ' open' : ''}>`
                + `<summary class="ai-sum"><span>${esc(year)}</span><span class="z-sub">${totalInYear} analiz</span>${ikona('chevron-down', 18)}</summary>`
                + '<div class="ai-grupa">';

            const months = Object.keys(grouped[year]).sort((a, b) => b.localeCompare(a));
            months.forEach((monthKey, mi) => {
                const month = grouped[year][monthKey];
                html += `<details class="ai-miesiac"${yi === 0 && mi === 0 ? ' open' : ''}>`
                    + `<summary class="ai-sum"><span>${esc(month.name)}</span><span class="z-sub">${month.items.length}</span>${ikona('chevron-down', 18)}</summary>`
                    + '<div class="ai-grupa">';

                month.items.forEach(a => {
                    const dateStr = new Date(a.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' });
                    const typeLabel = a.type === 'monthly' ? 'Analiza miesięczna' : 'Analiza tygodniowa';
                    html += '<div class="z-card ai-karta">'
                        + '<div class="ai-karta-opis">'
                        + `<span class="ai-karta-nazwa">${typeLabel}</span>`
                        + `<span class="z-mut">${esc(dateStr)}</span>`
                        + '</div>'
                        + '<div class="ai-karta-akcje">'
                        + `<button type="button" class="z-chip z-on" onclick="window.AiAnalyticsUI.showReport(${jsArg(a.id)})">Czytaj</button>`
                        + `<button type="button" class="z-chip" aria-label="Usuń analizę" onclick="window.AiAnalyticsUI.deleteReport(${jsArg(a.id)})">Usuń</button>`
                        + '</div>'
                        + '</div>';
                });
                html += '</div></details>';
            });
            html += '</div></details>';
        });

        listContainer.innerHTML = html;
    },

    openInterviewModal: (days) => {
        let modal = document.getElementById('ai-interview-modal');
        if (modal) modal.remove();
        modal = document.createElement('div');
        modal.id = 'ai-interview-modal';
        modal.className = 'z-sheet-scrim';

        const savedExp = localStorage.getItem('trainingExperience') || '1-3 lata (Średniozaawansowany)';
        const savedGoal = localStorage.getItem('dietGoal') || 'bulk';

        modal.innerHTML = `
            <div class="z-sheet ai-wywiad" role="dialog" aria-modal="true" aria-labelledby="ai-wywiad-tyt">
                <div class="z-sheet-grip"></div>
                <div class="ai-wywiad-glowa">
                    <h3 id="ai-wywiad-tyt" class="z-hd ai-wywiad-tyt">Wywiad trenera Edwarda</h3>
                    <p class="z-sub">Analiza dla okresu: <strong class="ai-okres">ostatnie ${Number(days)} dni</strong>. Uzupełnij parametry, aby Edward przygotował precyzyjne zalecenia.</p>
                </div>

                <div class="ai-pole">
                    <label class="z-lab" for="ai-sleep-val">Średni sen na dobę</label>
                    <div class="ai-sen">
                        <button id="ai-sleep-minus" type="button" class="z-ic z-card" aria-label="Mniej snu">${ikona('minus', 20)}</button>
                        <input id="ai-sleep-val" class="z-in ai-sen-pole" type="number" inputmode="decimal" min="0" max="12" step="0.5" value="7">
                        <span class="z-sub">h</span>
                        <button id="ai-sleep-plus" type="button" class="z-ic z-card" aria-label="Więcej snu">${ikona('plus', 20)}</button>
                    </div>
                </div>

                <div class="ai-pole">
                    <span class="z-lab" id="ai-staz-etykieta">Twój staż treningowy</span>
                    <div id="ai-interview-exp" class="ai-zetony" role="group" aria-labelledby="ai-staz-etykieta">${zetony(STAZ, wybrana(STAZ, savedExp))}</div>
                </div>

                <div class="ai-pole">
                    <span class="z-lab" id="ai-cel-etykieta">Główny cel sylwetkowy</span>
                    <div id="ai-interview-goal" class="ai-zetony" role="group" aria-labelledby="ai-cel-etykieta">${zetony(CEL, wybrana(CEL, savedGoal))}</div>
                </div>

                <div class="ai-akcje">
                    <button id="ai-interview-submit" type="button" class="z-btn">${ikona('sparkles', 20)} Generuj analizę</button>
                    <button id="ai-interview-cancel" type="button" class="z-ghost">Anuluj</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Żetony działają jak grupa przycisków: dokładnie jeden aktywny (aria-pressed).
        modal.querySelectorAll('#ai-interview-exp, #ai-interview-goal').forEach((grupa) => {
            grupa.addEventListener('click', (e) => {
                const wybrany = e.target.closest('button[data-wartosc]');
                if (!wybrany) return;
                grupa.querySelectorAll('button[data-wartosc]').forEach((b) => {
                    const on = b === wybrany;
                    b.setAttribute('aria-pressed', String(on));
                    b.classList.toggle('z-on', on);
                });
            });
        });

        const senEl = document.getElementById('ai-sleep-val');
        const odczytSnu = () => {
            const v = parseFloat(String(senEl.value).replace(',', '.'));
            return Number.isFinite(v) ? Math.min(12, Math.max(0, v)) : 7;
        };
        document.getElementById('ai-sleep-minus').onclick = () => { senEl.value = String(Math.max(0, odczytSnu() - 0.5)); };
        document.getElementById('ai-sleep-plus').onclick = () => { senEl.value = String(Math.min(12, odczytSnu() + 0.5)); };

        const zamknij = () => { modal.remove(); document.removeEventListener('keydown', naKlawisz); };
        const naKlawisz = (e) => { if (e.key === 'Escape') zamknij(); };
        document.addEventListener('keydown', naKlawisz);
        document.getElementById('ai-interview-cancel').onclick = zamknij;

        document.getElementById('ai-interview-submit').onclick = async () => {
            const expVal = modal.querySelector('#ai-interview-exp [aria-pressed="true"]').dataset.wartosc;
            const goalVal = modal.querySelector('#ai-interview-goal [aria-pressed="true"]').dataset.wartosc;
            const sleepVal = odczytSnu();

            localStorage.setItem('trainingExperience', expVal);
            localStorage.setItem('dietGoal', goalVal);

            zamknij();
            await AiAnalyticsUI.generateAnalysis(days, {
                sleepHours: sleepVal,
                experience: expVal,
                goal: goalVal
            });
        };
    },

    generateAnalysis: async (days, params = {}) => {
        const statusBar = document.getElementById('ai-status-bar');
        const weeklyBtn = document.getElementById('ai-gen-weekly-btn');
        const monthlyBtn = document.getElementById('ai-gen-monthly-btn');

        // Walidacja — sprawdź czy są jakiekolwiek dane do analizy
        try {
            const allTrainings = await window.DatabaseManager.getTrainings();
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - days);
            const startStr = startDate.toISOString().split('T')[0];
            const endStr = endDate.toISOString().split('T')[0];
            const recentTrainings = (allTrainings || []).filter(t => t.date >= startStr && t.date <= endStr);

            if (recentTrainings.length === 0) {
                AiAnalyticsUI._showNoDataModal(days);
                return;
            }
        } catch(e) {
            console.warn('Nie udało się sprawdzić treningów przed analizą:', e);
        }

        if (statusBar) statusBar.style.display = 'block';
        if (weeklyBtn) weeklyBtn.disabled = true;
        if (monthlyBtn) monthlyBtn.disabled = true;
        try {
            const result = await AiAnalyticsEngine.generate(days, params);
            if (result && typeof result === 'string') {
                await window.DatabaseManager.saveAiAnalysis(
                    days <= 7 ? 'weekly' : 'monthly',
                    result
                );
                await AiAnalyticsUI.loadHistory();
                const analyses = await window.DatabaseManager.getAiAnalyses();
                if (analyses && analyses.length > 0) AiAnalyticsUI.showReport(analyses[0].id);
            } else {
                alert('Trener Edward nie odpowiedział. Sprawdź połączenie i URL workera w Ustawieniach.');
            }
        } catch (e) {
            console.error('AI Analysis error:', e);
            if (window.ukiLogError) window.ukiLogError('AI Analysis error', e.stack || e.toString());
            alert('Błąd generowania analizy: ' + (e.message || 'Nieznany błąd'));
        } finally {
            if (statusBar) statusBar.style.display = 'none';
            if (weeklyBtn) weeklyBtn.disabled = false;
            if (monthlyBtn) monthlyBtn.disabled = false;
        }
    },

    _showNoDataModal: (days) => {
        let modal = document.getElementById('ai-nodata-modal');
        if (modal) modal.remove();
        modal = document.createElement('div');
        modal.id = 'ai-nodata-modal';
        modal.className = 'z-dialog-scrim';
        modal.innerHTML = `<div class="z-dialog ai-brak" role="alertdialog" aria-modal="true" aria-labelledby="ai-brak-tyt" aria-describedby="ai-brak-opis">
            <span class="ai-kafel-ikona z-hi">${ikona('bot', 28)}</span>
            <h3 id="ai-brak-tyt" class="z-hd ai-wywiad-tyt">Brak danych do analizy</h3>
            <p id="ai-brak-opis" class="z-sub">Edward nie ma czego analizować — w ciągu ostatnich <strong class="ai-okres">${Number(days)} dni</strong> nie zostały zapisane żadne treningi.<br><br>Zaloguj co najmniej jeden trening, a Edward chętnie oceni Twoje postępy!</p>
            <div class="z-dialog-actions"><button id="ai-nodata-close" type="button" class="z-btn">Rozumiem, zaraz trenuję!</button></div>
        </div>`;
        document.body.appendChild(modal);
        document.getElementById('ai-nodata-close').onclick = () => modal.remove();
    },

    showReport: async (id) => {
        let analyses = [];
        try { analyses = await window.DatabaseManager.getAiAnalyses(); } catch (e) { return; }
        const analysis = analyses.find(a => a.id === id);
        if (!analysis) return;

        let modal = document.getElementById('ai-report-modal');
        if (modal) modal.remove();
        modal = document.createElement('div');
        modal.id = 'ai-report-modal';
        modal.className = 'ai-czytnik';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'ai-czytnik-tyt');

        const typeLabel = analysis.type === 'monthly' ? 'Analiza miesięczna' : 'Analiza tygodniowa';
        const dateStr = new Date(analysis.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

        let parsedContent;
        try { parsedContent = bezpiecznyHtml(marked.parse(analysis.content)); }
        catch (e) { parsedContent = '<p style="white-space:pre-wrap;">' + esc(analysis.content) + '</p>'; }

        const idArg = jsArg(analysis.id);
        modal.innerHTML = `
            <div class="ai-czytnik-glowa">
                <button id="ai-report-back-top" type="button" class="z-ic z-card" aria-label="Powrót">${ikona('chevron-left', 20)}</button>
                <div class="ai-czytnik-opis">
                    <div id="ai-czytnik-tyt" class="ai-czytnik-tyt">${typeLabel}</div>
                    <div class="z-mut">${esc(dateStr)}</div>
                </div>
                <div class="ai-czytnik-akcje">
                    <button type="button" class="z-ic z-card" aria-label="Zapisz proponowany plan do Szablonów" title="Zapisz proponowany plan do Szablonów" onclick="window.AiAnalyticsUI.importPlanToTemplates(${idArg})">${ikona('copy', 20)}</button>
                    <button type="button" class="z-ic z-card" aria-label="Pobierz plik tekstowy" title="Pobierz plik tekstowy" onclick="window.AiAnalyticsUI.exportTxt(${idArg})">${ikona('download', 20)}</button>
                    <button id="ai-report-close-top" type="button" class="z-ic z-card" aria-label="Zamknij">${ikona('x', 20)}</button>
                </div>
            </div>

            <div class="ai-czytnik-tresc">
                <div class="z-card ai-tresc">
                    ${parsedContent}
                </div>
                <div class="ai-czytnik-dol">
                    <button type="button" class="z-btn" onclick="window.AiAnalyticsUI.importPlanToTemplates(${idArg})">${ikona('copy', 20)} Zapisz proponowany trening jako szablon</button>
                    <button type="button" class="z-ghost" onclick="window.AiAnalyticsUI.exportTxt(${idArg})">${ikona('download', 20)} Raport TXT</button>
                    <button id="ai-report-back-bottom" type="button" class="z-ghost">Wróć do aplikacji</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeModal = () => { modal.remove(); document.removeEventListener('keydown', naKlawisz); };
        const naKlawisz = (e) => { if (e.key === 'Escape') closeModal(); };
        document.addEventListener('keydown', naKlawisz);
        document.getElementById('ai-report-back-top').onclick = closeModal;
        document.getElementById('ai-report-close-top').onclick = closeModal;
        document.getElementById('ai-report-back-bottom').onclick = closeModal;
        document.getElementById('ai-report-back-top').focus();
    },

    importPlanToTemplates: async (id) => {
        let analyses = [];
        try { analyses = await window.DatabaseManager.getAiAnalyses(); } catch(e) { return; }
        const analysis = analyses.find(a => a.id === id);
        if (!analysis) return;

        const content = analysis.content || '';
        
        // Parsowanie ćwiczeń z sekcji planu treningowego
        const exercises = [];
        const lines = content.split('\n');
        let inPlanSection = false;

        for (let line of lines) {
            const clean = line.trim();
            if (clean.toLowerCase().includes('plan treningowy') || clean.toLowerCase().includes('proponowany plan')) {
                inPlanSection = true;
                continue;
            }

            if (inPlanSection || lines.length < 50) {
                // Szukamy linii zaczynających się od myślnika lub liczby np. "- Wyciskanie sztangi - 4 serie x 10-12 powt"
                if (clean.startsWith('-') || clean.startsWith('*') || /^\d+\./.test(clean)) {
                    let exText = clean.replace(/^[-*\d.]+\s*/, '').replace(/\*\*/g, '').trim();
                    if (exText.length > 3) {
                        // Wyciągnij nazwę ćwiczenia (wszystko przed myślnikiem lub dwukropkiem jeśli jest)
                        let exName = exText;
                        let setsCount = 4;
                        let repsCount = 10;
                        let weightCount = 0;

                        if (exText.includes('-') || exText.includes(':')) {
                            const parts = exText.split(/[-:]/);
                            exName = parts[0].trim();
                            const details = parts.slice(1).join(' ');
                            
                            const setsMatch = details.match(/(\d+)\s*(?:seri|ser)/i);
                            if (setsMatch) setsCount = parseInt(setsMatch[1]);

                            const repsMatch = details.match(/(\d+)(?:-\d+)?\s*(?:powt|powtórzeń|reps)/i);
                            if (repsMatch) repsCount = parseInt(repsMatch[1]);
                        }

                        // Tworzenie zestawu serii
                        const sets = [];
                        for (let s = 1; s <= Math.min(10, Math.max(1, setsCount)); s++) {
                            sets.push({ weight: weightCount, reps: repsCount, isCompleted: false });
                        }

                        exercises.push({
                            id: 'ex_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                            name: exName,
                            type: 'strength',
                            sets: sets
                        });
                    }
                }
            }
        }

        // Jeśli nie znaleziono automatycznie, stwórzmy domyślny zestaw z nazwami ćwiczeń
        if (exercises.length === 0) {
            exercises.push(
                { id: 'ex_1', name: 'Zalecane ćwiczenie 1 (od Edwarda)', type: 'strength', sets: [{ weight: 50, reps: 10, isCompleted: false }, { weight: 50, reps: 10, isCompleted: false }, { weight: 50, reps: 10, isCompleted: false }] },
                { id: 'ex_2', name: 'Zalecane ćwiczenie 2 (od Edwarda)', type: 'strength', sets: [{ weight: 40, reps: 12, isCompleted: false }, { weight: 40, reps: 12, isCompleted: false }, { weight: 40, reps: 12, isCompleted: false }] }
            );
        }

        const defaultPlanName = `Plan Edwarda: ${analysis.type === 'monthly' ? 'Miesięczny' : 'Tygodniowy'} (${new Date().toLocaleDateString('pl-PL')})`;
        const planName = prompt("Podaj nazwę dla nowego Planu Treningowego od Trenera Edwarda:", defaultPlanName);
        if (!planName || planName.trim() === '') return;

        const newTemplate = {
            id: Date.now(),
            name: planName.trim(),
            type: 'strength',
            duration_seconds: 3600,
            exercises: exercises
        };

        let templates = [];
        try {
            const tmps = localStorage.getItem('uki_workout_templates');
            if (tmps) templates = JSON.parse(tmps);
        } catch(e) {}

        templates.push(newTemplate);
        localStorage.setItem('uki_workout_templates', JSON.stringify(templates));

        if (window.ChatUI) {
            window.ChatUI.showContextualBubble(`Świetnie! Plan "${newTemplate.name}" (${exercises.length} ćwiczeń) został zapisany w Twoich Szablonach! Możesz go załadować w zakładce Trening.`);
        } else {
            alert(`Plan "${newTemplate.name}" został pomyślnie zapisany w Szablonach!`);
        }
    },

    exportTxt: async (id) => {
        let analyses = [];
        try { analyses = await window.DatabaseManager.getAiAnalyses(); } catch(e) { return; }
        const analysis = analyses.find(a => a.id === id);
        if (!analysis) return;

        const dateStr = new Date(analysis.date).toLocaleDateString('pl-PL', {day:'numeric', month:'long', year:'numeric'}).replace(/ /g, '_');
        const fileName = `Raport_Trener_Edward_${analysis.type}_${dateStr}.txt`;
        
        const blob = new Blob([analysis.content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    deleteReport: async (id) => {
        if (!confirm('Czy na pewno chcesz usunąć tę analizę?')) return;
        try { await window.DatabaseManager.deleteAiAnalysis(id); await AiAnalyticsUI.loadHistory(); }
        catch(e) { alert('Błąd usuwania analizy.'); }
    }
};

window.AiAnalyticsUI = AiAnalyticsUI;
