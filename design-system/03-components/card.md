# Card Component

## Runtime Component

`src/components/Card.tsx`

## Variants

| Variant | Props | Use |
|---|---|---|
| default | none | Standard grouped content |
| compact | `compact` | Dense rows and secondary modules |
| highlight | `highlight` | Elevated or primary content block |

## Token Binding

| Part | Token |
|---|---|
| Background | `surface.panel` or `surface.panelHigh` |
| Border | none; Card and page/sheet/dialog/business card-like surfaces must stay borderless |
| Radius | `radius.card` |
| Padding | `layout.cardPaddingX` / `layout.cardPaddingY`; compact uses `layout.cardPaddingCompactX` / `layout.cardPaddingCompactY` |
| Shadow | `shadow.panel` for highlight only |
| Title | `AppText variant="title.card"` |

Runtime values are imported from `src/theme/tokens.ts`; page-local cards should use `Card` instead of copying radius, border, and padding rules.

## Rules

- Cards should not contain unrelated page sections.
- Avoid nested cards unless the inner item is a repeated data record.
- Card-like panels in pages, sheets, and business components must use `radius.card`; controls, pills, sheets, and full-screen surfaces keep their own radius roles.
- Card-like panels in pages, sheets, dialogs, and business components must not render `borderWidth` or `borderColor`; use background, spacing, typography, and elevation for grouping.
- Card headers and card-level empty-state titles must use `title.card`; list row titles inside cards must use `title.listItem`.
