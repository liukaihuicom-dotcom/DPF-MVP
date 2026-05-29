# Token Changelog

## 3.3.0 - 2026-05-29

- Added `layout.sheetContentPaddingX` at 16px as the dedicated BottomSheet plain/list/article-detail content horizontal inset.
- Kept card-mode content on `layout.contentCardPaddingX` at 12px for page cards and BottomSheet card content.
- Documented the BottomSheet horizontal contract: Header 16px, card content 12px, list/article/detail-introduction content 16px, and Footer 16px.

## 3.2.0 - 2026-05-29

- Added `motion.overlay.exitTranslateY` for shared internal overlay visual dismissal translation.
- Added `motion.overlay.footerExitOpacityPivot` so fixed bottom-sheet footers stay opaque until the final dismissal segment.
- Synchronized package token source, compatibility runtime tokens, registry metadata, and export-map coverage for BottomSheet dismissal governance.

## 3.1.0 - 2026-05-28

- Added the semantic `radius.card` role at 12px for standard Card, card-like page panels, sheet content cards, and business component panels.
- Registered `semanticRadiusRoleMap`, CSS variables, Tailwind border-radius mapping, and export-map metadata so card radius is governed separately from the legacy same-value `radius.md` alias.
- Preserved existing sheet, pill, input, and full-screen radius roles so non-card controls keep their own shape contracts.

## 3.0.1 - 2026-05-28

- Softened the lightBroker neutral primary semantic color from `#0A0B0D` to `#1F2329` for `colors.text.primary`, `colors.icon.primary`, and `colors.icon.active`.
- Preserved L1 neutral ramps, overlay blacks, inverse surfaces, and dark theme primary colors so the change remains a non-breaking light-mode readability adjustment.
- Synchronized registry, mode matrix, runtime color exports, compatibility theme colors, and CSS variable mappings for the global primary neutral contract.

## 3.0.0 - 2026-05-28

- Changed the standard blue token value to `#1F72E8` across blue primitives, light-mode info/link/accent semantics, and solid blue fills while preserving accessible light-blue foregrounds for dark modes.
- Migrated market semantics to global trading convention: `colors.market.up.*` is green with `fg/solid` at `#2EA379`, and `colors.market.down.*` is red for negative movement, sell direction, and loss PnL.
- Kept feedback success tokens independent: `colors.status.success.*`, `colors.icon.success`, success Toast, completed states, and paid states continue to use the existing success-green family instead of `#2EA379`.
- Added a migration rule for old code that used `down` as a green positive value: remap by business meaning to `up`, `down`, or `success`.

## 2.5.0 - 2026-05-28

- Added the full-site horizontal content inset contract: card-mode page and BottomSheet card content use `layout.contentCardPaddingX` at 12px, while BottomSheet plain/list/article-detail introduction content and top bars use governed 16px aliases.
- Changed `layout.listRowPaddingX` to the governed 12px list/row horizontal inset while preserving `layout.formFieldTextInset` at 12px and footer action horizontal padding at 16px.
- Synchronized package and runtime compatibility token registries, export maps, and spacing documentation for the new 12px/16px layout policy.

## 2.4.1 - 2026-05-28

- Added first-batch public-resource migration token governance for chart samples, chart dimensions, risk gauge dimensions, instrument detail visualization ratios, and app viewport semantic roles.
- Synchronized `packages/design-tokens`, `design-system-engineering/01_tokens`, and `src/theme` token surfaces so migrated pages consume semantic roles instead of page-local numeric visual constants.

## 2.4.0 - 2026-05-28

- Added governed Codex app preview viewport tokens for a 390 x 844 native app canvas.
- Added web-only preview safe-area inset tokens so Codex browser previews can simulate native top and bottom safe areas while iOS/Android keep real device metrics.
- Changed `layout.appMaxWidth` to alias `layout.appDeviceWidth` so product pages no longer expand to desktop/tablet width in Codex web preview.

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
