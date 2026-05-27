# Design System Package Dependency Contract

The design system is governed by independent workspace packages.

## Package Boundaries

| Package | Owns | May Depend On |
|---|---|---|
| `@dpf/design-tokens` | tokens, modes, mappings, runtime token exports | none |
| `@dpf/icon-library` | icon registry, local icon assets, icon runtime contract | `@dpf/design-tokens` |
| `@dpf/component-library` | base component manifest, token bindings, component QA | `@dpf/design-tokens`, `@dpf/icon-library` |

## Hard Rules

- `@dpf/design-tokens` must not import component or icon package code.
- `@dpf/icon-library` must not import component-library code.
- `@dpf/component-library` must not import app screens, product state, or business-domain modules.
- App code must not bypass package governance by directly introducing unregistered tokens, unregistered icons, or unmanaged one-off components.
- Compatibility paths are temporary mirrors. Package paths are the source of truth.
