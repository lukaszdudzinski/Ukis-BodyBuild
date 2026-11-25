// Ekrany sejfu Strefy trenera (spec rozdz. 7): setup (hasło), recovery-show (kod awaryjny),
// unlock (hasło po blokadzie), recovery-use (kod awaryjny + nowe hasło), wipe (usunięcie Strefy).
// Hasło i kod awaryjny żyją tylko w polach formularza i w pamięci sejfu; nic ich nie zapisuje ani nie loguje.
import { h, icon } from './dom.js';
import { checkPasswordRules } from '../trainerCrypto.js';
import { autolockMs } from '../trainerLock.js';

const RULES = [
    { label: 'Co najmniej 8 znaków', ok: (r) => r.length },
    { label: 'Wielka i mała litera', ok: (r) => r.upper && r.lower },
    { label: 'Cyfra', ok: (r) => r.digit },
    { label: 'Znak specjalny, np. ! ? # albo spacja', ok: (r) => r.special },
];

const WIPE_WORD = 'USUŃ';
const DAMAGED = 'Sejf jest uszkodzony. Użyj kodu awaryjnego albo usuń Strefę.';
const FAILED = 'Coś poszło nie tak. Spróbuj jeszcze raz.';

let seq = 0;

// Kod awaryjny świeżo po pierwszej konfiguracji (sejf jeszcze pusty), do kliknięcia „Gotowe”. Tylko w pamięci
// strony (nie w historii ekranów). Do tego czasu autoblokada nie działa, a wejście do Strefy wraca do kodu.
// Nowy kod z ustawień tej ochrony nie dostaje: sejf ma już dane klientów, więc autoblokada działa dalej.
let pendingCode = null;

export function pendingRecoveryCode() {
    return pendingCode;
}
const nextId = (name) => `tz-${name}-${++seq}`;

function field(label, control) {
    return h('label', { class: 'tz-field' }, h('span', { class: 'sub' }, label), control);
}

function checkbox(label, onChange) {
    const input = h('input', { type: 'checkbox', onchange: onChange });
    return { input, node: h('label', { class: 'tz-check' }, input, h('span', {}, label)) };
}

// Pole hasła z przyciskiem „pokaż”. Etykieta wskazuje pole przez `for`, więc przycisk ma własną nazwę.
export function passwordField(label, { autocomplete = 'current-password', onInput } = {}) {
    const id = nextId('pw');
    const input = h('input', {
        id, class: 'in', type: 'password', autocomplete, autocapitalize: 'off', spellcheck: 'false', oninput: onInput,
    });
    const toggle = h('button', { type: 'button', class: 'tz-pwbtn', 'aria-label': 'Pokaż hasło', 'aria-pressed': 'false' }, icon('eye'));
    toggle.addEventListener('click', () => {
        const visible = input.type === 'password';
        input.type = visible ? 'text' : 'password';
        toggle.setAttribute('aria-pressed', String(visible));
        toggle.setAttribute('aria-label', visible ? 'Ukryj hasło' : 'Pokaż hasło');
        toggle.replaceChildren(icon(visible ? 'eye-off' : 'eye'));
    });
    const node = h('div', { class: 'tz-field' },
        h('label', { class: 'sub', for: id }, label),
        h('div', { class: 'tz-pw' }, input, toggle));
    return { input, node };
}

// Nowe hasło dwa razy i lista warunków T12 z zaznaczeniem spełnionych.
export function newPasswordFields(onChange, { label = 'Hasło', repeatLabel = 'Powtórz hasło' } = {}) {
    const items = RULES.map((rule) => {
        const mark = h('span', { class: 'tz-rule-ic' }, icon('circle'));
        const state = h('span', { class: 'tz-sr' }, ' — niespełniony');
        const li = h('li', { class: 'tz-rule', dataset: { ok: 'false' } }, mark, h('span', {}, rule.label), state);
        return { rule, li, mark, state };
    });
    const mismatch = h('p', { class: 'tz-error', 'aria-live': 'polite' });

    const update = () => {
        const r = checkPasswordRules(pw.input.value);
        for (const item of items) {
            const ok = !!item.rule.ok(r);
            if (item.li.dataset.ok === String(ok)) continue;
            item.li.dataset.ok = String(ok);
            item.mark.replaceChildren(icon(ok ? 'check' : 'circle'));
            item.state.textContent = ok ? ' — spełniony' : ' — niespełniony';
        }
        mismatch.textContent = repeat.input.value && repeat.input.value !== pw.input.value ? 'Hasła się różnią.' : '';
        onChange();
    };

    const pw = passwordField(label, { autocomplete: 'new-password', onInput: update });
    const repeat = passwordField(repeatLabel, { autocomplete: 'new-password', onInput: update });
    const list = h('ul', { class: 'tz-rules', 'aria-label': 'Warunki hasła' }, items.map((i) => i.li));

    return {
        nodes: [pw.node, list, repeat.node, mismatch],
        value: () => pw.input.value,
        ok: () => checkPasswordRules(pw.input.value).ok && pw.input.value === repeat.input.value,
        clear: () => { pw.input.value = ''; repeat.input.value = ''; update(); },
    };
}

export function formatWait(seconds) {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

// Przycisk zajęty na czas PBKDF2; nieznany błąd kończy się komunikatem, a nie odrzuconą obietnicą.
export async function busy(button, ctx, fn) {
    if (button.disabled) return;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    try {
        await fn();
    } catch (e) {
        console.error('[Strefa trenera] sejf:', e && e.message);
        ctx.toast(FAILED);
    } finally {
        button.removeAttribute('aria-busy');
    }
}

// Czas autoblokady z ustawień Strefy obowiązuje po każdym odblokowaniu.
function applyAutolock(ctx) {
    let settings = null;
    try { settings = ctx.vault.list('trainer_settings')[0]; } catch (e) { /* zablokowany: zostaje domyślny */ }
    ctx.lock.setIdleMs(autolockMs(settings));
}

function unlocked(ctx) {
    ctx.lock.start();
    applyAutolock(ctx);
    ctx.show('clients', {}, { reset: true });
}

// „Nowy kod awaryjny” w ustawieniach: ten sam ekran co po konfiguracji. Kod jest tylko w parametrach ekranu
// i zapisuje się dopiero po „Gotowe”. Blokada albo przeładowanie wcześniej odrzuca go, a stary kod działa dalej.
export function showNewRecoveryCode(ctx, code) {
    ctx.show('recovery-show', { code });
}

function renderSetup(root, params, ctx) {
    const error = h('p', { class: 'tz-error', role: 'alert' });
    const next = h('button', { type: 'button', class: 'btn', disabled: true }, 'Dalej');
    const refresh = () => { next.disabled = !(pw.ok() && consent.input.checked); };
    const pw = newPasswordFields(refresh);
    const consent = checkbox('Rozumiem, że odpowiadam za dane moich klientów (RODO)', refresh);

    next.addEventListener('click', () => busy(next, ctx, async () => {
        try {
            const { recoveryCode } = await ctx.vault.setup(pw.value());
            pendingCode = recoveryCode;
            ctx.show('recovery-show', {}, { reset: true });
        } catch (e) {
            if (e && e.message === 'SLABE_HASLO') error.textContent = 'Hasło nie spełnia warunków.';
            else if (e && e.message === 'SEJF_ISTNIEJE') ctx.show(await ctx.resolve(), {}, { reset: true });
            else throw e;
        } finally {
            refresh();
        }
    }));

    root.append(h('section', { class: 'card tz-stack' },
        h('h2', { class: 'hd' }, 'Konfiguracja Strefy'),
        h('p', { class: 'sub' }, 'Ustal hasło do Strefy trenera. Szyfruje ono dane Twoich klientów na tym urządzeniu.'),
        pw.nodes,
        consent.node,
        error,
        h('div', { class: 'tz-row' }, next)));
}

function renderRecoveryShow(root, params, ctx) {
    const replacing = !!params.code;
    const code = params.code || pendingCode;
    if (!code) {
        ctx.show('clients', {}, { reset: true });
        return;
    }
    const firstSetup = () => {
        pendingCode = null;
        unlocked(ctx);
    };
    // Nowy kod z ustawień: zapis dopiero teraz, od tej chwili stary kod nie działa.
    const commit = () => busy(done, ctx, async () => {
        try {
            await ctx.vault.commitRecoveryCode(code);
            ctx.toast('Nowy kod awaryjny zapisany. Stary już nie działa.');
            ctx.show('settings', {}, { reset: true });
        } finally {
            if (root.isConnected) done.disabled = !saved.input.checked;
        }
    });
    const done = h('button', { type: 'button', class: 'btn', disabled: true, onclick: replacing ? commit : firstSetup }, icon('check'), 'Gotowe');
    const saved = checkbox('Zapisałem kod', () => { done.disabled = !saved.input.checked; });

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            ctx.toast('Kod skopiowany.');
        } catch (e) {
            ctx.toast('Nie udało się skopiować. Przepisz kod ręcznie.');
        }
    };
    const share = async () => {
        if (!navigator.share) {
            await copy();
            return;
        }
        try {
            await navigator.share({ title: 'Kod awaryjny Strefy trenera', text: code });
        } catch (e) {
            if (!e || e.name !== 'AbortError') ctx.toast('Nie udało się udostępnić. Użyj „Kopiuj”.');
        }
    };

    root.append(h('section', { class: 'card tz-stack' },
        h('h2', { class: 'hd' }, replacing ? 'Nowy kod awaryjny' : 'Zapisz kod awaryjny'),
        h('p', { class: 'sub' }, 'Kod awaryjny odblokuje Strefę, gdy zapomnisz hasła. Zapisz go poza telefonem.'),
        replacing ? h('p', { class: 'sub' }, 'Nowy kod zacznie działać po „Gotowe”. Do tego czasu działa stary.') : null,
        // <wbr> po myślniku: kod łamie się tylko między grupami.
        h('p', { class: 'tz-code' }, code.split('-').flatMap((g, i) => (i ? ['-', h('wbr'), g] : [g]))),
        h('div', { class: 'tz-row' },
            h('button', { type: 'button', class: 'ghost', onclick: copy }, icon('copy'), 'Kopiuj'),
            h('button', { type: 'button', class: 'ghost', onclick: share }, icon('share'), 'Udostępnij')),
        h('p', { class: 'hi tz-warn' }, icon('alert'), h('span', {}, 'Bez hasła i bez tego kodu danych klientów nie odzyska nikt, także twórca aplikacji.')),
        saved.node,
        h('div', { class: 'tz-row' }, done,
            replacing ? h('button', { type: 'button', class: 'ghost', onclick: () => ctx.show('settings', {}, { reset: true }) }, 'Anuluj') : null)));
}

async function renderUnlock(root, params, ctx) {
    const pw = passwordField('Hasło');
    const error = h('p', { class: 'tz-error', role: 'alert' });
    // type="button": aplikacja maluje button[type=submit] po swojemu. Enter w polu i tak wysyła formularz.
    const submit = h('button', { type: 'button', class: 'btn' }, icon('lock'), 'Odblokuj');
    let timer = null;
    let waiting = false;

    const countdown = (until) => {
        const end = Date.parse(until);
        const tick = () => {
            const left = Math.ceil((end - Date.now()) / 1000);
            if (!root.isConnected || left <= 0) {
                clearInterval(timer);
                timer = null;
                waiting = false;
                if (root.isConnected) {
                    error.textContent = '';
                    submit.disabled = false;
                }
                return;
            }
            waiting = true;
            submit.disabled = true;
            error.textContent = `Spróbuj za ${formatWait(left)}`;
        };
        clearInterval(timer);
        tick();
        if (waiting) timer = setInterval(tick, 1000);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (waiting) return;
        busy(submit, ctx, async () => {
            try {
                await ctx.vault.unlock(pw.input.value);
                pw.input.value = '';
                unlocked(ctx);
            } catch (err) {
                pw.input.value = '';
                const until = err && err.cause && err.cause.until;
                if (err && (err.message === 'ZA_DUZO_PROB' || (err.message === 'ZLE_HASLO' && until))) countdown(until);
                else if (err && err.message === 'ZLE_HASLO') error.textContent = 'Złe hasło';
                else if (err && err.message === 'USZKODZONY_SEJF') error.textContent = DAMAGED;
                else if (err && err.message === 'BRAK_SEJFU') ctx.show(await ctx.resolve(), {}, { reset: true });
                else throw err;
            } finally {
                if (!waiting) submit.disabled = false;
                if (root.isConnected) pw.input.focus();
            }
        });
    };

    submit.addEventListener('click', onSubmit);

    root.append(h('section', { class: 'card tz-stack' },
        h('h2', { class: 'hd' }, 'Strefa zablokowana'),
        h('p', { class: 'sub' }, 'Wpisz hasło do Strefy trenera.'),
        h('form', { class: 'tz-stack', onsubmit: onSubmit, novalidate: true },
            pw.node,
            error,
            h('div', { class: 'tz-row' }, submit)),
        h('div', { class: 'tz-links' },
            h('button', { type: 'button', class: 'tz-link', onclick: () => ctx.show('recovery-use') }, 'Nie pamiętam hasła'),
            h('button', { type: 'button', class: 'tz-link', onclick: () => ctx.show('wipe') }, 'Usuń Strefę trenera i zacznij od nowa'))));

    const { until } = await ctx.vault.failedAttempts();
    if (until && root.isConnected) countdown(until);
}

function renderRecoveryUse(root, params, ctx) {
    const code = h('input', { class: 'in tz-mono', type: 'text', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', placeholder: 'XXXX-XXXX-XXXX-XXXX-XXXX-XXXX' });
    const error = h('p', { class: 'tz-error', role: 'alert' });
    const change = h('button', { type: 'button', class: 'btn', disabled: true }, 'Zmień hasło');
    const refresh = () => { change.disabled = !(code.value.trim() && pw.ok()); };
    const pw = newPasswordFields(refresh);
    code.addEventListener('input', refresh);

    change.addEventListener('click', () => busy(change, ctx, async () => {
        try {
            await ctx.vault.unlockWithRecovery(code.value, pw.value());
            ctx.toast('Hasło zmienione');
            unlocked(ctx);
        } catch (e) {
            if (e && e.message === 'ZLY_KOD') error.textContent = 'Zły kod awaryjny.';
            else if (e && e.message === 'SLABE_HASLO') error.textContent = 'Hasło nie spełnia warunków.';
            else if (e && e.message === 'USZKODZONY_SEJF') error.textContent = DAMAGED;
            else if (e && e.message === 'BRAK_SEJFU') ctx.show(await ctx.resolve(), {}, { reset: true });
            else throw e;
        } finally {
            refresh();
        }
    }));

    root.append(h('section', { class: 'card tz-stack' },
        h('h2', { class: 'hd' }, 'Kod awaryjny'),
        h('p', { class: 'sub' }, 'Wpisz kod awaryjny zapisany przy konfiguracji i ustal nowe hasło. Kod awaryjny zostaje ten sam.'),
        field('Kod awaryjny', code),
        pw.nodes,
        error,
        h('div', { class: 'tz-row' }, change)));
}

function renderWipe(root, params, ctx) {
    const word = h('input', { class: 'in', type: 'text', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false' });
    const wipe = h('button', { type: 'button', class: 'btn', disabled: true }, icon('trash'), 'Usuń Strefę');
    const matches = () => word.value.trim().normalize('NFC') === WIPE_WORD;
    word.addEventListener('input', () => { wipe.disabled = !matches(); });

    wipe.addEventListener('click', () => busy(wipe, ctx, async () => {
        try {
            if (!matches()) return;
            const first = await ctx.confirm({
                title: 'Usunąć Strefę trenera?',
                text: 'Znikną wszyscy klienci, wywiady, plany i postępy zapisane w Strefie.',
                okLabel: 'Usuń',
                danger: true,
            });
            if (!first) return;
            const second = await ctx.confirm({
                title: 'Na pewno?',
                text: 'Tego nie da się cofnąć. Bez hasła i kodu awaryjnego nikt nie odzyska tych danych.',
                okLabel: 'Usuń na zawsze',
                danger: true,
            });
            if (!second) return;
            ctx.lock.stop();
            await ctx.vault.wipe();
            ctx.toast('Strefa trenera usunięta.');
            ctx.show('setup', {}, { reset: true });
        } finally {
            wipe.disabled = !matches();
        }
    }));

    root.append(h('section', { class: 'card tz-stack' },
        h('h2', { class: 'hd' }, 'Usuń Strefę trenera'),
        h('p', { class: 'sub' }, 'Usunięcie skasuje wszystkie dane klientów zapisane w Strefie na tym urządzeniu. Kod trenera zostaje, a Strefę skonfigurujesz od nowa.'),
        field(`Wpisz ${WIPE_WORD}, aby potwierdzić`, word),
        h('div', { class: 'tz-row' },
            wipe,
            h('button', { type: 'button', class: 'ghost', onclick: () => ctx.show(ctx.vault.isUnlocked() ? 'settings' : 'unlock') }, 'Anuluj'))));
}

export function registerVaultScreens(register) {
    register('setup', renderSetup);
    register('recovery-show', renderRecoveryShow);
    register('unlock', renderUnlock);
    register('recovery-use', renderRecoveryUse);
    register('wipe', renderWipe);
}
