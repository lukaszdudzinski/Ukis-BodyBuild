# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: training-types.spec.js >> Training Types UI >> should show and hide exercises container based on training type
- Location: tests/e2e/training-types.spec.js:4:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#tile-training')
    - locator resolved to <div id="tile-training" class="dashboard-card" onclick="switchTab('training-dashboard')">…</div>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    54 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms

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
        - generic [ref=f1e26]: v.2026.8.9.09
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
  3  | test.describe('Training Types UI', () => {
  4  |   test('should show and hide exercises container based on training type', async ({ page }) => {
  5  |     // We mock the DB init to not fail if OPFS is weird in headless
  6  |     // We can just rely on the static HTML for this UI test.
  7  |     await page.goto('http://127.0.0.1:8080/');
  8  | 
  9  |     // Click the Training tile to go to Training dashboard
> 10 |     await page.click('#tile-training');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  11 | 
  12 |     // Wait for the calendar view to be visible
  13 |     await page.waitForSelector('#training-calendar-view', { state: 'visible' });
  14 | 
  15 |     // Click "Add new session" button
  16 |     await page.click('#start-new-session-btn');
  17 | 
  18 |     // Wait for active training view to be visible
  19 |     await page.waitForSelector('#active-training-view', { state: 'visible' });
  20 | 
  21 |     // Default type should be 'strength', so exercises container should be visible
  22 |     const exercisesSection = page.locator('#exercises-container-section');
  23 |     await expect(exercisesSection).toBeVisible();
  24 |     
  25 |     // Class container should be hidden
  26 |     const classContainer = page.locator('#class-type-container');
  27 |     await expect(classContainer).toBeHidden();
  28 | 
  29 |     // Select 'cardio' type
  30 |     await page.selectOption('#training-type-select', 'cardio');
  31 |     
  32 |     // Exercises section should be hidden
  33 |     await expect(exercisesSection).toBeHidden();
  34 |     // Class container should still be hidden
  35 |     await expect(classContainer).toBeHidden();
  36 | 
  37 |     // Select 'class' type
  38 |     await page.selectOption('#training-type-select', 'class');
  39 |     
  40 |     // Exercises section should be hidden
  41 |     await expect(exercisesSection).toBeHidden();
  42 |     // Class container should be visible
  43 |     await expect(classContainer).toBeVisible();
  44 |   });
  45 | });
  46 | 
```