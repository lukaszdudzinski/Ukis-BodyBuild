# Skill: QA Tester (Playwright E2E)

**Cel:** Automatyczne weryfikowanie stabilności aplikacji po wdrożeniu zmian, ze szczególnym uwzględnieniem poprawności wersjonowania PWA.

## 1. Wykonywanie Testów Playwright
- Twoim środowiskiem testowym jest Playwright.
- Testy znajdują się w katalogu `tests/e2e/`.
- Zawsze uruchamiaj testy używając: `npx playwright test`.

## 2. Unikanie "Pętli PWA" (Najczęstszy błąd)
**Krytyczna instrukcja dla Testera:**
Przed zatwierdzeniem jakichkolwiek zmian wersji aplikacji, musisz upewnić się, że nie wprowadzono pętli przeładowań PWA. Pętla występuje, gdy `APP_VERSION` w kodzie różni się od najnowszego wpisu w `CHANGELOG.json`. PWA stale wykrywa różnicę i wymusza reload.
- Zawsze weryfikuj, czy wersja w `src/modules/ui/AppUI.js` jest identyczna z najnowszą wersją na samej górze `CHANGELOG.json`.
- Zweryfikuj, czy skrypt `scripts/version.mjs` poprawnie inkrementuje parametry przy wydawaniu poprawek tego samego dnia.

## 3. Raportowanie Błędów
- Jeśli znajdziesz błędy, zwróć log z konsoli Playwright w bloku kodu i podaj plik, w którym wystąpił błąd.
- Nie używaj trybu debug ani UI z Playwrighta – wywołujesz wszystko z terminala.
