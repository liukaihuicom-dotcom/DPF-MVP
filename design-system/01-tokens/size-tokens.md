# Size Tokens

Size tokens define component dimensions and layout constraints. They are separate from spacing tokens: spacing handles distance between or inside elements, while size handles the element's own height, width, min/max dimensions, touch area, and viewport constraints.

## Core Scale

| Token | Value | Use |
|---|---:|---|
| control.height.sm | 40 | Compact buttons and icon rows |
| control.height.md | 48 | Default CTA height |
| control.height.lg | 56 | Input and large CTA height |
| header.icon-button | 40 | Reserved header icon-button area for level-1 pages, level-2 pages, and sheet title bars |
| fund-action.icon-box | 40 | Reserved visual box for deposit, withdraw, transfer, and account funding action glyphs |
| touch.min | 44 | Minimum touch target |
| icon.micro | 8 | Micro indicators and tiny badges |
| icon.mini | 12 | Dense helper cues and compact status glyphs |
| icon.xs | 16 | Dense inline icons |
| icon.sm | 20 | Tab, small button, and list icons |
| icon.md | 24 | Default functional icons, toolbars, and sheet icons |
| icon.lg | 32 | Feature cards and empty-state icons |
| icon.xl | 40 | Large function-entry glyphs |
| icon.xxl | 48 | Result-state icons |
| icon.display | 64 | Display business icons |
| icon.fund-action | 24 | Deposit, withdraw, and transfer action glyph size |
| tabbar.height | 68 | Current bottom tab bar |

## Runtime Mapping

| Runtime Token | Value | Use |
|---|---:|---|
| `size.control.sm` | 40 | Compact controls and dense icon rows |
| `size.control.md` | 48 | Default controls and CTA baseline |
| `size.control.lg` | 56 | Large controls and input baseline |
| `size.button.minHeight` | 48 | Shared action button minimum height |
| `size.button.icon` | 40 | Header or icon-only button reserved area |
| `size.input.singleLineMinHeight` | 52 | Single-line text field shell |
| `size.input.floatingMinHeight` | 58 | Floating-label text field shell |
| `size.input.multilineMinHeight` | 118 | Multiline text field shell |
| `size.tag.smMinHeight` | 26 | Compact status pill |
| `size.tag.mdMinHeight` | 30 | Default status pill |
| `size.tab.barHeight` | 68 | Bottom tab bar height |
| `size.tab.itemMinHeight` | 44 | Minimum tab item touch height |
| `size.tab.pillMinHeight` | 40 | In-page pill tab visual height |
| `size.tab.underlineMinHeight` | 56 | In-page underline tab visual height |
| `size.tab.indicatorHeight` | 2 | Underline selected indicator height |
| `size.tab.indicatorWidth` | 64 | Underline selected indicator width |
| `size.icon.micro/mini/xs/sm/md/lg/xl/xxl/display` | 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 | Governed icon size variants; 24px is the default |
| `size.touch.min` | 44 | Minimum touch target |
| `size.sheet.headerHeight` | 56 | Global BottomSheet title bar and spacer |
| `size.sheet.tradeHeaderMinHeight` | 76 | Trading/order sheet information header with account and quote summary |
| `size.sheet.handleWidth` | 40 | BottomSheet drag handle width |
| `size.viewport.appMaxWidth` | 430 | Mobile app shell max width on web/tablet |
| `size.viewport.toastMaxWidth` | 420 | Toast max width |

## Usage Rules

- Use fixed `height` for stable component baselines such as buttons, input shells, tab bars, headers, icon buttons, tags, and list rows.
- Use `minHeight` for content that may wrap or grow, such as forms, multiline inputs, cards, list rows, status panels, and modal content.
- Use `maxHeight` for scroll containers and overlays, including BottomSheet, modal bodies, long pickers, and long lists.
- Use `minWidth` to protect controls from collapsing, including buttons, chips, tabs, amount fields, action cells, and metric columns.
- Use `maxWidth` for page and overlay constraints, including app viewport, dialog, toast, form container, and web shell.
- `minWidth: 0` is a flex truncation utility and does not require a size token.
- Chart, SVG, canvas, brand-mark, and complex visualization dimensions may be component-owned exceptions, but they must not be copied into ordinary page layout.

## Component Mapping

| Component or Pattern | Required Size Source |
|---|---|
| Button | `size.button.minHeight`, `size.button.icon`, `size.touch.min` |
| Text field / select | `size.input.*`, `size.control.*` |
| Status pill / chip / badge | `size.tag.*` |
| Tabs | `size.tab.barHeight`, `size.tab.itemMinHeight`, `size.tab.pillMinHeight`, `size.tab.underlineMinHeight`, `size.tab.indicatorHeight`, `size.tab.indicatorWidth`, `size.tab.icon` |
| BottomSheet | `size.sheet.headerHeight`, `size.sheet.handleWidth`, dynamic content max-height policy |
| App viewport | `size.viewport.appMaxWidth` |
| Toast / floating feedback | `size.viewport.toastMaxWidth`, `size.surface.toastMinHeight` |
| Icon systems | `size.icon.*` and icon registry defaults |
| Card / panel / empty state | `size.surface.*` only when a real min/max constraint is needed |

## Forbidden Usage

- Do not write local values such as `height: 42`, `minHeight: 58`, `width: 376`, or `maxWidth: 360` in new page code.
- Do not use spacing tokens for component fixed heights or width constraints.
- Do not use size tokens for padding, margin, or gap.
- Do not stretch mobile app content across desktop width; constrain surfaces through viewport size tokens or platform rules.
- Do not add new size values without documenting the semantic use, affected components, and QA rule.
