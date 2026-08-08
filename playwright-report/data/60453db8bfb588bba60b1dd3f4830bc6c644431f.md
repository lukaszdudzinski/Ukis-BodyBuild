# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: analytics.spec.js >> Advanced Analytics Module >> should display missing data warning when neck is not provided
- Location: tests/e2e/analytics.spec.js:60:3

# Error details

```
Error: page.evaluate: Execution context was destroyed, most likely because of a navigation
```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - generic [ref=f1e2]:
    - navigation [ref=f1e3]:
      - generic "Powrót do ekranu startowego" [ref=f1e4] [cursor=pointer]:
        - img "Logo" [ref=f1e5]
        - heading "Uki's BodyBuild" [level=1] [ref=f1e6]
      - list [ref=f1e7]:
        - listitem [ref=f1e8]:
          - link "Pulpit Główny" [ref=f1e9] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f1e10]:
          - link "Pomiary Ciała" [ref=f1e11] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f1e12]:
          - link "Trening" [ref=f1e13] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f1e14]:
          - link "Historia Treningów" [ref=f1e15] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f1e16]:
          - link "Analiza Progresu" [ref=f1e17] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f1e18]:
          - link "Dieta i Żywienie" [ref=f1e19] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f1e20]:
          - link "Profil i Ustawienia" [ref=f1e21] [cursor=pointer]:
            - /url: "#"
      - generic [ref=f1e22]:
        - link [ref=f1e24] [cursor=pointer]:
          - /url: https://suppi.pl/ukidives
          - text: ☕ Podoba Ci się to narzędzie?
          - strong [ref=f1e25]: Postaw mi kawę!
        - generic [ref=f1e26]: v.2026.8.8.01
    - main [ref=f1e27]:
      - generic [ref=f1e30] [cursor=pointer]:
        - img "Logo" [ref=f1e31]
        - heading "Uki's BodyBuild" [level=2] [ref=f1e32]
        - paragraph [ref=f1e33]: Wybierz narzędzie z menu
  - text: ✕
  - button "🤖" [ref=f1e34] [cursor=pointer]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Advanced Analytics Module', () => {
  4  |   test('should display FFMI, WHR and BF% when all measurements are provided', async ({ page }) => {
  5  |     // We mock localStorage and IndexedDB in a real scenario, but since playwright loads the actual page,
  6  |     // we can inject measurements directly into the IndexedDB/OPFS via page.evaluate
  7  |     await page.addInitScript(() => window.localStorage.setItem('tutorial_global_v22', 'true'));
  8  |     await page.goto('http://127.0.0.1:8080'); // Assuming local server is running on 8080 during tests
  9  | 
  10 |     // Wait for App UI to load
  11 |     await page.waitForSelector('.app-wrapper');
  12 | 
  13 |     // Inject mock data into DatabaseManager
  14 |     await page.evaluate(async () => {
  15 |       // Mock some measurement data
  16 |       const mockData = {
  17 |         date: '2026-08-06',
  18 |         weight: 80.0,
  19 |         height: 180,
  20 |         neck: 38.0,
  21 |         waist: 85.0,
  22 |         hips: 95.0,
  23 |         chest: 105.0,
  24 |         thigh: 60.0,
  25 |         biceps: 38.0,
  26 |         photo: null
  27 |       };
  28 |       
  29 |       await window.DatabaseManager.addMeasurement(mockData);
  30 |     });
  31 | 
  32 |     // Navigate to Analytics Tab
  33 |     await page.click('a[data-tab="analytics-dashboard"]');
  34 |     
  35 |     // Wait for the analytics to render
  36 |     await page.waitForSelector('#analytics-content h4', { state: 'visible' });
  37 | 
  38 |     // Verify Advanced Analytics section exists
  39 |     const advancedTitle = await page.locator('text=Zaawansowana Analityka').isVisible();
  40 |     expect(advancedTitle).toBeTruthy();
  41 | 
  42 |     // Verify BF% is calculated (US Navy formula)
  43 |     const bfTitle = await page.locator('text=Szacunkowy BF%').isVisible();
  44 |     expect(bfTitle).toBeTruthy();
  45 | 
  46 |     // Verify FFMI is calculated
  47 |     const ffmiTitle = await page.locator('text=FFMI (Index Beztłuszczowy)').isVisible();
  48 |     expect(ffmiTitle).toBeTruthy();
  49 | 
  50 |     // Verify WHR is calculated
  51 |     const whrTitle = await page.locator('text=WHR (Talia-Biodra)').isVisible();
  52 |     expect(whrTitle).toBeTruthy();
  53 | 
  54 |     // Clean up
  55 |     await page.evaluate(async () => {
  56 |       window.DatabaseManager.db.exec("DELETE FROM measurements");
  57 |     });
  58 |   });
  59 | 
  60 |   test('should display missing data warning when neck is not provided', async ({ page }) => {
  61 |     await page.addInitScript(() => window.localStorage.setItem('tutorial_global_v22', 'true'));
  62 |     await page.goto('http://127.0.0.1:8080');
  63 | 
> 64 |     await page.evaluate(async () => {
     |                ^ Error: page.evaluate: Execution context was destroyed, most likely because of a navigation
  65 |       const mockData = {
  66 |         date: '2026-08-06',
  67 |         weight: 80.0,
  68 |         height: 180,
  69 |         // neck is missing
  70 |         waist: 85.0,
  71 |         hips: 95.0,
  72 |         chest: 105.0,
  73 |         thigh: 60.0,
  74 |         biceps: 38.0,
  75 |         photo: null
  76 |       };
  77 |       await window.DatabaseManager.addMeasurement(mockData);
  78 |     });
  79 | 
  80 |     // Navigate to Analytics Tab
  81 |     await page.click('a[data-tab="analytics-dashboard"]');
  82 |     
  83 |     // Check for missing data warning
  84 |     const missingWarning = await page.locator('text=Brak danych do wyliczenia BF%').isVisible();
  85 |     expect(missingWarning).toBeTruthy();
  86 | 
  87 |     const missingNeckText = await page.locator('text=Uzupełnij: Szyja').isVisible();
  88 |     expect(missingNeckText).toBeTruthy();
  89 | 
  90 |     // Clean up
  91 |     await page.evaluate(async () => {
  92 |       window.DatabaseManager.db.exec("DELETE FROM measurements");
  93 |     });
  94 |   });
  95 | });
  96 | 
```