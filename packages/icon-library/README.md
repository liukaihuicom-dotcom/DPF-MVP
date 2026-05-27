# @dpf/icon-library

Source of truth for DPF-MVP local icon governance.

## Owns

- `registry/icon-registry.json`
- `registry/icon.schema.json`
- Local icon assets under `local/iconsax`
- Runtime registry and local component map under `src/`
- Icon naming, usage, source policy, license metadata, and QA

## Dependency Rule

This package may depend on `@dpf/design-tokens` only.

Pages and components must not directly import third-party icon packages, inline functional SVGs, or remote SVG assets.
