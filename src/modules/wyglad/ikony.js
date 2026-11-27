// wyglad: zar
// Ikony Lucide (ISC) jako napis SVG: kreska 1,8, aria-hidden. Zestaw startowy z spec 6.2.
// Ścieżki ikon, które ma Strefa trenera, bierzemy z trainer/ui/dom.js (jedna wersja); reszta tutaj.
import { ICONS as STREFA } from '../trainer/ui/dom.js';

const WLASNE = {
    'chevron-up': [['path', { d: 'm18 15-6-6-6 6' }]],
    'chevron-down': [['path', { d: 'm6 9 6 6 6-6' }]],
    x: [['path', { d: 'M18 6 6 18' }], ['path', { d: 'm6 6 12 12' }]],
    minus: [['path', { d: 'M5 12h14' }]],
    pause: [['rect', { x: 14, y: 4, width: 4, height: 16, rx: 1 }], ['rect', { x: 6, y: 4, width: 4, height: 16, rx: 1 }]],
    'more-horizontal': [['circle', { cx: 12, cy: 12, r: 1 }], ['circle', { cx: 19, cy: 12, r: 1 }], ['circle', { cx: 5, cy: 12, r: 1 }]],
    camera: [['path', { d: 'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z' }], ['circle', { cx: 12, cy: 13, r: 3 }]],
    upload: [['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }], ['polyline', { points: '17 8 12 3 7 8' }], ['line', { x1: 12, x2: 12, y1: 3, y2: 15 }]],
    download: [['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }], ['polyline', { points: '7 10 12 15 17 10' }], ['line', { x1: 12, x2: 12, y1: 15, y2: 3 }]],
    search: [['circle', { cx: 11, cy: 11, r: 8 }], ['path', { d: 'm21 21-4.3-4.3' }]],
    clock: [['circle', { cx: 12, cy: 12, r: 10 }], ['polyline', { points: '12 6 12 12 16 14' }]],
    sparkles: [
        ['path', { d: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z' }],
        ['path', { d: 'M20 3v4' }], ['path', { d: 'M22 5h-4' }], ['path', { d: 'M4 17v2' }], ['path', { d: 'M5 18H3' }],
    ],
    bot: [['path', { d: 'M12 8V4H8' }], ['rect', { width: 16, height: 12, x: 4, y: 8, rx: 2 }], ['path', { d: 'M2 14h2' }], ['path', { d: 'M20 14h2' }], ['path', { d: 'M15 13v2' }], ['path', { d: 'M9 13v2' }]],
    send: [['path', { d: 'm22 2-7 20-4-9-9-4Z' }], ['path', { d: 'M22 2 11 13' }]],
    'line-chart': [['path', { d: 'M3 3v16a2 2 0 0 0 2 2h16' }], ['path', { d: 'm19 9-5 5-4-4-3 3' }]],
    utensils: [['path', { d: 'M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2' }], ['path', { d: 'M7 2v20' }], ['path', { d: 'M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7' }]],
    home: [['path', { d: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8' }], ['path', { d: 'M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }]],
    notebook: [['path', { d: 'M2 6h4' }], ['path', { d: 'M2 10h4' }], ['path', { d: 'M2 14h4' }], ['path', { d: 'M2 18h4' }], ['rect', { width: 16, height: 20, x: 4, y: 2, rx: 2 }], ['path', { d: 'M16 2v20' }]],
    coffee: [['path', { d: 'M10 2v2' }], ['path', { d: 'M14 2v2' }], ['path', { d: 'M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1' }], ['path', { d: 'M6 2v4' }]],
    image: [['rect', { width: 18, height: 18, x: 3, y: 3, rx: 2, ry: 2 }], ['circle', { cx: 9, cy: 9, r: 2 }], ['path', { d: 'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' }]],
};

// Nazwy z zestawu startowego (spec 6.2).
const ZESTAW = ['chevron-left', 'chevron-right', 'chevron-up', 'chevron-down', 'x', 'check', 'plus', 'minus', 'play', 'pause',
    'more-horizontal', 'camera', 'trash', 'pencil', 'copy', 'info', 'upload', 'download', 'share', 'settings', 'search', 'clock',
    'lock', 'users', 'sparkles', 'bot', 'send', 'arrow-up', 'arrow-down', 'calendar', 'ruler', 'utensils', 'line-chart', 'home',
    'dumbbell', 'notebook', 'user', 'wrench', 'coffee', 'image'];

const KSZTALTY = Object.fromEntries(ZESTAW.map((n) => [n, WLASNE[n] || STREFA[n]]));

const attrs = (o) => Object.entries(o).map(([k, v]) => `${k}="${v}"`).join(' ');

export function ikona(nazwa, rozmiar = 20) {
    const czesci = KSZTALTY[nazwa];
    if (!czesci) throw new Error(`Nieznana ikona: ${nazwa}`);
    const r = Number(rozmiar) || 20;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${r}" height="${r}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${czesci.map(([tag, a]) => `<${tag} ${attrs(a)}/>`).join('')}</svg>`;
}
