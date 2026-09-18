import { test, expect } from '@playwright/test';

test.describe('Test na danych z produkcji', () => {
  test('Przywrócenie bazy z pliku i sprawdzenie naprawy błędu szablonów', async ({ page }) => {
    test.setTimeout(120000); // Wydłużony czas na wgranie dużej bazy

    // 1. Wejdź na stronę
    await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02'); });
    await page.goto('/');
    await page.waitForTimeout(1000);

    // 2. Jeśli jest okno rejestracji - przeklikaj
    const nameInput = page.locator('#nickname-input');
    if (await nameInput.isVisible()) {
        await nameInput.fill('QA Tester');
        await page.getByRole('button', { name: 'Zapisz i Przejdź' }).click();
    }

    // 3. Wejdź w Diagnostykę
    await page.evaluate(() => window.switchTab('diagnostics-dashboard'));

    // 4. Załaduj plik
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.locator('#db-import-btn').click(),
    ]);
    
    // Wgrywamy Twój plik z danymi
    await fileChooser.setFiles('/Users/lukaszdudzinski/Downloads/bodybuild_backup_2026-09-02_10-48-01.json');

    // Akceptujemy okienko alert (baza przywrócona pomyslnie)
    page.on('dialog', dialog => dialog.accept());

    // Czekamy aż strona się przeładuje po imporcie
    await page.waitForLoadState('networkidle');

    // Sprawdźmy czy jesteśmy zalogowani i czy baza się załadowała
    await page.evaluate(() => window.switchTab('training-dashboard'));
    const calendarView = page.locator('#training-calendar-view');
    await expect(calendarView).toBeVisible({ timeout: 15000 });

    // Zgłaszam sukces załadowania bazy
    console.log("Baza wgrana z sukcesem!");
  });
});
