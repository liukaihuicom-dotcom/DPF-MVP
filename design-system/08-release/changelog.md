# Changelog

## 1.0.9 - 2026-05-29

### Changed

- Added the BottomSheet horizontal spacing contract: Header 16px, card content 12px, list/article/detail-introduction content 16px, and Footer 16px.
- Updated BottomSheet runtime spacing so `contentPadding="card"` uses the governed 12px card inset while `contentPadding="plain"` uses the governed 16px list/article inset.
- Updated BottomSheet documentation and QA to block card/plain content from collapsing into one shared horizontal inset.

## 1.0.8 - 2026-05-29

### Changed

- Clarified that trading account selection is a card-based BottomSheet selection, not a plain list.
- Updated account-switcher BottomSheet entries to use gray `surface.canvas` with `contentPadding="card"` while plain pickers and list selections stay on white `surface.panel`.
- Added QA coverage for the trading account card-selection surface rule.

## 1.0.7 - 2026-05-29

### Changed

- Added BottomSheet surface governance: card/detail content uses the gray `surface.canvas` sheet bed, while list/selection content uses the white `surface.panel` sheet bed.
- Updated the shared selection preset contract so picker/list sheets default to the white panel surface without page-local background wrappers.
- Added QA coverage for BottomSheet surface token mapping and documentation.

## 1.0.6 - 2026-05-29

### Changed

- Updated shared `BottomSheet` dismissal governance so the sheet container dismissal is owned by `@gorhom/bottom-sheet` while header, content, and fixed footer share one internal visual progress.
- Added measured footer reserve behavior for fixed-footer sheets, keeping `layout.bottomActionArea.contentInset` only as the first-frame fallback.
- Documented symmetric closing rhythm, late footer opacity fade, and progress-threshold footer interactivity for bottom-sheet QA.

## 1.0.5 - 2026-05-29

### Changed

- Added a neutral filled surface mode to the governed `HeaderIconButton` contract so white-panel header actions can reuse the `IconSurface` neutral background.
- Updated `/instrument/[id]` back navigation to use the neutral header icon surface while preserving the registered back icon, navigation fallback, and trading entry behavior.
- Added QA coverage for the panel/default and IconSurface-neutral header icon background modes.

## 1.0.4 - 2026-05-29

### Changed

- Added the governed auth phone validation contract for `CountryPhoneField`: phone entries must match the selected country / region and account handoff uses E.164.
- Registered login, registration, and password-reset phone entry as shared country-picker consumers.
- Updated component and route documentation so phone validation remains shared instead of page-local.

## 1.0.3 - 2026-05-28

### Changed

- Removed residual border styles from page, sheet, dialog, demo, chart, Discover, and developer-console card-like surfaces.
- Updated Card governance so Card and card-like page/sheet/dialog/business surfaces stay borderless and cannot declare `borderWidth` or `borderColor`.
- Added QA coverage for card-like borderless enforcement while preserving functional borders for inputs, outline buttons, chips, icons, dividers, and selection controls.

## 1.0.2 - 2026-05-28

### Changed

- Standardized card and card-like panel radius governance on semantic `radius.card` while keeping `radius.md` as a same-value compatibility alias for non-card surfaces.
- Updated Card component documentation, token export mappings, component manifests, and QA guards so page/sheet/business card surfaces use one radius role.
- Migrated remaining card-like developer, metric-detail, and root error panels to the same `radius.card` contract.

## 1.0.1 - 2026-05-28

### Changed

- Tightened Discover entry-card title-to-description rhythm to the governed 4px `spacing.xs` layer.
- Updated filled header icon action backgrounds on gray page, sheet, and canvas surfaces to use the white `surface.panel` semantic token instead of the gray subtle surface.
- Added QA and manifest coverage for the Discover entry copy gap and header icon surface token contract.

## 1.0.0 - 2026-05-28

### Breaking

- Restricted the global `ActionButton` design contract to `filled` and `outline` only.
- Removed text-button and legacy soft mixed background-plus-outline appearances from the Button specification.

### Changed

- Migrated existing ActionButton usages to explicit `filled` or `outline` variants, with text-only actions expressed through text action patterns.
- Added component QA coverage to prevent `text`, `legacySoft`, and `emphasis` from returning to the global Button contract.

## 0.6.1 - 2026-05-28

### Changed

- Updated the Trade workspace order lists so the `TradeOrderList` Card container owns the governed 12px horizontal inset through `layout.cardPaddingX`, while the screen section uses `layout.screenPaddingX` for outside page margin.
- Preserved row-level vertical-only padding, shared direction icons, dividers, right-side values, and accessibility labels without changing routes, copy, data, or trading behavior.

## 0.6.0 - 2026-05-28

### Breaking

- Upgraded `@dpf/design-tokens` to `3.0.0` for the global trading color migration: `up` is now green `#2EA379`, `down` is red, and feedback success remains on `status.success`.

### Changed

- Changed the standard blue token to `#1F72E8` across token source, runtime compatibility layer, CSS mapping, and design-system mirrors.
- Added migration guidance that old green `down` usages must be remapped by business meaning to trading `up`, trading `down`, or feedback `success`.

## 0.5.0 - 2026-05-28

### Changed

- Added the full-site horizontal spacing contract for route pages and BottomSheet surfaces: 16px for headers and fixed action areas, 12px for BottomSheet card content, and 16px for BottomSheet list/article-detail introduction content.
- Synced token, component, public-resource, and QA governance so later page work consumes shared spacing modes instead of page-local padding.

## 0.4.2 - 2026-05-28

### Changed

- Completed first-batch public-resource reference migration for Portfolio, DiscoverModule, Markets, InstrumentDetail, AccountDetails, and Appearance.
- Promoted the migrated business components and patterns from migration targets to active referenced resources in registry and dependency graph records.
- Synced the public copy table with i18n keys for high-risk trading, Discover/Partner, Markets account-switch feedback, Appearance, Funding, and PIN copy surfaces.
- Clarified the icon QA boundary: route screens cannot import `react-native-svg`, while registered chart/gauge business components may use SVG internally as data visualization.

### Notes

- Planned owned illustrations and the Local PIN security flow remain conditional follow-up assets requiring human/native review before whole-product production readiness.

## 0.4.1 - 2026-05-28

### Changed

- Updated Codex/browser product-page preview governance so all product routes render inside a 390 x 844 native app simulation canvas.
- Added web-only simulated safe-area metrics for App preview while preserving real device safe-area behavior on native iOS and Android.
- Kept the developer control panel as an independent draggable debug module outside the app preview canvas.

## 0.4.0 - 2026-05-28

### Added

- Added the public resource governance package under `design-system-engineering/11_public_resources`.
- Added public asset registry, asset dependency graph, copy-table seed, illustration registry seed, migration plan, impact report, deprecated-assets record, and public-resource QA checklist.
- Added `qa:public-resources` so page delivery can verify registry, dependency graph, copy, pattern, business-component, and high-risk page coverage.

### Changed

- Expanded business-component and pattern registries with migration targets for duplicated page-local modules without changing runtime UI.
- Added public-resource governance entries to the AI-readable index and production QA gate list.

## 0.3.23 - 2026-05-28

### Added

- Added the Design Public Resource Package Governance Skill as a Design System Engineering Add-on.
- Updated AGENTS routing so public-resource, registry, dependency-graph, migration, and release-readiness tasks must use the new governance skill.

## 0.3.22 - 2026-05-27

### Changed

- Tuned Accounts overview label weights: primary described metric labels now use the 16px medium role, and secondary side metric labels use the 14px regular metric-label role.

## 0.3.21 - 2026-05-27

### Changed

- Governed all mobile bottom-sheet interactions through the shared `BottomSheet` host and presets.
- Added synchronized entrance requirements so header, content, and fixed footer actions reveal together as one bottom panel.
- Migrated `QuickActionSheet` to shared-host content and documented non-sheet modal exceptions for auth dialogs, PIN errors, and web select menus.

## 0.3.20 - 2026-05-27

### Changed

- Added axis-specific card padding governance so default card horizontal content inset is 12px while default vertical padding remains 16px and compact vertical padding remains 12px.
- Updated shared `Card` and custom card-like surfaces to use `layout.cardPaddingX/Y` or compact axis tokens, with `TradeOrderList` rows remaining a registered no-row-horizontal-padding exception.

## 0.3.19 - 2026-05-27

### Changed

- Updated compact `KeyValueList` account metric values to use the governed 14px typography role while preserving larger detail-row typography for sheets and cards.

## 0.3.18 - 2026-05-27

### Changed

- Added a full-site page content bottom safety rule: shared `Screen` now combines `layout.screenBottomPadding` with the device bottom safe-area inset.
- Deprecated production use of `contentBottomPadding="none"` so route pages cannot remove the global bottom safe gap.

## 0.3.17 - 2026-05-27

### Changed

- Updated default top navigation icon buttons to use the `AppIcon` neutral primary default color instead of forcing the low-emphasis tertiary tone.
- Added QA coverage for `HeaderIconButton` default color handling so tertiary remains an explicit low-emphasis choice.

## 0.3.16 - 2026-05-27

### Changed

- Increased primary metric explanation labels such as Accounts overview `总净值` to the governed 16px title role.
- Increased Accounts overview side metric labels to the governed 14px caption role while preserving value typography.

## 0.3.15 - 2026-05-27

### Changed

- Unified icon component defaults so both pure `AppIcon` glyphs and `IconSurface` glyphs use neutral primary `color.icon.primary` by default.
- Kept `tone="tertiary"` as an explicit low-emphasis option instead of the default for neutral icon surfaces.

## 0.3.14 - 2026-05-27

### Changed

- Updated the governed trading-account icon so account entry points, account switchers, funding account fields, and account workspace shortcuts visually match the bottom-navigation Accounts tab icon.
- Preserved the `icon.account.trading` semantic key so trading-account usage stays distinct from personal profile, banking, deposit, withdrawal, and archive meanings.

## 0.3.13 - 2026-05-27

### Changed

- Added the governed `label.controlLarge` role and `SegmentedTabs.labelSize.large` variant for explicit 16px in-page tab labels.
- Updated the Trade workspace order-view tabs to opt into the large segmented-tab label variant without changing default compact segmented tabs.

## 0.3.12 - 2026-05-27

### Changed

- Changed global default functional icons to use the neutral primary `color.icon.primary` token instead of the tertiary gray token.
- Clarified that brand icon tone remains explicit selected/product emphasis, while tertiary remains explicit low-emphasis disclosure or metadata usage.

## 0.3.11 - 2026-05-27

### Changed

- Changed global default functional icons to use the neutral gray tertiary icon token instead of primary text or brand emphasis.
- Clarified pure no-background `AppIcon` usage and `IconSurface` visible/hidden background variants for page and component implementation.
- Migrated neutral feature, form, card, and shortcut icon surfaces away from page-level brand tone overrides.

## 0.3.10 - 2026-05-27

### Changed

- Updated `GlobalMenuList` contained descriptive rows so menu-card interior padding, row height, and icon/text spacing are owned by the component.
- Increased position-options sheet module spacing and removed the decorative left title icon from the position options header.

## 0.3.9 - 2026-05-27

### Changed

- Added keyboard-visible bottom action spacing governance so iOS form footers collapse excess safe-area padding when the native keyboard is open.
- Updated shared auth, screen, and order-ticket footer behavior to consume the governed keyboard bottom action spacing tokens.

## 0.3.8 - 2026-05-26

### Changed

- Updated the global single-select selected indicator rule to use the plain `icon.status.check` check mark instead of radio dots or circled check icons.
- Updated the Auth language sheet selected row to consume the governed plain check mark indicator.

## 0.3.7 - 2026-05-26

### Added

- Added English UI copy capitalization governance as a Financial Copy & Localization Add-on rule, not a new peer Skill.
- Added Page Copy Review requirements for English titles, buttons, labels, tabs, table headers, toast, error, helper, empty state, and i18n copy.

### Changed

- Normalized high-visibility English UI copy to use Title Case for titles/actions/labels/status surfaces and Sentence case for descriptions, errors, helpers, placeholders, and body copy.

## 0.3.6 - 2026-05-26

### Added

- Added production semantic spacing governance with `layout.*` roles for page modules, sections, cards, list rows, forms, controls, sheets, quote groups, and dense data rows.
- Added the spacing semantic usage matrix and new-token review flow for future project iteration.

## 0.3.5 - 2026-05-26

### Changed

- Increased large `ActionButton` labels to 20px through the governed `typography.buttonLg` token.

## 0.3.4 - 2026-05-26

### Changed

- Consolidated the all-site typography scale to `10 / 12 / 14 / 16 / 20 / 28 / 34 / 42`.
- Added the governed 10px `label.minimum` role for ultra-compact metadata only while keeping status and bottom navigation labels at 12px.

## 0.3.3 - 2026-05-26

### Changed

- Migrated runtime page and shared component icon usage to governed `AppIcon` size variants or approved layout aliases.
- Updated `TradeDirectionIcon` to render through the token-bound `IconSurface` composition.
- Extended icon QA so production raw numeric `AppIcon size` values fail as `HARD_CODED_APP_ICON_SIZE`.

## 0.3.2 - 2026-05-26

### Added

- Added the all-site icon component consistency audit covering `AppIcon`, `IconSurface`, icon color tones, governed size variants, SVG exceptions, and page-level migration requirements.

### Changed

- Updated icon library, naming, and principle docs from the deprecated Phosphor wrapper guidance to the current local Iconsax registry and `AppIcon` component model.

## 0.3.1 - 2026-05-26

### Changed

- Updated governed system back and close icons used by auth/header controls to more universal local glyphs while preserving existing semantic icon keys and accessibility labels.

## 0.2.3 - 2026-05-26

### Changed

- Split form border interaction state from populated content state so focused, selected/open, inputting, and error fields use 2px borders while blurred populated fields return to 1px and retain medium-weight value text.
- Added the governed `lg` form field size preset for 66px high-emphasis inputs.
- Set initial and focused form labels to the primary neutral text token.

## 0.2.2 - 2026-05-26

### Changed

- Updated shared form field active states so focus, inputting, validation, success, and error borders use the governed 2px `lineWidth.selected` token while preserving shell dimensions with padding offsets.

## 0.2.1 - 2026-05-26

### Changed

- Removed the default border from the shared `Card` container while keeping token-bound radius, spacing, surface color, and highlight elevation.
- Updated the component manifest so `Card` no longer declares border line tokens as part of its governed container styling.

## 0.2.0 - 2026-05-23

### Added

- Added the production global form field component set with floating-label `TextField`, `SelectField`, and lightweight `RichTextField`.
- Reserved the `stage` form field variant for future stage-themed input styling.
- Added `GlobalMenuList` variants for navigation and descriptive sheet option menus.

### Changed

- Set the global body typography token `body.md` to 14px/20px and aligned web select overlay input sizing to the typography token.
- Migrated existing shared form usage to inherit neutral floating-label states.
- Moved developer-panel select controls onto the shared `SelectField` behavior.
- Moved trade option menus onto `GlobalMenuList` and made parent containers responsible for horizontal spacing.
- Added fill sizing for fixed-height detail sheet content so trade position details can use the available middle sheet area.
- Promoted detail label/value rows to `KeyValueList` so text lists do not reuse menu-list components and parent containers own horizontal spacing.
- Governed global BottomSheet height so all current sheet entries use content-first dynamic height, with scrolling only after the global max-height cap.

## 0.1.0 - 2026-05-21

### Added

- Initialized design system governance docs for the existing Dupoin Expo app.
- Added token architecture, icon rules, core component docs, business component docs, page patterns, platform rules, and quality checklists.

### Notes

- No runtime component behavior was changed.
# 2026-05-24

- Updated `icon.account.trading` to use the approved Phosphor `Vault` asset for trading-account asset containers, replacing the previous user-switch glyph.
- Added fixed icon-slot guidance in account cards so trading-account icons do not collide with equity or PnL values.
