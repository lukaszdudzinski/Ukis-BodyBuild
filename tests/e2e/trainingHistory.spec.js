const { test, expect } = require('@playwright/test');

test.describe('Training and History Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create a training session and verify it appears in history', async ({ page }) => {
    // 1. Go to Training Tab
    await page.click('text=Trening');

    // Wait for the calendar to render and click "Dodaj nową sesję treningową"
    await page.click('text=Dodaj nową sesję treningową');
    
    // Fill the training name
    await page.fill('input[placeholder="Nazwa treningu (opcjonalnie)"]', 'Trening siłowy');

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
    await page.click('text=Dodaj kolejne ćwiczenie');
    await page.waitForTimeout(500);

    // --- Exercise 2: Wyciskanie skośne ---
    const exerciseInputs = await page.$$('.exercise-name-input');
    await exerciseInputs[1].fill('Wyciskanie skośne');

    const weightInputs = await page.$$('input[placeholder="kg"]');
    const repsInputs = await page.$$('input[placeholder="powt"]');
    const addSetBtns = await page.$$('button:has-text("+ Seria")');
    
    await weightInputs[1].fill('60');
    await repsInputs[1].fill('15');
    await addSetBtns[1].click();
    await weightInputs[1].fill('65');
    await repsInputs[1].fill('12');
    await addSetBtns[1].click();
    await weightInputs[1].fill('70');
    await repsInputs[1].fill('10');
    await addSetBtns[1].click();

    // Add third exercise
    await page.click('text=Dodaj kolejne ćwiczenie');
    await page.waitForTimeout(500);

    // --- Exercise 3: Triceps ---
    const exInputs3 = await page.$$('.exercise-name-input');
    await exInputs3[2].fill('Francuskie wyciskanie (Triceps)');

    const weightInputs3 = await page.$$('input[placeholder="kg"]');
    const repsInputs3 = await page.$$('input[placeholder="powt"]');
    const addSetBtns3 = await page.$$('button:has-text("+ Seria")');

    await weightInputs3[2].fill('30');
    await repsInputs3[2].fill('15');
    await addSetBtns3[2].click();
    await weightInputs3[2].fill('35');
    await repsInputs3[2].fill('12');
    await addSetBtns3[2].click();
    await weightInputs3[2].fill('40');
    await repsInputs3[2].fill('10');
    await addSetBtns3[2].click();

    // Finish training
    page.on('dialog', dialog => dialog.accept());
    await page.click('text=Zakończ i Zapisz Trening');

    // Go to History tab
    const isBurgerVisible = await page.isVisible('.menu-toggle');
    if (isBurgerVisible) {
        await page.click('.menu-toggle');
        await page.click('.nav-links >> text=Historia Treningów');
    } else {
        await page.click('nav >> text=Historia Treningów');
    }

    // Wait for history to load
    await page.waitForTimeout(1000);

    // Assert that the training is in history
    await expect(page.locator('text=Trening siłowy').first()).toBeVisible();

    // Expand details
    await page.locator('text=▼').first().click();

    // Verify details are shown
    await expect(page.locator('text=Szczegóły ćwiczeń:').first()).toBeVisible();
    await expect(page.locator('text=Wyciskanie sztangi leżąc').first()).toBeVisible();
    await expect(page.locator('text=Wyciskanie skośne').first()).toBeVisible();
    await expect(page.locator('text=Francuskie wyciskanie (Triceps)').first()).toBeVisible();
  });
});
