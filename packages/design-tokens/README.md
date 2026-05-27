# @dpf/design-tokens

Source of truth for DPF-MVP design tokens.

## Owns

- Token index and DTCG color tokens in `registry/`
- Theme mode matrix and token export mapping
- Runtime token exports in `src/tokens.ts` and `src/colors.ts`
- CSS variables and Tailwind mappings in `mappings/`
- Token QA rules in `qa/`

## Dependency Rule

This package must not depend on `@dpf/component-library` or `@dpf/icon-library`.

## Compatibility

`src/theme/tokens.ts` and `src/theme/colors.ts` remain compatibility runtime paths during migration. New governance and AI runtime reads must use this package first.
