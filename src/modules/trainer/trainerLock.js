// Autoblokada Strefy trenera: bezczynność, tło karty, tryb sesji z klientem.
// Moduł nie zna sejfu ani DOM-u poza wstrzykniętym `target`; blokadę wykonuje `onLock`.

export function createAutoLock({
  onLock,
  idleMs = 300000,
  backgroundMs = 60000,
  sessionBackgroundMs = 900000,
  target = document,
  now = () => Date.now(),
  setTimer = setTimeout,
  clearTimer = clearTimeout,
} = {}) {
  let idle = idleMs;
  let sessionActive = false;
  let started = false;
  let timer = null;
  let hiddenAt = null;
  let locking = null;
  let locked = false;
  const hooks = [];

  function disarm() {
    if (timer !== null) clearTimer(timer);
    timer = null;
  }

  function arm() {
    disarm();
    if (!started || sessionActive || locked || locking) return;
    timer = setTimer(() => { timer = null; lockNow(); }, idle);
  }

  function lockNow() {
    if (locking) return locking;
    disarm();
    hiddenAt = null;
    locking = (async () => {
      try {
        for (const fn of hooks.slice()) {
          try { await fn(); } catch (e) { console.error('autoblokada: błąd przed blokadą', e); }
        }
        await onLock();
      } finally {
        locked = true;
        locking = null;
      }
    })();
    return locking;
  }

  function touch() {
    arm();
  }

  function onVisibility() {
    if (locked || locking) return;
    if (target.visibilityState === 'hidden') {
      if (hiddenAt === null) hiddenAt = now();
      return;
    }
    if (hiddenAt === null) return;
    const away = now() - hiddenAt;
    hiddenAt = null;
    if (away > (sessionActive ? sessionBackgroundMs : backgroundMs)) lockNow();
    else arm();
  }

  // Woła je UI po udanym odblokowaniu: czyści stan „zablokowane” i uzbraja licznik.
  function start() {
    locked = false;
    hiddenAt = null;
    if (!started) {
      started = true;
      target.addEventListener('pointerdown', touch);
      target.addEventListener('keydown', touch);
      target.addEventListener('visibilitychange', onVisibility);
    }
    arm();
  }

  function stop() {
    if (!started) return;
    started = false;
    disarm();
    hiddenAt = null;
    target.removeEventListener('pointerdown', touch);
    target.removeEventListener('keydown', touch);
    target.removeEventListener('visibilitychange', onVisibility);
  }

  function setIdleMs(ms) {
    idle = ms;
    arm();
  }

  function setSessionActive(on) {
    sessionActive = !!on;
    arm();
  }

  function beforeLock(fn) {
    hooks.push(fn);
    return () => {
      const i = hooks.indexOf(fn);
      if (i >= 0) hooks.splice(i, 1);
    };
  }

  return { start, stop, touch, setIdleMs, setSessionActive, beforeLock, lockNow };
}

// Autoblokada za brak dotyku do wyboru w ustawieniach Strefy (rekord trainer_settings.autolockMin).
export const AUTOLOCK_MINUTES = [1, 5, 15];
const DEFAULT_AUTOLOCK_MIN = 5;

export function autolockMs(settings) {
  const min = settings && settings.autolockMin;
  return (AUTOLOCK_MINUTES.includes(min) ? min : DEFAULT_AUTOLOCK_MIN) * 60000;
}
