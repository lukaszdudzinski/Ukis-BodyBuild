---
description: Rygorystyczne zasady jakości kodu, aktualizacji PWA (Cache) oraz programowania defensywnego.
---

# Imperatyw: Gwarancja Jakości Kodowania i Aktualizacji PWA (Code Quality & PWA Deployments)

Ten plik zawiera krytyczne wytyczne wynikające z wcześniejszych awarii na produkcji (Cache Trap oraz błędy typu 'undefined is not an object'). Każdy Agent pracujący nad projektem **Musi** bezwzględnie przestrzegać poniższych zasad.

## 1. Złota Zasada Aktualizacji PWA (Anti-Cache Trap)
Aktualizacja aplikacji PWA nie polega jedynie na wgraniu plików na serwer. Przeglądarki agresywnie buforują pliki, dlatego każdy proces publikacji (Deploy) **wymaga** synchronicznej aktualizacji wersji w trzech miejscach.
Podczas wypuszczania nowej wersji, Agent MUSI zaktualizować wersję (np. z `v.1.0` na `v.1.1`) w:
- `CHANGELOG.json` (Dodanie nowego wpisu na samej górze).
- `index.html` (Aktualizacja w tagu `<meta name="app-version" content="...">`).
- `sw.js` (Aktualizacja zmiennej `const CACHE_NAME = 'ukis-bodybuild-v...';` - **KRYTYCZNE**, bez tego nowa wersja nie przebije się przez Service Workera).

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
