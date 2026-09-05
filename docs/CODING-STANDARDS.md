# Coding Standards

## TypeScript

- Use strict TypeScript.
- Avoid `any`.
- Prefer discriminated unions for state-heavy components.
- Export reusable types from feature/type files.
- Keep types close to their domain unless shared broadly.

## React

- Prefer Server Components.
- Keep components focused.
- Extract reusable behavior into hooks.
- Avoid unnecessary effects.
- Avoid prop drilling when a composition pattern is clearer.

## Naming

- Components: PascalCase
- Hooks: `useSomething`
- Utilities: camelCase
- Constants: descriptive camelCase or UPPER_SNAKE_CASE when truly constant
- Routes: kebab-case

## Styling

- Use Tailwind utilities.
- Use semantic design tokens.
- Avoid arbitrary values unless necessary.
- Keep repeated class combinations in reusable components.

## Data

- Validate external input with Zod.
- Do not trust client input.
- Keep API/database calls outside presentation components.
- Use URL state for shareable table/search/filter state.

## Error Handling

Every async UI should account for:

- loading
- success
- empty
- error

## Dependencies

Before adding a dependency:

1. Check whether the stack already provides the functionality.
2. Check whether an existing internal component can solve it.
3. Add the dependency only when it materially improves maintainability.
