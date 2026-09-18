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
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#template-builder-dashboard button:has-text("Zapisz")')
    - locator resolved to <button onclick="TemplateBuilderUI.saveTemplate()">…</button>
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
    55 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div id="changelog-modal-overlay">…</div> intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - main [ref=e3]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - generic [ref=e7]:
            - heading "Kreator Planu (Koszyk)" [level=2] [ref=e8]
            - button "×" [ref=e9] [cursor=pointer]
          - generic [ref=e10]:
            - textbox "Nazwa Planu (np. Push Dół)" [active] [ref=e11]: Zaktualizowany Szablon
            - button "Zapisz" [ref=e12] [cursor=pointer]
        - generic [ref=e17]:
          - generic [ref=e18]:
            - generic [ref=e19]: Zastosuj do zaznaczonych (Możesz używać przecinków dla piramid!)
            - generic [ref=e22]: "Przykład: wpisz 3 serie, Powt: 12,10,8, Kg: 100,110,120"
            - spinbutton "Serie" [ref=e23]
            - generic [ref=e24]: x
            - textbox "Powt." [ref=e25]
            - generic [ref=e26]: "@"
            - textbox "Kg" [ref=e27]
            - button "Ustaw" [ref=e28] [cursor=pointer]
          - generic [ref=e29]:
            - heading "Twoje ćwiczenia" [level=4] [ref=e30]
            - button "Dodaj ćwiczenie" [ref=e31] [cursor=pointer]
          - generic [ref=e34]:
            - checkbox [ref=e36] [cursor=pointer]
            - generic [ref=e37]:
              - generic [ref=e38]: 1. Wyciskanie
              - generic [ref=e48]: "✓ Ustawiono: 1 serii (10 powt.) @ 50kg"
            - generic [ref=e49]:
              - generic [ref=e50]:
                - button [ref=e51] [cursor=pointer]
                - button [ref=e54] [cursor=pointer]
              - button [ref=e57] [cursor=pointer]
    - generic [ref=e61]:
      - generic [ref=e62] [cursor=pointer]: Menu
      - generic [ref=e68] [cursor=pointer]: Trening
      - generic [ref=e79] [cursor=pointer]: Profil
      - generic [ref=e85] [cursor=pointer]: Serwis
  - generic [ref=e91]:
    - generic [ref=e92]:
      - heading "Co nowego? 🚀" [level=3] [ref=e93]
      - button "×" [ref=e94] [cursor=pointer]
    - generic [ref=e97]:
      - heading "Wersja v2026.9.18.01 (2026-09-18)" [level=4] [ref=e98]
      - list [ref=e99]:
        - listitem [ref=e100]: "🐞 HOTFIX: Naprawiono wszystkie testy Playwright E2E. Aktualizacja selektorów (Glassmorphism), likwidacja race conditions (Changelog i PWA) oraz fix czyszczenia bazy OPFS w trybie WebWorker."
  - button "🤖" [ref=e102] [cursor=pointer]
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
  77 |         await page.waitForSelector('#template-builder-dashboard', { state: 'visible' });
  78 | 
  79 |         const nameInput = page.locator('#builder-template-name');
  80 |         await expect(nameInput).toHaveValue('Stary Szablon do Edycji');
  81 | 
  82 |         await nameInput.fill('Zaktualizowany Szablon');
  83 | 
  84 |         page.once('dialog', dialog => dialog.accept());
  85 |         
> 86 |         await page.click('#template-builder-dashboard button:has-text("Zapisz")');
     |                    ^ Error: page.click: Test timeout of 30000ms exceeded.
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