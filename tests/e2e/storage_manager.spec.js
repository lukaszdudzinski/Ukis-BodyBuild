const { test, expect } = require('../fixtures');
const { VARIANTS, openVariant } = require('../helpers/neighbors');

for (const variant of VARIANTS) {
  test(`Zarządzanie pamięcią nie rzuca błędu (${variant.name})`, async ({ page }) => {
    await openVariant(page, variant);
    await page.evaluate(() => window.DatabaseManager.addDietLog({ date: '2020-01-01', meal_type: 'Inny', food_name: 'Stary posiłek', calories: 100, thumbnail: 'legacy-thumb' }));
    await page.evaluate(() => window.switchTab('diagnostics-dashboard'));
    await page.selectOption('#sm-time-select', '1');
    const dialogs = []; page.on('dialog', d => { dialogs.push(d.message()); d.accept(); });
    await page.locator('#db-clear-media-btn').click();
    await expect.poll(() => dialogs.length).toBe(2);
    expect(dialogs[1]).toContain('Usunięto 1 zdjęć z Diety');
    expect(dialogs[1]).not.toContain('Błąd');
  });

  test(`Edycja pomiaru zapisuje zmianę (${variant.name})`, async ({ page }) => {
    await openVariant(page, variant);
    const id = await page.evaluate(async () => (await window.DatabaseManager.addMeasurement({ date: '2026-10-01', weight: 80 })).id);
    await page.evaluate(() => window.switchTab('measurements-dashboard'));
    await page.evaluate(i => window.populateMeasurementForm(i, true), id);
    await page.fill('#measureWeight', '81');
    const dialogs = []; page.on('dialog', d => { dialogs.push(d.message()); d.accept(); });
    await page.locator('#measurementsForm button[type="submit"]').click();
    await expect.poll(() => dialogs).toContain('Pomiary zaktualizowane pomyślnie!');
    const rows = await page.evaluate(() => window.DatabaseManager.getMeasurements());
    expect(rows.find(r => r.id === id).weight).toBe(81);
  });
}
