const fs = require('fs');
const path = require('path');
const { expect } = require('../fixtures');

// Wspólne pomocniki testów izolacji: sąsiednie aplikacje UKIS w tej samej domenie
// (klucze localStorage, cache, rejestracje service workerów).

const CURRENT_VERSION = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', '..', 'CHANGELOG.json'), 'utf8')
)[0].version;

const NEIGHBOR_KEYS = {
  ssi_stats_history: '[{"q":1}]',
  'uki-pro-unlocked': 'true',
  uki_bikes_list: '[{"id":1}]',
  'kvvfs-local-x': 'page-data',
  userNick: 'Sąsiad',
  'uki-avatar': 'data:image/png;base64,AAAA',
  'uki-custom-wallpaper': 'wall',
  theme: 'dark',
};

// Klucz `uki_error_logs` sprawdzany przez „zawiera wpis `sasiad`”, bo aplikacja może dopisać własne błędy.
const ERROR_LOG_SEED = '[{"msg":"sasiad"}]';

// Aplikacja (PremiumUI) po przeładowaniu przy wygasłym okresie próbnym wpisuje dzisiejszą datę do
// `uki_ai_paywall_last_shown`, więc zasiew używa dzisiejszej daty (UTC, jak w aplikacji). Inaczej
// przeładowanie zmieniłoby ten klucz niezależnie od testowanego kodu.
const TODAY = new Date().toISOString().split('T')[0];

const ENTITLEMENT_KEYS = {
  uki_install_date: '2026-01-01T00:00:00.000Z',
  uki_ai_premium_token: 'test-token-invalid',
  uki_ai_paywall_last_shown: TODAY,
  uki_kvvfs_migrated: 'true',
};

const NEIGHBOR_CACHES = ['ssi-standards-trainer-v1', 'ukis-bikelog-v1', 'ukis-dive-tools-v1'];
const OWN_OLD_CACHES = ['uki-bodybuild-v2026.8.14.03', 'ukis-bodybuild-v1'];

const NEIGHBOR_SCOPE = 'http://localhost:8080/tests/assets/';
const OWN_SCOPE = 'http://localhost:8080/';

const VARIANTS = [
  { name: 'Liquid Glass', path: '/', classic: false },
  { name: 'Klasyczny', path: '/classic.html', classic: true },
];

async function openVariant(page, variant) {
  await page.addInitScript(
    ({ version, classic }) => {
      localStorage.setItem('tutorial_global_v22', 'true');
      localStorage.setItem('uki-bodybuild-last-version', version);
      if (classic) localStorage.setItem('uki-ui-version', 'classic');
    },
    { version: CURRENT_VERSION, classic: variant.classic }
  );
  await page.goto(variant.path);
  await expect(page).toHaveURL(variant.classic ? /\/classic\.html$/ : /:8080\/$/);
  await page.waitForFunction(() => typeof window.switchTab === 'function' && !!window.DatabaseManager);
}

// Przez evaluate (nie addInitScript), bo przeładowanie strony odtworzyłoby zasiew.
async function seedNeighbors(page) {
  await page.evaluate(
    async ({ neighborKeys, errorLogSeed, entitlementKeys, caches: cacheNames }) => {
      for (const [k, v] of Object.entries(neighborKeys)) localStorage.setItem(k, v);
      localStorage.setItem('uki_error_logs', errorLogSeed);
      for (const [k, v] of Object.entries(entitlementKeys)) localStorage.setItem(k, v);
      for (const name of cacheNames) {
        const cache = await caches.open(name);
        await cache.put(new Request('/probe'), new Response('x'));
      }
    },
    {
      neighborKeys: NEIGHBOR_KEYS,
      errorLogSeed: ERROR_LOG_SEED,
      entitlementKeys: ENTITLEMENT_KEYS,
      caches: [...NEIGHBOR_CACHES, ...OWN_OLD_CACHES],
    }
  );
}

async function registerWorkers(
  page,
  { ownScript = 'sw.js', neighborScript = 'tests/assets/neighbor-worker.js' } = {}
) {
  await page.evaluate(
    async ({ ownScript, neighborScript }) => {
      await navigator.serviceWorker.register(ownScript);
      await navigator.serviceWorker.register(neighborScript);
    },
    { ownScript, neighborScript }
  );
  await expect
    .poll(
      () =>
        page.evaluate(async () => {
          const regs = await navigator.serviceWorker.getRegistrations();
          return regs.length >= 2 && regs.every(r => !!r.active);
        }),
      { message: 'obie rejestracje SW mają active' }
    )
    .toBe(true);
}

async function readState(page) {
  return page.evaluate(async () => ({
    storage: Object.fromEntries(Object.entries(localStorage)),
    caches: (await caches.keys()).sort(),
    scopes: (await navigator.serviceWorker.getRegistrations()).map(r => r.scope).sort(),
  }));
}

function expectNeighborsIntact(state) {
  for (const [k, v] of Object.entries({ ...NEIGHBOR_KEYS, ...ENTITLEMENT_KEYS })) {
    expect(state.storage[k], `klucz ${k}`).toBe(v);
  }
  expect(JSON.parse(state.storage.uki_error_logs).some(e => e.msg === 'sasiad')).toBe(true);
  expect(state.caches).toEqual(expect.arrayContaining(NEIGHBOR_CACHES));
}

module.exports = {
  NEIGHBOR_KEYS,
  ERROR_LOG_SEED,
  ENTITLEMENT_KEYS,
  NEIGHBOR_CACHES,
  OWN_OLD_CACHES,
  NEIGHBOR_SCOPE,
  OWN_SCOPE,
  VARIANTS,
  openVariant,
  seedNeighbors,
  registerWorkers,
  readState,
  expectNeighborsIntact,
};
