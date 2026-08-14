# Zasady Aktualizacji PWA i Changelog (IMPERATYW)

Ten plik zawiera kluczowe wytyczne dotyczące obsługi wydań (nowych wersji aplikacji). Każdy agent wprowadzający nowości do kodu **MUSI** się do nich stosować.

## 1. Aktualizacja Wersji i Cache'a (Złota Zasada PWA)
Aplikacja działa w trybie Standalone PWA. Jeśli zmieniasz jakikolwiek kod, musisz zaktualizować wersję, by przeglądarka pobrała nowy plik, a **użytkownik nie musiał ciągle robić twardych resetów**.

Co musisz zrobić przy wydaniu:
1. Zaktualizuj `APP_VERSION` w `src/modules/ui/AppUI.js` (np. `export const APP_VERSION = 'v2026.8.14.06';`).
2. Zaktualizuj `<meta name="app-version" content="...">` w `index.html`.
3. Zaktualizuj `CACHE_NAME` w `sw.js` (Service Worker). To najważniejszy krok, by mechanizm `pwa-updater.js` automatycznie zasygnalizował nową wersję!
4. Dodaj wpis do `CHANGELOG.json`. Pamiętaj, aby tablica zaczynała się od najnowszej wersji.

*UWAGA: Wersja zawsze musi być w formacie `vROK.MIESIĄC.DZIEŃ.XX` bez kropki po "v" (np. `v2026.8.14.06`).*

## 2. Bogate Opisy Zmian (Wizerunek i Marketing)
Aplikacja to produkt zorientowany na entuzjastycznego użytkownika końcowego. Opisy wprowadzane do `CHANGELOG.json` **nie mogą być suchymi notkami technicznymi**.
Każde wydanie (nawet małe poprawki) musi zawierać budujące, motywujące i rozbudowane opisy tego, co zrobiono.

**Przykłady DOBREGO opisu:**
- "✨ NOWOŚĆ: Przebudowano interfejs aktywnego treningu — powiększono pola wprowadzania wagi i powtórzeń dla lepszej widoczności podczas ćwiczeń (Styl 'Large Input')."
- "🚨 HOTFIX: Usunięto krytyczny błąd w Diagnostyce. Możesz już bezpiecznie pobierać kopie zapasowe, by mieć pełną kontrolę nad danymi."

**Przykłady ZŁEGO opisu (ZAKAZANE):**
- "Wydanie nowej wersji poprawkowej."
- "Poprawiono błąd z exportDatabase."
- "Refaktor kodu."

Twój ton w Changelogu musi brzmieć, jakbyś sprzedawał niesamowitą funkcjonalność. Używaj emotikon. Pamiętaj, że jest to oficjalna historia zmian czytana przez trenujących dzików!
