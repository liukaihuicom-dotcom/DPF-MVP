# @dpf/component-library

Source of truth for reusable DPF-MVP UI component governance.

## Owns

- `registry/component-manifest.json`
- `registry/component.schema.json`
- `registry/component-token-binding.map.json`
- `registry/component-usage-rules.md`
- `qa/component-qa.rules.json`

## Dependency Rule

This package may depend only on `@dpf/design-tokens` and `@dpf/icon-library` inside the design-system package layer.

Business components are not owned by this package during the first migration stage.
