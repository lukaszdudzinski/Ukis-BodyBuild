const { test, expect } = require('../fixtures');
const {
  VARIANTS,
  NEIGHBOR_SCOPE,
  OWN_OLD_CACHES,
  openVariant,
  registerWorkers,
  seedNeighbors,
  readState,
  expectNeighborsIntact,
} = require('../helpers/neighbors');

for (const variant of VARIANTS) {
  test(`Twardy reset nie rusza sąsiadów (${variant.name})`, async ({ page }) => {
    await openVariant(page, variant);
    await registerWorkers(page);
    await seedNeighbors(page);

    const dialogs = [];
    page.on('dialog', (d) => {
      dialogs.push(d.message());
      d.accept();
    });

    await page.evaluate(() => window.switchTab('diagnostics-dashboard'));
    const loaded = page.waitForEvent('load');
    await page.locator('#pwa-hard-reset-btn').click();
    await loaded;

    expect(dialogs[0]).toContain('Twardy Reset');
    const s = await readState(page);
    expect(s.scopes).toEqual([NEIGHBOR_SCOPE]);
    expectNeighborsIntact(s);
    for (const c of OWN_OLD_CACHES) expect(s.caches).not.toContain(c);
  });
}
