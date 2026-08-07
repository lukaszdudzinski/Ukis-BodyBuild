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
   - **KRYTYCZNE**: Przy wypuszczaniu KAŻDEJ nowej aktualizacji z kodem (szczególnie zmieniającej `AppUI.js` i CHANGELOG), zawsze musisz zaktualizować zmienną `CACHE_NAME` (np. na `.04`, `.05`) w głównym pliku `sw.js` (Service Worker). Bez tego aplikacja mobilna zablokuje się na starym cache'u offline i użytkownicy nie dostaną nowych ficzerów! Pamiętaj o tym bezwzględnie.

5. **Problemy z autoryzacją Githuba (Push)**
   - Zapamiętaj strategię agenta "Uki Bike Log": Zawsze przepychamy polecenia z autoryzacją SSH zamiast HTTPS.
   - Origin musi być ustawiony na: `git remote set-url origin git@github.com:lukaszdudzinski/Ukis-BodyBuild.git`
   - Polecenia Push wywołuj jako: `GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=accept-new" git push origin master`
   - Jeśli komenda zostanie odrzucona przez blokadę, wywołuj narzędzie `run_command` z flagą `BypassSandbox: true`, zapyta to użytkownika o zgodę na ominięcie zapór sieciowych dla portów SSH.
