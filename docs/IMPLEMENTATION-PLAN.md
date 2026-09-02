# Implementation Plan

## Milestone 1: Bootstrap
Create the Next.js project and configure:
- TypeScript
- Tailwind
- shadcn/ui
- ESLint
- Prettier
- pnpm
- Lexend

Acceptance:
- `pnpm dev` works
- `pnpm build` works
- no TypeScript errors
- no lint errors

## Milestone 2: Admin Shell
Build:
- Dashboard layout
- Sidebar
- Header
- Mobile navigation
- Breadcrumbs
- User menu
- Theme switcher

Acceptance:
- Desktop and mobile layouts work
- Navigation is config-driven
- Theme persists

## Milestone 3: Reusable Data Infrastructure
Build:
- DataTable
- Search
- Filters
- Sorting
- Pagination
- Column visibility
- Row selection
- Empty/loading/error states

Acceptance:
- Users page demonstrates all major table capabilities

## Milestone 4: Forms
Build:
- Form wrapper
- Validation
- Input variants
- Select
- Combobox
- Date picker
- File upload
- Error handling

Acceptance:
- Create/edit user flow works

## Milestone 5: Dashboard
Build:
- Stat cards
- Charts
- Recent activity
- Revenue overview
- Quick actions

Acceptance:
- SaaS dashboard is polished and responsive

## Milestone 6: Business Modules
Implement users, products, orders, projects, billing, notifications, messages, and settings.

## Milestone 7: Authentication and RBAC
Add authentication abstraction, protected routes, roles, permissions, and permission-aware UI.

## Milestone 8: Testing
Add Vitest/Testing Library and Playwright coverage for critical workflows.

## Milestone 9: Documentation
Document installation, customization, architecture, theming, modules, and deployment.
