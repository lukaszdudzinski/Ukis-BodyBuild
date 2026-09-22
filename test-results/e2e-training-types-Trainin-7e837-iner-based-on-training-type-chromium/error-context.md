# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/training-types.spec.js >> Training Types UI >> should show and hide exercises container based on training type
- Location: tests/e2e/training-types.spec.js:4:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#start-new-session-btn')
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
            - 'heading "Opcje dla: 2026-08-15" [level=4] [ref=e53]'
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
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Training Types UI', () => {
  4  |   test('should show and hide exercises container based on training type', async ({ page }) => {
  5  |     await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02');  });
  6  |     await page.goto('/');
  7  |     await page.waitForTimeout(1000);
  8  | 
  9  |     await page.evaluate(() => window.switchTab('training-dashboard'));
  10 |     await page.waitForSelector('#training-calendar-view', { state: 'visible' });
  11 |     await page.evaluate(() => window.TrainingUI.handleDayClick('2026-08-15'));
> 12 |     await page.click('#start-new-session-btn');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  13 |     await page.waitForSelector('#active-training-view', { state: 'visible' });
  14 | 
  15 |     const exercisesSection = page.locator('#exercises-container-section');
  16 |     await expect(exercisesSection).toBeVisible();
  17 |     
  18 |     const classContainer = page.locator('#class-type-container');
  19 |     await expect(classContainer).toBeHidden();
  20 | 
  21 |     await page.selectOption('#training-type-select', 'cardio');
  22 |     await expect(exercisesSection).toBeHidden();
  23 |     await expect(classContainer).toBeHidden();
  24 | 
  25 |     await page.selectOption('#training-type-select', 'class');
  26 |     await expect(exercisesSection).toBeHidden();
  27 |     await expect(classContainer).toBeVisible();
  28 |   });
  29 | 
  30 |   test('powinien przełączać typ ćwiczenia w pętli 3-stanowej (Siłowy -> Cardio -> Zajęcia)', async ({ page }) => {
  31 |     await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02'); });
  32 |     await page.goto('/');
  33 |     await page.waitForTimeout(1000);
  34 | 
  35 |     await page.evaluate(() => window.switchTab('training-dashboard'));
  36 |     await page.waitForSelector('#training-calendar-view', { state: 'visible' });
  37 |     await page.evaluate(() => window.TrainingUI.handleDayClick('2026-08-15'));
  38 |     await page.click('#start-new-session-btn');
  39 |     await page.waitForSelector('#active-training-view', { state: 'visible' });
  40 | 
  41 |     await page.click('#add-exercise-to-plan-btn');
  42 | 
  43 |     // Button ma teraz SVG i text "Siłowy", "Cardio", "Zajęcia"
  44 |     // Atrybut onclick="window.TrainingUI.toggleExerciseType(...)"
  45 |     const toggleBtn = page.locator('button[onclick*="toggleExerciseType"]').first();
  46 |     await expect(toggleBtn).toBeVisible();
  47 | 
  48 |     await expect(toggleBtn).toContainText('Siłowy');
  49 | 
  50 |     await toggleBtn.click();
  51 |     await expect(toggleBtn).toContainText('Cardio');
  52 | 
  53 |     await toggleBtn.click();
  54 |     await expect(toggleBtn).toContainText('Zajęcia');
  55 | 
  56 |     await toggleBtn.click();
  57 |     await expect(toggleBtn).toContainText('Siłowy');
  58 |   });
  59 | });
  60 | 
```