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

4. **Testy to podstawa**
   - Przetestuj działanie (lub chociaż przeanalizuj poprawność kodu), zanim wypuścisz zmianę.
