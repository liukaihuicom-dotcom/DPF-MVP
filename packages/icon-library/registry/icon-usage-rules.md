# Icon Usage Rules

## L5 Rules

- Pages and feature components must consume semantic `icon.*` registry keys through `AppIcon`.
- `AppIcon` must render only local vendored icon components from `src/icons/local/iconsax`; it must not import third-party icon runtime packages.
- Iconsax is the primary functional icon source. Runtime imports from `iconsax-react-native` are blocked; glyphs must be written into local files first.
- `AppIcon` defaults to `color.icon.primary`, which resolves to the neutral primary icon color in every theme mode; ordinary functional icons must not default to brand color.
- Icon surfaces must use `IconSurface`; page and feature code must not compose `View + AppIcon + backgroundColor` locally.
- `IconSurface` uses one `tone` to resolve both icon color and same-family subtle background. Red/danger icons use danger backgrounds, warning icons use warning backgrounds, info icons use info backgrounds, and neutral/default icon surfaces use neutral primary icon color on neutral subtle backgrounds.
- `IconSurface background="visible"` and `IconSurface background="hidden"` share the same default icon color rule: the icon itself defaults to `color.icon.primary` unless an explicit semantic tone is supplied.
- Icon backgrounds do not use border styles. `IconSurface` does not expose a bordered variant.
- `IconSurface background="hidden"` keeps the width and height for alignment while painting no background. If no slot should be reserved, use pure `AppIcon`.
- `GlobalMenuList` left-side icons must use pure 24px `AppIcon` glyphs aligned to the row content start; do not use `IconSurface background="hidden"` for menu-row left icons.
- Single-select selected rows must use the plain check mark `icon.status.check`; do not use radio dots, circled check icons, or a second selected ring when the row container already carries selected state.
- Page and feature code must omit decorative icon tones such as `brand`, `blue`, `text`, `textMuted`, or `textDim`; use explicit `tone` only for governed selected, status, risk, disabled, market, tertiary low-emphasis, or inverse contrast contexts.
- Brand assets, launcher icon, splash icon, favicon, content logo, Apple sign-in mark, and country flags are retained visual assets, not functional Iconsax replacements.
- Custom icons require a Custom Icon Request with ownership, style, license, token, and QA approval before use.

## Financial Product Rules

- Use market tones `up` and `down` only when the icon communicates market direction or trading P/L direction.
- Use `danger` only for destructive, blocked, failed, or compliance-risk actions.
- Use `brand` only for selected, active, verified, or product-owned actions where brand emphasis is part of the interaction state.
- Do not use generic wallet imagery for every account-related concept; wallet, trading account, banking, and identity icons must stay semantically distinct.
- `icon.account.trading` intentionally uses the same Wallet glyph as the bottom-navigation Accounts tab for cross-site account-entry consistency; keep the semantic key for trading-account workspace, switcher, list, margin account, and funding account-field usage.
- Use `tertiary` only for explicit low-emphasis metadata, passive helper, or disclosure surfaces; do not use it as the default `IconSurface` neutral icon color.
- Operations and rewards icons must not appear in core trading, funding, or risk paths unless the registry usage explicitly allows it.
- Dropdown and expandable controls must use `icon.system.chevron_down`; row disclosure must use pure `icon.system.chevron_right` at 16px with `tertiary` tone and no background.

## Size Rules

- Registry sizes must be limited to 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64.
- `AppIcon` defaults to `size.icon.md`, which is 24px.
- Runtime icon calls should use `sizeVariant` for governed icon sizes; concrete `size` is migration-compatible only for documented component-owned exceptions.
- 8px and 12px are only for micro indicators, badges, and dense helper cues; they are not default functional icon sizes.
- Governed pure icon sizes are nano 8px, micro 12px, xs 16px, sm 20px, md 24px, lg 32px, xl 40px, xxl 48px, and display 64px.
- Governed icon surface sizes are micro 12/20, xs 16/28, sm 20/32, md 24/40, lg 32/48, and xl 40/64, expressed as icon/container pixels.
- 48px and 64px are only for empty states, result states, feature entry visuals, and display business icons.
- Every registry entry must bind to `size.icon.*` and `color.icon.*` tokens.

## Style Rules

- Linear Iconsax glyphs are the default style for functional icons.
- `AppIcon` supports `styleVariant="line"` and `styleVariant="fill"`; default is `line`.
- `styleVariant="line"` maps to Iconsax `Linear`; `styleVariant="fill"` maps to Iconsax `Bold`.
- Fill style is reserved for selected, active, state-emphasis, or business-emphasis scenarios.
- Page code must not simulate fill or stroke changes through local SVG overrides.

## Provider Rules

- Approved functional source is Iconsax, vendored as local components under `src/icons/local/iconsax`.
- The retained Apple sign-in mark is treated as a custom local brand asset.
- Every semantic icon must carry source metadata: `source_library`, `source_icon_name`, `license`, `license.url`, `license.attribution_required`, and `modified`.
- Unknown-source SVG, competitor-derived glyphs, emoji, bitmap functional icons, and page-local functional SVG are blocked from production.
- Low-level icon runtime imports are blocked everywhere, including `src/components/AppIcon.tsx`; pages must only use semantic `AppIcon`.

## Local Asset Rules

- Every functional registry entry must declare `local_asset_path` under `src/icons/local/iconsax/`.
- Local vendored icon files must keep source and license comments.
- Third-party icon runtime packages such as `iconsax-react-native`, `phosphor-react-native`, `lucide-react-native`, `react-native-remix-icon`, and `@expo/vector-icons` are blocked from dependencies and source imports.

## Flag Asset Rules

- Country and region flags are governed visual assets, not functional system icons.
- Flag artwork source is `flag-icons` v7.5.0, MIT license, vendored under `src/assets/flags/flag-icons`.
- Flag rendering must go through `src/components/FlagIcon.tsx` or approved wrappers such as `CurrencyFlag`.
- `FlagIcon` supports `circle`, `square`, and `rectangle`; default shape is `circle`.
- `circle` and `square` use 1x1 assets; `rectangle` uses 4x3 assets.
- Do not use emoji flags, text-only country badges, unknown-source SVG, or page-local flag SVG for production UI.
