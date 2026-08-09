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
  - waiting for locator('#start-new-training-btn')

```

# Page snapshot

```yaml
- generic [ref=f1e1]:
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
          - link "Trening" [active] [ref=f1e13] [cursor=pointer]:
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
        - generic [ref=f1e26]: v.2026.8.9.11
    - main [ref=f1e27]:
      - generic [ref=f1e29]:
        - generic [ref=f1e30]:
          - heading "Trening" [level=2] [ref=f1e31]
          - paragraph [ref=f1e32]: Zaplanuj i wykonuj treningi
        - generic [ref=f1e33]:
          - generic [ref=f1e34]:
            - button "◀" [ref=f1e35] [cursor=pointer]
            - heading "Sierpień 2026" [level=3] [ref=f1e36]
            - button "▶" [ref=f1e37] [cursor=pointer]
          - generic [ref=f1e38]:
            - generic [ref=f1e39]: Pn
            - generic [ref=f1e40]: Wt
            - generic [ref=f1e41]: Śr
            - generic [ref=f1e42]: Cz
            - generic [ref=f1e43]: Pt
            - generic [ref=f1e44]: So
            - generic [ref=f1e45]: Nd
            - generic [ref=f1e46] [cursor=pointer]: "1"
            - generic [ref=f1e47] [cursor=pointer]: "2"
            - generic [ref=f1e48] [cursor=pointer]: "3"
            - generic [ref=f1e49] [cursor=pointer]: "4"
            - generic [ref=f1e50] [cursor=pointer]: "5"
            - generic [ref=f1e51] [cursor=pointer]: "6"
            - generic [ref=f1e52] [cursor=pointer]: "7"
            - generic [ref=f1e53] [cursor=pointer]: "8"
            - generic [ref=f1e54] [cursor=pointer]: "9"
            - generic [ref=f1e55] [cursor=pointer]: "10"
            - generic [ref=f1e56] [cursor=pointer]: "11"
            - generic [ref=f1e57] [cursor=pointer]: "12"
            - generic [ref=f1e58] [cursor=pointer]: "13"
            - generic [ref=f1e59] [cursor=pointer]: "14"
            - generic [ref=f1e60] [cursor=pointer]: "15"
            - generic [ref=f1e61] [cursor=pointer]: "16"
            - generic [ref=f1e62] [cursor=pointer]: "17"
            - generic [ref=f1e63] [cursor=pointer]: "18"
            - generic [ref=f1e64] [cursor=pointer]: "19"
            - generic [ref=f1e65] [cursor=pointer]: "20"
            - generic [ref=f1e66] [cursor=pointer]: "21"
            - generic [ref=f1e67] [cursor=pointer]: "22"
            - generic [ref=f1e68] [cursor=pointer]: "23"
            - generic [ref=f1e69] [cursor=pointer]: "24"
            - generic [ref=f1e70] [cursor=pointer]: "25"
            - generic [ref=f1e71] [cursor=pointer]: "26"
            - generic [ref=f1e72] [cursor=pointer]: "27"
            - generic [ref=f1e73] [cursor=pointer]: "28"
            - generic [ref=f1e74] [cursor=pointer]: "29"
            - generic [ref=f1e75] [cursor=pointer]: "30"
            - generic [ref=f1e76] [cursor=pointer]: "31"
          - generic [ref=f1e77]:
            - 'heading "Opcje dla: 2026-08-09" [level=4] [ref=f1e78]'
            - generic [ref=f1e79]:
              - button "➕ Dodaj nową sesję treningową" [ref=f1e80] [cursor=pointer]
              - button "📄 Załaduj z szablonu" [ref=f1e81] [cursor=pointer]
              - generic [ref=f1e82]:
                - heading "📋 Skopiuj sesję treningową:" [level=5] [ref=f1e83]
                - paragraph [ref=f1e84]: Brak sesji w historii do skopiowania.
  - text: ✕
  - button "🤖" [ref=f1e85] [cursor=pointer]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Training Save Bug', () => {
  4  |   test('should save training with 4 dropsets and a superset', async ({ page }) => {
  5  |     // Zresetuj localStorage żeby pominąć onboarding jeśli jest
  6  |     await page.addInitScript(() => {
  7  |       window.localStorage.setItem('tutorial_global_v22', 'true');
  8  |       window.localStorage.setItem('userNick', 'Test');
  9  |     });
  10 | 
  11 |     // 1. Otwarcie aplikacji
  12 |     await page.goto('http://localhost:8080');
  13 | 
  14 |     // Wejście w trening
  15 |     await page.click('a[data-tab="training-dashboard"]');
  16 |     
  17 |     // Rozpoczęcie nowego treningu
> 18 |     await page.click('#start-new-training-btn');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  19 |     
  20 |     // Dodanie nazwy ćwiczenia dla pierwszego
  21 |     await page.fill('.exercise-name-input', 'Wyciskanie');
  22 |     
  23 |     // Wpisanie wagi i powt dla pierwszej serii (normalnej)
  24 |     const weightInputs = await page.$$('input[id^="weight-"]');
  25 |     const repsInputs = await page.$$('input[id^="reps-"]');
  26 |     
  27 |     await weightInputs[0].fill('100');
  28 |     await repsInputs[0].fill('10');
  29 |     await page.click('button:has-text("+ Seria")');
  30 |     
  31 |     // Dodanie 4 dropsetów
  32 |     for(let i = 0; i < 4; i++) {
  33 |       await weightInputs[0].fill((90 - i*10).toString());
  34 |       await repsInputs[0].fill('8');
  35 |       await page.click('button:has-text("🔥 Dropset")');
  36 |     }
  37 |     
  38 |     // Dodanie superserii
  39 |     await page.click('#add-superset-to-plan-btn');
  40 |     
  41 |     // Zakończenie i zapis
  42 |     // Akceptacja alertu (confirm) i ewentualnego alertu sukcesu
  43 |     page.on('dialog', async dialog => {
  44 |       await dialog.accept();
  45 |     });
  46 |     
  47 |     await page.click('#finish-training-btn');
  48 |     
  49 |     // Weryfikacja że przeszło (zobaczymy widok kalendarza i historii)
  50 |     await expect(page.locator('#training-calendar-view')).toBeVisible({ timeout: 5000 });
  51 |   });
  52 | });
  53 | 
```