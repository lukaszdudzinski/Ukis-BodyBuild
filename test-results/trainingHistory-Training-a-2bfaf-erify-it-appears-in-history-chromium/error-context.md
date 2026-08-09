# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: trainingHistory.spec.js >> Training and History Flow >> should create a training session and verify it appears in history
- Location: tests/e2e/trainingHistory.spec.js:9:3

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
    - waiting for element to be visible, enabled and stable
  - element was detached from the DOM, retrying
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
    55 × waiting for element to be visible, enabled and stable
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
  - button "🤖" [ref=f1e34] [cursor=pointer]
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | test.describe('Training and History Flow', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.addInitScript(() => window.localStorage.setItem('tutorial_global_v22', 'true'));
  6   |     await page.goto('/');
  7   |   });
  8   | 
  9   |   test('should create a training session and verify it appears in history', async ({ page }) => {
  10  |     // 1. Go to Training Tab
> 11  |     await page.click('#tile-training');
      |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  12  | 
  13  |     // Wait for the calendar to render and click "Dodaj nową sesję treningową"
  14  |     await page.click('text=Dodaj nową sesję treningową');
  15  |     
  16  |     // Fill the training name
  17  |     await page.fill('input[placeholder="Nazwa treningu (opcjonalnie)"]', 'Trening siłowy');
  18  | 
  19  |     // Wait a moment for UI
  20  |     await page.waitForTimeout(500);
  21  | 
  22  |     // --- Exercise 1: Wyciskanie ---
  23  |     await page.fill('.exercise-name-input', 'Wyciskanie sztangi leżąc');
  24  |     
  25  |     // Add sets (3 sets with weights and reps)
  26  |     // Set 1
  27  |     await page.fill('input[placeholder="kg"]', '80');
  28  |     await page.fill('input[placeholder="powt"]', '12');
  29  |     await page.click('button:has-text("+ Seria")');
  30  |     // Set 2
  31  |     await page.fill('input[placeholder="kg"]', '85');
  32  |     await page.fill('input[placeholder="powt"]', '10');
  33  |     await page.click('button:has-text("+ Seria")');
  34  |     // Set 3
  35  |     await page.fill('input[placeholder="kg"]', '90');
  36  |     await page.fill('input[placeholder="powt"]', '8');
  37  |     await page.click('button:has-text("+ Seria")');
  38  | 
  39  |     // Add another exercise
  40  |     await page.click('text=Dodaj kolejne ćwiczenie');
  41  |     await page.waitForTimeout(500);
  42  | 
  43  |     // --- Exercise 2: Wyciskanie skośne ---
  44  |     const exerciseInputs = await page.$$('.exercise-name-input');
  45  |     await exerciseInputs[1].fill('Wyciskanie skośne');
  46  | 
  47  |     const weightInputs = await page.$$('input[placeholder="kg"]');
  48  |     const repsInputs = await page.$$('input[placeholder="powt"]');
  49  |     const addSetBtns = await page.$$('button:has-text("+ Seria")');
  50  |     
  51  |     await weightInputs[1].fill('60');
  52  |     await repsInputs[1].fill('15');
  53  |     await addSetBtns[1].click();
  54  |     await weightInputs[1].fill('65');
  55  |     await repsInputs[1].fill('12');
  56  |     await addSetBtns[1].click();
  57  |     await weightInputs[1].fill('70');
  58  |     await repsInputs[1].fill('10');
  59  |     await addSetBtns[1].click();
  60  | 
  61  |     // Add third exercise
  62  |     await page.click('text=Dodaj kolejne ćwiczenie');
  63  |     await page.waitForTimeout(500);
  64  | 
  65  |     // --- Exercise 3: Triceps ---
  66  |     const exInputs3 = await page.$$('.exercise-name-input');
  67  |     await exInputs3[2].fill('Francuskie wyciskanie (Triceps)');
  68  | 
  69  |     const weightInputs3 = await page.$$('input[placeholder="kg"]');
  70  |     const repsInputs3 = await page.$$('input[placeholder="powt"]');
  71  |     const addSetBtns3 = await page.$$('button:has-text("+ Seria")');
  72  | 
  73  |     await weightInputs3[2].fill('30');
  74  |     await repsInputs3[2].fill('15');
  75  |     await addSetBtns3[2].click();
  76  |     await weightInputs3[2].fill('35');
  77  |     await repsInputs3[2].fill('12');
  78  |     await addSetBtns3[2].click();
  79  |     await weightInputs3[2].fill('40');
  80  |     await repsInputs3[2].fill('10');
  81  |     await addSetBtns3[2].click();
  82  | 
  83  |     // Finish training
  84  |     page.on('dialog', dialog => dialog.accept());
  85  |     await page.click('text=Zakończ i Zapisz Trening');
  86  | 
  87  |     // Go to History tab
  88  |     const isBurgerVisible = await page.isVisible('.menu-toggle');
  89  |     if (isBurgerVisible) {
  90  |         await page.click('.menu-toggle');
  91  |         await page.click('.nav-links >> text=Historia Treningów');
  92  |     } else {
  93  |         await page.click('nav >> text=Historia Treningów');
  94  |     }
  95  | 
  96  |     // Wait for history to load
  97  |     await page.waitForTimeout(1000);
  98  | 
  99  |     // Assert that the training is in history
  100 |     await expect(page.locator('text=Trening siłowy').first()).toBeVisible();
  101 | 
  102 |     // Expand details
  103 |     await page.locator('text=▼').first().click();
  104 | 
  105 |     // Verify details are shown
  106 |     await expect(page.locator('text=Szczegóły ćwiczeń:').first()).toBeVisible();
  107 |     await expect(page.locator('text=Wyciskanie sztangi leżąc').first()).toBeVisible();
  108 |     await expect(page.locator('text=Wyciskanie skośne').first()).toBeVisible();
  109 |     await expect(page.locator('text=Francuskie wyciskanie (Triceps)').first()).toBeVisible();
  110 |   });
  111 | });
```