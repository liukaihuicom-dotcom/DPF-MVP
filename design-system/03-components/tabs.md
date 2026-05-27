# Tabs Component

## Runtime Component

- Bottom navigation uses Expo Router `Tabs` in `app/(tabs)/_layout.tsx`.
- In-page segmented controls use `src/components/SegmentedTabs.tsx`.

## Rules

- Use fixed tab bar height and label sizing to avoid layout shift.
- Active color maps to `brand`.
- Inactive color maps to `text.dim`.
- Hidden routes must use `options={{ href: null }}`.

## Segmented Tabs

Use `SegmentedTabs` for mutually exclusive in-page choices such as order type, filter mode, or compact state switching.

Variants:

- `pill`: horizontal filter tabs for compact market/category switching. Selected items must use a visibly stronger border and primary text tone than inactive items.
- `underline`: content-section tabs with a selected underline indicator for detail or order-view switching.
- `labelSize="large"`: explicit 16px label sizing for high-emphasis content tabs such as Trade order-view tabs. Defaults stay at 14px.

| Part | Token Binding |
|---|---|
| Rail background | `palette.panelSoft` |
| Rail border | `palette.lineSoft` + `lineWidth.hairline` |
| Selected item background | `palette.panel` |
| Selected item border | `palette.line` + `lineWidth.selected` for `pill` |
| Underline indicator | `size.tab.indicatorWidth` × `size.tab.indicatorHeight` |
| Radius | `radius.full` |
| Gap and padding | `spacing.xs` |
| Minimum item height | `size.tab.itemMinHeight`, `size.tab.pillMinHeight`, `size.tab.underlineMinHeight` |
| Label | `AppText variant="label.control"` by default, or `label.controlLarge` when `labelSize="large"` is explicitly set |

Rules:

- Page code should pass `items`, `value`, and `onValueChange`; it should not recreate local segmented-tab rail styles.
- Each option must expose `accessibilityRole="tab"` and selected state.
- Use `SegmentedTabs` for compact tabs inside cards, sheets, and order tickets; use Expo Router `Tabs` only for app-level navigation.
- Expo Router bottom tab labels must use `titleTypography.bottomTabs`; in-page segmented tab labels must use `label.control`.
- Only high-emphasis in-page tabs should opt into `labelSize="large"`; page code must not hardcode 16px tab text.
