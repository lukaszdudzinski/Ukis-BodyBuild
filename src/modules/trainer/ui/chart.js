// Wykres liniowy Strefy (pomiary, postępy): polyline w kolorze wyróżnienia motywu,
// z opisem zmiany dla czytników ekranu („Waga: z 92 do 88,5 kg”). Atrybuty SVG ustawiane jako tekst.
import { h } from './dom.js';
import { formatNumber } from '../trainerMeasurements.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

function svg(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
    return el;
}

// series: { date, value }[] rosnąco po dacie.
export function lineChart({ label, unit }, series) {
    if (series.length === 0) return h('p', { class: 'mut' }, 'Brak danych do wykresu.');
    const W = 300;
    const H = 120;
    const pad = 12;
    const values = series.map((s) => s.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const pts = series.map((s, i) => [
        series.length === 1 ? W / 2 : pad + (i * (W - 2 * pad)) / (series.length - 1),
        H - pad - ((s.value - min) / span) * (H - 2 * pad),
    ]);
    const u = unit ? ` ${unit}` : '';
    const first = series[0];
    const last = series[series.length - 1];
    const text = series.length === 1
        ? `${label}: ${formatNumber(last.value)}${u}`
        : `${label}: z ${formatNumber(first.value)} do ${formatNumber(last.value)}${u}`;
    const el = svg('svg', { class: 'tz-chart', viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': text, preserveAspectRatio: 'none' });
    if (series.length > 1) {
        el.appendChild(svg('polyline', { points: pts.map((p) => p.join(',')).join(' '), fill: 'none', stroke: 'var(--tz-hi)', 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke' }));
    }
    pts.forEach(([x, y]) => el.appendChild(svg('circle', { cx: x, cy: y, r: 3.5, fill: 'var(--tz-hi)' })));
    return el;
}
