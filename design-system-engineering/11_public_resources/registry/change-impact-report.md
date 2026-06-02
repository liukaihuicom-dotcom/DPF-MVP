# Public Resource Change Impact Report

Version: `1.2.3`
Date: `2026-05-29`
Decision scope: token public resource semantic migration.

## 2026-06-02 BottomSheet Public Resource Migration

- Added `component.overlay.BottomSheetActions` as the public scene opener layer for `openActionSheet`, `openDetailSheet`, `openSelectionSheet`, `openConfirmSheet`, `openFixedListSheet`, and `openScrollableDetailSheet`.
- Migrated scattered page-owned sheet bodies into public business components: `PaymentMethodSheet`, `DeviceDetailSheet`, `TransactionDetailSheet`, `AccountMenuSheet`, `AccountMoreSheet`, `ManagerChatSheet`, `ProfileEditSheetContent`, `AuthLanguageSheetContent`, and `CountryPickerSheetContent`.
- Impacted dependents: funding payment method sheets, security login-log device sheets, account balance/details sheets, portfolio/trade account and order sheets, Discover profile sheets, Auth country/language/error sheets, overlay registry, modal registry, dependency graph, and component QA.
- No route, product workflow, user-facing copy semantic, icon semantic, funding/trading/security risk level, or high-risk Modal Queue policy changed.

Decision: `controlled_patch_ready` after TypeScript, component/public-resource/navigation/back-close/style/version/full QA and manual close/scroll smoke verification pass.

---

## 2026-06-02 Instrument Detail Embedded Chart Flush Surface

- Updated `business.TradingTerminalChart` embedded density so the outer surface padding is `spacing.none`, removing the 10px inset seen around the chart block in `/instrument/[id]`.
- Impacted dependents: `/instrument/[id]`, `business.InstrumentDetailWorkspace`, `business.TradingTerminalChart`, component manifests, release records, and visual QA for the instrument detail chart block.
- Terminal and fullscreen chart densities keep their existing spacing and fullscreen layout behavior.
- No route, buy/sell operation, quote data model, chart interaction, icon source, copy promise, API, account-scope rule, or risk rule changed.

Decision: `controlled_patch_ready` after component/style/public-resource/version/type QA and browser visual verification pass.

---

## 2026-06-02 ActionButton Size, State, And Icon Slot Governance

- Extended `component.base.ActionButton` with sm/md/default/lg/xl size presets, leading/trailing icon slots, reserved icon alignment slots, loading labels, disabled reasons, and hover/focus feedback while preserving the locked `filled` / `outline` visual contract.
- Added `token.design-tokens` `3.4.1` button size roles and `typography.buttonSm` so compact and large button labels are token-bound instead of page-local.
- Impacted dependents: all ActionButton consumers through a backward-compatible API; existing `icon` remains a leading-icon alias and existing loading without `loadingLabel` remains spinner-only.
- No route, copy key, product flow, risk rule, icon asset, third-party icon runtime, selected/toggle behavior, or text/ghost/soft variant was added.

Decision: `controlled_patch_ready` after token/component/icon/version/type QA pass.

---

## 2026-06-02 Instrument Detail Header Disclosure And Canvas Icon Background

- Refined `business.InstrumentDetailWorkspace` so `/instrument/[id]` default header renders navigation/actions only; the compact instrument symbol, current price, percentage change, and price change summary appears after scroll.
- Removed page-local header action background wrappers in favor of `component.base.HeaderIconButton` resolving `surface=auto` with `backgroundContext=canvas`.
- Impacted dependents: `/instrument/[id]`, `business.InstrumentDetailWorkspace`, `component.base.HeaderIconButton`, component manifests, component/style QA guards, and release records.
- No route, buy/sell operation, order ticket URL shape, quote data model, icon source, copy promise, API, account-scope rule, or risk rule changed.

Decision: `controlled_patch_ready` after component/style/public-resource/i18n/icon/navigation/back-close/version/type QA and browser visual verification pass.

---

## 2026-06-02 Instrument Detail Public Workspace Governance

- Added `InstrumentDetailWorkspace` as the runtime public business skeleton for `/instrument/[id]`, moving the page frame, quote hero, decision strip, chart, tabs, risk note, and buy/sell footer out of the route container.
- Extended `component.base.HeaderIconButton` with `surface=auto` so filled icon actions on white panel/raised contexts resolve to the governed neutral `IconSurface` background while gray canvas contexts continue to use the panel default.
- Impacted dependents: `/instrument/[id]`, `component.base.HeaderIconButton`, `business.InstrumentDetailWorkspace`, public-resource dependency graph, component manifests, and static QA guards.
- No route, trading action, order ticket URL shape, quote data model, icon source, copy promise, API, account-scope rule, or risk rule changed.

Decision: `controlled_patch_ready` after component/style/public-resource/i18n/icon/navigation/back-close/type QA pass.

---

## 2026-05-29 BottomSheet Horizontal Spacing Governance

- Clarified BottomSheet structural spacing: Header 16px, card content 12px, list/article/detail-introduction content 16px, and Footer 16px.
- Updated the shared BottomSheet runtime so `contentPadding="card"` uses `layout.contentCardPaddingX` at 12px and `contentPadding="plain"` uses `layout.sheetContentPaddingX` at 16px.
- Header and Footer remain on their existing 16px semantic insets: `layout.topBarPaddingX` and `layout.bottomActionArea.paddingX`.
- Impacted dependents: all shared BottomSheet callers. Page `Screen` card-mode content also uses `layout.contentCardPaddingX` at 12px and keeps its existing density.
- No route, copy, icon, API, business flow, account-scope rule, trading action, risk rule, or color token changed.

Decision: `controlled_patch_ready` after token/style/component/public-resource/version/type QA pass.

---

## 2026-05-29 Trading Account Card Selection Surface Governance

- Clarified that trading account selection is a card-based selection sheet, not a plain list picker.
- Updated Markets, Portfolio/Trade, and Funding `TradingAccountContextSwitcher` BottomSheet calls to pass `contentPadding="card"` and `sheetSurface="canvas"`.
- Impacted dependents: `tradingAccount.switchSheet`, `component.business.TradingAccountContextSwitcher`, `component.business.TradingAccountSwitchSheet`, and all account-switcher entries in Markets, Portfolio/Trade, and Funding forms.
- Plain list pickers, country/region selection, language selection, and payment-method selection keep the white `sheetSurface="panel"` behavior unless their content becomes card-based.
- No route, copy, icon, API, account-scope rule, trading operation, funding business rule, or new color token changed.

Decision: `controlled_patch_ready` after style/component/public-resource/version/type QA pass.

---

## 2026-05-29 BottomSheet Surface Governance

- Added governed BottomSheet surface rules: card/detail/form/confirmation content uses `sheetSurface="canvas"` and the gray `surface.canvas` sheet bed; list/picker/selection content uses `sheetSurface="panel"` and the white `surface.panel` sheet bed.
- Updated `component.base.BottomSheet`, `principle.bottomSheet.heightSystem`, sheet component docs, component manifests, component-library version records, and static style QA.
- Impacted dependents: all shared BottomSheet callers. Existing card/detail sheets keep the canvas default; selection sheets now default to the panel surface unless explicitly overridden.
- No route, copy, icon, API, product flow, trading action, account-scope rule, risk rule, or new color token changed.

Decision: `controlled_patch_ready` after style/component/public-resource/version/type QA pass.

---

## 2026-05-29 BottomSheet HeightMode Panel Governance

- Updated `component.base.BottomSheet` to expose governed `heightMode` choices: `adaptive`, `fixed`, and `fullscreen`.
- Rebuilt the public BottomSheet structure so Header, Content, and Footer are direct Panel children; Footer no longer uses `footerComponent`, portal placement, absolute/fixed positioning, measured reserve padding, or independent animation.
- Impacted dependents: all shared BottomSheet callers, with focused coverage for short confirmation/form/detail sheets, long selection/filter sheets, and legacy explicit `snapPoints` callers.
- No route, copy, icon, API, product flow, trading action, account-scope rule, or risk rule changed. Existing explicit `snapPoints` and `contentSizing: 'fill'` callers are preserved through fixed compatibility behavior.

Decision: `controlled_patch_ready` after component/public-resource/version/type/style QA pass; device slow-motion keyboard and pan-down verification remains required before `l5_overlay_ready`.

---

## 2026-05-29 BottomSheet Footer Natural Height Governance

- Updated `component.base.BottomSheet` so fixed-footer sheets no longer add duplicate manual content bottom reserve on top of the shared gorhom footer margin adjustment.
- Impacted dependents: all shared BottomSheet callers with fixed footer actions, with focused coverage for `/trade` and `/portfolio` position detail and pending-order detail sheets.
- Short content now keeps natural content height; over-height content still scrolls inside the shared sheet and avoids the measured footer.
- No page-local sheet implementation, route, copy, icon, API, trading action, or business-risk behavior changed.

Decision: `controlled_patch_ready` after component/public-resource/version/navigation/type QA and browser overlay verification pass.

---

## 2026-05-29 BottomSheet Height And Scenario Principles

- Added `principle.bottomSheet.heightSystem` as a governed dialog-pattern asset in the public resource package.
- New source of truth: `src/design-public-assets/overlays/registry/bottom-sheet-design-principles.md`.
- Defined standard height levels for `content-fit`, `compact`, `medium`, `large`, and `max`, plus scenario rules for action, selection, search selection, filter, detail, form, confirmation, and error-recovery sheets.
- Updated `component.base.BottomSheet`, overlay registry, overlay dependency graph, page overlay matrix, and sheet documentation to reference the new principle.
- No runtime component API, route, business flow, copy, icon asset, or risk rule changed.

Decision: `public_resource_principle_ready` after JSON parse, component manifest, overlay registry, and public-resource QA checks pass.

---

## 2026-05-29 BottomSheet Dismissal And Footer Reserve Governance

- Updated `component.base.BottomSheet` internally so header, content, and fixed footer close through one shared visual progress while the gorhom container owns modal dismissal.
- Changed fixed-footer content reserve from a static `layout.bottomActionArea.contentInset` padding to measured footer height with the existing first-frame fallback.
- Impacted dependents: all pages and public business components that pass `footer` through the shared BottomSheet host, with focused coverage for position detail, pending-order detail, action menu, close confirmation, quick action, and metric description sheets.
- No new public resource was introduced, no public BottomSheet prop was removed, and no route, copy, icon asset, API, product flow, or risk rule changed.

Decision: `controlled_patch_ready` after component/public-resource/type QA and iOS/Android overlay close-path smoke verification pass.

---

## 2026-05-29 Header Icon Neutral Surface Governance

- Added a `surface=neutral` option to `component.base.HeaderIconButton` so filled header icon actions placed on white panel surfaces reuse the governed `IconSurface` neutral background contract.
- Updated `/instrument/[id]` back navigation to consume the shared neutral header icon surface instead of relying on a same-color panel background.
- Impacted dependents: all `HeaderIconButton` consumers through the new optional surface prop; existing gray page, sheet, canvas, auth, AppTopBar, BottomSheet, and ProductControlPanel callers keep the default panel surface.
- No route, copy, icon asset, trading action, API, data, account-scope rule, or risk rule changed.

Decision: `controlled_patch_ready` after component/style/icon/version/public-resource/type QA and browser smoke verification pass.

---

## 2026-05-29 Trading Order Action Sheet Governance

- Added `TradingOrderActionSheet` to `business.OrderPositionDetailSheet` so grouped position and pending-order action menus are owned by the public business component layer.
- Updated `PortfolioScreen` to consume shared order sheet bodies through `bottomSheetPresets` without page-local position/pending-order option sheet shells.
- Impacted dependents: `/trade` and `/portfolio` order workspaces, specifically position options, pending-order options, position detail, pending-order detail, close confirmation, and queued order mutation feedback.
- No product flow, route, icon asset, i18n key, order mutation handler, account-scope rule, or trading risk rule changed.

Decision: `controlled_patch_ready` after component/style/public-resource/i18n/type QA and browser smoke verification pass.

---

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
