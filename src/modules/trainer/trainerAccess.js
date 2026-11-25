// Dostęp do Strefy trenera: przełącznik, zapisany kod i prośba o kod mailem.
// Bez efektów ubocznych przy imporcie (moduł jest importowany też w testach).
import { verifyTrainerCode, TRAINER_PUBLIC_KEY_JWK } from './trainerCode.js';

export const KEYS = {
    enabled: 'ukis.bodybuild.trener.wlaczony',
    code: 'ukis.bodybuild.trener.kod',
};

export const REQUEST_EMAIL = 'lukasz.dudzinski@gmail.com';
export const REQUEST_SUBJECT = 'BodyBuild — prośba o kod trenera';

let licenseOk = false;

// Haki testowe działają tylko lokalnie i tylko z ?tz-test albo ?tz-probka.
export function isTestMode(loc = globalThis.location) {
    if (!loc) return false;
    const host = loc.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') return false;
    const search = loc.search || '';
    return search.includes('tz-test') || search.includes('tz-probka');
}

export function isTrainerEnabled(storage = globalThis.localStorage) {
    return storage.getItem(KEYS.enabled) === 'true';
}

export function setTrainerEnabled(on, storage = globalThis.localStorage) {
    if (on) storage.setItem(KEYS.enabled, 'true');
    else storage.removeItem(KEYS.enabled);
}

// Klucz publiczny, którym sprawdzamy kody: prawdziwy, a w trybie testowym ten z haka.
export function effectivePublicKeyJwk() {
    return isTestMode() && globalThis.__tzPublicKeyJwk ? globalThis.__tzPublicKeyJwk : TRAINER_PUBLIC_KEY_JWK;
}

function verifyOptions(options) {
    const opts = { ...options };
    if (!opts.publicKeyJwk && isTestMode() && globalThis.__tzPublicKeyJwk) {
        opts.publicKeyJwk = globalThis.__tzPublicKeyJwk;
    }
    return opts;
}

export async function saveTrainerCode(code, storage = globalThis.localStorage, options = {}) {
    const r = await verifyTrainerCode(code, verifyOptions(options));
    if (!r.ok) return r;
    storage.setItem(KEYS.code, String(code).trim());
    return { ok: true, name: r.name };
}

export async function getTrainerLicense(storage = globalThis.localStorage, options = {}) {
    const code = storage.getItem(KEYS.code);
    if (!code) {
        licenseOk = false;
        return { ok: false };
    }
    const r = await verifyTrainerCode(code, verifyOptions(options));
    licenseOk = r.ok;
    return r.ok ? { ok: true, name: r.name, expiresAt: r.expiresAt } : { ok: false };
}

export function hasTrainerLicenseSync() {
    return licenseOk;
}

export function buildCodeRequestMailto({ name, phone, gym, message } = {}) {
    const lines = [];
    const add = (label, value) => {
        const v = (value || '').trim();
        if (v) lines.push(`${label}: ${v}`);
    };
    add('Imię i nazwisko', name);
    add('Telefon', phone);
    add('Siłownia / miasto', gym);
    let body = lines.join('\r\n');
    const msg = (message || '').trim();
    if (msg) body += (body ? '\r\n\r\n' : '') + msg;
    return `mailto:${REQUEST_EMAIL}?subject=${encodeURIComponent(REQUEST_SUBJECT)}&body=${encodeURIComponent(body)}`;
}
