// Imienne kody trenera: podpis ECDSA P-256 / SHA-256, weryfikowany offline kluczem publicznym.
// Format: UKT1.<base64url(JSON payload, UTF-8)>.<base64url(podpis)>
// Moduł nie używa niczego specyficznego dla przeglądarki przy imporcie, więc działa też w Node 20+
// (skrypt właściciela w scripts/ importuje ten sam plik, dzięki czemu format jest zdefiniowany raz).

import { toB64, fromB64 } from './trainerCrypto.js';

const PREFIX = 'UKT1';
const ECDSA = { name: 'ECDSA', namedCurve: 'P-256' };
const SIGN = { name: 'ECDSA', hash: 'SHA-256' };

// Klucz publiczny trenera (część prywatna jest tylko u właściciela).
export const TRAINER_PUBLIC_KEY_JWK = {
  kty: 'EC',
  crv: 'P-256',
  x: 'EQqAq5c_-NgIFzFfpKaQe94tYU7SDM7Q3uVABKlaUyI',
  y: 'Y-V-ex36eN9sySh6cP8vTfWq5TnAjbkiJdXl7Jbnm7s',
};

const toB64Url = (bytes) => toB64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

function fromB64Url(s) {
  if (!/^[A-Za-z0-9_-]+$/.test(s)) throw new Error('base64url');
  const std = s.replace(/-/g, '+').replace(/_/g, '/');
  return fromB64(std + '='.repeat((4 - (std.length % 4)) % 4));
}

export function formatPayload({ name, issuedAt, expiresAt }) {
  return { v: 1, n: name, i: issuedAt, e: expiresAt || null };
}

export async function generateKeyPair() {
  const pair = await crypto.subtle.generateKey(ECDSA, true, ['sign', 'verify']);
  return {
    publicJwk: await crypto.subtle.exportKey('jwk', pair.publicKey),
    privateJwk: await crypto.subtle.exportKey('jwk', pair.privateKey),
  };
}

export function importPrivateKeyJwk(jwk) {
  return crypto.subtle.importKey('jwk', jwk, ECDSA, false, ['sign']);
}

export async function signTrainerCode(privateKey, data) {
  const payload = toB64Url(new TextEncoder().encode(JSON.stringify(formatPayload(data))));
  const sig = await crypto.subtle.sign(SIGN, privateKey, new TextEncoder().encode(payload));
  return `${PREFIX}.${payload}.${toB64Url(new Uint8Array(sig))}`;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Prawdziwa data kalendarzowa RRRR-MM-DD (odrzuca 2026-13-01 i 2026-02-30).
export function isRealDate(s) {
  if (typeof s !== 'string' || !DATE_RE.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

const SIG_CHARS = 86;

export function normalizeCode(code) {
  return String(code ?? '').replace(/[\s\u00AD\u200B-\u200F\u2028-\u202E\u2060-\u2069\uFEFF]/g, '');
}

export async function verifyTrainerCode(code, { now = new Date(), publicKeyJwk = TRAINER_PUBLIC_KEY_JWK } = {}) {
  // Kod wklejony z komunikatora bywa połamany na linie albo ma znaki niewidoczne (miękki dywiz, zero-width).
  // Żaden z nich nie należy do kodu, więc usuwamy je wszystkie przed sprawdzeniem.
  const parts = normalizeCode(code).split('.');
  if (parts.length !== 3 || parts[0] !== PREFIX) return { ok: false, reason: 'FORMAT' };
  let payload, sig;
  try {
    payload = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(fromB64Url(parts[1])));
  } catch {
    return { ok: false, reason: 'FORMAT' };
  }
  // Podpis P-256 ma zawsze 64 bajty (86 znaków). Krótszy = kod ucięty przy kopiowaniu.
  if (parts[2].length !== SIG_CHARS) return { ok: false, reason: 'NIEPELNY' };
  try {
    sig = fromB64Url(parts[2]);
  } catch {
    return { ok: false, reason: 'FORMAT' };
  }
  if (!payload || payload.v !== 1 || typeof payload.n !== 'string' || !payload.n || !isRealDate(payload.i)
    || !(payload.e === null || isRealDate(payload.e))) {
    return { ok: false, reason: 'FORMAT' };
  }
  let valid = false;
  try {
    const key = await crypto.subtle.importKey('jwk', publicKeyJwk, ECDSA, false, ['verify']);
    valid = await crypto.subtle.verify(SIGN, key, sig, new TextEncoder().encode(parts[1]));
  } catch {
    valid = false;
  }
  if (!valid) return { ok: false, reason: 'PODPIS' };
  // Kod działa przez cały dzień ważności (do końca tego dnia czasu lokalnego).
  if (payload.e && now > new Date(`${payload.e}T23:59:59.999`)) return { ok: false, reason: 'WYGASL' };
  return { ok: true, name: payload.n, issuedAt: payload.i, expiresAt: payload.e };
}
