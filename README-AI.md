# AI Development Guide

This repository is an admin-template product, not a one-off dashboard.

## Before coding
1. Read `AGENTS.md`.
2. Read `docs/ARCHITECTURE.md`.
3. Read `docs/DESIGN-SYSTEM.md`.
4. Read `docs/ROADMAP.md`.
5. Check existing components before creating a new one.
6. Check existing feature patterns before introducing a new architecture.

## When implementing a feature
1. Define the user-facing goal.
2. Identify reusable UI.
3. Define types and validation.
4. Implement the feature under `features/<feature-name>/`.
5. Connect it to `app/` through a thin route/page.
6. Add loading, empty, error, and success states.
7. Check responsive behavior.
8. Add tests for important behavior.
9. Update documentation if the architecture or public API changes.

## Component rules
Prefer:
`page -> feature -> reusable components -> services/repositories`

Avoid:
`page -> giant component -> direct database/API calls`

## Do not
- Rewrite unrelated files.
- Replace shadcn components with custom primitives without a reason.
- Add `use client` to entire routes unnecessarily.
- Put fake/demo data inside presentation components.
- Hardcode colors when design tokens exist.
- Create multiple components that solve the same problem.
- Introduce premature abstractions.

## Definition of done
A task is complete only when the implementation is functional, type-safe, responsive, accessible, consistent with the design system, and does not break existing routes.
