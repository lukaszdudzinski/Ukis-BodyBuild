const { test, expect } = require('@playwright/test');

test.describe('Training Types UI', () => {
  test('should show and hide exercises container based on training type', async ({ page }) => {
    await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02');  });
    await page.goto('/');
    await page.waitForTimeout(1000);

    await page.evaluate(() => window.switchTab('training-dashboard'));
    await page.waitForSelector('#training-calendar-view', { state: 'visible' });
    await page.evaluate(() => window.TrainingUI.handleDayClick('2026-08-15'));
    await page.click('#start-new-session-btn');
    await page.waitForSelector('#active-training-view', { state: 'visible' });

    const exercisesSection = page.locator('#exercises-container-section');
    await expect(exercisesSection).toBeVisible();
    
    const classContainer = page.locator('#class-type-container');
    await expect(classContainer).toBeHidden();

    await page.selectOption('#training-type-select', 'cardio');
    await expect(exercisesSection).toBeHidden();
    await expect(classContainer).toBeHidden();

    await page.selectOption('#training-type-select', 'class');
    await expect(exercisesSection).toBeHidden();
    await expect(classContainer).toBeVisible();
  });

  test('powinien przełączać typ ćwiczenia w pętli 3-stanowej (Siłowy -> Cardio -> Zajęcia)', async ({ page }) => {
    await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02'); });
    await page.goto('/');
    await page.waitForTimeout(1000);

    await page.evaluate(() => window.switchTab('training-dashboard'));
    await page.waitForSelector('#training-calendar-view', { state: 'visible' });
    await page.evaluate(() => window.TrainingUI.handleDayClick('2026-08-15'));
    await page.click('#start-new-session-btn');
    await page.waitForSelector('#active-training-view', { state: 'visible' });

    await page.click('#add-exercise-to-plan-btn');

    // Button ma teraz SVG i text "Siłowy", "Cardio", "Zajęcia"
    // Atrybut onclick="window.TrainingUI.toggleExerciseType(...)"
    const toggleBtn = page.locator('button[onclick*="toggleExerciseType"]').first();
    await expect(toggleBtn).toBeVisible();

    await expect(toggleBtn).toContainText('Siłowy');

    await toggleBtn.click();
    await expect(toggleBtn).toContainText('Cardio');

    await toggleBtn.click();
    await expect(toggleBtn).toContainText('Zajęcia');

    await toggleBtn.click();
    await expect(toggleBtn).toContainText('Siłowy');
  });
});
