# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/complex_training_save.spec.js >> Complex Training Save Flow >> should create a training with normal exercises and supersets, and save it to history
- Location: tests/e2e/complex_training_save.spec.js:14:3

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
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <li>🐞 HOTFIX: Naprawiono wszystkie testy Playwright E…</li> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
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
       - <li>🐞 HOTFIX: Naprawiono wszystkie testy Playwright E…</li> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
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
    - <li>🐞 HOTFIX: Naprawiono wszystkie testy Playwright E…</li> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
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
- generic [active]:
  - generic [ref=e1]:
    - main [ref=e2]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - heading "Trening" [level=2] [ref=e6]
          - paragraph [ref=e7]: Zaplanuj i wykonuj treningi
        - generic [ref=e8]:
          - generic [ref=e9]:
            - button "◀" [ref=e10] [cursor=pointer]
            - heading "Wrzesień 2026" [level=3] [ref=e11]
            - button "▶" [ref=e12] [cursor=pointer]
          - generic [ref=e13]:
            - generic [ref=e14]: Pn
            - generic [ref=e15]: Wt
            - generic [ref=e16]: Śr
            - generic [ref=e17]: Cz
            - generic [ref=e18]: Pt
            - generic [ref=e19]: So
            - generic [ref=e20]: Nd
            - generic [ref=e21] [cursor=pointer]: "1"
            - generic [ref=e22] [cursor=pointer]: "2"
            - generic [ref=e23] [cursor=pointer]: "3"
            - generic [ref=e24] [cursor=pointer]: "4"
            - generic [ref=e25] [cursor=pointer]: "5"
            - generic [ref=e26] [cursor=pointer]: "6"
            - generic [ref=e27] [cursor=pointer]: "7"
            - generic [ref=e28] [cursor=pointer]: "8"
            - generic [ref=e29] [cursor=pointer]: "9"
            - generic [ref=e30] [cursor=pointer]: "10"
            - generic [ref=e31] [cursor=pointer]: "11"
            - generic [ref=e32] [cursor=pointer]: "12"
            - generic [ref=e33] [cursor=pointer]: "13"
            - generic [ref=e34] [cursor=pointer]: "14"
            - generic [ref=e35] [cursor=pointer]: "15"
            - generic [ref=e36] [cursor=pointer]: "16"
            - generic [ref=e37] [cursor=pointer]: "17"
            - generic [ref=e38] [cursor=pointer]: "18"
            - generic [ref=e39] [cursor=pointer]: "19"
            - generic [ref=e40] [cursor=pointer]: "20"
            - generic [ref=e41] [cursor=pointer]: "21"
            - generic [ref=e42] [cursor=pointer]: "22"
            - generic [ref=e43] [cursor=pointer]: "23"
            - generic [ref=e44] [cursor=pointer]: "24"
            - generic [ref=e45] [cursor=pointer]: "25"
            - generic [ref=e46] [cursor=pointer]: "26"
            - generic [ref=e47] [cursor=pointer]: "27"
            - generic [ref=e48] [cursor=pointer]: "28"
            - generic [ref=e49] [cursor=pointer]: "29"
            - generic [ref=e50] [cursor=pointer]: "30"
          - generic [ref=e51]:
            - 'heading "Opcje dla: 2026-09-18" [level=4] [ref=e52]'
            - generic [ref=e53]:
              - button "Dodaj nową sesję treningową" [ref=e54] [cursor=pointer]
              - button "Wybierz Szablon Treningowy" [ref=e56] [cursor=pointer]
              - button "Kreator Szablonów (Koszyk)" [ref=e60] [cursor=pointer]
              - generic [ref=e63]:
                - heading "Ostatnie treningi (wybierz, aby skopiować na dziś):" [level=5] [ref=e64]
                - paragraph [ref=e68]: Brak sesji w historii do skopiowania.
          - generic [ref=e69]:
            - generic [ref=e70]: Wykonany
            - generic [ref=e72]: Zaplanowany
            - generic [ref=e74]: Pominięty
    - generic [ref=e76]:
      - generic [ref=e77] [cursor=pointer]: Menu
      - generic [ref=e83] [cursor=pointer]: Trening
      - generic [ref=e94] [cursor=pointer]: Profil
      - generic [ref=e100] [cursor=pointer]: Serwis
  - generic [ref=e106]:
    - generic [ref=e107]:
      - heading "Co nowego? 🚀" [level=3] [ref=e108]
      - button "×" [ref=e109] [cursor=pointer]
    - generic [ref=e111]:
      - generic [ref=e112]:
        - heading "Wersja v2026.9.18.03 (2026-09-18)" [level=4] [ref=e113]
        - list [ref=e114]:
          - listitem [ref=e115]: "✨ Poprawki UX: Usunięcie emotikon z opcji kalendarza (Podgląd, Kontynuuj, Usuń), naprawa tapet w Ustawieniach na glassmorphism"
      - generic [ref=e116]:
        - heading "Wersja v2026.9.18.02 (2026-09-18)" [level=4] [ref=e117]
        - list [ref=e118]:
          - listitem [ref=e119]: "✨ Poprawki UX: modal szablonów glassmorphism, poprawny SVG hantla, owijanie nazw ćwiczeń, widoczność przycisku Pauza"
      - generic [ref=e120]:
        - heading "Wersja v2026.9.18.01 (2026-09-18)" [level=4] [ref=e121]
        - list [ref=e122]:
          - listitem [ref=e123]: "🐞 HOTFIX: Naprawiono wszystkie testy Playwright E2E. Aktualizacja selektorów (Glassmorphism), likwidacja race conditions (Changelog i PWA) oraz fix czyszczenia bazy OPFS w trybie WebWorker."
  - button "🤖" [ref=e125] [cursor=pointer]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Complex Training Save Flow', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Mock the tutorial and changelog so they don't pop up and block the UI
  6  |     await page.addInitScript(() => {
  7  |         window.localStorage.setItem('tutorial_global_v22', 'true');
  8  |         window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02'); // Prevent Changelog from showing
  9  |     });
  10 |     await page.goto('/');
  11 |     await page.waitForTimeout(1000);
  12 |   });
  13 | 
  14 |   test('should create a training with normal exercises and supersets, and save it to history', async ({ page }) => {
  15 |     // Go to Training Tab
  16 |     await page.evaluate(() => window.switchTab('training-dashboard'));
  17 | 
  18 |     // Start a new session
> 19 |     await page.click('text=Dodaj nową sesję treningową');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  20 |     await page.waitForTimeout(500);
  21 | 
  22 |     // Set Name
  23 |     await page.fill('#training-name-input', 'Klatka triceps barki');
  24 | 
  25 |     // 1st Exercise: Klatka (Main)
  26 |     const exerciseInputs = page.locator('.exercise-name-input');
  27 |     await exerciseInputs.nth(0).fill('Wyciskanie klatki');
  28 |     await page.keyboard.press('Enter');
  29 |     await page.waitForTimeout(200);
  30 |     
  31 |     // Add 1 set
  32 |     await page.click('text=+ Seria');
  33 |     
  34 |     // Fill first set
  35 |     await page.locator('input[placeholder="Ciężar (kg)"]').nth(0).fill('50');
  36 |     await page.locator('input[placeholder="Powtórzenia"]').nth(0).fill('20');
  37 | 
  38 |     // 2nd Exercise: Wzno Klatka
  39 |     await page.click('#add-exercise-to-plan-btn');
  40 |     await page.waitForTimeout(500);
  41 |     await exerciseInputs.nth(1).fill('Wzno Klatka');
  42 |     await page.keyboard.press('Enter');
  43 |     await page.waitForTimeout(200);
  44 | 
  45 |     await page.locator('text=+ Seria').nth(1).click();
  46 |     await page.locator('input[placeholder="Ciężar (kg)"]').nth(1).fill('30');
  47 |     await page.locator('input[placeholder="Powtórzenia"]').nth(1).fill('10');
  48 | 
  49 |     // Finish training
  50 |     page.on('dialog', dialog => dialog.accept());
  51 |     await page.click('#finish-training-btn');
  52 | 
  53 |     // Wait for Calendar
  54 |     await expect(page.locator('#training-calendar-view')).toBeVisible({ timeout: 5000 });
  55 | 
  56 |     // Go to History tab
  57 |     await page.evaluate(() => window.switchTab('history-dashboard'));
  58 |     await page.waitForTimeout(1000);
  59 | 
  60 |     // Assert that the training is in history
  61 |     await expect(page.locator('#history-dashboard >> text=Klatka triceps barki').first()).toBeVisible();
  62 |   });
  63 | });
  64 | 
```