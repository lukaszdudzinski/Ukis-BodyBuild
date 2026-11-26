// Nagrania głosowe w „Uwagach” wywiadu: wybór formatu, rejestrator (MediaRecorder) i zamiana na base64.
// Nagranie trafia do sejfu jako zaszyfrowany opis interview_audio i blob z treścią (nigdy do localStorage
// ani do zwykłego IndexedDB). Rejestrator zawsze zwalnia mikrofon po zatrzymaniu.
import { toB64, fromB64 } from './trainerCrypto.js';

export const AUDIO_KIND = 'interview_audio';
export const MAX_RECORDING_SEC = 180;
// Mowa w 32 kb/s brzmi dobrze i waży ok. 240 kB na minutę (przed szyfrowaniem i base64).
export const AUDIO_BITRATE = 32000;

const WEBM = ['audio/webm;codecs=opus', 'audio/webm'];
const MP4 = ['audio/mp4'];

// iPhone i iPad (każda przeglądarka to tam WebKit) oraz Safari na Macu: AAC w MP4 odtworzy każdy telefon.
export function isAppleWebKit(ua = globalThis.navigator ? navigator.userAgent : '') {
    return /iPhone|iPad|iPod/.test(ua) || (/Safari\//.test(ua) && !/Chrome|Chromium|Edg|Android|Firefox/.test(ua));
}

// Format nagrania: audio/mp4 na iOS, audio/webm gdzie indziej; '' gdy żaden nie działa (wybiera przeglądarka).
export function pickAudioMime(MR = globalThis.MediaRecorder, ua = globalThis.navigator ? navigator.userAgent : '') {
    if (!MR || typeof MR.isTypeSupported !== 'function') return '';
    const order = isAppleWebKit(ua) ? [...MP4, ...WEBM] : [...WEBM, ...MP4];
    return order.find((t) => { try { return MR.isTypeSupported(t); } catch (e) { return false; } }) || '';
}

export function audioSupported({ mediaDevices = globalThis.navigator && navigator.mediaDevices, MR = globalThis.MediaRecorder } = {}) {
    return !!(mediaDevices && typeof mediaDevices.getUserMedia === 'function' && MR);
}

// 0:05, 2:59, 62:05
export function formatDuration(sec) {
    const s = Math.max(0, Math.round(Number(sec) || 0));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export async function blobToB64(blob) {
    return toB64(new Uint8Array(await blob.arrayBuffer()));
}

export function b64ToBlob(b64, mime) {
    return new Blob([fromB64(b64)], { type: mime || '' });
}

// Rejestrator jednego nagrania naraz. start() prosi o mikrofon; stop() zwraca { blob, mime, durationSec }
// (null, gdy nic nie nagrywa). Po maxSec nagranie kończy się samo i trafia do onAutoStop.
// Błędy startu: BRAK_NAGRYWANIA (przeglądarka nie nagrywa), BRAK_DOSTEPU (brak zgody na mikrofon),
// ZAJETY (mikrofon zajęty, odłączony albo start przerwany: można spróbować ponownie).
export function createRecorder({
    mediaDevices = globalThis.navigator && navigator.mediaDevices,
    MR = globalThis.MediaRecorder,
    maxSec = MAX_RECORDING_SEC,
    now = () => Date.now(),
    onTick = () => {},
    onAutoStop = () => {},
} = {}) {
    let rec = null;
    let stream = null;
    let chunks = [];
    let startedAt = 0;
    let timer = null;
    let stopping = null;
    let mime = '';

    const release = () => {
        clearInterval(timer);
        timer = null;
        if (stream) {
            for (const t of stream.getTracks()) { try { t.stop(); } catch (e) { /* już zatrzymana */ } }
        }
        stream = null;
    };

    const elapsed = () => Math.min(maxSec, (now() - startedAt) / 1000);

    function stop() {
        if (stopping) return stopping;
        if (!rec) return Promise.resolve(null);
        const r = rec;
        const durationSec = Math.max(1, Math.round(elapsed()));
        // Licznik (i odświeżanie autoblokady) staje od razu, nie dopiero po zdarzeniu „stop”.
        clearInterval(timer);
        timer = null;
        stopping = new Promise((resolve) => {
            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                release();
                const type = r.mimeType || mime || (chunks[0] && chunks[0].type) || '';
                const blob = new Blob(chunks, { type });
                rec = null;
                chunks = [];
                stopping = null;
                resolve({ blob, mime: type, durationSec });
            };
            r.onstop = finish;
            r.onerror = finish;
            // Gdyby zdarzenie „stop” nie przyszło (zawieszony koder), kończymy tym, co już jest.
            setTimeout(finish, 2000);
            try {
                if (r.state !== 'inactive') r.stop();
                else finish();
            } catch (e) {
                finish();
            }
        });
        return stopping;
    }

    async function start() {
        if (rec) return;
        if (!audioSupported({ mediaDevices, MR })) throw new Error('BRAK_NAGRYWANIA');
        try {
            stream = await mediaDevices.getUserMedia({ audio: true });
        } catch (e) {
            stream = null;
            const name = e && e.name;
            throw new Error(name === 'NotAllowedError' || name === 'SecurityError' ? 'BRAK_DOSTEPU' : 'ZAJETY');
        }
        mime = pickAudioMime(MR);
        const opts = { audioBitsPerSecond: AUDIO_BITRATE, ...(mime ? { mimeType: mime } : {}) };
        try {
            rec = new MR(stream, opts);
        } catch (e) {
            try {
                rec = new MR(stream);
            } catch (e2) {
                release();
                throw new Error('BRAK_NAGRYWANIA');
            }
        }
        chunks = [];
        rec.ondataavailable = (e) => { if (e && e.data && e.data.size) chunks.push(e.data); };
        startedAt = now();
        try {
            // Bez timeslice: całe nagranie w jednym kawałku przy stop() (najpewniejszy plik MP4 w Safari).
            rec.start();
        } catch (e) {
            rec = null;
            release();
            throw new Error('BRAK_NAGRYWANIA');
        }
        timer = setInterval(() => {
            const sec = elapsed();
            onTick(Math.floor(sec));
            if (sec >= maxSec) stop().then((out) => { if (out) onAutoStop(out); });
        }, 250);
    }

    return { start, stop, isRecording: () => !!rec && !stopping };
}
