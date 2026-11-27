// wyglad: zar
// Tapety wbudowane (spec rozdz. 7.4): { id, nazwa, plik }, pliki img/tapety/<id>.webp w CORE_ASSETS.
// Zapisana „wbudowana:<id>” spoza listy daje poświatę.
// Cztery tapety od właściciela (2026-11-26). Dwie ostatnie przyszły w małej rozdzielczości (286 × 512).
export const TAPETY = [
    { id: 'czerwien', nazwa: 'Czerwona ilustracja', plik: 'img/tapety/czerwien.webp' },
    { id: 'sepia', nazwa: 'Sepia', plik: 'img/tapety/sepia.webp' },
    { id: 'szara', nazwa: 'Szara ilustracja', plik: 'img/tapety/szara.webp' },
    { id: 'silownia', nazwa: 'Siłownia czarno-biała', plik: 'img/tapety/silownia.webp' },
];

export function tapetaWbudowana(id) {
    return TAPETY.find((t) => t.id === id) || null;
}
