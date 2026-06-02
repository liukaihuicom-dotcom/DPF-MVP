# Impact Report

## v2.5.6-bottom-sheet-public-resource-migration

Impact: non-breaking BottomSheet public resource governance migration.

- Runtime app behavior: product routes, business workflows, copy semantics, icon semantics, and risk levels remain unchanged.
- Component/source scope: pages now open complex sheets through `BottomSheetActions`; public sheet bodies live in `src/components/business`.
- Overlay scope: backdrop tap, pan-down, Android Back, nested Back, footer action close, fixed-height scroll, sheet surface, content padding, and safe-area footer behavior remain owned by the shared `BottomSheet` host.
- Regression focus: `/funding/deposit`, `/funding/withdrawal`, `/settings/security-log`, `/account-balance/[id]`, `/portfolio`, `/trade`, `/discover`, and Auth country/language/error sheets.

Decision: `controlled_patch_ready` after TypeScript, component, public-resource, navigation, back-close, style, version, and full QA pass.

## v2.5.2-instrument-detail-public-workspace

Impact: non-breaking instrument detail UI governance correction.

- Runtime app behavior: route params, instrument lookup, buy/sell order ticket routing, toast placeholder actions, quote data, chart fullscreen behavior, and risk copy remain unchanged.
- Component/source scope: `/instrument/[id]` now delegates the page skeleton to `InstrumentDetailWorkspace`; `TradingTerminalChart` supports compact embedded toolbar mode while fullscreen keeps the full terminal toolbar.
- Pattern scope: `instrumentDetailTrading` replaces the generic page-level financial visualization pattern for instrument detail so identity, quote decision data, embedded chart, auxiliary tabs, risk context, and fixed trade actions have a governed order.
- Visual scope: first viewport moves from competing quote metrics, chart tools, tabs, and CTA stacking to a chart-first trading workspace aligned with international quote-page conventions.
- Regression focus: `/instrument/eur-usd`, chart fullscreen open/close, auxiliary tabs, fixed buy/sell bar, stale/closed/restricted quote states, and `/order/[id]` direction routing.

Decision: `controlled_patch_ready` after component, public-resource, style, i18n, icon, navigation, back-close, full QA, TypeScript, and browser preview verification pass.

## v2.4.3-bottom-sheet-horizontal-spacing

Impact: non-breaking BottomSheet spacing governance correction.

- Runtime app behavior: routes, copy, icons, account selection, close lifecycle, and business workflows unchanged.
- Component/source scope: `BottomSheet` card content now consumes `layout.contentCardPaddingX` at 12px; plain/list/article-detail content consumes `layout.sheetContentPaddingX` at 16px; Header and Footer consume 16px semantic inset tokens.
- Visual scope: BottomSheet structural spacing is Header 16px, card content 12px, list/article/detail-introduction content 16px, and Footer 16px.
- Regression focus: account selection sheets, country/language picker sheets, payment method sheets, detail sheets, and confirmation/action sheets.

Decision: `controlled_patch_ready` after style/component/public-resource/version/type QA passes.

## v2.4.2-trading-account-card-selection-surface

Impact: non-breaking BottomSheet surface governance correction for account selection sheets.

- Runtime app behavior: account selection, selected account state, disabled account reasons, route targets, copy, icons, and business workflows unchanged.
- Component/source scope: Markets, Portfolio/Trade, and Funding account-switcher BottomSheet calls now pass `sheetSurface='canvas'` and `contentPadding='card'`.
- Visual scope: trading account selection uses the gray `surface.canvas` sheet bed because the account list is rendered as white selectable cards; plain country/language/picker lists remain on white `surface.panel`.
- Regression focus: `/markets`, `/trade`, `/portfolio`, `/funding/deposit`, `/funding/withdrawal`, and `/funding/transfer` account-switcher sheets.

Decision: `controlled_patch_ready` after style/component/public-resource/version/type QA passes.

## v2.2.0-global-dialog-and-bottom-sheet-governance

Impact: non-breaking dialog governance addition with stricter global modal ownership.

- Runtime app behavior: auth feedback and confirmation flows keep the existing centered visual and caller APIs while using `GlobalDialog` as the single Modal host.
- Component/source scope: `GlobalDialog`, auth feedback wrappers, modal registry, component manifests, public-resource registry, dependency graph, and QA checks.
- BottomSheet scope: no runtime API break; page bottom sheets must continue using `useBottomSheet` with `bottomSheetPresets` or registered business sheet wrappers.
- Preserved technical exceptions: `TextField` web select menu and `TradingTerminalChart` fullscreen remain registered non-business Modal use cases.
- Regression focus: auth contact confirmation, verified-step leave confirmation, PIN error dialog, country picker, account switcher, position/detail sheets, and high-risk confirmation sheets.

Decision: `controlled_minor_ready` after type, style, component, public-resource, and full QA pass.

## v2.1.14-card-borderless-surface-governance

Impact: non-breaking card-surface visual governance correction.

- Runtime app behavior: routes, navigation, copy, API, data, permissions, product workflows, and interactions unchanged.
- Component/source scope: residual border rendering removed from card-like page, sheet, dialog, demo, chart, Discover, theme-preview, auth dialog, root error, and developer-console surfaces.
- Preserved functional borders: form/input states, outline buttons, chips, icon shells, list dividers, chart tool chips, and selection indicators keep their role-specific border contracts.
- Regression focus: auth confirm/error dialogs, instrument detail chart/spec panels, Discover partner tiles and reward cards, Appearance theme preview, Markets account-header demo cards, root error fallback, and ProductControlPanel surfaces.

Decision: `controlled_patch_ready` after style/component/public-resource/version/type QA passes.

## v2.1.8-auth-right-action-stable-slot

Impact: non-breaking shared auth shell layout stability correction.

- Runtime app behavior: login, registration, onboarding, PIN, password recovery, route targets, state, API, copy, and icon assets unchanged.
- Component source: `AuthShell` right action container now reserves two header icon slots and right-aligns one-icon states inside that stable width.
- Visual scope: top-right action area stability only; left close/back background treatment remains unchanged.
- Regression focus: `/auth`, `/auth/register`, `/auth/register-phone`, `/auth/register-password`, `/auth/forgot-password`, `/auth/onboarding`, and `/auth/pin-setup`.

## v2.1.6-auth-nav-action-background

Impact: non-breaking shared auth shell visual correction.

- Runtime app behavior: login, registration, onboarding, PIN, password recovery, route targets, state, API, and copy unchanged.
- Component source: `AuthShell` left-side `HeaderIconButton` keeps a visible `color.surface.subtle` background on auth page surfaces.
- Visual scope: only the left close/back action in auth flows changes; right language action remains ghost.
- Regression focus: `/auth`, `/auth/register`, `/auth/register-phone`, `/auth/register-password`, `/auth/forgot-password`, `/auth/onboarding`, and `/auth/pin-setup`.

## v2.1.0-action-button-two-variant-contract

Impact: breaking foundation component contract change.

- Runtime app behavior: routes, data, API, state, and business workflows unchanged.
- Component source: `ActionButton` now exposes only `filled` and `outline`; default unspecified variant resolves to `filled`.
- Visual scope: mixed background plus outline button styles are removed; secondary actions use transparent outline, primary actions use filled background without border.
- Migration scope: existing `variant="text"`, `emphasis`, implicit soft defaults, and page-local Button background patches were migrated to explicit variants or text-action patterns.
- Regression focus: Auth, Funding, Security Login Log, Discover, Portfolio partner cards, BottomSheet footers, and shared EmptyState action rows.

## v2.0.1-lightbroker-primary-neutral-softening

Impact: non-breaking light-mode semantic color value adjustment.

- Runtime app behavior: routes, data, API, state, copy, and business workflows unchanged.
- Token source: `packages/design-tokens` changed first, then mirrored to `design-system-engineering/01_tokens`, `design-system-engineering/08_code_mapping`, and `src/theme/colors.ts`.
- Visual scope: lightBroker primary text, default primary icons, and active icons soften from `#0A0B0D` to `#1F2329`; secondary and tertiary hierarchy tokens remain unchanged.
- Regression focus: light-mode text readability, default functional icon weight, top-bar action icons, and confirmation that darkTerminal, midnightBlue, overlays, inverse surfaces, and L1 neutral ramps are unchanged.

## v2.0.0-global-market-color-semantics

Impact: breaking design-token semantic meaning change.

- Runtime app behavior: routes, data, API, and product workflows unchanged.
- Token source: `packages/design-tokens` is updated first, then mirrored to `design-system-engineering/01_tokens`, `design-system-engineering/08_code_mapping`, and `src/theme/colors.ts`.
- Market visuals: positive trading values, buy direction, upward movement, profitable PnL, and positive chart divergence now use green `market.up` with `#2EA379`; negative trading values, sell direction, downward movement, and loss PnL use red `market.down`.
- Feedback visuals: success Toast, completed/paid states, password-rule success, and `colors.icon.success` remain on `status.success` and are intentionally not equal to `#2EA379`.
- Regression focus: Markets quote movement, Portfolio/Trade signed values, Account PnL, Order Ticket buy/sell controls, Funding completed states, and success Toast.

## v1.10.0-full-site-horizontal-spacing-contract

Impact: shared layout token and component contract update.

- Runtime app behavior: route, API, state, copy, and business logic unchanged.
- UI components and screens: `Screen`, `BottomSheet`, `AppTopBar`, Card/List row surfaces now consume governed 12px/16px horizontal inset tokens.
- Public resource governance: token, component manifest, token-binding, registry mirror, and QA rules updated so later pages inherit the same contract.
- Migration risk: visual density changes on page/sheet content gutters; mitigated through shared components and browser route checks.

## v1.0.0-production-structure

Impact: documentation and governance structure only.

- Runtime app behavior: unchanged.
- Expo configuration and startup scripts: unchanged.
- UI components and screens: unchanged.
- QA scripts: unchanged execution entry, expanded documentation mapping.
