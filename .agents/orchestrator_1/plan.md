# Master Plan: Architecture Guidelines & Code Review Standards

## Objectives
1. Survey and analyze existing codebase structure, modules, data flow, OPFS SQLite, Vanilla JS UI/UX patterns.
2. Produce comprehensive, production-grade `architecture_guidelines.md` at workspace root.
3. Produce comprehensive `code_review_standards.md` at workspace root with real code snippets and UX rules.
4. Verify with Reviewers, Challengers, and Forensic Auditor that all acceptance criteria are met and no app source code was modified.
5. Create AI Transfer Prompt following GEMINI.md rules and write final handoff.

## Phases & Milestones
- **Phase 0: Survey & Discovery**
  - Spawn 3 parallel explorers:
    - Explorer 1: Module structure & architecture (DatabaseManager.js, AppUI.js, WorkoutManager.js, PWA/ServiceWorker, OPFS SQLite).
    - Explorer 2: Data flow, state management, storage operations, SQL schema & migrations.
    - Explorer 3: Code conventions, Vanilla JS patterns, UX/UI consistency rules, code extraction.
  - Consolidate into `PROJECT.md`.
- **Phase 1: Implementation of `architecture_guidelines.md`**
  - Worker writes `architecture_guidelines.md` in workspace root.
  - Reviewer & Challenger verification.
- **Phase 2: Implementation of `code_review_standards.md`**
  - Worker writes `code_review_standards.md` in workspace root with real code examples and UX standards.
  - Reviewer & Challenger verification.
- **Phase 3: Comprehensive Verification, Audit & Delivery**
  - Reviewers evaluate completeness against acceptance criteria.
  - Challenger verifies physical file existence and criteria satisfaction.
  - Auditor ensures zero app source code modifications and genuine documentation.
  - Prepare AI Transfer prompt and handoff.
