const fs = require('fs');
const path = require('path');
const { test, expect } = require('../fixtures');
const {
  VARIANTS,
  OWN_SCOPE,
  NEIGHBOR_SCOPE,
  openVariant,
  registerWorkers,
  seedNeighbors,
  readState,
  expectNeighborsIntact,
} = require('../helpers/neighbors');

test('pomocnik sąsiadów zasiewa i odczytuje stan', async ({ page }) => {
  await openVariant(page, VARIANTS[0]);
  await registerWorkers(page);
  await seedNeighbors(page);
  const state = await readState(page);

  expectNeighborsIntact(state);
  expect(state.scopes).toEqual([OWN_SCOPE, NEIGHBOR_SCOPE].sort());
});

test('OWN_SCOPE to katalog aplikacji na każdej stronie', async ({ page, baseURL }) => {
  const expected = new URL('/', baseURL).href;
  for (const p of ['/', '/index.html?x=1', '/reset.html']) {
    await page.goto(p);
    expect(await page.evaluate(() => window.UkiScope.OWN_SCOPE)).toBe(expected);
  }
  await page.addInitScript(() => localStorage.setItem('uki-ui-version', 'classic'));
  await page.goto('/classic.html');
  expect(await page.evaluate(() => window.UkiScope.OWN_SCOPE)).toBe(expected);
});

test('prefiksy cache w sw.js i ukis-scope.js są identyczne', async () => {
  const read = f => JSON.parse(fs.readFileSync(path.join(__dirname, '../..', f), 'utf8').match(/OWN_CACHE_PREFIXES = (\[[^\]]*\])/)[1].replace(/'/g, '"'));
  expect(read('ukis-scope.js')).toEqual(read('sw.js'));
});

test('isOwnCache rozpoznaje wyłącznie własne nazwy', async ({ page }) => {
  await page.goto('/');
  const r = await page.evaluate(() => ['ukis-bodybuild-v1', 'uki-bodybuild-v2026.8.14.03', 'ukis-bikelog-v1', 'ukis-dive-tools-v1', 'ssi-standards-trainer-v1'].map(n => window.UkiScope.isOwnCache(n)));
  expect(r).toEqual([true, true, false, false, false]);
});
