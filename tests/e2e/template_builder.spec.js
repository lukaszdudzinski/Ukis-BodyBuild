const { test, expect } = require('@playwright/test');

test.describe('Kreator Szablonów - Zastosuj do zaznaczonych', () => {
    test('Powinien zmieniać serie tylko dla zaznaczonych ćwiczeń w koszyku', async ({ page }) => {
        // Pomijamy samouczki
        await page.addInitScript(() => { 
            window.localStorage.setItem('tutorial_global_v22', 'true'); 
        });
        await page.goto('http://127.0.0.1:8080/');

        // Wejdź do kreatora planów
        await page.click('a[data-tab="training-dashboard"]');
        await page.waitForSelector('#training-calendar-view', { state: 'visible' });
        
        await page.evaluate(() => {
            window.TrainingUI.loadTemplatesDialog();
        });
        
        await page.waitForSelector('#templates-modal-overlay', { state: 'visible' });
        await page.evaluate(() => {
            window.TemplateBuilderUI.initNew();
        });

        await page.waitForSelector('#template-builder-view', { state: 'visible' });

        for(let i=1; i<=3; i++) {
            await page.fill('#builder-custom-name', `Cwiczenie Testowe ${i}`);
            await page.click('button:has-text("➕ Dodaj do listy")');
        }

        const cartItems = page.locator('.cart-item');
        await expect(cartItems).toHaveCount(3);

        const checkboxes = page.locator('.mass-edit-checkbox');
        await checkboxes.nth(1).uncheck();

        await page.fill('#builder-mass-sets', '4');
        await page.fill('#builder-mass-reps', '10');
        await page.fill('#builder-mass-weight', '20');
        
        await page.click('button:has-text("Zastosuj do zaznaczonych")');

        const ex1Desc = await cartItems.nth(0).innerText();
        expect(ex1Desc).toContain('4 serie');

        const ex2Desc = await cartItems.nth(1).innerText();
        expect(ex2Desc).toContain('Brak ustawionych serii');

        const ex3Desc = await cartItems.nth(2).innerText();
        expect(ex3Desc).toContain('4 serie');
    });
});
