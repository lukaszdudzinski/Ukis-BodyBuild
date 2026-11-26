// Zdjęcia sylwetki na ekranie pomiarów: zgoda klienta, wybór zdjęć w formularzu, miniatury w historii
// i widok „Porównaj”. Treść zdjęcia jest odszyfrowywana dopiero do wyświetlenia i żyje tylko w adresie
// obiektu, który znika przy przerysowaniu, wyjściu z ekranu i blokadzie (revokeAll).
import { h, icon } from './dom.js';
import { PHOTO_KIND, POSES, poseLabel, hasPhotoConsent, downscale } from '../trainerPhotos.js';
import { blobToB64, b64ToBlob } from '../trainerAudio.js';

export const DRAFT_KIND = 'measurement_photo_draft';
export const PHOTO_CONSENT_LABEL = 'Klient zgadza się na zdjęcia sylwetki';

function today() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const newestFirst = (a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));

export function createPhotoKit(ctx, clientId) {
    const urls = new Set();

    const photos = () => ctx.vault.list(PHOTO_KIND, clientId);
    // Wybrane w formularzu, jeszcze bez pomiaru: zaszyfrowany szkic, który przejmuje „Zapisz pomiar”.
    const drafts = () => ctx.vault.list(DRAFT_KIND, clientId);

    function revokeAll() {
        for (const u of urls) URL.revokeObjectURL(u);
        urls.clear();
    }

    function track(url) {
        urls.add(url);
        return url;
    }

    // Wypełnia <img> odszyfrowanym zdjęciem (po cichu zostawia pusty, gdy się nie da).
    async function fill(img, meta) {
        try {
            const blob = await ctx.vault.getBlob(meta.blobId);
            if (!blob || !blob.data || !img.isConnected) return;
            img.src = track(URL.createObjectURL(b64ToBlob(blob.data, meta.mime || 'image/jpeg')));
        } catch (e) {
            console.error('[Strefa trenera] zdjęcie:', e && e.message);
        }
    }

    function image(meta, cls) {
        const img = h('img', { class: cls, alt: `${poseLabel(meta.pose)}, ${meta.date || ''}`, decoding: 'async' });
        queueMicrotask(() => fill(img, meta));
        return img;
    }

    async function deleteAll() {
        for (const p of [...photos(), ...drafts()]) {
            await ctx.vault.remove(p.id);
            if (p.blobId) await ctx.vault.remove(p.blobId);
        }
    }

    // Zgoda na zdjęcia (osobna od zgody na dane o zdrowiu), z datą, w rekordzie klienta.
    // Wycofanie usuwa po potwierdzeniu wszystkie zdjęcia klienta; pendingCount: wybrane, jeszcze niezapisane.
    function consentControl({ onChange, pendingCount = () => 0, dropPending = () => {} }) {
        const client = ctx.vault.get(clientId);
        const given = hasPhotoConsent(client);
        const input = h('input', { type: 'checkbox', checked: given });
        input.addEventListener('change', async () => {
            input.disabled = true;
            try {
                const fresh = ctx.vault.get(clientId);
                if (input.checked) {
                    await ctx.vault.put({ ...fresh, photoConsent: { given: true, date: today() } });
                } else {
                    const count = photos().length + drafts().length + pendingCount();
                    if (count) {
                        const ok = await ctx.confirm({
                            title: 'Usunąć zdjęcia sylwetki?',
                            text: `Bez zgody klienta nie przechowujemy zdjęć. Wszystkie zdjęcia sylwetki klienta (${count}) zostaną usunięte. Pomiary zostają.`,
                            okLabel: 'Usuń', danger: true,
                        });
                        if (!ok) { input.checked = true; return; }
                    }
                    dropPending();
                    await deleteAll();
                    await ctx.vault.put({ ...ctx.vault.get(clientId), photoConsent: { given: false, date: null } });
                }
            } catch (e) {
                console.error('[Strefa trenera] zgoda na zdjęcia:', e && e.message);
                ctx.toast('Nie udało się zapisać. Spróbuj jeszcze raz.');
            } finally {
                input.disabled = false;
            }
            onChange();
        });
        const date = given && client.photoConsent.date ? `Zgoda z dnia ${client.photoConsent.date}` : 'Zdjęcia tylko za zgodą klienta';
        return h('div', { class: 'tz-stack tz-tight' },
            h('label', { class: 'tz-check' }, input, h('span', {}, PHOTO_CONSENT_LABEL)),
            h('p', { class: 'mut' }, date));
    }

    // Formularz pomiaru: wybór zdjęć (aparat albo galeria), zmniejszonych od razu do 1280 px.
    // Wybrane zdjęcie czeka w pamięci; przy wyjściu z ekranu i przy blokadzie (persistDraft, kluczem
    // z writer()) trafia zaszyfrowane do szkicu measurement_photo_draft, więc nigdy nie ginie po cichu.
    // „Zapisz pomiar” zamienia szkice w zdjęcia pomiaru, „Anuluj” i usunięcie podglądu je kasują.
    function picker() {
        // pose -> { blob, width, height, url } (w pamięci) albo { saved: opis szkicu z sejfu }
        const pending = {};
        for (const d of drafts().sort((a, b) => String(a.updatedAt || '').localeCompare(String(b.updatedAt || '')))) {
            pending[d.pose] = { saved: d };
        }
        const box = h('section', { class: 'card tz-stack' });
        const forget = (entry) => { if (entry && entry.url) URL.revokeObjectURL(entry.url); };
        const removeSaved = async (meta) => {
            await ctx.vault.remove(meta.id);
            if (meta.blobId) await ctx.vault.remove(meta.blobId);
        };
        // Wycofanie zgody: zdjęcia w pamięci znikają (szkice w sejfie kasuje deleteAll).
        const dropPending = () => {
            for (const entry of Object.values(pending)) forget(entry);
            for (const k of Object.keys(pending)) delete pending[k];
        };
        const preview = (pose) => {
            const entry = pending[pose.id];
            const alt = `Podgląd: ${pose.label}`;
            if (entry.url) return h('img', { src: entry.url, alt });
            const img = h('img', { alt });
            queueMicrotask(() => fill(img, entry.saved));
            return img;
        };
        const paint = () => {
            const parts = [h('h2', { class: 'hd tz-notes-hd' }, 'Zdjęcia sylwetki'),
                consentControl({ onChange: paint, pendingCount: () => Object.values(pending).filter((e) => !e.saved).length, dropPending })];
            if (hasPhotoConsent(ctx.vault.get(clientId))) {
                parts.push(h('div', { class: 'tz-row' }, POSES.map((pose) => h('label', { class: 'ghost tz-photo-pick' },
                    icon('camera'), pose.label,
                    h('input', {
                        type: 'file', accept: 'image/*', capture: 'environment', class: 'tz-file', 'aria-label': `Zdjęcie: ${pose.label}`,
                        onchange: async (e) => {
                            const file = e.target.files && e.target.files[0];
                            e.target.value = '';
                            if (!file) return;
                            try {
                                const out = await downscale(file);
                                const old = pending[pose.id];
                                pending[pose.id] = { ...out, url: URL.createObjectURL(out.blob) };
                                forget(old);
                                if (old && old.saved) await removeSaved(old.saved);
                            } catch (err) {
                                ctx.toast('Nie udało się wczytać zdjęcia.');
                            }
                            paint();
                        },
                    })))));
                const chosen = POSES.filter((p) => pending[p.id]);
                if (chosen.length) {
                    parts.push(h('div', { class: 'tz-thumbs tz-photo-preview' }, chosen.map((pose) => h('div', { class: 'tz-thumb' },
                        preview(pose),
                        h('button', {
                            type: 'button', class: 'tz-icbtn', 'aria-label': `Usuń zdjęcie: ${pose.label}`,
                            onclick: async () => {
                                const entry = pending[pose.id];
                                delete pending[pose.id];
                                forget(entry);
                                paint();
                                if (entry && entry.saved) {
                                    try { await removeSaved(entry.saved); } catch (err) { ctx.toast('Nie udało się usunąć zdjęcia.'); }
                                }
                            },
                        }, icon('trash'))))));
                }
            }
            box.replaceChildren(...parts);
        };
        paint();

        // Zdjęcia z pamięci do zaszyfrowanego szkicu (wyjście z ekranu, blokada). Klucz z chwili wywołania,
        // więc zapis kończy się także, gdy blokada przyjdzie w trakcie; adresy podglądu znikają od razu.
        const persistDraft = () => {
            const fresh = POSES.filter((p) => pending[p.id] && !pending[p.id].saved).map((p) => [p.id, pending[p.id]]);
            if (!fresh.length) return Promise.resolve();
            const writer = ctx.vault.writer();
            for (const [pose, entry] of fresh) { forget(entry); pending[pose] = { saving: entry }; }
            const job = (async () => {
                for (const [pose, entry] of fresh) {
                    const blob = await writer.put({ kind: 'blob', clientId, data: await blobToB64(entry.blob) });
                    const meta = await writer.put({
                        kind: DRAFT_KIND, clientId, pose, mime: 'image/jpeg',
                        width: entry.width, height: entry.height, bytes: entry.blob.size, blobId: blob.id,
                    });
                    if (pending[pose] && pending[pose].saving === entry) pending[pose] = { saved: meta };
                }
            })();
            return ctx.holdLock ? ctx.holdLock(job) : job;
        };

        // „Zapisz pomiar”: zdjęcia z pamięci zapisują się jako zdjęcia pomiaru, szkice zmieniają rodzaj
        // (ten sam blob, bez drugiej kopii). Bez zgody nic nie zostaje.
        const save = (measurement) => {
            const entries = POSES.filter((p) => pending[p.id]).map((p) => [p.id, pending[p.id]]);
            if (!entries.length) return Promise.resolve();
            if (!hasPhotoConsent(ctx.vault.get(clientId))) return discard();
            const writer = ctx.vault.writer();
            const job = (async () => {
                for (const [pose, entry] of entries) {
                    const base = { kind: PHOTO_KIND, clientId, measurementId: measurement.id, date: measurement.date, pose };
                    if (entry.saved) {
                        await writer.put({ ...entry.saved, ...base });
                    } else if (entry.blob) {
                        const blob = await writer.put({ kind: 'blob', clientId, data: await blobToB64(entry.blob) });
                        await writer.put({
                            ...base, mime: 'image/jpeg', width: entry.width, height: entry.height, bytes: entry.blob.size, blobId: blob.id,
                        });
                    }
                    forget(entry);
                    delete pending[pose];
                }
            })();
            return ctx.holdLock ? ctx.holdLock(job) : job;
        };

        // „Anuluj”: zdjęcia z pamięci i szkice zdjęć znikają.
        const discard = async () => {
            dropPending();
            for (const d of drafts()) await removeSaved(d);
        };

        return { node: box, save, persistDraft, discard, count: () => Object.keys(pending).length };
    }

    // Historia: miniatury zdjęć pomiaru.
    function thumbs(measurement) {
        const list = photos().filter((p) => p.measurementId === measurement.id).sort(newestFirst);
        const byPose = POSES.map((pose) => list.find((p) => p.pose === pose.id)).filter(Boolean);
        if (!byPose.length) return null;
        return h('div', { class: 'tz-thumbs' }, byPose.map((p) => h('div', { class: 'tz-thumb' }, image(p, 'tz-thumb-img'))));
    }

    // Dni pomiarów ze zdjęciami (rosnąco).
    const photoDates = () => [...new Set(photos().map((p) => p.date).filter(Boolean))].sort();

    // „Porównaj”: dwa dni obok siebie w wybranej pozie.
    function compare(onBack) {
        const dates = photoDates();
        const state = { left: dates[0], right: dates[dates.length - 1], pose: POSES[0].id };
        const box = h('div', { class: 'tz-stack' });
        const pick = (date, pose) => photos().filter((p) => p.date === date && p.pose === pose).sort(newestFirst)[0] || null;
        const select = (label, key) => h('label', { class: 'tz-field' }, h('span', { class: 'sub' }, label),
            h('select', {
                class: 'in', 'aria-label': label, value: state[key],
                onchange: (e) => { state[key] = e.target.value; paint(); },
            }, dates.map((d) => h('option', { value: d }, d))));
        const figure = (date) => {
            const p = pick(date, state.pose);
            return h('figure', { class: 'tz-compare-side' },
                p ? image(p, 'tz-compare-img') : h('div', { class: 'tz-compare-empty mut' }, 'Brak zdjęcia'),
                h('figcaption', { class: 'sub' }, `${date} · ${poseLabel(state.pose)}`));
        };
        const paint = () => {
            revokeAll();
            box.replaceChildren(
                h('section', { class: 'card tz-stack' },
                    h('h2', { class: 'hd' }, 'Porównanie zdjęć'),
                    h('div', { class: 'tz-row' }, POSES.map((pose) => h('button', {
                        type: 'button', class: `chip${pose.id === state.pose ? ' chipon' : ''}`, 'aria-pressed': String(pose.id === state.pose),
                        onclick: () => { state.pose = pose.id; paint(); },
                    }, pose.label))),
                    h('div', { class: 'tz-compare-pick' }, select('Dzień po lewej', 'left'), select('Dzień po prawej', 'right')),
                    h('div', { class: 'tz-compare' }, figure(state.left), figure(state.right)),
                    h('button', { type: 'button', class: 'ghost', onclick: onBack }, icon('chevron-left'), 'Wróć do pomiarów')));
        };
        paint();
        return box;
    }

    // Karta w historii pomiarów: zgoda i „Porównaj” (gdy są co najmniej dwa dni ze zdjęciami).
    function overviewCard({ onChange, onCompare }) {
        return h('section', { class: 'card tz-stack' },
            h('h2', { class: 'hd tz-notes-hd' }, 'Zdjęcia sylwetki'),
            consentControl({ onChange }),
            photoDates().length >= 2 ? h('div', { class: 'tz-row' },
                h('button', { type: 'button', class: 'ghost', onclick: onCompare }, icon('columns'), 'Porównaj')) : null);
    }

    return { picker, thumbs, compare, overviewCard, revokeAll, photos };
}
