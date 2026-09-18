const { test, expect } = require('@playwright/test');

test.describe('Kreator Szablonów - Zastosuj do zaznaczonych', () => {
    test('Powinien zmieniać serie tylko dla zaznaczonych ćwiczeń w koszyku', async ({ page }) => {
        await page.addInitScript(() => { 
            window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02'); 
        });
        await page.goto('/');
    await page.waitForTimeout(1000);

        await page.evaluate(() => window.switchTab('template-builder-dashboard'));
        await page.waitForSelector('#template-builder-dashboard', { state: 'visible' });

        for(let i=1; i<=3; i++) {
            await page.evaluate(() => window.TemplateBuilderUI.openCatalogModal());
            await page.waitForTimeout(300);
            await page.fill('#builder-custom-name', `Cwiczenie Testowe ${i}`);
            await page.click('button:has-text("Dodaj")');
        }

        const cartItems = page.locator('.cart-item');
        await expect(cartItems).toHaveCount(3);

        const checkboxes = page.locator('.mass-edit-checkbox');
        await checkboxes.nth(1).uncheck();

        await page.fill('#builder-mass-sets', '4');
        await page.fill('#builder-mass-reps', '10');
        await page.fill('#builder-mass-weight', '20');
        
        await page.click('button:has-text("Ustaw")');

        const ex1Desc = await cartItems.nth(0).innerText();
        expect(ex1Desc).toContain('4 serii');

        const ex2Desc = await cartItems.nth(1).innerText();
        expect(ex2Desc).toContain('Brak ustawionych serii');

        const ex3Desc = await cartItems.nth(2).innerText();
        expect(ex3Desc).toContain('4 serii');
    });

    test('Powinien edytować i nadpisywać istniejący szablon bez tworzenia klonu', async ({ page }) => {
        await page.addInitScript(() => {
            window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02');
            window.localStorage.setItem('uki_workout_templates', JSON.stringify([{
                id: 123456789,
                name: "Stary Szablon do Edycji",
                type: "strength",
                exercises: [{
                    name: "Wyciskanie",
                    type: "strength",
                    sets: [{reps: "10", weight: "50", completed: false}]
                }]
            }]));
        });

        await page.goto('/');
    await page.waitForTimeout(1000);
        
        await page.evaluate(() => {
            window.switchTab('training-dashboard');
        });
        await page.waitForSelector('#training-calendar-view', { state: 'visible' });

        await page.evaluate(() => {
            window.TrainingUI.loadTemplatesDialog();
        });
        await page.waitForSelector('#templates-modal-overlay', { state: 'visible' });

        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const editBtn = buttons.find(b => b.textContent.includes('✏️ Edytuj'));
            if(editBtn) editBtn.click();
        });

        await page.waitForSelector('#template-builder-dashboard', { state: 'visible' });

        const nameInput = page.locator('#builder-template-name');
        await expect(nameInput).toHaveValue('Stary Szablon do Edycji');

        await nameInput.fill('Zaktualizowany Szablon');

        page.once('dialog', dialog => dialog.accept());
        
        await page.click('#template-builder-dashboard button:has-text("Zapisz")');

        const templatesStr = await page.evaluate(() => window.localStorage.getItem('uki_workout_templates'));
        const templates = JSON.parse(templatesStr);

        expect(templates.length).toBe(1);
        expect(templates[0].id).toBe(123456789);
        expect(templates[0].name).toBe('Zaktualizowany Szablon');
    });
});
