// Kryptografia sejfu Strefy trenera: wyłącznie Web Crypto (crypto.subtle / crypto.getRandomValues).
// Klucz danych (AES-GCM 256) jest opakowywany kluczem z hasła lub kodu awaryjnego (PBKDF2-SHA-256).

export const PBKDF2_ITERATIONS = 600000;

const RECOVERY_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const RECOVERY_LENGTH = 24;
const IV_BYTES = 12;

export function checkPasswordRules(pw) {
  const s = String(pw ?? '');
  const chars = [...s];
  const isUpper = (ch) => ch !== ch.toLowerCase();
  const isLower = (ch) => ch !== ch.toUpperCase();
  const isDigit = (ch) => /[0-9]/.test(ch);
  const r = {
    length: chars.length >= 8,
    upper: chars.some(isUpper),
    lower: chars.some(isLower),
    digit: chars.some(isDigit),
    special: chars.some((ch) => !isUpper(ch) && !isLower(ch) && !isDigit(ch)),
  };
  r.ok = r.length && r.upper && r.lower && r.digit && r.special;
  return r;
}

export function randomBytes(n) {
  return crypto.getRandomValues(new Uint8Array(n));
}

export function generateRecoveryCode() {
  // 256 % 32 === 0, więc maska 5 bitów nie wprowadza przesunięcia rozkładu.
  const bytes = randomBytes(RECOVERY_LENGTH);
  let out = '';
  for (let i = 0; i < RECOVERY_LENGTH; i++) {
    if (i > 0 && i % 4 === 0) out += '-';
    out += RECOVERY_ALPHABET[bytes[i] & 31];
  }
  return out;
}

export function normalizeRecoveryCode(input) {
  const s = String(input ?? '').toUpperCase().replace(/[\s-]/g, '');
  if (s.length !== RECOVERY_LENGTH) return null;
  for (const ch of s) if (!RECOVERY_ALPHABET.includes(ch)) return null;
  return s;
}

export function toB64(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}

export function fromB64(s) {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function deriveWrappingKey(secret, salt, iterations = PBKDF2_ITERATIONS) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(String(secret).normalize('NFC')), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export function generateDataKey() {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
}

// Opakowanie: base64( iv(12) || AES-GCM(raw klucza danych) ).
export async function wrapDataKey(dataKey, wrappingKey) {
  const raw = new Uint8Array(await crypto.subtle.exportKey('raw', dataKey));
  const iv = randomBytes(IV_BYTES);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, wrappingKey, raw));
  const out = new Uint8Array(IV_BYTES + ct.length);
  out.set(iv, 0);
  out.set(ct, IV_BYTES);
  return toB64(out);
}

export async function unwrapDataKey(wrappedB64, wrappingKey) {
  const all = fromB64(wrappedB64); // InvalidCharacterError dla uszkodzonego base64 przechodzi dalej
  if (all.length < IV_BYTES + 16 + 32) throw new Error('USZKODZONY_KLUCZ');
  let raw;
  try {
    raw = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: all.slice(0, IV_BYTES) }, wrappingKey, all.slice(IV_BYTES));
  } catch (e) {
    // Tylko niezgodność tagu uwierzytelniającego oznacza zły klucz (hasło).
    if (e && e.name === 'OperationError') throw new Error('ZLE_HASLO');
    throw e;
  }
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
}

export async function encryptJson(dataKey, obj) {
  const iv = randomBytes(IV_BYTES);
  const plain = new TextEncoder().encode(JSON.stringify(obj));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, dataKey, plain));
  return { iv: toB64(iv), data: toB64(ct) };
}

export async function decryptJson(dataKey, { iv, data }) {
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(iv) }, dataKey, fromB64(data));
  return JSON.parse(new TextDecoder().decode(plain));
}
