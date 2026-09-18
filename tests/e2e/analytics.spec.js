const { test, expect } = require('@playwright/test');

test.describe('Advanced Analytics Module', () => {
  test('should display FFMI, WHR and BF% when all measurements are provided', async ({ page }) => {
    await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02'); });
    await page.goto('/');
    await page.waitForTimeout(1000);

    await page.waitForSelector('.app-wrapper');

    await page.evaluate(async () => {
      const mockData = {
        date: '2026-08-06',
        weight: 80.0,
        height: 180,
        neck: 38.0,
        waist: 85.0,
        hips: 95.0,
        chest: 105.0,
        thigh: 60.0,
        biceps: 38.0,
        photo: null
      };
      await window.DatabaseManager.addMeasurement(mockData);
    });

    await page.evaluate(() => window.switchTab('analytics-dashboard'));
    await page.click('#btn-tab-2'); 
    await page.waitForTimeout(500);

    await expect(page.locator('text=Szacunkowy BF%')).toBeVisible();
    await expect(page.locator('text=FFMI (Index Beztłuszczowy)')).toBeVisible();
    await expect(page.locator('text=WHR (Talia-Biodra)')).toBeVisible();
  });

  test('should display missing data warning when neck is not provided', async ({ page }) => {
    await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02'); });
    await page.goto('/');
    await page.waitForTimeout(1000);

    await page.waitForSelector('.app-wrapper');

    await page.evaluate(async () => {
      const mockData = {
        date: '2026-08-06',
        weight: 80.0,
        height: 180,
        waist: 85.0,
        hips: 95.0,
        chest: 105.0,
        thigh: 60.0,
        biceps: 38.0,
        photo: null
      };
      await window.DatabaseManager.addMeasurement(mockData);
    });

    await page.evaluate(() => window.switchTab('analytics-dashboard'));
    await page.click('#btn-tab-2'); 
    await page.waitForTimeout(500);

    await expect(page.locator('#analytics-dashboard').getByText('Brak danych BF%')).toBeVisible();
    await expect(page.locator('#analytics-dashboard').getByText('Uzupełnij: Szyja.')).toBeVisible();
  });
});
