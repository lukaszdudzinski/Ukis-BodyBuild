# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/trainingHistory.spec.js >> Training and History Flow >> powinien poprawnie wyświetlać Blok Łączony w oknie modalnym historii
- Location: tests/e2e/trainingHistory.spec.js:95:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#history-dashboard').getByText('Trening z superserią test 1789722396384').first()
    - locator resolved to <strong>Trening z superserią test 1789722396384</strong>
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
    53 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div id="changelog-modal-overlay">…</div> intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - generic [ref=f1e2]:
    - main [ref=f1e3]:
      - generic [ref=f1e5]:
        - generic [ref=f1e6]:
          - heading "Historia Treningów" [level=2] [ref=f1e7]
          - paragraph [ref=f1e8]: Rozwiń, by zobaczyć szczegóły
        - generic [ref=f1e9]:
          - generic [ref=f1e10]: Importuj trening
          - generic [ref=f1e15]:
            - heading "wrzesień 2026" [level=3] [ref=f1e16]
            - generic [ref=f1e31] [cursor=pointer]:
              - strong [ref=f1e32]: Trening z superserią test 1789722396384
              - text: 1 ćwiczeń • 0 kg
    - generic [ref=f1e36]:
      - generic [ref=f1e37] [cursor=pointer]: Menu
      - generic [ref=f1e43] [cursor=pointer]: Trening
      - generic [ref=f1e54] [cursor=pointer]: Profil
      - generic [ref=f1e60] [cursor=pointer]: Serwis
  - generic [ref=f1e66]:
    - generic [ref=f1e67]:
      - heading "Co nowego? 🚀" [level=3] [ref=f1e68]
      - button "×" [ref=f1e69] [cursor=pointer]
    - generic [ref=f1e72]:
      - heading "Wersja v2026.9.18.01 (2026-09-18)" [level=4] [ref=f1e73]
      - list [ref=f1e74]:
        - listitem [ref=f1e75]: "🐞 HOTFIX: Naprawiono wszystkie testy Playwright E2E. Aktualizacja selektorów (Glassmorphism), likwidacja race conditions (Changelog i PWA) oraz fix czyszczenia bazy OPFS w trybie WebWorker."
  - button "🤖" [ref=f1e77] [cursor=pointer]
```

# Test source

```ts
  29  |     await page.locator('input[placeholder="Ciężar (kg)"]').nth(2).fill('90');
  30  |     await page.locator('input[placeholder="Powtórzenia"]').nth(2).fill('8');
  31  | 
  32  |     // Add another exercise
  33  |     await page.click('#add-exercise-to-plan-btn');
  34  |     await page.waitForTimeout(500);
  35  | 
  36  |     // --- Exercise 2: Wyciskanie skośne ---
  37  |     await page.locator('.exercise-name-input').nth(1).fill('Wyciskanie skośne');
  38  |     await page.keyboard.press('Enter');
  39  |     await page.waitForTimeout(200);
  40  |     
  41  |     const ex2AddSet = page.locator('text=+ Seria').nth(1);
  42  |     await ex2AddSet.click();
  43  |     await page.locator('input[placeholder="Ciężar (kg)"]').nth(3).fill('60');
  44  |     await page.locator('input[placeholder="Powtórzenia"]').nth(3).fill('15');
  45  | 
  46  |     await ex2AddSet.click();
  47  |     await page.locator('input[placeholder="Ciężar (kg)"]').nth(4).fill('65');
  48  |     await page.locator('input[placeholder="Powtórzenia"]').nth(4).fill('12');
  49  | 
  50  |     await ex2AddSet.click();
  51  |     await page.locator('input[placeholder="Ciężar (kg)"]').nth(5).fill('70');
  52  |     await page.locator('input[placeholder="Powtórzenia"]').nth(5).fill('10');
  53  | 
  54  |     // Add third exercise
  55  |     await page.click('#add-exercise-to-plan-btn');
  56  |     await page.waitForTimeout(500);
  57  | 
  58  |     // --- Exercise 3: Triceps ---
  59  |     await page.locator('.exercise-name-input').nth(2).fill('Francuskie wyciskanie (Triceps)');
  60  |     await page.keyboard.press('Enter');
  61  |     await page.waitForTimeout(200);
  62  |     
  63  |     const ex3AddSet = page.locator('text=+ Seria').nth(2);
  64  |     await ex3AddSet.click();
  65  |     await page.locator('input[placeholder="Ciężar (kg)"]').nth(6).fill('30');
  66  |     await page.locator('input[placeholder="Powtórzenia"]').nth(6).fill('15');
  67  | 
  68  |     await ex3AddSet.click();
  69  |     await page.locator('input[placeholder="Ciężar (kg)"]').nth(7).fill('35');
  70  |     await page.locator('input[placeholder="Powtórzenia"]').nth(7).fill('12');
  71  | 
  72  |     await ex3AddSet.click();
  73  |     await page.locator('input[placeholder="Ciężar (kg)"]').nth(8).fill('40');
  74  |     await page.locator('input[placeholder="Powtórzenia"]').nth(8).fill('10');
  75  | 
  76  |     // Finish training
  77  |     page.on('dialog', dialog => dialog.accept());
  78  |     await page.click('#finish-training-btn');
  79  |     await expect(page.locator('#training-calendar-view')).toBeVisible({ timeout: 5000 });
  80  | 
  81  |     // Go to History tab
  82  |     await page.evaluate(() => window.switchTab('history-dashboard'));
  83  |     await page.waitForTimeout(1000);
  84  | 
  85  |     // Assert that the training is in history
  86  |     await expect(page.locator('#history-dashboard >> text=Trening siłowy test').first()).toBeVisible();
  87  |     await page.locator('text=▼').first().click();
  88  | 
  89  |     // Verify details are shown
  90  |     await expect(page.locator('text=Wyciskanie sztangi leżąc').first()).toBeVisible();
  91  |     await expect(page.locator('text=Wyciskanie skośne').first()).toBeVisible();
  92  |     await expect(page.locator('text=Francuskie wyciskanie (Triceps)').first()).toBeVisible();
  93  |   });
  94  | 
  95  |   test('powinien poprawnie wyświetlać Blok Łączony w oknie modalnym historii', async ({ page }) => {
  96  |     // Unique name to avoid conflicts across retries
  97  |     const uniqueName = "Trening z superserią test " + Date.now();
  98  |     
  99  |     await page.evaluate(async (name) => {
  100 |         const today = new Date().toISOString().split('T')[0];
  101 |         await window.DatabaseManager.addTraining({
  102 |             date: today,
  103 |             name: name,
  104 |             duration_seconds: 3600,
  105 |             type: "strength",
  106 |             exercises: [
  107 |                 {
  108 |                     id: "sup1",
  109 |                     type: "superset",
  110 |                     name: "",
  111 |                     exercises: [
  112 |                         { id: "s1", type: "strength", name: "Biceps", sets: [{weight: 10, reps: 10}] },
  113 |                         { id: "s2", type: "strength", name: "Triceps", sets: [{weight: 15, reps: 10}] }
  114 |                     ]
  115 |                 }
  116 |             ]
  117 |         });
  118 |     }, uniqueName);
  119 | 
  120 |     await page.reload();
  121 |     await page.waitForTimeout(1000);
  122 | 
  123 |     // Idź do historii
  124 |     await page.evaluate(() => window.switchTab('history-dashboard'));
  125 |     await page.waitForSelector('#history-dashboard', { state: 'visible' });
  126 | 
  127 |     // Rozwiń trening z superserią
  128 |     await expect(page.locator('#history-dashboard').getByText(uniqueName).first()).toBeVisible();
> 129 |     await page.locator('#history-dashboard').getByText(uniqueName).first().click();
      |                                                                            ^ Error: locator.click: Test timeout of 30000ms exceeded.
  130 | 
  131 |     // Sprawdź czy jest Blok Łączony i nie ma "Nieznane ćwiczenie"
  132 |     await expect(page.locator('text=Blok Łączony (Superseria)').first()).toBeVisible();
  133 |     await expect(page.locator('text=Biceps').first()).toBeVisible();
  134 |     await expect(page.locator('text=Triceps').first()).toBeVisible();
  135 |     await expect(page.locator('text=Nieznane ćwiczenie')).toHaveCount(0);
  136 |   });
  137 | });
  138 | 
```