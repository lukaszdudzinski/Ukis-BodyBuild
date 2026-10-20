const { test, expect } = require('../fixtures');
const {
  VARIANTS,
  OWN_SCOPE,
  NEIGHBOR_SCOPE,
  OWN_OLD_CACHES,
  openVariant,
  registerWorkers,
  seedNeighbors,
  readState,
  expectNeighborsIntact,
} = require('../helpers/neighbors');

// pwa-updater.js jest wyłączony pod navigator.webdriver (init nic nie robi),
// ale window.PWAUpdateUI i jego metody są dostępne, więc wołamy je bezpośrednio.

test('doPwaUpdate bez nowego workera nie rusza sąsiadów', async ({ page }) => {
  await openVariant(page, VARIANTS[0]);
  await registerWorkers(page);
  await seedNeighbors(page);

  const loaded = page.waitForEvent('load');
  await page.evaluate(() => {
    window.PWAUpdateUI.pwaWorker = null;
    window.PWAUpdateUI.doPwaUpdate();
  });
  await loaded;

  const s = await readState(page);
  expect(s.scopes).toEqual([NEIGHBOR_SCOPE]);
  expectNeighborsIntact(s);
  for (const c of OWN_OLD_CACHES) expect(s.caches).not.toContain(c);
});

test('doPwaUpdate z oczekującym workerem kasuje tylko własne cache', async ({ page }) => {
  await openVariant(page, VARIANTS[0]);
  await registerWorkers(page);
  await seedNeighbors(page);

  const loaded = page.waitForEvent('load');
  await page.evaluate(() => {
    window.PWAUpdateUI.pwaWorker = { postMessage() {} };
    window.PWAUpdateUI.doPwaUpdate();
  });
  await loaded;

  const s = await readState(page);
  expect(s.scopes).toEqual([OWN_SCOPE, NEIGHBOR_SCOPE].sort());
  expectNeighborsIntact(s);
  for (const c of OWN_OLD_CACHES) expect(s.caches).not.toContain(c);
});

test('registerAndMonitor nie wyrejestrowuje cudzego workera', async ({ page }) => {
  await openVariant(page, VARIANTS[0]);
  await page.evaluate(() => navigator.serviceWorker.register('/tests/assets/neighbor-worker.js'));
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const regs = await navigator.serviceWorker.getRegistrations();
        return regs.length >= 1 && regs.every(r => !!r.active);
      })
    )
    .toBe(true);
  await seedNeighbors(page);

  await page.evaluate(() => window.PWAUpdateUI.registerAndMonitor());
  await expect
    .poll(async () => (await readState(page)).scopes)
    .toEqual([OWN_SCOPE, NEIGHBOR_SCOPE].sort());
  expectNeighborsIntact(await readState(page));
});

test('cleanupBrokenWorkers usuwa tylko własny worker z ?update=', async ({ page }) => {
  await openVariant(page, VARIANTS[0]);
  await registerWorkers(page, {
    ownScript: 'sw.js?update=1',
    neighborScript: 'tests/assets/neighbor-worker.js?update=1',
  });
  expect(await page.evaluate(() => window.PWAUpdateUI.cleanupBrokenWorkers())).toBe(true);
  expect((await readState(page)).scopes).toEqual([NEIGHBOR_SCOPE]);
});
