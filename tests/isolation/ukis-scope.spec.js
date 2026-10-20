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
