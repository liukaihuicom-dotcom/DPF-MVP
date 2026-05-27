# Migration Guide

## Current Migration

- Use `packages/design-tokens`, `packages/component-library`, and `packages/icon-library` as the independent source-of-truth packages for tokens, base components, and icons.
- Continue using `design-system/` for human-readable overview documentation only.
- Use `design-system-engineering/` for AI runtime orchestration, cross-package dependency rules, QA gates, compatibility mirrors, and migration records.
- Treat `design-system-engineering/01_tokens`, `design-system-engineering/02_components`, and `design-system-engineering/04_icons` as temporary compatibility mirrors until runtime imports and QA consumers have fully migrated.
- Keep executable QA checks in root `scripts/qa/`.
- Add new visual QA artifacts under `qa/visual/`.
