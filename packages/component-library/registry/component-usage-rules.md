# Component Usage Rules

## Route Boundary

- `app/` files are Expo Router entrypoints only.
- Route files may default-export route screens, export Expo Router metadata such as `ErrorBoundary`, and pass route params into `src/screens`.
- Route files must not define reusable uppercase UI components.
- Complex route orchestration belongs in `src/screens`.

## Component Imports

- Prefer `@/src/components` or a governed domain barrel such as `@/src/components/business`.
- Existing deep imports remain tolerated during migration, but new page code should not add deep component imports.
- Functional icons must go through `AppIcon` and semantic names in the icon registry.

## Component Creation

- New reusable UI must live in the correct `src/components` domain.
- New components must be added to `component-manifest.json` before release.
- New financial/business components must also be added to `business-component-manifest.json`.
- Component styles must use `src/theme/tokens.ts`, theme palette values, or icon registry metadata.

## Fail Conditions

- A reusable uppercase UI component is defined inside `app/`.
- A component is exported from `src/components` but missing from `component-manifest.json`.
- A functional icon bypasses `AppIcon`.
- A page recreates Button, Card, Input, Status, Icon, Sheet, List, or financial row patterns instead of using registered components.
