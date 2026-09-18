const { test, expect } = require('@playwright/test');

test.describe('Training and History Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02'); });
    await page.goto('/');
    await page.waitForTimeout(1000);
  });

  test('should create a training session and verify it appears in history', async ({ page }) => {
    await page.evaluate(() => window.switchTab('training-dashboard'));
    await page.click('text=Dodaj nową sesję treningową');
    await page.fill('#training-name-input', 'Trening siłowy test');
    await page.waitForTimeout(500);

    // --- Exercise 1: Wyciskanie ---
    await page.fill('.exercise-name-input', 'Wyciskanie sztangi leżąc');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    await page.click('text=+ Seria');
    await page.locator('input[placeholder="Ciężar (kg)"]').nth(0).fill('80');
    await page.locator('input[placeholder="Powtórzenia"]').nth(0).fill('12');
    
    await page.click('text=+ Seria');
    await page.locator('input[placeholder="Ciężar (kg)"]').nth(1).fill('85');
    await page.locator('input[placeholder="Powtórzenia"]').nth(1).fill('10');

    await page.click('text=+ Seria');
    await page.locator('input[placeholder="Ciężar (kg)"]').nth(2).fill('90');
    await page.locator('input[placeholder="Powtórzenia"]').nth(2).fill('8');

    // Add another exercise
    await page.click('#add-exercise-to-plan-btn');
    await page.waitForTimeout(500);

    // --- Exercise 2: Wyciskanie skośne ---
    await page.locator('.exercise-name-input').nth(1).fill('Wyciskanie skośne');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    
    const ex2AddSet = page.locator('text=+ Seria').nth(1);
    await ex2AddSet.click();
    await page.locator('input[placeholder="Ciężar (kg)"]').nth(3).fill('60');
    await page.locator('input[placeholder="Powtórzenia"]').nth(3).fill('15');

    await ex2AddSet.click();
    await page.locator('input[placeholder="Ciężar (kg)"]').nth(4).fill('65');
    await page.locator('input[placeholder="Powtórzenia"]').nth(4).fill('12');

    await ex2AddSet.click();
    await page.locator('input[placeholder="Ciężar (kg)"]').nth(5).fill('70');
    await page.locator('input[placeholder="Powtórzenia"]').nth(5).fill('10');

    // Add third exercise
    await page.click('#add-exercise-to-plan-btn');
    await page.waitForTimeout(500);

    // --- Exercise 3: Triceps ---
    await page.locator('.exercise-name-input').nth(2).fill('Francuskie wyciskanie (Triceps)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    
    const ex3AddSet = page.locator('text=+ Seria').nth(2);
    await ex3AddSet.click();
    await page.locator('input[placeholder="Ciężar (kg)"]').nth(6).fill('30');
    await page.locator('input[placeholder="Powtórzenia"]').nth(6).fill('15');

    await ex3AddSet.click();
    await page.locator('input[placeholder="Ciężar (kg)"]').nth(7).fill('35');
    await page.locator('input[placeholder="Powtórzenia"]').nth(7).fill('12');

    await ex3AddSet.click();
    await page.locator('input[placeholder="Ciężar (kg)"]').nth(8).fill('40');
    await page.locator('input[placeholder="Powtórzenia"]').nth(8).fill('10');

    // Finish training
    page.on('dialog', dialog => dialog.accept());
    await page.click('#finish-training-btn');
    await expect(page.locator('#training-calendar-view')).toBeVisible({ timeout: 5000 });

    // Go to History tab
    await page.evaluate(() => window.switchTab('history-dashboard'));
    await page.waitForTimeout(1000);

    // Assert that the training is in history
    await expect(page.locator('#history-dashboard >> text=Trening siłowy test').first()).toBeVisible();
    await page.locator('text=▼').first().click();

    // Verify details are shown
    await expect(page.locator('text=Wyciskanie sztangi leżąc').first()).toBeVisible();
    await expect(page.locator('text=Wyciskanie skośne').first()).toBeVisible();
    await expect(page.locator('text=Francuskie wyciskanie (Triceps)').first()).toBeVisible();
  });

  test('powinien poprawnie wyświetlać Blok Łączony w oknie modalnym historii', async ({ page }) => {
    // Unique name to avoid conflicts across retries
    const uniqueName = "Trening z superserią test " + Date.now();
    
    await page.evaluate(async (name) => {
        const today = new Date().toISOString().split('T')[0];
        await window.DatabaseManager.addTraining({
            date: today,
            name: name,
            duration_seconds: 3600,
            type: "strength",
            exercises: [
                {
                    id: "sup1",
                    type: "superset",
                    name: "",
                    exercises: [
                        { id: "s1", type: "strength", name: "Biceps", sets: [{weight: 10, reps: 10}] },
                        { id: "s2", type: "strength", name: "Triceps", sets: [{weight: 15, reps: 10}] }
                    ]
                }
            ]
        });
    }, uniqueName);

    await page.reload();
    await page.waitForTimeout(1000);

    // Idź do historii
    await page.evaluate(() => window.switchTab('history-dashboard'));
    await page.waitForSelector('#history-dashboard', { state: 'visible' });

    // Rozwiń trening z superserią
    await expect(page.locator('#history-dashboard').getByText(uniqueName).first()).toBeVisible();
    await page.locator('#history-dashboard').getByText(uniqueName).first().click();

    // Sprawdź czy jest Blok Łączony i nie ma "Nieznane ćwiczenie"
    await expect(page.locator('text=Blok Łączony (Superseria)').first()).toBeVisible();
    await expect(page.locator('text=Biceps').first()).toBeVisible();
    await expect(page.locator('text=Triceps').first()).toBeVisible();
    await expect(page.locator('text=Nieznane ćwiczenie')).toHaveCount(0);
  });
});
