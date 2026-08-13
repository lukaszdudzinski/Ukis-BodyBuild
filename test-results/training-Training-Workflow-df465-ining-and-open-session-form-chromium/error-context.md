# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: training.spec.js >> Training Workflow >> Should navigate to training and open session form
- Location: tests/e2e/training.spec.js:6:9

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  958 pixels (ratio 0.01 of all image pixels) are different.

  Snapshot: active-training-form.png

Call log:
  - Expect "toHaveScreenshot(active-training-form.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 147006 pixels (ratio 0.16 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 150704 pixels (ratio 0.17 of all image pixels) are different.
  - waiting 250ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 10904 pixels (ratio 0.02 of all image pixels) are different.
  - waiting 500ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 958 pixels (ratio 0.01 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
          - heading "Trening" [level=2] [ref=e33]
          - paragraph [ref=e34]: Zaplanuj i wykonuj treningi
        - generic [ref=e35]:
          - textbox "NAZWA Treningu (opcjonalnie)" [ref=e37]
          - combobox [ref=e39] [cursor=pointer]:
            - option "Trening Siłowy" [selected]
            - option "Cardio"
            - option "Zajęcia Zorganizowane"
          - generic [ref=e40]:
            - 'heading "Czas trwania: 00:00:02" [level=3] [ref=e41]'
            - generic [ref=e43] [cursor=pointer]:
              - checkbox "Wpisz czas treningu ręcznie" [ref=e44]
              - text: Wpisz czas treningu ręcznie
          - generic [ref=e45]:
            - button "🎵 Spotify" [ref=e46] [cursor=pointer]
            - button "🎶 YT Music" [ref=e47] [cursor=pointer]
          - generic [ref=e48]:
            - heading "Bieżące ćwiczenia" [level=4] [ref=e49]
            - generic [ref=e51]:
              - generic [ref=e52]:
                - textbox "Nazwa ćwiczenia (np. Wyciskanie)" [active] [ref=e53]
                - combobox [ref=e54]:
                  - option "Siłowe" [selected]
                  - option "Cardio"
              - generic [ref=e55]: 📷 Zrób zdjęcie maszyny
              - generic [ref=e57]:
                - spinbutton "kg" [ref=e59]
                - generic [ref=e60]: X
                - spinbutton "powt" [ref=e61]
              - generic [ref=e62]:
                - button "+ Seria" [ref=e63] [cursor=pointer]
                - button "🔥 Dropset" [ref=e64] [cursor=pointer]
              - generic [ref=e66] [cursor=pointer]:
                - checkbox "Skopiuj dane z poprzedniej serii" [ref=e67]
                - text: Skopiuj dane z poprzedniej serii
            - generic [ref=e68]:
              - button "+ Dodaj ćwiczenie" [ref=e69] [cursor=pointer]
              - button "🔗 Dodaj Superserię" [ref=e70] [cursor=pointer]
          - generic [ref=e71]:
            - heading "📸 Zdjęcia z treningu" [level=4] [ref=e72]
            - paragraph [ref=e73]: Dodaj foty by wleciały jako tło w Raportach Progresu!
            - generic [ref=e74]: +
          - generic [ref=e77]:
            - heading "⌚ Dane ze smartwatcha" [level=4] [ref=e78]
            - generic [ref=e79]:
              - generic [ref=e80]:
                - text: Kalorie Aktywności
                - spinbutton "kcal" [ref=e81]
              - generic [ref=e82]:
                - text: Średnie Tętno
                - spinbutton "bpm" [ref=e83]
          - generic [ref=e84]:
            - button "💾 Zapisz jako Szablon" [ref=e85] [cursor=pointer]
            - button "⏸ Pauza" [ref=e86] [cursor=pointer]
            - button "⏹ Zakończ Trening" [ref=e87] [cursor=pointer]
  - text: ✕
  - button "🤖" [ref=e88] [cursor=pointer]
  - generic [ref=e89] [cursor=pointer]: Witaj w Treningu! 💪 Tutaj zaplanujesz swoje sesje. Gotowy na wycisk?
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { DashboardPage } from './pages/DashboardPage.js';
  3  | import { TrainingPage } from './pages/TrainingPage.js';
  4  | 
  5  | test.describe('Training Workflow', () => {
  6  |     test('Should navigate to training and open session form', async ({ page }) => {
  7  |         const dashboard = new DashboardPage(page);
  8  |         const trainingPage = new TrainingPage(page);
  9  | 
  10 |         // Given I am on the home page
  11 |         await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.8.13.01'); });
  12 |         await dashboard.navigate();
  13 | 
  14 |         // When I click on Training tile
  15 |         await dashboard.goToTraining();
  16 | 
  17 |         // Then I should see the calendar
  18 |         await expect(page.locator('#training-calendar-view')).toBeVisible();
  19 | 
  20 |         // When I select day 15 (arbitrary day without training initially)
  21 |         await trainingPage.selectDay('15');
  22 | 
  23 |         // Then I should see the start new session button
  24 |         await expect(trainingPage.startNewSessionBtn).toBeVisible();
  25 | 
  26 |         // When I click start session
  27 |         await trainingPage.startNewSession();
  28 | 
  29 |         // Then I should see the active training view
  30 |         await expect(page.locator('#active-training-view')).toBeVisible();
  31 |         await expect(trainingPage.trainingNameInput).toBeVisible();
  32 |         
  33 |         // Take a snapshot to ensure the form looks correct (Visual Regression)
> 34 |         await expect(page).toHaveScreenshot('active-training-form.png', { maxDiffPixels: 100 });
     |                            ^ Error: expect(page).toHaveScreenshot(expected) failed
  35 |     });
  36 | });
  37 | 
```