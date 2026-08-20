# Wytyczne i Szablon Promptu Transferowego (Uki's BodyBuild)

Ten plik definiuje standard przekazywania kontekstu między kolejnymi sesjami z agentami AI (np. Antigravity) pracującymi nad projektem Uki's BodyBuild. 

Celem promptu transferowego jest płynne przekazanie pałeczki, aby nowy agent od pierwszej sekundy znał stan projektu, najważniejsze pliki i swoje najbliższe zadanie, bez konieczności ponownego analizowania całości od zera.

---

## 📋 Wytyczne: Co musi zawierać Prompt Transferowy?

1. **Kontekst Projektu i Rola:** Zdefiniowanie tożsamości agenta (Antigravity) oraz przypomnienie, że pracuje nad Uki's BodyBuild.
2. **ID Poprzedniej Konwersacji & Wersja:** 
   - `Conversation ID` poprzedniej rozmowy, aby agent w razie potrzeby mógł sięgnąć do historii.
   - Aktualna wersja aplikacji (np. `v2026.8.20.1`), którą trzeba również uaktualnić w pliku `CHANGELOG.json` i `AppUI.js`.
3. **Kluczowe Pliki (Workspace):** Lista najważniejszych plików związanych z nadchodzącym zadaniem z jawnym poleceniem `Otwórz je przez view_file przed rozpoczęciem pracy`.
4. **Co Zostało Zrobione (Stan Obecny):** Zwięzłe podsumowanie ostatnich wdrożeń (np. zakończenie Fazy 6, podział na wersję Light/Heavy).
5. **Kontekst Architektoniczny:** Krótkie przypomnienie o specyfice projektu (np. brak klasycznego backendu, użycie SQLite przez OPFS w przeglądarce, Cloudflare Workers dla AI, Vanilla JS + PWA).
6. **Następny Cel / Zadanie:** Dokładne wskazanie od czego agent ma rozpocząć pracę zaraz po przeczytaniu promptu.

---

## 📝 Szablon do Skopiowania (Generowany na koniec sesji)

Poniżej znajduje się czysty szablon, który agent będzie wypełniał na Twoją komendę: *"Stwórz prompt transferowy dla nowej konwersacji"*

```markdown
# 🚀 PROMPT TRANSFEROWY (Kontekst Projektu Uki's BodyBuild)

**Jesteś Antigravity, agentem AI pracującym nad aplikacją Uki's BodyBuild.**
Oto pełny kontekst naszego projektu, abyś mógł płynnie przejąć pałeczkę i kontynuować pracę.

## 🔗 Powiązania i Metadane
- **Poprzednia konwersacja (ID):** [TUTAJ_ID_KONWERSACJI]
- **Aktualna Wersja Aplikacji:** [TUTAJ_WERSJA_NP_v2026.8.20.1]

## 📂 Najważniejsze Pliki do Zapoznania się (Otwórz je przez `view_file`)
Przed rozpoczęciem kodowania użyj narzędzia do odczytania struktury, w szczególności:
1. [PLIK_1] - [OPIS_DLACZEGO_WAZNY]
2. [PLIK_2] - [OPIS_DLACZEGO_WAZNY]
3. `CHANGELOG.json` - zawsze aktualizuj historię zmian po wdrożeniach.

## ✅ Co Zostało Zrobione (Stan Obecny)
- [PUNKT_1_Z_OSTATNICH_ZMIAN]
- [PUNKT_2_Z_OSTATNICH_ZMIAN]
- [PUNKT_3_Z_OSTATNICH_ZMIAN]

## 🏗️ Ważny Kontekst Architektoniczny
Pamiętaj, że aplikacja to PWA w Vanilla JS. Baza danych to SQLite działający lokalnie w przeglądarce (OPFS). Zapytania AI są kierowane do zewnętrznego Cloudflare Workera. Wszelkie nowości muszą wspierać działanie offline.

## 🗺 Najbliższy Cel / Twoje Zadanie
Obecnie pracujemy nad Fazą [NUMER].
Twoim pierwszym zadaniem po przeczytaniu tego promptu będzie:
[OPIS_PIERWSZEGO_ZADANIA_DO_WYKONANIA]

Zaczynamy!
```
