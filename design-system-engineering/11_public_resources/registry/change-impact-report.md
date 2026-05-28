# Public Resource Change Impact Report

Version: `1.1.0`
Date: `2026-05-28`
Decision scope: token public resource semantic migration.

## 2026-05-28 Card Borderless Surface Governance

- Removed residual border styles from card-like page, sheet, dialog, demo, chart, Discover, theme-preview, auth dialog, root error, and developer-console surfaces.
- Updated `component.base.Card`, component manifests, Card docs, public-resource registry, release map, and QA guards so Card and card-like surfaces cannot carry `borderWidth` or `borderColor`.
- Impacted dependents: all pages and public business components that consume Card or card-like panels, with focused runtime changes in auth confirmation/error dialogs, instrument detail chart/spec panels, Discover partner/reward cards, Appearance theme preview, Markets account-header demo cards, root error fallback, and ProductControlPanel.
- Functional borders remain outside this migration: inputs, outline buttons, chips, icon shells, list dividers, chart tool chips, and selection indicators.

Decision: `controlled_patch_ready` after style/component/public-resource/version/type QA passes.

## 2026-05-28 Card Radius Governance

- Added semantic `radius.card` governance to `token.design-tokens` and `token.semantic-layout` so Card, card-like page panels, sheet content cards, and business component panels share one 12px radius role.
- Updated `component.base.Card`, component manifests, token-binding maps, CSS/Tailwind mappings, Card/radius docs, and QA guards so card-like surfaces cannot drift to `radius.sm`, `radius.md`, `radius.lg`, `radius.xl`, or numeric radius values.
- Impacted dependents: all pages and public business components that consume Card or card-like panels, with focused runtime changes in `ProductControlPanel`, `MetricDescriptionSheet`, and root error fallback panel.
- Non-card surfaces keep their role-specific radii: BottomSheet/AppViewport use `radius.sheet`, controls use compact/control roles, pills use `radius.full`, and full-screen/edge-to-edge panels may use `radius.none`.

Decision: `controlled_patch_ready` after token/component/style/public-resource/version/type QA passes.

---

## 2026-05-28 Discover Emotional Icon Tone Patch

- Updated Discover entry and campaign data to carry governed `IconSurfaceTone` values so left-side card icons vary by business mood: profile/service use info, growth/reward uses warning, onboarding/community uses success, and Partner keeps brand emphasis.
- Impacted dependents: `/discover` first-level content cards, Discover campaign rail cards, and `/discover-entry/[id]` hero icon surfaces.
- No icon asset, icon key, route, copy, API, business rule, layout spacing, or component contract changed.

Decision: `controlled_patch_ready` after icon/version/type QA passes.

---

## 2026-05-28 Discover Entry And Header Icon Surface

- Updated `/discover` entry-card copy rhythm so the title and description stack uses the governed `spacing.xs` 4px layer.
- Updated `component.base.HeaderIconButton` so filled icon action containers on gray page, sheet, or canvas backgrounds consume `color.surface.panel` rather than gray subtle surface styling.
- Impacted dependents: Discover first-level entry cards and all top/header actions that use the shared filled `HeaderIconButton` contract, including gray page and BottomSheet header contexts.
- No route, copy, icon asset, product flow, API, data, or breakpoint-specific behavior changed.

Decision: `controlled_patch_ready` after style/component/icon/version/public-resource/type QA and browser smoke verification pass.

---

## 2026-05-28 BottomSheet Footer Entrance Sync

- Updated `component.base.BottomSheet` so fixed footer action areas start hidden below the sheet and follow the shared `sheetEntranceProgress` used by header and content.
- Impacted dependents: all app/H5/web pages and business sheet bodies that pass `footer` actions through the shared `BottomSheet` host, including `/trade` position detail sheets.
- No page-local sheet implementation, route, copy, icon, API, trading action, or business-rule behavior changed.

Decision: `controlled_patch_ready` after style/component/public-resource/type QA and browser smoke verification pass.

---

## 2026-05-28 Trade Order List Card Container Update

- Updated `component.base.TradeOrderList` and `business.TradeOrderList` so the order-list card owns the horizontal list inset through `layout.cardPaddingX`.
- Updated `/trade` / `PortfolioScreen` order-list section outside spacing to use `layout.screenPaddingX` instead of page-local `spacing.lg`.
- Impacted public-resource dependents: Portfolio / Trade workspace position, pending-order, and history-order lists.
- No product flow, route, icon, copy, API, data, order mutation, or account-scope behavior changed.

Decision: `controlled_patch_ready` after component/style/public-resource/type QA passes.

---

## 2026-05-28 Token Semantic Update

- Updated `token.design-tokens` to `3.0.0` and `token.color` to `3.0.0` for the global trading color migration.
- Standard blue changed to `#1F72E8` across token source, runtime compatibility layer, CSS mappings, and design-system mirrors.
- Market color semantics changed to `up = green #2EA379` and `down = red`; old green `down` usages must be remapped by business meaning.
- Feedback success resources remain independent and continue through `status.success`, `icon.success`, success Toast, completed, and paid state contracts.
- Impacted public-resource dependents: all page records that depend on `token.design-tokens` or `token.color`, with focused visual smoke coverage for Markets, Portfolio/Trade, Account PnL, Order Ticket, Funding completed, and success Toast.

Decision: `controlled_major_migration_ready` after token/style/public-resource/version/type QA passes.

---

Decision scope: full-site public-resource reference architecture migration.

## Summary

- Added `src/design-public-assets` as the page-facing runtime facade. It re-exports governed runtime compatibility surfaces only; it does not copy token, component, icon, copy, or registry implementations.
- Migrated route screens to consume tokens, components, business components, icons, copy/i18n, and registry metadata through the public facade.
- Moved remaining duplicated filter and metric explanation structures into public business components and registered them.
- Removed strict-scan page blockers: page hardcoded visual values, page inline SVG, unregistered public-resource imports, and naked visible copy.

## Changed Assets

- Tokens: added semantic size aliases for tab padding, sheet handle height, Discover campaign card width, client avatar, indicator dots, and funding chart dimensions.
- Components: registered `DesignPublicAssetsFacade`, `FilterPillGroup`, `MetricDescriptionSheet`, and `FundingTrendBars` in component manifests.
- Business components: promoted `LocalPinSecurityFlow` to `implemented_active` governance status with runtime source coverage and UX/security gates.
- Patterns: page rows now reference registered page, flow, dialog, state, list, and visualization patterns through the asset dependency graph.
- Icons: route screens remain blocked from page SVG and continue through `AppIcon` / `IconSurface` / registry keys; data visualization SVG stays inside registered chart business components.
- Copy: added `root.error.title`, `common.retry`, and `instrument.marketBriefBrand` to runtime i18n and copy-table.
- Registry/graph: all 42 route registry entries now have synced readiness rows and `reference_migration_complete` status.

## Impacted Pages

- Full route registry coverage: 42/42 routes in `src/navigation/routeRegistry.ts` are represented in `asset-dependency-graph.json`.
- Real screen coverage: 34/34 screen files under `src/screens` import public resources through `src/design-public-assets` or act as route/screen shells.
- High-risk regression focus remains: Portfolio close/modify/delete/detail sheets, Funding deposit/withdraw/transfer/detail, Markets account switch/search/detail, Partner upgrade/client/commission, Auth/PIN, and Security device actions.

## Non-breaking Migration Plan

- No public component props were removed.
- No navigation, API, product workflow, or business rule contract was changed.
- Page visuals were preserved while replacing local style/copy/resource access with governed references.
- Rollback path: if a page temporarily reverts to local implementation, downgrade its graph row from `reference_migration_complete` to `manual_migration_required`, record replacement, and rerun public-resource QA.

## Residual Review Notes

- Indonesian high-risk financial/security copy remains marked for native/compliance review, but it is keyed and tracked rather than page-local.
- Illustration registry is approved as a governance registry with registered icon fallback policy; unknown-source illustration assets remain blocked until separately registered.

## Release Decision

Decision: `production_resource_governed_ready` after QA/typecheck/strict scans pass.

---

Decision scope: Security Center contract-first public-resource registration.

## 2026-05-28 Security Center Contract Package

- Registered `product.security-center-contract`, `pattern.page.securityCenterOverview`, and `pattern.dialog.securityVerification` as planned contract-ready public resources.
- Added `securityCenter.*` planned copy entries to the public copy table with Financial Copy and UX Gate review requirements.
- Kept `/settings/security-center` out of `asset-dependency-graph.pages` because the runtime route is not implemented in this stage; this prevents false route coverage.
- Preserved `/settings/security-log` as the current compatibility/detail surface for device and login review.
- Recorded the local PIN boundary: TOTP/MFA does not force default local PIN setup.

Decision: `conditional_ready_for_contract_review`; blocked from UI release until route implementation, backend security services, copy review, UX Gate, and public-resource page graph coverage are complete.
