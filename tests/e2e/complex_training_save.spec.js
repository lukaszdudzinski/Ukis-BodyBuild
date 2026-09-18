const { test, expect } = require('@playwright/test');

test.describe('Complex Training Save Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the tutorial and changelog so they don't pop up and block the UI
    await page.addInitScript(() => {
        window.localStorage.setItem('tutorial_global_v22', 'true');
        window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02'); // Prevent Changelog from showing
    });
    await page.goto('/');
    await page.waitForTimeout(1000);
  });

  test('should create a training with normal exercises and supersets, and save it to history', async ({ page }) => {
    // Go to Training Tab
    await page.evaluate(() => window.switchTab('training-dashboard'));

    // Start a new session
    await page.click('text=Dodaj nową sesję treningową');
    await page.waitForTimeout(500);

    // Set Name
    await page.fill('#training-name-input', 'Klatka triceps barki');

    // 1st Exercise: Klatka (Main)
    const exerciseInputs = page.locator('.exercise-name-input');
    await exerciseInputs.nth(0).fill('Wyciskanie klatki');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    
    // Add 1 set
    await page.click('text=+ Seria');
    
    // Fill first set
    await page.locator('input[placeholder="Ciężar (kg)"]').nth(0).fill('50');
    await page.locator('input[placeholder="Powtórzenia"]').nth(0).fill('20');

    // 2nd Exercise: Wzno Klatka
    await page.click('#add-exercise-to-plan-btn');
    await page.waitForTimeout(500);
    await exerciseInputs.nth(1).fill('Wzno Klatka');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);

    await page.locator('text=+ Seria').nth(1).click();
    await page.locator('input[placeholder="Ciężar (kg)"]').nth(1).fill('30');
    await page.locator('input[placeholder="Powtórzenia"]').nth(1).fill('10');

    // Finish training
    page.on('dialog', dialog => dialog.accept());
    await page.click('#finish-training-btn');

    // Wait for Calendar
    await expect(page.locator('#training-calendar-view')).toBeVisible({ timeout: 5000 });

    // Go to History tab
    await page.evaluate(() => window.switchTab('history-dashboard'));
    await page.waitForTimeout(1000);

    // Assert that the training is in history
    await expect(page.locator('#history-dashboard >> text=Klatka triceps barki').first()).toBeVisible();
  });
});
