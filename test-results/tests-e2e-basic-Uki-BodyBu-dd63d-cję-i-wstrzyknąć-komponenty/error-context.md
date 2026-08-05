# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/e2e/basic.spec.js >> Uki BodyBuild E2E >> Powinien poprawnie załadować aplikację i wstrzyknąć komponenty
- Location: tests/e2e/basic.spec.js:5:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h2').filter({ hasText: 'Pomiary Ciała' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h2').filter({ hasText: 'Pomiary Ciała' })

```

```yaml
- navigation:
  - img "Logo"
  - heading "Uki's BodyBuild" [level=1]
  - list:
    - listitem:
      - link "Pomiary Ciała":
        - /url: "#"
    - listitem:
      - link "Trening":
        - /url: "#"
    - listitem:
      - link "Analiza Progresu":
        - /url: "#"
    - listitem:
      - link "Dieta i Żywienie":
        - /url: "#"
    - listitem:
      - link "Profil i Ustawienia":
        - /url: "#"
  - link "☕ Podoba Ci się to narzędzie? Postaw mi kawę!":
    - /url: https://suppi.pl/ukidives
    - text: ☕ Podoba Ci się to narzędzie?
    - strong: Postaw mi kawę!
  - text: Loading Version...
- main:
  - img "Logo"
  - heading "Uki's BodyBuild" [level=2]
  - paragraph: Wybierz narzędzie z menu
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Uki BodyBuild E2E', () => {
  4  |     
  5  |     test('Powinien poprawnie załadować aplikację i wstrzyknąć komponenty', async ({ page }) => {
  6  |         // Assume the dev server is running on localhost:8080
  7  |         await page.goto('http://localhost:8080/');
  8  | 
  9  |         // Check if welcome screen is visible
  10 |         await expect(page.locator('#welcome-screen')).toBeVisible();
  11 |         await expect(page.locator('text="Wybierz narzędzie z menu"')).toBeVisible();
  12 | 
  13 |         // Navigate to Pomiary Ciała
  14 |         await page.click('text="Pomiary Ciała"');
  15 |         
  16 |         // Check if Measurements component was injected correctly
> 17 |         await expect(page.locator('h2', { hasText: 'Pomiary Ciała' })).toBeVisible();
     |                                                                        ^ Error: expect(locator).toBeVisible() failed
  18 |         await expect(page.locator('#measurementsForm')).toBeVisible();
  19 |     });
  20 | 
  21 |     test('Powinien pozwalać na wpisanie wagi', async ({ page }) => {
  22 |         await page.goto('http://localhost:8080/');
  23 |         await page.click('text="Pomiary Ciała"');
  24 |         
  25 |         // Fill the weight
  26 |         await page.fill('#measureWeight', '85.5');
  27 |         const weightValue = await page.inputValue('#measureWeight');
  28 |         expect(weightValue).toBe('85.5');
  29 |     });
  30 | 
  31 | });
  32 | 
```