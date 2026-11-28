// Cele makroskładników zależne od celu diety (spec 2026-11-28-bodybuild-makro-cel, §3.2–3.5).
// Czyste funkcje: bez DOM i bez pamięci; „dziś” (`now`) podaje wywołujący.
import { normalizeWeightKg, normalizeHeightCm, normalizeDietGoal, sortNewestFirst, round10, ADULT_AGE } from './kcalGoal.js';
import { navyBodyFat } from '../body/bodyMetrics.js';

// Białko w g/kg wagi odniesienia W: [dolna granica, punkt do liczenia, górna granica].
const PROTEIN_PER_KG = { maintenance: [1.6, 1.8, 2.0], bulk: [1.6, 1.8, 2.2], cut: [1.8, 2.2, 2.7] };
// Redukcja ze znanym BF% (szczupli): g/kg beztłuszczowej masy ciała (ISSN 2017, Helms 2014).
const PROTEIN_PER_FFM_CUT = [2.3, 2.6, 3.1];
const FAT_SHARE = { maintenance: 0.30, bulk: 0.25, cut: 0.25 };
const FAT_MIN_SHARE = 0.20;
const FAT_MAX_SHARE = 0.35;
const FAT_FLOOR_PER_KG = { female: 0.7, male: 0.6 };
const BF_REF = { female: 0.30, male: 0.20 };
const BF_REF_UNKNOWN = 0.25;
const BMI_CAP = 27.5;
const CARBS_MIN_PER_KG = 3;
const CARBS_MIN_G = 130;
const SENIOR_AGE = 65;
const SENIOR_PROTEIN_PER_KG = 1.2;
const WEIGHT_FRESH_DAYS = 30;
const BF_FRESH_DAYS = 60;
// Po przesunięciu braku węglowodanów wynik bywa 239,9999…; to nie jest „za mało”.
const EPS = 1e-6;

export const MACRO_MESSAGES = {
    lowCarbs: 'Mało węglowodanów – trening może być słabszy.',
    tooLowKcal: 'Cel kalorii jest za niski dla treningu – rozważ mniejszy deficyt.',
    noRoom: 'Cel kalorii nie pokrywa białka i tłuszczu.',
    belowFloor: (floor) => `Cel jest niższy niż bezpieczne minimum (${floor} kcal).`,
    teenCut: 'U nastolatków redukcję warto skonsultować z lekarzem lub dietetykiem.',
    staleWeight: 'Ostatnia waga ma ponad 30 dni – zaktualizuj wagę w Pomiarach.',
    addHeight: 'Dodaj wzrost w Pomiarach, żeby cele były dokładniejsze.',
    addCircumferences: 'Dodaj obwody w Pomiarach, by policzyć skład ciała.',
    perMeal: 'Białko rozłóż na 3–4 posiłki po ok. 0,4 g/kg masy ciała.',
    noWeight: 'Dodaj wagę w Pomiarach, żeby wyliczyć cele makro.'
};

// Jedno zdanie „dlaczego tyle?” na cel.
export const GOAL_WHY = {
    cut: 'Na redukcji więcej białka chroni mięśnie.',
    maintenance: 'Na utrzymaniu białko wspiera regenerację, a węglowodany trening.',
    bulk: 'Na masie najwięcej węglowodanów – to paliwo do treningu.'
};

const round5 = (v) => Math.round(v / 5) * 5;
const positive = (v) => {
    const n = Number(v);
    return v !== null && v !== '' && Number.isFinite(n) && n > 0 ? n : null;
};

// Pełne dni od daty pomiaru (RRRR-MM-DD) do dziś (data UTC, jak „dziś” Diety). Brak daty → nieskończenie dawno.
function daysSince(date, now) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(date ?? ''));
    if (!m) return Infinity;
    const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    return Math.round((today - Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))) / 86400000);
}

// Najnowsza poprawna waga i wzrost oraz BF% (US Navy) z obwodów, jak na karcie Sylwetka (każde pole osobno).
// BF% liczy się tylko przy znanej płci i gdy najstarszy użyty obwód ma ≤ 60 dni.
function readBody(measurements, sex, now) {
    let weight = null;
    let weightDate = null;
    let height = null;
    const circ = { waist: null, neck: null, hips: null };
    const circDate = {};
    for (const m of sortNewestFirst(measurements)) {
        if (!m) continue;
        if (weight === null) {
            weight = normalizeWeightKg(m.weight);
            if (weight !== null) weightDate = m.date;
        }
        if (height === null) height = normalizeHeightCm(m.height);
        for (const k of Object.keys(circ)) {
            if (circ[k] === null && positive(m[k]) !== null) {
                circ[k] = positive(m[k]);
                circDate[k] = m.date;
            }
        }
    }
    let bf = null;
    if (weight !== null && height !== null && (sex === 'male' || sex === 'female')) {
        const used = sex === 'female' ? ['waist', 'neck', 'hips'] : ['waist', 'neck'];
        const age = Math.max(...used.map((k) => (circ[k] === null ? Infinity : daysSince(circDate[k], now))));
        if (age <= BF_FRESH_DAYS) bf = navyBodyFat({ sex, height, ...circ });
    }
    return { weight, weightDays: daysSince(weightDate, now), height, bf };
}

// Cele makro dla celu kcal w użyciu (ręcznego albo wyliczonego). `measurements` z bazy Pomiarów.
// `manual` + `floor` (podłoga z computeKcalTarget) → ostrzeżenie, gdy ręczny cel jest poniżej podłogi.
// Zwraca null bez wagi. Inaczej { W, basis, bf, protein: { low, target, high }, fat: { target, floor },
// carbs (null, gdy kalorii nie starcza na białko i tłuszcz), messages: [{ level, text }] od najważniejszego, hints }.
export function computeMacroTargets(measurements, { kcal, goal, sex = null, age = null, manual = false, floor = null, now = new Date() } = {}) {
    if (!Number.isFinite(kcal) || kcal <= 0) return null;
    const { weight, weightDays, height, bf } = readBody(measurements, sex, now);
    if (weight === null) return null;
    const g = normalizeDietGoal(goal);
    const female = sex === 'female';
    const hints = [];
    if (weightDays > WEIGHT_FRESH_DAYS) hints.push(MACRO_MESSAGES.staleWeight);

    // Waga odniesienia W (§3.2): przy dużym BF% albo BMI białko nie rośnie razem z tkanką tłuszczową.
    let W = weight;
    let basis = 'weight';
    let ffm = null;
    if (bf !== null) {
        ffm = weight * (1 - bf / 100);
        const ref = BF_REF[sex] ?? BF_REF_UNKNOWN;
        if (bf / 100 > ref) {
            W = ffm / (1 - ref);
            basis = 'bf-cap';
        } else {
            basis = 'bf';
        }
    } else if (height !== null) {
        const cap = BMI_CAP * (height / 100) ** 2;
        if (weight > cap) {
            W = cap;
            basis = 'bmi';
            hints.push(MACRO_MESSAGES.addCircumferences);
        }
    } else {
        hints.push(MACRO_MESSAGES.addHeight);
    }

    let [pLow, pMid, pHigh] = g === 'cut' && basis === 'bf'
        ? PROTEIN_PER_FFM_CUT.map((f) => f * ffm)
        : PROTEIN_PER_KG[g].map((f) => f * W);
    const senior = Number.isFinite(age) && age >= SENIOR_AGE;
    if (senior) {
        pLow = Math.max(pLow, SENIOR_PROTEIN_PER_KG * weight);
        pMid = Math.max(pMid, pLow);
        pHigh = Math.max(pHigh, pLow);
        hints.unshift(MACRO_MESSAGES.perMeal); // pierwsza: nie może jej zasłonić prośba o wagę, wzrost czy obwody
    }

    // Algorytm §3.3: tłuszcz między podłogą a 35% kcal, węglowodany to reszta; brak węgli do 3 g/kg pokrywa
    // najpierw tłuszcz (do podłogi), potem białko (do dolnej granicy).
    const fFloor = Math.max(FAT_MIN_SHARE * kcal / 9, W * (female ? FAT_FLOOR_PER_KG.female : FAT_FLOOR_PER_KG.male));
    let F = Math.max(FAT_SHARE[g] * kcal / 9, fFloor);
    F = Math.min(F, Math.max(FAT_MAX_SHARE * kcal / 9, fFloor));
    let P = pMid;
    let C = (kcal - 4 * P - 9 * F) / 4;
    const cMin = CARBS_MIN_PER_KG * W;
    if (C < cMin) {
        let short = (cMin - C) * 4;
        const dF = Math.min(short / 9, F - fFloor);
        F -= dF;
        short -= 9 * dF;
        P -= Math.min(short / 4, P - pLow);
        C = (kcal - 4 * P - 9 * F) / 4;
    }

    const messages = [];
    // Uwaga dla nastolatków przed uwagą o węglach (ta sama waga „info”, sortowanie jest stabilne).
    if (g === 'cut' && Number.isFinite(age) && age < ADULT_AGE) messages.push({ level: 'info', text: MACRO_MESSAGES.teenCut });
    if (manual && Number.isFinite(floor) && kcal < floor) messages.push({ level: 'warning', text: MACRO_MESSAGES.belowFloor(floor) });
    if (C < 0) messages.push({ level: 'error', text: MACRO_MESSAGES.noRoom });
    else if (C < CARBS_MIN_G) messages.push({ level: 'warning', text: MACRO_MESSAGES.tooLowKcal });
    else if (C < cMin - EPS) messages.push({ level: 'info', text: MACRO_MESSAGES.lowCarbs });
    const rank = { error: 0, warning: 1, info: 2 };
    messages.sort((a, b) => rank[a.level] - rank[b.level]);

    return {
        W, basis, bf,
        protein: { low: round5(pLow), target: round5(P), high: round5(pHigh) },
        fat: { target: round5(F), floor: round5(fFloor) },
        carbs: C < 0 ? null : round10(C),
        messages,
        hints
    };
}
