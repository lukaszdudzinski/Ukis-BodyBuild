const { test, expect } = require('@playwright/test');

test('Sprawdza, czy nawigacja i moduł diety ładują się bez błędów składniowych JS', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => {
    errors.push(err.message);
  });

  // Otwarcie strony PWA z serwera testowego lub pliku lokalnego
  // Playwright może testować plik lokalny dzięki file://
  await page.goto('file://' + require('path').resolve(__dirname, '../../index.html'));

  // Sprawdzamy czy okno profilu lub napis Uki Bodybuild jest widoczny by potwierdzić że skrypt w ogóle ruszył
  await expect(page.locator('#app-header-title')).toBeVisible();

  // Oczekujemy, że nie było żadnych błędów JS
  expect(errors).toEqual([]);
});
