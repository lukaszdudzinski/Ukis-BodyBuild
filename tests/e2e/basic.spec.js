const { test, expect } = require('@playwright/test');

test.describe('Uki BodyBuild E2E', () => {
    
    test('Powinien poprawnie załadować aplikację i wstrzyknąć komponenty', async ({ page }) => {
        // Assume the dev server is running on localhost:8080
        await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.8.13.01'); });
    await page.goto('http://localhost:8080/');

        // Check if welcome screen is visible
        await expect(page.locator('#welcome-screen')).toBeVisible();
        await expect(page.locator('text="Wybierz narzędzie z menu"')).toBeVisible();

        // Navigate to Pomiary Ciała
        await page.click('text="Pomiary Ciała"');
        
        // Check if Measurements component was injected correctly
        await expect(page.locator('h2', { hasText: 'Pomiary Ciała' })).toBeVisible();
        await expect(page.locator('#measurementsForm')).toBeVisible();
    });

    test('Powinien pozwalać na wpisanie wagi', async ({ page }) => {
        await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.8.13.01'); });
    await page.goto('http://localhost:8080/');
        await page.click('text="Pomiary Ciała"');
        
        // Fill the weight
        await page.fill('#measureWeight', '85.5');
        const weightValue = await page.inputValue('#measureWeight');
        expect(weightValue).toBe('85.5');
    });

});
