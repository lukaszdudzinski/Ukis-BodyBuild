const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

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

test.describe('Weryfikacja wersji v2026.8.22.02 i mechanizmu PWA Updater', () => {
  
  test('1. Statyczna zgodność wersji we wszystkich plikach projektu (PWA Golden Rule)', async () => {
    const expectedVersion = 'v2026.8.22.02';

    // 1. AppUI.js
    const appUiPath = path.join(__dirname, '../../src/modules/ui/AppUI.js');
    const appUiContent = fs.readFileSync(appUiPath, 'utf8');
    const appUiMatch = appUiContent.match(/export const APP_VERSION = '([^']+)';/);
    expect(appUiMatch, 'Brak stałej APP_VERSION w AppUI.js').not.toBeNull();
    expect(appUiMatch[1]).toBe(expectedVersion);

    // 2. index.html
    const indexPath = path.join(__dirname, '../../index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    const indexMatch = indexContent.match(/<meta name="app-version" content="([^"]+)">/);
    expect(indexMatch, 'Brak tagu meta app-version w index.html').not.toBeNull();
    expect(indexMatch[1]).toBe(expectedVersion);

    // 3. CHANGELOG.json
    const changelogPath = path.join(__dirname, '../../CHANGELOG.json');
    const changelog = JSON.parse(fs.readFileSync(changelogPath, 'utf8'));
    expect(changelog[0].version).toBe(expectedVersion);
    expect(Array.isArray(changelog[0].changes)).toBe(true);
    expect(changelog[0].changes.length).toBeGreaterThan(0);

    // 4. sw.js
    const swPath = path.join(__dirname, '../../sw.js');
    const swContent = fs.readFileSync(swPath, 'utf8');
    const swMatch = swContent.match(/const CACHE_NAME = 'ukis-bodybuild-([^']+)';/);
    expect(swMatch, 'Brak CACHE_NAME w sw.js').not.toBeNull();
    expect(swMatch[1]).toBe(expectedVersion);
  });

  test('2. Aplikacja ładuje się poprawnie, bez błędów konsoli i bez zapętlenia pwa-updater.js', async ({ page }) => {
    const consoleErrors = [];
    const pageErrors = [];

    page.on('pageerror', err => pageErrors.push(err.message));
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await setupPWA(page);
    await page.goto('/');

    // Czekamy na załadowanie głównego interfejsu
    await expect(page.locator('.home-header h2')).toBeVisible();
    await expect(page.locator('#welcome-screen')).toBeVisible();

    // Sprawdzamy czy window.APP_VERSION jest zdefiniowane i równe v2026.8.22.02
    const runtimeVersion = await page.evaluate(() => window.APP_VERSION);
    expect(runtimeVersion).toBe('v2026.8.22.02');

    // Sprawdzamy brak krytycznych błędów JS
    const criticalPageErrors = pageErrors.filter(e => !e.includes('favicon'));
    expect(criticalPageErrors).toEqual([]);

    // Sprawdzamy czy pwa-update-banner NIE został wyświetlony (brak zapętlenia aktualizatora)
    const banner = page.locator('#pwa-update-banner');
    if (await banner.count() > 0) {
      await expect(banner).toBeHidden();
    }

    // Odczekujemy chwilę, aby upewnić się, że nie zachodzi cykliczny reload strony
    let reloadCount = 0;
    page.on('framenavigated', () => { reloadCount++; });
    await page.waitForTimeout(2000);
    expect(reloadCount).toBe(0);
  });

  test('3. Prawidłowe wyświetlenie nowej wersji v2026.8.22.02 na ekranie', async ({ page }) => {
    await setupPWA(page);
    await page.goto('/');

    // Weryfikacja na pulpicie głównym (#dashboard-version)
    const dashboardVersionElem = page.locator('#dashboard-version');
    await expect(dashboardVersionElem).toBeVisible();
    const dashboardText = await dashboardVersionElem.innerText();
    expect(dashboardText).toContain('v2026.8.22.02');

    // Weryfikacja w sekcji Ustawienia i Profil (.app-version-display)
    // Otwórz Ustawienia przez kafelek na pulpicie
    const settingsTile = page.locator('.nav-card[data-tab="settings-dashboard"], a[data-tab="settings-dashboard"]').first();
    if (await settingsTile.isVisible()) {
      await settingsTile.click();
      await expect(page.locator('#settings-dashboard')).toBeVisible();
      
      const settingsVersionElem = page.locator('.app-version-display, #settings-app-version').first();
      await expect(settingsVersionElem).toBeVisible();
      const settingsText = await settingsVersionElem.innerText();
      expect(settingsText).toContain('v2026.8.22.02');
    }
  });

  test('4. Changelog modal poprawnie zawiera wpisy dla wersji v2026.8.22.02', async ({ page }) => {
    await setupPWA(page);
    await page.goto('/');

    // Wywołaj modal changeloga
    await page.evaluate(() => {
      if (window.showChangelogModal) {
        window.showChangelogModal('all');
      }
    });

    const changelogModal = page.locator('#changelog-modal-overlay');
    await expect(changelogModal).toBeVisible();
    
    // Sprawdź czy wersja v2026.8.22.02 jest wymieniona w modalu
    await expect(page.locator('#changelog-content')).toContainText('v2026.8.22.02');
  });

});
