const { test, expect } = require('@playwright/test');

test.describe('Training Types UI', () => {
  test('should show and hide exercises container based on training type', async ({ page }) => {
    // We mock the DB init to not fail if OPFS is weird in headless
    // We can just rely on the static HTML for this UI test.
    await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.8.13.01'); });
    await page.goto('http://127.0.0.1:8080/');

    // Click the Training tile to go to Training dashboard
    await page.click('a[data-tab="training-dashboard"]');

    // Wait for the calendar view to be visible
    await page.waitForSelector('#training-calendar-view', { state: 'visible' });

    // Select day 15 first
    await page.evaluate(() => window.TrainingUI.handleDayClick('2026-08-15'));

    // Click "Add new session" button
    await page.click('#start-new-session-btn');

    // Wait for active training view to be visible
    await page.waitForSelector('#active-training-view', { state: 'visible' });

    // Default type should be 'strength', so exercises container should be visible
    const exercisesSection = page.locator('#exercises-container-section');
    await expect(exercisesSection).toBeVisible();
    
    // Class container should be hidden
    const classContainer = page.locator('#class-type-container');
    await expect(classContainer).toBeHidden();

    // Select 'cardio' type
    await page.selectOption('#training-type-select', 'cardio');
    
    // Exercises section should be hidden
    await expect(exercisesSection).toBeHidden();
    // Class container should still be hidden
    await expect(classContainer).toBeHidden();

    // Select 'class' type
    await page.selectOption('#training-type-select', 'class');
    
    // Exercises section should be hidden
    await expect(exercisesSection).toBeHidden();
    // Class container should be visible
    await expect(classContainer).toBeVisible();
  });
});
