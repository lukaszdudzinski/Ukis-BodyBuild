const { test, expect } = require('../fixtures');

test.describe('Training Save Bug', () => {
  test('should save training with 4 dropsets and a superset', async ({ page }) => {
    // Zresetuj localStorage żeby pominąć onboarding jeśli jest
    await page.addInitScript(() => {
      window.localStorage.setItem('tutorial_global_v22', 'true');
      
      window.localStorage.setItem('userNick', 'Test');
    });

    // 1. Otwarcie aplikacji
    await page.goto('/');
    await page.waitForTimeout(1000);
    await page.waitForTimeout(1000); // Wait for app initialization

    // Wejście w trening
    await page.evaluate(() => window.switchTab('training-dashboard'));
    // Select day 15 first
    await page.evaluate(() => window.TrainingUI.handleDayClick('2026-08-15'));
    
    // Rozpoczęcie nowego treningu
    await page.click('#start-new-session-btn');
    
    // Nazwa ćwiczenia to <textarea>: zapis nazwy (change) odpala się dopiero na blur,
    // więc zatwierdzamy ją Tabem, zanim klikniemy cokolwiek innego.
    await page.fill('.exercise-name-input', 'Wyciskanie');
    await page.keyboard.press('Tab');

    // Nowe ćwiczenie ma 0 serii: wiersze z wagą/powtórzeniami powstają dopiero po [ + Seria ]
    const weightInputs = page.locator('input[placeholder="Ciężar (kg)"]');
    const repsInputs = page.locator('input[placeholder="Powtórzenia"]');
    await expect(weightInputs).toHaveCount(0);

    // Pierwsza seria (normalna)
    await page.getByRole('button', { name: '+ Seria' }).click();
    await expect(weightInputs).toHaveCount(1);
    await weightInputs.nth(0).fill('100');
    await repsInputs.nth(0).fill('10');

    // Dodanie 4 dropsetów, każdy wypełniony własnym wierszem
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button', { name: 'Dropset' }).click();
      await expect(weightInputs).toHaveCount(i + 2);
      await weightInputs.nth(i + 1).fill((90 - i * 10).toString());
      await repsInputs.nth(i + 1).fill('8');
    }

    // Dodanie superserii
    await page.getByRole('button', { name: 'Superseria' }).first().click();

    // Zakończenie i zapis
    // Akceptacja alertu (confirm) i ewentualnego alertu sukcesu
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    
    await page.click('#finish-training-btn');
    
    // Weryfikacja że przeszło (zobaczymy widok kalendarza i historii)
    await expect(page.locator('#training-calendar-view')).toBeVisible({ timeout: 5000 });
  });
});
