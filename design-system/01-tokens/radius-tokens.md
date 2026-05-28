# Radius Tokens

| Token | Value | Use |
|---|---:|---|
| radius.none | 0 | Flush tabs and structural containers |
| radius.xxs | 2 | Compact chart bars and dense visualization marks |
| radius.xs | 4 | Small tags |
| radius.sm | 8 | Inputs and compact controls |
| radius.md | 12 | Base 12px radius for legacy and non-card compatibility |
| radius.card | 12 | Semantic card and card-like panel radius |
| radius.lg | 14 | Large compact controls and numeric utility geometry |
| radius.xl | 16 | Large button-like controls |
| radius.sheet | 24 | Bottom sheet and app preview device canvas corners |
| radius.full | 999 | Circular icons and pill buttons |

## Rules

- Repeated cards and card-like panels must use `radius.card`.
- `radius.md` remains a same-value base alias for older non-card surfaces, but new card work should not bind to it directly.
- BottomSheet shells and the Codex app preview device canvas use `radius.sheet`.
- Pill radius is allowed for buttons, status badges, and circular icon controls.
