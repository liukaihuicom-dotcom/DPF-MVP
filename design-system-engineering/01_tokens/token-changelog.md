# Token Changelog

## v3.1.0-card-radius-governance

- Added `radius.card` as the semantic 12px role for standard Card, card-like page panels, sheet content cards, and business component panels.
- Registered `semanticRadiusRoleMap`, CSS variables, Tailwind border-radius mapping, and export-map metadata so card radius is governed separately from the legacy same-value `radius.md` alias.
- Preserved sheet, pill, input, and full-screen radius roles so non-card controls keep their existing shape contracts.

## v2.3.8-lightbroker-primary-neutral-softening

- Softened lightBroker `color.semantic.text.primary`, `color.semantic.icon.primary`, and `color.semantic.icon.active` from `#0A0B0D` to `#1F2329`.
- Kept primitive neutral ramps, overlay black tokens, inverse surfaces, darkTerminal, and midnightBlue unchanged to avoid expanding the global color impact.
- Synced package token source, engineering mirror, runtime color exports, compatibility theme colors, and CSS variable mappings.

## v2.3.7-metric-label-typography

- Added `typography.captionRegular` and `label.metric` for 14px regular-weight secondary metric labels beside a primary financial figure.
- Kept `label.default` and `label.control` on the existing 14px medium typography role so compact labels and controls do not lose emphasis globally.

## v2.3.6-card-axis-padding

- Added `layout.cardPaddingX`, `layout.cardPaddingY`, `layout.cardPaddingCompactX`, and `layout.cardPaddingCompactY` for full-site card horizontal and vertical spacing governance.
- Kept `layout.cardPadding` and `layout.cardPaddingCompact` as legacy scalar aliases while requiring new card and panel implementations to use axis-specific tokens.
- Documented the 12px card horizontal content inset rule without compressing default 16px vertical card rhythm.

## v2.3.5-screen-safe-bottom

- Clarified `layout.screenBottomPadding` as the full-site scroll content bottom safety gap.
- Documented that shared `Screen` combines the 32px visual gap with the device bottom safe-area inset instead of letting pages remove the gap locally.

## v2.3.4-segmented-tab-large-label

- Added `label.controlLarge` as the explicit 16px control-label role for high-emphasis segmented tabs.
- Kept `label.control` at 14px so compact controls and default segmented tabs stay unchanged unless a component opts into the large role.

## v2.3.3-icon-default-gray

- Changed runtime `colors.icon.secondary` and `colors.icon.tertiary` to real neutral gray values across light and dark theme modes.
- Clarified that default functional icons consume the neutral primary icon token, while tertiary remains explicit low-emphasis usage.

## v2.2.1-keyboard-bottom-action-spacing

- Added keyboard-visible `layout.bottomActionArea.keyboardContentInset` and `layout.bottomActionArea.keyboardPaddingBottom` roles for iOS bottom action areas.
- Synchronized governed bottom action spacing between package tokens and the app compatibility runtime.

## v2.2.0-spacing-semantic-governance

- Added production semantic spacing roles on `layout.*` for page modules, sections, cards, list rows, forms, controls, BottomSheet content, quote groups, and dense data rows.
- Added `layout.formFieldTextInset` at `spacing.md / 12` for shared form shell horizontal text insets.
- Kept the base spacing scale unchanged at `0 / 2 / 4 / 8 / 12 / 16 / 24 / 32 / 48`.
- Registered spacing scale and semantic spacing governance rules in token registry metadata.

## v2.1.0-icon-surface-governance

- Added `size.icon.nano` at 8px and moved `size.icon.micro` to 12px while keeping `size.icon.mini` as the 12px compatibility alias.
- Added `size.iconSurface.*` and runtime `layout.iconSurface.*` mappings for governed icon background slots.
- Added `layout.menuDisclosureIconSize` at 16px for right-side menu and row disclosure indicators.
- Added icon surface tone rules so one semantic tone controls both icon color and same-family subtle background.

## v2.0.0-production-structure

- Added L5 token index, schema, alias map, export map, and QA rules.
- Kept `tokens.color.json` and `token-mode.matrix.json` as the color source of truth.
- Mapped runtime non-color tokens to `src/theme/tokens.ts`.
