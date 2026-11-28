// Analiza sylwetki: BF% (US Navy), FFMI, WHR i ich normy. Czyste funkcje, bez DOM i bez pamięci.
import { normalizeHeightCm, normalizeWeightKg } from '../diet/kcalGoal.js';

const positive = (v) => {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : null;
};

// Od najnowszego (data malejąco; przy tej samej dacie zostaje kolejność z bazy: created_at malejąco).
export function sortNewestFirst(measurements) {
    return [...(Array.isArray(measurements) ? measurements : [])]
        .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
}

// Najnowsza wartość każdego pola osobno: wpis z samą wagą nie ukrywa wzrostu, talii, szyi ani bioder.
export function latestBodyFields(measurements) {
    const out = { weight: null, height: null, waist: null, neck: null, hips: null };
    for (const m of sortNewestFirst(measurements)) {
        if (out.weight === null) out.weight = normalizeWeightKg(m.weight); // 25–350 kg, jak przy celu kalorycznym
        if (out.height === null) out.height = normalizeHeightCm(m.height);
        for (const k of ['waist', 'neck', 'hips']) {
            if (out[k] === null) out[k] = positive(m[k]);
        }
    }
    return out;
}

// US Navy (obwody w cm). Talia nie większa niż szyja = błędne dane → null (bez NaN).
// Biodra bez żadnych korekt: wzór jest skalibrowany na zwykłym pomiarze.
export function navyBodyFat({ sex, height, waist, neck, hips }) {
    if ((sex !== 'male' && sex !== 'female') || !height || !waist || !neck || waist <= neck) return null;
    let bf;
    if (sex === 'male') {
        bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
        if (!hips) return null;
        bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.22100 * Math.log10(height)) - 450;
    }
    return Number.isFinite(bf) ? Math.max(2, Math.min(60, bf)) : null;
}

// Normy BF% według ACE (American Council on Exercise), progi „poniżej”:
//   kobiety: niezbędny <14, sportowcy 14–20, fitness 21–24, przeciętnie 25–31, otyłość ≥32;
//   mężczyźni: <6, 6–13, 14–17, 18–24, ≥25.
const BF_THRESHOLDS = { female: [14, 21, 25, 32], male: [6, 14, 18, 25] };
const BF_SCALE_MAX = { female: 45, male: 40 };
export const BF_CATEGORIES = [
    { key: 'essential', text: 'Tłuszcz niezbędny (ekstremalnie niski)', short: 'Niezbędny' },
    { key: 'athletes', text: 'Wysportowana sylwetka (Atletyczna)', short: 'Atletyczna' },
    { key: 'fitness', text: 'Dobra kondycja (Fitness)', short: 'Fitness' },
    { key: 'average', text: 'Przeciętna sylwetka', short: 'Przeciętna' },
    { key: 'obese', text: 'Podwyższony poziom tkanki tłuszczowej', short: 'Wysoka' }
];
const BF_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#e67e22'];

// WHR według WHO (Waist circumference and waist-hip ratio, 2008): jeden próg „znacznie zwiększonego
// ryzyka powikłań metabolicznych” — mężczyźni ≥0.90, kobiety ≥0.85. WHO nie definiuje pasma pośredniego,
// więc są dwa pasma: poniżej progu i od progu.
const WHR_THRESHOLDS = { male: [0.90], female: [0.85] };
const WHR_SCALE_MAX = { male: 1.3, female: 1.2 };
export const WHR_CATEGORIES = [
    { key: 'low', text: 'Niskie ryzyko (poniżej progu WHO)', short: 'Poniżej progu' },
    { key: 'high', text: 'Wysokie ryzyko (WHO)', short: 'Wysokie (WHO)' }
];
const WHR_COLORS = ['#2ecc71', '#e74c3c'];

const category = (thresholds, list, value) => {
    if (!thresholds || value === null || value === undefined) return null;
    const i = thresholds.findIndex(t => value < t);
    return list[i === -1 ? list.length - 1 : i];
};

const ranges = (thresholds, scaleMax, list, colors) =>
    [...thresholds, scaleMax].map((max, i) => ({ label: list[i].short, max, color: colors[i] }));

export const bfCategory = (sex, bf) => category(BF_THRESHOLDS[sex], BF_CATEGORIES, bf);
export const whrCategory = (sex, whr) => category(WHR_THRESHOLDS[sex], WHR_CATEGORIES, whr);
// Paski w oknie informacji: te same progi co na karcie.
export const bfRanges = (sex) => ranges(BF_THRESHOLDS[sex] || BF_THRESHOLDS.male, BF_SCALE_MAX[sex] || BF_SCALE_MAX.male, BF_CATEGORIES, BF_COLORS);
// Bez płci nie ma norm WHR (null) — okno informacji prosi wtedy o ustawienie płci.
export const whrRanges = (sex) => (WHR_THRESHOLDS[sex] ? ranges(WHR_THRESHOLDS[sex], WHR_SCALE_MAX[sex], WHR_CATEGORIES, WHR_COLORS) : null);

// FFMI znormalizowany do 1,8 m.
export function ffmi(weight, height, bf) {
    if (!weight || !height || bf === null || bf === undefined) return null;
    const hm = height / 100;
    return (weight * (1 - bf / 100)) / (hm * hm) + 6.1 * (1.8 - hm);
}

// Wszystko, czego potrzebuje karta Sylwetka i prompt AI. `missing` = nazwy pól do uzupełnienia.
export function bodySummary(measurements, sex) {
    const fields = latestBodyFields(measurements);
    const missing = [];
    if (sex !== 'male' && sex !== 'female') missing.push('Płeć');
    if (!fields.height) missing.push('Wzrost');
    if (!fields.waist) missing.push('Talia');
    if (!fields.neck) missing.push('Szyja');
    if (sex === 'female' && !fields.hips) missing.push('Biodra');
    if (!missing.length && fields.waist <= fields.neck) missing.push('Talia (musi być większa niż szyja)');

    const bf = missing.length ? null : navyBodyFat({ sex, ...fields });
    // WHR zaokrąglony do 2 miejsc, tak jak go widać, żeby ocena zgadzała się z liczbą na karcie.
    const whr = fields.waist && fields.hips ? Math.round((fields.waist / fields.hips) * 100) / 100 : null;
    return {
        fields,
        missing,
        bf,
        bfCategory: bfCategory(sex, bf),
        ffmi: ffmi(fields.weight, fields.height, bf),
        whr,
        whrCategory: whrCategory(sex, whr)
    };
}

const round1 = (v) => (v === null || v === undefined ? null : Math.round(v * 10) / 10);

// Dane ciała do promptu AI: 5 najnowszych pomiarów w kolejności chronologicznej oraz profil (płeć, wiek, BF%, FFMI, WHR).
export function aiBodyContext(measurements, profile = {}) {
    const keys = ['weight', 'chest', 'waist', 'hips', 'thigh', 'biceps', 'neck'];
    const recent = sortNewestFirst(measurements).slice(0, 5).reverse().map(m => {
        const row = { date: m.date };
        for (const k of keys) {
            const v = positive(m[k]);
            if (v !== null) row[k] = v;
        }
        const h = normalizeHeightCm(m.height);
        if (h !== null) row.height = h;
        return row;
    });
    const sex = profile.sex === 'male' || profile.sex === 'female' ? profile.sex : null;
    const s = bodySummary(measurements, sex);
    return {
        pomiary_historia: recent,
        profil_ciala: {
            plec: sex === 'female' ? 'kobieta' : sex === 'male' ? 'mężczyzna' : 'nie podano',
            wiek_lat: Number.isFinite(profile.age) ? profile.age : 'nie podano',
            tkanka_tluszczowa_proc: s.bf !== null ? round1(s.bf) : 'brak danych',
            ffmi: s.ffmi !== null ? round1(s.ffmi) : 'brak danych',
            whr: s.whr !== null ? s.whr : 'brak danych'
        }
    };
}
