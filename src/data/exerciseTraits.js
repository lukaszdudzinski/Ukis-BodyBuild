// Cechy ćwiczenia potrzebne w sesji i w analizie: partia (atlas regeneracji), ciężar ciała w tonażu
// i to, czy w sesji liczymy rekord PR. Dla ćwiczeń z katalogu (także pod dawną nazwą) decydują dane katalogu;
// dawne słowa kluczowe w nazwie zostają tylko dla ćwiczeń własnych spoza katalogu.
// Czysta logika, bez DOM. Wygląd klasyczny importuje ten moduł (classic-app/src/data/exerciseTraits.js).
import { findExercise, exerciseMuscleGroup, sameExercise } from './ExerciseCatalog.js';

const lower = (name) => String(name ?? '').toLowerCase();

// Dotychczasowe słowa kluczowe (sesja: bez PR dla ćwiczeń z ciężarem ciała; tonaż: współczynnik ciężaru ciała;
// atlas: partie). Używane wyłącznie dla nazw spoza katalogu.
const PR_SKIP_KEYWORDS = ['brzuch', 'brzus', 'podciąg', 'podciag', 'pompk', 'plank', 'deska', 'drąż', 'draz'];
const ATLAS_KEYWORDS = {
    chest: ['klat', 'wycisk', 'rozpięt', 'pompk'],
    back: ['plec', 'wiosł', 'drąż', 'martw', 'szrug', 'podciąg'],
    legs: ['nog', 'przys', 'wykrok', 'suwn', 'łyd'],
    shoulders: ['bark', 'żołnierz', 'unoszen'],
    arms: ['bic', 'tric', 'uginan', 'francusk'],
    core: ['brzuch', 'plank', 'desk', 'brzus'],
};
const GROUP_TO_ATLAS = {
    klatka: 'chest', plecy: 'back', nogi: 'legs', barki: 'shoulders', triceps: 'arms', biceps: 'arms', brzuch: 'core',
};

// Czy w sesji pominąć rekord PR (ćwiczenie z ciężarem ciała). Pusta nazwa: nie pomijamy (jak dotąd).
export function skipsRecord(name) {
    const e = findExercise(name);
    if (e) return e.category === 'Brzuch' || e.bodyweightOnly === true;
    const n = lower(name);
    return !!n && PR_SKIP_KEYWORDS.some((kw) => n.includes(kw));
}

// Część ciężaru ciała doliczana do tonażu serii (0, gdy nic).
export function bodyweightFactor(name) {
    const e = findExercise(name);
    if (e) return typeof e.bodyweight === 'number' ? e.bodyweight : 0;
    const n = lower(name);
    if (n.includes('pompk')) return 0.65;
    if (n.includes('podciąg') || n.includes('drąż') || n.includes('brzuszk') || n.includes('wspięcia')) return 1;
    return 0;
}

// Partie atlasu regeneracji (chest, back, legs, shoulders, arms, core), które ćwiczenie obciąża.
export function atlasMuscles(name) {
    if (findExercise(name)) {
        const group = exerciseMuscleGroup(name);
        return group ? [GROUP_TO_ATLAS[group]] : [];
    }
    const n = lower(name);
    if (!n) return [];
    return Object.keys(ATLAS_KEYWORDS).filter((key) => ATLAS_KEYWORDS[key].some((kw) => n.includes(kw)));
}

const oneRm = (s) => (s.weight || 0) * (1 + ((s.reps || 0) / 30));

// Rekord PR nowej serii w sesji. null: rekordu nie liczymy (ciężar ciała, brak ciężaru albo powtórzeń).
// isPR: seria jest rekordem; beaten: pobija wcześniejszy rekord (wtedy gratulacje), a nie jest pierwszą serią w historii.
// Historia obejmuje treningi pod dawną i nową nazwą ćwiczenia (także w superseriach) oraz serie z bieżącej sesji.
export function recordCheck(trainings, name, currentSets, newSet) {
    if (skipsRecord(name) || !(newSet.weight > 0) || !(newSet.reps > 0)) return null;
    const current = newSet.weight * (1 + (newSet.reps / 30));
    let best = 0;
    if (name && Array.isArray(trainings)) {
        const check = (ex) => {
            if (ex && ex.name && sameExercise(ex.name, name) && Array.isArray(ex.sets)) {
                ex.sets.forEach((s) => { best = Math.max(best, oneRm(s)); });
            }
        };
        for (const t of trainings) {
            if (!t || !Array.isArray(t.exercises)) continue;
            for (const e of t.exercises) {
                if (e && e.type === 'superset' && Array.isArray(e.exercises)) e.exercises.forEach(check);
                else check(e);
            }
        }
    }
    if (Array.isArray(currentSets)) currentSets.forEach((s) => { best = Math.max(best, oneRm(s)); });
    if (current > best && best > 0) return { isPR: true, beaten: true };
    if (best === 0) return { isPR: true, beaten: false };
    return { isPR: false, beaten: false };
}

// Podpowiedź asystenta mapowania (Diagnostyka) dla nazwy spoza katalogu: nazwa główna z katalogu albo ''.
export function suggestCatalogName(unknown) {
    const lw = lower(unknown);
    if (lw.includes('płask') && lw.includes('wycisk')) return 'Wyciskanie sztangi na ławce płaskiej';
    if (lw.includes('rozpi') && lw.includes('płas')) return 'Rozpiętki';
    if (lw.includes('przysiad')) return 'Przysiad ze sztangą z tyłu';
    if (lw.includes('martw') || lw.includes(' mc')) return 'Martwy ciąg';
    if (lw.includes('wiosł') || lw.includes('wioslo')) return 'Wiosłowanie sztangą';
    if (lw.includes('brzuch') || lw.includes('brzus') || lw.includes('spi')) return 'Brzuch - Ławka skośna';
    return '';
}
