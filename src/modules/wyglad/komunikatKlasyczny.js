// wyglad: zar
// Jednorazowy komunikat dla użytkowników dawnego wyglądu klasycznego (spec 11 pkt 3). Klucz „z-klasycznego”
// zapisuje strona-przekierowanie classic.html albo strażnik w index.html; okno pokazuje AppUI po „Co nowego?”
// (albo od razu, gdy „Co nowego?” nie ma), tylko w zainstalowanej aplikacji. Po zamknięciu już się nie pojawia.

export const Z_KLASYCZNEGO = 'ukis.bodybuild.wyglad.z-klasycznego';
export const KOMUNIKAT = 'ukis.bodybuild.wyglad.komunikat-klasyczny';
export const POKAZANY = 'pokazany';

const ID = 'komunikat-klasyczny';
const PAYWALL = 'premium-paywall-modal';
const TYTUL = 'Nowy wygląd BodyBuild';
const TRESC = 'Wygląd klasyczny został zastąpiony nowym wyglądem „Czerwony żar”. Twoje treningi, pomiary i ustawienia są na miejscu. Motyw kolorów i tapetę zmienisz w Profil → Wygląd.';

const czytaj = (storage, k) => {
    try { return storage.getItem(k); } catch (e) { return null; }
};

const trybAplikacji = () => {
    try {
        return !window.UkiAppStart || window.UkiAppStart.isAppMode();
    } catch (e) {
        return true;
    }
};

export function trzebaPokazac(storage = localStorage) {
    return czytaj(storage, Z_KLASYCZNEGO) === '1' && czytaj(storage, KOMUNIKAT) !== POKAZANY;
}

// Pokazuje okno, jeśli trzeba. Zwraca true, gdy je pokazał.
export function pokazJesliTrzeba(storage = localStorage) {
    if (typeof document === 'undefined' || !document.body) return false;
    if (!trybAplikacji() || !trzebaPokazac(storage) || document.getElementById(ID)) return false;
    // Okno PRO (dzienne przypomnienie o końcu okresu próbnego) ma pierwszeństwo: komunikat czeka, aż się zamknie.
    if (document.getElementById(PAYWALL)) {
        const czekaj = new MutationObserver(() => {
            if (document.getElementById(PAYWALL)) return;
            czekaj.disconnect();
            pokazJesliTrzeba(storage);
        });
        czekaj.observe(document.body, { childList: true, subtree: true });
        return false;
    }

    const scrim = document.createElement('div');
    scrim.id = ID;
    scrim.className = 'z-dialog-scrim komunikat-scrim';
    const okno = document.createElement('div');
    okno.className = 'z-dialog komunikat-okno';
    okno.setAttribute('role', 'dialog');
    okno.setAttribute('aria-modal', 'true');
    okno.setAttribute('aria-labelledby', `${ID}-tytul`);
    okno.setAttribute('aria-describedby', `${ID}-tresc`);

    const tytul = document.createElement('h2');
    tytul.className = 'z-hd komunikat-tytul';
    tytul.id = `${ID}-tytul`;
    tytul.textContent = TYTUL;
    const tresc = document.createElement('p');
    tresc.className = 'komunikat-tresc';
    tresc.id = `${ID}-tresc`;
    tresc.textContent = TRESC;

    const akcje = document.createElement('div');
    akcje.className = 'z-dialog-actions';
    const motyw = document.createElement('button');
    motyw.type = 'button';
    motyw.className = 'z-ghost';
    motyw.textContent = 'Wybierz motyw';
    const ok = document.createElement('button');
    ok.type = 'button';
    ok.className = 'z-btn';
    ok.textContent = 'OK';
    akcje.append(motyw, ok);
    okno.append(tytul, tresc, akcje);
    scrim.appendChild(okno);

    const zamknij = () => {
        try { storage.setItem(KOMUNIKAT, POKAZANY); } catch (e) { /* prywatne okno: pokaże się jeszcze raz */ }
        scrim.remove();
    };
    ok.addEventListener('click', zamknij);
    motyw.addEventListener('click', () => {
        zamknij();
        if (typeof window.switchTab === 'function') window.switchTab('wyglad-panel');
    });
    scrim.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') zamknij();
        // Fokus zostaje w oknie (aria-modal): Tab krąży między dwoma przyciskami.
        if (e.key === 'Tab') {
            e.preventDefault();
            (document.activeElement === ok ? motyw : ok).focus();
        }
    });

    document.body.appendChild(scrim);
    try { ok.focus({ preventScroll: true }); } catch (e) { ok.focus(); }
    return true;
}
