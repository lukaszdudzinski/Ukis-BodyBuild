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

test('reset.html nie rusza sąsiadów', async ({ page }) => {
  await openVariant(page, VARIANTS[0]);
  await registerWorkers(page);
  await seedNeighbors(page);

  await page.goto('/reset.html');
  await expect(page.locator('#status')).toContainText('Gotowe');

  // Od razu po „Gotowe”, zanim strona przekieruje (po 3 s) do index.html.
  const s = await readState(page);
  expect(s.scopes).toEqual([NEIGHBOR_SCOPE]);
  expectNeighborsIntact(s);
  for (const c of OWN_OLD_CACHES) expect(s.caches).not.toContain(c);
});
