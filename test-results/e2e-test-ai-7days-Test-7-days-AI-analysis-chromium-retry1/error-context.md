# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/test-ai-7days.spec.js >> Test 7 days AI analysis
- Location: tests/e2e/test-ai-7days.spec.js:3:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#ai-gen-weekly-btn')
    - locator resolved to <button id="ai-gen-weekly-btn">…</button>
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
    52 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div id="changelog-modal-overlay">…</div> intercepts pointer events
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
          - heading "🤖 Analizy AI" [level=2] [ref=e7]
          - paragraph [ref=e8]: Trener Edward analizuje Twoje dane
        - generic [ref=e9]:
          - generic [ref=e10]:
            - generic [ref=e16]:
              - heading "Trener Edward" [level=3] [ref=e17]
              - paragraph [ref=e18]: Analiza treningów, diety i regeneracji. Oparta na AI historia treningów i parametry sylwetki.
            - generic [ref=e19]:
              - button "Analiza Tygodniowa Ostatnie 7 dni" [ref=e20] [cursor=pointer]:
                - text: Analiza Tygodniowa
                - generic [ref=e21]: Ostatnie 7 dni
              - button "Analiza Miesięczna Ostatnie 30 dni" [ref=e22] [cursor=pointer]:
                - text: Analiza Miesięczna
                - generic [ref=e23]: Ostatnie 30 dni
          - generic [ref=e24]:
            - heading "Historia Analiz Archiwum postępów" [level=4] [ref=e25]:
              - generic [ref=e26]: Historia Analiz
              - generic [ref=e30]: Archiwum postępów
            - paragraph [ref=e37]: Brak historii analiz.Wygeneruj pierwszą — Edward czeka!
    - generic [ref=e38]:
      - generic [ref=e39] [cursor=pointer]: Menu
      - generic [ref=e45] [cursor=pointer]: Trening
      - generic [ref=e56] [cursor=pointer]: Profil
      - generic [ref=e62] [cursor=pointer]: Serwis
  - generic [ref=e68]:
    - generic [ref=e69]:
      - heading "Co nowego? 🚀" [level=3] [ref=e70]
      - button "×" [ref=e71] [cursor=pointer]
    - generic [ref=e74]:
      - heading "Wersja v2026.9.18.01 (2026-09-18)" [level=4] [ref=e75]
      - list [ref=e76]:
        - listitem [ref=e77]: "🐞 HOTFIX: Naprawiono wszystkie testy Playwright E2E. Aktualizacja selektorów (Glassmorphism), likwidacja race conditions (Changelog i PWA) oraz fix czyszczenia bazy OPFS w trybie WebWorker."
  - button "🤖" [ref=e79] [cursor=pointer]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test('Test 7 days AI analysis', async ({ page }) => {
  4  |     page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  5  |     page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  6  |     await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki_premium_access', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02'); });
  7  |     await page.goto('/');
  8  |     await page.waitForTimeout(1000);
  9  |     
  10 |     await page.evaluate(() => window.switchTab('ai-analytics-dashboard'));
  11 |     await page.waitForTimeout(500);
  12 |     
  13 |     // Dispatch custom event to trigger render
  14 |     await page.evaluate(() => document.dispatchEvent(new CustomEvent('tabChanged', { detail: { tab: 'ai-analytics-dashboard' } })));
  15 |     await page.waitForTimeout(500);
  16 | 
  17 |     const html = await page.innerHTML('#ai-analytics-content');
  18 |     console.log("Container HTML length:", html.length);
  19 |     
  20 |     if (html.length > 0) {
> 21 |         await page.click('#ai-gen-weekly-btn');
     |                    ^ Error: page.click: Test timeout of 30000ms exceeded.
  22 |         await page.waitForTimeout(500);
  23 |         await page.click('#ai-interview-submit');
  24 |         await expect(page.locator('#ai-status-bar')).toBeHidden({ timeout: 15000 });
  25 |         
  26 |         // Let's see what happens after generate
  27 |         const dialog = await new Promise(r => {
  28 |              const t = setTimeout(() => r({ message: () => "NO DIALOG" }), 5000);
  29 |              page.once('dialog', d => { clearTimeout(t); r(d); });
  30 |         });
  31 |         console.log("Dialog: " + dialog.message());
  32 |         if (dialog.accept) await dialog.accept();
  33 |     }
  34 | });
  35 | 
```