# Design System Engineering Changelog

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
- Preserved the registered `TradeOrderList` edge-to-edge exception so order-list rows keep 0px horizontal padding and the outer container controls width.

## v1.7.16-key-value-list-compact-value-typography

- Updated `KeyValueList` compact value typography to use the governed 14px `label.default` role for dense Trade account metric summaries.
- Kept `KeyValueList` detail rows on the larger subtitle role for bottom-sheet and card detail contexts.
- Synced the component-library package version, component manifests, token-binding maps, and release map for the shared typography correction.

## v1.7.15-trade-order-list-external-width

- Updated `TradeOrderList` governance so reusable order-list rows no longer own horizontal padding.
- Clarified that outer containers control order-list left/right width while the component owns vertical rhythm, row dividers, direction icon sizing, and right-side value alignment.
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

- Updated `TradeOrderList` governance so the outer list card uses 0px horizontal padding and row touch/highlight areas reach the list card edges like global menu-list rows.
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
