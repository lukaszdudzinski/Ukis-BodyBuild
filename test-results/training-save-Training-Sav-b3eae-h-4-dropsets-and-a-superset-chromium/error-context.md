# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: training-save.spec.js >> Training Save Bug >> should save training with 4 dropsets and a superset
- Location: tests/e2e/training-save.spec.js:4:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('a[data-tab="training"]')

```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]:
  - generic [ref=f2e2]:
    - navigation [ref=f2e3]:
      - generic "Powrót do ekranu startowego" [ref=f2e4] [cursor=pointer]:
        - img "Logo" [ref=f2e5]
        - heading "Uki's BodyBuild" [level=1] [ref=f2e6]
      - list [ref=f2e7]:
        - listitem [ref=f2e8]:
          - link "Pulpit Główny" [ref=f2e9] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f2e10]:
          - link "Pomiary Ciała" [ref=f2e11] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f2e12]:
          - link "Trening" [ref=f2e13] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f2e14]:
          - link "Historia Treningów" [ref=f2e15] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f2e16]:
          - link "Analiza Progresu" [ref=f2e17] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f2e18]:
          - link "Dieta i Żywienie" [ref=f2e19] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=f2e20]:
          - link "Profil i Ustawienia" [ref=f2e21] [cursor=pointer]:
            - /url: "#"
      - generic [ref=f2e22]:
        - link [ref=f2e24] [cursor=pointer]:
          - /url: https://suppi.pl/ukidives
          - text: ☕ Podoba Ci się to narzędzie?
          - strong [ref=f2e25]: Postaw mi kawę!
        - generic [ref=f2e26]: v.2026.8.9.09
    - main [ref=f2e27]:
      - generic [ref=f2e30] [cursor=pointer]:
        - img "Logo" [ref=f2e31]
        - heading "Cześć, Test! 🚀" [level=2] [ref=f2e32]
        - paragraph [ref=f2e33]: Wybierz narzędzie z menu
  - text: ✕
  - button "🤖" [ref=f2e34] [cursor=pointer]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Training Save Bug', () => {
  4  |   test('should save training with 4 dropsets and a superset', async ({ page }) => {
  5  |     // 1. Otwarcie aplikacji
  6  |     await page.goto('http://localhost:8080');
  7  |     
  8  |     // Zresetuj localStorage żeby pominąć onboarding jeśli jest
  9  |     await page.evaluate(() => {
  10 |       localStorage.setItem('tutorial_global_v22', 'true');
  11 |       localStorage.setItem('userNick', 'Test');
  12 |     });
  13 |     await page.reload();
  14 | 
  15 |     // Wejście w trening
> 16 |     await page.click('a[data-tab="training"]');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  17 |     
  18 |     // Rozpoczęcie nowego treningu
  19 |     await page.click('#start-new-training-btn');
  20 |     
  21 |     // Dodanie nazwy ćwiczenia dla pierwszego
  22 |     await page.fill('.exercise-name-input', 'Wyciskanie');
  23 |     
  24 |     // Wpisanie wagi i powt dla pierwszej serii (normalnej)
  25 |     const weightInputs = await page.$$('input[id^="weight-"]');
  26 |     const repsInputs = await page.$$('input[id^="reps-"]');
  27 |     
  28 |     await weightInputs[0].fill('100');
  29 |     await repsInputs[0].fill('10');
  30 |     await page.click('button:has-text("+ Seria")');
  31 |     
  32 |     // Dodanie 4 dropsetów
  33 |     for(let i = 0; i < 4; i++) {
  34 |       await weightInputs[0].fill((90 - i*10).toString());
  35 |       await repsInputs[0].fill('8');
  36 |       await page.click('button:has-text("🔥 Dropset")');
  37 |     }
  38 |     
  39 |     // Dodanie superserii
  40 |     await page.click('#add-superset-to-plan-btn');
  41 |     
  42 |     // Zakończenie i zapis
  43 |     // Akceptacja alertu (confirm) i ewentualnego alertu sukcesu
  44 |     page.on('dialog', async dialog => {
  45 |       await dialog.accept();
  46 |     });
  47 |     
  48 |     await page.click('#finish-training-btn');
  49 |     
  50 |     // Weryfikacja że przeszło (zobaczymy widok kalendarza i historii)
  51 |     await expect(page.locator('#training-calendar-view')).toBeVisible({ timeout: 5000 });
  52 |   });
  53 | });
  54 | 
```