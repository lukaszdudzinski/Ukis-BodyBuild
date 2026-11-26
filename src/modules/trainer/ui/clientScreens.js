// Ekrany klientów Strefy trenera: lista (clients), formularz (client-edit), karta (client), dane (client-data).
// Dane klienta trafiają do DOM wyłącznie przez h() jako węzły tekstowe, nigdy przez innerHTML.
import { h, icon } from './dom.js';
import { scoreAssessment } from '../trainerAssessment.js';
import { formatNumber } from '../trainerMeasurements.js';
import { healthSummary } from '../trainerQuestionnaire.js';
import { lastBackupAt, backupLabel, needsBackupReminder } from '../trainerBackup.js';
import { GOALS, clientAge, initials, searchClients, sortClients, clientDataText, goalLabel, extraGoals, plural } from '../trainerModel.js';
import { activePlan, daysPerWeek, mondayOf, addDays, toIso } from '../trainerPlan.js';
import { finishedSessions } from '../trainerSession.js';
import { planTileSub } from './planScreens.js';
import { sessionCard } from './sessionScreen.js';
import { progressTileSub } from './progressScreen.js';

const SAVE_FAILED = 'Nie udało się zapisać. Spróbuj jeszcze raz.';

function fullName(c) {
    return `${c.firstName || ''} ${c.lastName || ''}`.trim();
}

// Plakietka „wywiad” znika dopiero po zakończonym wywiadzie; sam szkic jej nie zdejmuje.
function hasInterview(ctx, clientId) {
    return ctx.vault.list('interview', clientId).some((r) => r.status !== 'szkic');
}

// Do ramki zdrowotnej: ostatni zakończony wywiad, a gdy go brak, szkic.
function latestInterview(ctx, clientId) {
    const all = ctx.vault.list('interview', clientId).slice()
        .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
    return all.find((r) => r.status !== 'szkic') || all[0] || null;
}

// Cele dodatkowe klienta: z ostatniego zakończonego wywiadu (szkic nie jest danymi klienta), bez celu głównego.
function clientExtraGoals(ctx, client) {
    const done = ctx.vault.list('interview', client.id).filter((r) => r.status !== 'szkic')
        .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))[0];
    return done ? extraGoals(client.goal, done.goalExtra) : [];
}

// Podtytuł wiersza listy: „Hipertrofia +1” (cel główny i liczba celów dodatkowych).
function goalSummary(ctx, client) {
    if (!client.goal) return null;
    const extra = clientExtraGoals(ctx, client).length;
    return extra ? `${goalLabel(client.goal)} +${extra}` : goalLabel(client.goal);
}

// Baner „Zrób kopię” (spec 8.3): kopii nie ma albo ma ponad 7 dni, a jest co najmniej jeden klient.
function backupBanner(clientCount) {
    const last = lastBackupAt();
    if (!needsBackupReminder({ lastIso: last, clientCount })) return null;
    return h('section', { class: 'card tz-stack', dataset: { baner: 'kopia' } },
        h('p', { class: 'hi tz-warn' }, icon('alert'), h('span', {}, backupLabel(last))),
        h('p', { class: 'sub' }, 'Zrób kopię zapasową w Serwisie, żeby nie stracić danych klientów razem z telefonem.'),
        h('div', { class: 'tz-row' },
            h('button', { type: 'button', class: 'btn', onclick: () => window.switchTab && window.switchTab('diagnostics-dashboard') }, 'Zrób kopię')));
}

function renderList(root, params, ctx) {
    const clients = ctx.vault.list('client');
    const state = { tab: params.tab === 'archive' ? 'archive' : 'active', query: '' };
    const activeIds = new Set(clients.filter((c) => !c.archived).map((c) => c.id));
    const activeCount = activeIds.size;
    // Sesje zakończone w bieżącym tygodniu (od poniedziałku) aktywnych klientów.
    const monday = mondayOf(toIso(new Date()));
    const sunday = addDays(monday, 6);
    const weekSessions = finishedSessions(ctx.vault.list('session'))
        .filter((s) => activeIds.has(s.clientId) && s.date >= monday && s.date <= sunday).length;

    const listBox = h('div', { class: 'tz-stack' });
    const search = h('input', { class: 'in', type: 'search', 'aria-label': 'Szukaj klienta', placeholder: 'Szukaj klienta', autocomplete: 'off' });
    const tabActive = h('button', { type: 'button', class: 'tab', role: 'tab' }, 'Aktywni');
    const tabArchive = h('button', { type: 'button', class: 'tab', role: 'tab' }, 'Archiwum');

    const paint = () => {
        const archived = state.tab === 'archive';
        tabActive.classList.toggle('tabon', !archived);
        tabArchive.classList.toggle('tabon', archived);
        tabActive.setAttribute('aria-selected', String(!archived));
        tabArchive.setAttribute('aria-selected', String(archived));
        const shown = sortClients(searchClients(clients.filter((c) => !!c.archived === archived), state.query));
        if (!shown.length) {
            listBox.replaceChildren(h('section', { class: 'card' },
                h('p', { class: 'sub tz-empty' }, state.query ? 'Nikogo nie znaleziono.' : archived ? 'Archiwum jest puste.' : 'Nie masz jeszcze klientów. Dodaj pierwszego.')));
            return;
        }
        listBox.replaceChildren(h('section', { class: 'card tz-list' }, shown.map((c) => {
            const age = clientAge(c);
            return h('button', { type: 'button', class: 'tz-client', onclick: () => ctx.show('client', { id: c.id }) },
                h('span', { class: 'tz-avatar', 'aria-hidden': 'true' }, initials(c)),
                h('span', { class: 'tz-client-main' },
                    h('span', { class: 'tz-client-name' }, fullName(c)),
                    h('span', { class: 'mut' }, [age !== null ? `${age} lat` : null, goalSummary(ctx, c)].filter(Boolean).join(' · '))),
                hasInterview(ctx, c.id) ? null : h('span', { class: 'hi tz-badge' }, 'wywiad'));
        })));
    };

    search.addEventListener('input', () => { state.query = search.value; paint(); });
    tabActive.addEventListener('click', () => { state.tab = 'active'; paint(); });
    tabArchive.addEventListener('click', () => { state.tab = 'archive'; paint(); });

    root.append(h('div', { class: 'tz-stack' },
        backupBanner(clients.length),
        h('section', { class: 'card tz-stack' },
            h('div', { class: 'tz-between' },
                h('div', {},
                    h('h2', { class: 'hd' }, 'Klienci'),
                    h('p', { class: 'sub' }, `${activeCount} aktywni · ${plural(weekSessions, 'sesja', 'sesje', 'sesji')} w tym tygodniu`)),
                h('button', { type: 'button', class: 'btn', onclick: () => ctx.show('client-edit', {}) }, icon('plus'), 'Klient')),
            search,
            h('div', { class: 'tabs', role: 'tablist' }, tabActive, tabArchive)),
        listBox));
    paint();
}

function field(label, control) {
    return h('label', { class: 'tz-field' }, h('span', { class: 'sub' }, label), control);
}

// Szkic otwartego formularza: jeden naraz, w zaszyfrowanym sejfie (nigdy w localStorage).
function findDraft(ctx, clientId) {
    return ctx.vault.list('client_draft').find((d) => (d.clientId || null) === clientId) || null;
}

async function clearDrafts(ctx) {
    for (const d of ctx.vault.list('client_draft')) await ctx.vault.remove(d.id);
}

function renderEdit(root, params, ctx) {
    const existing = params.id ? ctx.vault.get(params.id) : null;
    if (params.id && !existing) { ctx.show('clients', {}, { reset: true }); return; }
    const c = existing || { kind: 'client', firstName: '', lastName: '', birthDate: null, age: null, sex: null, heightCm: null, phone: '', email: '', note: '', goal: null, archived: false };

    const draft = findDraft(ctx, existing ? existing.id : null);
    if (draft) Object.assign(c, draft.values);

    const first = h('input', { class: 'in', type: 'text', value: c.firstName, autocomplete: 'off', required: true });
    const last = h('input', { class: 'in', type: 'text', value: c.lastName, autocomplete: 'off', required: true });
    const birth = h('input', { class: 'in', type: 'date', value: c.birthDate || '' });
    const age = h('input', { class: 'in', type: 'number', inputmode: 'numeric', min: 0, max: 120, value: c.age ?? '' });
    const sex = h('select', { class: 'in', value: c.sex || '' },
        h('option', { value: '' }, 'Nie podaję'), h('option', { value: 'K' }, 'Kobieta'), h('option', { value: 'M' }, 'Mężczyzna'));
    const height = h('input', { class: 'in', type: 'number', inputmode: 'numeric', min: 50, max: 250, value: c.heightCm ?? '' });
    const phone = h('input', { class: 'in', type: 'tel', value: c.phone || '', autocomplete: 'off' });
    const email = h('input', { class: 'in', type: 'email', value: c.email || '', autocomplete: 'off' });
    const note = h('textarea', { class: 'in', rows: 3, value: c.note || '' });
    let goal = c.goal || null;
    const chips = GOALS.map((g) => h('button', {
        type: 'button', class: 'chip', 'aria-pressed': 'false',
        onclick: () => { goal = goal === g.id ? null : g.id; paintGoal(); },
    }, g.label));
    const paintGoal = () => chips.forEach((chip, i) => {
        const on = GOALS[i].id === goal;
        chip.classList.toggle('chipon', on);
        chip.setAttribute('aria-pressed', String(on));
    });
    paintGoal();

    const values = () => ({
        firstName: first.value, lastName: last.value, birthDate: birth.value || null,
        age: age.value === '' ? null : Number(age.value), sex: sex.value || null,
        heightCm: height.value === '' ? null : Number(height.value),
        phone: phone.value, email: email.value, note: note.value, goal,
    });
    const isBlank = (v) => !v.firstName && !v.lastName && !v.birthDate && v.age === null && !v.sex
        && v.heightCm === null && !v.phone && !v.email && !v.note && !v.goal;
    // Router zapisuje szkic przed zmianą ekranu (Wstecz, pasek, wyjście ze Strefy) i przed blokadą,
    // tylko gdy formularz zmienił się od otwarcia. Wyczyszczony formularz nowego klienta usuwa szkic.
    const baseline = JSON.stringify(values());
    const saveDraft = async () => {
        const v = values();
        if (JSON.stringify(v) === baseline) return;
        if (isBlank(v) && !existing) { await clearDrafts(ctx); return; }
        const old = ctx.vault.list('client_draft');
        await ctx.vault.put({ kind: 'client_draft', id: old[0] && old[0].id, clientId: existing ? existing.id : null, values: v });
        for (const d of old.slice(1)) await ctx.vault.remove(d.id);
    };
    let leave = ctx.onLeave(root, saveDraft);

    const error = h('p', { class: 'tz-error', role: 'alert', hidden: true });
    const save = h('button', { type: 'button', class: 'btn' }, icon('check'), 'Zapisz');
    save.addEventListener('click', async () => {
        error.hidden = true;
        if (!first.value.trim() || !last.value.trim()) {
            error.textContent = 'Podaj imię i nazwisko.';
            error.hidden = false;
            return;
        }
        const num = (el) => (el.value === '' ? null : Number(el.value));
        const rec = {
            ...c,
            kind: 'client',
            firstName: first.value.trim(),
            lastName: last.value.trim(),
            birthDate: birth.value || null,
            age: birth.value ? null : num(age),
            sex: sex.value || null,
            heightCm: num(height),
            phone: phone.value.trim(),
            email: email.value.trim(),
            note: note.value.trim(),
            goal,
            archived: !!c.archived,
            createdAt: c.createdAt || new Date().toISOString(),
        };
        // Hak szkicu znika przed zapisem: wyjście albo blokada w trakcie zapisu nie tworzy szkicu.
        // Nieudany zapis przywraca hak (a gdy ekranu już nie ma, od razu zapisuje szkic).
        save.disabled = true;
        leave();
        let saved;
        try {
            saved = await ctx.vault.put(rec);
        } catch (e) {
            console.error('[Strefa trenera] zapis klienta:', e && e.message);
            if (root.isConnected) leave = ctx.onLeave(root, saveDraft);
            else await saveDraft().catch(() => {});
            ctx.toast(SAVE_FAILED);
            save.disabled = false;
            return;
        }
        try { await clearDrafts(ctx); } catch (e) { console.error('[Strefa trenera] szkic:', e && e.message); }
        // Trener w międzyczasie wyszedł z ekranu albo Strefa się zablokowała: zostaje tam, gdzie jest.
        if (!root.isConnected) return;
        // Nowy klient: historia clients → client, żeby „Wstecz” wracało na listę.
        if (!existing) ctx.show('clients', {}, { reset: true });
        ctx.show('client', { id: saved.id });
    });

    root.append(h('section', { class: 'card tz-stack' },
        h('h2', { class: 'hd' }, existing ? 'Edytuj dane' : 'Nowy klient'),
        field('Imię', first), field('Nazwisko', last),
        field('Data urodzenia', birth), field('Wiek (gdy bez daty urodzenia)', age),
        field('Płeć', sex), field('Wzrost (cm)', height),
        field('Telefon', phone), field('E-mail', email),
        h('div', { class: 'tz-field' }, h('span', { class: 'sub' }, 'Cel'), h('div', { class: 'tz-goals' }, chips)),
        field('Notatka', note),
        error,
        h('div', { class: 'tz-row' }, save,
            h('button', { type: 'button', class: 'ghost', onclick: async () => {
                leave();
                try { await clearDrafts(ctx); } catch (e) { console.error('[Strefa trenera] szkic:', e && e.message); }
                ctx.show('clients', {}, { reset: true });
            } }, 'Anuluj'))));
    first.focus();
}

function tile(label, ic, route, id, ctx, sub) {
    return h('button', { type: 'button', class: 'tz-tile', onclick: () => ctx.show(route, { clientId: id }) }, icon(ic), h('span', {}, label),
        sub ? h('span', { class: 'tz-tile-sub' }, sub) : null);
}

function assessmentTileSub(ctx, clientId) {
    const last = ctx.vault.list('assessment', clientId).slice()
        .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))[0];
    return last ? `wynik ${scoreAssessment(last.results).total}/21 · ${last.date}` : 'brak oceny';
}

function measurementsTileSub(ctx, clientId) {
    const last = ctx.vault.list('measurement', clientId).slice()
        .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))[0];
    const v = last && last.values;
    const parts = [];
    if (v && typeof v.weight === 'number') parts.push(`${formatNumber(v.weight)} kg`);
    if (v && typeof v.fat_pct === 'number') parts.push(`${formatNumber(v.fat_pct)}%`);
    return parts.length ? parts.join(' · ') : 'brak pomiarów';
}

function renderCard(root, params, ctx) {
    const c = params.id ? ctx.vault.get(params.id) : null;
    if (!c) { ctx.show('clients', {}, { reset: true }); return; }
    const age = clientAge(c);
    const menu = h('div', { class: 'card tz-menu tz-stack', hidden: true });
    const menuBtn = h('button', { type: 'button', class: 'ghost', 'aria-expanded': 'false', onclick: () => {
        menu.hidden = !menu.hidden;
        menuBtn.setAttribute('aria-expanded', String(!menu.hidden));
    } }, icon('pencil'), 'Edytuj');

    const item = (ic, label, fn, danger) => h('button', { type: 'button', class: `ghost${danger ? ' tz-danger' : ''}`, onclick: fn }, icon(ic), label);
    menu.append(
        item('pencil', 'Edytuj dane', () => ctx.show('client-edit', { id: c.id })),
        item('archive', c.archived ? 'Przywróć' : 'Archiwizuj', async () => {
            try {
                await ctx.vault.put({ ...c, archived: !c.archived });
                ctx.toast(c.archived ? 'Klient przywrócony.' : 'Klient w archiwum.');
                ctx.show('clients', { tab: c.archived ? 'active' : 'archive' }, { reset: true });
            } catch (e) {
                console.error('[Strefa trenera] archiwizacja:', e && e.message);
                ctx.toast(SAVE_FAILED);
            }
        }),
        item('eye', 'Pokaż dane klienta', () => ctx.show('client-data', { id: c.id })),
        item('trash', 'Usuń klienta i wszystkie jego dane', async () => {
            const ok = await ctx.confirm({
                title: `Usunąć klienta ${fullName(c)}?`,
                text: 'Zniknie karta klienta i wszystkie jego dane. Tego nie da się cofnąć.',
                okLabel: 'Usuń', danger: true,
            });
            if (!ok) return;
            try {
                await ctx.vault.removeClient(c.id);
                ctx.toast('Klient usunięty.');
                ctx.show('clients', {}, { reset: true });
            } catch (e) {
                console.error('[Strefa trenera] usuwanie klienta:', e && e.message);
                ctx.toast('Nie udało się usunąć. Spróbuj jeszcze raz.');
            }
        }, true));

    const current = activePlan(ctx.vault.list('plan', c.id), new Date());
    const perWeek = current ? daysPerWeek(current) : 0;
    const health = healthSummary(latestInterview(ctx, c.id));
    const contact = [
        c.phone ? h('a', { class: 'ghost', href: `tel:${c.phone.replace(/[^\d+]/g, '')}` }, icon('phone'), 'Zadzwoń') : null,
        c.email ? h('a', { class: 'ghost', href: `mailto:${encodeURIComponent(c.email).replace(/%40/g, '@')}` }, icon('mail'), 'E-mail') : null,
    ].filter(Boolean);

    root.append(h('div', { class: 'tz-stack' },
        h('section', { class: 'card tz-stack' },
            h('div', { class: 'tz-between' },
                h('div', { class: 'tz-client-head' },
                    h('span', { class: 'tz-avatar tz-avatar-lg', 'aria-hidden': 'true' }, initials(c)),
                    h('div', {},
                        h('h2', { class: 'hd tz-client-title' }, fullName(c)),
                        h('p', { class: 'sub' }, [age !== null ? `${age} lat` : null, c.archived ? 'w archiwum' : null].filter(Boolean).join(' · ')),
                        h('div', { class: 'tz-row' },
                            c.goal ? h('span', { class: 'chip chipon tz-goalchip' }, `Cel: ${goalLabel(c.goal)}`) : null,
                            clientExtraGoals(ctx, c).map((id) => h('span', { class: 'chip tz-goalchip' }, `+ ${goalLabel(id)}`)),
                            current ? h('span', { class: 'chip' }, `${perWeek}× w tygodniu`) : null))),
                menuBtn),
            contact.length ? h('div', { class: 'tz-row' }, contact) : null,
            c.note ? h('p', { class: 'sub tz-note' }, c.note) : null,
            menu),
        sessionCard(ctx, c),
        health.flagged ? h('section', { class: 'card tz-health', role: 'note' },
            h('h3', { class: 'hi tz-health-title' }, icon('alert'), 'Uwaga zdrowotna'),
            h('p', { class: 'tz-note' }, health.text)) : null,
        h('div', { class: 'tz-tiles' },
            tile('Wywiad', 'clipboard-list', 'interview', c.id, ctx),
            tile('Ocena funkcjonalna', 'activity', 'assessment', c.id, ctx, assessmentTileSub(ctx, c.id)),
            tile('Pomiary', 'ruler', 'measurements', c.id, ctx, measurementsTileSub(ctx, c.id)),
            tile('Plan', 'dumbbell', 'plans', c.id, ctx, planTileSub(ctx.vault.list('plan', c.id))),
            tile('Postępy', 'trending-up', 'progress', c.id, ctx, progressTileSub(ctx.vault.list('session', c.id))))));
}

function renderData(root, params, ctx) {
    const c = params.id ? ctx.vault.get(params.id) : null;
    if (!c) { ctx.show('clients', {}, { reset: true }); return; }
    // Szkice (client_draft, assessment_draft, wywiad ze statusem „szkic”) nie trafiają do tekstu.
    // Nagrania i zdjęcia to same opisy (bez treści): tekst podaje, ile ich jest przy kroku i pomiarze.
    const records = ['interview', 'interview_audio', 'assessment', 'measurement', 'measurement_photo', 'plan', 'session'].flatMap((k) => ctx.vault.list(k, c.id));
    const text = clientDataText(c, records, new Date(), { settings: ctx.vault.list('trainer_settings')[0] || null });
    const actions = [];
    if (navigator.share) {
        actions.push(h('button', { type: 'button', class: 'btn', onclick: async () => {
            try { await navigator.share({ title: fullName(c), text }); } catch (e) { /* anulowane */ }
        } }, icon('share'), 'Udostępnij'));
    }
    if (navigator.clipboard) {
        actions.push(h('button', { type: 'button', class: 'ghost', onclick: async () => {
            try { await navigator.clipboard.writeText(text); ctx.toast('Skopiowano.'); } catch (e) { ctx.toast('Nie udało się skopiować.'); }
        } }, icon('copy'), 'Kopiuj'));
    }
    root.append(h('section', { class: 'card tz-stack' },
        h('h2', { class: 'hd' }, 'Dane klienta'),
        h('pre', { class: 'tz-pre' }, text),
        h('p', { class: 'hi', role: 'note' }, 'Ten tekst zawiera dane o zdrowiu i nie jest zaszyfrowany. Wyślij go tylko klientowi.'),
        actions.length ? h('div', { class: 'tz-row' }, actions) : null));
}

export function registerClientScreens(register) {
    register('clients', renderList);
    register('client-edit', renderEdit);
    register('client', renderCard);
    register('client-data', renderData);
}
