# Token Changelog

## 2.3.7 - 2026-05-27

- Added `typography.captionRegular` and the semantic `label.metric` role for 14px regular-weight secondary metric labels.
- Kept default compact labels and control labels on the existing 14px medium role.

## 2.3.6 - 2026-05-27

- Added axis-specific card padding tokens: `layout.cardPaddingX`, `layout.cardPaddingY`, `layout.cardPaddingCompactX`, and `layout.cardPaddingCompactY`.
- Kept `layout.cardPadding` and `layout.cardPaddingCompact` as legacy scalar aliases while requiring new card implementations to use axis-specific tokens.
- Documented the full-site card rule: default card horizontal content inset is 12px, default vertical padding remains 16px, and compact vertical padding remains 12px.

## 2.3.5 - 2026-05-27

- Clarified `layout.screenBottomPadding` as the full-site scroll content bottom safety gap.
- Documented that shared `Screen` combines the 32px visual gap with the device bottom safe-area inset instead of letting pages remove the gap locally.

## 2.3.4 - 2026-05-27

- Added `label.controlLarge` as the explicit 16px control-label typography role for high-emphasis segmented tabs.
- Kept default `label.control` at 14px so existing compact controls and segmented tabs do not resize unless they opt in.

## 2.3.3 - 2026-05-27

- Changed `colors.icon.secondary` and `colors.icon.tertiary` to real neutral gray values across light and dark theme modes.
- Kept `colors.icon.primary` available for explicit high-emphasis icon contexts while default functional icons now use the gray tertiary token.

## 2.3.2 - 2026-05-27

- Added component-level tab sizing tokens for pill tab height, underline tab height, and underline indicator dimensions.

## 2.3.1 - 2026-05-27

- Added keyboard-visible semantic spacing roles for bottom action areas so iOS form footers can sit close to the native keyboard without stacking safe-area padding.
- Synchronized `layout.bottomActionArea.*` between the design-token package runtime and the app compatibility runtime.

## 2.3.0 - 2026-05-26

- Added production semantic spacing roles on `layout.*` for page modules, sections, cards, list rows, forms, controls, BottomSheet content, quote groups, and dense data rows.
- Added `layout.formFieldTextInset` at `spacing.md / 12` for shared form shell horizontal text insets.
- Kept the base spacing scale unchanged at `0 / 2 / 4 / 8 / 12 / 16 / 24 / 32 / 48`.
- Registered semantic spacing in the token registry and export map so future projects consume layout meaning instead of page-local spacing guesses.

## 2.2.1 - 2026-05-26

- Increased `typography.buttonLg` to 20px / 600 / 24 for large `ActionButton` entry CTAs.
- Kept default button labels on `typography.buttonMd` at 16px.

## 2.2.0 - 2026-05-26

- Added the `typography.microMeta` 10px token for ultra-compact metadata through `label.minimum` only.
- Consolidated close typography sizes into the active 10 / 12 / 14 / 16 / 20 / 28 / 34 / 42 scale.
- Mapped legacy-compatible 13px, 17px, 18px, 22px, and 24px roles onto the consolidated 12px, 16px, 20px, and 28px tiers.

## 2.1.0 - 2026-05-26

- Established the independent `@dpf/design-tokens` package boundary.
- Migrated token registry, color tokens, mode matrix, alias map, export map, runtime token exports, and code mappings from the former design-system engineering directories.
- Kept `src/theme/tokens.ts` and `src/theme/colors.ts` as compatibility runtime paths for the first migration stage.

## v2.1.0-icon-surface-governance

- Added `size.icon.nano` at 8px and moved `size.icon.micro` to 12px while keeping `size.icon.mini` as the 12px compatibility alias.
- Added `size.iconSurface.*` and runtime `layout.iconSurface.*` mappings for governed icon background slots.
- Added `layout.menuDisclosureIconSize` at 16px for right-side menu and row disclosure indicators.
- Added icon surface tone rules so one semantic tone controls both icon color and same-family subtle background.

## v2.0.0-production-structure

- Added L5 token index, schema, alias map, export map, and QA rules.
- Kept `tokens.color.json` and `token-mode.matrix.json` as the color source of truth.
- Mapped runtime non-color tokens to `src/theme/tokens.ts`.
