const { test, expect } = require('@playwright/test');

test.describe('Training Save Bug', () => {
  test('should save training with 4 dropsets and a superset', async ({ page }) => {
    // 1. Otwarcie aplikacji
    await page.goto('http://localhost:8080');
    
    // Zresetuj localStorage żeby pominąć onboarding jeśli jest
    await page.evaluate(() => {
      localStorage.setItem('tutorial_global_v22', 'true');
      localStorage.setItem('userNick', 'Test');
    });
    await page.reload();

    // Wejście w trening
    await page.click('a[data-tab="training"]');
    
    // Rozpoczęcie nowego treningu
    await page.click('#start-new-training-btn');
    
    // Dodanie nazwy ćwiczenia dla pierwszego
    await page.fill('.exercise-name-input', 'Wyciskanie');
    
    // Wpisanie wagi i powt dla pierwszej serii (normalnej)
    const weightInputs = await page.$$('input[id^="weight-"]');
    const repsInputs = await page.$$('input[id^="reps-"]');
    
    await weightInputs[0].fill('100');
    await repsInputs[0].fill('10');
    await page.click('button:has-text("+ Seria")');
    
    // Dodanie 4 dropsetów
    for(let i = 0; i < 4; i++) {
      await weightInputs[0].fill((90 - i*10).toString());
      await repsInputs[0].fill('8');
      await page.click('button:has-text("🔥 Dropset")');
    }
    
    // Dodanie superserii
    await page.click('#add-superset-to-plan-btn');
    
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
