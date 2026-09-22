# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/template_builder.spec.js >> Kreator Szablonów - Zastosuj do zaznaczonych >> Powinien edytować i nadpisywać istniejący szablon bez tworzenia klonu
- Location: tests/e2e/template_builder.spec.js:43:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#template-builder-dashboard') to be visible
    61 × locator resolved to hidden <div class="tab-content" id="template-builder-dashboard">↵                </div>

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
  - generic [ref=e128]:
    - generic [ref=e129]:
      - generic [ref=e130]:
        - heading "Szablony Planów Treningowych" [level=3] [ref=e131]
        - paragraph [ref=e132]: "Wybierz zapisany plan by rozpocząć sesję:"
        - button "Importuj z JSON" [ref=e133] [cursor=pointer]
      - button "×" [ref=e137] [cursor=pointer]
    - generic [ref=e139]:
      - generic [ref=e140]:
        - strong [ref=e141]: Stary Szablon do Edycji
        - button "Eksport" [ref=e142] [cursor=pointer]
      - generic [ref=e146]: "Typ: Trening Siłowy Ilość ćwiczeń w treningu: 1"
      - generic [ref=e147]:
        - button "Wybierz" [ref=e148] [cursor=pointer]
        - generic [ref=e151]:
          - button "Edytuj" [ref=e152] [cursor=pointer]
          - button "Usuń" [ref=e156] [cursor=pointer]
      - generic [ref=e160]:
        - generic [ref=e161]: "Automatyczny Harmonogram w Kalendarzu:"
        - button "Pn" [ref=e164] [cursor=pointer]
        - button "Wt" [ref=e165] [cursor=pointer]
        - button "Śr" [ref=e166] [cursor=pointer]
        - button "Czw" [ref=e167] [cursor=pointer]
        - button "Pt" [ref=e168] [cursor=pointer]
        - button "Sb" [ref=e169] [cursor=pointer]
        - button "Nd" [ref=e170] [cursor=pointer]
    - button "Zamknij" [ref=e172] [cursor=pointer]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Kreator Szablonów - Zastosuj do zaznaczonych', () => {
  4  |     test('Powinien zmieniać serie tylko dla zaznaczonych ćwiczeń w koszyku', async ({ page }) => {
  5  |         await page.addInitScript(() => { 
  6  |             window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02'); 
  7  |         });
  8  |         await page.goto('/');
  9  |     await page.waitForTimeout(1000);
  10 | 
  11 |         await page.evaluate(() => window.switchTab('template-builder-dashboard'));
  12 |         await page.waitForSelector('#template-builder-dashboard', { state: 'visible' });
  13 | 
  14 |         for(let i=1; i<=3; i++) {
  15 |             await page.evaluate(() => window.TemplateBuilderUI.openCatalogModal());
  16 |             await page.waitForTimeout(300);
  17 |             await page.fill('#builder-custom-name', `Cwiczenie Testowe ${i}`);
  18 |             await page.click('button:has-text("Dodaj")');
  19 |         }
  20 | 
  21 |         const cartItems = page.locator('.cart-item');
  22 |         await expect(cartItems).toHaveCount(3);
  23 | 
  24 |         const checkboxes = page.locator('.mass-edit-checkbox');
  25 |         await checkboxes.nth(1).uncheck();
  26 | 
  27 |         await page.fill('#builder-mass-sets', '4');
  28 |         await page.fill('#builder-mass-reps', '10');
  29 |         await page.fill('#builder-mass-weight', '20');
  30 |         
  31 |         await page.click('button:has-text("Ustaw")');
  32 | 
  33 |         const ex1Desc = await cartItems.nth(0).innerText();
  34 |         expect(ex1Desc).toContain('4 serii');
  35 | 
  36 |         const ex2Desc = await cartItems.nth(1).innerText();
  37 |         expect(ex2Desc).toContain('Brak ustawionych serii');
  38 | 
  39 |         const ex3Desc = await cartItems.nth(2).innerText();
  40 |         expect(ex3Desc).toContain('4 serii');
  41 |     });
  42 | 
  43 |     test('Powinien edytować i nadpisywać istniejący szablon bez tworzenia klonu', async ({ page }) => {
  44 |         await page.addInitScript(() => {
  45 |             window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02');
  46 |             window.localStorage.setItem('uki_workout_templates', JSON.stringify([{
  47 |                 id: 123456789,
  48 |                 name: "Stary Szablon do Edycji",
  49 |                 type: "strength",
  50 |                 exercises: [{
  51 |                     name: "Wyciskanie",
  52 |                     type: "strength",
  53 |                     sets: [{reps: "10", weight: "50", completed: false}]
  54 |                 }]
  55 |             }]));
  56 |         });
  57 | 
  58 |         await page.goto('/');
  59 |     await page.waitForTimeout(1000);
  60 |         
  61 |         await page.evaluate(() => {
  62 |             window.switchTab('training-dashboard');
  63 |         });
  64 |         await page.waitForSelector('#training-calendar-view', { state: 'visible' });
  65 | 
  66 |         await page.evaluate(() => {
  67 |             window.TrainingUI.loadTemplatesDialog();
  68 |         });
  69 |         await page.waitForSelector('#templates-modal-overlay', { state: 'visible' });
  70 | 
  71 |         await page.evaluate(() => {
  72 |             const buttons = Array.from(document.querySelectorAll('button'));
  73 |             const editBtn = buttons.find(b => b.textContent.includes('✏️ Edytuj'));
  74 |             if(editBtn) editBtn.click();
  75 |         });
  76 | 
> 77 |         await page.waitForSelector('#template-builder-dashboard', { state: 'visible' });
     |                    ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  78 | 
  79 |         const nameInput = page.locator('#builder-template-name');
  80 |         await expect(nameInput).toHaveValue('Stary Szablon do Edycji');
  81 | 
  82 |         await nameInput.fill('Zaktualizowany Szablon');
  83 | 
  84 |         page.once('dialog', dialog => dialog.accept());
  85 |         
  86 |         await page.click('#template-builder-dashboard button:has-text("Zapisz")');
  87 | 
  88 |         const templatesStr = await page.evaluate(() => window.localStorage.getItem('uki_workout_templates'));
  89 |         const templates = JSON.parse(templatesStr);
  90 | 
  91 |         expect(templates.length).toBe(1);
  92 |         expect(templates[0].id).toBe(123456789);
  93 |         expect(templates[0].name).toBe('Zaktualizowany Szablon');
  94 |     });
  95 | });
  96 | 
```