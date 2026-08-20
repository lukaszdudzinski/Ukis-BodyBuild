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
