import { test, expect } from '@playwright/test';

test.describe('Uki BodyBuild - Smoke Tests', () => {
  
  test('Aplikacja ładuje się poprawnie i wyświetla ekran powitalny', async ({ page }) => {
    // Wejdź na stronę główną
    await page.goto('/');

    // Sprawdź, czy tytuł strony to Uki's BodyBuild
    await expect(page).toHaveTitle(/Uki's BodyBuild/);

    // Sprawdź, czy widać logo lub napis powitalny (PWA może mieć opóźnienie ładowania)
    await expect(page.locator('h2').filter({ hasText: "Witaj w Uki's BodyBuild" }).first()).toBeVisible({ timeout: 10000 });

    // Czekamy na załadowanie bazy danych i pojawienie się inputu na imię
    const nameInput = page.locator('#onboarding-nick-input');
    await expect(nameInput).toBeVisible({ timeout: 10000 });

    // Wpisz imię i kliknij Zapisz
    await nameInput.fill('Playwright Tester');
    await page.locator('#onboarding-save-btn').click();

    // Upewnij się, że przeszliśmy do głównego ekranu (powinno zniknąć okno logowania i pojawić się ekran startowy)
    const calendarView = page.locator('#welcome-screen');
    await expect(calendarView).toBeVisible({ timeout: 10000 });
  });

  // Miejsce na kolejny test, w którym wstrzykniemy Twoją prawdziwą bazę danych!
});
