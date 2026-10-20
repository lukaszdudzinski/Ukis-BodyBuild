const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { test, expect } = require('../fixtures');
const {
  VARIANTS,
  openVariant,
  seedNeighbors,
  readState,
  expectNeighborsIntact,
} = require('../helpers/neighbors');

const ROOT = path.join(__dirname, '..', '..');

// Klucze usuwane przez „Pamięć podręczną” (posortowane), zgodne z RESETTABLE_KEYS w ukis-scope.js.
const RESETTABLE = [
  'dietActivity',
  'dietGoal',
  'dietWorkerUrl',
  'errorTelemetryUrl',
  'tutorial_context_diet',
  'tutorial_context_training',
  'tutorial_global',
  'tutorial_global_v21',
  'tutorial_global_v22',
  'trainingExperience',
  'uki-bodybuild-avatar',
  'uki-bodybuild-gender',
  'uki-bodybuild-glass',
  'uki-bodybuild-last-version',
  'uki-bodybuild-media-migrated-v2',
  'uki-bodybuild-pwa-banner-dismissed',
  'uki-bodybuild-reminder',
  'uki-bodybuild-theme',
  'uki-bodybuild-wallpaper',
  'uki-experimental-numpad',
  'uki-ui-version',
  'uki-ui-welcome-seen',
  'uki_backup_frequency',
  'uki_bodybuild_settings',
  'uki_exercises_migrated',
].sort();

function glob(dir) {
  const out = [];
  for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...glob(rel));
    else if (entry.name.endsWith('.js')) out.push(rel);
  }
  return out;
}

function loadUkiScopeInVm() {
  const code = fs.readFileSync(path.join(ROOT, 'ukis-scope.js'), 'utf8');
  const ctx = {
    window: {},
    document: { currentScript: { src: 'http://x/ukis-scope.js' } },
    location: { href: 'http://x/' },
    URL,
  };
  vm.runInNewContext(code, ctx);
  return ctx.window.UkiScope;
}

test('każdy klucz localStorage z kodu jest sklasyfikowany', async () => {
  const files = [
    ...glob('src'),
    ...glob('classic-app/src'),
    'ui-switch.js',
    'index.html',
    'classic.html',
  ];
  const re =
    /localStorage\.(?:getItem|setItem|removeItem)\(\s*['"`]([^'"`]+)['"`]|const (?:STORAGE_KEY|WELCOME_KEY) = '([^']+)'/g;
  const used = new Set();
  for (const f of files) {
    const text = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of text.matchAll(re)) used.add(m[1] || m[2]);
  }

  const scope = loadUkiScopeInVm();
  expect([...scope.RESETTABLE_KEYS].sort()).toEqual(RESETTABLE);
  expect(scope.RESETTABLE_KEYS.filter((k) => scope.PRESERVED_KEYS.includes(k))).toEqual([]);
  expect(
    [...used].filter((k) => !scope.RESETTABLE_KEYS.includes(k) && !scope.PRESERVED_KEYS.includes(k))
  ).toEqual([]);
  for (const k of [
    'uki_install_date',
    'uki_ai_premium_token',
    'uki_ai_paywall_last_shown',
    'uki_kvvfs_migrated',
    'userNick',
    'uki-avatar',
    'uki-custom-wallpaper',
    'theme',
    'uki_error_logs',
  ]) {
    expect(scope.PRESERVED_KEYS).toContain(k);
  }
});

test('clearOwnLocalStorage usuwa tylko listę BodyBuild', async ({ page }) => {
  await openVariant(page, VARIANTS[0]);
  await seedNeighbors(page);
  await page.evaluate((keys) => keys.forEach((k) => localStorage.setItem(k, 'x')), RESETTABLE);
  await page.evaluate(() => localStorage.setItem('uki_workout_templates', '[{"id":1}]'));
  const removed = await page.evaluate(() => window.UkiScope.clearOwnLocalStorage());
  expect([...removed].sort()).toEqual(RESETTABLE);
  const s = await readState(page);
  for (const k of RESETTABLE) expect(s.storage[k]).toBeUndefined();
  expect(s.storage.uki_workout_templates).toBe('[{"id":1}]');
  expectNeighborsIntact(s);
});

for (const variant of VARIANTS) {
  test(`Pamięć podręczna nie rusza sąsiadów ani uprawnień (${variant.name})`, async ({ page }) => {
    await openVariant(page, variant);
    await seedNeighbors(page);
    await page.evaluate(() => {
      localStorage.setItem('dietGoal', 'cut');
      localStorage.setItem('uki-experimental-numpad', 'true');
      localStorage.setItem('uki_workout_templates', '[{"id":7}]');
    });
    const dialogs = [];
    page.on('dialog', (d) => {
      dialogs.push(d.message());
      d.accept();
    });
    await page.evaluate(() => window.switchTab('diagnostics-dashboard'));
    const loaded = page.waitForEvent('load');
    await page.locator('#db-clear-local-btn').click();
    await loaded;
    expect(dialogs[0]).toContain('status PRO oraz dane innych aplikacji UKIS');
    const s = await readState(page);
    expectNeighborsIntact(s);
    expect(s.storage.dietGoal).toBeUndefined();
    expect(s.storage['uki-experimental-numpad']).toBeUndefined();
    expect(s.storage.uki_workout_templates).toBe('[{"id":7}]');
    expect(s.storage.uki_install_date).toBe('2026-01-01T00:00:00.000Z');
    expect(await page.evaluate(() => window.PremiumUI.getTrialStatus().hasAccess)).toBe(false);
  });
}
