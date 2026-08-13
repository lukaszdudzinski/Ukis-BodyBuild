const { test, expect } = require('@playwright/test');

test('Sprawdza, czy nawigacja i moduł diety ładują się bez błędów składniowych JS', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => {
    errors.push(err.message);
  });

  // Otwarcie strony PWA z serwera testowego lub pliku lokalnego
  // Playwright może testować plik lokalny dzięki file://
  await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.8.13.01'); });
    await page.goto('file://' + require('path').resolve(__dirname, '../../index.html'));

  // Sprawdzamy czy okno profilu lub napis Uki Bodybuild jest widoczny by potwierdzić że skrypt w ogóle ruszył
  await expect(page.locator('h1').first()).toBeVisible();

  // Oczekujemy, że nie było żadnych błędów JS
  expect(errors).toEqual([]);
});
