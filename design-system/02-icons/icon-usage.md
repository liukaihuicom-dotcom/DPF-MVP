# Icon Usage

Default functional icons render at 24px through `size.icon.md`. Smaller or larger icons must use governed size variants from the design system, not page-local numbers.

| Context | Size | Color |
|---|---:|---|
| Micro indicator / badge | 8 / 12 | State token |
| Dense inline / helper cue | 16 | Text muted or state color |
| Bottom tab / small button / list row | 20 | Active brand, inactive text dim |
| Default functional icon | 24 | `color.icon.primary` |
| Feature card / empty state | 32 / 40 | Text dim or state color |
| Result state / display business icon | 48 / 64 | Text dim or state color |

Linear icons use a 1.5px stroke through `lineWidth.icon.default`.

Use `line` as the default style. Use `fill` only for selected, active, state-emphasis, or business-emphasis scenarios.

Pure icons use `AppIcon` and have no background by default. Icons that need a visible background must use `IconSurface`; `IconSurface background="hidden"` is only for alignment slots that intentionally reserve the surface size without painting a background.

Whether an icon is rendered as a pure `AppIcon` or inside `IconSurface`, the icon itself defaults to `color.icon.primary`. Use `tone="tertiary"` only for explicit low-emphasis metadata, passive helper, or disclosure icons.

Single-select selected rows use the plain check mark `icon.status.check`. Do not use radio dots or circled check icons when the row container already communicates selected state.

Do not use icons as the only indicator for financial up/down movement.
