# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: version_verification.spec.js >> Weryfikacja wersji v2026.8.22.02 i mechanizmu PWA Updater >> 2. Aplikacja ładuje się poprawnie, bez błędów konsoli i bez zapętlenia pwa-updater.js
- Location: tests/e2e/version_verification.spec.js:64:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "v2026.8.22.02"
Received: "v2026.8.22.03"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic "Powrót do ekranu startowego" [ref=e4] [cursor=pointer]:
        - img "Logo" [ref=e5]
        - heading "Uki's BodyBuild" [level=1] [ref=e6]
      - list [ref=e7]:
        - listitem [ref=e8]:
          - link "Pulpit Główny" [ref=e9] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e10]:
          - link "Pomiary Ciała" [ref=e11] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e12]:
          - link "Trening" [ref=e13] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e14]:
          - link "Historia Treningów" [ref=e15] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e16]:
          - link "Analiza Progresu" [ref=e17] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e18]:
          - link "Dieta i Żywienie" [ref=e19] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e20]:
          - link "Diagnostyka" [ref=e21] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e22]:
          - link "Profil i Ustawienia" [ref=e23] [cursor=pointer]:
            - /url: "#"
      - generic [ref=e24]:
        - link [ref=e26] [cursor=pointer]:
          - /url: https://suppi.pl/ukidives
          - text: ☕ Podoba Ci się to narzędzie?
          - strong [ref=e27]: Postaw mi kawę!
        - generic [ref=e28]: Trial (7 dni) v2026.8.22.03
    - main [ref=e29]:
      - generic [ref=e31]:
        - generic [ref=e32] [cursor=pointer]:
          - img "Logo" [ref=e33]
          - heading "Uki's BodyBuild" [level=2] [ref=e34]
          - paragraph [ref=e35]: Wybierz narzędzie z menu
        - generic [ref=e36]: Trial (7 dni) v2026.8.22.03
  - text: ✕
  - button "🤖" [ref=e37] [cursor=pointer]
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | const fs = require('fs');
  3   | const path = require('path');
  4   | 
  5   | const setupPWA = async (page) => {
  6   |   await page.addInitScript(() => {
  7   |     Object.defineProperty(window.navigator, 'standalone', { value: true, configurable: true });
  8   |     const origMatchMedia = window.matchMedia;
  9   |     window.matchMedia = function (query) {
  10  |       if (query === '(display-mode: standalone)') {
  11  |         return {
  12  |           matches: true,
  13  |           media: query,
  14  |           onchange: null,
  15  |           addListener: () => {},
  16  |           removeListener: () => {},
  17  |           addEventListener: () => {},
  18  |           removeEventListener: () => {},
  19  |           dispatchEvent: () => true
  20  |         };
  21  |       }
  22  |       return origMatchMedia ? origMatchMedia.call(window, query) : { matches: false, media: query };
  23  |     };
  24  |     window.localStorage.setItem('tutorial_global_v21', 'true');
  25  |     window.localStorage.setItem('tutorial_global_v22', 'true');
  26  |     window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.8.22.02');
  27  |   });
  28  | };
  29  | 
  30  | test.describe('Weryfikacja wersji v2026.8.22.02 i mechanizmu PWA Updater', () => {
  31  |   
  32  |   test('1. Statyczna zgodność wersji we wszystkich plikach projektu (PWA Golden Rule)', async () => {
  33  |     const expectedVersion = 'v2026.8.22.02';
  34  | 
  35  |     // 1. AppUI.js
  36  |     const appUiPath = path.join(__dirname, '../../src/modules/ui/AppUI.js');
  37  |     const appUiContent = fs.readFileSync(appUiPath, 'utf8');
  38  |     const appUiMatch = appUiContent.match(/export const APP_VERSION = '([^']+)';/);
  39  |     expect(appUiMatch, 'Brak stałej APP_VERSION w AppUI.js').not.toBeNull();
  40  |     expect(appUiMatch[1]).toBe(expectedVersion);
  41  | 
  42  |     // 2. index.html
  43  |     const indexPath = path.join(__dirname, '../../index.html');
  44  |     const indexContent = fs.readFileSync(indexPath, 'utf8');
  45  |     const indexMatch = indexContent.match(/<meta name="app-version" content="([^"]+)">/);
  46  |     expect(indexMatch, 'Brak tagu meta app-version w index.html').not.toBeNull();
  47  |     expect(indexMatch[1]).toBe(expectedVersion);
  48  | 
  49  |     // 3. CHANGELOG.json
  50  |     const changelogPath = path.join(__dirname, '../../CHANGELOG.json');
  51  |     const changelog = JSON.parse(fs.readFileSync(changelogPath, 'utf8'));
  52  |     expect(changelog[0].version).toBe(expectedVersion);
  53  |     expect(Array.isArray(changelog[0].changes)).toBe(true);
  54  |     expect(changelog[0].changes.length).toBeGreaterThan(0);
  55  | 
  56  |     // 4. sw.js
  57  |     const swPath = path.join(__dirname, '../../sw.js');
  58  |     const swContent = fs.readFileSync(swPath, 'utf8');
  59  |     const swMatch = swContent.match(/const CACHE_NAME = 'ukis-bodybuild-([^']+)';/);
  60  |     expect(swMatch, 'Brak CACHE_NAME w sw.js').not.toBeNull();
  61  |     expect(swMatch[1]).toBe(expectedVersion);
  62  |   });
  63  | 
  64  |   test('2. Aplikacja ładuje się poprawnie, bez błędów konsoli i bez zapętlenia pwa-updater.js', async ({ page }) => {
  65  |     const consoleErrors = [];
  66  |     const pageErrors = [];
  67  | 
  68  |     page.on('pageerror', err => pageErrors.push(err.message));
  69  |     page.on('console', msg => {
  70  |       if (msg.type() === 'error') {
  71  |         consoleErrors.push(msg.text());
  72  |       }
  73  |     });
  74  | 
  75  |     await setupPWA(page);
  76  |     await page.goto('/');
  77  | 
  78  |     // Czekamy na załadowanie głównego interfejsu
  79  |     await expect(page.locator('.home-header h2')).toBeVisible();
  80  |     await expect(page.locator('#welcome-screen')).toBeVisible();
  81  | 
  82  |     // Sprawdzamy czy window.APP_VERSION jest zdefiniowane i równe v2026.8.22.02
  83  |     const runtimeVersion = await page.evaluate(() => window.APP_VERSION);
> 84  |     expect(runtimeVersion).toBe('v2026.8.22.02');
      |                            ^ Error: expect(received).toBe(expected) // Object.is equality
  85  | 
  86  |     // Sprawdzamy brak krytycznych błędów JS
  87  |     const criticalPageErrors = pageErrors.filter(e => !e.includes('favicon'));
  88  |     expect(criticalPageErrors).toEqual([]);
  89  | 
  90  |     // Sprawdzamy czy pwa-update-banner NIE został wyświetlony (brak zapętlenia aktualizatora)
  91  |     const banner = page.locator('#pwa-update-banner');
  92  |     if (await banner.count() > 0) {
  93  |       await expect(banner).toBeHidden();
  94  |     }
  95  | 
  96  |     // Odczekujemy chwilę, aby upewnić się, że nie zachodzi cykliczny reload strony
  97  |     let reloadCount = 0;
  98  |     page.on('framenavigated', () => { reloadCount++; });
  99  |     await page.waitForTimeout(2000);
  100 |     expect(reloadCount).toBe(0);
  101 |   });
  102 | 
  103 |   test('3. Prawidłowe wyświetlenie nowej wersji v2026.8.22.02 na ekranie', async ({ page }) => {
  104 |     await setupPWA(page);
  105 |     await page.goto('/');
  106 | 
  107 |     // Weryfikacja na pulpicie głównym (#dashboard-version)
  108 |     const dashboardVersionElem = page.locator('#dashboard-version');
  109 |     await expect(dashboardVersionElem).toBeVisible();
  110 |     const dashboardText = await dashboardVersionElem.innerText();
  111 |     expect(dashboardText).toContain('v2026.8.22.02');
  112 | 
  113 |     // Weryfikacja w sekcji Ustawienia i Profil (.app-version-display)
  114 |     // Otwórz Ustawienia przez kafelek na pulpicie
  115 |     const settingsTile = page.locator('.nav-card[data-tab="settings-dashboard"], a[data-tab="settings-dashboard"]').first();
  116 |     if (await settingsTile.isVisible()) {
  117 |       await settingsTile.click();
  118 |       await expect(page.locator('#settings-dashboard')).toBeVisible();
  119 |       
  120 |       const settingsVersionElem = page.locator('.app-version-display, #settings-app-version').first();
  121 |       await expect(settingsVersionElem).toBeVisible();
  122 |       const settingsText = await settingsVersionElem.innerText();
  123 |       expect(settingsText).toContain('v2026.8.22.02');
  124 |     }
  125 |   });
  126 | 
  127 |   test('4. Changelog modal poprawnie zawiera wpisy dla wersji v2026.8.22.02', async ({ page }) => {
  128 |     await setupPWA(page);
  129 |     await page.goto('/');
  130 | 
  131 |     // Wywołaj modal changeloga
  132 |     await page.evaluate(() => {
  133 |       if (window.showChangelogModal) {
  134 |         window.showChangelogModal('all');
  135 |       }
  136 |     });
  137 | 
  138 |     const changelogModal = page.locator('#changelog-modal-overlay');
  139 |     await expect(changelogModal).toBeVisible();
  140 |     
  141 |     // Sprawdź czy wersja v2026.8.22.02 jest wymieniona w modalu
  142 |     await expect(page.locator('#changelog-content')).toContainText('v2026.8.22.02');
  143 |   });
  144 | 
  145 | });
  146 | 
```