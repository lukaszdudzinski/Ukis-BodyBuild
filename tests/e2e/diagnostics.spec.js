const { test, expect } = require('@playwright/test');

test.describe('Diagnostics Panel - Asystent Mapowania (#db-migrate-names-btn)', () => {
  test.beforeEach(async ({ page }) => {
    // Mockujemy tryb standalone PWA oraz wyłączamy onboarding i changelog
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
      window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.8.20.03');
    });

    await page.goto('/');
    // Czekamy na załadowanie modułów aplikacji
    await page.waitForFunction(() => typeof window.switchTab === 'function' && typeof window.DatabaseManager !== 'undefined');
  });

  test('przycisk #db-migrate-names-btn istnieje w DOM i wywołuje okno dialogowe confirm', async ({ page }) => {
    // Przejdź do zakładki Diagnostyka
    await page.evaluate(() => window.switchTab('diagnostics-dashboard'));

    // Sprawdź czy panel diagnostyki jest widoczny
    const diagnosticsPanel = page.locator('#diagnostics-dashboard');
    await expect(diagnosticsPanel).toBeVisible();

    // Sprawdź czy przycisk Asystenta Mapowania istnieje w DOM i jest widoczny
    const migrateBtn = page.locator('#db-migrate-names-btn');
    await expect(migrateBtn).toBeAttached();
    await expect(migrateBtn).toBeVisible();
    await expect(migrateBtn).toContainText('Wykonaj Mapowanie Ćwiczeń');

    // Nasłuchiwanie na wywołanie okna dialogowego (confirm)
    let dialogTriggered = false;
    let dialogType = '';
    let dialogMessage = '';

    page.once('dialog', async (dialog) => {
      dialogTriggered = true;
      dialogType = dialog.type();
      dialogMessage = dialog.message();
      await dialog.dismiss();
    });

    // Kliknij przycisk Asystenta Mapowania
    await migrateBtn.click();

    // Weryfikacja parametrów okna dialogowego confirm
    expect(dialogTriggered).toBe(true);
    expect(dialogType).toBe('confirm');
    expect(dialogMessage).toContain('WAŻNE: Czy utworzyłeś już Archiwum?');
    expect(dialogMessage).toContain('Kliknij OK, aby otworzyć asystenta mapowania.');
  });

  test('otwiera Asystenta Mapowania (modal) po zatwierdzeniu confirm, gdy w bazie są nieznane ćwiczenia', async ({ page }) => {
    // Wstrzykujemy mock treningu ze starą/nieznaną nazwą ćwiczenia przez DatabaseManager.addTraining
    await page.evaluate(async () => {
      await window.DatabaseManager.addTraining({
        name: 'Stary Trening E2E',
        date: '2026-08-20',
        duration_seconds: 3600,
        exercises: [
          {
            name: 'stare wyciskanie płaska',
            sets: [{ weight: 80, reps: 10 }]
          }
        ]
      });
    });

    // Przejdź do Diagnostyki
    await page.evaluate(() => window.switchTab('diagnostics-dashboard'));

    const migrateBtn = page.locator('#db-migrate-names-btn');
    await expect(migrateBtn).toBeVisible();

    // Akceptujemy dialog confirm
    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await migrateBtn.click();

    // Sprawdzamy czy modal Asystenta Mapowania został dodany do DOM i jest widoczny
    const mappingModal = page.locator('#mapping-modal');
    await expect(mappingModal).toBeVisible();
    await expect(mappingModal).toContainText('Asystent Mapowania');
    await expect(mappingModal).toContainText('stare wyciskanie płaska');

    // Sprawdzamy obecność przycisku zapisu zmian
    const saveBtn = page.locator('#map-save-btn');
    await expect(saveBtn).toBeVisible();

    // Sprzątanie po teście
    await page.evaluate(async () => {
      if (window.DatabaseManager && window.DatabaseManager.db) {
        window.DatabaseManager.db.exec("DELETE FROM trainings WHERE name = 'Stary Trening E2E'");
      }
    });
  });
});
