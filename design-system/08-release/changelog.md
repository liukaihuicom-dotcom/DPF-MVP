# Changelog

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
- Updated shared `Card` and custom card-like surfaces to use `layout.cardPaddingX/Y` or compact axis tokens, with `TradeOrderList` remaining a registered edge-to-edge exception.

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
