---
description: Rygorystyczne zasady jakości kodu, aktualizacji PWA (Cache) oraz programowania defensywnego.
---

# Imperatyw: Gwarancja Jakości Kodowania i Aktualizacji PWA (Code Quality & PWA Deployments)

Ten plik zawiera krytyczne wytyczne wynikające z wcześniejszych awarii na produkcji (Cache Trap oraz błędy typu 'undefined is not an object'). Każdy Agent pracujący nad projektem **Musi** bezwzględnie przestrzegać poniższych zasad.

## 1. Złota Zasada Aktualizacji PWA (Anti-Cache Trap)
Aktualizacja aplikacji PWA nie polega jedynie na wgraniu plików na serwer. Przeglądarki agresywnie buforują pliki, dlatego każdy proces publikacji (Deploy) **wymaga** synchronicznej aktualizacji wersji we WSZYSTKICH czterech miejscach.
Podczas wypuszczania nowej wersji (nawet małego HOTFIXA), Agent MUSI podbić wersję na nową (np. z `v.1.0` na `v.1.1` - zakazuje się używania tego samego numeru co w zepsutej wersji) w:
- `CHANGELOG.json` (Dodanie nowego wpisu na samej górze).
- `index.html` (Aktualizacja w tagu `<meta name="app-version" content="...">`).
- `sw.js` (Aktualizacja zmiennej `const CACHE_NAME = 'ukis-bodybuild-v...';` - **KRYTYCZNE**, bez tego nowa wersja nie przebije się przez Service Workera).
- `src/modules/ui/AppUI.js` (Aktualizacja stałej `export const APP_VERSION = '...';`).
Jeśli zapomnisz o którymkolwiek z tych plików (np. AppUI.js), ryzykujesz cichą awarią zwaną "Cache Trap", gdzie serwer odrzuci aktualizację uważając ją za starą.

## 2. Programowanie Defensywne (Ochrona przed 'Undefined')
W aplikacjach Vanilla JS bez ścisłego typowania (TypeScript), obiekty często są mutowane lub odbudowywane z LocalStorage/bazy danych.
- ZABRANIA SIĘ zakładania, że zagnieżdżony obiekt istnieje. (Błąd: `obj.smartwatch.calories = 100`).
- NAKAZUJE SIĘ stosowanie sprawdzeń i opcjonalnego łańcuchowania (Optional Chaining): `if (obj && obj.smartwatch)` lub inicjalizowania pustego obiektu przed przypisaniem: `obj.smartwatch = obj.smartwatch || {}; obj.smartwatch.calories = 100;`.
- Nowe struktury danych powinny być tworzone przez dedykowane funkcje fabrykujące (Factory Functions), które gwarantują obecność wszystkich kluczy (np. ze stawką `null`), aby zapobiegać brakom w obiektach.

## 3. Zmiany Kaskadowe i Testy
Wprowadzenie nowej zmiennej do obiektu (np. `smartwatch` w `currentTraining`) musi być przeanalizowane pod kątem pełnego cyklu życia obiektu:
1. Tworzenie (Czy jest inicjalizowane?).
2. Zapis do Brudnopisu (Czy Draft go uwzględnia?).
3. Przywracanie z Brudnopisu (Czy UI odświeża te dane?).
4. Zapis do bazy danych SQLite (Czy nie powoduje wycieków pamięci/rekursji?).

## 4. Code Review (Zasada Podwójnego Sprawdzenia)
Przy grubszych fazach projektu (np. Faza 3), główny Agent programujący ma obowiązek przed pushem na produkcję przywołać Subagenta (np. `invoke_subagent` z rolą `Code Reviewer`), aby ten niezależnym "okiem" przejrzał krytyczne fragmenty kodu pod kątem potencjalnych błędów, luk w logice i standardów PWA.

## 5. Bezwzględna Weryfikacja Git (Anti-Czeski Błąd)
Zabrania się wykonywania komendy `git commit` bez uprzedniego, bezwzględnego zweryfikowania stanu plików (np. przez `git status`).
Agent MUSI upewnić się, że wszystkie pliki biorące udział w aktualizacji (szczególnie `index.html`, `CHANGELOG.json` oraz `sw.js`) zostały prawidłowo dodane do stage'a (`git add ...`). Pominięcie któregokolwiek z tych plików prowadzi do katastrofalnej w skutkach "Pętli Aktualizacji" u użytkowników.

## 6. Obowiązkowe Testy E2E (Playwright) przed każdym Commitem
Agent ma ABSOLUTNY ZAKAZ commitowania oraz wgrywania kodu na serwer bez uprzedniego uruchomienia i zweryfikowania testów E2E.
Przed każdym `git commit` i `git push`, należy wykonać polecenie `npx playwright test` i upewnić się, że wszystkie kluczowe ścieżki użytkownika (workflow) przechodzą bez błędu. Złamanie tej zasady grozi wysadzeniem aplikacji na produkcji! Jeśli testy wykażą błędy związane z sandboxem (np. problem ze sterownikiem Chromium), Agent powinien uruchomić je omijając sandbox (`BypassSandbox: true`) lub poprosić o zgodę użytkownika na ominięcie środowiska testowego, ale **nie wolno mu zignorować etapu testowania**.
