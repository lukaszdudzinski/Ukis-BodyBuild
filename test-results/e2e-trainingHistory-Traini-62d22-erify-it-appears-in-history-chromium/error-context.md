# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/trainingHistory.spec.js >> Training and History Flow >> should create a training session and verify it appears in history
- Location: tests/e2e/trainingHistory.spec.js:10:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Dodaj nową sesję treningową')
    - locator resolved to <button id="start-new-session-btn" class="action-button pulse">…</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <li>✨ Poprawki UX: modal szablonów glassmorphism, pop…</li> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting for element to be visible, enabled and stable
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
      - <li>✨ Poprawki UX: modal szablonów glassmorphism, pop…</li> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    13 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <li>✨ Poprawki UX: modal szablonów glassmorphism, pop…</li> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div id="changelog-modal-overlay">…</div> intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <li>✨ Poprawki UX: modal szablonów glassmorphism, pop…</li> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <li>✨ Poprawki UX: modal szablonów glassmorphism, pop…</li> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <li>✨ Poprawki UX: modal szablonów glassmorphism, pop…</li> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div id="changelog-modal-overlay">…</div> intercepts pointer events
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <li>✨ Poprawki UX: modal szablonów glassmorphism, pop…</li> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - main [ref=e3]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - heading "Trening" [level=2] [ref=e7]
          - paragraph [ref=e8]: Zaplanuj i wykonuj treningi
        - generic [ref=e9]:
          - generic [ref=e10]:
            - button "◀" [ref=e11] [cursor=pointer]
            - heading "Wrzesień 2026" [level=3] [ref=e12]
            - button "▶" [ref=e13] [cursor=pointer]
          - generic [ref=e14]:
            - generic [ref=e15]: Pn
            - generic [ref=e16]: Wt
            - generic [ref=e17]: Śr
            - generic [ref=e18]: Cz
            - generic [ref=e19]: Pt
            - generic [ref=e20]: So
            - generic [ref=e21]: Nd
            - generic [ref=e22] [cursor=pointer]: "1"
            - generic [ref=e23] [cursor=pointer]: "2"
            - generic [ref=e24] [cursor=pointer]: "3"
            - generic [ref=e25] [cursor=pointer]: "4"
            - generic [ref=e26] [cursor=pointer]: "5"
            - generic [ref=e27] [cursor=pointer]: "6"
            - generic [ref=e28] [cursor=pointer]: "7"
            - generic [ref=e29] [cursor=pointer]: "8"
            - generic [ref=e30] [cursor=pointer]: "9"
            - generic [ref=e31] [cursor=pointer]: "10"
            - generic [ref=e32] [cursor=pointer]: "11"
            - generic [ref=e33] [cursor=pointer]: "12"
            - generic [ref=e34] [cursor=pointer]: "13"
            - generic [ref=e35] [cursor=pointer]: "14"
            - generic [ref=e36] [cursor=pointer]: "15"
            - generic [ref=e37] [cursor=pointer]: "16"
            - generic [ref=e38] [cursor=pointer]: "17"
            - generic [ref=e39] [cursor=pointer]: "18"
            - generic [ref=e40] [cursor=pointer]: "19"
            - generic [ref=e41] [cursor=pointer]: "20"
            - generic [ref=e42] [cursor=pointer]: "21"
            - generic [ref=e43] [cursor=pointer]: "22"
            - generic [ref=e44] [cursor=pointer]: "23"
            - generic [ref=e45] [cursor=pointer]: "24"
            - generic [ref=e46] [cursor=pointer]: "25"
            - generic [ref=e47] [cursor=pointer]: "26"
            - generic [ref=e48] [cursor=pointer]: "27"
            - generic [ref=e49] [cursor=pointer]: "28"
            - generic [ref=e50] [cursor=pointer]: "29"
            - generic [ref=e51] [cursor=pointer]: "30"
          - generic [ref=e52]:
            - 'heading "Opcje dla: 2026-09-18" [level=4] [ref=e53]'
            - generic [ref=e54]:
              - button "Dodaj nową sesję treningową" [ref=e55] [cursor=pointer]
              - button "Wybierz Szablon Treningowy" [ref=e57] [cursor=pointer]
              - button "Kreator Szablonów (Koszyk)" [ref=e61] [cursor=pointer]
              - generic [ref=e64]:
                - heading "Ostatnie treningi (wybierz, aby skopiować na dziś):" [level=5] [ref=e65]
                - paragraph [ref=e69]: Brak sesji w historii do skopiowania.
          - generic [ref=e70]:
            - generic [ref=e71]: Wykonany
            - generic [ref=e73]: Zaplanowany
            - generic [ref=e75]: Pominięty
    - generic [ref=e77]:
      - generic [ref=e78] [cursor=pointer]: Menu
      - generic [ref=e84] [cursor=pointer]: Trening
      - generic [ref=e95] [cursor=pointer]: Profil
      - generic [ref=e101] [cursor=pointer]: Serwis
  - generic [ref=e107]:
    - generic [ref=e108]:
      - heading "Co nowego? 🚀" [level=3] [ref=e109]
      - button "×" [ref=e110] [cursor=pointer]
    - generic [ref=e112]:
      - generic [ref=e113]:
        - heading "Wersja v2026.9.18.03 (2026-09-18)" [level=4] [ref=e114]
        - list [ref=e115]:
          - listitem [ref=e116]: "✨ Poprawki UX: Usunięcie emotikon z opcji kalendarza (Podgląd, Kontynuuj, Usuń), naprawa tapet w Ustawieniach na glassmorphism"
      - generic [ref=e117]:
        - heading "Wersja v2026.9.18.02 (2026-09-18)" [level=4] [ref=e118]
        - list [ref=e119]:
          - listitem [ref=e120]: "✨ Poprawki UX: modal szablonów glassmorphism, poprawny SVG hantla, owijanie nazw ćwiczeń, widoczność przycisku Pauza"
      - generic [ref=e121]:
        - heading "Wersja v2026.9.18.01 (2026-09-18)" [level=4] [ref=e122]
        - list [ref=e123]:
          - listitem [ref=e124]: "🐞 HOTFIX: Naprawiono wszystkie testy Playwright E2E. Aktualizacja selektorów (Glassmorphism), likwidacja race conditions (Changelog i PWA) oraz fix czyszczenia bazy OPFS w trybie WebWorker."
  - button "🤖" [ref=e126] [cursor=pointer]
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | test.describe('Training and History Flow', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02'); });
  6   |     await page.goto('/');
  7   |     await page.waitForTimeout(1000);
  8   |   });
  9   | 
  10  |   test('should create a training session and verify it appears in history', async ({ page }) => {
  11  |     await page.evaluate(() => window.switchTab('training-dashboard'));
> 12  |     await page.click('text=Dodaj nową sesję treningową');
      |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  13  |     await page.fill('#training-name-input', 'Trening siłowy test');
  14  |     await page.waitForTimeout(500);
  15  | 
  16  |     // --- Exercise 1: Wyciskanie ---
  17  |     await page.fill('.exercise-name-input', 'Wyciskanie sztangi leżąc');
  18  |     await page.keyboard.press('Enter');
  19  |     await page.waitForTimeout(200);
  20  |     await page.click('text=+ Seria');
  21  |     await page.locator('input[placeholder="Ciężar (kg)"]').nth(0).fill('80');
  22  |     await page.locator('input[placeholder="Powtórzenia"]').nth(0).fill('12');
  23  |     
  24  |     await page.click('text=+ Seria');
  25  |     await page.locator('input[placeholder="Ciężar (kg)"]').nth(1).fill('85');
  26  |     await page.locator('input[placeholder="Powtórzenia"]').nth(1).fill('10');
  27  | 
  28  |     await page.click('text=+ Seria');
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
```