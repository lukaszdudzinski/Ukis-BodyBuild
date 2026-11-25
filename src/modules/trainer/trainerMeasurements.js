// Pomiary klienta: pola, walidacja i serie do wykresu. Same funkcje czyste, bez DOM i bez sejfu.

export const BASE_FIELDS = [
    { id: 'weight', label: 'Waga', unit: 'kg' },
    { id: 'height', label: 'Wzrost', unit: 'cm' },
    { id: 'chest', label: 'Klatka', unit: 'cm' },
    { id: 'waist', label: 'Talia', unit: 'cm' },
    { id: 'hips', label: 'Biodra', unit: 'cm' },
    { id: 'thigh', label: 'Udo', unit: 'cm' },
    { id: 'biceps', label: 'Biceps', unit: 'cm' },
    { id: 'neck', label: 'Szyja', unit: 'cm' },
];

export const COMPOSITION_FIELDS = [
    { id: 'fat_pct', label: 'Tkanka tłuszczowa', unit: '%' },
    { id: 'fat_kg', label: 'Tkanka tłuszczowa', unit: 'kg' },
    { id: 'muscle_kg', label: 'Masa mięśniowa', unit: 'kg' },
    { id: 'water_pct', label: 'Woda', unit: '%' },
    { id: 'visceral', label: 'Tłuszcz trzewny', unit: 'poziom' },
    { id: 'bmr', label: 'BMR', unit: 'kcal' },
    { id: 'meta_age', label: 'Wiek metaboliczny', unit: 'lat' },
];

// Ustawienia mogą nie istnieć (rekord trainer_settings powstaje przy pierwszym zapisie): wtedy domyślne.
export function activeFields(settings) {
    const cfg = (settings && settings.measurementFields) || {};
    const comp = cfg.composition || {};
    const custom = Array.isArray(cfg.customFields) ? cfg.customFields : (settings && settings.customFields) || [];
    return [
        ...BASE_FIELDS,
        ...COMPOSITION_FIELDS.filter((f) => comp[f.id] !== false),
        ...custom.filter((f) => f && f.id && f.label && f.enabled !== false).map((f) => ({ id: f.id, label: f.label, unit: f.unit || '' })),
    ];
}

// Własne pola mają id c_<n>; wbudowane pola nie zaczynają się od „c_”, więc kolizji nie ma.
// Pól się nie usuwa, więc kolejny numer po największym nigdy nie trafi na stare dane.
export function nextCustomFieldId(customFields) {
    let max = 0;
    for (const f of Array.isArray(customFields) ? customFields : []) {
        const m = /^c_(\d+)$/.exec((f && f.id) || '');
        if (m) max = Math.max(max, Number(m[1]));
    }
    return `c_${max + 1}`;
}

export function parseNumber(raw) {
    const s = String(raw ?? '').trim().replace(',', '.');
    if (s === '' || !/^\d+(\.\d+)?$/.test(s)) return null;
    return Number(s);
}

export function validateMeasurement(values, fields) {
    const errors = {};
    const normalized = {};
    for (const f of fields) {
        const raw = String((values || {})[f.id] ?? '').trim();
        if (raw === '') continue;
        const n = parseNumber(raw);
        if (n === null || !Number.isFinite(n)) errors[f.id] = 'Wpisz liczbę większą lub równą zero.';
        else normalized[f.id] = n;
    }
    if (Object.keys(errors).length === 0 && Object.keys(normalized).length === 0) {
        errors._form = 'Wpisz co najmniej jedną wartość';
    }
    return { ok: Object.keys(errors).length === 0, errors, values: normalized };
}

export function seriesFor(measurements, fieldId) {
    return (measurements || [])
        .filter((m) => m.values && typeof m.values[fieldId] === 'number')
        .map((m) => ({ date: m.date, value: m.values[fieldId] }))
        .sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

export function formatNumber(n) {
    return String(Math.round(n * 100) / 100).replace('.', ',');
}
