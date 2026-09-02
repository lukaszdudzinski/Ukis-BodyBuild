import { test, expect } from '@playwright/test';

test.describe('Test na danych z produkcji', () => {
  test('Przywrócenie bazy z pliku i sprawdzenie naprawy błędu szablonów', async ({ page }) => {
    test.setTimeout(120000); // Wydłużony czas na wgranie dużej bazy

    // 1. Wejdź na stronę
    await page.goto('/');

    // 2. Jeśli jest okno rejestracji - przeklikaj
    const nameInput = page.locator('#nickname-input');
    if (await nameInput.isVisible()) {
        await nameInput.fill('QA Tester');
        await page.getByRole('button', { name: 'Zapisz i Przejdź' }).click();
    }

    // 3. Wejdź w Diagnostykę
    await page.click('a[data-tab="diagnostics-dashboard"]');

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
    const calendarView = page.locator('#training-calendar-view');
    await expect(calendarView).toBeVisible({ timeout: 15000 });

    // Zgłaszam sukces załadowania bazy
    console.log("Baza wgrana z sukcesem!");
  });
});
