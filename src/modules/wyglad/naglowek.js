// wyglad: zar
// Nagłówek ekranu z-head (spec 6.2): main (tytuł 30 px), back (z „Wróć”, 26 px), center (24 px na środku).
import { ikona } from './ikony.js';

const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// `wroc`: id zakładki (switchTab) albo wywołanie funkcji globalnej jako tekst, np. 'zamknij()'.
// Id zakładki zawiera tylko litery, cyfry, „-” i „_”; wszystko inne jest wycinane, więc nie wyjdzie z cudzysłowu.
function przyciskWroc(wroc) {
    if (!wroc) return '';
    const kod = /^[A-Za-z_$][\w$.]*\(\)$/.test(wroc) ? wroc : `switchTab('${String(wroc).replace(/[^\w-]/g, '')}')`;
    return `<button type="button" class="z-ic z-card" aria-label="Wróć" onclick="${esc(kod)}">${ikona('chevron-left')}</button>`;
}

export function naglowek({ wariant = 'main', tytul, podtytul = '', wroc = null, akcja = '', pro = false } = {}) {
    const znacznikPro = pro ? ' <span class="z-pro">PRO</span>' : '';
    const tytulHtml = `<h2 class="z-hd">${esc(tytul)}${znacznikPro}</h2>`;
    const podtytulHtml = podtytul ? `<p class="z-sub">${esc(podtytul)}</p>` : '';
    if (wariant === 'center') {
        const lewa = przyciskWroc(wroc) || '<span class="z-head-spacer" aria-hidden="true"></span>';
        const prawa = akcja || '<span class="z-head-spacer" aria-hidden="true"></span>';
        return `<header class="z-head-center">${lewa}${tytulHtml}${prawa}</header>`;
    }
    const lewa = wariant === 'back' ? przyciskWroc(wroc) : '';
    return `<header class="z-head-${wariant === 'back' ? 'back' : 'main'}">${lewa}<div class="z-head-txt">${tytulHtml}${podtytulHtml}</div>${akcja}</header>`;
}
