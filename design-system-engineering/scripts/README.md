# Design System Engineering Scripts

Executable QA scripts are centralized in root `scripts/qa/`.

This directory records design-system script ownership and prevents duplicate QA implementations from drifting away from the release gate.

| Design-system area | Root script | Source of truth |
|---|---|
| Tokens and hardcoded styles | `scripts/qa/check-hardcoded-style.js`, `scripts/qa/check-tokens.js` | `packages/design-tokens` |
| Component manifest | `scripts/qa/check-component-manifest.js` | `packages/component-library` |
| Component boundary | `scripts/qa/check-component-boundary.js` | `src/components` until runtime migration |
| Icons | `scripts/qa/check-icons.js` | `packages/icon-library` |
| Workspace boundaries | `scripts/qa/check-workspace-boundary.js` | `pnpm-workspace.yaml`, package manifests |
| Accessibility baseline | `scripts/qa/check-accessibility-baseline.js` | Root app runtime |
| Full gate | `scripts/qa/qa-all.js` | Root QA orchestration |
