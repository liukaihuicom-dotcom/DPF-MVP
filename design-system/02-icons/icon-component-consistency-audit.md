# Icon Component Consistency Audit

Version: `0.3.11`
Date: `2026-05-27`
Scope: app and src runtime pages, shared components, icon registry, icon QA script, design-system component manifest.

## Goal

Align every page-level icon usage with the shared component contract so icon source, color, size, style, background, and accessibility stay consistent with the design system.

## Component Contract

| Context | Required Component | Color Rule | Size Rule | Notes |
|---|---|---|---|---|
| Functional glyph | `AppIcon` | `tone` resolves to `color.icon.*` | Prefer `sizeVariant`; default is `md` / 24px | Do not import provider icons or local glyph files in pages. |
| Icon with background | `IconSurface` | default icon color is neutral primary; explicit tones control icon color and same-family subtle background | `sizeVariant` maps icon and container together | Do not compose `View + AppIcon + backgroundColor` in page code. |
| Header action | `HeaderIconButton` | component-owned tone mapping | `layout.headerIconSize` in a 40px touch target | Icon-only actions require `accessibilityLabel`. |
| Bottom tab | `TabBarIcon` | selected/idle tone from tab system | should map to `size.tab.icon` / `size.icon.sm` | Fill style only when selected. |
| Row disclosure | `AppIcon` | `tertiary` | `layout.menuDisclosureIconSize` / 16px | No background surface. |
| Flag asset | `FlagIcon` / `CurrencyFlag` | source artwork retained | component-owned size prop | Not a functional Iconsax replacement. |
| Instrument or chart drawing | `InstrumentIcon`, `Sparkline`, chart SVG | domain renderer owns color tokens | domain renderer owns dimensions | Allowed SVG exception, not a general icon pattern. |

## Current Audit Summary

| Check | Result |
|---|---|
| `pnpm qa:icons` | Passed |
| Registered functional icons | 61 |
| Registry source policy | `iconsax` primary, local vendored runtime |
| Runtime source libraries | 58 `iconsax`, 3 `custom` |
| Forbidden provider imports | 0 found |
| `AppIcon` calls in `app` + `src` | 72 |
| `IconSurface` calls in `app` + `src` | 31 |
| `AppIcon` calls using governed `sizeVariant` or approved aliases | Required |
| Page-level raw numeric `AppIcon size` | Blocked by `pnpm qa:icons` |
| Non-token numeric icon sizes | 0 allowed in production page code |
| Direct `react-native-svg` usage | Allowed only in local icon assets, flags, instruments, sparklines, and charts |

## Consistency Findings

### Passed

- Functional icons are routed through `AppIcon` and semantic `icon.*` keys in production page code.
- Runtime icon provider imports are blocked; no `@expo/vector-icons`, Lucide, Phosphor, Remix, React Icons, or Iconify imports were found in page code.
- Local icon registry, local component map, source policy, brand assets, and runtime contract pass `scripts/qa/check-icons.js`.
- Row disclosure chevrons consistently use `icon.system.chevron_right`, 16px, tertiary tone, and no background in governed list rows.
- `IconSurface` is available and widely used for status, funding operation, device risk, and feature-entry icon backgrounds.

### Fixed In 0.3.3

| Issue | Severity | Evidence | Required Fix |
|---|---|---|---|
| Page and component calls often passed raw numeric `size` instead of `sizeVariant` or token aliases | Fixed | 10, 11, 13, 14, 15, 17, 18, 22, and 42 were migrated to governed variants | Future raw values fail `HARD_CODED_APP_ICON_SIZE`. |
| Dense controls used near-token custom sizes | Fixed | `TextField`, sheet fields, auth checks, security records | Migrated to `xs`, `sm`, `md`, `xl`, or `micro` where explicitly dense. |
| Some component wrappers exposed numeric size rather than semantic variants | Fixed | `ActionButton`, `QuickActionSheet`, `StatusPill`, `TabBarIcon`, `TradeDirectionIcon` | Components now own token-bound icon sizing. |
| Display icon used non-token 42px | Fixed | Discover reward icon | Migrated to `xl`. |
| Older design docs still referenced Phosphor wrapper | Fixed in this version | `design-system/02-icons/icon-library.md`, `icon-naming.md`, `icon-principles.md` | Updated to local Iconsax + `AppIcon` registry model. |

## Governing Rules

### Source

- Production page code must not import third-party icon libraries.
- Production page code must not import local icon glyph files directly.
- Every functional icon must be registered before use.
- Custom icons require ownership, license, token binding, and QA approval.

### Size

Use these governed sizes:

| Variant | Token | Pixels | Usage |
|---|---|---:|---|
| `nano` | `size.icon.nano` | 8 | micro status mark only |
| `micro` | `size.icon.micro` | 12 | dense helper cue or badge |
| `xs` | `size.icon.xs` | 16 | row disclosure, compact inline cue |
| `sm` | `size.icon.sm` | 20 | tab, small button, dense action |
| `md` | `size.icon.md` | 24 | default functional icon |
| `lg` | `size.icon.lg` | 32 | feature card icon |
| `xl` | `size.icon.xl` | 40 | large feature entry |
| `xxl` | `size.icon.xxl` | 48 | result state |
| `display` | `size.icon.display` | 64 | display business icon |

Concrete numeric `size` is allowed only inside shared components that document why a component-specific optical adjustment is required. Page code should use `sizeVariant` or component-owned props.

### Color

- Omit `tone` for default decorative functional icons so `color.icon.primary` owns the neutral primary default.
- IconSurface neutral/default surfaces also use `color.icon.primary` for the icon itself, regardless of visible or hidden background.
- Use `tertiary` for row disclosure and passive metadata icons.
- Use `success`, `warning`, `danger`, or `info` only when the icon communicates a matching status.
- Use `up` and `down` only for market direction or trading P/L direction.
- Use `white` / `inverse` only on dark or brand-filled surfaces.
- Do not pass raw colors into `AppIcon` from page code.

### Surface

- Use `IconSurface` for icon backgrounds.
- The same `tone` must drive icon color and subtle background family.
- Icon surfaces do not use borders.
- Use `background="hidden"` only when alignment requires a reserved slot.
- Do not use `IconSurface` for row disclosure chevrons.

### Style

- `line` is the default style.
- `fill` is reserved for selected tabs, active states, verified/success emphasis, and explicit business emphasis.
- Do not simulate fill or stroke changes with page-local SVG overrides.

### Accessibility

- Decorative icons should remain hidden unless wrapped by an accessible control.
- Icon-only buttons must expose `accessibilityLabel`.
- Standalone semantic `IconSurface` must set `decorative={false}` and provide `accessibilityLabel`.

## Migration Plan

1. Keep `pnpm qa:icons` as the source, registry, mapping, provider, and runtime size gate.
2. Keep shared wrappers responsible for icon sizing: `ActionButton`, `QuickActionSheet`, `StatusPill`, `TabBarIcon`, `TextField`, and `TradeDirectionIcon`.
3. Do not add page-level `AppIcon size={number}`. Use `sizeVariant` or an approved layout/token alias.
4. Keep allowed SVG exceptions documented for flags, instruments, charts, and local icon assets.
5. Capture visual snapshots for high-traffic pages when future icon density changes alter layout.

## QA Gate

| Gate | Status | Notes |
|---|---|---|
| Source governance | Pass | Registry and runtime provider checks pass. |
| Token binding | Pass | Registry and runtime page calls use governed variants or approved token aliases. |
| Component consistency | Pass | Raw numeric page icon sizes are blocked by QA. |
| Color consistency | Pass | No blocked literal decorative tones found in current scan. |
| Surface consistency | Conditional pass | `IconSurface` exists and is used; continue preventing page-local icon background compositions. |
| Release decision | Ready | Full production icon-size consistency is enforced by `pnpm qa:icons`. |
