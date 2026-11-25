// „Wydaj kod” dla właściciela (spec 6.3): ukryte wczytanie klucza prywatnego z pliku, karta w Ustawieniach
// i ekran wydawania kodów. Klucz żyje tylko w zaszyfrowanym sejfie (rekord owner_key); nigdy w localStorage,
// logach ani atrybutach DOM. Wydany kod pokazujemy raz, na liście zostają tylko imię i daty.
import { h, icon } from './dom.js';
import { importPrivateKeyJwk, signTrainerCode, verifyTrainerCode } from '../trainerCode.js';
import { effectivePublicKeyJwk } from '../trainerAccess.js';

const LONG_PRESS_MS = 3000;
const NAME_MAX = 80;
const WRONG_KEY = 'To nie jest klucz tej aplikacji';
const SAVE_FAILED = 'Nie udało się zapisać. Spróbuj jeszcze raz.';

const ownerKey = (ctx) => ctx.vault.list('owner_key')[0] || null;

function today() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// Zwraca czysty JWK klucza prywatnego albo null, gdy plik nie jest kluczem tej aplikacji.
async function validateOwnerKey(raw) {
    try {
        const pub = effectivePublicKeyJwk();
        if (!raw || raw.kty !== 'EC' || raw.crv !== 'P-256' || typeof raw.d !== 'string') return null;
        if (raw.x !== pub.x || raw.y !== pub.y) return null;
        const jwk = { kty: raw.kty, crv: raw.crv, x: raw.x, y: raw.y, d: raw.d };
        // Dopasowane x/y nie dowodzą jeszcze, że d jest ich częścią: kontrolny podpis musi przejść.
        const probe = await signTrainerCode(await importPrivateKeyJwk(jwk), { name: 'kontrola', issuedAt: today(), expiresAt: null });
        const r = await verifyTrainerCode(probe, { publicKeyJwk: pub });
        return r.ok ? jwk : null;
    } catch {
        return null;
    }
}

// Ukryte wejście: przytrzymanie napisu wersji przez 3 s odsłania „Wczytaj klucz właściciela”.
export function ownerKeyEntry(ctx, onLoaded) {
    const error = h('p', { class: 'tz-error', role: 'alert' });
    const input = h('input', { type: 'file', accept: 'application/json,.json', hidden: true });
    const load = h('button', { type: 'button', class: 'ghost', hidden: true }, icon('lock'), 'Wczytaj klucz właściciela');
    load.addEventListener('click', () => input.click());

    input.addEventListener('change', async () => {
        const file = input.files && input.files[0];
        if (!file) return;
        error.textContent = '';
        let raw = null;
        try {
            raw = JSON.parse(await file.text());
        } catch {
            raw = null;
        }
        input.value = '';
        const jwk = await validateOwnerKey(raw);
        raw = null;
        if (!jwk) {
            error.textContent = `${WRONG_KEY}.`;
            return;
        }
        try {
            const existing = ownerKey(ctx);
            await ctx.vault.put({ ...(existing ? { id: existing.id } : {}), kind: 'owner_key', jwk });
        } catch (e) {
            console.error('[Strefa trenera] klucz właściciela:', e && e.message);
            ctx.toast(SAVE_FAILED);
            return;
        }
        ctx.toast('Klucz właściciela wczytany.');
        onLoaded();
    });

    let timer = null;
    const cancel = () => { clearTimeout(timer); timer = null; };
    const version = h('p', { class: 'mut tz-version', dataset: { wersja: '' } }, `Wersja aplikacji ${window.APP_VERSION || ''}`.trim());
    version.addEventListener('pointerdown', () => {
        cancel();
        timer = setTimeout(() => { load.hidden = false; timer = null; }, LONG_PRESS_MS);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => version.addEventListener(ev, cancel));
    version.addEventListener('contextmenu', (e) => e.preventDefault());

    return h('div', { class: 'tz-stack' }, version, h('div', { class: 'tz-row' }, load), input, error);
}

// Karta w Ustawieniach: tylko przy wczytanym kluczu właściciela.
export function issueCard(ctx) {
    if (!ownerKey(ctx)) return null;
    return h('section', { class: 'card tz-stack', dataset: { ustawienie: 'wydaj-kod' } },
        h('h2', { class: 'hd tz-set-hd' }, 'Wydaj kod'),
        h('p', { class: 'sub' }, 'Klucz właściciela jest w zaszyfrowanym sejfie tej Strefy. Wydasz kod imienny dla innego trenera.'),
        h('div', { class: 'tz-row' },
            h('button', { type: 'button', class: 'btn', onclick: () => ctx.show('issue') }, icon('mail'), 'Wydaj kod')));
}

function formatDate(iso) {
    return iso || '';
}

async function copyText(ctx, text) {
    try {
        await navigator.clipboard.writeText(text);
        ctx.toast('Skopiowano.');
    } catch {
        ctx.toast('Nie udało się skopiować. Zaznacz kod i skopiuj go ręcznie.');
    }
}

async function renderIssue(root, params, ctx) {
    if (!ctx.vault.isUnlocked()) {
        ctx.show(await ctx.resolve(), {}, { reset: true });
        return;
    }
    const key = ownerKey(ctx);
    if (!key) {
        ctx.show('settings');
        return;
    }

    const name = h('input', { class: 'in', type: 'text', autocomplete: 'off', maxlength: NAME_MAX });
    const error = h('p', { class: 'tz-error', role: 'alert' });
    const result = h('div', { class: 'tz-stack' });
    const list = h('div', { class: 'tz-stack tz-issue-list' });
    const issue = h('button', { type: 'button', class: 'btn' }, icon('check'), 'Wydaj');

    const paintList = () => {
        const rows = ctx.vault.list('issued_code')
            .reverse()
            .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
        list.replaceChildren(...(rows.length
            ? rows.map((r) => h('div', { class: 'tz-tight tz-stack', dataset: { wydany: '' } },
                h('strong', {}, r.name),
                h('span', { class: 'mut' }, `Wydany ${formatDate(r.issuedAt)}, ${r.expiresAt ? `ważny do ${formatDate(r.expiresAt)}` : 'bez terminu'}`)))
            : [h('p', { class: 'mut' }, 'Nikt jeszcze nie dostał kodu.')]));
    };

    const showResult = (code) => {
        const text = `Twój kod trenera BodyBuild: ${code}. Profil → Jestem trenerem → Strefa trenera → Mam kod.`;
        const share = async () => {
            if (typeof navigator.share === 'function') {
                try {
                    await navigator.share({ text });
                    return;
                } catch (e) {
                    if (e && e.name === 'AbortError') return;
                }
            }
            await copyText(ctx, text);
        };
        result.replaceChildren(
            h('p', { class: 'sub' }, 'Kod widać tylko teraz. Skopiuj go albo wyślij od razu.'),
            h('p', { class: 'tz-code tz-issued-code' }, code),
            h('div', { class: 'tz-row' },
                h('button', { type: 'button', class: 'ghost', onclick: () => copyText(ctx, code) }, icon('copy'), 'Kopiuj'),
                h('button', { type: 'button', class: 'ghost', onclick: share }, icon('share'), 'Udostępnij')));
    };

    let busy = false;
    issue.addEventListener('click', async () => {
        if (busy) return;
        const who = name.value.trim().slice(0, NAME_MAX);
        // Kody są bez terminu ważności (spec 6.3: termin to przyszłe wydanie). Kod z terminem odciąłby
        // trenera od danych klientów, więc pola „Ważny do” nie ma. Weryfikacja `e` w trainerCode.js zostaje.
        const expiresAt = null;
        if (!who) { error.textContent = 'Podaj imię i nazwisko.'; name.focus(); return; }
        error.textContent = '';
        busy = true;
        issue.disabled = true;
        try {
            const record = ownerKey(ctx);
            if (!record) { ctx.show('settings'); return; }
            const issuedAt = today();
            const code = await signTrainerCode(await importPrivateKeyJwk(record.jwk), { name: who, issuedAt, expiresAt });
            // Kontrola: kod ma od razu przejść tę samą weryfikację, której użyje trener.
            const check = await verifyTrainerCode(code, { publicKeyJwk: effectivePublicKeyJwk() });
            if (!check.ok || check.name !== who) {
                error.textContent = 'Kod nie przeszedł kontroli. Wczytaj klucz właściciela jeszcze raz.';
                return;
            }
            showResult(code);
            name.value = '';
            try {
                await ctx.vault.put({ kind: 'issued_code', name: who, issuedAt, expiresAt });
            } catch (e) {
                console.error('[Strefa trenera] lista wydanych kodów:', e && e.message);
                ctx.toast('Kod gotowy, ale nie trafił na listę wydanych.');
            }
            paintList();
        } catch (e) {
            console.error('[Strefa trenera] wydawanie kodu:', e && e.message);
            error.textContent = 'Nie udało się wydać kodu. Spróbuj jeszcze raz.';
        } finally {
            busy = false;
            issue.disabled = false;
        }
    });

    paintList();
    root.append(
        h('section', { class: 'card tz-stack' },
            h('h2', { class: 'hd' }, 'Wydaj kod'),
            h('label', { class: 'tz-field' }, h('span', { class: 'sub' }, 'Imię i nazwisko'), name),
            error,
            h('div', { class: 'tz-row' }, issue),
            result),
        h('section', { class: 'card tz-stack' }, h('h2', { class: 'hd tz-set-hd' }, 'Wydane kody'), list));
}

export function registerIssueScreen(register) {
    register('issue', renderIssue);
}
