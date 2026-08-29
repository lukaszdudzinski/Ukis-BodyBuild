# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: diet_syntax.spec.js >> Sprawdza, czy nawigacja i moduł diety ładują się bez błędów składniowych JS
- Location: tests/e2e/diet_syntax.spec.js:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('h1').first()
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1').first()
    14 × locator resolved to <h1>…</h1>
       - unexpected value "hidden"

```

```yaml
- navigation:
  - img "Logo"
  - heading "Uki's BodyBuild" [level=1]
  - list:
    - listitem:
      - link "Pulpit Główny":
        - /url: "#"
    - listitem:
      - link "Pomiary Ciała":
        - /url: "#"
    - listitem:
      - link "Trening":
        - /url: "#"
    - listitem:
      - link "Historia Treningów":
        - /url: "#"
    - listitem:
      - link "Analiza Progresu":
        - /url: "#"
    - listitem:
      - link "Dieta i Żywienie":
        - /url: "#"
    - listitem:
      - link "Diagnostyka":
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
  - text: Loading...
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test('Sprawdza, czy nawigacja i moduł diety ładują się bez błędów składniowych JS', async ({ page }) => {
  4  |   const errors = [];
  5  |   page.on('pageerror', err => {
  6  |     errors.push(err.message);
  7  |   });
  8  | 
  9  |   // Otwarcie strony PWA z serwera testowego lub pliku lokalnego
  10 |   // Playwright może testować plik lokalny dzięki file://
  11 |   await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.8.13.01'); });
  12 |     await page.goto('file://' + require('path').resolve(__dirname, '../../index.html'));
  13 | 
  14 |   // Sprawdzamy czy okno profilu lub napis Uki Bodybuild jest widoczny by potwierdzić że skrypt w ogóle ruszył
> 15 |   await expect(page.locator('h1').first()).toBeVisible();
     |                                            ^ Error: expect(locator).toBeVisible() failed
  16 | 
  17 |   // Oczekujemy, że nie było żadnych błędów JS
  18 |   expect(errors).toEqual([]);
  19 | });
  20 | 
```