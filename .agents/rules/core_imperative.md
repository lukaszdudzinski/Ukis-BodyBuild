# Zasady Projektowe (Imperatyw)
Użytkownik narzucił rygorystyczne wymagania dotyczące jakości oprogramowania, sposobu działania oraz marketingu:

1. **Poprawność i rzetelność (Prawidłowe liczenie)**
   - Algorytmy, wzory i obliczenia matematyczne/analityczne muszą działać prawidłowo i weryfikowalnie (np. zapotrzebowanie kaloryczne, BF%, wagi, czasy).
   - Aplikacja nie może wprowadzać użytkownika w błąd swoimi wskazaniami. Jeśli jakichś danych brakuje - informuj o tym jasno.

2. **Dbałość o architekturę i techniki projektowe**
   - Kod musi być modularny, skalowalny i bez "prowizorek". Pamiętamy o optymalizacji UI/UX.

3. **CHANGELOG - Opisy marketingowe to IMPERATYW**
   - Nigdy nie używaj zwrotów typu "Wydanie nowej wersji poprawkowej" lub suchych technicznych opisów. 
   - W pliku `CHANGELOG.json` do każdego patcha MUSISZ napisać co najmniej jedno zdanie zachęcające użytkownika, np. "✨ Przyspieszyliśmy ładowanie treningów! Zobaczysz ogromną różnicę.".
   - Sprzedajemy produkt użytkownikom - teksty mają być "fajne", z emotikonami, motywujące i budujące pozytywny wizerunek szybkiego rozwoju aplikacji. Zawsze opisuj co robimy, co usprawniamy i dodajemy, aby pokazać dynamikę rozwoju. Błędy krytyczne (o ile nie blokowały totalnie userów) opisuj jako "optymalizacje".

4. **Testy i Cykl Życia PWA (Wymuszone Zmiany)**
   - Przetestuj działanie (lub chociaż przeanalizuj poprawność kodu), zanim wypuścisz zmianę.
   - **KRYTYCZNE**: Przy wypuszczaniu KAŻDEJ nowej aktualizacji z kodem (szczególnie zmieniającej `AppUI.js` i CHANGELOG), zawsze musisz zaktualizować zmienną `CACHE_NAME` w głównym pliku `sw.js` (Service Worker). Bez tego aplikacja mobilna zablokuje się na starym cache'u offline i użytkownicy nie dostaną nowych ficzerów! Pamiętaj o tym bezwzględnie.
   - **IMPERATYW NUMERACJI**: Wersja aplikacji MUSI ZAWSZE przyjmować format `vROK.MIESIĄC.DZIEŃ.NUMER_Z_DNIA`. Przykład: `v2026.8.14.05`. **BEZWZGLĘDNY ZAKAZ KROPKI PO "v"**. Skrypt `scripts/version.mjs` i ręczne wpisy w plikach muszą rygorystycznie przestrzegać formatu `vYYYY.M.D.XX`.

5. **Ton Trenera Edwarda i Zasady Komunikacji (BEZWZGLĘDNY ZAKAZ WULGARYZMÓW)**
   - Trener Edward ma być profesjonalnym, merytorycznym i energetycznym trenerem personalnym z lekkim, siłownianym humorem (np. "Odłóż telefon i bierz się za ciężary!").
   - **BEZWZGLĘDNY ZAKAZ WULGARYZMÓW**: Nigdy nie używaj wulgaryzmów ani rynsztokowego języka w dymkach, komunikatach ani promptach.

6. **Standard Analiz Trenera Edwarda (AI Analytics)**
   - Wywiad przed analizą: Zawsze pobieraj / potwierdzaj sen, staż treningowy i cel sylwetkowy.
   - Dieta i Makro: Silnik ZAWSZE przekazuje pełne rozbicie na makroskładniki (Białko, Węglowodany, Tłuszcze, Kalorie oraz listę posiłków).
   - Szablony: Edward w podsumowaniu zawsze proponuje konkretny plan, który użytkownik może jednym kliknięciem zaimportować do Szablonów Treningowych.
   - UX Raportu: Bezpieczne marginesy dla iOS Notch / Dynamic Island i intuicyjny powrót do aplikacji.

7. **Problemy z autoryzacją Githuba (Push)**
   - Zapamiętaj strategię agenta "Uki Bike Log": Zawsze przepychamy polecenia z autoryzacją SSH zamiast HTTPS.
   - Origin musi być ustawiony na: `git remote set-url origin git@github.com:lukaszdudzinski/Ukis-BodyBuild.git`
   - Polecenia Push wywołuj jako: `GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=accept-new" git push origin master`
   - Jeśli komenda zostanie odrzucona przez blokadę, wywołuj narzędzie `run_command` z flagą `BypassSandbox: true`, zapyta to użytkownika o zgodę na ominięcie zapór sieciowych dla portów SSH.
