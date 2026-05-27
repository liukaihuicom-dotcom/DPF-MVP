# @dpf/component-library Changelog

## 1.6.12 - 2026-05-27

- Updated `DescribedLabel` primary metric labels to use the governed 16px medium `typography.titleSm` role.
- Updated Accounts overview side metric labels to use the new 14px regular `label.metric` role while preserving value typography.

## 1.6.11 - 2026-05-27

- Updated `BottomSheet` so header, content, and fixed footer actions share one synchronized entrance layer and reveal as a single bottom panel.
- Kept shared backdrop tap, pan-down dismissal, measured fixed footer, dynamic height, and footer margin adjustment inside `GlobalBottomSheetHost`.
- Migrated `QuickActionSheet` into a pure content module rendered through the shared `BottomSheet` action-menu preset, removing its self-owned scrim, handle, SafeArea bottom shell, and absolute bottom host.
- Added governance and QA coverage that blocks page-level bottom sheet shells, direct `BottomSheetModal` usage, page-owned scrims, and separate footer/content entrance timing.

## 1.6.10 - 2026-05-27

- Updated shared `Card` default padding to use axis-specific card tokens: 12px horizontal via `layout.cardPaddingX` and 16px vertical via `layout.cardPaddingY`.
- Updated compact `Card` padding to use 12px horizontal and 12px vertical compact axis tokens while preserving the existing props API and style override escape hatch for registered exceptions.
- Migrated custom card-like account, discovery, funding, portfolio, detail, empty-state, and error panel surfaces to the same 12px horizontal card inset contract.
- Updated `KeyValueList` compact values to use the governed 14px `label.default` typography role while keeping detail rows on the larger subtitle role.
- Synced the component token-binding metadata so the shared account metric summary records its typography dependency.

## 1.6.9 - 2026-05-27

- Removed `TradeOrderList` row-level horizontal padding so trading order rows no longer own left/right width.
- Clarified that the outer container owns horizontal width for reusable trading order lists, while the list component keeps vertical row rhythm, dividers, direction icons, and right-side value alignment.

## 1.6.8 - 2026-05-27

- Updated shared `Screen` scroll content so all route pages reserve `layout.screenBottomPadding` plus the device bottom safe-area inset.
- Deprecated production use of `contentBottomPadding="none"` so flush pages can no longer remove the global bottom safety gap.

## 1.6.7 - 2026-05-27

- Updated `HeaderIconButton` default tone handling so `tone="default"` defers to `AppIcon` and the neutral primary `color.icon.primary` token.
- Preserved `tone="tertiary"` as an explicit low-emphasis header action option instead of forcing it for all default top-bar icons.

## 1.6.6 - 2026-05-27

- Increased the `DescribedLabel` default label typography to the governed 16px `typography.titleMd` role for primary metric explanation labels.
- Updated the Accounts overview side metric labels to use the governed 14px `typography.caption` role.

## 1.6.5 - 2026-05-27

- Updated `IconSurface` neutral/default behavior so the icon itself uses the neutral primary `color.icon.primary` token whether the background is visible or hidden.
- Preserved `tone="tertiary"` as an explicit low-emphasis option for passive metadata, helper, or disclosure surfaces.

## 1.6.4 - 2026-05-27

- Added `SegmentedTabs.labelSize` with `default` and `large` label sizing variants.
- Updated the Trade workspace order-view tabs to opt into the 16px large segmented-tab label variant while preserving default 14px segmented tabs elsewhere.

## 1.6.3 - 2026-05-27

- Updated `AppIcon` so no-tone pure icons default to the neutral primary `color.icon.primary` token instead of the tertiary gray token.
- Clarified component governance so ordinary icon defaults are neutral primary, while brand and tertiary tones remain explicit semantic choices.

## 1.6.2 - 2026-05-27

- Updated `BottomSheet` overflow detection so fixed footer height participates in the max-height cap before scroll is enabled.
- Kept short footer sheets on the non-scroll container while preserving footer avoidance for genuinely over-height content.

## 1.6.1 - 2026-05-27

- Updated `AppIcon` so no-tone pure icons default to the gray `tertiary` icon token.
- Updated `IconSurface` neutral/default behavior so visible icon backgrounds render gray icons on neutral subtle surfaces, while `background="hidden"` remains the no-painted-background alignment variant.
- Updated `HeaderIconButton` default icons to use the gray tertiary icon token instead of text-primary emphasis.
- Migrated neutral Discover, Funding, Portfolio, and Onboarding icon-surface usages away from page-level brand tone overrides.

## 1.6.0 - 2026-05-27

- Added governed `SegmentedTabs` variants for pill filter tabs and underline content tabs, including selected and disabled state contracts.
- Migrated Markets category tabs, instrument detail tabs, and portfolio order-view tabs from page-local tab rendering to the shared component.

## 1.5.6 - 2026-05-27

- Increased the Discover entry card title-to-description gap to the governed `spacing.sm` rhythm so mobile card-list copy does not read as a cramped menu row.

## 1.5.5 - 2026-05-27

- Added an explicit `Screen.contentBottomPadding` contract so flush, first-screen task layouts can remove default scroll-bottom whitespace without changing sticky-footer or normal page safe-area behavior.
- Tightened the Trade workspace account summary panel to 16px token-bound padding on all sides.

## 1.5.4 - 2026-05-27

- Tightened the `KeyValueList` compact variant row gap for account metric summaries while keeping the detail variant unchanged.

## 1.5.3 - 2026-05-27

- Updated `TradeOrderList` card horizontal padding to 0px so row touch/highlight areas follow the global menu-list edge contract.
- Preserved governed row content padding, dividers, direction-icon sizing, and right-side value alignment.

## 1.5.2 - 2026-05-27

- Fixed `BottomSheet` short-content height with footer actions by removing the extra fixed content bottom inset and relying on the sheet footer's measured margin adjustment.
- Kept long-content sheets scrollable with real footer-height avoidance while short detail sheets stay naturally sized.

## 1.5.1 - 2026-05-27

- Updated `TradeOrderList` card vertical padding to 0px while preserving governed row padding and dividers.

## 1.5.0 - 2026-05-27

- Added governed `TradeOrderList` for reusable trading position, pending-order, and history-order rows with token-bound row spacing, dividers, right-side values, disclosure icons, and `TradeDirectionIcon` sizing.
- Migrated the Trade workspace order lists from page-local row composition to the shared list component so later same-type trading lists can reuse the contract.

## 1.4.14 - 2026-05-27

- Updated the Trade workspace trading-account shortcut entry to use the governed `IconSurface` size/background contract with the registered function-center shortcut icon.

## 1.4.13 - 2026-05-27

- Updated funding form selector left icons to use default-tone `IconSurface` backgrounds instead of bare page-local `AppIcon` glyphs.

## 1.4.12 - 2026-05-27

- Updated `TradingAccountSwitchSheet` left-side account icons to use the governed `icon.wallet.balance` asset for equity and available-funds semantics.
- Lowered the switch-sheet account icon hierarchy by rendering it as a smaller default-tone `IconSurface` with a governed icon background across all account switcher callers.

## 1.4.11 - 2026-05-27

- Updated `BottomSheet` so header, content, and footer action areas share the same sheet background.
- Removed the `BottomSheet` footer divider and limited vertical content scrolling to sheets whose content exceeds the available height.
- Synced the global `BottomSheet` contract across registered sheet callers so pages no longer own footer background, divider, or short-content scroll behavior.

## 1.4.10 - 2026-05-27

- Updated `GlobalMenuList` contained descriptive rows so card interior padding and row icon/text spacing are governed by shared list-row and control-gap tokens.
- Removed page-level menu-card horizontal padding from the portfolio option sheets so menu list spacing is owned by the reusable component.

## 1.4.9 - 2026-05-27

- Added governed `ConfirmActionSheet` for high-risk confirmation content inside the shared BottomSheet host.
- Registered the component contract so trading, security, funding, and account confirmations avoid platform-native `Alert.alert` and `window.confirm` fallbacks.

## 1.4.8 - 2026-05-27

- Updated shared `Screen` sticky footers and `AuthShell` footers to collapse bottom safe-area padding while the native keyboard is visible on iOS.
- Added shared keyboard visibility handling for governed bottom action areas so primary form actions remain close to the keyboard without covering inputs.

## 1.4.7 - 2026-05-26

- Updated `StatusPill` to support only two tag visuals: text with semantic background and no border, or text with semantic outline and no background.
- Removed the combined background + border tag rendering from the governed component contract.

## 1.4.6 - 2026-05-26

- Increased the country and region picker selected check icon to the governed 20px small icon size.

## 1.4.5 - 2026-05-26

- Updated shared header icon actions to use the primary text icon token by default, matching title/header contrast rules.

## 1.4.4 - 2026-05-26

- Centered empty floating-label form text by field size in phone Expo previews while preserving focused and filled label behavior.

## 1.4.3 - 2026-05-26

- Prevented modal and bottom-sheet titles from auto-shrinking during phone preview by keeping governed `title.sheet` and `title.dialog` typography roles.

## 1.4.2 - 2026-05-26

- Prevented app top-bar page titles from auto-shrinking during phone preview by allowing root titles to keep the governed page-title size across two lines.

## 1.4.1 - 2026-05-26

- Corrected `SwitchControl` sizing by separating the 44px touch target from the smaller visual switch track.
- Reduced the switch visual to a 40px track with a 20px thumb for menu accessory use.

## 1.4.0 - 2026-05-26

- Added `IconSurface styleVariant` so governed icon-background compositions can render line or fill/full icon glyphs without separating icon and background color control.
- Updated the Profile relationship manager entry to use a full-style IM icon and open an in-app IM conversation sheet.

## 1.3.0 - 2026-05-26

- Added `StatusPill appearance="plain"` for semantic trend/status labels that need text-only emphasis without background fill or border.
- Updated the Partner Portal profile card composition so rebate copy, value, exact amount, and plain trend label read as one data module above the bottom chart.

## 1.2.1 - 2026-05-26

- Updated `GlobalMenuList` left-side icons to render as pure 24px `AppIcon` glyphs aligned to the row content start without `IconSurface` background slots.

## 1.2.0 - 2026-05-26

- Added governed `FeaturedInstrumentCard` support for independent horizontally scrollable market instrument cards.

## 1.1.0 - 2026-05-26

- Added governed `GlobalMenuList` accessory support for switch, value, and rating menu rows.
- Replaced profile/settings page-local menu row accessories with reusable component-library menu behavior.

## 1.0.0 - 2026-05-26

- Established the independent component-library package boundary.
- Migrated component manifest, schema, token-binding map, usage rules, and QA rules from `design-system-engineering/02_components`.
- Kept runtime components in `src/components` as a compatibility surface for the first migration stage.
