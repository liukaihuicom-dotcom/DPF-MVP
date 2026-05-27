# Release Notes

## 2026-05-27

### Added

- Added a PIN security entry to the Me profile settings menu, with visible unset, skipped, and set states that route into the existing local PIN setup screen.
- Added axis-specific card padding tokens so full-site default cards use 12px horizontal padding while preserving existing default and compact vertical rhythm.

### Changed

- Changed registration to start with phone verification, continue with email verification, then send password completion into optional PIN setup before entering the app.
- Added a full-site page content bottom safety rule so shared `Screen` scroll content reserves `layout.screenBottomPadding` plus the device bottom safe-area inset.
- Changed the local PIN gate to be optional by default so normal signed-in app entry no longer requires PIN setup or unlock.
- Added minimum Page Contract traceability for all 42 runtime routes from `src/navigation/routeRegistry.ts`.
- Replaced the Portfolio close-position confirmation with the governed shared `ConfirmActionSheet` bottom-sheet flow.
- Registered priority Portfolio, Funding, Account Ledger, and Instrument Detail workspace compositions as governed business components.
- Removed the decorative left icon from the position-options bottom-sheet title, increased spacing between option modules, and moved menu-card interior spacing back into `GlobalMenuList`.
- Tightened iOS native-keyboard spacing for governed bottom action areas so Auth, funding, layout edit, client approval, and order-ticket primary buttons no longer float far above the keyboard.
- Added keyboard-visible bottom action spacing tokens and reused them in shared `Screen`, `AuthShell`, and trading order-ticket footers.
- Updated the global `BottomSheet` footer to share the sheet background without a divider and made short sheet content non-scrollable unless it exceeds the available height.
- Updated trading account switch rows to use a smaller governed balance icon with default icon color and an icon background for equity and available-funds semantics across Funding, Markets, Trade, and Portfolio entry points.
- Updated Funding form selector left icons to use default icon color with governed icon backgrounds.
- Updated the Trade workspace trading-account shortcut entry to use governed icon-component sizing with the registered shortcut/function-center icon.
- Added a reusable `TradeOrderList` component and migrated the Trade workspace position, pending-order, and history-order rows so direction icon size, row dividers, and right-side values are governed globally.
- Updated `TradeOrderList` card vertical padding to 0px so the list card no longer adds extra top or bottom spacing around order rows.
- Fixed global `BottomSheet` content height with footer actions so short detail sheets stay naturally sized and long sheets still scroll with measured footer avoidance.
- Updated `TradeOrderList` card horizontal padding to 0px so order row touch/highlight areas align to the global menu-list edge contract.
- Tightened `KeyValueList` compact row spacing so the Trade account metric summary reads more densely.
- Tightened the Trade account summary panel to 16px padding on all sides and removed the default scroll-bottom whitespace for this flush first-screen layout.
- Increased Discover entry card title-to-description spacing on mobile so module cards read as cards rather than cramped menu rows.
- Updated global functional icons so no-tone `AppIcon` and default `HeaderIconButton` glyphs use neutral primary rather than brand color, while `IconSurface` keeps visible/hidden background variants documented for page use.
- Updated no-tone `AppIcon` glyphs to use the neutral primary `color.icon.primary` token by default, while keeping brand tone explicit for selected/product emphasis and tertiary tone explicit for low-emphasis disclosure icons.
- Added an explicit 16px `SegmentedTabs.labelSize="large"` variant and applied it to the Trade workspace order-view tabs while keeping default segmented tabs at 14px.
- Updated top navigation icon buttons so default header actions defer to the `AppIcon` neutral primary color spec instead of forcing the low-emphasis tertiary tone.
- Removed the extra horizontal wrapper inset around the `/quick` profile settings and support menu cards while keeping shared menu-row content padding governed by `GlobalMenuList`.
- Removed row-level horizontal padding from the reusable `TradeOrderList` so order-list left/right width is controlled by the outer container rather than the generic list module.
- Updated compact account metric values in the Trade workspace to the governed 14px typography role while leaving detail rows unchanged.
- Updated shared `Card` and custom card-like surfaces across Discover, Accounts, Funding, Portfolio, detail, empty-state, and error contexts to use the 12px horizontal card inset contract.
- Kept `TradeOrderList` as a registered edge-to-edge exception: order rows still have 0px horizontal padding and their outer container controls width.
- Updated the global `BottomSheet` interaction contract so header, content, and fixed footer actions reveal together as one native-style bottom panel.
- Migrated `QuickActionSheet` to shared `BottomSheet` action-menu content and removed its page-owned host, scrim, handle, and SafeArea bottom shell.
- Added full-site bottom-sheet governance: mobile sheets must use shared presets, while auth dialogs, PIN error dialogs, and web select menus remain documented non-sheet exceptions.
- Tuned Accounts overview label weights so the primary `总净值` label is 16px medium and the side metric labels are 14px regular, with no route, copy, or data behavior changes.

### Notes

- No business flow, copy, route, or risk-rule behavior was changed.

## 2026-05-26

### Added

- Added English UI copy capitalization governance under the Financial Copy & Localization Add-on and wired i18n QA to require the rule file.
- Added a full-site close/back interaction governance policy with route-level `topNavBehavior`, deterministic back/close targets, and modal close semantics.
- Added `src/navigation/navigationPolicy.ts` as the shared runtime helper for safe back-or-fallback and close replacement behavior.
- Added `docs/page-navigation-policy.md` to document every route group's close/back behavior and UX QA gate.
- Added a governed horizontal featured markets rail on the Markets screen with five configurable independent instrument cards.
- Added `src/navigation/routeRegistry.ts` as the code-level source of truth for every current Expo Router product page.
- Added `src/navigation/modalRegistry.ts` to govern routeable and non-routeable modals, sheets, confirmations, and toast feedback.
- Added full-site page, modal, and page-modal trigger maps in `docs/02-page-map.md`, `docs/modal-map.md`, and `docs/page-modal-trigger-map.md`.
- Updated routing governance in `docs/07-routing.md` with routeable modal criteria and non-routeable modal rules.
- Updated product engineering navigation assets with runtime route and modal inventories.
- Added read-only navigation registry QA coverage and wired it into `qa:all`.
- Added navigation UX QA coverage for missing route behavior, missing back fallbacks, auth close/back mismatches, routeable modal close fallbacks, and unsafe direct `router.back()` usage.

### Changed

- Updated the PIN setup top-right skip action to the governed 14px control-label typography.
- Updated selected single-select indicators to use the governed plain check mark icon instead of radio-dot or circled-check affordances.
- Updated the country and region picker selected check mark to the governed 20px icon size.
- Added a provider-safe root error boundary so route crashes no longer cascade into a missing `ProductSettingsProvider` fallback on web.
- Normalized high-visibility English UI copy capitalization across i18n strings and remaining page-local UI copy.
- Updated trading account switch sheets so the header action consistently uses the add-account icon across Markets, Trade, and Funding entry points.
- Standardized trading account switch group headings to 14px medium-weight text with a 12px left inset.
- Standardized card and selectable-card selected states to use neutral primary color borders without selected background color changes.
- Removed the extra divider below the Trade workspace order tabs while retaining the selected tab indicator.
- Updated the Trade workspace account shortcut button to use the registered shortcut icon and explicit shortcut accessibility label.
- Added a shared bottom action area spacing token and applied the larger vertical padding to Auth, sticky footer, and BottomSheet action areas.
- Standardized Auth root pages to use close-to-launch semantics and Auth registration steps to use deterministic back targets.
- Updated shared `AuthShell`, `AppTopBar`, and `BackBar` navigation so close/back actions use governed fallbacks instead of page-local history assumptions.
- Added deterministic back targets to funding, account, settings, market detail, discover detail, client detail, and routeable modal screens.
- Added governed `IconSurface` usage across app icon-background compositions.
- Standardized icon surfaces to same-family subtle backgrounds and right-side disclosure chevrons to 16px tertiary pure icons without backgrounds; the current global default functional icon color is neutral primary through `color.icon.primary`.
- Updated shared top/header icon actions to use the neutral primary icon token by default unless a semantic high-emphasis or low-emphasis tone is explicitly required.
- Added 8px `nano` and 12px `micro` icon size naming plus icon-surface container size governance.
- Removed the default border style from shared page card containers.
- Updated shared form field active states to use 2px selected borders without changing field height or width.
- Refined shared form field state behavior so blurred populated fields return to 1px borders, keep medium-weight value text, use primary neutral labels, and support the new `lg` size preset.
- Centered shared form field empty labels in phone Expo previews while preserving existing focused, filled, and placeholder behavior.
- Refined Discover into a flat first-level module entry surface with uniform white cards, no demo/preview labels, and rightmost-tab navigation for entry cards.
- Added the Partner entry card directly below the Discover `我的` card for signed-in trader and partner roles.
- Updated bottom tab navigation so selected icons use the fill variant, selected icon/text color stays on the brand token, and the top divider is 0.5px.

### Notes

- No customer-facing route behavior was changed.
- `/order/[id]` remains a routeable transparent modal because it is a high-risk trading flow with recovery and direct-entry needs.
- `/discover-layout` remains route-backed for now and is marked for demotion review if deep link or refresh recovery is not required.
- Production RBAC, Partner data scope, funding/KYC policy, and server-side trading validation remain unresolved integration risks.
- Form fields, sheet controls, selected states, and list separators retain their own governed border styles.

## 2026-05-21

### Added

- Initialized production delivery documentation for the existing Expo SDK 54 broker MVP.
- Added product modules, page map, roles, permission rules, business rules, state matrix, routing, platform, risk, performance, a11y, i18n, and team workflow docs.
- Added design system governance, API contract, handoff, QA, test, archive, and i18n scaffolding.
- Organized root files into production directories: `qa/visual/`, `scripts/dev/`, `scripts/qa/`, and `archive/legacy-expo-template/`.

### Notes

- No customer-facing screen behavior was changed.
- Existing local uncommitted work was preserved.
