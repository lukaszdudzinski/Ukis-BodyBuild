# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/analytics.spec.js >> Advanced Analytics Module >> should display FFMI, WHR and BF% when all measurements are provided
- Location: tests/e2e/analytics.spec.js:4:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#btn-tab-2')
    - locator resolved to <button id="btn-tab-2" class="analytics-tab-btn" onclick="window.AnalyticsUI.switchTab(2)">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div id="changelog-modal-overlay">…</div> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div id="changelog-modal-overlay">…</div> intercepts pointer events
    - retrying click action
      - waiting 100ms
    55 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div id="changelog-modal-overlay">…</div> intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [active]:
  - generic [ref=e1]:
    - main [ref=e2]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - heading "Analiza Progresu" [level=2] [ref=e6]
          - paragraph [ref=e7]: Wykresy i statystyki
        - generic [ref=e8]:
          - generic [ref=e9]:
            - button "Siła" [ref=e10] [cursor=pointer]
            - button "Sylwetka" [ref=e20] [cursor=pointer]
            - button "Regeneracja" [ref=e24] [cursor=pointer]
          - paragraph [ref=e30]: Za mało danych treningowych do przeprowadzenia analizy.
    - generic [ref=e31]:
      - generic [ref=e32] [cursor=pointer]: Menu
      - generic [ref=e38] [cursor=pointer]: Trening
      - generic [ref=e49] [cursor=pointer]: Profil
      - generic [ref=e55] [cursor=pointer]: Serwis
  - generic [ref=e61]:
    - generic [ref=e62]:
      - heading "Co nowego? 🚀" [level=3] [ref=e63]
      - button "×" [ref=e64] [cursor=pointer]
    - generic [ref=e67]:
      - heading "Wersja v2026.9.18.01 (2026-09-18)" [level=4] [ref=e68]
      - list [ref=e69]:
        - listitem [ref=e70]: "🐞 HOTFIX: Naprawiono wszystkie testy Playwright E2E. Aktualizacja selektorów (Glassmorphism), likwidacja race conditions (Changelog i PWA) oraz fix czyszczenia bazy OPFS w trybie WebWorker."
  - button "🤖" [ref=e72] [cursor=pointer]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Advanced Analytics Module', () => {
  4  |   test('should display FFMI, WHR and BF% when all measurements are provided', async ({ page }) => {
  5  |     await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02'); });
  6  |     await page.goto('/');
  7  |     await page.waitForTimeout(1000);
  8  | 
  9  |     await page.waitForSelector('.app-wrapper');
  10 | 
  11 |     await page.evaluate(async () => {
  12 |       const mockData = {
  13 |         date: '2026-08-06',
  14 |         weight: 80.0,
  15 |         height: 180,
  16 |         neck: 38.0,
  17 |         waist: 85.0,
  18 |         hips: 95.0,
  19 |         chest: 105.0,
  20 |         thigh: 60.0,
  21 |         biceps: 38.0,
  22 |         photo: null
  23 |       };
  24 |       await window.DatabaseManager.addMeasurement(mockData);
  25 |     });
  26 | 
  27 |     await page.evaluate(() => window.switchTab('analytics-dashboard'));
> 28 |     await page.click('#btn-tab-2'); 
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  29 |     await page.waitForTimeout(500);
  30 | 
  31 |     await expect(page.locator('text=Szacunkowy BF%')).toBeVisible();
  32 |     await expect(page.locator('text=FFMI (Index Beztłuszczowy)')).toBeVisible();
  33 |     await expect(page.locator('text=WHR (Talia-Biodra)')).toBeVisible();
  34 |   });
  35 | 
  36 |   test('should display missing data warning when neck is not provided', async ({ page }) => {
  37 |     await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02'); });
  38 |     await page.goto('/');
  39 |     await page.waitForTimeout(1000);
  40 | 
  41 |     await page.waitForSelector('.app-wrapper');
  42 | 
  43 |     await page.evaluate(async () => {
  44 |       const mockData = {
  45 |         date: '2026-08-06',
  46 |         weight: 80.0,
  47 |         height: 180,
  48 |         waist: 85.0,
  49 |         hips: 95.0,
  50 |         chest: 105.0,
  51 |         thigh: 60.0,
  52 |         biceps: 38.0,
  53 |         photo: null
  54 |       };
  55 |       await window.DatabaseManager.addMeasurement(mockData);
  56 |     });
  57 | 
  58 |     await page.evaluate(() => window.switchTab('analytics-dashboard'));
  59 |     await page.click('#btn-tab-2'); 
  60 |     await page.waitForTimeout(500);
  61 | 
  62 |     await expect(page.locator('#analytics-dashboard').getByText('Brak danych BF%')).toBeVisible();
  63 |     await expect(page.locator('#analytics-dashboard').getByText('Uzupełnij: Szyja.')).toBeVisible();
  64 |   });
  65 | });
  66 | 
```