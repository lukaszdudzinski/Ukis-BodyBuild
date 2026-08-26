# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: analytics.spec.js >> Advanced Analytics Module >> should display FFMI, WHR and BF% when all measurements are provided
- Location: tests/e2e/analytics.spec.js:4:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.app-wrapper') to be visible
    63 × locator resolved to hidden <div class="app-wrapper">…</div>

```

# Page snapshot

```yaml
- generic [active]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - img "Uki's BodyBuild Logo" [ref=e4]
      - heading "Uki's BodyBuild" [level=1] [ref=e5]
      - paragraph [ref=e6]: Kompleksowa platforma do analizy formy. Twoje dane, Twój trening, Twoje wyniki.
      - link "☕ Postaw Kawę / Wesprzyj Projekt" [ref=e8] [cursor=pointer]:
        - /url: https://suppi.pl/ukidives
    - img "Aplikacja Uki's BodyBuild" [ref=e9]
    - generic [ref=e10]:
      - heading "Zainstaluj, aby rozpocząć" [level=2] [ref=e11]
      - paragraph [ref=e12]: Aplikacja działa w trybie pełnoekranowym. Zainstaluj ją bezpośrednio na swoim urządzeniu, postępując zgodnie z poniższą instrukcją.
      - generic [ref=e13]:
        - generic [ref=e14]:
          - heading "🍎 iOS (iPhone / Safari)" [level=3] [ref=e15]
          - list [ref=e16]:
            - listitem [ref=e17]:
              - text: Dotknij ikony
              - strong [ref=e18]: Udostępnij
              - text: (kwadrat ze strzałką na dole ekranu).
            - listitem [ref=e19]:
              - text: Przewiń w dół i wybierz
              - strong [ref=e20]: "\"Do ekranu początkowego\""
              - text: .
            - listitem [ref=e21]:
              - text: Kliknij
              - strong [ref=e22]: "\"Dodaj\""
              - text: w prawym górnym rogu.
            - listitem [ref=e23]: Uruchom aplikację z nowej ikony na pulpicie!
        - generic [ref=e24]:
          - heading "🤖 Android (Chrome)" [level=3] [ref=e25]
          - list [ref=e26]:
            - listitem [ref=e27]:
              - text: Dotknij ikony
              - strong [ref=e28]: Menu
              - text: (trzy kropki w prawym górnym rogu).
            - listitem [ref=e29]:
              - text: Wybierz opcję
              - strong [ref=e30]: "\"Zainstaluj aplikację\""
              - text: lub "Dodaj do ekranu głównego".
            - listitem [ref=e31]: Potwierdź chęć instalacji.
            - listitem [ref=e32]: Uruchom aplikację z nowej ikony na pulpicie!
    - generic [ref=e33]:
      - generic [ref=e34]:
        - heading "Trener Edward AI" [level=4] [ref=e35]
        - paragraph [ref=e36]: Zaawansowany asystent sztucznej inteligencji, który przeanalizuje Twoją dietę na podstawie zdjęcia talerza oraz podsumuje Twój progres treningowy.
      - generic [ref=e37]:
        - heading "Precyzyjna Analityka" [level=4] [ref=e38]
        - paragraph [ref=e39]: Śledź zaawansowane wskaźniki takie jak FFMI, BF% czy WHR na interaktywnych wykresach. Poznaj swoje ciało przez twarde dane.
      - generic [ref=e40]:
        - heading "Inteligentny Trening" [level=4] [ref=e41]
        - paragraph [ref=e42]: Automatyczne dropsety, superserie i obsługa ćwiczeń z obciążeniem własnego ciała (z uwzględnieniem gum oporowych).
    - contentinfo [ref=e43]:
      - paragraph [ref=e44]: © 2026 Uki's BodyBuild. Aplikacja dla wymagających.
  - text: ☕ ✕
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
> 11 |     await page.waitForSelector('.app-wrapper');
     |                ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
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
  88 |     expect(missingWarning).toBeTruthy();
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