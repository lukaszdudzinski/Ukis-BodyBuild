// „Uwagi” na dole każdego kroku wywiadu: pole tekstowe i nagrania głosowe (prośba właściciela 2026-11-26).
// Nagranie to dwa zaszyfrowane rekordy sejfu: lekki opis interview_audio { clientId, interviewId, stepId, mime,
// durationSec, createdAt, bytes, blobId } (w pamięci po odblokowaniu) i blob { clientId, data } z treścią,
// czytany dopiero przy odtwarzaniu i niezostający w pamięci. Rekord wywiadu nagrań nie zawiera.
// Pod uwagami są nagrania tego wywiadu i, osobno, nagrania tego kroku z wcześniejszych wywiadów klienta.
// Mikrofon i blokada ekranu są zwalniane po „Zatrzymaj”, przy blokadzie, wyjściu z ekranu, zmianie karty i w tle.
import { h, icon } from './dom.js';
import {
    AUDIO_KIND, MAX_RECORDING_SEC, audioSupported, createRecorder, formatDuration, blobToB64, b64ToBlob, isAppleWebKit,
} from '../trainerAudio.js';

export const DICTATE_HINT = 'Możesz też dyktować z klawiatury (ikona mikrofonu).';
const HEALTH_STEP = 'zdrowie';
const MSG_DENIED = 'Brak dostępu do mikrofonu. Włączysz go w ustawieniach przeglądarki. Do tego czasu możesz dyktować z klawiatury.';
const MSG_BUSY = 'Mikrofon jest zajęty albo niedostępny — spróbuj ponownie.';
const MSG_UNSUPPORTED = 'Ta przeglądarka nie nagrywa dźwięku. Możesz dyktować z klawiatury.';
const SAVE_FAILED = 'Nie udało się zapisać nagrania.';
const EMPTY = 'Nagranie jest puste. Spróbuj jeszcze raz.';
const PLAY_FAILED = 'Nie udało się odtworzyć nagrania.';
const WEBM_ON_IOS = 'Nagranie z Androida (WebM) może nie działać na iPhonie.';
const DELETE_FAILED = 'Nie udało się usunąć nagrania.';
// Cichy dźwięk (WAV bez próbek) do odblokowania elementu audio w geście dotknięcia (Safari na iPhonie).
const SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
// Nagrywanie to używanie Strefy: co kilka sekund odświeża licznik autoblokady (najwyżej 3 minuty).
const TOUCH_EVERY_SEC = 5;

function formatWhen(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString('pl-PL', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const byCreated = (a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || ''));

// Brak zgody na mikrofon zostaje do końca otwarcia strony (komunikat na każdym kroku, przycisk zostaje,
// bo zgodę można włączyć w ustawieniach). Przycisk znika tylko, gdy przeglądarka w ogóle nie nagrywa.
let micDenied = false;

// ctx: kontekst Strefy; clientId: klient; interviewId(): id wywiadu albo null;
// ensureInterviewId(): zapisuje szkic (gdy wywiadu nie ma albo ma niezapisane zmiany) i zwraca jego id.
export function createInterviewNotes(ctx, { clientId, interviewId, ensureInterviewId }) {
    let recorder = null;
    let recStep = null;
    let recSec = 0;
    let saving = Promise.resolve();
    let savingCount = 0;
    let player = null;
    let wake = null;
    let wakeToken = 0;
    let transient = null; // komunikat o chwilowym kłopocie z mikrofonem, tylko na bieżącej karcie
    let mounted = null; // { stepId, disabled, controls, list, older, olderBox, msg }

    const allClips = () => ctx.vault.list(AUDIO_KIND, clientId);
    const clips = (stepId) => {
        const id = interviewId();
        if (!id) return [];
        return allClips().filter((a) => a.interviewId === id && a.stepId === stepId).sort(byCreated);
    };
    const olderClips = (stepId) => {
        const id = interviewId();
        return allClips().filter((a) => a.stepId === stepId && a.interviewId !== id).sort(byCreated);
    };

    // ---------- Blokada wygaszania ekranu na czas nagrania ----------
    function requestWake() {
        const token = ++wakeToken;
        try {
            const p = globalThis.navigator && navigator.wakeLock && navigator.wakeLock.request('screen');
            if (!p) return;
            p.then((l) => {
                if (token === wakeToken) wake = l;
                else l.release().catch(() => {});
            }).catch(() => {});
        } catch (e) { /* bez Wake Lock */ }
    }

    function releaseWake() {
        wakeToken += 1;
        const l = wake;
        wake = null;
        if (l) Promise.resolve().then(() => l.release()).catch(() => {});
    }

    // ---------- Rysowanie ----------
    function paintTimer() {
        const t = mounted && mounted.controls.querySelector('.tz-rec-time');
        if (t) t.textContent = `${formatDuration(recSec)} / ${formatDuration(MAX_RECORDING_SEC)}`;
    }

    function paintControls() {
        if (!mounted) return;
        const { stepId, disabled, controls, msg } = mounted;
        const unsupported = !audioSupported();
        const text = unsupported ? MSG_UNSUPPORTED : transient || (micDenied ? MSG_DENIED : '');
        if (msg.textContent !== text) msg.textContent = text;
        if (disabled || unsupported) { controls.replaceChildren(); return; }
        if (recorder && recStep === stepId) {
            controls.replaceChildren(
                h('span', { class: 'tz-rec-time', role: 'timer' }),
                h('button', { type: 'button', class: 'btn', onclick: () => { stopAndSave(); } }, icon('square'), 'Zatrzymaj'));
            paintTimer();
            return;
        }
        controls.replaceChildren(h('button', {
            type: 'button', class: 'ghost', disabled: !!recorder || savingCount > 0, onclick: () => { startRecording(stepId); },
        }, icon('mic'), 'Nagraj'));
    }

    function clipItem(clip, extra) {
        const when = formatWhen(clip.createdAt);
        const dur = formatDuration(clip.durationSec);
        const playing = !!player && player.id === clip.id;
        // Safari odmówił odtwarzania po odszyfrowaniu: drugie dotknięcie gra już w geście użytkownika.
        const retry = playing && player.blocked
            ? h('button', { type: 'button', class: 'ghost tz-small', onclick: () => retryPlay() }, icon('play'), 'Dotknij ponownie')
            : null;
        return h('li', { class: 'tz-audio-item' },
            h('button', {
                type: 'button', class: 'tz-icbtn', 'aria-pressed': String(playing),
                'aria-label': playing ? `Zatrzymaj odtwarzanie nagrania z ${when}` : `Odtwórz nagranie ${dur} z ${when}`,
                onclick: () => togglePlay(clip),
            }, icon(playing ? 'square' : 'play')),
            h('span', { class: 'tz-audio-main' },
                h('span', { class: 'tz-audio-time' }, dur),
                h('span', { class: 'mut' }, extra ? `${when} · ${extra}` : when)),
            retry,
            h('button', {
                type: 'button', class: 'tz-icbtn', 'aria-label': `Usuń nagranie z ${when}`,
                onclick: () => removeClip(clip, when),
            }, icon('trash')));
    }

    function paintList() {
        if (!mounted) return;
        const items = mounted.disabled ? [] : clips(mounted.stepId);
        mounted.list.hidden = !items.length;
        mounted.list.replaceChildren(...items.map((c) => clipItem(c)));
        // Wcześniejsze wywiady: nagrania powstały za ich zgodą, więc są widoczne także przy nowym wywiadzie.
        const older = olderClips(mounted.stepId);
        mounted.olderBox.hidden = !older.length;
        mounted.older.replaceChildren(...older.map((c) => {
            const iv = c.interviewId ? ctx.vault.get(c.interviewId) : null;
            return clipItem(c, iv && iv.date ? `wywiad z ${iv.date}` : 'wcześniejszy wywiad');
        }));
    }

    const repaint = () => { paintControls(); paintList(); };

    // ---------- Nagrywanie ----------
    async function startRecording(stepId) {
        if (recorder) return;
        transient = null;
        const r = createRecorder({
            onTick: (sec) => {
                if (recorder !== r) return;
                recSec = sec;
                paintTimer();
                if (sec > 0 && sec % TOUCH_EVERY_SEC === 0 && document.visibilityState === 'visible') ctx.lock?.touch?.();
            },
            onAutoStop: (out) => {
                if (recorder !== r) return;
                finish(r, stepId, Promise.resolve(out), true);
            },
        });
        recorder = r;
        recStep = stepId;
        recSec = 0;
        repaint();
        try {
            await r.start();
        } catch (e) {
            if (recorder === r) { recorder = null; recStep = null; }
            const code = e && e.message;
            if (code === 'BRAK_DOSTEPU') micDenied = true;
            transient = code === 'ZAJETY' ? MSG_BUSY : null;
            repaint();
            // Świeży błąd ogłasza czytnik ekranu raz; na kolejnych krokach komunikat stoi bez role=alert.
            if (mounted) mounted.msg.setAttribute('role', 'alert');
            return;
        }
        // Zatrzymane (blokada, wyjście) zanim przeglądarka dała mikrofon: zwalniamy go od razu, bez zapisu.
        if (recorder !== r) { await r.stop(); return; }
        micDenied = false;
        requestWake();
    }

    function track(job) {
        savingCount += 1;
        const run = saving.then(() => job).catch((e) => {
            console.error('[Strefa trenera] zapis nagrania:', e && e.message);
            ctx.toast(SAVE_FAILED);
            return false;
        }).finally(() => {
            savingCount -= 1;
            repaint();
        });
        saving = run;
        if (ctx.holdLock) ctx.holdLock(run);
        return run;
    }

    // Kończy nagranie r i zapisuje je. Klucz sejfu i szkic wywiadu są brane od razu (przed czekaniem na
    // koder), więc zapis kończy się także, gdy w międzyczasie przyjdzie blokada.
    function finish(r, stepId, outPromise, auto = false) {
        recorder = null;
        recStep = null;
        releaseWake();
        let writer = null;
        let idPromise = null;
        try {
            writer = ctx.vault.writer();
            idPromise = Promise.resolve(ensureInterviewId());
        } catch (e) {
            idPromise = Promise.reject(e);
        }
        idPromise.catch(() => {});
        const job = (async () => {
            const out = await outPromise;
            if (!out) return false;
            if (!out.blob.size) { ctx.toast(EMPTY); return false; }
            if (!writer) throw new Error('ZABLOKOWANY');
            const id = await idPromise;
            const data = await blobToB64(out.blob);
            const blob = await writer.put({ kind: 'blob', clientId, data });
            await writer.put({
                kind: AUDIO_KIND, clientId, interviewId: id, stepId, mime: out.mime, durationSec: out.durationSec,
                createdAt: new Date().toISOString(), bytes: out.blob.size, blobId: blob.id,
            });
            if (auto) ctx.toast('Nagranie zapisane (limit 3 minut).');
            return true;
        })();
        const run = track(job);
        repaint();
        return run;
    }

    // Kończy nagrywanie z zapisem (blokada, wyjście z ekranu, zmiana kroku, karty, „Zakończ wywiad”).
    // Zwraca obietnicę wszystkich zapisów nagrań w toku.
    function stopAndSave() {
        const r = recorder;
        if (r) return finish(r, recStep, r.stop());
        return saving;
    }

    // Nagranie w toku z tego kroku znika bez zapisu (wycofanie zgody).
    async function discardStep(stepId) {
        if (recorder && recStep === stepId) {
            const r = recorder;
            recorder = null;
            recStep = null;
            releaseWake();
            repaint();
            await r.stop();
        }
        await saving;
    }

    async function deleteClip(clip) {
        if (player && player.id === clip.id) stopPlayback();
        await ctx.vault.remove(clip.id);
        if (clip.blobId) await ctx.vault.remove(clip.blobId);
    }

    // Nagrania kroku „Zdrowie” ze wszystkich wywiadów klienta (do potwierdzenia przy wycofaniu zgody).
    const healthClipCount = () => allClips().filter((a) => a.stepId === HEALTH_STEP).length;

    // Wycofanie zgody: nagrania o zdrowiu ze wszystkich wywiadów klienta, z nagraniem w toku włącznie.
    async function removeHealthClips() {
        await discardStep(HEALTH_STEP);
        for (const clip of allClips().filter((a) => a.stepId === HEALTH_STEP)) await deleteClip(clip);
        paintList();
    }

    // Samonaprawa: nagranie o zdrowiu wywiadu bez zgody (albo bez wywiadu) nie może leżeć w sejfie.
    async function healOrphans() {
        for (const clip of allClips().filter((a) => a.stepId === HEALTH_STEP)) {
            const iv = clip.interviewId ? ctx.vault.get(clip.interviewId) : null;
            if (iv && iv.consentHealth && iv.consentHealth.given === true) continue;
            await deleteClip(clip);
        }
    }

    // ---------- Odtwarzanie ----------
    function stopPlayback() {
        if (!player) return;
        const p = player;
        player = null;
        try { p.audio.pause(); } catch (e) { /* już zatrzymane */ }
        if (p.url) URL.revokeObjectURL(p.url);
        paintList();
    }

    function playFailed(clip) {
        const webmOnIphone = String(clip.mime || '').startsWith('audio/webm') && isAppleWebKit();
        ctx.toast(webmOnIphone ? WEBM_ON_IOS : PLAY_FAILED);
    }

    // Jeden element audio na cały ekran: odblokowany w geście raz, gra kolejne nagrania (Safari na iPhonie).
    let audioEl = null;
    function element() {
        if (audioEl) return audioEl;
        const a = new Audio();
        const current = () => player && player.audio === a && player.url && a.src === player.url;
        a.addEventListener('ended', () => { if (current()) stopPlayback(); });
        a.addEventListener('error', () => { if (current()) failPlayback(); });
        audioEl = a;
        return a;
    }

    function failPlayback() {
        const p = player;
        if (!p) return;
        stopPlayback();
        playFailed(p.clip);
    }

    function startPlay(me) {
        let started;
        try { started = me.audio.play(); } catch (e) { started = Promise.reject(e); }
        Promise.resolve(started).catch((e) => {
            if (player !== me) return;
            if (e && e.name === 'NotAllowedError') { me.blocked = true; paintList(); } else failPlayback();
        });
    }

    function retryPlay() {
        if (!player || !player.blocked) return;
        player.blocked = false;
        paintList();
        startPlay(player);
    }

    // Treść nagrania jest odszyfrowywana dopiero tutaj i żyje tylko w adresie obiektu do końca odtwarzania.
    // Przed czekaniem na odszyfrowanie element dostaje w geście dotknięcia cichy dźwięk (odblokowanie),
    // potem prawdziwe nagranie gra na tym samym elemencie.
    function togglePlay(clip) {
        if (player && player.id === clip.id && player.blocked) { retryPlay(); return; }
        const same = player && player.id === clip.id;
        stopPlayback();
        if (same) return;
        const audio = element();
        const me = { id: clip.id, clip, url: null, audio, blocked: false };
        player = me;
        try {
            audio.src = SILENT;
            const p = audio.play();
            if (p && p.catch) p.catch(() => {});
        } catch (e) { /* odblokowanie się nie udało: spróbujemy po odszyfrowaniu */ }
        paintList();
        (async () => {
            let blob = null;
            try {
                blob = clip.blobId ? await ctx.vault.getBlob(clip.blobId) : null;
            } catch (e) {
                blob = null;
            }
            if (player !== me) return;
            if (!blob || !blob.data) { failPlayback(); return; }
            me.url = URL.createObjectURL(b64ToBlob(blob.data, clip.mime));
            blob = null;
            audio.src = me.url;
            startPlay(me);
        })();
    }

    async function removeClip(clip, when) {
        const ok = await ctx.confirm({
            title: 'Usunąć nagranie?',
            text: `Nagranie z ${when} zniknie z sejfu. Tego nie da się cofnąć.`,
            okLabel: 'Usuń', danger: true,
        });
        if (!ok) return;
        try {
            await deleteClip(clip);
        } catch (e) {
            console.error('[Strefa trenera] usuwanie nagrania:', e && e.message);
            ctx.toast(DELETE_FAILED);
        }
        paintList();
    }

    // Karta „Uwagi” kroku. disabled: krok „Zdrowie” bez zgody (bez pola i bez nowych nagrań).
    function card(step, { value, disabled, onInput }) {
        const controls = h('div', { class: 'tz-row tz-rec' });
        const list = h('ul', { class: 'tz-audio', 'aria-label': `Nagrania — ${step.label}` });
        const older = h('ul', { class: 'tz-audio', 'aria-label': `Nagrania z wcześniejszych wywiadów — ${step.label}` });
        const olderBox = h('div', { class: 'tz-stack tz-tight', hidden: true },
            h('p', { class: 'sub' }, 'Z wcześniejszych wywiadów'), older);
        const msg = h('p', { class: 'tz-error' });
        const id = `tz-uwagi-${step.id}`;
        transient = null;
        mounted = { stepId: step.id, disabled, controls, list, older, olderBox, msg };
        repaint();
        return h('section', { class: 'card tz-stack tz-notes' },
            h('label', { class: 'tz-field', for: id },
                h('span', { class: 'hd tz-notes-hd' }, 'Uwagi')),
            h('textarea', {
                id, class: 'in', rows: 4, value: value || '', disabled, autocomplete: 'off',
                oninput: (e) => onInput(e.target.value),
            }),
            h('p', { class: 'mut' }, DICTATE_HINT),
            controls, msg, list, olderBox);
    }

    // Zmiana kroku: karta poprzedniego kroku znika.
    function unmount() {
        mounted = null;
    }

    async function load() {
        try {
            await healOrphans();
        } catch (e) {
            console.error('[Strefa trenera] nagrania:', e && e.message);
        }
        paintList();
    }

    return {
        card, load, unmount, stopAndSave, stopPlayback, removeHealthClips, healthClipCount,
        isRecording: () => !!recorder,
    };
}
