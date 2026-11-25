// Sejf Strefy trenera: zaszyfrowane rekordy w tabelach trainer_meta i trainer_records (spec rozdz. 7–8).
// Klucz danych (AES-GCM 256) leży w bazie tylko jako dwie opakowane kopie: hasłem i kodem awaryjnym.
// Po odblokowaniu klucz i odszyfrowane rekordy są wyłącznie w pamięci tej instancji.
// `exec(sql, bind) -> Promise<rows[]>` to jedno polecenie SQL (wiersze jako obiekty).

import {
  PBKDF2_ITERATIONS,
  checkPasswordRules,
  generateRecoveryCode,
  normalizeRecoveryCode,
  randomBytes,
  toB64,
  fromB64,
  deriveWrappingKey,
  generateDataKey,
  wrapDataKey,
  unwrapDataKey,
  encryptJson,
  decryptJson,
} from './trainerCrypto.js';

export const TRAINER_TABLES_SQL = [
  `CREATE TABLE IF NOT EXISTS trainer_meta (key TEXT PRIMARY KEY, value TEXT)`,
  `CREATE TABLE IF NOT EXISTS trainer_records (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL,
    client_id TEXT,
    iv TEXT NOT NULL,
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_trainer_records_client ON trainer_records (client_id)`,
];

const FORMAT_VERSION = '1';
const RECORD_VERSION = 1;
const SALT_BYTES = 16;
// Górna granica liczby iteracji PBKDF2 z bazy albo z kopii: obca kopia nie zawiesi telefonu na odblokowaniu.
const MAX_ITERATIONS = 2000000;
// Licznik błędnych prób i czas blokady należą do tego telefonu: nie jadą w kopii i nie wracają z niej.
const LOCAL_META_KEYS = ['failed_count', 'locked_until'];
const REQUIRED_META_KEYS = ['pw_salt', 'pw_iter', 'pw_wrapped', 'rc_salt', 'rc_iter', 'rc_wrapped'];

function validIterations(value) {
  const s = value == null ? '' : String(value);
  if (!/^\d{1,7}$/.test(s)) return null;
  const n = Number(s);
  return n >= 1 && n <= MAX_ITERATIONS ? n : null;
}

// Opóźnienie po n-tej nieudanej próbie z rzędu (sekundy).
function lockSeconds(count) {
  if (count >= 7) return 300;
  if (count === 6) return 60;
  if (count === 5) return 30;
  return 0;
}

export async function vaultExists(exec) {
  const rows = await exec(`SELECT 1 AS x FROM trainer_meta WHERE key = 'pw_wrapped'`);
  return rows.length > 0;
}

async function readMeta(exec) {
  const rows = await exec('SELECT key, value FROM trainer_meta');
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

// Jedno polecenie INSERT z wieloma wierszami, więc zapis jest atomowy.
async function writeMeta(exec, entries) {
  const keys = Object.keys(entries);
  const sql = `INSERT OR REPLACE INTO trainer_meta (key, value) VALUES ${keys.map(() => '(?, ?)').join(', ')}`;
  await exec(sql, keys.flatMap((k) => [k, entries[k] == null ? null : String(entries[k])]));
}

// prefix: 'pw' (hasło) albo 'rc' (kod awaryjny, już znormalizowany).
async function wrapWith(prefix, secret, dataKey, iterations) {
  const salt = randomBytes(SALT_BYTES);
  const wrappingKey = await deriveWrappingKey(secret, salt, iterations);
  return {
    [`${prefix}_salt`]: toB64(salt),
    [`${prefix}_iter`]: iterations,
    [`${prefix}_wrapped`]: await wrapDataKey(dataKey, wrappingKey),
  };
}

async function unwrapWith(prefix, meta, secret) {
  const iterations = validIterations(meta[`${prefix}_iter`]);
  const salt = meta[`${prefix}_salt`];
  const wrapped = meta[`${prefix}_wrapped`];
  if (iterations === null || !salt || !wrapped) throw new Error('USZKODZONY_SEJF');
  const wrappingKey = await deriveWrappingKey(secret, fromB64(salt), iterations);
  return unwrapDataKey(wrapped, wrappingKey);
}

export function createVault({ exec, iterations = PBKDF2_ITERATIONS, now = () => new Date() }) {
  let session = null; // { key, records: Map<id, rekord> } tylko po odblokowaniu

  // Operacje z hasłem idą po kolei: równoległe próby nie ominą licznika błędów.
  let chain = Promise.resolve();
  const serial = (fn) => {
    const p = chain.then(fn, fn);
    chain = p.catch(() => {});
    return p;
  };

  const requireSession = () => {
    if (!session) throw new Error('ZABLOKOWANY');
    return session;
  };

  async function loadRecords(key) {
    const rows = await exec('SELECT id, iv, data FROM trainer_records');
    const records = new Map();
    for (const row of rows) {
      try {
        const rec = await decryptJson(key, row);
        if (rec && rec.id === row.id) records.set(row.id, rec);
        else console.warn('Sejf: rekord niezgodny z identyfikatorem, pominięty', row.id);
      } catch (e) {
        console.warn('Sejf: nie udało się odszyfrować rekordu, pominięty', row.id);
      }
    }
    return records;
  }

  function assertNotLockedOut(meta) {
    const until = meta.locked_until;
    if (until && Date.parse(until) > now().getTime()) throw new Error('ZA_DUZO_PROB', { cause: { until } });
  }

  async function registerFailure() {
    const rows = await exec(
      `INSERT INTO trainer_meta (key, value) VALUES ('failed_count', '1')
       ON CONFLICT(key) DO UPDATE SET value = CAST(COALESCE(value, '0') AS INTEGER) + 1
       RETURNING value`,
    );
    const count = Number(rows[0]?.value) || 1;
    const secs = lockSeconds(count);
    const until = secs ? new Date(now().getTime() + secs * 1000).toISOString() : null;
    await writeMeta(exec, { locked_until: until });
    return until;
  }

  // Sprawdza hasło na kopii klucza opakowanej hasłem. Zła próba podbija licznik w bazie.
  async function unwrapByPassword(meta, password) {
    if (!meta.pw_wrapped) throw new Error('BRAK_SEJFU');
    assertNotLockedOut(meta);
    try {
      return await unwrapWith('pw', meta, password);
    } catch (e) {
      if (e && e.message === 'ZLE_HASLO') {
        const until = await registerFailure();
        throw new Error('ZLE_HASLO', until ? { cause: { until } } : undefined);
      }
      throw e;
    }
  }

  const RESET_FAILURES = { failed_count: 0, locked_until: null };

  return {
    isSetUp: () => vaultExists(exec),

    setup: (password) =>
      serial(async () => {
        if (!checkPasswordRules(password).ok) throw new Error('SLABE_HASLO');
        if (await vaultExists(exec)) throw new Error('SEJF_ISTNIEJE');
        const key = await generateDataKey();
        const recoveryCode = generateRecoveryCode();
        const entries = {
          version: FORMAT_VERSION,
          ...(await wrapWith('pw', password, key, iterations)),
          ...(await wrapWith('rc', normalizeRecoveryCode(recoveryCode), key, iterations)),
          ...RESET_FAILURES,
        };
        // Rekordy bez sejfu (np. po przerwanym wymazaniu) są nie do odczytania żadnym kluczem.
        await exec('DELETE FROM trainer_records');
        await writeMeta(exec, entries);
        session = { key, records: new Map() };
        return { recoveryCode };
      }),

    unlock: (password) =>
      serial(async () => {
        const meta = await readMeta(exec);
        const key = await unwrapByPassword(meta, password);
        const records = await loadRecords(key);
        if (Number(meta.failed_count) || meta.locked_until) await writeMeta(exec, RESET_FAILURES);
        session = { key, records };
      }),

    // Kod awaryjny (120 bitów) nie podlega opóźnieniu: ma działać także w czasie blokady za złe hasła.
    unlockWithRecovery: (code, newPassword) =>
      serial(async () => {
        if (!checkPasswordRules(newPassword).ok) throw new Error('SLABE_HASLO');
        const normalized = normalizeRecoveryCode(code);
        if (!normalized) throw new Error('ZLY_KOD');
        const meta = await readMeta(exec);
        if (!meta.pw_wrapped) throw new Error('BRAK_SEJFU');
        let key;
        try {
          key = await unwrapWith('rc', meta, normalized);
        } catch (e) {
          if (e && e.message === 'ZLE_HASLO') throw new Error('ZLY_KOD');
          throw e;
        }
        const records = await loadRecords(key);
        await writeMeta(exec, { ...(await wrapWith('pw', newPassword, key, iterations)), ...RESET_FAILURES });
        session = { key, records };
      }),

    // Przepakowuje tylko klucz danych; rekordy zostają bez zmian.
    changePassword: (oldPassword, newPassword) =>
      serial(async () => {
        if (!checkPasswordRules(newPassword).ok) throw new Error('SLABE_HASLO');
        const meta = await readMeta(exec);
        const key = await unwrapByPassword(meta, oldPassword);
        await writeMeta(exec, { ...(await wrapWith('pw', newPassword, key, iterations)), ...RESET_FAILURES });
      }),

    // Nowy kod awaryjny w dwóch krokach: prepare tylko losuje (nic nie zapisuje, stary kod działa dalej),
    // commit zapisuje kopię klucza opakowaną nowym kodem (od tej chwili stary kod nie działa).
    prepareRecoveryCode: () => {
      requireSession();
      return generateRecoveryCode();
    },

    commitRecoveryCode: (code) => {
      const { key } = requireSession();
      return serial(async () => {
        const normalized = normalizeRecoveryCode(code);
        if (!normalized) throw new Error('ZLY_KOD');
        await writeMeta(exec, await wrapWith('rc', normalized, key, iterations));
      });
    },

    // Oba kroki naraz (bez okna na zapisanie kodu przez trenera).
    regenerateRecoveryCode() {
      const recoveryCode = this.prepareRecoveryCode();
      return this.commitRecoveryCode(recoveryCode).then(() => recoveryCode);
    },

    isUnlocked: () => session !== null,

    lock: () => {
      if (session) session.records.clear();
      session = null;
    },

    list: (kind, clientId) => {
      const { records } = requireSession();
      const out = [];
      for (const rec of records.values()) {
        if (rec.kind !== kind) continue;
        if (clientId !== undefined && rec.clientId !== clientId) continue;
        out.push(structuredClone(rec));
      }
      return out;
    },

    get: (id) => {
      const rec = requireSession().records.get(id);
      return rec ? structuredClone(rec) : null;
    },

    put: async (record) => {
      const s = requireSession();
      if (!record || typeof record.kind !== 'string' || !record.kind) throw new Error('BRAK_RODZAJU');
      const rec = structuredClone(record);
      rec.id = rec.id ? String(rec.id) : crypto.randomUUID();
      rec.version = rec.version ?? RECORD_VERSION;
      rec.updatedAt = now().toISOString();
      const { iv, data } = await encryptJson(s.key, rec);
      await exec(
        'INSERT OR REPLACE INTO trainer_records (id, kind, client_id, iv, data, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [rec.id, rec.kind, rec.clientId ?? null, iv, data, rec.updatedAt],
      );
      // Pamięć dopiero po udanym zapisie i tylko, gdy sejfu w międzyczasie nie zablokowano.
      if (session === s) s.records.set(rec.id, rec);
      return structuredClone(rec);
    },

    remove: async (id) => {
      const s = requireSession();
      await exec('DELETE FROM trainer_records WHERE id = ?', [id]);
      if (session === s) s.records.delete(id);
    },

    // Fizycznie kasuje klienta i wszystkie jego rekordy.
    removeClient: async (clientId) => {
      const s = requireSession();
      await exec('DELETE FROM trainer_records WHERE client_id = ? OR id = ?', [clientId, clientId]);
      if (session !== s) return;
      for (const [id, rec] of s.records) {
        if (id === clientId || rec.clientId === clientId) s.records.delete(id);
      }
    },

    // „Usuń Strefę trenera i zacznij od nowa”: działa bez hasła.
    wipe: async () => {
      await exec('DELETE FROM trainer_records');
      await exec('DELETE FROM trainer_meta');
      if (session) session.records.clear();
      session = null;
    },

    failedAttempts: async () => {
      const meta = await readMeta(exec);
      const until = meta.locked_until && Date.parse(meta.locked_until) > now().getTime() ? meta.locked_until : null;
      return { count: Number(meta.failed_count) || 0, until };
    },
  };
}

// Kopia zapasowa: wiersze obu tabel bez odszyfrowywania (bez licznika błędnych prób); null, gdy sejfu nie ma.
export async function exportVaultRaw(exec) {
  if (!(await vaultExists(exec))) return null;
  const meta = (await exec('SELECT key, value FROM trainer_meta ORDER BY key')).filter((m) => !LOCAL_META_KEYS.includes(m.key));
  const records = await exec('SELECT id, kind, client_id, iv, data, updated_at FROM trainer_records ORDER BY id');
  return { meta, records };
}

const isStr = (v) => typeof v === 'string';
const isStrOrNull = (v) => v == null || typeof v === 'string';

// Zapytania zastępujące sejf danymi z kopii. Sprawdza całość, zanim cokolwiek skasuje,
// żeby DatabaseManager mógł je wykonać w jednej transakcji z resztą importu.
// Licznik błędnych prób z kopii jest pomijany; liczba iteracji spoza 1..2 000 000 odrzuca kopię.
export function vaultImportQueries(raw) {
  const shapeOk =
    raw &&
    Array.isArray(raw.meta) &&
    Array.isArray(raw.records) &&
    raw.meta.every((m) => m && isStr(m.key) && isStrOrNull(m.value)) &&
    raw.records.every((r) => r && isStr(r.id) && isStr(r.kind) && isStrOrNull(r.client_id) && isStr(r.iv) && isStr(r.data) && isStr(r.updated_at));
  if (!shapeOk) throw new Error('USZKODZONA_KOPIA_SEJFU');
  const meta = raw.meta.filter((m) => !LOCAL_META_KEYS.includes(m.key));
  const byKey = new Map(meta.map((m) => [m.key, m.value]));
  const valid =
    byKey.size === meta.length &&
    REQUIRED_META_KEYS.every((k) => isStr(byKey.get(k)) && byKey.get(k) !== '') &&
    validIterations(byKey.get('pw_iter')) !== null &&
    validIterations(byKey.get('rc_iter')) !== null;
  if (!valid) throw new Error('USZKODZONA_KOPIA_SEJFU');
  return [
    { sql: 'DELETE FROM trainer_records' },
    { sql: 'DELETE FROM trainer_meta' },
    ...meta.map((m) => ({ sql: 'INSERT INTO trainer_meta (key, value) VALUES (?, ?)', bind: [m.key, m.value ?? null] })),
    ...raw.records.map((r) => ({
      sql: 'INSERT INTO trainer_records (id, kind, client_id, iv, data, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      bind: [r.id, r.kind, r.client_id ?? null, r.iv, r.data, r.updated_at],
    })),
  ];
}

// Wersja dla pojedynczych poleceń `exec` (bez wspólnej transakcji).
export async function importVaultRaw(exec, raw) {
  for (const q of vaultImportQueries(raw)) await exec(q.sql, q.bind);
}
