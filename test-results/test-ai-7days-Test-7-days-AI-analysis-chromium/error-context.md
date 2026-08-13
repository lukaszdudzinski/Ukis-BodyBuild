# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-ai-7days.spec.js >> Test 7 days AI analysis
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
      - <p>…</p> from <div id="onboarding-modal">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <p>…</p> from <div id="onboarding-modal">…</div> subtree intercepts pointer events
  2 × retrying click action
      - waiting 100ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div>…</div> from <div id="onboarding-modal">…</div> subtree intercepts pointer events
  12 × retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <p>…</p> from <div id="onboarding-modal">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <p>…</p> from <div id="onboarding-modal">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div>…</div> from <div id="onboarding-modal">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div>…</div> from <div id="onboarding-modal">…</div> subtree intercepts pointer events
  2 × retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <p>…</p> from <div id="onboarding-modal">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div>…</div> from <div id="onboarding-modal">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting 500ms

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
          - link "Diagnostyka" [ref=e21] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e22]:
          - link "Profil i Ustawienia" [ref=e23] [cursor=pointer]:
            - /url: "#"
      - generic [ref=e24]:
        - link [ref=e26] [cursor=pointer]:
          - /url: https://suppi.pl/ukidives
          - text: ☕ Podoba Ci się to narzędzie?
          - strong [ref=e27]: Postaw mi kawę!
        - generic [ref=e28]: v2026.8.13.02
    - main [ref=e29]:
      - generic [ref=e31]:
        - generic [ref=e32]:
          - heading "🤖 Analizy AI" [level=2] [ref=e33]
          - paragraph [ref=e34]: Trener Edward analizuje Twoje dane
        - generic [ref=e35]:
          - generic [ref=e36]:
            - generic [ref=e37]:
              - generic [ref=e38]: 🤖
              - generic [ref=e39]:
                - heading "Trener Edward analizuje Twoje dane" [level=3] [ref=e40]
                - paragraph [ref=e41]: Pelna analiza treningow, diety i regeneracji z rekomendacjami AI. Edward bierze pod uwage historie treningow, partie miesniowe, obciazenie, posilki i sen.
            - generic [ref=e42]:
              - button "Analiza Tygodniowa ostatnie 7 dni" [ref=e43] [cursor=pointer]: Analiza Tygodniowaostatnie 7 dni
              - button "Analiza Miesięczna ostatnie 30 dni" [ref=e44] [cursor=pointer]: Analiza Miesięcznaostatnie 30 dni
          - generic [ref=e45]:
            - heading "Historia Analiz (kliknij rok/miesiac by rozwinac)" [level=4] [ref=e46]:
              - text: Historia Analiz
              - generic [ref=e47]: (kliknij rok/miesiac by rozwinac)
            - generic [ref=e49]:
              - generic [ref=e50]: 🏋️
              - paragraph [ref=e51]: Brak historii analiz.Wygeneruj pierwsza - Edward czeka!
  - text: ✕
  - generic [ref=e53]:
    - generic [ref=e54]: 👋
    - heading "Witaj w Uki's BodyBuild! 🚀" [level=2] [ref=e55]
    - paragraph [ref=e56]: Cześć! Jestem Edward, Twój wirtualny asystent AI 🤖.Jak mam się do Ciebie zwracać?
    - textbox "Wpisz swój nick lub imię..." [ref=e57]
    - button "Zaczynamy! ➔" [ref=e58] [cursor=pointer]
  - button "🤖" [ref=e59] [cursor=pointer]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test('Test 7 days AI analysis', async ({ page }) => {
  4  |     page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  5  |     page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  6  |     await page.goto('/');
  7  |     await page.waitForTimeout(1000);
  8  |     
  9  |     await page.evaluate(() => window.switchTab('ai-analytics-dashboard'));
  10 |     await page.waitForTimeout(500);
  11 |     
  12 |     // Dispatch custom event to trigger render
  13 |     await page.evaluate(() => document.dispatchEvent(new CustomEvent('tabChanged', { detail: { tab: 'ai-analytics-dashboard' } })));
  14 |     await page.waitForTimeout(500);
  15 | 
  16 |     const html = await page.innerHTML('#ai-analytics-content');
  17 |     console.log("Container HTML length:", html.length);
  18 |     
  19 |     if (html.length > 0) {
> 20 |         await page.click('#ai-gen-weekly-btn');
     |                    ^ Error: page.click: Test timeout of 30000ms exceeded.
  21 |         await page.waitForTimeout(500);
  22 |         await page.click('#sleep-confirm');
  23 |         await expect(page.locator('#ai-status-bar')).toBeHidden({ timeout: 15000 });
  24 |         
  25 |         // Let's see what happens after generate
  26 |         const dialog = await new Promise(r => {
  27 |              const t = setTimeout(() => r({ message: () => "NO DIALOG" }), 5000);
  28 |              page.once('dialog', d => { clearTimeout(t); r(d); });
  29 |         });
  30 |         console.log("Dialog: " + dialog.message());
  31 |         if (dialog.accept) await dialog.accept();
  32 |     }
  33 | });
  34 | 
```