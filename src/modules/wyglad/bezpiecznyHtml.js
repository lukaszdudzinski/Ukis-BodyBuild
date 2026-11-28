// wyglad: zar
// Odpowiedź AI jest markdownem, który marked zamienia na HTML. Przed wstawieniem do innerHTML usuwamy z niego
// elementy wykonywalne i osadzone, atrybuty zdarzeń oraz adresy inne niż http:, https:, mailto: i względne.
const ZAKAZANE = 'script, style, iframe, object, embed, link, meta, base, form, svg, math, noscript, noembed, noframes, xmp, template, frame, frameset, applet';
const ATRYBUTY_ADRESOW = ['href', 'src', 'action', 'formaction', 'xlink:href', 'poster', 'cite', 'background', 'data', 'ping', 'srcset'];
const DOZWOLONE_PROTOKOLY = ['http:', 'https:', 'mailto:'];

// Wartość atrybutu jest już zdekodowana przez przeglądarkę; adres rozstrzyga parser URL (tak jak przy kliknięciu),
// więc tabulatory, nowe linie, znaki sterujące i wielkość liter nie pomagają. Względne i „#” rozwiązują się do bieżącej strony.
function adresBezpieczny(wartosc) {
    try { return DOZWOLONE_PROTOKOLY.includes(new URL(wartosc, location.href).protocol); }
    catch { return false; }
}

export function bezpiecznyHtml(html) {
    const t = document.createElement('template');
    t.innerHTML = html;
    t.content.querySelectorAll(ZAKAZANE).forEach((el) => el.remove());
    t.content.querySelectorAll('*').forEach((el) => {
        for (const a of [...el.attributes]) {
            const n = a.name.toLowerCase();
            const adres = ATRYBUTY_ADRESOW.includes(n);
            if (n.startsWith('on') || n === 'style' || n === 'srcdoc' || (adres && !adresBezpieczny(a.value))) el.removeAttribute(a.name);
        }
    });
    return t.innerHTML;
}
