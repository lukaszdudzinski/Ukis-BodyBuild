# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complex_training_save.spec.js >> Złożony scenariusz zapisu treningu z draftem >> Powinien zapisać trening z dropsetami, superseriami, cardio i czasem ręcznym bez utraty danych
- Location: tests/e2e/complex_training_save.spec.js:4:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Start') to be visible

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
        - generic [ref=f1e26]: v.2026.8.9.08
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
  3  | test.describe('Złożony scenariusz zapisu treningu z draftem', () => {
  4  |   test('Powinien zapisać trening z dropsetami, superseriami, cardio i czasem ręcznym bez utraty danych', async ({ page }) => {
  5  |     // Navigate to the app (assuming it's served locally during tests)
  6  |     await page.goto('/');
  7  | 
  8  |     // Wait for the app to load
> 9  |     await page.waitForSelector('text=Start');
     |                ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  10 | 
  11 |     // Go to Training tab
  12 |     await page.click('a[data-tab="training-dashboard"]');
  13 | 
  14 |     // Start a new session
  15 |     await page.click('#start-new-session-btn');
  16 |     await page.waitForSelector('#active-training-view', { state: 'visible' });
  17 | 
  18 |     // Set Name
  19 |     await page.fill('#training-name-input', 'Klatka triceps barki');
  20 | 
  21 |     // 1st Exercise: Klatka (Main)
  22 |     const exerciseInputs = page.locator('.exercise-name-input');
  23 |     await exerciseInputs.nth(0).fill('Wyciskanie klatki');
  24 |     
  25 |     // Add 9 sets
  26 |     for(let i=0; i<8; i++) {
  27 |         await page.click('text=+ Seria');
  28 |     }
  29 |     
  30 |     // Fill first set
  31 |     await page.locator('input[id^="weight-"]').nth(0).fill('50');
  32 |     await page.locator('input[id^="reps-"]').nth(0).fill('20');
  33 | 
  34 |     // 2nd Exercise: Wzno Klatka
  35 |     await page.click('#add-exercise-to-plan-btn');
  36 |     await exerciseInputs.nth(1).fill('Wzno Klatka');
  37 |     await page.locator('input[id^="weight-"]').nth(1).fill('3');
  38 |     await page.locator('input[id^="reps-"]').nth(1).fill('10');
  39 | 
  40 |     // 3rd Exercise: Superset (Wzno Klatka + Barki)
  41 |     await page.click('#add-superset-to-plan-btn');
  42 |     await exerciseInputs.nth(2).fill('Wzno Klatka (Superseria)');
  43 |     await exerciseInputs.nth(3).fill('Barki');
  44 | 
  45 |     // Add dropsets to the first exercise of the superset
  46 |     const addDropsetBtns = page.locator('text=🔥 Dropset');
  47 |     await addDropsetBtns.nth(0).click(); // Dropset 1
  48 |     await addDropsetBtns.nth(0).click(); // Dropset 2
  49 | 
  50 |     // 4th Exercise: Orbitrek (Cardio)
  51 |     await page.click('#add-exercise-to-plan-btn');
  52 |     await exerciseInputs.nth(4).fill('Orbitrek');
  53 |     
  54 |     // Change type to cardio
  55 |     const typeSelects = page.locator('select');
  56 |     await typeSelects.nth(4).selectOption('cardio');
  57 | 
  58 |     // Start cardio
  59 |     await page.click('text=▶ Start');
  60 |     await page.waitForTimeout(1000); // Wait a second
  61 |     await page.click('text=⏹ Stop');
  62 | 
  63 |     // Toggle manual time
  64 |     await page.click('text=Wpisz czas treningu ręcznie');
  65 |     await page.fill('#manual-training-hours', '1');
  66 |     await page.fill('#manual-training-minutes', '5');
  67 | 
  68 |     // Pause the training (Simulate user pausing and returning)
  69 |     await page.click('#pause-training-btn');
  70 | 
  71 |     // Now, finish the training!
  72 |     // Handle dialog
  73 |     page.once('dialog', dialog => dialog.accept());
  74 |     await page.click('#finish-training-btn');
  75 | 
  76 |     // Wait for successful save alert
  77 |     page.once('dialog', dialog => {
  78 |         expect(dialog.message()).toContain('Trening zapisany pomyślnie!');
  79 |         dialog.accept();
  80 |     });
  81 | 
  82 |     // Check if draft was cleared
  83 |     const draft = await page.evaluate(() => localStorage.getItem('uki_active_training_draft'));
  84 |     expect(draft).toBeNull();
  85 |     
  86 |     // Ensure we're back to calendar view
  87 |     await page.waitForSelector('#training-calendar-view', { state: 'visible' });
  88 |   });
  89 | });
  90 | 
```