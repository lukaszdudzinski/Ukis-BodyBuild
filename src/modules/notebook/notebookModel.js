// Zeszyt: czysta logika kartki (bez DOM). Wszystkie funkcje zwracają nowe obiekty.
// Page = { exercises: [{ id, name, sets: [{ reps: number|null, weight: number|null }] }] }
// reps === null oznacza szkic serii (nie jest zapisywany).
// Seria może mieć `type` (np. 'warmup') — tylko gdy inny niż domyślny 'normal'.
// Page.extra (opcjonalnie) = ćwiczenia spoza Zeszytu (np. cardio) z zapisanego treningu: nie są pokazywane,
// ale wracają bez zmian (na końcu listy) przy każdym zapisie, więc kartka ich nie kasuje.

export function emptyPage() {
  return { exercises: [] };
}

export function sameName(a, b) {
  return String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
}

const cloneSet = (s) => (s.type ? { reps: s.reps, weight: s.weight, type: s.type } : { reps: s.reps, weight: s.weight });
const cloneExercise = (e) => ({ id: e.id, name: e.name, sets: e.sets.map(cloneSet) });
const withExtra = (next, page) => (page.extra && page.extra.length ? { ...next, extra: page.extra } : next);
const clonePage = (page) => withExtra({ exercises: page.exercises.map(cloneExercise) }, page);

// Ostatnia nie-null wartość pola z serii ćwiczenia (szkice null pomijamy).
function lastValue(sets, field) {
  for (let i = sets.length - 1; i >= 0; i--) {
    if (sets[i][field] !== null && sets[i][field] !== undefined) return sets[i][field];
  }
  return null;
}

const DEFAULT_COPY = { copyReps: true, copyWeight: false };

// options: { copyReps = true, copyWeight = false } — co skopiować z poprzednich serii do nowej.
export function addSet(page, exerciseId, options = DEFAULT_COPY) {
  const { copyReps, copyWeight } = { ...DEFAULT_COPY, ...options };
  const next = clonePage(page);
  const ex = next.exercises.find((e) => e.id === exerciseId);
  if (!ex) return { page: next, exerciseId, setIndex: -1 };
  ex.sets.push({
    reps: copyReps ? lastValue(ex.sets, 'reps') : null,
    weight: copyWeight ? lastValue(ex.sets, 'weight') : null,
  });
  return { page: next, exerciseId, setIndex: ex.sets.length - 1 };
}

export function addExercise(page, name, newId, options) {
  const existing = page.exercises.find((e) => sameName(e.name, name));
  if (existing) return addSet(page, existing.id, options);
  const next = clonePage(page);
  next.exercises.push({ id: newId, name: String(name).trim(), sets: [{ reps: null, weight: null }] });
  return { page: next, exerciseId: newId, setIndex: 0 };
}

export function updateSet(page, exerciseId, setIndex, patch) {
  const next = clonePage(page);
  const ex = next.exercises.find((e) => e.id === exerciseId);
  if (!ex || !ex.sets[setIndex]) return next;
  const set = ex.sets[setIndex];
  if (patch && 'reps' in patch) set.reps = patch.reps;
  if (patch && 'weight' in patch) set.weight = patch.weight;
  return next;
}

export function removeSet(page, exerciseId, setIndex) {
  const next = clonePage(page);
  const ex = next.exercises.find((e) => e.id === exerciseId);
  if (!ex) return next;
  ex.sets.splice(setIndex, 1);
  if (ex.sets.length === 0) next.exercises = next.exercises.filter((e) => e.id !== exerciseId);
  return next;
}

export function renameExercise(page, exerciseId, name) {
  const next = clonePage(page);
  const ex = next.exercises.find((e) => e.id === exerciseId);
  if (!ex) return next;
  const target = next.exercises.find((e) => e.id !== exerciseId && sameName(e.name, name));
  if (!target) {
    ex.name = String(name).trim();
    return next;
  }
  // Scalanie: serie przemianowanego idą na koniec pierwszego ćwiczenia o tej nazwie.
  target.sets.push(...ex.sets);
  next.exercises = next.exercises.filter((e) => e !== ex);
  return next;
}

export function removeExercise(page, exerciseId) {
  return withExtra({ exercises: page.exercises.filter((e) => e.id !== exerciseId).map(cloneExercise) }, page);
}

export function parseReps(text) {
  const t = String(text ?? '').trim();
  if (!/^\d+$/.test(t)) return null;
  const n = parseInt(t, 10);
  return n >= 1 && n <= 999 ? n : null;
}

export function parseWeight(text) {
  const t = String(text ?? '').trim().replace(',', '.');
  if (t === '') return 0;
  if (!/^\d+(\.\d*)?$|^\.\d+$/.test(t)) return null;
  const n = Math.round(parseFloat(t) * 10) / 10;
  return n >= 0 && n <= 999.9 ? n : null;
}

export function toExercisesJson(page) {
  const out = [];
  for (const e of page.exercises) {
    const sets = e.sets
      .filter((s) => s.reps !== null && s.reps !== undefined)
      .map((s) => ({ weight: s.weight ?? 0, reps: s.reps, type: s.type || 'normal' }));
    if (sets.length) out.push({ id: e.id, type: 'strength', name: e.name, sets });
  }
  if (page.extra) out.push(...page.extra);
  return out;
}

export function fromExercisesJson(exercises) {
  const list = (exercises || []).filter((e) => e);
  const page = {
    exercises: list
      .filter((e) => e.type === 'strength')
      .map((e) => ({
        id: e.id,
        name: e.name,
        sets: (e.sets || []).filter((s) => s && typeof s === 'object').map((s) => {
          const set = { reps: s.reps ?? null, weight: s.weight ?? null };
          if (s.type && s.type !== 'normal') set.type = s.type;
          return set;
        }),
      })),
  };
  const extra = list.filter((e) => e.type !== 'strength');
  return extra.length ? { ...page, extra } : page;
}

const pad = (n) => String(n).padStart(2, '0');

export function localDateStr(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function shiftDate(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return localDateStr(new Date(y, m - 1, d + days));
}

export function formatDayLabel(dateStr, todayStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const label = new Date(y, m - 1, d).toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
  return dateStr === todayStr ? `${label} · dziś` : label;
}
