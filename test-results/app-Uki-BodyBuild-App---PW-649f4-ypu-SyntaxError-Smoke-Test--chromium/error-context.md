# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.js >> Uki BodyBuild App - PWA and UI >> Powinna załadować się bez błędów typu SyntaxError (Smoke Test)
- Location: tests/e2e/app.spec.js:4:3

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
  - generic [ref=f1e35]:
    - generic [ref=f1e36]: 👋
    - heading "Witaj w Uki's BodyBuild! 🚀" [level=2] [ref=f1e37]
    - paragraph [ref=f1e38]: Cześć! Jestem Edward, Twój wirtualny asystent AI 🤖.Jak mam się do Ciebie zwracać?
    - textbox "Wpisz swój nick lub imię..." [ref=f1e39]
    - button "Zaczynamy! ➔" [ref=f1e40] [cursor=pointer]
  - button "🤖" [ref=f1e41] [cursor=pointer]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Uki BodyBuild App - PWA and UI', () => {
  4  |   test('Powinna załadować się bez błędów typu SyntaxError (Smoke Test)', async ({ page }) => {
  5  |     let errors = [];
  6  |     
  7  |     // Zbieramy błędy rzucone globalnie przez stronę
  8  |     page.on('pageerror', error => errors.push(error.message));
  9  |     
  10 |     // Zbieramy błędy rzucone do konsoli (np. 404, albo błędy złapane przez try/catch bez throw)
  11 |     page.on('console', msg => {
  12 |       if (msg.type() === 'error') {
  13 |         errors.push(msg.text());
  14 |       }
  15 |     });
  16 | 
  17 |     await page.goto('/');
  18 |     
  19 |     // Sprawdzamy, czy główny nagłówek z nazwą powitalną jest widoczny
  20 |     await expect(page.locator('.home-header h2')).toBeVisible();
  21 |     
  22 |     // Sprawdzamy czy APP_VERSION jest zainicjalizowana z AppUI
> 23 |     const appVersion = await page.evaluate(() => window.APP_VERSION);
     |                                   ^ Error: page.evaluate: Execution context was destroyed, most likely because of a navigation
  24 |     expect(appVersion).toBeDefined();
  25 | 
  26 |     // Filtrujemy tylko krytyczne błędy (np. zablokowanie ładowania main.js)
  27 |     const criticalErrors = errors.filter(e => 
  28 |       e.includes('SyntaxError') || 
  29 |       e.includes('switchTab is not defined')
  30 |     );
  31 |     
  32 |     // Nie powinniśmy mieć żadnych krytycznych błędów
  33 |     expect(criticalErrors.length).toBe(0);
  34 |   });
  35 | 
  36 |   test('Nawigacja pomiędzy zakładkami działa', async ({ page }) => {
  37 |     await page.addInitScript(() => window.localStorage.setItem('tutorial_global_v22', 'true'));
  38 |     await page.goto('/');
  39 |     
  40 |     // Zakładka główna powinna być widoczna domyślnie
  41 |     await expect(page.locator('#welcome-screen')).toHaveClass(/active-tab/);
  42 |     
  43 |     // Klikamy w boczny panel -> Trening
  44 |     // Jeśli to mobile, trzeba otworzyć menu, ale robimy test pod desktop
  45 |     await page.click('.sidebar-nav a[data-tab="training-dashboard"]');
  46 |     
  47 |     // Sprawdzamy czy przełączyło na panel treningu
  48 |     await expect(page.locator('#training-dashboard')).toHaveClass(/active-tab/);
  49 |     await expect(page.locator('#training-dashboard')).toBeVisible();
  50 | 
  51 |     // Klikamy -> Pomiary Ciała
  52 |     await page.click('.sidebar-nav a[data-tab="measurements-dashboard"]');
  53 |     await expect(page.locator('#measurements-dashboard')).toHaveClass(/active-tab/);
  54 |     await expect(page.locator('#measurements-dashboard')).toBeVisible();
  55 |   });
  56 | });
  57 | 
```