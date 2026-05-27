# Icon Library

Current functional icon source: local vendored Iconsax components.

## Runtime Entry

Production pages and feature components must call icons through:

- `src/components/AppIcon.tsx` for a pure semantic glyph.
- `src/components/IconSurface.tsx` for a governed icon container with background.
- `src/components/FlagIcon.tsx` or `CurrencyFlag` for country and currency flags.
- Domain renderers such as `InstrumentIcon` only for asset or instrument medallions.

Do not import provider icon packages, local glyph files, SVG paths, or remote icon URLs from page code.

## Source And Registry

The governance source is:

- `packages/icon-library/registry/icon-registry.json`
- `design-system-engineering/04_icons/icon-registry.json`
- `src/icons/iconRegistry.ts`
- `src/icons/local/iconComponentMap.ts`

Allowed source libraries:

- `iconsax`
- `custom`, only after ownership, license, and QA approval

Blocked runtime libraries:

- `@expo/vector-icons`
- `iconsax-react-native`
- `phosphor-react-native`
- `lucide-react-native`
- `react-native-remix-icon`
- `react-icons`
- `@iconify/react`

## Adding Icons

New functional icons must be registered before use:

1. Add the semantic `icon.{category}.{meaning}` key to the icon registry.
2. Vendor the local glyph under `src/icons/local/iconsax`.
3. Map the glyph in `src/icons/local/iconComponentMap.ts`.
4. Bind the icon to `color.icon.*` and `size.icon.*`.
5. Run `pnpm qa:icons`.
6. Record the change in `design-system/08-release/changelog.md`.
