<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Next.js Multi-Purpose Admin Template

## Mission
Build a production-ready, reusable, multi-purpose admin template with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

The template must support SaaS, CRM, e-commerce, analytics, project management, finance, CMS, and internal business applications.

## Engineering Principles
- Prefer simple, composable abstractions over large framework-like abstractions.
- Keep Server Components as the default.
- Use Client Components only where interactivity requires them.
- Do not duplicate UI patterns.
- Keep business features isolated under `features/`.
- Keep reusable primitives under `components/`.
- Keep configuration separate from implementation.
- Do not hardcode navigation in page components.
- Do not put business logic directly into UI components.
- Prefer TypeScript strictness and explicit types.
- Avoid unnecessary comments; code should be self-explanatory.
- Every feature should support loading, empty, error, and success states.
- Design mobile-first and accessible.
- Do not add dependencies without a clear reason.

## Stack
- Next.js 16+
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- React Hook Form
- Zod
- TanStack Table
- TanStack Query where client-side server state is needed
- Zustand only for genuine client-global state
- nuqs for URL state
- Recharts
- date-fns
- next-themes
- Auth.js
- Drizzle ORM
- PostgreSQL
- Vitest + Testing Library
- Playwright
- pnpm

## Default Font
Lexend.

## Required Quality
- Responsive
- Accessible
- Keyboard navigable
- Dark/light/system themes
- Type-safe
- Testable
- Production-oriented
- Easy to customize
