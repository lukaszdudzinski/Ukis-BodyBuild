// Podpowiedzi nazw ćwiczeń dla Zeszytu. Czysta logika, bez DOM.

export function normalize(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

function collectStrengthNames(exercises, out) {
  if (!Array.isArray(exercises)) return;
  for (const ex of exercises) {
    if (!ex) continue;
    if (ex.type === 'strength' && typeof ex.name === 'string' && ex.name.trim()) {
      out.push(ex.name.trim());
    } else if (ex.type === 'superset') {
      collectStrengthNames(ex.exercises, out);
    }
  }
}

export function buildSuggestionSource(trainings, catalog) {
  const names = [];
  for (const t of trainings || []) collectStrengthNames(t && t.exercises, names);

  // klucz (normalize) -> { count, spellings: Map(pisownia -> ile) }
  const groups = new Map();
  for (const name of names) {
    const key = normalize(name);
    let g = groups.get(key);
    if (!g) {
      g = { count: 0, spellings: new Map() };
      groups.set(key, g);
    }
    g.count += 1;
    g.spellings.set(name, (g.spellings.get(name) || 0) + 1);
  }

  const history = [];
  for (const g of groups.values()) {
    let best = null;
    let bestN = 0;
    for (const [spelling, n] of g.spellings) {
      if (n > bestN) { best = spelling; bestN = n; }
    }
    history.push({ name: best, count: g.count });
  }
  history.sort((a, b) => b.count - a.count); // sort jest stabilny: remis zachowuje kolejność pierwszego wystąpienia

  return { history, catalog: Array.isArray(catalog) ? catalog.slice() : [] };
}

export function suggest(query, source, limit = 6) {
  const q = normalize(query);
  if (!q || !source) return [];
  const seen = new Set();
  const out = [];
  const candidates = [
    ...(source.history || []).map((h) => h.name),
    ...(source.catalog || []),
  ];
  for (const name of candidates) {
    if (out.length >= limit) break;
    const key = normalize(name);
    if (seen.has(key) || !key.includes(q)) continue;
    seen.add(key);
    out.push(name);
  }
  return out;
}
