# AI Prompts

## Start Project

Read `AGENTS.md`, `README-AI.md`, `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN-SYSTEM.md`, and `docs/ROADMAP.md`.

Then inspect the repository and implement only the next unfinished P0 task from `docs/AI-TASKS.md`.

Do not jump ahead to later milestones.

## Build a Feature

Read the architecture and design-system documents first.

Implement `<FEATURE>` using the existing patterns.

Requirements:
- Keep the route thin.
- Put domain code under `features/<feature>`.
- Reuse existing UI components.
- Add validation with Zod where input exists.
- Support loading, empty, error, and success states.
- Make it responsive and accessible.
- Add tests for important behavior.
- Do not modify unrelated features.

## Refactor

Before refactoring:
1. Explain the current pattern.
2. Identify duplication or architectural problems.
3. Propose the smallest safe change.
4. Preserve public behavior.
5. Run typecheck, lint, and tests.

Do not refactor for abstraction's sake.

## Review

Review the current implementation against:
- `AGENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN-SYSTEM.md`
- `docs/DEFINITION-OF-DONE.md`

Report:
1. Critical problems
2. Architectural problems
3. UX/accessibility problems
4. Performance problems
5. Testing gaps
6. Recommended fixes

Do not rewrite code unless asked.
