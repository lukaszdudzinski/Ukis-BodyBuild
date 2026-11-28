// Jednorazowe potwierdzenie zapisanej płci. Dawny formularz Pomiarów zapisywał „Mężczyzna”, gdy nikt
// nie zmienił pola, więc część kobiet ma płeć zapisaną błędnie. Pytamy raz, przy wejściu w Pomiary lub Dietę.
import { readBodyProfile } from '../diet/kcalGoal.js';

export const SEX_KEY = 'uki-bodybuild-gender';
export const SEX_CONFIRMED_KEY = 'ukis.bodybuild.plec-potwierdzona';
const OVERLAY_ID = 'sex-confirm-overlay';
const LABELS = { male: 'Mężczyzna', female: 'Kobieta' };

const get = (storage, key) => {
    try {
        return storage.getItem(key);
    } catch (e) {
        return null;
    }
};

// Jedno źródło płci dla Pomiarów, Analizy i Diety: pole „Płeć”, a gdy go brak — jawnie wybrana sylwetka awatara.
export function currentSex(storage = localStorage) {
    return readBodyProfile(storage).sex;
}

export function needsSexConfirm(storage = localStorage) {
    return currentSex(storage) !== null && get(storage, SEX_CONFIRMED_KEY) !== '1';
}

export function markSexConfirmed(storage = localStorage) {
    try {
        storage.setItem(SEX_CONFIRMED_KEY, '1');
    } catch (e) { /* bez pamięci zapytamy ponownie */ }
}

// Zapis płci wybranej przez użytkownika (pole „Płeć” w Pomiarach); świadomy wybór = potwierdzenie.
export function saveSex(value, storage = localStorage) {
    if (value !== 'male' && value !== 'female') return false;
    try {
        storage.setItem(SEX_KEY, value);
    } catch (e) {
        return false;
    }
    markSexConfirmed(storage);
    return true;
}

const isAppMode = () => {
    try {
        return !window.UkiAppStart || typeof window.UkiAppStart.isAppMode !== 'function' || window.UkiAppStart.isAppMode();
    } catch (e) {
        return true;
    }
};

const close = () => document.getElementById(OVERLAY_ID)?.remove();

// Okna, przy których nie pytamy (zapytamy przy następnym wejściu): „Co nowego”, powitania, dymek Edwarda.
const BLOCKING_IDS = ['changelog-modal-overlay', 'onboarding-modal', 'edward-contextual-bubble'];
const isShown = (el) => {
    if (!el) return false;
    try {
        return window.getComputedStyle(el).display !== 'none';
    } catch (e) {
        return true;
    }
};
// querySelectorAll: „Co nowego” trzyma ukryty element w DOM, więc sprawdzamy każdy o danym id.
export const blockingDialogOpen = () => BLOCKING_IDS.some(id => [...document.querySelectorAll(`[id="${id}"]`)].some(isShown));

export function maybeConfirmSex(tab = null) {
    if (typeof document === 'undefined' || !document.body) return false;
    if (!isAppMode() || !needsSexConfirm() || document.getElementById(OVERLAY_ID)) return false;
    if (blockingDialogOpen()) return false;
    // Pierwsze wejście w Dietę: za chwilę pojawi się dymek Edwarda (samouczek), więc pytamy przy następnej wizycie.
    if (tab === 'diet-dashboard' && get(localStorage, 'tutorial_context_diet') === null) return false;

    const sex = currentSex();
    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'sex-confirm-text');
    overlay.style.cssText = 'position: fixed; inset: 0; z-index: 10001; background: rgba(0,0,0,0.7); display: flex; '
        + 'justify-content: center; align-items: center; padding: 16px; box-sizing: border-box;';

    const card = document.createElement('div');
    card.style.cssText = 'background: #1e1e1e; color: #fff; border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; '
        + 'padding: 22px; width: 100%; max-width: 360px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); box-sizing: border-box;';

    const text = document.createElement('p');
    text.id = 'sex-confirm-text';
    text.style.cssText = 'margin: 0 0 18px 0; font-size: 1em; line-height: 1.5;';
    text.textContent = `Sprawdź płeć: ${LABELS[sex]} — wpływa na analizę sylwetki i cel kaloryczny`;

    const row = document.createElement('div');
    row.style.cssText = 'display: flex; gap: 10px;';
    const btn = (id, label, primary) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.id = id;
        b.textContent = label;
        b.style.cssText = 'flex: 1; padding: 12px; border-radius: 12px; font-size: 0.95em; font-weight: 600; cursor: pointer; '
            + (primary ? 'background: #FF9800; color: #fff; border: none;' : 'background: transparent; color: #FF9800; border: 1px solid rgba(255,152,0,0.5);');
        return b;
    };
    const ok = btn('sex-confirm-ok', 'Zgadza się', true);
    const change = btn('sex-confirm-change', 'Zmień', false);
    // „Zgadza się” zapisuje płeć jawnie (także tę z sylwetki awatara), więc Pomiary i Analiza pokazują to samo.
    const accept = () => {
        saveSex(sex);
        close();
    };
    ok.addEventListener('click', accept);
    change.addEventListener('click', () => {
        markSexConfirmed();
        close();
        if (typeof window.switchTab === 'function') window.switchTab('measurements-dashboard');
        setTimeout(() => {
            const select = document.getElementById('measureGender');
            if (select) {
                select.scrollIntoView({ block: 'center' });
                select.focus();
            }
        }, 100);
    });
    // Escape = „Zgadza się”; Tab krąży między dwoma przyciskami (fokus zostaje w oknie).
    overlay.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            accept();
        } else if (e.key === 'Tab') {
            e.preventDefault();
            (document.activeElement === ok ? change : ok).focus();
        }
    });
    row.append(ok, change);
    card.append(text, row);
    overlay.append(card);
    document.body.append(overlay);
    ok.focus();
    return true;
}

export function initSexConfirm() {
    document.addEventListener('tabChanged', (e) => {
        const tab = e.detail && e.detail.tab;
        if (tab === 'measurements-dashboard' || tab === 'diet-dashboard') maybeConfirmSex(tab);
    });
}
