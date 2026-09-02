# Original User Request

## 2026-09-01T17:55:10Z

# Teamwork Project Prompt — Draft

Projekt: Kompleksowa analiza obecnej aplikacji Uki's BodyBuild i stworzenie profesjonalnej dokumentacji architektonicznej oraz standardów Code Review i UX dla przyszłego zespołu agentów.

Working directory: ~/teamwork_projects/ukis_bodybuild_docs
Integrity mode: demo

## Requirements

### R1. Architektura i Stack
Przeanalizuj kod źródłowy aplikacji (Vanilla JS, PWA, lokalna baza SQLite via OPFS) i stwórz plik `architecture_guidelines.md`. Opisz w nim strukturę modułów, przepływ danych (Data Flow) i decyzje architektoniczne.

### R2. Standardy Code Review i UX
Opracuj plik `code_review_standards.md` zawierający konkretne wytyczne, których muszą przestrzegać przyszli programiści (i agenci AI) pracujący nad tą bazą kodu. Wytyczne muszą odnosić się do faktycznego stylu pisania kodu w tym projekcie oraz spójności interfejsu użytkownika (UX).

## Acceptance Criteria

### Weryfikacja jakości (Agent-as-judge Rubric)
Niezależny agent oceniający musi zatwierdzić wygenerowane dokumenty na podstawie następujących, obiektywnych kryteriów:
- [ ] Plik `architecture_guidelines.md` musi fizycznie istnieć i poprawnie opisywać przynajmniej 3 główne moduły (np. DatabaseManager.js, UI, itp.).
- [ ] Dokumentacja musi jawnie wspominać o użyciu OPFS dla bazy SQLite oraz braku frameworków (Vanilla JS).
- [ ] Plik `code_review_standards.md` musi zawierać co najmniej 2 konkretne przykłady kodu wyciągnięte z obecnej aplikacji.
- [ ] Zespół nie może wygenerować żadnego nowego kodu aplikacji – zadanie polega wyłącznie na udokumentowaniu istniejącego ekosystemu.
