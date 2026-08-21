# Instrukcje Globalne dla Agentów AI (Uki's BodyBuild)

Jesteś asystentem AI w projekcie Uki's BodyBuild.
Zawsze przestrzegaj poniższych zasad:

## 1. Transfer Prompt (Bardzo ważne)
Zawsze pamiętaj o istnieniu pliku `AI_TRANSFER_PROMPT_TEMPLATE.md` w głównym katalogu projektu.
Na koniec każdej sesji pracy, lub kiedy użytkownik Cię o to poprosi (np. komendą "stwórz prompt transferowy"), **MUSISZ** otworzyć ten plik, przeczytać jego strukturę i wygenerować na jego podstawie gotowy do skopiowania prompt transferowy dla kolejnego agenta. 
Wypełnij w nim wszystkie niezbędne pola (Wersja, ID obecnej konwersacji, opis zrobionych rzeczy, plan na następną sesję) zgodnie ze stanem faktycznym.

## 2. Architektura Projektu
- **PWA i Vanilla JS:** Aplikacja działa bez klasycznego backendu Node/Python.
- **Baza danych:** Używamy lokalnego SQLite w przeglądarce (przez OPFS). Zobacz `DatabaseManager.js`.
- **Wersja PRO/Light:** Logika sprawdzania dostępu Premium (hasło "UkiSuppi2026" / "UkiBodyBuildPro" lub trial 7 dni) znajduje się w `PremiumUI.checkPremium()`. Wszystkie nowe płatne funkcje AI muszą być opakowane w ten warunek.

## 3. Wersjonowanie i PWA (Skill: QA i Aktualizacje)
- **Skrypt aktualizacji:** Zawsze używaj `node scripts/version.mjs` do podbijania wersji. Skrypt ten zarządza wersją w plikach `index.html`, `sw.js`, `AppUI.js` i `CHANGELOG.json`. 
- **Styl Changeloga:** Każda wydana wersja (np. w pliku CHANGELOG.json) MUSI posiadać bogaty opis zmian z odpowiednimi emotikonami na początku (np. 👑, 🛠️, 🐞). Zabraniamy używania lakonicznych i krótkich opisów w stylu "Wydanie nowej wersji". Opisy mają być dopieszczone, żeby użytkownik wiedział, że coś ulepszyliśmy.

- **Zasada Pętli Aktualizacji:** Zwracaj szczególną uwagę, by wersja w pliku `CHANGELOG.json` (pierwszy wpis) **zawsze** idealnie pokrywała się z numerem `APP_VERSION` w plikach JS. Rozjazd tych numerów (np. Changelog pokazuje nowszą wersję niż `AppUI.js`) spowoduje agresywną pętlę przeładowań w PWA (`pwa-updater.js`).
- **QA Tester:** Agent Testujący musi weryfikować po każdej zmianie wersji w Playwright, czy aplikacja uruchamia się bez zapętlenia i czy wyświetla się poprawny numer wersji na ekranie głównym.
