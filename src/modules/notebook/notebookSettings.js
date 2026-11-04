// Zeszyt: zapamiętane ustawienia kopiowania do nowej serii (localStorage, każdy dostęp w try/catch).

export const SETTINGS_KEY = 'ukis.bodybuild.zeszyt.ustawienia';
export const DEFAULT_SETTINGS = Object.freeze({ copyReps: true, copyWeight: false });

// `storage` bez wartości domyślnej w parametrze: sam odczyt `localStorage` może rzucić błąd
// (zablokowane dane witryny), więc sięgamy po niego dopiero wewnątrz try.
export function loadSettings(storage) {
  const settings = { ...DEFAULT_SETTINGS };
  try {
    const s = storage ?? globalThis.localStorage;
    const parsed = JSON.parse(s.getItem(SETTINGS_KEY));
    if (parsed && typeof parsed === 'object') {
      if (typeof parsed.copyReps === 'boolean') settings.copyReps = parsed.copyReps;
      if (typeof parsed.copyWeight === 'boolean') settings.copyWeight = parsed.copyWeight;
    }
  } catch {
    // brak pamięci albo zły JSON: zostają domyślne
  }
  return settings;
}

export function saveSettings(settings, storage) {
  try {
    const s = storage ?? globalThis.localStorage;
    s.setItem(SETTINGS_KEY, JSON.stringify({ copyReps: !!settings.copyReps, copyWeight: !!settings.copyWeight }));
  } catch {
    // pamięć niedostępna: ustawienia nie zostaną zapamiętane
  }
}
