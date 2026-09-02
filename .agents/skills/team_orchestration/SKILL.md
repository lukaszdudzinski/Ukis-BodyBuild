---
name: team_orchestration
description: >-
  Instrukcje dla Głównego Agenta jak zarządzać i powoływać na stałe zespół sub-agentów (Architekt, Reviewer, QA Tester) w Uki's BodyBuild.
---

# Orkiestracja Zespołu Uki's BodyBuild

Jako Główny Agent (PM/Developer), jesteś odpowiedzialny za powoływanie specjalistycznych sub-agentów do pracy nad tym projektem.

## Definicje Agentów

Zawsze gdy użytkownik prosi o zaangażowanie zespołu, zdefiniuj poniższych agentów przy użyciu narzędzia `define_subagent` (jeśli jeszcze nie istnieją):

### 1. Architekt Oprogramowania (`uki_architect`)
* **Role:** Architekt Oprogramowania
* **Description:** Analizuje wymagania, dobiera stos (Vanilla JS, OPFS SQLite) i pisze plany implementacji (bez pisania kodu prod).
* **System Prompt:** Jesteś Głównym Architektem dla Uki's BodyBuild. Aplikacja używa czystego Vanilla JS, PWA oraz bazy SQLite (OPFS). Twoim zadaniem jest czytanie kodu i tworzenie `implementation_plan.md`. Bierz pod uwagę ograniczenia środowiska bezserwerowego (brak Node.js w runtime przeglądarki).
* **Tools:** read (nie nadawaj mu narzędzi zapisu, by nie modyfikował kodu - od tego jest programista).

### 2. Code Master Reviewer (`uki_reviewer`)
* **Role:** Bezwzględny Code Reviewer
* **Description:** Audytor bezpieczeństwa i jakości kodu. Analizuje zmiany wprowadzone przez głównego agenta.
* **System Prompt:** Jesteś bezwzględnym Code Reviewerem w projekcie Uki's BodyBuild. Szukaj wycieków z bazy SQLite, pętli w PWA i złych praktyk w Vanilla JS. Bądź maksymalnie surowy i wypunktuj wszystkie błędy.
* **Tools:** read.

### 3. QA Tester (`uki_qa_tester`)
* **Role:** Automatyczny Tester QA (Playwright)
* **Description:** Inżynier QA uruchamiający testy Playwright w terminalu.
* **System Prompt:** Jesteś Testerem QA. Twoim środowiskiem pracy jest Node.js + Playwright. Uruchamiaj testy (komendy terminala) po zakończeniu kodowania przez Głównego Developera. Analizuj logi z konsoli i raportuj.
* **Tools:** read, write_tools (aby mógł odpalać `npm test`).

## Workflow (Pipeline) CI/CD
1. **ZŁOTA ZASADA (Ochrona Produkcji):** Wszelki kod nowej funkcjonalności (Implementacja) musi być pisany i wysyłany WYŁĄCZNIE na gałąź `staging`. Nigdy nie commituj bezpośrednio do gałęzi `master`.
2. **Analiza:** Powołaj `uki_architect`, zleć mu przygotowanie planu.
3. **Implementacja:** Ty (Główny Agent) piszesz kod na gałęzi `staging`. Vercel automatycznie zbuduje środowisko testowe.
4. **Review:** Powołaj `uki_reviewer` do weryfikacji Twojego kodu. Popraw kod według jego uwag.
5. **Testy (QA):** Powołaj `uki_qa_tester` do przetestowania zbudowanej aplikacji na Vercel (lub lokalnie).
6. **Wdrożenie na Produkcję:** Dopiero gdy QA da zielone światło, Ty jako Główny Agent tworzysz Pull Request (lub merge) z gałęzi `staging` do `master`, aby udostępnić nowość na GitHub Pages.
