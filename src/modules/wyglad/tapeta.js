// Stała TEKST_NAJSLABSZY to wartość z tokens.css (test kontrastu), nie kolor ekranu, więc plik nie ma znacznika kontroli kolorów.
// Granica przyciemnienia tapety liczona ze zdjęcia i obróbka zdjęcia (spec rozdz. 7.3).
// Czysta matematyka WCAG plus dwie funkcje na płótnie.

export const TEKST_NAJSLABSZY = '#a8a09e'; // najciemniejszy --ukis-text-muted z trzech motywów
const MAX_BAJTOW = 25 * 1024 * 1024;

export function hexNaRgb(hex) {
    const h = String(hex).replace('#', '');
    const pelny = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    return [0, 2, 4].map((i) => parseInt(pelny.slice(i, i + 2), 16));
}

export function luminancja([r, g, b]) {
    const l = [r, g, b].map((v) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
}

export function kontrast(a, b) {
    const la = luminancja(a);
    const lb = luminancja(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export function nalozenie(pod, [r, g, b, a]) {
    return [r, g, b].map((v, i) => v * a + pod[i] * (1 - a));
}

export function najjasniejszaKomorka(imageData, siatka = 16) {
    const { data, width, height } = imageData;
    let najlepsza = [0, 0, 0];
    let najL = -1;
    for (let gy = 0; gy < siatka; gy++) {
        const y0 = Math.floor((gy * height) / siatka);
        const y1 = Math.max(y0 + 1, Math.floor(((gy + 1) * height) / siatka));
        for (let gx = 0; gx < siatka; gx++) {
            const x0 = Math.floor((gx * width) / siatka);
            const x1 = Math.max(x0 + 1, Math.floor(((gx + 1) * width) / siatka));
            let sr = 0, sg = 0, sb = 0, n = 0;
            for (let y = y0; y < Math.min(y1, height); y++) {
                for (let x = x0; x < Math.min(x1, width); x++) {
                    const i = (y * width + x) * 4;
                    sr += data[i]; sg += data[i + 1]; sb += data[i + 2]; n++;
                }
            }
            if (!n) continue;
            const sred = [sr / n, sg / n, sb / n];
            const l = luminancja(sred);
            if (l > najL) { najL = l; najlepsza = sred; }
        }
    }
    return najlepsza;
}

export function minPrzyciemnienie(najjasniejszy, tekst = TEKST_NAJSLABSZY, cel = 4.7) {
    const rgbTekstu = hexNaRgb(tekst);
    for (let a = 45; a <= 90; a++) {
        if (kontrast(rgbTekstu, nalozenie(najjasniejszy, [0, 0, 0, a / 100])) >= cel) return a;
    }
    return 90;
}

async function dekoduj(blob) {
    if (typeof createImageBitmap === 'function') {
        try {
            const bmp = await createImageBitmap(blob);
            return { zrodlo: bmp, w: bmp.width, h: bmp.height, zwolnij: () => bmp.close && bmp.close() };
        } catch (e) { /* zapas: <img> */ }
    }
    const url = URL.createObjectURL(blob);
    try {
        const img = new Image();
        await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('NIE_OBRAZ')); img.src = url; });
        return { zrodlo: img, w: img.naturalWidth, h: img.naturalHeight, zwolnij: () => {} };
    } catch (e) {
        throw new Error('NIE_OBRAZ');
    } finally {
        URL.revokeObjectURL(url);
    }
}

function plotno(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
}

export async function zmniejszZdjecie(blob, { dluzszyBok = 1600, jakosc = 0.8 } = {}) {
    if (blob.size > MAX_BAJTOW) throw new Error('ZA_DUZE');
    const d = await dekoduj(blob);
    try {
        if (!d.w || !d.h) throw new Error('NIE_OBRAZ');
        const skala = Math.min(1, dluzszyBok / Math.max(d.w, d.h));
        const w = Math.max(1, Math.round(d.w * skala));
        const h = Math.max(1, Math.round(d.h * skala));
        const c = plotno(w, h);
        c.getContext('2d').drawImage(d.zrodlo, 0, 0, w, h);
        const wynik = await new Promise((res) => c.toBlob(res, 'image/jpeg', jakosc));
        if (!wynik) throw new Error('NIE_OBRAZ');
        return wynik;
    } finally {
        d.zwolnij();
    }
}

// Pomniejszanie po połowie (każdy krok uśrednia 2 × 2 piksele), aż dłuższy bok będzie ≤ `cel`.
// Jeden drawImage do 16 × 16 próbkuje tylko okolice środka komórki i gubi małe jasne plamy.
function pomniejszDoPomiaru(zrodlo, w, h, cel = 256) {
    let obraz = zrodlo;
    let cw = w;
    let ch = h;
    const rysuj = (nw, nh, czytaj) => {
        const c = plotno(nw, nh);
        const ctx = c.getContext('2d', czytaj ? { willReadFrequently: true } : undefined);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(obraz, 0, 0, nw, nh);
        obraz = c;
        cw = nw;
        ch = nh;
        return ctx;
    };
    while (Math.max(cw, ch) / 2 >= cel) rysuj(Math.max(1, Math.round(cw / 2)), Math.max(1, Math.round(ch / 2)), false);
    const skala = Math.min(1, cel / Math.max(cw, ch));
    const ctx = rysuj(Math.max(16, Math.round(cw * skala)), Math.max(16, Math.round(ch * skala)), true);
    return ctx.getImageData(0, 0, cw, ch);
}

export async function zmierzZdjecie(blob) {
    const d = await dekoduj(blob);
    try {
        if (!d.w || !d.h) throw new Error('NIE_OBRAZ');
        const najjasniejszy = najjasniejszaKomorka(pomniejszDoPomiaru(d.zrodlo, d.w, d.h), 16);
        return { najjasniejszy, przyciemnienieMin: minPrzyciemnienie(najjasniejszy) };
    } finally {
        d.zwolnij();
    }
}
