const { test, expect } = require('@playwright/test');

test.describe('Training Save Bug', () => {
  test('should save training with 4 dropsets and a superset', async ({ page }) => {
    // Zresetuj localStorage żeby pominąć onboarding jeśli jest
    await page.addInitScript(() => {
      window.localStorage.setItem('tutorial_global_v22', 'true');
      window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.8.13.01');
      window.localStorage.setItem('userNick', 'Test');
    });

    // 1. Otwarcie aplikacji
    await page.goto('http://localhost:8080');
    await page.waitForTimeout(1000); // Wait for app initialization

    // Wejście w trening
    await page.click('a[data-tab="training-dashboard"]');
    // Select day 15 first
    await page.evaluate(() => window.TrainingUI.handleDayClick('2026-08-15'));
    
    // Rozpoczęcie nowego treningu
    await page.click('#start-new-session-btn');
    
    // Dodanie nazwy ćwiczenia dla pierwszego
    await page.fill('.exercise-name-input', 'Wyciskanie');
    
    // Wpisanie wagi i powt dla pierwszej serii (normalnej)
    const weightInputs = page.locator('input[id^="weight-"]');
    const repsInputs = page.locator('input[id^="reps-"]');
    
    await weightInputs.nth(0).fill('100');
    await repsInputs.nth(0).fill('10');
    await page.click('button:has-text("+ Seria")');
    
    // Dodanie 4 dropsetów
    for(let i = 0; i < 4; i++) {
      await weightInputs.nth(0).fill((90 - i*10).toString());
      await repsInputs.nth(0).fill('8');
      await page.click('button:has-text("🔥 Dropset")');
    }
    
    // Dodanie superserii
    await page.locator('button:has-text("🔗 Dodaj Superserię")').first().click();
    
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
