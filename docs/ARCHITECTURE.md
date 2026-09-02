# Architecture

## Directory Structure

```text
app/
  (auth)/
  (dashboard)/
  api/

components/
  ui/
  layout/
  navigation/
  charts/
  tables/
  forms/
  feedback/
  data-display/

features/
  dashboard/
  users/
  products/
  orders/
  projects/
  billing/
  messages/
  notifications/
  settings/

config/
lib/
  auth/
  db/
  demo/
  permissions/
  services/
  validations/
hooks/
providers/
types/
tests/
```

## Responsibility Boundaries

### `app/`
Routing, layouts, route-level loading/error boundaries, metadata, and thin composition.

### `components/`
Reusable presentation and UI infrastructure.

### `features/`
Business-domain functionality. Each feature can contain components, schemas, actions, types, and services specific to that domain.

### `config/`
Navigation, branding, dashboard configuration, and other customization points.

### `lib/`
Cross-feature infrastructure and utilities.

### `types/`
Shared domain-independent types.

## Data Flow

```text
Route
  ↓
Feature
  ↓
Service / Repository
  ↓
API or Database
```

UI components must not know whether data comes from mock data, REST, Server Actions, or a database.

## Repository Pattern

Use interfaces where multiple data sources are expected:

```ts
interface UserRepository {
  list(): Promise<User[]>
  findById(id: string): Promise<User | null>
  create(input: CreateUserInput): Promise<User>
  update(id: string, input: UpdateUserInput): Promise<User>
  delete(id: string): Promise<void>
}
```

Start with demo/mock implementations where appropriate and make API/database implementations replaceable.

## Server/Client Boundary

Default to Server Components.

Use Client Components for:
- Local interactive state
- Browser APIs
- Event handlers
- Interactive charts/tables/forms
- Theme controls
- Command palette
- Drag and drop

Do not mark parent layouts as client components just to support one interactive child.
