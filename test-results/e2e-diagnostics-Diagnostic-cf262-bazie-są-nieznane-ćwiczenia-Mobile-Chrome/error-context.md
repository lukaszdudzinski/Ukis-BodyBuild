# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/diagnostics.spec.js >> Diagnostics Panel - Asystent Mapowania (#db-migrate-names-btn) >> otwiera Asystenta Mapowania (modal) po zatwierdzeniu confirm, gdy w bazie są nieznane ćwiczenia
- Location: tests/e2e/diagnostics.spec.js:71:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#db-migrate-names-btn')
    - locator resolved to <button id="db-migrate-names-btn">…</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <span>(2026-09-18)</span> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div>…</div> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting 20ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <span>(2026-09-18)</span> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
  2 × retrying click action
      - waiting 100ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div id="changelog-modal-overlay">…</div> intercepts pointer events
  13 × retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div>…</div> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <span>(2026-09-18)</span> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
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
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div>…</div> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <span>(2026-09-18)</span> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting 500ms

```

# Page snapshot

```yaml
- generic [active]:
  - generic [ref=e1]:
    - main [ref=e2]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - heading "Pełne Archiwum Bazy Danych" [level=3] [ref=e7]
          - paragraph [ref=e11]: "Utwórz kompletną kopię bezpieczeństwa (pomiary, treningi, szablony, dieta, raporty AI, awatar i ustawienia) lub przywróć całą aplikację z pliku archiwum JSON. Rozmiar bazy fizycznej: 48.00 KB"
          - generic [ref=e12]:
            - button "Utwórz Archiwum" [ref=e13] [cursor=pointer]
            - button "Przywróć z Pliku" [ref=e17] [cursor=pointer]
          - generic [ref=e21]:
            - generic [ref=e22]: "Częstotliwość propozycji archiwizacji:"
            - combobox [ref=e23] [cursor=pointer]:
              - option "Po aktywności (jeśli był wczoraj trening)" [selected]
              - option "Codziennie"
              - option "Co tydzień"
              - option "Co miesiąc"
              - option "Co dwa miesiące"
              - option "Nigdy nie proponuj"
          - group [ref=e24]:
            - generic "Narzędzia eksperymentalne (Dla deweloperów)" [ref=e25] [cursor=pointer]
        - generic [ref=e26]:
          - heading "Przycisk Paniki (Twardy Reset)" [level=3] [ref=e27]
          - paragraph [ref=e28]: Użyj tylko wtedy, gdy aplikacja przestała się aktualizować lub "utknęła" na starej wersji. Konta i statystyki są bezpieczne (baza SQLite nie jest usuwana).
          - button "Wykonaj Twardy Reset Aplikacji" [ref=e29] [cursor=pointer]
        - generic [ref=e32]:
          - heading "Zarządzanie Pamięcią (Storage)" [level=3] [ref=e33]
          - paragraph [ref=e36]: Wybierz, z jakich modułów chcesz usunąć stare zdjęcia, aby zwolnić miejsce. Usunięte zostaną tylko pliki graficzne, Twoje dane pozostaną nienaruszone!
          - generic [ref=e37]:
            - generic [ref=e38] [cursor=pointer]:
              - checkbox "Dieta (Zdjęcia posiłków)" [checked] [ref=e39]
              - generic [ref=e40]: Dieta (Zdjęcia posiłków)
            - generic [ref=e41] [cursor=pointer]:
              - checkbox "Treningi (Zdjęcia z siłowni)" [checked] [ref=e42]
              - generic [ref=e43]: Treningi (Zdjęcia z siłowni)
            - generic [ref=e44] [cursor=pointer]:
              - checkbox "Pomiary (Zdjęcia sylwetki)" [checked] [ref=e45]
              - generic [ref=e46]: Pomiary (Zdjęcia sylwetki)
          - generic [ref=e47]:
            - generic [ref=e48]: "Okres do wyczyszczenia (starsze niż):"
            - combobox [ref=e49]:
              - option "1 dzień" [selected]
              - option "1 tydzień"
              - option "1 miesiąc"
              - option "3 miesiące"
              - option "6 miesięcy"
              - option "Wszystkie"
          - button "Rozpocznij zwalnianie miejsca" [ref=e50] [cursor=pointer]
        - generic [ref=e53]:
          - heading "Naprawa i Mapowanie Danych" [level=3] [ref=e54]
          - paragraph [ref=e57]: "Narzędzie do automatycznej naprawy starych nazw ćwiczeń na nowe, zunifikowane nazwy z Katalogu. WAŻNE: Przed użyciem utwórz Archiwum na samej górze!"
          - button "Wykonaj Mapowanie Ćwiczeń" [ref=e58] [cursor=pointer]
        - generic [ref=e61]:
          - heading "Formatowanie Bazy (Usuwa Błędy I/O)" [level=3] [ref=e62]
          - paragraph [ref=e65]: "Rozwiązuje ostatecznie problem \"disk I/O error\" w Safari. KROK 1: Utwórz Archiwum wyżej i pobierz plik JSON.KROK 2: Kliknij ten przycisk.KROK 3: Po restarcie zaimportuj pobrany plik JSON."
          - button "FORMATUJ BAZĘ DANYCH" [ref=e66] [cursor=pointer]
        - generic [ref=e71]:
          - heading "Pamięć Podręczna" [level=3] [ref=e72]
          - paragraph [ref=e73]: Użyj tej opcji tylko wtedy, gdy zaciął się interfejs (np. nie ładuje się awatar, źle działa motyw lub zablokował się samouczek). Zresetuje ona wyłącznie podręczne ustawienia wyglądu. Twoja historia treningów i atlas ćwiczeń są w pełni bezpieczne!
          - button "Wyczyść tylko LocalStorage" [ref=e74] [cursor=pointer]
        - generic [ref=e75]:
          - heading "Logi Błędów Aplikacji" [level=3] [ref=e76]
          - generic [ref=e77]: Brak zarejestrowanych błędów :)
          - generic [ref=e78]:
            - button "Kopiuj Logi" [ref=e79] [cursor=pointer]
            - button "Udostępnij Logi" [ref=e80] [cursor=pointer]
          - button "Wyczyść Logi" [ref=e81] [cursor=pointer]
    - generic [ref=e82]:
      - generic [ref=e83] [cursor=pointer]: Menu
      - generic [ref=e89] [cursor=pointer]: Trening
      - generic [ref=e100] [cursor=pointer]: Profil
      - generic [ref=e106] [cursor=pointer]: Serwis
  - generic [ref=e112]:
    - generic [ref=e113]:
      - heading "Co nowego? 🚀" [level=3] [ref=e114]
      - button "×" [ref=e115] [cursor=pointer]
    - generic [ref=e117]:
      - generic [ref=e118]:
        - heading "Wersja v2026.9.18.03 (2026-09-18)" [level=4] [ref=e119]
        - list [ref=e120]:
          - listitem [ref=e121]: "✨ Poprawki UX: Usunięcie emotikon z opcji kalendarza (Podgląd, Kontynuuj, Usuń), naprawa tapet w Ustawieniach na glassmorphism"
      - generic [ref=e122]:
        - heading "Wersja v2026.9.18.02 (2026-09-18)" [level=4] [ref=e123]
        - list [ref=e124]:
          - listitem [ref=e125]: "✨ Poprawki UX: modal szablonów glassmorphism, poprawny SVG hantla, owijanie nazw ćwiczeń, widoczność przycisku Pauza"
      - generic [ref=e126]:
        - heading "Wersja v2026.9.18.01 (2026-09-18)" [level=4] [ref=e127]
        - list [ref=e128]:
          - listitem [ref=e129]: "🐞 HOTFIX: Naprawiono wszystkie testy Playwright E2E. Aktualizacja selektorów (Glassmorphism), likwidacja race conditions (Changelog i PWA) oraz fix czyszczenia bazy OPFS w trybie WebWorker."
  - button "🤖" [ref=e131] [cursor=pointer]
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | test.describe('Diagnostics Panel - Asystent Mapowania (#db-migrate-names-btn)', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     // Mockujemy tryb standalone PWA oraz wyłączamy onboarding i changelog
  6   |     await page.addInitScript(() => {
  7   |       Object.defineProperty(window.navigator, 'standalone', { value: true, configurable: true });
  8   |       const origMatchMedia = window.matchMedia;
  9   |       window.matchMedia = function (query) {
  10  |         if (query === '(display-mode: standalone)') {
  11  |           return {
  12  |             matches: true,
  13  |             media: query,
  14  |             onchange: null,
  15  |             addListener: () => {},
  16  |             removeListener: () => {},
  17  |             addEventListener: () => {},
  18  |             removeEventListener: () => {},
  19  |             dispatchEvent: () => true
  20  |           };
  21  |         }
  22  |         return origMatchMedia ? origMatchMedia.call(window, query) : { matches: false, media: query };
  23  |       };
  24  |       window.localStorage.setItem('tutorial_global_v21', 'true');
  25  |       window.localStorage.setItem('tutorial_global_v22', 'true');
  26  |       window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02');
  27  |     });
  28  | 
  29  |     await page.goto('/');
  30  |     await page.waitForTimeout(1000);
  31  |     // Czekamy na załadowanie modułów aplikacji
  32  |     await page.waitForFunction(() => typeof window.switchTab === 'function' && typeof window.DatabaseManager !== 'undefined');
  33  |   });
  34  | 
  35  |   test('przycisk #db-migrate-names-btn istnieje w DOM i wywołuje okno dialogowe confirm', async ({ page }) => {
  36  |     // Przejdź do zakładki Diagnostyka
  37  |     await page.evaluate(() => window.switchTab('diagnostics-dashboard'));
  38  | 
  39  |     // Sprawdź czy panel diagnostyki jest widoczny
  40  |     const diagnosticsPanel = page.locator('#diagnostics-dashboard');
  41  |     await expect(diagnosticsPanel).toBeVisible();
  42  | 
  43  |     // Sprawdź czy przycisk Asystenta Mapowania istnieje w DOM i jest widoczny
  44  |     const migrateBtn = page.locator('#db-migrate-names-btn');
  45  |     await expect(migrateBtn).toBeAttached();
  46  |     await expect(migrateBtn).toBeVisible();
  47  |     await expect(migrateBtn).toContainText('Wykonaj Mapowanie Ćwiczeń');
  48  | 
  49  |     // Nasłuchiwanie na wywołanie okna dialogowego (confirm)
  50  |     let dialogTriggered = false;
  51  |     let dialogType = '';
  52  |     let dialogMessage = '';
  53  | 
  54  |     page.once('dialog', async (dialog) => {
  55  |       dialogTriggered = true;
  56  |       dialogType = dialog.type();
  57  |       dialogMessage = dialog.message();
  58  |       await dialog.dismiss();
  59  |     });
  60  | 
  61  |     // Kliknij przycisk Asystenta Mapowania
  62  |     await migrateBtn.click();
  63  | 
  64  |     // Weryfikacja parametrów okna dialogowego confirm
  65  |     expect(dialogTriggered).toBe(true);
  66  |     expect(dialogType).toBe('confirm');
  67  |     expect(dialogMessage).toContain('WAŻNE: Czy utworzyłeś już Archiwum?');
  68  |     expect(dialogMessage).toContain('Kliknij OK, aby otworzyć asystenta mapowania.');
  69  |   });
  70  | 
  71  |   test('otwiera Asystenta Mapowania (modal) po zatwierdzeniu confirm, gdy w bazie są nieznane ćwiczenia', async ({ page }) => {
  72  |     // Wstrzykujemy mock treningu ze starą/nieznaną nazwą ćwiczenia przez DatabaseManager.addTraining
  73  |     await page.evaluate(async () => {
  74  |       await window.DatabaseManager.addTraining({
  75  |         name: 'Stary Trening E2E',
  76  |         date: '2026-08-20',
  77  |         duration_seconds: 3600,
  78  |         exercises: [
  79  |           {
  80  |             name: 'stare wyciskanie płaska',
  81  |             sets: [{ weight: 80, reps: 10 }]
  82  |           }
  83  |         ]
  84  |       });
  85  |     });
  86  | 
  87  |     // Przejdź do Diagnostyki
  88  |     await page.evaluate(() => window.switchTab('diagnostics-dashboard'));
  89  | 
  90  |     const migrateBtn = page.locator('#db-migrate-names-btn');
  91  |     await expect(migrateBtn).toBeVisible();
  92  | 
  93  |     // Akceptujemy dialog confirm
  94  |     page.once('dialog', async (dialog) => {
  95  |       await dialog.accept();
  96  |     });
  97  | 
> 98  |     await migrateBtn.click();
      |                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
  99  | 
  100 |     // Sprawdzamy czy modal Asystenta Mapowania został dodany do DOM i jest widoczny
  101 |     const mappingModal = page.locator('#mapping-modal');
  102 |     await expect(mappingModal).toBeVisible();
  103 |     await expect(mappingModal).toContainText('Asystent Mapowania');
  104 |     await expect(mappingModal).toContainText('stare wyciskanie płaska');
  105 | 
  106 |     // Sprawdzamy obecność przycisku zapisu zmian
  107 |     const saveBtn = page.locator('#map-save-btn');
  108 |     await expect(saveBtn).toBeVisible();
  109 | 
  110 |     // Sprzątanie po teście
  111 |     await page.evaluate(async () => {
  112 |       if (window.DatabaseManager && window.DatabaseManager.db) {
  113 |         await window.DatabaseManager.sendMessage('exec', { sql: "DELETE FROM trainings WHERE name = 'Stary Trening E2E'" });
  114 |       }
  115 |     });
  116 |   });
  117 | });
  118 | 
```