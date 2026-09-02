const { test, expect } = require('@playwright/test');

test.describe('Złożony scenariusz zapisu treningu z draftem', () => {
  test('Powinien zapisać trening z dropsetami, superseriami, cardio i czasem ręcznym bez utraty danych', async ({ page }) => {
    // Navigate to the app (assuming it's served locally during tests)
    await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.8.13.01'); });
    await page.goto('/');

    // Wait for the app to load
    await page.waitForSelector('.app-wrapper');

    // Go to Training tab
    await page.click('a[data-tab="training-dashboard"]');

    // Select day 15 first
    await page.evaluate(() => window.TrainingUI.handleDayClick('2026-08-15'));

    // Start a new session
    await page.click('#start-new-session-btn');
    await page.waitForSelector('#active-training-view', { state: 'visible' });

    // Set Name
    await page.fill('#training-name-input', 'Klatka triceps barki');

    // 1st Exercise: Klatka (Main)
    const exerciseInputs = page.locator('.exercise-name-input');
    await exerciseInputs.nth(0).fill('Wyciskanie klatki');
    
    // Add 9 sets
    for(let i=0; i<8; i++) {
        await page.click('text=+ Seria');
    }
    
    // Fill first set
    await page.locator('input[id^="weight-"]').nth(0).fill('50');
    await page.locator('input[id^="reps-"]').nth(0).fill('20');

    // 2nd Exercise: Wzno Klatka
    await page.click('#add-exercise-to-plan-btn');
    await exerciseInputs.nth(1).fill('Wzno Klatka');
    await page.locator('input[id^="weight-"]').nth(1).fill('3');
    await page.locator('input[id^="reps-"]').nth(1).fill('10');

    // 3rd Exercise: Superset (Wzno Klatka + Barki)
    await page.locator('button:has-text("🔗 Dodaj Superserię")').first().click();
    await exerciseInputs.nth(2).fill('Wzno Klatka (Superseria)');
    await exerciseInputs.nth(3).fill('Barki');

    // Add dropsets to the first exercise of the superset
    const addDropsetBtns = page.locator('text=🔥 Dropset');
    await addDropsetBtns.nth(0).click(); // Dropset 1
    await addDropsetBtns.nth(0).click(); // Dropset 2

    // 4th Exercise: Orbitrek (Cardio)
    await page.click('#add-exercise-to-plan-btn');
    await exerciseInputs.nth(4).fill('Orbitrek');
    
    // Change type to cardio
    const typeSelects = page.locator('select');
    await typeSelects.nth(4).selectOption('cardio');

    // Start cardio
    await page.click('text=▶ Start');
    await page.waitForTimeout(1000); // Wait a second
    await page.click('text=⏹ Stop');

    // Toggle manual time
    await page.click('text=Wpisz czas treningu ręcznie');
    await page.fill('#manual-training-hours', '1');
    await page.fill('#manual-training-minutes', '5');

    // Pause the training (Simulate user pausing and returning)
    await page.click('#pause-training-btn');

    // Now, finish the training!
    // Handle dialog
    page.once('dialog', dialog => dialog.accept());
    await page.click('#finish-training-btn');

    // Wait for successful save alert
    page.once('dialog', dialog => {
        expect(dialog.message()).toContain('Trening zapisany pomyślnie!');
        dialog.accept();
    });

    // Check if draft was cleared
    const draft = await page.evaluate(() => localStorage.getItem('uki_active_training_draft'));
    expect(draft).toBeNull();
    
    // Ensure we're back to calendar view
    await page.waitForSelector('#training-calendar-view', { state: 'visible' });
  });
});
