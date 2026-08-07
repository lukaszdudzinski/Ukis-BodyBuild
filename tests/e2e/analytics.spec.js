const { test, expect } = require('@playwright/test');

test.describe('Advanced Analytics Module', () => {
  test('should display FFMI, WHR and BF% when all measurements are provided', async ({ page }) => {
    // We mock localStorage and IndexedDB in a real scenario, but since playwright loads the actual page,
    // we can inject measurements directly into the IndexedDB/OPFS via page.evaluate
    await page.addInitScript(() => window.localStorage.setItem('tutorial_global_v21', 'true'));
    await page.goto('http://127.0.0.1:8080'); // Assuming local server is running on 8080 during tests

    // Wait for App UI to load
    await page.waitForSelector('.app-container');

    // Inject mock data into DatabaseManager
    await page.evaluate(async () => {
      // Mock some measurement data
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

    // Navigate to Analytics Tab
    await page.click('button[onclick="window.AppUI.switchTab(\'analytics-dashboard\')"]');
    
    // Wait for the analytics to render
    await page.waitForSelector('#analytics-content h4', { state: 'visible' });

    // Verify Advanced Analytics section exists
    const advancedTitle = await page.locator('text=Zaawansowana Analityka').isVisible();
    expect(advancedTitle).toBeTruthy();

    // Verify BF% is calculated (US Navy formula)
    const bfTitle = await page.locator('text=Szacunkowy BF%').isVisible();
    expect(bfTitle).toBeTruthy();

    // Verify FFMI is calculated
    const ffmiTitle = await page.locator('text=FFMI (Index Beztłuszczowy)').isVisible();
    expect(ffmiTitle).toBeTruthy();

    // Verify WHR is calculated
    const whrTitle = await page.locator('text=WHR (Talia-Biodra)').isVisible();
    expect(whrTitle).toBeTruthy();

    // Clean up
    await page.evaluate(async () => {
      window.DatabaseManager.db.exec("DELETE FROM measurements");
    });
  });

  test('should display missing data warning when neck is not provided', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('tutorial_global_v21', 'true'));
    await page.goto('http://127.0.0.1:8080');

    await page.evaluate(async () => {
      const mockData = {
        date: '2026-08-06',
        weight: 80.0,
        height: 180,
        // neck is missing
        waist: 85.0,
        hips: 95.0,
        chest: 105.0,
        thigh: 60.0,
        biceps: 38.0,
        photo: null
      };
      await window.DatabaseManager.addMeasurement(mockData);
    });

    // Navigate to Analytics Tab
    await page.click('button[onclick="window.AppUI.switchTab(\'analytics-dashboard\')"]');
    
    // Check for missing data warning
    const missingWarning = await page.locator('text=Brak danych do wyliczenia BF%').isVisible();
    expect(missingWarning).toBeTruthy();

    const missingNeckText = await page.locator('text=Uzupełnij: Szyja').isVisible();
    expect(missingNeckText).toBeTruthy();

    // Clean up
    await page.evaluate(async () => {
      window.DatabaseManager.db.exec("DELETE FROM measurements");
    });
  });
});
