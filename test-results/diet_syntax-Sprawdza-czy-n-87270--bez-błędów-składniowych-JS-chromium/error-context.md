# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: diet_syntax.spec.js >> Sprawdza, czy nawigacja i moduł diety ładują się bez błędów składniowych JS
- Location: tests/e2e/diet_syntax.spec.js:3:1

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "Failed to get ServiceWorkerRegistration objects: The document is in an invalid state.",
+ ]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic "Powrót do ekranu startowego" [ref=e4] [cursor=pointer]:
        - img "Logo" [ref=e5]
        - heading "Uki's BodyBuild" [level=1] [ref=e6]
      - list [ref=e7]:
        - listitem [ref=e8]:
          - link "Pulpit Główny" [ref=e9] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e10]:
          - link "Pomiary Ciała" [ref=e11] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e12]:
          - link "Trening" [ref=e13] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e14]:
          - link "Historia Treningów" [ref=e15] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e16]:
          - link "Analiza Progresu" [ref=e17] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e18]:
          - link "Dieta i Żywienie" [ref=e19] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e20]:
          - link "Profil i Ustawienia" [ref=e21] [cursor=pointer]:
            - /url: "#"
      - generic [ref=e22]:
        - link [ref=e24] [cursor=pointer]:
          - /url: https://suppi.pl/ukidives
          - text: ☕ Podoba Ci się to narzędzie?
          - strong [ref=e25]: Postaw mi kawę!
        - generic [ref=e26]: Loading Version...
    - main [ref=e27]:
      - generic [ref=e30]:
        - img "Logo" [ref=e31]
        - heading "Uki's BodyBuild" [level=2] [ref=e32]
        - paragraph [ref=e33]: Wybierz narzędzie z menu
  - text: ✕
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
  11 |   await page.addInitScript(() => window.localStorage.setItem('tutorial_global_v22', 'true'));
  12 |     await page.goto('file://' + require('path').resolve(__dirname, '../../index.html'));
  13 | 
  14 |   // Sprawdzamy czy okno profilu lub napis Uki Bodybuild jest widoczny by potwierdzić że skrypt w ogóle ruszył
  15 |   await expect(page.locator('h1').first()).toBeVisible();
  16 | 
  17 |   // Oczekujemy, że nie było żadnych błędów JS
> 18 |   expect(errors).toEqual([]);
     |                  ^ Error: expect(received).toEqual(expected) // deep equality
  19 | });
  20 | 
```