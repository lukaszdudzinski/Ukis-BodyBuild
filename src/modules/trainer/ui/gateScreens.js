// Ekrany Strefy trenera dla osoby bez ważnego kodu: gate (opis), request (prośba mailem), code (wpisanie kodu).
import { h, icon } from './dom.js';
import { buildCodeRequestMailto, isTestMode } from '../trainerAccess.js';

const CODE_ERRORS = {
    FORMAT: 'To nie jest kod trenera.',
    PODPIS: 'Kod jest nieprawidłowy.',
    NIEPELNY: 'Kod jest niepełny. Skopiuj go w całości — kończy się kilkoma literami po ostatniej kropce.',
    WYGASL: 'Kod stracił ważność.',
};

function field(label, control) {
    return h('label', { class: 'tz-field' }, h('span', { class: 'sub' }, label), control);
}

function renderGate(root, params, ctx) {
    root.append(h('section', { class: 'card tz-stack' },
        h('h2', { class: 'hd' }, 'Strefa trenera'),
        h('p', { class: 'sub' }, 'Strefa trenera to osobne, szyfrowane miejsce na dane Twoich klientów: wywiady, plany i postępy. Dane zostają na tym urządzeniu.'),
        h('p', { class: 'sub' }, 'Dostęp wymaga imiennego kodu trenera. Poproś o kod albo wpisz ten, który już masz.'),
        h('div', { class: 'tz-row' },
            h('button', { type: 'button', class: 'btn', onclick: () => ctx.show('request') }, icon('mail'), 'Poproś o kod'),
            h('button', { type: 'button', class: 'ghost', onclick: () => ctx.show('code') }, 'Mam kod'))));
}

function renderRequest(root, params, ctx) {
    const name = h('input', { class: 'in', type: 'text', autocomplete: 'name' });
    const phone = h('input', { class: 'in', type: 'tel', autocomplete: 'tel' });
    const gym = h('input', { class: 'in', type: 'text' });
    const message = h('textarea', { class: 'in', rows: 3 });
    const error = h('p', { class: 'tz-error', role: 'alert' });

    const send = () => {
        if (!name.value.trim()) {
            error.textContent = 'Podaj imię i nazwisko.';
            name.focus();
            return;
        }
        error.textContent = '';
        const url = buildCodeRequestMailto({ name: name.value, phone: phone.value, gym: gym.value, message: message.value });
        // Tryb testowy zbiera adres zamiast otwierać pocztę (przeglądarka testowa nie ma klienta poczty).
        if (isTestMode() && Array.isArray(window.__tzMailtoSink)) window.__tzMailtoSink.push(url);
        else location.href = url;
    };

    root.append(h('section', { class: 'card tz-stack' },
        h('h2', { class: 'hd' }, 'Prośba o kod'),
        h('p', { class: 'sub' }, 'Wyślemy wiadomość przez Twoją aplikację pocztową. Formularz niczego nie zapisuje.'),
        field('Imię i nazwisko', name),
        field('Telefon', phone),
        field('Siłownia / miasto', gym),
        field('Wiadomość', message),
        error,
        h('div', { class: 'tz-row' },
            h('button', { type: 'button', class: 'btn', onclick: send }, icon('mail'), 'Wyślij prośbę'),
            h('button', { type: 'button', class: 'ghost', onclick: () => ctx.show('code') }, 'Mam już kod'))));
}

function renderCode(root, params, ctx) {
    const input = h('textarea', { class: 'in', rows: 4, autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', placeholder: 'UKT1.…' });
    const error = h('p', { class: 'tz-error', role: 'alert' });
    let busy = false;

    const paste = async () => {
        try {
            input.value = (await navigator.clipboard.readText()).trim();
            error.textContent = '';
        } catch (e) {
            ctx.toast('Nie udało się wkleić. Wklej kod ręcznie w pole.');
        }
    };

    const unlock = async () => {
        if (busy) return;
        busy = true;
        try {
            const r = await ctx.access.saveTrainerCode(input.value);
            if (!r.ok) {
                error.textContent = CODE_ERRORS[r.reason] || CODE_ERRORS.FORMAT;
                return;
            }
            error.textContent = '';
            await ctx.refreshAccess();
            ctx.show(await ctx.resolve(), {}, { reset: true });
        } finally {
            busy = false;
        }
    };

    root.append(h('section', { class: 'card tz-stack' },
        h('h2', { class: 'hd' }, 'Kod trenera'),
        h('p', { class: 'sub' }, 'Wklej kod, który dostałeś od autora aplikacji.'),
        field('Kod trenera', input),
        error,
        h('div', { class: 'tz-row' },
            h('button', { type: 'button', class: 'ghost', onclick: paste }, icon('copy'), 'Wklej'),
            h('button', { type: 'button', class: 'btn', onclick: unlock }, icon('lock'), 'Odblokuj'))));
}

export function registerGateScreens(register) {
    register('gate', renderGate);
    register('request', renderRequest);
    register('code', renderCode);
}
