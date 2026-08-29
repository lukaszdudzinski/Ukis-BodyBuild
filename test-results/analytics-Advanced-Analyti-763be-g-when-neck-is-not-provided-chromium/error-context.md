# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: analytics.spec.js >> Advanced Analytics Module >> should display missing data warning when neck is not provided
- Location: tests/e2e/analytics.spec.js:60:3

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [ref=e1]:
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
          - link "Analiza Progresu" [active] [ref=e17] [cursor=pointer]:
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
        - generic [ref=e28]: Trial (7 dni) v2026.8.28.01
    - main [ref=e29]:
      - generic [ref=e31]:
        - generic [ref=e32]:
          - heading "Analiza Progresu" [level=2] [ref=e33]
          - paragraph [ref=e34]: Wykresy i statystyki
        - paragraph [ref=e36]: Ładowanie danych...
  - text: ✕
  - button "🤖" [ref=e37] [cursor=pointer]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Advanced Analytics Module', () => {
  4  |   test('should display FFMI, WHR and BF% when all measurements are provided', async ({ page }) => {
  5  |     // We mock localStorage and IndexedDB in a real scenario, but since playwright loads the actual page,
  6  |     // we can inject measurements directly into the IndexedDB/OPFS via page.evaluate
  7  |     await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.8.13.01'); });
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
  39 |     const advancedTitle = await page.locator('text=Analiza składu ciała').isVisible();
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
  61 |     await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.8.13.01'); });
  62 |     await page.goto('http://127.0.0.1:8080');
  63 | 
  64 |     // Wait for App UI to load
  65 |     await page.waitForSelector('.app-wrapper');
  66 | 
  67 |     await page.evaluate(async () => {
  68 |       const mockData = {
  69 |         date: '2026-08-06',
  70 |         weight: 80.0,
  71 |         height: 180,
  72 |         // neck is missing
  73 |         waist: 85.0,
  74 |         hips: 95.0,
  75 |         chest: 105.0,
  76 |         thigh: 60.0,
  77 |         biceps: 38.0,
  78 |         photo: null
  79 |       };
  80 |       await window.DatabaseManager.addMeasurement(mockData);
  81 |     });
  82 | 
  83 |     // Navigate to Analytics Tab
  84 |     await page.click('a[data-tab="analytics-dashboard"]');
  85 |     
  86 |     // Check for missing data warning
  87 |     const missingWarning = await page.locator('text=Brak danych do wyliczenia BF%').isVisible();
> 88 |     expect(missingWarning).toBeTruthy();
     |                            ^ Error: expect(received).toBeTruthy()
  89 | 
  90 |     const missingNeckText = await page.locator('text=Uzupełnij: Szyja').isVisible();
  91 |     expect(missingNeckText).toBeTruthy();
  92 | 
  93 |     // Clean up
  94 |     await page.evaluate(async () => {
  95 |       window.DatabaseManager.db.exec("DELETE FROM measurements");
  96 |     });
  97 |   });
  98 | });
  99 | 
```