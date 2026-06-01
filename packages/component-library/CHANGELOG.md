# @dpf/component-library Changelog

## 2.5.2 - 2026-06-01

- Clarified trading account switch sheet bottom spacing governance so content bottom reserve is owned by shared `BottomSheet` `layout.sheetContentPaddingBottom`.
- Added QA coverage to block local bottom padding or margin on `TradingAccountSwitchSheet` wrappers.

## 2.5.1 - 2026-06-01

- Removed the shared `BottomSheet` Footer top divider so footer actions share the sheet surface without a visual separation line.
- Preserved Footer safe-area padding, in-Panel layout flow, action spacing, close lifecycle, and the public `BottomSheet` API.

## 2.5.0 - 2026-06-01

- Added the governed Workspace component set: `WorkspaceHeader`, `ModeStatusBadge`, `WorkspaceSummaryCard`, `QuietAssistBar`, `StatusMetricTile`, `PriorityFocusCard`, `CompactActionRow`, `MarketMiniCard`, `PartnerMetricCard`, and `ModeSwitchEntry`.
- Registered Workspace components in the component manifest and token-binding map so the Broker App workbench uses public Card, StatusPill, ActionButton, AppIcon, IconSurface, HeaderIconButton, and NativePressable contracts.
- Kept Workspace Assist as a weak support/education entry with no trading, funding, transfer, client-message, buy/sell recommendation, or profit-promise behavior.

## 2.4.4 - 2026-06-01

- Updated shared `BottomSheet` Footer safe-area handling so the in-Panel Footer uses `layout.sheetFooterPaddingBottom + insets.bottom` instead of page-local or footer-reserve spacing.
- Added a governed `layout.sheetContentPaddingBottom` breathing space for BottomSheet scroll content so the final item does not sit against the Footer.
- Kept Header, Content, and Footer mounted in the same Panel layout flow across adaptive, fixed, and fullscreen modes.

## 2.4.3 - 2026-05-29

- Added the governed BottomSheet horizontal spacing contract: Header 16px, card content 12px, list/article/detail-introduction content 16px, and Footer 16px.
- Updated `BottomSheet` content so `contentPadding="card"` uses `layout.contentCardPaddingX` while `contentPadding="plain"` uses `layout.sheetContentPaddingX`.
- Added style QA coverage so BottomSheet card and plain content cannot collapse into one shared horizontal inset.

## 2.4.2 - 2026-05-29

- Clarified BottomSheet surface governance for card-based selection sheets: `TradingAccountContextSwitcher` uses `sheetSurface="canvas"` with `contentPadding="card"` because account options are selectable cards on a gray bed.
- Updated Markets, Portfolio/Trade, and Funding account-switcher entries to keep trading account selection on the gray canvas surface while plain selection lists continue to default to the white panel surface.
- Added style QA coverage so trading account selection sheets cannot regress to the plain-list white sheet bed.

## 2.4.1 - 2026-05-29

- Documented the governed BottomSheet surface rule: card/detail content uses `sheetSurface="canvas"` for a gray sheet bed, while list/selection content uses `sheetSurface="panel"` for a white sheet bed.
- Defaulted the shared `selection` preset to `sheetSurface="panel"` so list picker sheets use the white panel surface unless a caller explicitly overrides it.
- Added style QA coverage for BottomSheet surface-token mapping and sheet background documentation.

## 2.4.0 - 2026-05-29

- Added governed `BottomSheet` `heightMode` support for `adaptive`, `fixed`, and `fullscreen` layouts.
- Rebuilt the shared `BottomSheet` panel so Header, Content, and Footer render as direct children in one layout flow; Footer no longer uses `footerComponent`, portal placement, absolute/fixed positioning, independent animation, or measured content reserve.
- Unified backdrop tap, close button, pan-down, Android back, cancel action, and business-completion dismissal through the same close lifecycle, with final cleanup deferred until the panel dismisses.
- Updated static QA guards to block footer-outside-panel patterns and enforce adaptive/fixed/fullscreen flex contracts.

## 2.3.5 - 2026-05-29

- Fixed shared `BottomSheet` footer avoidance so short fixed-footer sheets keep natural content height instead of adding duplicate bottom reserve.
- Kept measured footer margin adjustment as the single avoidance path for fixed footer actions.
- Preserved page callers, sheet presets, footer actions, and business behavior for trade position and pending-order detail sheets.

## 2.3.4 - 2026-05-29

- Added the governed Bottom Sheet height and scenario principle to the public overlay registry.
- Updated the BottomSheet manifest so `snapPoints` and `contentSizing` choices must map to documented height levels instead of arbitrary page-local values.
- Kept runtime component API unchanged; this is a public-resource and manifest governance patch.

## 2.3.3 - 2026-05-29

- Fixed shared `BottomSheet` dismissal so header, content, and fixed footer actions use one internal visual progress while the gorhom container owns the sheet dismissal.
- Changed fixed-footer content reserve from a static 148px gap to runtime measured footer height with the existing 148px first-frame fallback.
- Kept footer actions interactive during the early dismissal segment and disabled repeated footer action presses after the first close-triggering tap.

## 2.3.2 - 2026-05-29

- Added a governed neutral filled surface option to `HeaderIconButton` so header icons on white panel surfaces can reuse the `IconSurface` neutral background contract.
- Updated `/instrument/[id]` back navigation to use the neutral header icon surface while preserving the registered `icon.system.back` glyph, route fallback, touch target, and accessibility label.
- Strengthened component and style QA coverage so header icon backgrounds stay on the panel/default or IconSurface-neutral contracts instead of page-local subtle backgrounds.

## 2.3.1 - 2026-05-29

- Added the governed auth phone validation contract: `CountryPhoneField` consumers must validate with the shared country-aware rule and pass account values forward in E.164 format.
- Registered login, registration, and password-reset phone entry as shared country-picker consumers instead of page-local country-code handling.
- Kept the visual `CountryPhoneField` and `CountryPickerModal` component API unchanged.

## 2.3.0 - 2026-05-29

- Added the governed `TradingOrderActionSheet` business sheet body for grouped position and pending-order action menus.
- Exported `PositionDetailSheet` and `PendingOrderDetailSheet` wrappers through `OrderPositionDetailSheet` so `/trade` and `/portfolio` no longer own private order detail sheet shells.
- Kept order mutation, close confirmation, OverlayQueue feedback, copy keys, and trading business behavior unchanged while removing page-local menu wrapper card styling from order sheets.

## 2.2.0 - 2026-05-28

- Added governed `GlobalDialog` as the single centered feedback and confirmation Modal host while preserving the existing centered auth feedback visual design.
- Migrated `AuthContactConfirmDialog`, `AuthLeaveVerifiedStepDialog`, and `AuthErrorDialog` to render through `GlobalDialog` instead of owning local React Native Modal shells.
- Strengthened bottom-sheet governance so page-level bottom sheets must call the global `BottomSheet` system through `bottomSheetPresets`, with QA guards blocking page-owned Modal/scrim/sheet shells.

## 2.1.14 - 2026-05-28

- Removed residual border rendering from page, sheet, dialog, demo, chart, Discover, and developer-console card-like surfaces while preserving functional input, button, chip, icon, and divider borders.
- Strengthened the Card manifest so Card and card-like page/sheet/dialog/business surfaces are explicitly borderless and must not carry `borderWidth` or `borderColor`.
- Added style and component QA coverage to block future card-like border regressions outside functional controls.

## 2.1.13 - 2026-05-28

- Expanded the shared auth country/region picker from the eight-option sample list to 128 mainstream global phone regions while preserving Indonesia as the default first option.
- Kept search over country/region name, ISO code, and dial code, and added a localized empty state for unmatched searches.
- Synchronized the `CountryPickerModal` contract with the shared BottomSheet list behavior: white panel surface, plain list body, max-height scrolling, backdrop dismissal, pan-down dismissal, and default-size selected check icon.

## 2.1.12 - 2026-05-28

- Standardized shared `Card` and card-like panel governance on the semantic `radius.card` token instead of the legacy `radius.md` alias.
- Migrated remaining card-like runtime surfaces in the developer scenario tile, metric description sheet value card, and root error panel to `radius.card`.
- Added manifest and QA coverage so card-like surfaces cannot regress to `radius.sm`, `radius.md`, `radius.lg`, `radius.xl`, or numeric `borderRadius` values.

## 2.1.11 - 2026-05-28

- Stabilized `CountryPickerModal` so opening the sheet does not re-run on parent callback or selected-country reference changes.
- Added an explicit country-picker snap point so the long country/region list uses the shared BottomSheet max-height and scroll behavior.
- Restored reliable dismissal through the shared BottomSheet backdrop, pan-down, and selected-option paths.

## 2.1.10 - 2026-05-28

- Added a governed `sheetSurface` option to shared `BottomSheet` presets so list-only sheets can use a white panel surface without changing every sheet.
- Updated `CountryPickerModal` to use the panel sheet surface and plain list padding because its content is a simple country/region list, not a card layout.
- Preserved country selection behavior, registered flag assets, and the default-size `icon.status.check` selected indicator.

## 2.1.9 - 2026-05-28

- Fixed shared `BottomSheet` header and content rendering so sheet text keeps full opacity after presentation in the app web preview.
- Preserved the governed sheet entrance translation and fixed-footer entrance behavior while preventing content from remaining visually washed out.

## 2.1.8 - 2026-05-28

- Updated `AuthShell` top navigation so the right-side action area reserves a stable two-icon slot across login, registration, onboarding, PIN, and password recovery flows.
- Kept single right-side actions right-aligned inside the reserved slot to avoid horizontal jumps when auth pages switch between one and two top-right icons.
- Preserved route behavior, icon registry keys, left close/back button treatment, and right action touch targets.

## 2.1.7 - 2026-05-28

- Updated `AppViewport` so Codex/browser product-page previews clip the governed 390 x 844 canvas with the token-bound `radius.sheet` corner treatment.
- Preserved native iOS/Android full-device sizing, web preview dimensions, safe-area metrics, and the developer control panel outside the clipped phone canvas.
- Added component and style QA coverage so the app preview canvas cannot regress to square corners.

## 2.1.6 - 2026-05-28

- Updated `AuthShell` left-side close/back actions to keep a visible token-bound background in login, registration, onboarding, PIN, and password recovery flows.
- Scoped the visual correction to the shared auth shell navigation action while preserving route behavior, icon registry keys, labels, touch target size, and right-side language action behavior.

## 2.1.5 - 2026-05-28

- Updated the shared `CountryPickerModal` country rows to stack dial code above the country or region name for clearer scanning in auth bottom sheets.
- Kept the selected country indicator on the registered `icon.status.check` AppIcon and restored it to the component default 24px icon size.
- Changed country options to expose radio semantics with checked state while preserving the existing selection behavior and BottomSheet host.

## 2.1.4 - 2026-05-28

- Updated the shared `BottomSheet` lifecycle so header, content, and fixed footer actions dismiss through the same progress before the sheet stack is cleared.
- Added a governed content-to-footer reading gap for short and scrollable sheets so trading detail content does not sit against fixed action buttons.
- Kept fixed footer height measured with a conservative first-frame estimate so short content does not clip action buttons before layout measurement completes.

## 2.1.3 - 2026-05-28

- Updated `TradingAccountCard` metadata rows to use a 16px currency flag, 2px horizontal gap, and 0px row gap.
- Switched the account-switcher add action to the generic registered `icon.system.add` plus glyph instead of the add-user profile glyph.
- Made selection bottom sheets default to fill sizing so long account-switcher content uses the governed scroll container.
- Kept selected check indicators on the default-size, no-background `AppIcon` contract.

## 2.1.2 - 2026-05-28

- Updated `TradingAccountCard` radio trailing state to use the registered `icon.status.check` AppIcon at the component default icon size.
- Removed the hand-built radio circle/dot treatment from the account selection card so the selected indicator has no icon-surface background.
- Kept selection state, account switching behavior, and account card layout unchanged.

## 2.1.1 - 2026-05-28

- Tightened the Discover entry card title-to-description stack to the governed 4px `spacing.xs` layer.
- Updated filled `HeaderIconButton` containers to use the white panel surface token on gray page, sheet, and canvas backgrounds while preserving neutral primary icon glyph color.
- Synced component manifests, token-binding maps, and QA coverage for the Discover entry copy rhythm and header icon surface contract.

## 2.1.0 - 2026-05-28

- Promoted the shared trading account row into exported `TradingAccountCard` with governed `radio`, `chevron`, and `currency` trailing variants.
- Updated `/accounts` to reuse the same detailed trading account card composition as `TradingAccountSwitchSheet`, changing only the right-side control from radio to disclosure chevron.
- Kept account routing, data, copy, icon registry usage, and funding account selection behavior unchanged.

## 2.0.0 - 2026-05-28

- Breaking: restricted `ActionButton` to exactly two visual variants, `filled` and `outline`.
- Removed the legacy soft-tint mixed background plus outline treatment and the text-button variant from the global Button contract.
- Migrated existing global Button call sites to explicit `filled` or `outline`, and moved text-only actions to `NativePressable` plus `AppText` patterns.
- Added component QA coverage so `text`, `legacySoft`, and `emphasis` cannot re-enter the `ActionButton` runtime or manifest.

## 1.8.3 - 2026-05-28

- Updated the shared `BottomSheet` fixed footer action area so it starts hidden below the sheet and follows the same `sheetEntranceProgress` as the header and content.
- Disabled footer pointer events until the shared entrance completes, preventing bottom actions from being visible or interactive by default during sheet presentation.
- Synced component manifests and style QA coverage for the public BottomSheet footer entrance contract.

## 1.8.2 - 2026-05-28

- Updated Discover entry card descriptions to use the governed 14px `body.secondary` typography role instead of 12px caption text.
- Kept the change scoped to the Discover entry card copy hierarchy without changing entry order, copy, icons, routes, touch targets, or global typography token values.
- Added style QA coverage so Discover entry descriptions do not regress to the compact caption role.

## 1.8.1 - 2026-05-28

- Updated `TradeOrderList` so its Card container owns the governed horizontal list inset through `layout.cardPaddingX`, while rows keep vertical-only touch rhythm and no row-level horizontal padding.
- Updated the Trade workspace order-list section to use semantic `layout.screenPaddingX` outside spacing so position, pending-order, and history lists align to the full-site spacing contract.
- Synced component manifests, token-binding maps, business-component QA wording, and component QA guards for the card-container order-list contract.

## 1.8.0 - 2026-05-28

- Added governed `TradingTerminalChart` for mobile instrument detail charts with K-line, line, area, timeframe switching, pan/zoom, crosshair OHLCV, indicator toggles, drawing tools, fullscreen mode, and quote exception states.
- Registered the component as the only owner of the instrument terminal chart SVG rendering so route screens continue to consume public business components instead of importing `react-native-svg`.
- Updated `/instrument/[id]` to consume the terminal chart and a dense quote/specification surface while preserving the fixed Sell / Buy order-entry footer.

## 1.7.3 - 2026-05-28

- Updated `FundActionGrid` icon tone mapping so deposit actions use the green `success` semantic tone, withdrawal actions keep the amber `warning` tone, and transfer actions remain `info`.
- Kept icon assets, labels, routes, touch targets, and funding operation behavior unchanged.

## 1.7.2 - 2026-05-28

- Tuned the `/accounts` trading account list card composition so currency metadata uses the governed 2px micro gap, title-to-description spacing gains a token-bound layer, and financial metric labels use the regular caption role.
- Kept the correction local to the account-list card composition with no route, copy, data, icon, or base component API change.

## 1.7.1 - 2026-05-28

- Updated `BottomSheetProvider.show` and `BottomSheetProvider.push` so shared BottomSheet openings dismiss the active keyboard and release the focused input before presenting a new sheet.
- Kept `hide` and `back` behavior unchanged so dismissal, nested sheet back navigation, and footer actions returning `false` preserve their existing flow.
- Added governance and QA coverage requiring the shared BottomSheet host to own keyboard dismissal instead of scattering page-local fixes.

## 1.7.0 - 2026-05-28

- Updated `Screen` so card-mode route content defaults to the full-site 12px horizontal inset, while plain/form content can opt into the 16px inset.
- Updated `BottomSheet` so header and fixed footer action areas stay at 16px, card-mode content defaults to 12px, and plain/list/article-detail introduction content uses 16px through the shared preset contract.
- Updated `AppTopBar`, global list/row components, component manifests, token-binding maps, and QA guards so header/footer, Card, and List spacing follow the governed 16px/12px policy without page-local padding.

## 1.6.13 - 2026-05-28

- Added the governed `AppText` auto-fit floor so Expo Go phone previews keep `adjustsFontSizeToFit` text at `minimumFontScale >= 0.92` while preserving system font scaling.
- Removed auto-fit shrinking from key title, button, tab, launch, and auth confirmation text surfaces so typography roles keep their token size on mobile preview.
- Added style QA coverage that blocks ungoverned text auto-shrink and sub-0.92 `minimumFontScale` usage.
- Updated `AppViewport` governance so Codex web preview constrains product routes to the 390 x 844 app device canvas using design tokens.
- Kept `ProductControlPanel` as an independent web-only developer module outside the phone canvas so drag, expand/collapse, click handling, and z-index behavior remain uncropped.
- Added component QA guards for the app preview viewport contract and developer-tool boundary.
- Registered `OrderPositionDetailSheet` / `ClosedOrderDetailSheet` as governed business sheet bodies so dense PnL/value auto-fit usage is explicit and covered by component QA.
- Registered `TradingAccountContextSwitcher` as the governed business wrapper around `TradingAccountSwitchSheet` for account-selection contexts.
- Completed first-batch public-resource references for the migrated page set by routing Portfolio, Discover, Markets, Account Details, Instrument Detail, and Appearance through registered business components and patterns.

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

- Earlier `TradeOrderList` spacing work moved horizontal inset responsibility out of individual rows so the list container could own left/right spacing.
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
