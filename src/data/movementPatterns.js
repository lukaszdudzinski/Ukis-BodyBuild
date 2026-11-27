// Wzorce ruchowe z materiałów właściciela „2.5. Rodzaje ćwiczeń – wzorce ruchowe” (2026-11-27).
// Jedno miejsce z etykietami: id → { pl, en }. Pokazywane tylko w Strefie trenera (plan klienta i wybór ćwiczenia).

export const MOVEMENT_PATTERNS = Object.freeze({
    lower_pull_hinge: Object.freeze({ pl: 'Przyciąganie dół / zawias biodrowy', en: 'Lower Body Pull / Hip Hinge' }),
    lower_pull_hinge_one_leg: Object.freeze({ pl: 'Przyciąganie dół jednonóż (unilateralne) / zawias biodrowy', en: 'Lower Body Pull – One Leg / Hip Hinge' }),
    lower_pull_hip_ext: Object.freeze({ pl: 'Przyciąganie dół / horyzontalny wyprost biodra', en: 'Lower Body Pull / Horizontal Hip Extension' }),
    lower_pull_hip_ext_one_leg: Object.freeze({ pl: 'Przyciąganie dół jednonóż (unilateralne) / horyzontalny wyprost biodra', en: 'Lower Body Pull – One Leg / Horizontal Hip Extension' }),
    lower_pull_accessory: Object.freeze({ pl: 'Przyciąganie dół / akcesoryjne', en: 'Lower Body Pull / Accessory' }),
    lower_pull_leg_curl: Object.freeze({ pl: 'Przyciąganie dół / uginanie podudzi / akcesoryjne', en: 'Lower Body Pull / Leg Curl / Accessory' }),
    lower_push: Object.freeze({ pl: 'Wypychanie dół', en: 'Lower Body Push' }),
    lower_push_one_leg: Object.freeze({ pl: 'Wypychanie dół jednonóż (unilateralne)', en: 'Lower Body Push / One Leg' }),
    lower_push_accessory: Object.freeze({ pl: 'Wypychanie dół / akcesoryjne', en: 'Lower Body Push / Accessory' }),
    accessory: Object.freeze({ pl: 'Ćwiczenie akcesoryjne', en: 'Accessory' }),
    upper_push: Object.freeze({ pl: 'Wypychanie góra', en: 'Upper Body Push' }),
    upper_push_accessory: Object.freeze({ pl: 'Wypychanie góra / akcesoryjne', en: 'Upper Body Push / Accessory' }),
    upper_pull: Object.freeze({ pl: 'Przyciąganie góra', en: 'Upper Body Pull' }),
    upper_pull_one_arm: Object.freeze({ pl: 'Przyciąganie góra jednorącz (unilateralne)', en: 'Upper Body Pull (One Arm)' }),
    upper_pull_accessory: Object.freeze({ pl: 'Przyciąganie góra / akcesoryjne', en: 'Upper Body Pull / Accessory' }),
    upper_pull_one_arm_accessory: Object.freeze({ pl: 'Przyciąganie góra jednorącz (unilateralne) / akcesoryjne', en: 'Upper Body Pull (One Arm) / Accessory' }),
});

// Etykieta wzorca po polsku (domyślnie) albo po angielsku; nieznany wzorzec daje pusty tekst.
export function movementPatternLabel(id, lang = 'pl') {
    const p = Object.prototype.hasOwnProperty.call(MOVEMENT_PATTERNS, id) ? MOVEMENT_PATTERNS[id] : null;
    return p ? (lang === 'en' ? p.en : p.pl) : '';
}
