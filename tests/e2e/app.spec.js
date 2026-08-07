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
    await page.goto('/');
    
    // Zakładka główna powinna być widoczna domyślnie
    await expect(page.locator('#welcome-screen')).toHaveClass(/active-tab/);
    
    // Klikamy w boczny panel -> Trening
    // Jeśli to mobile, trzeba otworzyć menu, ale robimy test pod desktop
    await page.click('.sidebar-nav a[data-tab="training-panel"]');
    
    // Sprawdzamy czy przełączyło na panel treningu
    await expect(page.locator('#training-panel')).toHaveClass(/active-tab/);
    await expect(page.locator('#training-panel')).toBeVisible();

    // Klikamy -> Pomiary Ciała
    await page.click('.sidebar-nav a[data-tab="measurements-panel"]');
    await expect(page.locator('#measurements-panel')).toHaveClass(/active-tab/);
    await expect(page.locator('#measurements-panel')).toBeVisible();
  });

  test('Samouczek uruchamia się i pozwala się zamknąć', async ({ page }) => {
    await page.goto('/');
    
    // Otwórz ustawienia
    await page.click('.sidebar-nav a[data-tab="settings-panel"]');
    
    // Kliknij restart samouczka w panelu ustawień
    await page.click('button[onclick="window.OnboardingUI.startTour()"]');
    
    const overlay = page.locator('#onboarding-overlay');
    await expect(overlay).toBeVisible();
    
    // Sprawdź czy jest widoczny przycisk "Pomiń"
    const skipBtn = page.locator('#tour-skip-btn');
    await expect(skipBtn).toBeVisible();
    
    // Zamknij
    await skipBtn.click();
    await expect(overlay).not.toBeVisible();
  });
});
