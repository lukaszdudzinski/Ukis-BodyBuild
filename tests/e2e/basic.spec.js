const { test, expect } = require('../fixtures');

test.describe('Uki BodyBuild E2E', () => {
    
    test('Powinien poprawnie załadować aplikację i wstrzyknąć komponenty', async ({ page }) => {
        // Assume the dev server is running on localhost:8080
        await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); });
    page.on('console', msg => console.log('PAGE LOG:', msg.text())); page.on('pageerror', err => console.log('PAGE ERROR:', err.message)); await page.goto('/');
    await page.waitForTimeout(1000);

        // Check if welcome screen is visible
        await expect(page.locator('#welcome-screen')).toBeVisible();
        

        // Navigate to Pomiary Ciała
        await page.evaluate(() => window.switchTab('measurements-dashboard'));
        
        // Check if Measurements component was injected correctly
        await expect(page.locator('h2', { hasText: 'Pomiary Ciała' })).toBeVisible();
        await expect(page.locator('#measurementsForm')).toBeVisible();
    });

    test('Powinien pozwalać na wpisanie wagi', async ({ page }) => {
        await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); });
    page.on('console', msg => console.log('PAGE LOG:', msg.text())); page.on('pageerror', err => console.log('PAGE ERROR:', err.message)); await page.goto('/');
    await page.waitForTimeout(1000);
        await page.evaluate(() => window.switchTab('measurements-dashboard'));
        
        // Fill the weight
        await page.fill('#measureWeight', '85.5');
        const weightValue = await page.inputValue('#measureWeight');
        expect(weightValue).toBe('85.5');
    });

});
