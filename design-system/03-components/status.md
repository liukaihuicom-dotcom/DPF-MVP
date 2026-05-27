# Status Component

## Runtime Component

`src/components/StatusPill.tsx`

## API

| Prop | Type | Required | Description |
|---|---|---:|---|
| label | string | yes | Human-readable status or metadata |
| tone | success/warning/danger/info/neutral/brand/up/down | yes | Semantic tone |
| icon | PhosphorIconName or ReactNode | no | Optional leading icon |
| appearance | `filled` or `outline` | no | `filled` renders text + background only; `outline` renders text + line only |
| size | `md` or `sm` | no | Explicit badge size; `sm` uses the component-library small badge tokens |
| compact | boolean | no | Dense badge layout |
| style | ViewStyle | no | Layout-only override |

## Required Status Types

| Type | Use | Color Token |
|---|---|---|
| success | Completed operation | `state.down` or dedicated success token |
| warning | Pending review, risk caution | `state.warning` |
| danger | Error, blocked action | `state.danger` |
| info | Quote or system information | `brand.teal` |
| neutral | Metadata | `text.dim` |
| brand | Product-selected or current module state | `brand.teal` |
| up/down | Trading direction and market movement | `state.up/down` |

## Rule

Status copy must include the meaning, not just color. Example: "Pending review", not only amber color.

Status tag visuals have exactly two approved styles:

- `appearance="filled"`: text + semantic background, no line.
- `appearance="outline"`: text + semantic line, no background.

Do not render text + background + line in the same tag.

Visual values are bound to `ThemePalette`, `radius.full`, and `AppText` caption variants. Page-local semantic pills are not allowed.

Use `size="sm"` or `compact` for inline account/list badges where the status should not compete with the primary identifier.

## Migration Boundary

Use `StatusPill` for semantic state, account status, upgrade status, filters, and metadata chips.
Decorative icon tiles and quote-change badges may keep local structure when they are chart/list composition rather than reusable status.
