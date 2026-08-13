const { test, expect } = require('@playwright/test');

test.describe('Training and History Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('tutorial_global_v22', 'true'));
    await page.goto('/');
  });

  test('should create a training session and verify it appears in history', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('tutorial_global_v22', 'true'));
    // 1. Go to Training Tab
    await page.click('a[data-tab="training-dashboard"]');

    // Wait for the calendar to render and click "Dodaj nową sesję treningową"
    await page.click('text=Dodaj nową sesję treningową');
    
    // Fill the training name
    await page.fill('#training-name-input', 'Trening siłowy test');

    // Wait a moment for UI
    await page.waitForTimeout(500);

    // --- Exercise 1: Wyciskanie ---
    await page.fill('.exercise-name-input', 'Wyciskanie sztangi leżąc');
    
    // Add sets (3 sets with weights and reps)
    // Set 1
    await page.fill('input[placeholder="kg"]', '80');
    await page.fill('input[placeholder="powt"]', '12');
    await page.click('button:has-text("+ Seria")');
    // Set 2
    await page.fill('input[placeholder="kg"]', '85');
    await page.fill('input[placeholder="powt"]', '10');
    await page.click('button:has-text("+ Seria")');
    // Set 3
    await page.fill('input[placeholder="kg"]', '90');
    await page.fill('input[placeholder="powt"]', '8');
    await page.click('button:has-text("+ Seria")');

    // Add another exercise
    await page.click('#add-exercise-to-plan-btn');
    await page.waitForTimeout(500);

    // --- Exercise 2: Wyciskanie skośne ---
    const exerciseInputs = page.locator('.exercise-name-input');
    await exerciseInputs.nth(1).fill('Wyciskanie skośne');

    const weightInputs = page.locator('input[placeholder="kg"]');
    const repsInputs = page.locator('input[placeholder="powt"]');
    const addSetBtns = page.locator('button:has-text("+ Seria")');
    
    await weightInputs.nth(1).fill('60');
    await repsInputs.nth(1).fill('15');
    await addSetBtns.nth(1).click();
    await weightInputs.nth(1).fill('65');
    await repsInputs.nth(1).fill('12');
    await addSetBtns.nth(1).click();
    await weightInputs.nth(1).fill('70');
    await repsInputs.nth(1).fill('10');
    await addSetBtns.nth(1).click();

    // Add third exercise
    await page.click('#add-exercise-to-plan-btn');
    await page.waitForTimeout(500);

    // --- Exercise 3: Triceps ---
    const exInputs3 = page.locator('.exercise-name-input');
    await exInputs3.nth(2).fill('Francuskie wyciskanie (Triceps)');

    const weightInputs3 = page.locator('input[placeholder="kg"]');
    const repsInputs3 = page.locator('input[placeholder="powt"]');
    const addSetBtns3 = page.locator('button:has-text("+ Seria")');

    await weightInputs3.nth(2).fill('30');
    await repsInputs3.nth(2).fill('15');
    await addSetBtns3.nth(2).click();
    await weightInputs3.nth(2).fill('35');
    await repsInputs3.nth(2).fill('12');
    await addSetBtns3.nth(2).click();
    await weightInputs3.nth(2).fill('40');
    await repsInputs3.nth(2).fill('10');
    await addSetBtns3.nth(2).click();

    // Finish training
    page.on('dialog', dialog => dialog.accept());
    await page.click('#finish-training-btn');
    await expect(page.locator('#training-calendar-view')).toBeVisible({ timeout: 5000 });

    // Go to History tab
    await page.evaluate(() => window.switchTab('history-dashboard'));

    // Wait for history to load
    await page.waitForTimeout(1000);

    // Assert that the training is in history
    await expect(page.locator('#history-dashboard >> text=Trening siłowy test').first()).toBeVisible();

    // Expand details
    await page.locator('text=▼').first().click();

    // Verify details are shown
    await expect(page.locator('text=Szczegóły ćwiczeń:').first()).toBeVisible();
    await expect(page.locator('text=Wyciskanie sztangi leżąc').first()).toBeVisible();
    await expect(page.locator('text=Wyciskanie skośne').first()).toBeVisible();
    await expect(page.locator('text=Francuskie wyciskanie (Triceps)').first()).toBeVisible();
  });
});
