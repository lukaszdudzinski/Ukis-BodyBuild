const { test, expect } = require('@playwright/test');

const setupPWA = async (page) => {
  await page.addInitScript(() => {
    Object.defineProperty(window.navigator, 'standalone', { value: true, configurable: true });
    const origMatchMedia = window.matchMedia;
    window.matchMedia = function (query) {
      if (query === '(display-mode: standalone)') {
        return {
          matches: true,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true
        };
      }
      return origMatchMedia ? origMatchMedia.call(window, query) : { matches: false, media: query };
    };
    window.localStorage.setItem('tutorial_global_v21', 'true');
    window.localStorage.setItem('tutorial_global_v22', 'true');
    window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.8.22.02');
  });
};

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

    await setupPWA(page);
    await page.goto('/');
    
    // Sprawdzamy, czy główny nagłówek z nazwą powitalną jest widoczny
    await expect(page.locator('.home-header h2')).toBeVisible();
    
    // Sprawdzamy czy APP_VERSION jest zainicjalizowana z AppUI i ma poprawną wartość
    const appVersion = await page.evaluate(() => window.APP_VERSION);
    const metaVersion = await page.getAttribute('meta[name="app-version"]', 'content');
    expect(appVersion).toBeDefined();
    expect(appVersion).toBe(metaVersion);

    // Filtrujemy tylko krytyczne błędy (np. zablokowanie ładowania main.js)
    const criticalErrors = errors.filter(e => 
      e.includes('SyntaxError') || 
      e.includes('switchTab is not defined')
    );
    
    // Nie powinniśmy mieć żadnych krytycznych błędów
    expect(criticalErrors.length).toBe(0);
  });

  test('Nawigacja pomiędzy zakładkami działa', async ({ page }) => {
    await setupPWA(page);
    await page.goto('/');
    
    // Zakładka główna powinna być widoczna domyślnie
    await expect(page.locator('#welcome-screen')).toHaveClass(/active-tab/);
    
    // Klikamy w boczny panel -> Trening
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
