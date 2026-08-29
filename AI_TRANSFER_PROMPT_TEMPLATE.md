# Wytyczne i Szablon Promptu Transferowego (Uki's BodyBuild)

Ten plik definiuje standard przekazywania kontekstu między kolejnymi sesjami z agentami AI (np. Antigravity) pracującymi nad projektem Uki's BodyBuild. 

Celem promptu transferowego jest płynne przekazanie pałeczki, aby nowy agent od pierwszej sekundy znał stan projektu, najważniejsze pliki i swoje najbliższe zadanie, bez konieczności ponownego analizowania całości od zera.

---

## 📝 Szablon do Skopiowania (Wygenerowany z sesji 1c831b05-b16b-411d-9a2e-9438ed58da89)

```markdown
# 🚀 PROMPT TRANSFEROWY (Kontekst Projektu Uki's BodyBuild)

**Jesteś Antigravity, agentem AI pracującym nad aplikacją Uki's BodyBuild.**
Oto pełny kontekst naszego projektu, abyś mógł płynnie przejąć pałeczkę i kontynuować pracę.

## 🔗 Powiązania i Metadane
- **Poprzednia konwersacja (ID):** 1c831b05-b16b-411d-9a2e-9438ed58da89
- **Aktualna Wersja Aplikacji:** v2026.8.28.01

## 📂 Najważniejsze Pliki do Zapoznania się (Otwórz je przez `view_file`)
1. `src/modules/db/DatabaseManager.js` - Rdzeń sqlite3, logiki zapisu, OPFS fallback (bardzo wrażliwe)
2. `src/modules/ui/BackupUI.js` - Moduł automatycznych dziennych kopii bazy danych
3. `GEMINI.md` - Zbiór reguł globalnych projektu.

## ✅ Co Zostało Zrobione (Stan Obecny)
- 🔥 Krytyczny pożar ugaszony: Brak wsparcia OPFS wymuszał trzymanie bazy w pamięci RAM. Wdrożyliśmy mechanizm `autoSaveOPFS`, który natychmiast zrzuca RAM do OPFS po każdej operacji. 
- 🛟 Wdrożono moduł `BackupUI` z dziennym przypomnieniem o backupie JSON.
- 🐛 Treningi: Naprawiono błędne wczytywanie się szablonu treningowego przy starcie "Wolnego Treningu" - brakująca funkcja `handleTypeChange` została przywrócona.
- 🐛 Treningi: Dodawanie nowych serii działa poprawnie, dzięki wywoływaniu `saveDraft()` zamiast nieistniejącego `saveActiveWorkout()`.
- 🖼 Dieta: Naprawiono ładowanie miniatur zdjęć z `MediaManager` w podglądzie "Dodaj Posiłek" (formularz AI).

## 🏗️ Ważny Kontekst Architektoniczny
Pamiętaj, że aplikacja to PWA w Vanilla JS. Baza danych to lokalne środowisko przeglądarkowe (VFS / OPFS). Dostęp do płatnych funkcji Premium sprawdza `PremiumUI.checkPremium()`.

## 🗺 Najbliższy Cel / Twoje Zadanie
Obecnie aplikacja została doprowadzona do **100% sprawności** (wszystkie zgłoszone błędy ui/logiczne z ostatnich pożarów zostały załatane).
Przechodzimy do wielkiej Fazy: **Rozbudowa Agentów AI, Środowiska QA i Serwerów MCP**.

Twoje Zadania na tę sesję:
1. **QA i Środowiska (Staging/Prod):** Skonfigurować z Użytkownikiem oddzielne środowiska QA i Produkcji. Trzeba zbudować proces zabezpieczający przed wgrywaniem uszkodzonego kodu na żywy serwer (żeby uchronić dane klientów).
2. **Automatyczne Testy (Playwright):** Wymusić automatyczne testy UI po każdej aktualizacji PWA (w tym sprawdzanie pętli odświeżania na podbijaniu wersji w `CHANGELOG.json` - zgodnie z GEMINI.md).
3. **Rozbudowa Sub-Agentów i Umiejętności (Skills):** Zaplanować poważną rozbudowę ról agentów (np. osobny Tester QA, oddzielny Code Reviewer) i dodać dla nich dedykowane pliki w strukturze projektu.
4. **Serwer MCP:** Zbadać i wdrożyć lokalny Serwer MCP (Model Context Protocol), aby pomóc AI testować bazy danych SQLite użytkownika w bezpiecznym środowisku.

Zaczynamy! Użytkownik czeka na zaplanowanie środowiska QA.
```
