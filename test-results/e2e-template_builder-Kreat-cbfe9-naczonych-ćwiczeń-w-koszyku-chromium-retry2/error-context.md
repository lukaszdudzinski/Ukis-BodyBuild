# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/template_builder.spec.js >> Kreator Szablonów - Zastosuj do zaznaczonych >> Powinien zmieniać serie tylko dla zaznaczonych ćwiczeń w koszyku
- Location: tests/e2e/template_builder.spec.js:4:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#template-builder-dashboard') to be visible
    61 × locator resolved to hidden <div class="tab-content active-tab" id="template-builder-dashboard">↵                </div>

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - main [ref=e3]
    - generic [ref=e5]:
      - generic [ref=e6] [cursor=pointer]: Menu
      - generic [ref=e12] [cursor=pointer]: Trening
      - generic [ref=e23] [cursor=pointer]: Profil
      - generic [ref=e29] [cursor=pointer]: Serwis
  - generic [ref=e35]:
    - generic [ref=e36]:
      - heading "Co nowego? 🚀" [level=3] [ref=e37]
      - button "×" [ref=e38] [cursor=pointer]
    - generic [ref=e41]:
      - heading "Wersja v2026.9.18.01 (2026-09-18)" [level=4] [ref=e42]
      - list [ref=e43]:
        - listitem [ref=e44]: "🐞 HOTFIX: Naprawiono wszystkie testy Playwright E2E. Aktualizacja selektorów (Glassmorphism), likwidacja race conditions (Changelog i PWA) oraz fix czyszczenia bazy OPFS w trybie WebWorker."
  - button "🤖" [ref=e46] [cursor=pointer]
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
> 12 |         await page.waitForSelector('#template-builder-dashboard', { state: 'visible' });
     |                    ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
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