# Migration Guide

## v2.2.0 Global Dialog And BottomSheet Governance

- Use `GlobalDialog` for centered feedback, confirmation, and error dialogs that must keep the current centered visual design.
- Keep selection, detail, menu, and stacked bottom surfaces on `BottomSheetProvider` / `GlobalBottomSheetHost` through `bottomSheetPresets.selection`, `bottomSheetPresets.detail`, or `bottomSheetPresets.actionMenu`.
- Do not import React Native `Modal` in business pages or feedback components; `GlobalDialog` owns centered feedback Modal, while `TextField` web select and `TradingTerminalChart` fullscreen remain registered technical exceptions.
- Do not build page-local bottom sheet scrims, handles, safe-area shells, absolute bottom containers, footer dividers, or scroll/footer hacks.

## v2.1.14 Card-like Surface Borderless Governance

- Card, page card-like panels, sheet cards, dialog cards, and business card surfaces must stay borderless.
- Remove `borderWidth` and `borderColor` from card-like style blocks; if a style needs an explicit value for compatibility, use `borderWidth: lineWidth.none`.
- Keep functional borders on form fields, outline buttons, chips, icon shells, dividers, chart tool chips, and explicit selection indicators.
- Use background, spacing, typography, and optional governed elevation rather than outlines to separate card content.

## v2.1.0 ActionButton Two-Variant Contract

- Replace `emphasis="solid"` with `variant="filled"`.
- Replace implicit soft/default `ActionButton` usage with an explicit `variant`: use `filled` for primary actions and `outline` for secondary actions.
- Replace `variant="text"` with a text action pattern using `NativePressable` plus `AppText`; do not reintroduce text as a global Button variant.
- Remove page-local Button background or border overrides that recreate mixed background plus outline styles.
- Keep `filled` as semantic background with `lineWidth.none`; keep `outline` as transparent background with a token border.

## v2.0.1 LightBroker Primary Neutral Softening

- No API, component, route, or import migration is required.
- Continue consuming primary text through `colors.text.primary` and default functional icons through `colors.icon.primary`; do not add page-local hardcoded black values to restore the old tone.
- If a specific surface needs lower emphasis, use existing secondary or tertiary semantic roles rather than overriding primary with page-local colors.
- Keep `neutral.900/950`, overlay black tokens, inverse surfaces, darkTerminal, and midnightBlue unchanged.

## v2.0.0 Global Market Color Semantics

- Treat `colors.market.up.*`, `tone="up"`, and `colors.overlay.up.*` as trading-up/positive amount/profitable PnL semantics. They now render green, with `fg` and `solid` at `#2EA379`.
- Treat `colors.market.down.*`, `tone="down"`, and `colors.overlay.down.*` as trading-down/negative amount/loss PnL semantics. They now render red.
- Do not use `up` or `down` to express generic feedback. Success Toast, completed, paid, approved, and form success text must use `status.success`, `icon.success`, or `tone="success"`.
- Audit legacy usages that chose `down` only because it was green. Remap those cases by business meaning to `up`, `down`, or `success`.
- The standard blue is now `#1F72E8`; light-mode information, links, blue accent foregrounds, and solid fills use that value, while dark-mode foreground text may keep accessible lighter blue variants.

## v1.10.0 Full-site Horizontal Spacing

- Use `Screen` default card mode for gray/card-based route content; it applies 12px horizontal content inset.
- Use `Screen contentPadding="plain"` only for white/plain text and form surfaces that need the 16px content inset.
- Use `bottomSheetPresets.*({ contentPadding: 'plain' })` for white/plain text or form sheet bodies; omit it for card-mode sheet content.
- Do not add page-local horizontal wrappers around `Card`, `GlobalMenuList`, `DetailRow`, `TransactionRow`, or `KeyValueList` to repair the global gutter.
- Header/title bars and bottom fixed action areas must stay on the 16px token contract through shared components.

## Current Migration

- Use `packages/design-tokens`, `packages/component-library`, and `packages/icon-library` as the independent source-of-truth packages for tokens, base components, and icons.
- Continue using `design-system/` for human-readable overview documentation only.
- Use `design-system-engineering/` for AI runtime orchestration, cross-package dependency rules, QA gates, compatibility mirrors, and migration records.
- Treat `design-system-engineering/01_tokens`, `design-system-engineering/02_components`, and `design-system-engineering/04_icons` as temporary compatibility mirrors until runtime imports and QA consumers have fully migrated.
- Keep executable QA checks in root `scripts/qa/`.
- Add new visual QA artifacts under `qa/visual/`.
