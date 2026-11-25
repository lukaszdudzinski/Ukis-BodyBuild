// Ustawienia Strefy trenera (trasa settings, spec 9.10, wydanie 1): hasło, kod awaryjny, autoblokada,
// motyw, zwykła część aplikacji (rozdz. 10), pola składu ciała, kopia zapasowa i usunięcie Strefy.
// Ustawienia Strefy żyją w zaszyfrowanym rekordzie trainer_settings; motyw i sekcje są jawne (localStorage),
// bo działają przed odblokowaniem. Zapis, który się nie uda, kończy się komunikatem, nigdy udanym wyglądem.
import { h, icon } from './dom.js';
import { passwordField, newPasswordFields, busy, formatWait, showNewRecoveryCode } from './vaultScreens.js';
import { AUTOLOCK_MINUTES, autolockMs } from '../trainerLock.js';
import { COMPOSITION_FIELDS, nextCustomFieldId } from '../trainerMeasurements.js';
import { SECTIONS, loadSections, saveSections } from '../trainerSections.js';
import { lastBackupAt, backupLabel } from '../trainerBackup.js';
import { ownerKeyEntry, issueCard } from './issueScreen.js';

const SAVE_FAILED = 'Nie udało się zapisać. Spróbuj jeszcze raz.';
const LABEL_MAX = 40;
const UNIT_MAX = 12;

const MODE_OPTIONS = [
    { id: 'pelna', label: 'Pełna', hint: 'Cała aplikacja jak dotąd.' },
    { id: 'tylko-trener', label: 'Tylko Strefa trenera', hint: 'Aplikacja od razu otwiera Strefę. Profil i Serwis są tutaj, w ustawieniach.' },
    { id: 'wybrane', label: 'Wybrane sekcje', hint: 'Wyłączona sekcja znika z Menu i z paska. Jej dane zostają.' },
];

let seq = 0;
const nextName = (name) => `tz-${name}-${++seq}`;

const fieldLabel = (f) => (f.unit ? `${f.label} (${f.unit})` : f.label);

function card(key, title, ...children) {
    return h('section', { class: 'card tz-stack', dataset: { ustawienie: key } }, h('h2', { class: 'hd tz-set-hd' }, title), children);
}

function currentSettings(ctx) {
    return ctx.vault.list('trainer_settings')[0] || { kind: 'trainer_settings' };
}

// Zmiana jednego rekordu ustawień: odczyt świeżej kopii, zmiana, zapis. Odrzucenie zapisu idzie dalej.
async function updateSettings(ctx, change) {
    const next = currentSettings(ctx);
    change(next);
    return ctx.vault.put(next);
}

function formatDate(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Grupa przycisków radio w stylu żetonów; onPick dostaje wartość, a zwrócone false cofa wybór.
function radioChips(legend, options, selected, onPick) {
    const name = nextName('radio');
    const inputs = [];
    const chips = options.map((o) => {
        const input = h('input', { type: 'radio', name, value: o.id, checked: o.id === selected });
        input.addEventListener('change', async () => {
            if (!input.checked) return;
            const ok = await onPick(o.id);
            if (ok === false) inputs.forEach((i) => { i.checked = i.value === String(selected); });
            else selected = o.id;
        });
        inputs.push(input);
        return h('label', { class: 'chip tz-yn' }, input, h('span', {}, o.label));
    });
    return h('fieldset', { class: 'tz-q' }, h('legend', { class: 'sub' }, legend), h('div', { class: 'tz-row' }, chips));
}

// Formularz zmiany hasła rozwija się dopiero na żądanie, żeby nie zajmował całego ekranu ustawień.
function passwordCard(ctx) {
    const error = h('p', { class: 'tz-error', role: 'alert' });
    const submit = h('button', { type: 'button', class: 'btn', disabled: true }, icon('check'), 'Zapisz nowe hasło');
    const refresh = () => { submit.disabled = !(old.input.value && pw.ok()); };
    const old = passwordField('Obecne hasło', { onInput: refresh });
    const pw = newPasswordFields(refresh, { label: 'Nowe hasło', repeatLabel: 'Powtórz nowe hasło' });

    submit.addEventListener('click', () => busy(submit, ctx, async () => {
        error.textContent = '';
        try {
            await ctx.vault.changePassword(old.input.value, pw.value());
            old.input.value = '';
            pw.clear();
            setOpen(false);
            ctx.toast('Hasło zmienione.');
        } catch (e) {
            old.input.value = '';
            const until = e && e.cause && e.cause.until;
            const wait = until ? ` Spróbuj za ${formatWait(Math.max(0, Math.ceil((Date.parse(until) - Date.now()) / 1000)))}.` : '';
            if (e && e.message === 'ZLE_HASLO') error.textContent = `Złe hasło.${wait}`;
            else if (e && e.message === 'ZA_DUZO_PROB') error.textContent = `Za dużo błędnych prób.${wait}`;
            else if (e && e.message === 'SLABE_HASLO') error.textContent = 'Nowe hasło nie spełnia warunków.';
            else throw e;
        } finally {
            refresh();
        }
    }));

    const formId = nextName('haslo');
    const form = h('div', { class: 'tz-stack', id: formId, hidden: true }, old.node, pw.nodes, error, h('div', { class: 'tz-row' }, submit));
    const toggle = h('button', { type: 'button', class: 'ghost', 'aria-expanded': 'false', 'aria-controls': formId }, icon('lock'), 'Zmień hasło');
    const setOpen = (open) => {
        form.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        if (open) old.input.focus();
    };
    toggle.addEventListener('click', () => setOpen(form.hidden));
    return card('haslo', 'Hasło', h('div', { class: 'tz-row' }, toggle), form);
}

function recoveryCard(ctx) {
    const button = h('button', { type: 'button', class: 'ghost' }, 'Nowy kod awaryjny');
    button.addEventListener('click', () => busy(button, ctx, async () => {
        try {
            const ok = await ctx.confirm({
                title: 'Utworzyć nowy kod awaryjny?',
                text: 'Nowy kod zobaczysz tylko raz. Gdy go zapiszesz i klikniesz „Gotowe”, stary przestanie działać.',
                okLabel: 'Utwórz nowy kod',
            });
            if (!ok) return;
            // Kod tylko się losuje; zapis (i koniec starego kodu) dopiero po „Gotowe” na ekranie kodu.
            showNewRecoveryCode(ctx, ctx.vault.prepareRecoveryCode());
        } finally {
            button.disabled = false;
        }
    }));
    return card('kod', 'Kod awaryjny',
        h('p', { class: 'sub' }, 'Nowy kod zastąpi stary. Przyda się, gdy stary zginął albo ktoś go poznał.'),
        h('div', { class: 'tz-row' }, button));
}

function autolockCard(ctx) {
    const selected = autolockMs(currentSettings(ctx)) / 60000;
    const options = AUTOLOCK_MINUTES.map((m) => ({ id: m, label: `${m} min` }));
    return card('autoblokada', 'Autoblokada',
        radioChips('Blokuj Strefę po bezczynności', options, selected, async (min) => {
            try {
                const saved = await updateSettings(ctx, (s) => { s.autolockMin = min; });
                ctx.lock.setIdleMs(autolockMs(saved));
                return true;
            } catch (e) {
                console.error('[Strefa trenera] autoblokada:', e && e.message);
                ctx.toast(SAVE_FAILED);
                return false;
            }
        }),
        h('p', { class: 'mut' }, 'W tle Strefa blokuje się po 1 minucie, a po przeładowaniu zawsze.'));
}

function themeCard(ctx) {
    const tiles = ctx.theme.list.map((m) => h('button', {
        type: 'button', class: 'tz-theme', dataset: { motyw: m.id }, 'aria-pressed': 'false',
        onclick: () => { ctx.theme.set(m.id); paint(); },
    }, h('span', { class: 'tz-swatch', dataset: { motyw: m.id }, 'aria-hidden': 'true' }), h('span', {}, m.label)));
    const paint = () => {
        const current = ctx.theme.get();
        tiles.forEach((t) => t.setAttribute('aria-pressed', String(t.dataset.motyw === current)));
    };
    paint();
    return card('motyw', 'Motyw Strefy', h('div', { class: 'tz-themes' }, tiles));
}

function sectionsCard(ctx) {
    const body = h('div', { class: 'tz-stack' });
    const persist = (value) => {
        try {
            saveSections(value);
        } catch (e) {
            ctx.toast(SAVE_FAILED);
            return false;
        }
        ctx.applySections();
        return true;
    };

    const paint = () => {
        const value = loadSections();
        const modes = h('fieldset', { class: 'tz-q' },
            h('legend', { class: 'sub' }, 'Co widać poza Strefą'),
            MODE_OPTIONS.map((o) => {
                const input = h('input', { type: 'radio', name: 'tz-sekcje-tryb', value: o.id, checked: value.mode === o.id });
                input.addEventListener('change', () => {
                    if (input.checked) persist({ ...value, mode: o.id });
                    paint();
                });
                return h('label', { class: 'tz-check' }, input,
                    h('span', { class: 'tz-stack tz-tight' }, h('span', {}, o.label), h('span', { class: 'mut' }, o.hint)));
            }));
        const switches = value.mode === 'wybrane'
            ? h('fieldset', { class: 'tz-q' },
                h('legend', { class: 'sub' }, 'Sekcje'),
                SECTIONS.map((s) => {
                    const input = h('input', { type: 'checkbox', role: 'switch', checked: value.enabled[s.id] !== false });
                    input.addEventListener('change', () => {
                        if (!persist({ ...value, enabled: { ...value.enabled, [s.id]: input.checked } })) input.checked = !input.checked;
                        else value.enabled[s.id] = input.checked;
                    });
                    return h('label', { class: 'tz-check' }, input, h('span', {}, s.label));
                }))
            : null;
        // W trybie „Tylko Strefa trenera” Profil i Serwis są dostępne stąd (spec rozdz. 10).
        const shortcuts = value.mode === 'tylko-trener'
            ? h('div', { class: 'tz-row' },
                h('button', { type: 'button', class: 'ghost', onclick: () => window.switchTab('settings-panel') }, icon('user'), 'Profil'),
                h('button', { type: 'button', class: 'ghost', onclick: () => window.switchTab('diagnostics-dashboard') }, icon('wrench'), 'Serwis'))
            : null;
        body.replaceChildren(...[modes, switches, shortcuts].filter(Boolean));
    };
    paint();
    return card('sekcje', 'Zwykła część aplikacji', body,
        h('p', { class: 'mut' }, 'Profil i Serwis są zawsze dostępne. Wyłączenie „Jestem trenerem” przywraca pełną aplikację.'));
}

function fieldsCard(ctx) {
    const body = h('div', { class: 'tz-stack' });

    const paint = () => {
        const settings = currentSettings(ctx);
        const cfg = settings.measurementFields || {};
        const comp = cfg.composition || {};
        const custom = Array.isArray(cfg.customFields) ? cfg.customFields : [];

        // Przełącznik pola: zapis od razu, nieudany zapis cofa zaznaczenie. Dane pomiarów zostają nietknięte.
        const toggle = (f, checked, apply) => {
            const input = h('input', { type: 'checkbox', checked });
            input.addEventListener('change', async () => {
                input.disabled = true;
                try {
                    await updateSettings(ctx, (s) => {
                        s.measurementFields = { ...(s.measurementFields || {}) };
                        apply(s.measurementFields, input.checked);
                    });
                } catch (e) {
                    console.error('[Strefa trenera] pola pomiarów:', e && e.message);
                    ctx.toast(SAVE_FAILED);
                    input.checked = !input.checked;
                } finally {
                    input.disabled = false;
                }
            });
            return h('label', { class: 'tz-check' }, input, h('span', {}, fieldLabel(f)));
        };
        const boxes = COMPOSITION_FIELDS.map((f) => toggle(f, comp[f.id] !== false, (mf, on) => {
            mf.composition = { ...(mf.composition || {}), [f.id]: on };
        }));
        const customBoxes = custom.filter((f) => f && f.id).map((f) => toggle(f, f.enabled !== false, (mf, on) => {
            mf.customFields = (Array.isArray(mf.customFields) ? mf.customFields : [])
                .map((c) => (c && c.id === f.id ? { ...c, enabled: on } : c));
        }));

        const name = h('input', { class: 'in', type: 'text', autocomplete: 'off', maxlength: LABEL_MAX });
        const unit = h('input', { class: 'in', type: 'text', autocomplete: 'off', maxlength: UNIT_MAX, placeholder: 'np. cm' });
        const error = h('p', { class: 'tz-error', role: 'alert' });
        const add = h('button', { type: 'button', class: 'ghost' }, icon('plus'), 'Własne pole');
        add.addEventListener('click', async () => {
            const label = name.value.trim().slice(0, LABEL_MAX);
            if (!label) { error.textContent = 'Wpisz nazwę pola.'; return; }
            error.textContent = '';
            add.disabled = true;
            try {
                await updateSettings(ctx, (s) => {
                    const mf = { ...(s.measurementFields || {}) };
                    const list = Array.isArray(mf.customFields) ? mf.customFields.slice() : [];
                    list.push({ id: nextCustomFieldId(list), label, unit: unit.value.trim().slice(0, UNIT_MAX), enabled: true });
                    mf.customFields = list;
                    s.measurementFields = mf;
                });
                ctx.toast('Pole dodane.');
                paint();
            } catch (e) {
                console.error('[Strefa trenera] własne pole:', e && e.message);
                ctx.toast(SAVE_FAILED);
                add.disabled = false;
            }
        });

        body.replaceChildren(...[
            h('p', { class: 'sub' }, 'Waga i obwody są zawsze. Pola składu ciała i własne pola możesz wyłączyć; zapisane wartości zostają.'),
            h('div', { class: 'tz-stack tz-tight' }, boxes),
            customBoxes.length
                ? h('fieldset', { class: 'tz-q' }, h('legend', { class: 'sub' }, 'Własne pola'), h('div', { class: 'tz-stack tz-tight' }, customBoxes))
                : null,
            h('label', { class: 'tz-field' }, h('span', { class: 'sub' }, 'Nazwa pola'), name),
            h('label', { class: 'tz-field' }, h('span', { class: 'sub' }, 'Jednostka'), unit),
            error,
            h('div', { class: 'tz-row' }, add),
        ].filter(Boolean));
    };
    paint();
    return card('pola', 'Pola składu ciała', body);
}

function backupCard() {
    const last = lastBackupAt();
    const date = last ? formatDate(last) : '';
    return card('kopia', 'Kopia zapasowa',
        h('p', {}, backupLabel(last)),
        date ? h('p', { class: 'mut' }, date) : null,
        h('p', { class: 'sub' }, 'Kopia obejmuje też zaszyfrowane dane Strefy. Zrobisz ją w Serwisie.'),
        h('div', { class: 'tz-row' },
            h('button', { type: 'button', class: 'ghost', onclick: () => window.switchTab('diagnostics-dashboard') }, 'Przejdź do Serwisu')));
}

function wipeCard(ctx) {
    return card('usun', 'Usuń Strefę trenera',
        h('p', { class: 'sub' }, 'Kasuje wszystkie dane klientów zapisane w Strefie na tym urządzeniu.'),
        h('div', { class: 'tz-row' },
            h('button', { type: 'button', class: 'ghost tz-danger', onclick: () => ctx.show('wipe') }, icon('trash'), 'Usuń Strefę trenera')));
}

async function renderSettings(root, params, ctx) {
    if (!ctx.vault.isUnlocked()) {
        ctx.show(await ctx.resolve(), {}, { reset: true });
        return;
    }
    root.append(...[
        h('section', { class: 'card' }, h('h2', { class: 'hd' }, 'Ustawienia')),
        passwordCard(ctx),
        recoveryCard(ctx),
        autolockCard(ctx),
        sectionsCard(ctx),
        fieldsCard(ctx),
        themeCard(ctx),
        backupCard(),
        issueCard(ctx),
        wipeCard(ctx),
        ownerKeyEntry(ctx, () => ctx.show('settings')),
    ].filter(Boolean));
}

export function registerSettingsScreen(register) {
    register('settings', renderSettings);
}
