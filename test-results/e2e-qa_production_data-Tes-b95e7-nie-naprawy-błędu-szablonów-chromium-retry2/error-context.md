# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/qa_production_data.spec.js >> Test na danych z produkcji >> Przywrócenie bazy z pliku i sprawdzenie naprawy błędu szablonów
- Location: tests/e2e/qa_production_data.spec.js:4:7

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: page.waitForEvent: Test timeout of 120000ms exceeded.
=========================== logs ===========================
waiting for event "filechooser"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - main [ref=e3]:
      - generic [ref=e6]:
        - generic [ref=e7]:
          - heading "Pełne Archiwum Bazy Danych" [level=3] [ref=e8]
          - paragraph [ref=e12]: "Utwórz kompletną kopię bezpieczeństwa (pomiary, treningi, szablony, dieta, raporty AI, awatar i ustawienia) lub przywróć całą aplikację z pliku archiwum JSON. Rozmiar bazy fizycznej: 48.00 KB"
          - generic [ref=e13]:
            - button "Utwórz Archiwum" [ref=e14] [cursor=pointer]
            - button "Przywróć z Pliku" [ref=e18] [cursor=pointer]
          - generic [ref=e22]:
            - generic [ref=e23]: "Częstotliwość propozycji archiwizacji:"
            - combobox [ref=e24] [cursor=pointer]:
              - option "Po aktywności (jeśli był wczoraj trening)" [selected]
              - option "Codziennie"
              - option "Co tydzień"
              - option "Co miesiąc"
              - option "Co dwa miesiące"
              - option "Nigdy nie proponuj"
          - group [ref=e25]:
            - generic "Narzędzia eksperymentalne (Dla deweloperów)" [ref=e26] [cursor=pointer]
        - generic [ref=e27]:
          - heading "Przycisk Paniki (Twardy Reset)" [level=3] [ref=e28]
          - paragraph [ref=e29]: Użyj tylko wtedy, gdy aplikacja przestała się aktualizować lub "utknęła" na starej wersji. Konta i statystyki są bezpieczne (baza SQLite nie jest usuwana).
          - button "Wykonaj Twardy Reset Aplikacji" [ref=e30] [cursor=pointer]
        - generic [ref=e33]:
          - heading "Zarządzanie Pamięcią (Storage)" [level=3] [ref=e34]
          - paragraph [ref=e37]: Wybierz, z jakich modułów chcesz usunąć stare zdjęcia, aby zwolnić miejsce. Usunięte zostaną tylko pliki graficzne, Twoje dane pozostaną nienaruszone!
          - generic [ref=e38]:
            - generic [ref=e39] [cursor=pointer]:
              - checkbox "Dieta (Zdjęcia posiłków)" [checked] [ref=e40]
              - generic [ref=e41]: Dieta (Zdjęcia posiłków)
            - generic [ref=e42] [cursor=pointer]:
              - checkbox "Treningi (Zdjęcia z siłowni)" [checked] [ref=e43]
              - generic [ref=e44]: Treningi (Zdjęcia z siłowni)
            - generic [ref=e45] [cursor=pointer]:
              - checkbox "Pomiary (Zdjęcia sylwetki)" [checked] [ref=e46]
              - generic [ref=e47]: Pomiary (Zdjęcia sylwetki)
          - generic [ref=e48]:
            - generic [ref=e49]: "Okres do wyczyszczenia (starsze niż):"
            - combobox [ref=e50]:
              - option "1 dzień" [selected]
              - option "1 tydzień"
              - option "1 miesiąc"
              - option "3 miesiące"
              - option "6 miesięcy"
              - option "Wszystkie"
          - button "Rozpocznij zwalnianie miejsca" [ref=e51] [cursor=pointer]
        - generic [ref=e54]:
          - heading "Naprawa i Mapowanie Danych" [level=3] [ref=e55]
          - paragraph [ref=e58]: "Narzędzie do automatycznej naprawy starych nazw ćwiczeń na nowe, zunifikowane nazwy z Katalogu. WAŻNE: Przed użyciem utwórz Archiwum na samej górze!"
          - button "Wykonaj Mapowanie Ćwiczeń" [ref=e59] [cursor=pointer]
        - generic [ref=e62]:
          - heading "Formatowanie Bazy (Usuwa Błędy I/O)" [level=3] [ref=e63]
          - paragraph [ref=e66]: "Rozwiązuje ostatecznie problem \"disk I/O error\" w Safari. KROK 1: Utwórz Archiwum wyżej i pobierz plik JSON.KROK 2: Kliknij ten przycisk.KROK 3: Po restarcie zaimportuj pobrany plik JSON."
          - button "FORMATUJ BAZĘ DANYCH" [ref=e67] [cursor=pointer]
        - generic [ref=e72]:
          - heading "Pamięć Podręczna" [level=3] [ref=e73]
          - paragraph [ref=e74]: Użyj tej opcji tylko wtedy, gdy zaciął się interfejs (np. nie ładuje się awatar, źle działa motyw lub zablokował się samouczek). Zresetuje ona wyłącznie podręczne ustawienia wyglądu. Twoja historia treningów i atlas ćwiczeń są w pełni bezpieczne!
          - button "Wyczyść tylko LocalStorage" [ref=e75] [cursor=pointer]
        - generic [ref=e76]:
          - heading "Logi Błędów Aplikacji" [level=3] [ref=e77]
          - generic [ref=e78]: Brak zarejestrowanych błędów :)
          - generic [ref=e79]:
            - button "Kopiuj Logi" [ref=e80] [cursor=pointer]
            - button "Udostępnij Logi" [ref=e81] [cursor=pointer]
          - button "Wyczyść Logi" [ref=e82] [cursor=pointer]
    - generic [ref=e83]:
      - generic [ref=e84] [cursor=pointer]: Menu
      - generic [ref=e90] [cursor=pointer]: Trening
      - generic [ref=e101] [cursor=pointer]: Profil
      - generic [ref=e107] [cursor=pointer]: Serwis
  - generic [ref=e113]:
    - generic [ref=e114]:
      - heading "Co nowego? 🚀" [level=3] [ref=e115]
      - button "×" [ref=e116] [cursor=pointer]
    - generic [ref=e119]:
      - heading "Wersja v2026.9.18.01 (2026-09-18)" [level=4] [ref=e120]
      - list [ref=e121]:
        - listitem [ref=e122]: "🐞 HOTFIX: Naprawiono wszystkie testy Playwright E2E. Aktualizacja selektorów (Glassmorphism), likwidacja race conditions (Changelog i PWA) oraz fix czyszczenia bazy OPFS w trybie WebWorker."
  - button "🤖" [ref=e124] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Test na danych z produkcji', () => {
  4  |   test('Przywrócenie bazy z pliku i sprawdzenie naprawy błędu szablonów', async ({ page }) => {
  5  |     test.setTimeout(120000); // Wydłużony czas na wgranie dużej bazy
  6  | 
  7  |     // 1. Wejdź na stronę
  8  |     await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02'); });
  9  |     await page.goto('/');
  10 |     await page.waitForTimeout(1000);
  11 | 
  12 |     // 2. Jeśli jest okno rejestracji - przeklikaj
  13 |     const nameInput = page.locator('#nickname-input');
  14 |     if (await nameInput.isVisible()) {
  15 |         await nameInput.fill('QA Tester');
  16 |         await page.getByRole('button', { name: 'Zapisz i Przejdź' }).click();
  17 |     }
  18 | 
  19 |     // 3. Wejdź w Diagnostykę
  20 |     await page.evaluate(() => window.switchTab('diagnostics-dashboard'));
  21 | 
  22 |     // 4. Załaduj plik
  23 |     const [fileChooser] = await Promise.all([
> 24 |       page.waitForEvent('filechooser'),
     |            ^ Error: page.waitForEvent: Test timeout of 120000ms exceeded.
  25 |       page.locator('#db-import-btn').click(),
  26 |     ]);
  27 |     
  28 |     // Wgrywamy Twój plik z danymi
  29 |     await fileChooser.setFiles('/Users/lukaszdudzinski/Downloads/bodybuild_backup_2026-09-02_10-48-01.json');
  30 | 
  31 |     // Akceptujemy okienko alert (baza przywrócona pomyslnie)
  32 |     page.on('dialog', dialog => dialog.accept());
  33 | 
  34 |     // Czekamy aż strona się przeładuje po imporcie
  35 |     await page.waitForLoadState('networkidle');
  36 | 
  37 |     // Sprawdźmy czy jesteśmy zalogowani i czy baza się załadowała
  38 |     await page.evaluate(() => window.switchTab('training-dashboard'));
  39 |     const calendarView = page.locator('#training-calendar-view');
  40 |     await expect(calendarView).toBeVisible({ timeout: 15000 });
  41 | 
  42 |     // Zgłaszam sukces załadowania bazy
  43 |     console.log("Baza wgrana z sukcesem!");
  44 |   });
  45 | });
  46 | 
```