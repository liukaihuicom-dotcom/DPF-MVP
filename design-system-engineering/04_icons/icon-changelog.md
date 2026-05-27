# Icon Changelog

## 4.1.8 - 2026-05-27

- Updated icon usage governance so `IconSurface` neutral/default icons use the same neutral primary `color.icon.primary` rule as pure no-background `AppIcon` glyphs.
- Added QA coverage to prevent neutral/default `IconSurface` from falling back to tertiary gray icon color while preserving explicit `tertiary` as a low-emphasis tone.

## 4.1.7 - 2026-05-27

- Updated governed `icon.account.trading` to use the same local Iconsax `Wallet` glyph as the bottom-navigation Accounts tab.
- Preserved the `icon.account.trading` semantic key and legacy aliases while aligning trading-account entry points, account switchers, funding account fields, and account workspace shortcuts to the bottom-navigation account icon.
- Clarified the trading-account icon usage rule so this visual alignment does not make wallet, bank institution, deposit, withdrawal, archive, or personal profile meanings interchangeable.

## 4.1.5 - 2026-05-27

- Updated icon usage governance so ordinary no-tone `AppIcon` glyphs default to neutral primary through `color.icon.primary`, not brand color.
- Kept `brand` and `tertiary` as explicit semantic tones for selected/product emphasis and low-emphasis disclosure or metadata icons.

## 4.1.4 - 2026-05-27

- Added governed `icon.system.password_hidden` for credential visibility toggles that need distinct visible and hidden states.
- Updated icon usage governance so ordinary no-tone `AppIcon` glyphs default to neutral gray instead of primary text color or brand emphasis.
- Clarified the pure no-background `AppIcon` style and the `IconSurface` visible/hidden background variants for page and component usage.

## 4.1.3 - 2026-05-26

- Updated `icon.status.check` from a circled check to a plain custom-owned check mark for single-select, checkbox, and compact selected indicators.
- Added the global rule that selected single-select rows use `icon.status.check` instead of radio dots or circled check icons when the row container already carries selected state.

## 4.1.2 - 2026-05-26

- Updated governed `icon.trading.market` to the Iconsax `ChartSquare` glyph so bottom-navigation active fill and inactive line states share the same visual silhouette.
- Updated the bottom-navigation account tab to consume governed `icon.wallet.balance` for asset semantics.

## 4.1.1 - 2026-05-26

- Updated governed `icon.system.back` to a custom-owned shafted back arrow for clearer header navigation.
- Updated governed `icon.system.close` to a custom-owned plain close glyph so cancel/dismiss actions no longer inherit status-circle semantics.

## 4.1.0 - 2026-05-26

- Added governed `IconSurface` for icon + background compositions.
- Bound icon and background colors to a single semantic tone so surfaces stay in the same color family.
- Removed bordered icon background patterns from migrated app surfaces.
- Added `nano` 8px and `micro` 12px naming while preserving the governed 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 icon size scale.
- Standardized right-side disclosure chevrons to pure 16px tertiary `AppIcon` usage without backgrounds.
- Added QA coverage for page-local icon surfaces, ad hoc alpha icon backgrounds, bordered icon surfaces, and non-governed disclosure chevrons.

## 4.0.0 - 2026-05-26

- Migrated all AppIcon-governed functional icons to local Iconsax glyphs under `src/icons/local/iconsax`.
- Updated source policy to `iconsax` primary plus retained `custom` brand assets; blocked Iconsax runtime imports and old Phosphor/Lucide/Remix runtime sources.
- Mapped `styleVariant="line"` to Iconsax Linear and `styleVariant="fill"` to Iconsax Bold for active/emphasized states.
- Preserved semantic `icon.*` keys and legacy migration aliases so page behavior and business copy remain unchanged.

## 3.4.0 - 2026-05-25

- Expanded governed icon sizes to 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64.
- Set the global functional icon default to 24px through `size.icon.md`.
- Added governed `AppIcon` size and style variants for line and fill usage.
- Standardized linear icon stroke width to `lineWidth.icon.default` at 1.5px.
- Added QA coverage for default size, size scale, style contract, and stroke-width contract.

## 3.3.0 - 2026-05-25

- Added runtime `colors.icon.*` theme tokens and aligned default functional icon color to text level 1 through `color.icon.primary`.
- Updated `AppIcon` tone resolution so decorative legacy tones normalize to the unified default while state, disabled, inverse, and market-risk tones remain governed exceptions.
- Added icon QA coverage for blocked literal decorative `AppIcon` tones in page and component code.

## 3.2.0 - 2026-05-24

- Added governed global flag assets from `flag-icons` v7.5.0 under `src/assets/flags/flag-icons`.
- Added `FlagIcon` with `circle`, `square`, and `rectangle` shape support; default shape is `circle`.
- Updated `CurrencyFlag` and phone country flag badges to consume the governed flag asset system.
- Documented flag source, license, coverage, runtime, and forbidden usage rules.

## 3.1.0 - 2026-05-24

- Vendored approved source glyphs into `src/icons/local` so all functional icon files live in the local project.
- Updated `AppIcon` to render local vendored components only; third-party icon runtime packages are blocked in dependencies and imports.
- Added `local_asset_path` and runtime local asset policy checks to icon governance and QA.

## 3.0.0 - 2026-05-24

- Migrated the production icon source policy to the latest Icon Asset Library Governance Skill.
- Replaced Hugeicons runtime dependencies with Phosphor primary, Remix financial/business supplement, and Lucide system-operation supplement packages.
- Rebuilt `icon-registry.json` as an `icons` array with `icon.*` semantic keys, source metadata, license metadata, token bindings, states, and migration aliases.
- Updated `AppIcon` to dispatch icons by `source_library` and blocked low-level icon imports outside the runtime bridge.
- Added QA blockers for Hugeicons references, unregistered functional SVG, low-level icon imports, missing source glyphs, invalid token bindings, and legacy icon usage.

## 2.2.1 - 2026-05-23

- Added scene-specific semantic icons for deposit, withdrawal, balance, trading account, trade ticket, order list, position close, close losing position, app rating, help center, function center, trade volume, and instrument asset classes.
- Deprecated broad legacy semantic names: `actionRefresh`, `accountBank`, `taskChecklist`, and `qrCode`.

## 2.0.0 - 2026-05-22

- Previous Hugeicons-based runtime. Deprecated by v3.0.0 and blocked by current source policy.

## 1.0.0 - 2026-05-22

- Added the first L5 icon registry, semantic naming, usage rules, core list, schema, and QA rules.
