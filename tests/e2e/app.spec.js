const { test, expect } = require('@playwright/test');

test.describe('Uki BodyBuild App - PWA and UI', () => {
  test('Powinna załadować się bez błędów typu SyntaxError (Smoke Test)', async ({ page }) => {
    let errors = [];
    
    // Zbieramy błędy rzucone globalnie przez stronę
    page.on('pageerror', error => errors.push(error.message));
    
    // Zbieramy błędy rzucone do konsoli (np. 404, albo błędy złapane przez try/catch bez throw)
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    
    // Sprawdzamy, czy główny nagłówek z nazwą powitalną jest widoczny
    await expect(page.locator('.home-header h2')).toBeVisible();
    
    // Sprawdzamy czy APP_VERSION jest zainicjalizowana z AppUI
    const appVersion = await page.evaluate(() => window.APP_VERSION);
    expect(appVersion).toBeDefined();

    // Filtrujemy tylko krytyczne błędy (np. zablokowanie ładowania main.js)
    const criticalErrors = errors.filter(e => 
      e.includes('SyntaxError') || 
      e.includes('switchTab is not defined')
    );
    
    // Nie powinniśmy mieć żadnych krytycznych błędów
    expect(criticalErrors.length).toBe(0);
  });

  test('Nawigacja pomiędzy zakładkami działa', async ({ page }) => {
    await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.8.13.01'); });
    await page.goto('/');
    
    // Zakładka główna powinna być widoczna domyślnie
    await expect(page.locator('#welcome-screen')).toHaveClass(/active-tab/);
    
    // Klikamy w boczny panel -> Trening
    // Jeśli to mobile, trzeba otworzyć menu, ale robimy test pod desktop
    await page.click('.sidebar-nav a[data-tab="training-dashboard"]');
    
    // Sprawdzamy czy przełączyło na panel treningu
    await expect(page.locator('#training-dashboard')).toHaveClass(/active-tab/);
    await expect(page.locator('#training-dashboard')).toBeVisible();

    // Klikamy -> Pomiary Ciała
    await page.click('#home-link-header');
    await page.click('.sidebar-nav a[data-tab="measurements-dashboard"]');
    await expect(page.locator('#measurements-dashboard')).toHaveClass(/active-tab/);
    await expect(page.locator('#measurements-dashboard')).toBeVisible();
  });
});
