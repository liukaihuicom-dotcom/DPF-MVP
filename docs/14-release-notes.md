# Release Notes

## 2026-05-29

### Changed

- Completed the trading order ticket flow for market, Limit, Stop, SL/TP, pending-order expiry, high-risk one-click trading confirmation, API schemas, and multilingual risk copy in the local simulation.
- Redesigned `/instrument/[id]` as a clearer trading analysis page with a focused Quote Hero, six-field Trade Snapshot, risk strip before deeper analysis, chart-only Chart tab, and grouped Specs tab while preserving buy/sell routing and chart fullscreen behavior.
- Refined `/instrument/[id]` visual rhythm with a cleaner quote metadata row, grouped market data metrics, a lighter risk strip, embedded chart density, and fully localized zh-CN tab / 52-week labels while preserving order routing and trading data.
- Added BottomSheet horizontal spacing governance: Header 16px, card content 12px, list/article/detail-introduction content 16px, and Footer 16px through semantic tokens.
- Documented `layout.sheetContentPaddingX` as the 16px BottomSheet plain/list/article-detail content inset while card content stays on the 12px `layout.contentCardPaddingX`.
- Upgraded `@dpf/component-library` to `2.4.3` for the BottomSheet structural spacing contract.
- Clarified BottomSheet surface governance for trading account selection: `TradingAccountContextSwitcher` is a card-based selection sheet, so Markets, Portfolio/Trade, and Funding account switchers use the gray `surface.canvas` sheet bed with white account cards.
- Upgraded `@dpf/component-library` to `2.4.2` for the trading account card-selection surface contract.
- Added BottomSheet surface governance: card/detail sheets use gray `surface.canvas`, list/selection sheets use white `surface.panel`, and the shared selection preset now defaults to `sheetSurface="panel"`.
- Upgraded the shared `BottomSheet` contract to `@dpf/component-library` `2.4.0` with governed `heightMode="adaptive" | "fixed" | "fullscreen"` layouts and a single Panel-owned Header / Content / Footer lifecycle.
- Added country-aware phone validation across login, registration, and password reset using `libphonenumber-js`.
- Standardized auth phone account values to E.164 for OTP route parameters and remembered-account storage.
- Updated login to use explicit email / phone modes, with phone login reusing the governed country picker and `CountryPhoneField`.
- Upgraded `@dpf/component-library` to `2.3.1` for the shared auth phone validation contract.
- Added the `HeaderIconButton` neutral filled surface mode and applied it to `/instrument/[id]` back navigation so the returned icon action uses the governed icon background on white detail panels.
- Upgraded `@dpf/component-library` to `2.3.2` for the header icon surface contract.

## 2026-05-28

### Breaking

- Updated `@dpf/component-library` to `2.0.0` because the global `ActionButton` contract now supports only `filled` and `outline`.
- Removed Button text and legacy soft mixed background-plus-outline appearances from the governed global Button API.
- Updated `@dpf/design-tokens` to `3.0.0` for the trading color semantic migration: global market `up` is now green `#2EA379`, market `down` is red, and success/feedback green remains independent.

### Added

- Added the Design Public Resource Package Governance Skill under the local `.codex/skills` tree.
- Updated AGENTS routing so page, design-system, shared-asset, migration, and public-resource work must check registries, dependency graph, change impact, and release readiness before delivery.
- Added the public resource governance package with public asset registry, asset dependency graph, copy-table seed, illustration registry seed, migration plan, change impact report, deprecated-assets record, and QA checklist.
- Added `pnpm qa:public-resources` and wired it into `pnpm qa:all`.
- Registered migration targets for repeated page-local structures across trading account switching, order/position sheets, metric clusters, financial charts/gauges, Discover partner/reward/verification cards, theme preview selection, and local PIN security.

### Changed

- Removed residual border styles from page, sheet, dialog, demo, chart, Discover, and developer-console card-like surfaces while preserving functional input, button, chip, icon, divider, and selection-control borders.
- Strengthened Card governance and QA so Card and card-like page/sheet/dialog/business surfaces remain borderless and cannot reintroduce `borderWidth` or `borderColor`.
- Standardized card and card-like panel roundness on semantic `radius.card`, including the shared Card contract, metric-detail value card, developer scenario tiles, and root error panel.
- Tightened the Discover entry-card title-to-description spacing to the governed 4px layer and updated filled header icon action backgrounds to the white panel surface token on gray page/sheet backgrounds.
- Migrated global Button consumers to explicit `filled` or `outline` variants, and moved text-only lightweight actions to text action patterns.
- Updated the shared BottomSheet fixed footer action area so bottom actions start hidden and follow the sheet entrance instead of appearing at the bottom by default.
- Updated Discover entry-card descriptions from the compact 12px caption role to the governed 14px `body.secondary` role while keeping routes, icons, copy, and card order unchanged.
- Updated the Trade workspace order-list card container so positions, pending orders, and history orders use the governed `layout.cardPaddingX` list inset inside the card and `layout.screenPaddingX` outside page margin.
- Updated funding quick-action icon semantics so 存款 uses the green success tone, 取款 keeps the amber warning tone, and 转账 remains info blue.
- Tuned the `/accounts` trading account list card rhythm so currency metadata tightens to a 2px token gap, title-to-description spacing has a dedicated token layer, and secondary financial labels use regular caption weight.
- Changed the standard blue token to `#1F72E8` and synchronized runtime colors, token registries, CSS mappings, and design-system mirrors.
- Added the full-site page and bottom-sheet horizontal spacing contract: title/header and fixed footer actions stay at 16px, BottomSheet card content uses 12px, BottomSheet list/article-detail introduction content uses 16px, and global Card/List content defaults to their registered row/card tokens.
- Completed second-stage first-batch public-resource migration for Portfolio, DiscoverModule, Markets, InstrumentDetail, AccountDetails, and Appearance.
- Promoted the migrated business components and patterns to active registry and dependency-graph assets.
- Synced copy-table entries with runtime i18n keys for high-risk trading, Discover/Partner, Markets account-switch feedback, Appearance, Funding, and PIN copy surfaces.
- Clarified icon governance so registered public chart/gauge components may own internal SVG while route screens remain blocked from `react-native-svg`.
- Added governed AppText auto-fit protection so Expo Go phone previews preserve system font scaling while preventing key text from shrinking below the design standard.
- Updated Codex/browser product-page preview to simulate the app in a governed 390 x 844 native device canvas with web-only safe-area metrics.
- Rounded the Codex/browser product-page preview canvas with token-bound `radius.sheet` clipping so the viewing area reads as a phone device instead of a square web frame.
- Preserved the developer control panel as an independent draggable debug module outside the product-page preview canvas.
- Updated the AI-readable design-system index and production gate list so future production UI work must account for public-resource registry and dependency-graph coverage.
- Registered the local `/markets-account-demo` design review route across route governance, page inventory, route coverage, and the public-resource dependency graph so full QA covers all 43 runtime routes.

### Notes

- No Expo service, runtime route, API, or data behavior was changed.
- Planned owned illustrations and the Local PIN security flow remain conditional follow-up assets requiring human/native review before whole-product production readiness.

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
- Earlier `TradeOrderList` spacing work temporarily moved horizontal width ownership out of rows so order-list spacing could be governed centrally.
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
- Kept `TradeOrderList` rows free of row-level horizontal padding so the governed list container can own horizontal spacing.
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
