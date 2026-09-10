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

    test('Powinien edytować i nadpisywać istniejący szablon bez tworzenia klonu', async ({ page }) => {
        // Wstawienie do Local Storage przykładowego szablonu
        await page.addInitScript(() => {
            window.localStorage.setItem('tutorial_global_v22', 'true');
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

        await page.goto('http://127.0.0.1:8080/');
        
        // Wejście do zakładki Trening
        await page.evaluate(() => {
            document.querySelector('a[data-tab="training-dashboard"]').click();
        });
        await page.waitForSelector('#training-calendar-view', { state: 'visible' });

        // Otwarcie okna szablonów
        await page.evaluate(() => {
            window.TrainingUI.loadTemplatesDialog();
        });
        await page.waitForSelector('#templates-modal-overlay', { state: 'visible' });

        // Zlokalizowanie i kliknięcie przycisku '✏️ Edytuj' przy naszym szablonie
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const editBtn = buttons.find(b => b.textContent.includes('✏️ Edytuj'));
            if(editBtn) editBtn.click();
        });

        // Odczekanie na załadowanie widoku Koszyka
        await page.waitForSelector('#template-builder-dashboard', { state: 'visible' });

        // Sprawdzenie, czy załadowano odpowiednią nazwę
        const nameInput = page.locator('#builder-template-name');
        await expect(nameInput).toHaveValue('Stary Szablon do Edycji');

        // Modyfikacja nazwy
        await nameInput.fill('Zaktualizowany Szablon');

        // Akceptacja systemowego powiadomienia (alertu) po pomyślnym zapisie
        page.once('dialog', dialog => dialog.accept());
        
        // Kliknięcie Zapisz
        await page.click('#template-builder-dashboard button:has-text("Zapisz")');

        // Weryfikacja: sprawdzamy bezpośrednio localStorage
        const templatesStr = await page.evaluate(() => window.localStorage.getItem('uki_workout_templates'));
        const templates = JSON.parse(templatesStr);

        // Oczekujemy że stary szablon został zaktualizowany (oraz że NIE powstał zduplikowany klon)
        expect(templates.length).toBe(1);
        expect(templates[0].id).toBe(123456789);
        expect(templates[0].name).toBe('Zaktualizowany Szablon');
    });
});
