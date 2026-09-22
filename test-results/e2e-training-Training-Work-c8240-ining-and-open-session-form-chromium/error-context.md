# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/training.spec.js >> Training Workflow >> Should navigate to training and open session form
- Location: tests/e2e/training.spec.js:6:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.glass-card[onclick="switchTab(\'training-dashboard\')"], .nav-btn[onclick="switchTab(\'training-dashboard\')"]').first()
    - locator resolved to <div class="glass-card main-cta" onclick="switchTab('training-dashboard')">…</div>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <li>✨ Poprawki UX: Usunięcie emotikon z opcji kalenda…</li> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <li>✨ Poprawki UX: Usunięcie emotikon z opcji kalenda…</li> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
  2 × retrying click action
      - waiting 100ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div id="changelog-modal-overlay">…</div> intercepts pointer events
  12 × retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <li>✨ Poprawki UX: Usunięcie emotikon z opcji kalenda…</li> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <li>✨ Poprawki UX: Usunięcie emotikon z opcji kalenda…</li> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
     - retrying click action
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
       - <div id="changelog-modal-overlay">…</div> intercepts pointer events
  2 × retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <li>✨ Poprawki UX: Usunięcie emotikon z opcji kalenda…</li> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
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
          - img "Avatar" [ref=e8] [cursor=pointer]
          - img "Logo" [ref=e10]
        - generic [ref=e11] [cursor=pointer]:
          - heading "Twój Trening" [level=2] [ref=e13]
          - generic [ref=e14]: Rozpocznij
        - generic [ref=e17]:
          - heading "Analiza" [level=3] [ref=e23] [cursor=pointer]
          - heading "Historia" [level=3] [ref=e28] [cursor=pointer]
          - heading "Pomiary" [level=3] [ref=e33] [cursor=pointer]
          - heading "Dieta" [level=3] [ref=e39] [cursor=pointer]
        - generic [ref=e40]:
          - heading "Analizy AI PRO" [level=3] [ref=e47] [cursor=pointer]:
            - text: Analizy AI
            - generic [ref=e48]: PRO
          - heading "Postaw Kawę" [level=3] [ref=e55] [cursor=pointer]
        - generic [ref=e56]: Trial (7 dni) v2026.9.18.03 | Wersja Light Powered by Antigravity AI
    - generic [ref=e57]:
      - generic [ref=e58] [cursor=pointer]: Menu
      - generic [ref=e64] [cursor=pointer]: Trening
      - generic [ref=e75] [cursor=pointer]: Profil
      - generic [ref=e81] [cursor=pointer]: Serwis
  - generic [ref=e87]:
    - generic [ref=e88]:
      - heading "Co nowego? 🚀" [level=3] [ref=e89]
      - button "×" [ref=e90] [cursor=pointer]
    - generic [ref=e92]:
      - generic [ref=e93]:
        - heading "Wersja v2026.9.18.03 (2026-09-18)" [level=4] [ref=e94]
        - list [ref=e95]:
          - listitem [ref=e96]: "✨ Poprawki UX: Usunięcie emotikon z opcji kalendarza (Podgląd, Kontynuuj, Usuń), naprawa tapet w Ustawieniach na glassmorphism"
      - generic [ref=e97]:
        - heading "Wersja v2026.9.18.02 (2026-09-18)" [level=4] [ref=e98]
        - list [ref=e99]:
          - listitem [ref=e100]: "✨ Poprawki UX: modal szablonów glassmorphism, poprawny SVG hantla, owijanie nazw ćwiczeń, widoczność przycisku Pauza"
      - generic [ref=e101]:
        - heading "Wersja v2026.9.18.01 (2026-09-18)" [level=4] [ref=e102]
        - list [ref=e103]:
          - listitem [ref=e104]: "🐞 HOTFIX: Naprawiono wszystkie testy Playwright E2E. Aktualizacja selektorów (Glassmorphism), likwidacja race conditions (Changelog i PWA) oraz fix czyszczenia bazy OPFS w trybie WebWorker."
  - button "🤖" [ref=e106] [cursor=pointer]
```

# Test source

```ts
  1  | export class DashboardPage {
  2  |     constructor(page) {
  3  |         this.page = page;
  4  |         this.measurementsTile = page.locator('.glass-card[onclick="switchTab(\'measurements-dashboard\')"], .nav-btn[onclick="switchTab(\'measurements-dashboard\')"]').first();
  5  |         this.trainingTile = page.locator('.glass-card[onclick="switchTab(\'training-dashboard\')"], .nav-btn[onclick="switchTab(\'training-dashboard\')"]').first();
  6  |         this.historyTile = page.locator('.glass-card[onclick="switchTab(\'history-dashboard\')"], .nav-btn[onclick="switchTab(\'history-dashboard\')"]').first();
  7  |     }
  8  | 
  9  |     async navigate() {
  10 |         await this.page.goto('/'); await this.page.waitForTimeout(1000);
  11 |     }
  12 | 
  13 |     async goToTraining() {
  14 |         // Wait for it to be visible
  15 |         await this.trainingTile.waitFor({ state: 'visible' });
> 16 |         await this.trainingTile.click();
     |                                 ^ Error: locator.click: Test timeout of 30000ms exceeded.
  17 |     }
  18 | }
  19 | 
```