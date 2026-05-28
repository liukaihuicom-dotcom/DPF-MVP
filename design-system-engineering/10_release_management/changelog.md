# Design System Engineering Changelog

## v2.2.0-global-dialog-and-bottom-sheet-governance

- Added governed `GlobalDialog` as the single centered feedback and confirmation dialog host while preserving the existing centered auth feedback visual design.
- Migrated auth centered feedback and confirmation wrappers to call `GlobalDialog`, leaving bottom selection/detail/menu flows on the existing `BottomSheet` preset system.
- Strengthened QA and public-resource governance so page-level bottom sheets must call the global `BottomSheet` component through `bottomSheetPresets`, and business dialogs cannot own local React Native `Modal` shells.

## v2.1.14-card-borderless-surface-governance

- Removed residual border styles from page, sheet, dialog, demo, chart, Discover, and developer-console card-like surfaces so card grouping is borderless across runtime screens and modal content.
- Synchronized Card manifests and Card docs to state that Card and card-like page/sheet/dialog/business surfaces must not carry `borderWidth` or `borderColor`.
- Added QA guards through `QA_STYLE_CARD_BORDERLESS` and component-manifest checks, and upgraded `@dpf/component-library` to `2.1.14`.

## v2.1.13-country-picker-global-search-list

- Expanded shared `CountryPickerModal` data to 128 mainstream global phone regions while keeping Indonesia first as the default registration country/region.
- Preserved the shared BottomSheet selection contract for the picker: white panel surface, plain list body, explicit max-height snap point, scrollable over-height content, backdrop close, and pan-down close.
- Added localized empty-state copy for unmatched country/region searches and upgraded `@dpf/component-library` to `2.1.13`.

## v2.1.12-card-radius-governance

- Added semantic card radius governance through `radius.card` and synchronized token registries, export maps, CSS variables, Tailwind mappings, radius docs, Card docs, component manifests, and token-binding maps.
- Migrated remaining card-like panels in `ProductControlPanel`, `MetricDescriptionSheet`, and `RootLayout` to `radius.card` while preserving sheet, pill, input, and full-screen radius roles.
- Upgraded `@dpf/component-library` to `2.1.12` and kept `@dpf/design-tokens` at `3.1.0` for the non-breaking radius semantic export.

## v2.1.11-country-picker-stable-shared-sheet

- Stabilized `CountryPickerModal` so the sheet opens once per requested open state and does not re-run on parent callback or selected-country reference changes.
- Added an explicit snap point for the country/region picker so long lists use the shared BottomSheet max-height and scroll behavior instead of unstable dynamic sizing.
- Upgraded `@dpf/component-library` to `2.1.11` and synchronized component manifests for the stable country-picker sheet contract.

## v2.1.10-country-picker-panel-sheet

- Added governed `sheetSurface` support to shared `BottomSheet` presets so list-only sheets can use the white panel surface without changing every sheet.
- Updated `CountryPickerModal` to use `sheetSurface=panel` and `contentPadding=plain`, matching the country/region list contract instead of a card-style sheet body.
- Upgraded `@dpf/component-library` to `2.1.10` and synchronized component manifests for the list-only country picker sheet contract.

## v2.1.9-bottom-sheet-content-opacity

- Fixed shared `BottomSheet` governance so header and content keep full text opacity after presentation while preserving the governed entrance translation.
- Kept fixed footer action entrance/dismissal behavior unchanged.
- Upgraded `@dpf/component-library` to `2.1.9` and synchronized component manifests for the readable bottom-sheet content contract.

## v2.1.8-auth-right-action-stable-slot

- Updated shared `AuthShell` governance so top navigation right actions reserve a stable two-icon slot across login, registration, onboarding, PIN, and password recovery flows.
- Kept single right-side actions right-aligned inside the reserved slot so switching between one and two top-right icons does not shift the visible icon position.
- Upgraded `@dpf/component-library` to `2.1.8` and synchronized component manifests and token-binding maps for the auth top navigation stability contract.

## v2.1.6-auth-nav-action-background

- Updated shared `AuthShell` governance so login, registration, onboarding, PIN, and password recovery left-side close/back actions use a visible token-bound surface background.
- Upgraded `@dpf/component-library` to `2.1.6` and synchronized component manifests and token-binding maps for the auth shell navigation action contract.
- Kept route semantics, registered `icon.system.close` / `icon.system.back`, accessibility labels, touch targets, and right-side language action behavior unchanged.

## v2.1.5-country-picker-row-stack

- Updated shared `CountryPickerModal` governance so auth country options use a two-line text stack: dial code above country or region name.
- Kept selection on the registered `icon.status.check` AppIcon and restored the right-side selected glyph to the default 24px component icon size.
- Upgraded `@dpf/component-library` to `2.1.5` and synchronized component manifests for the auth country picker row contract.

## v2.1.4-bottom-sheet-dismiss-and-reading-gap

- Updated shared `BottomSheet` governance so header, content, and fixed footer actions open and close through the same progress before stack cleanup.
- Added a governed reading gap between sheet content and fixed footer actions for short and scrollable content.
- Upgraded `@dpf/component-library` to `2.1.4` and synchronized component manifests for the public BottomSheet lifecycle contract.

## v2.1.1-discover-entry-and-header-icon-surface

- Tightened `/discover` entry-card title-to-description rhythm to `spacing.xs` so the first-level profile card uses the governed 4px text stack.
- Updated `HeaderIconButton` filled container governance so icon action backgrounds on gray page, sheet, and canvas surfaces use `color.surface.panel` instead of the gray subtle surface.
- Upgraded `@dpf/component-library` to `2.1.1` and synchronized component manifests, token-binding maps, and QA regression checks.

## v2.1.0-action-button-two-variant-contract

- Breaking: locked global `ActionButton` governance to exactly two visual variants, `filled` and `outline`.
- Removed `text`, `legacySoft`, and `emphasis` compatibility from the Button contract so mixed background plus outline styles are blocked.
- Migrated existing Button consumers to explicit variants or text-action patterns and upgraded `@dpf/component-library` to `2.0.0`.

## v2.0.1-lightbroker-primary-neutral-softening

- Updated lightBroker primary neutral semantics so `color.text.primary`, `color.icon.primary`, and `color.icon.active` use `#1F2329` instead of the harder near-black `#0A0B0D`.
- Scoped the change to semantic light-mode primary text/default icon roles without changing L1 neutral ramps, overlays, inverse surfaces, darkTerminal, midnightBlue, component APIs, icon registry, or business flows.
- Upgraded `@dpf/design-tokens` to `3.0.1` and synchronized package registries, engineering mirrors, runtime theme colors, CSS mappings, release map, and token changelogs.

## v1.11.3-bottom-sheet-footer-entrance-sync

- Updated shared `BottomSheet` footer entrance governance so fixed footer action areas start hidden below the sheet and follow the shared sheet entrance progress with header and content.
- Disabled fixed footer pointer events until the shared entrance completes, preventing bottom actions from being visible or usable by default during presentation.
- Synced component-library version records, manifests, and style QA coverage for the public BottomSheet footer entrance contract.

## v1.11.2-discover-entry-description-typography

- Updated Discover entry card descriptions to use the governed 14px `body.secondary` typography role instead of compact 12px caption text.
- Scoped the change to `/discover` entry-card copy hierarchy with no entry order, route, icon, copy, touch-target, breakpoint, or global typography-token change.
- Synced component-library version records, release map, and style QA coverage for the Discover entry description typography contract.

## v1.11.1-trade-order-list-card-container

- Updated `TradeOrderList` governance so the order-list Card container owns the horizontal content inset through `layout.cardPaddingX`, matching the full-site card spacing contract.
- Preserved row-level vertical-only padding and shared direction icon, divider, right-value, disclosure, and accessibility behavior.
- Updated the Trade workspace order-list section to use `layout.screenPaddingX` for outside page margin and synced component manifests, token-binding maps, business-component QA wording, QA guards, and component-library version records.

## v1.11.0-instrument-terminal-chart

- Added the governed `TradingTerminalChart` business component for `/instrument/[id]`, covering K-line, line, area, mainstream timeframes, pan/zoom, crosshair OHLCV, indicators, drawing tools, fullscreen, and quote exception states.
- Updated the instrument detail page to show dense professional quote, range, contract, lot, swap, margin, quote status, and quote time data in the main quote area.
- Synced component manifests, business-component manifest, public resource registry, asset dependency graph, icon SVG allowance, i18n keys, and component-library version records for the new public business asset.

## v1.10.3-fund-action-icon-semantic-tones

- Updated `FundActionGrid` governance so deposit actions render with success green, withdrawal actions with warning amber, and transfer actions with info blue.
- Scoped the change to shared funding action icon tone mapping without changing icon assets, labels, routes, funding behavior, or touch targets.
- Synced component-library version records and component manifests for the funding action tone correction.

## v1.10.2-accounts-list-card-visual-tuning

- Tuned the `/accounts` trading account list card visual rhythm: currency metadata now uses `spacing.xxs`, the account number/description stack uses a token-bound 2px layer, and equity/PnL labels use `typography.captionRegular`.
- Scoped the change to the Accounts page card composition without changing global typography tokens, base component APIs, copy, icons, routes, data, or business flow.
- Synced component-library version records for the page-level visual correction.

## v2.0.0-global-market-color-semantics

- Upgraded `@dpf/design-tokens` to `3.0.0` because market color semantics changed meaning across the design system.
- Changed standard blue to `#1F72E8` in primitives, light-mode information/link/accent semantics, solid fills, registry mirrors, and CSS variable mapping.
- Migrated market semantics to global convention: `market.up` uses trading green `#2EA379`, `market.down` uses red, and feedback success remains isolated on `status.success` / `icon.success`.
- Added migration and QA guard expectations so old code that treated `down` as a positive green must be remapped by business meaning.

## v1.10.1-bottom-sheet-keyboard-dismissal

- Updated shared `BottomSheet` interaction governance so opening or stacking a BottomSheet dismisses the active mobile keyboard and releases input focus first.
- Kept close and nested-back behavior unchanged, preserving existing backdrop, pan-down, footer-action validation, and sheet-stack flows.
- Synced component-library versioning, manifests, release map, and style QA so keyboard dismissal remains owned by the shared BottomSheet host.

## v1.10.0-full-site-horizontal-spacing-contract

- Added the governed full-site horizontal spacing policy: page and sheet headers plus bottom action areas use 16px, card-mode content uses 12px, plain/form content uses 16px, and global Card/List content defaults to 12px.
- Added semantic token roles for card/plain/top-bar content insets and updated `Screen`, `BottomSheet`, `AppTopBar`, list/row components, manifests, token bindings, spacing docs, and QA guards.
- Kept theme backgrounds semantic through `colors.surface.*` instead of hardcoding gray or white, preserving light/dark theme behavior.

## v1.9.1-public-resource-first-batch-reference-migration

- Completed first-batch page migration from page-local implementation toward public-resource references for Portfolio, DiscoverModule, Markets, InstrumentDetail, AccountDetails, and Appearance.
- Promoted implemented business assets to active governance: `TradingAccountContextSwitcher`, `OrderPositionDetailSheet`, `MetricCluster`, `FinancialTrendChart`, `RiskGauge`, `PartnerPortalSummary`, `RewardSummaryCard`, `VerificationStatusCard`, and `ThemePreviewSelector`.
- Synchronized public asset registry, asset dependency graph, copy table, business-component manifest, pattern status, migration plan, and change impact report for the migrated page set.
- Updated icon governance so registered data-visualization components may own internal SVG while route screens remain blocked from `react-native-svg`.
- Left planned illustration assets and the Local PIN security flow as conditional follow-up items instead of marking them production-complete.

## v1.9.0-codex-app-preview-device-canvas

- Added governed Codex app preview viewport roles for the 390 x 844 native app simulation canvas and web-only safe-area insets.
- Updated `AppViewport` and `RootLayout` governance so product route pages are clipped to the app canvas in Codex/browser preview while native iOS/Android keep real device dimensions.
- Preserved `ProductControlPanel` as an independent developer-tool module outside `AppViewport`, with drag behavior and QA guards preventing future clipping inside the phone canvas.

## v1.8.0-public-resource-runtime-governance

- Added `design-system-engineering/11_public_resources` as the governed public resource package for public asset registry, dependency graph, copy table, illustration registry, migration plan, impact report, deprecated-assets record, and QA checklist.
- Registered assets across token, base component, business component, pattern, icon, copy, illustration, QA, and handoff layers so pages can move from copied modules to referenced public resources.
- Added dependency graph coverage for all 42 runtime routes from `src/navigation/routeRegistry.ts`.
- Registered migration targets for repeated page-local modules: trading account switcher, order/position detail sheets, metric clusters, financial chart/gauge modules, Discover partner/reward/verification cards, theme preview selector, and local PIN security flow.
- Added `qa:public-resources` and wired it into `qa:all` so public-resource registry, graph, copy-table, pattern, and high-risk page coverage are machine-checked.

## v1.7.20-design-public-resource-package-governance

- Added the Design Public Resource Package Governance Skill as a Design System Engineering Add-on.
- Updated AGENTS routing so public resources, reusable modules, registry checks, dependency graphs, impact reports, migrations, replacements, and release decisions are governed before page or design-system delivery.
- Kept the new skill as an add-on rather than a peer core skill, preserving the Product Skill, Design System Skill, UI Build Skill, and UX Gate execution chain.

## v1.7.19-account-overview-weight-tuning

- Added `label.metric` typography governance for 14px regular secondary metric labels beside primary financial figures.
- Updated `DescribedLabel` governance from 16px semibold to the 16px medium title role for primary metric explanation labels.
- Applied the Accounts overview label-weight tuning without changing values, layout, copy, route behavior, or responsive breakpoints.

## v1.7.18-bottom-sheet-global-governance

- Updated BottomSheet governance so all mobile bottom-sheet interactions route through `GlobalBottomSheetHost`, `useBottomSheet`, and shared presets.
- Added synchronized entrance requirements for header, content, and fixed footer actions, plus static QA blockers for page-owned sheet shells, scrims, handles, SafeArea bottom hosts, and direct `BottomSheetModal` usage.
- Migrated QuickActionSheet governance to a content-only shared-host module and synced modal registry, modal maps, component manifests, package version, and release map.

## v1.7.17-card-axis-padding

- Added axis-specific card padding tokens so full-site card and panel surfaces use a 12px horizontal content inset while keeping default 16px vertical rhythm.
- Updated shared `Card` governance, runtime usage, component manifests, token-binding maps, and style QA to prevent card-like surfaces from returning to scalar `spacing.lg` horizontal padding.
- Preserved the registered `TradeOrderList` row-level exception so order-list rows keep 0px horizontal padding and horizontal spacing can be governed centrally.

## v1.7.16-key-value-list-compact-value-typography

- Updated `KeyValueList` compact value typography to use the governed 14px `label.default` role for dense Trade account metric summaries.
- Kept `KeyValueList` detail rows on the larger subtitle role for bottom-sheet and card detail contexts.
- Synced the component-library package version, component manifests, token-binding maps, and release map for the shared typography correction.

## v1.7.15-trade-order-list-external-width

- Updated `TradeOrderList` governance so reusable order-list rows no longer own horizontal padding.
- Clarified that row content does not own order-list left/right width while the component owns vertical rhythm, row dividers, direction icon sizing, and right-side value alignment.
- Synced the component-library package version and release map for the shared order-list spacing correction.

## v1.7.14-screen-safe-bottom

- Updated `Screen` governance so route scroll content always reserves `layout.screenBottomPadding` plus the device bottom safe-area inset.
- Deprecated production use of `contentBottomPadding='none'` and removed the flush no-bottom-padding variant from the component contract.
- Synced design-token and component-library package versions for the full-site bottom safety rule.

## v1.7.13-header-icon-default-primary

- Updated `HeaderIconButton` runtime governance so default top-bar actions defer to `AppIcon` and consume neutral primary `color.icon.primary`.
- Added style QA coverage to prevent default header icon buttons from forcing tertiary color unless `tone="tertiary"` is explicitly supplied.
- Synced the component-library package version and release map for the header icon color correction.

## v1.7.12-account-overview-label-typography

- Updated `DescribedLabel` governance so primary metric explanation labels use the 16px `typography.titleMd` role.
- Updated the Accounts overview side metric labels to use the 14px `typography.caption` role while keeping metric values unchanged.
- Synced the component-library package version and component manifests for the account overview typography adjustment.

## v1.7.11-icon-surface-neutral-primary

- Updated `IconSurface` default/neutral behavior so the icon itself uses neutral primary `color.icon.primary` with or without a painted background.
- Preserved explicit `tertiary` icon surfaces for low-emphasis metadata, passive helper, or disclosure contexts.
- Synced component manifest, icon usage rules, icon QA rules, package versions, and release map for the unified default icon color contract.

## v1.7.10-trading-account-icon-alignment

- Updated `icon.account.trading` governance so all trading-account entry points use the same local Wallet glyph as the bottom-navigation Accounts tab.
- Preserved semantic icon keys and migration aliases while syncing icon registry, runtime mirror, icon-library package version, usage rules, and release map.

## v1.7.9-segmented-tab-large-label

- Added `label.controlLarge` typography governance for explicit 16px high-emphasis segmented-tab labels.
- Updated `SegmentedTabs` governance with a `labelSize.large` variant and migrated the Trade order-view tabs to use it without changing default segmented tabs.

## v1.7.8-icon-default-neutral-primary

- Updated `AppIcon` default color governance so pure no-background icons use the neutral primary `color.icon.primary` token instead of the tertiary gray token.
- Preserved explicit `brand` and `tertiary` tone usage for selected/product emphasis and low-emphasis disclosure or metadata icons.
- Synced component and icon-library package version records for the default icon color contract change.

## v1.7.7-icon-default-gray-variant-governance

- Updated `AppIcon` default color governance so pure no-background icons use the neutral gray tertiary icon token.
- Updated `IconSurface` neutral/default governance so visible surfaces render gray icons on neutral subtle backgrounds, while `background="hidden"` remains the no-painted-background alignment variant.
- Updated `HeaderIconButton` default governance so top/header actions use the gray tertiary icon token unless a semantic tone is explicitly required.
- Synced neutral Discover, Funding, Portfolio, and Onboarding icon usages away from page-level brand tone overrides.

## v1.7.6-discover-entry-card-copy-spacing

- Increased Discover entry card title-to-description spacing to `spacing.sm` so mobile module cards keep card-list readability instead of compact menu-row density.

## v1.7.5-trade-account-summary-density

- Added `Screen.contentBottomPadding` governance for flush first-screen task layouts that must remove default scroll-bottom whitespace while preserving normal page and sticky-footer safe-area behavior.
- Tightened the Trade workspace account summary panel to token-bound 16px padding on all sides.

## v1.7.4-key-value-list-compact-density

- Tightened `KeyValueList` compact variant row gaps for account metric summaries.
- Kept `KeyValueList` detail variant spacing unchanged for modal and card detail rows.

## v1.7.3-trade-order-list-horizontal-edge

- Earlier `TradeOrderList` governance moved horizontal spacing out of individual rows so the list card/container contract could own the left/right inset.
- Preserved row-owned internal padding, divider behavior, and trading direction icon/value alignment.

## v1.7.2-bottom-sheet-footer-height

- Fixed `BottomSheet` content-height governance so short sheets with footer actions no longer add a fixed bottom content inset.
- Clarified that footer action avoidance must use the sheet footer's measured height, while short content remains naturally sized and only over-height content scrolls.

## v1.7.1-trade-order-list-card-padding

- Updated `TradeOrderList` governance so the outer list card uses 0px vertical padding and row padding owns the vertical rhythm.

## v1.7.0-trade-order-list-component

- Added governed `TradeOrderList` business component for reusable trading position, pending-order, and history-order list rows.
- Migrated the Trade workspace order lists so left-side direction icons use the component `sizeVariant` contract instead of page-local row/icon composition.

## v1.6.4-trade-account-shortcut-icon

- Updated Trade workspace account quick-action entry governance so shortcut buttons use `IconSurface` sizing/background and the registered function-center icon instead of page-local icon shells.

## v1.6.3-global-menu-list-descriptive-spacing

- Moved contained descriptive menu-card padding and row spacing into `GlobalMenuList` so page sheets stop defining local menu interior spacing.
- Updated the position-options bottom sheet to use clearer module separation and a text-only header title.

## v1.6.2-keyboard-bottom-action-spacing

- Added keyboard-visible `layout.bottomActionArea.*` spacing governance for iOS form footers and sticky primary actions.
- Updated shared `Screen`, `AuthShell`, and order-ticket footer behavior so native keyboard lift does not stack with bottom safe-area padding.

## v1.6.1-status-pill-two-appearance

- Updated `StatusPill` governance so tag visuals support only `filled` text + background or `outline` text + line.
- Removed the combined background + outline tag style from the component contract.

## v1.6.0-spacing-semantic-governance

- Promoted spacing from a base scale into production semantic `layout.*` roles for page modules, sections, cards, list rows, forms, controls, BottomSheet content, quote groups, and dense data rows.
- Updated spacing documentation with a semantic usage matrix, gap/padding/margin/inset rules, and a formal new-token review path.
- Added registry and export-map coverage so future projects can consume spacing by layout meaning instead of page-local numeric choices.

## v1.5.1-switch-accessory-visual-size

- Corrected `SwitchControl` so its 44px touch target no longer stretches the visual switch background in menu rows.
- Reduced switch visual size to a smaller 40px track and 20px thumb while preserving accessible hit area.

## v1.5.0-icon-surface-fill-action

- Added `IconSurface styleVariant` governance so icon surfaces can render full/fill glyphs for active or emphasized IM actions while keeping one tone bound to both icon and background.
- Updated the Profile relationship manager card to use a registered IM conversation icon and open a bottom-sheet IM dialogue instead of rendering a static community icon.

## v1.4.0-status-pill-plain-trend

- Added `StatusPill appearance="plain"` for semantic trend and status labels that need text-only emphasis without background fill or border.
- Updated the Partner Portal card composition so rebate copy, primary value, exact value, and trend label form one data module with the chart anchored at the card bottom and no internal divider lines.

## v1.3.1-menu-icon-alignment

- Updated `GlobalMenuList` so left-side icons render as pure 24px `AppIcon` glyphs aligned to the row content start, with no hidden `IconSurface` background slot.

## v1.3.0-icon-surface-governance

- Added `IconSurface` as the governed component for icon + background compositions.
- Added icon surface size and tone rules so icon color and background color resolve from the same semantic family.
- Standardized disclosure arrows to 16px tertiary pure icons without backgrounds.
- Added 8px `nano` and 12px `micro` icon size naming and updated icon QA rules for full-site enforcement.

## v1.2.3-form-state-size-governance

- Split form interaction border state from populated content state so blurred populated fields return to 1px while retaining emphasized value text.
- Added `lg` form size governance for 66px high-emphasis input shells.
- Set initial and focused form labels to the primary neutral text token.

## v1.2.2-form-active-border-width

- Updated shared form field focus, inputting, validation, success, and error borders to use the 2px `lineWidth.selected` token.
- Preserved no-jump form behavior by requiring active border width changes to offset shell padding against the default border baseline.

## v1.2.1-card-borderless-container

- Removed the default line token binding from the shared `Card` container.
- Preserved governed card radius, spacing, surface, compact, and highlight elevation behavior.

## v1.2.0-title-typography-governance

- Added semantic title roles for page, compact page, dialog, sheet, card, section, list, list item, segmented tab, and bottom tab titles.
- Bound title roles to runtime `titleTypography` and `AppText` `title.*` variants.
- Added governance rules so new page, dialog, card, list, and tab titles cannot choose generic typography variants or hardcoded sizes.
- Added semantic body roles and label roles so正文, helper text, metadata, status labels, compact controls, and minimum 12px text are governed separately.
- Set minimum text to 12px only through `label.minimum`, `label.status`, or `title.bottomTabs`.

## v1.1.0-icon-size-style-governance

- Expanded icon size tokens and registry governance to 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64.
- Set 24px as the default functional icon size and added governed line/fill style variants.
- Standardized linear icon stroke width to 1.5px through `lineWidth.icon.default`.
- Updated icon QA rules for default size, size scale, style contract, and stroke-width contract.

## v1.0.0-production-structure

- Added L5 design-system engineering directories for principles, patterns, platform modes, AI runtime, code mapping, QA gates, release management, and scripts.
- Added machine-readable token, pattern, platform, AI runtime, and QA mapping assets.
- Mapped existing `design-system/` documentation into engineering governance without redefining visual rules.
## 0.3.1 - 2026-05-26

- Updated `icon.system.back` and `icon.system.close` to custom-owned local glyphs for universal header navigation and dismissal affordances.
