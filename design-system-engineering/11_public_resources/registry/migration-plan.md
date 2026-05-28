# Public Resource Migration Plan

Version: `1.1.0`
Date: `2026-05-28`
Scope: full-site migration from page-local implementation to public-resource references.

## Card Borderless Surface Governance

- Card, page card-like panels, sheet cards, dialog cards, and business card surfaces must not render `borderWidth` or `borderColor`.
- Migrate residual card-like containers to `borderWidth: lineWidth.none` or remove the border properties entirely.
- Keep form/input borders, outline button borders, chips, icon shells, dividers, chart tool chips, and selection indicators as functional control boundaries.
- Future card-like styles are blocked by `QA_STYLE_CARD_BORDERLESS` unless they are functional controls outside the card-surface naming contract.

## Card Radius Governance

- Use `radius.card` for standard Card, page card-like panels, sheet content cards, and business component panels.
- Keep `radius.md` only as a same-value compatibility alias for older non-card surfaces; do not bind new card work directly to `radius.md`.
- Keep `radius.sheet` for BottomSheet and AppViewport device canvas, `radius.full` for pills/circular controls, and `radius.none` for documented full-screen or edge-to-edge surfaces.
- Existing callers do not need prop migration; page-local card-like style blocks should replace `radius.sm`, `radius.md`, `radius.lg`, `radius.xl`, or numeric `borderRadius` with `radius.card`.

## BottomSheet Footer Entrance Sync

- `BottomSheet` remains the public resource for page-triggered mobile sheets and business sheet bodies.
- Fixed footer action areas now enter through the shared `sheetEntranceProgress` and start hidden below the sheet, rather than rendering as a default bottom action zone.
- Existing callers do not need prop or route migration; keep using `bottomSheetPresets.*` and the shared `footer` option.
- Do not add page-local footer wrappers, fixed bottom buttons, or custom sheet hosts to compensate for this interaction.

## Token Semantic Migration 3.0.0

- `token.design-tokens` and `token.color` move to version `3.0.0`.
- Remap trading and market-positive UI to `market.up` / `tone="up"` / `overlay.up`, now green `#2EA379`.
- Remap trading and market-negative UI to `market.down` / `tone="down"` / `overlay.down`, now red.
- Keep feedback success UI on `status.success`, `icon.success`, or `tone="success"`; do not use `market.up` for completed, paid, approved, Toast success, or form-success states.
- Update any old green `down` usage by business meaning rather than by visual color.

## Completed Migration

- Created `src/design-public-assets` as the single page-facing public asset facade.
- Migrated pages and route shells away from direct imports of `src/components`, `src/theme`, `src/icons`, `src/i18n`, and `src/settings/ProductSettings`.
- Replaced duplicated `MetricDescriptionSheet`, `FilterPill`, and funding chart structures with public business components.
- Migrated remaining page-visible literal copy into i18n keys and copy-table entries.
- Updated registries, manifests, copy table, illustration registry, and asset dependency graph.

## Trade Order List Card Container Update

- `TradeOrderList` remains the public resource for position, pending-order, and history-order rows.
- The component Card container now owns the governed order-list horizontal inset through `layout.cardPaddingX`.
- Row-level horizontal padding remains prohibited; rows keep vertical-only touch rhythm and shared divider behavior.
- `/trade` keeps outside page margin on `layout.screenPaddingX`; do not add page-local wrapper cards or padding shells around order lists.

## Full-site Rules Now Enforced

- Pages import public assets through `src/design-public-assets`.
- Pages do not copy public component, token, icon, pattern, or copy implementations.
- Visual values use token aliases; page-level hardcoded color, spacing, radius, shadow, typography, height, or width values are blocked.
- Route screens do not import `react-native-svg`; chart/gauge SVG is allowed only inside registered public business components.
- User-visible copy uses `src/i18n/translations.ts` keys and copy-table coverage.
- Repeated modules that appear two or more times must be registered as public components, business components, or patterns.

## Migration Records

- All 42 graph page records: `reference_migration_complete`.
- All 42 readiness rows: `reference_migration_complete` with token/component/pattern/icon/copy/graph synced.
- `illustration.registry`: approved governance registry with registered icon fallback policy.
- `business.LocalPinSecurityFlow`: approved and implemented-active governance target for the current runtime PIN setup/unlock screen.

## Rollback Path

If any page needs to temporarily return to local implementation:

1. Downgrade the page row to `manual_migration_required` in `asset-dependency-graph.json`.
2. Record the local implementation reason and replacement public asset in this migration plan.
3. Update `public-asset-registry.json` and `change-impact-report.md`.
4. Rerun `pnpm qa:public-resources`, `pnpm qa:style`, `pnpm qa:components`, `pnpm qa:icons`, `pnpm qa:i18n`, and `npx tsc --noEmit`.

## Release Decision

Decision: `production_resource_governed_ready` after QA/typecheck/strict scans pass.

## Planned Security Center Migration

- Stage 1 complete: product/module/page/API/schema/RBAC/rules/state/test contracts are registered as contract-first assets.
- Stage 2 must add `/settings/security-center` runtime route wrapper, `SecurityCenterScreen`, route registry entry, RootLayout stack entry, i18n runtime keys, and typed domain/API service.
- Stage 3 must update `asset-dependency-graph.pages`, readiness matrix, copy table status, and public-resource graph edges after the route exists.
- Stage 4 must run `pnpm qa:page`, `pnpm qa:api`, `pnpm qa:state`, `pnpm qa:security`, `pnpm qa:i18n`, `pnpm qa:icons`, `pnpm qa:public-resources`, `pnpm qa:all`, plus TypeScript.

Blocking rule: do not mark Security Center production UI ready while it is only a planned route or while backend TOTP/GSL/risk/audit services are unimplemented.
