import { test, expect } from '@playwright/test';

test.describe('Uki BodyBuild - Smoke Tests', () => {
  
  test('Aplikacja ładuje się poprawnie i wyświetla ekran powitalny', async ({ page }) => {
    // Wejdź na stronę główną
    await page.goto('/');

    // Sprawdź, czy tytuł strony to Uki's BodyBuild
    await expect(page).toHaveTitle(/Uki's BodyBuild/);

    // Sprawdź, czy widać logo lub napis powitalny (PWA może mieć opóźnienie ładowania)
    await expect(page.locator('h1').filter({ hasText: "Uki's BodyBuild" }).first()).toBeVisible({ timeout: 10000 });

    // Czekamy na załadowanie bazy danych i pojawienie się inputu na imię
    const nameInput = page.locator('#nickname-input');
    await expect(nameInput).toBeVisible({ timeout: 10000 });

    // Wpisz imię i kliknij Zapisz
    await nameInput.fill('Playwright Tester');
    await page.getByRole('button', { name: 'Zapisz i Przejdź' }).click();

    // Upewnij się, że przeszliśmy do głównego ekranu (powinno zniknąć okno logowania i pojawić się kalendarz lub panel)
    const calendarView = page.locator('#training-calendar-view');
    await expect(calendarView).toBeVisible({ timeout: 10000 });
  });

  // Miejsce na kolejny test, w którym wstrzykniemy Twoją prawdziwą bazę danych!
});
