// Wywiad z klientem (spec 9.3): kroki, pytania, cele i kontinuum powtórzeń. Czysta wiedza, bez DOM.
// Pytania są sformułowane krótko i neutralnie, własnymi słowami.

export const QUESTIONNAIRE_VERSION = 1;

// Jedyna definicja celów treningu (id zapisywane w rekordach, etykieta do wyświetlenia).
export const GOALS = [
    { id: 'sila', label: 'Siła' },
    { id: 'moc', label: 'Moc' },
    { id: 'wytrzymalosc', label: 'Wytrzymałość' },
    { id: 'hipertrofia', label: 'Hipertrofia' },
    { id: 'redukcja', label: 'Redukcja' },
    { id: 'zdrowie', label: 'Zdrowie i sprawność' },
    { id: 'wydolnosc', label: 'Wydolność' },
    { id: 'sportowy', label: 'Specyficzny sportowy' },
];

const yesno = (id, label, short, noteLabel = 'Jakie?') => ({ id, type: 'yesno', label, short, withNote: noteLabel });
const text = (id, label) => ({ id, type: 'text', label });
const choice = (id, label, options) => ({ id, type: 'choice', label, options });

// Pytania kroku „Cel” o id cel_glowny, cel_dodatkowy i cel_wlasny trafiają do pól rekordu
// goal, goalExtra i goalOwnWords (nie do answers); ekran wywiadu zna to odwzorowanie.
export const STEPS = [
    {
        id: 'zdrowie', label: 'Zdrowie', questions: [
            yesno('urazy', 'Urazy (kostka, kolano, biodro, kręgosłup, barki)?', 'Urazy'),
            yesno('operacje', 'Przebyte operacje?', 'Operacje'),
            yesno('bol_klatka', 'Bóle w klatce piersiowej?', 'Ból w klatce'),
            yesno('zawroty', 'Zawroty głowy lub omdlenia?', 'Zawroty/omdlenia'),
            text('wizyta_lekarza', 'Kiedy ostatnia wizyta u lekarza?'),
            yesno('choroby', 'Choroby przewlekłe (serce, ciśnienie, cholesterol, cukrzyca, autoimmunologiczne)?', 'Choroby przewlekłe'),
            yesno('leki', 'Przyjmowane leki lub używki?', 'Leki i używki'),
        ],
    },
    {
        id: 'trening', label: 'Trening', questions: [
            text('dyscyplina', 'Jaką dyscyplinę uprawia?'),
            text('silownia', 'Z jakiej siłowni korzysta?'),
            choice('znajomosc_cwiczen', 'Jak zna przysiad, martwy ciąg, wyciskanie i podciąganie?', ['Wcale', 'Słabo', 'Dobrze']),
            text('dotychczasowe', 'Jak wyglądały dotychczasowe treningi?'),
            yesno('cel_osiagniety', 'Czy dotychczasowy cel został osiągnięty?', 'Cel osiągnięty'),
            yesno('trener_wczesniej', 'Czy ćwiczył już z trenerem?', 'Trener wcześniej'),
            text('najdluzszy_okres', 'Najdłuższy okres regularnych ćwiczeń?'),
        ],
    },
    {
        id: 'cel', label: 'Cel', questions: [
            { id: 'cel_glowny', type: 'choice', label: 'Cel główny', options: GOALS },
            { id: 'cel_dodatkowy', type: 'multi', label: 'Cele dodatkowe', options: GOALS, withNote: 'Własny cel dodatkowy' },
            text('ramy_czasowe', 'W jakim czasie ma być efekt?'),
            choice('tempo_efektu', 'Efekt szybki czy rozłożony w czasie?', ['Szybki', 'Rozłożony w czasie']),
            choice('preferowany_trening', 'Jaki trening woli?', ['Siłowy, statyczny', 'Obwodowy, dynamiczny']),
            text('nielubiane', 'Jakich ćwiczeń nie lubi?'),
            text('cel_wlasny', 'Cel własnymi słowami'),
        ],
    },
    {
        id: 'styl', label: 'Styl życia', questions: [
            choice('aktywnosc_pracy', 'Jak aktywna jest jego praca?', ['Zerowa', 'Średnia', 'Wysoka']),
            yesno('praca_zmianowa', 'Czy pracuje zmianowo?', 'Praca zmianowa', 'Jaki system?'),
            text('pora_pracy', 'W jakich godzinach pracuje?'),
            yesno('podroze', 'Czy często podróżuje?', 'Podróże', 'Jak często?'),
            { id: 'sen', type: 'number', label: 'Ile godzin śpi?' },
            text('inne_aktywnosci', 'Inne aktywności w tygodniu?'),
        ],
    },
    {
        id: 'dieta', label: 'Dieta', questions: [
            { id: 'liczba_posilkow', type: 'number', label: 'Ile posiłków je dziennie?' },
            text('nawodnienie', 'Ile i co pije w ciągu dnia?'),
            text('alergie', 'Alergie i nietolerancje pokarmowe?'),
            text('suplementy', 'Stosowane suplementy?'),
            text('alkohol', 'Jak często pije alkohol?'),
            text('notatka_dieta', 'Dodatkowa notatka o diecie'),
        ],
    },
];

export const CONTINUUM = {
    sila: { reps: '1–5', pct: '85–100%', rest: '3–5 min' },
    hipertrofia_funkcjonalna: { reps: '5–8', pct: '75–85%', rest: '2–3 min' },
    hipertrofia: { reps: '8–12', pct: '75%', rest: '1,5–2 min' },
    wytrzymalosc: { reps: '15+', pct: '< 60%', rest: '30–60 s' },
    moc: { reps: '1–5 (ruch dynamiczny)', pct: '75–90%', rest: '2–5 min' },
};

const GOAL_TO_CONTINUUM = { sila: 'sila', moc: 'moc', wytrzymalosc: 'wytrzymalosc', hipertrofia: 'hipertrofia' };

export function continuumForGoal(goalId) {
    const key = GOAL_TO_CONTINUUM[goalId];
    return key ? { key, ...CONTINUUM[key] } : null;
}

export function healthSummary(interview) {
    // Bez zgody klienta odpowiedzi o zdrowiu się nie liczą, nawet gdyby leżały w rekordzie.
    if (interview && interview.consentHealth && interview.consentHealth.given === false) return { flagged: false, text: '' };
    const answers = (interview && interview.answers) || {};
    const step = STEPS.find((s) => s.id === 'zdrowie');
    const parts = [];
    for (const q of step.questions) {
        if (q.type !== 'yesno') continue;
        const a = answers[q.id];
        if (!a || a.value !== true) continue;
        const note = String(a.note || '').trim();
        parts.push(note ? `${q.short}: ${note}` : q.short);
    }
    return { flagged: parts.length > 0, text: parts.join(' · ') };
}
