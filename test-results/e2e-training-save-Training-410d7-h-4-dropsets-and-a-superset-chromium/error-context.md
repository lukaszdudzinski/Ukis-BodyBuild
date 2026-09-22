# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/training-save.spec.js >> Training Save Bug >> should save training with 4 dropsets and a superset
- Location: tests/e2e/training-save.spec.js:4:3

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
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
      - waiting 100ms
    - waiting for element to be visible, enabled and stable
    - element is not stable
  13 × retrying click action
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
  3  | test.describe('Training Save Bug', () => {
  4  |   test('should save training with 4 dropsets and a superset', async ({ page }) => {
  5  |     // Zresetuj localStorage żeby pominąć onboarding jeśli jest
  6  |     await page.addInitScript(() => {
  7  |       window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02');
  8  |       
  9  |       window.localStorage.setItem('userNick', 'Test');
  10 |     });
  11 | 
  12 |     // 1. Otwarcie aplikacji
  13 |     await page.goto('/');
  14 |     await page.waitForTimeout(1000);
  15 |     await page.waitForTimeout(1000); // Wait for app initialization
  16 | 
  17 |     // Wejście w trening
  18 |     await page.evaluate(() => window.switchTab('training-dashboard'));
  19 |     // Select day 15 first
  20 |     await page.evaluate(() => window.TrainingUI.handleDayClick('2026-08-15'));
  21 |     
  22 |     // Rozpoczęcie nowego treningu
> 23 |     await page.click('#start-new-session-btn');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  24 |     
  25 |     // Dodanie nazwy ćwiczenia dla pierwszego
  26 |     await page.fill('.exercise-name-input', 'Wyciskanie');
  27 |     
  28 |     // Wpisanie wagi i powt dla pierwszej serii (normalnej)
  29 |     const weightInputs = page.locator('input[placeholder="Ciężar (kg)"]');
  30 |     const repsInputs = page.locator('input[placeholder="Powtórzenia"]');
  31 |     
  32 |     await weightInputs.nth(0).fill('100');
  33 |     await repsInputs.nth(0).fill('10');
  34 |     await page.click('button:has-text("+ Seria")');
  35 |     
  36 |     // Dodanie 4 dropsetów
  37 |     for(let i = 0; i < 4; i++) {
  38 |       await weightInputs.nth(0).fill((90 - i*10).toString());
  39 |       await repsInputs.nth(0).fill('8');
  40 |       await page.click('button:has-text("+ Dropset")');
  41 |     }
  42 |     
  43 |     // Dodanie superserii
  44 |     await page.locator('button:has-text("Blok Łączony")').first().click();
  45 |     
  46 |     // Zakończenie i zapis
  47 |     // Akceptacja alertu (confirm) i ewentualnego alertu sukcesu
  48 |     page.on('dialog', async dialog => {
  49 |       await dialog.accept();
  50 |     });
  51 |     
  52 |     await page.click('#finish-training-btn');
  53 |     
  54 |     // Weryfikacja że przeszło (zobaczymy widok kalendarza i historii)
  55 |     await expect(page.locator('#training-calendar-view')).toBeVisible({ timeout: 5000 });
  56 |   });
  57 | });
  58 | 
```