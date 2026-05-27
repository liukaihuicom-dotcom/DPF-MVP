# Spacing Tokens

Spacing is a production layout system, not a page-level visual guess. Every page, shared component, business component, sheet, form, list, card, footer, chart area, and operation area must map spacing back to this scale or to a documented semantic `layout.*` token.

## Base Scale

The base scale is intentionally small and stable. It should not grow during page implementation. New product surfaces must map reference values to this scale first.

| Token | Runtime Alias | Value | Use |
|---|---:|---|
| space.0 | `spacing.none` | 0 | Flush layout reset, no padding, no gap |
| space.2 | `spacing.xxs` | 2 | Hairline alignment, badge micro spacing, graph or icon optical offsets |
| space.4 | `spacing.xs` | 4 | Icon/text micro gap, eyebrow/title gap, dense metadata spacing |
| space.8 | `spacing.sm` | 8 | Small control internal gap, button icon/text gap, compact list-item inner spacing |
| space.12 | `spacing.md` | 12 | Default module gap, bottom-sheet content gap, form field group gap, card horizontal padding, compact card padding |
| space.16 | `spacing.lg` | 16 | Default card vertical padding, list-row horizontal padding, dense component primary padding |
| space.24 | `spacing.xl` | 24 | Section group spacing, large card internal region spacing, main page content grouping |
| space.32 | `spacing.xxl` | 32 | Page bottom breathing room, end-of-content spacing, sticky-footer buffer |
| space.48 | `spacing.section` | 48 | First-viewport hero spacing, major page breaks, large empty-state breathing room |

## Layout Tokens

| Layout Token | Runtime Mapping | Use |
|---|---|---|
| `layout.screenPaddingX` | `spacing.lg` / 16 | Full-site page horizontal padding and bottom-sheet horizontal alignment |
| `layout.screenGap` | `spacing.md` / 12 | Default vertical gap between page modules |
| `layout.screenBottomPadding` | `spacing.xxl` / 32 | Full-site scroll content bottom safety gap; `Screen` combines it with the device bottom safe-area inset |
| `layout.moduleGap` | `spacing.md` / 12 | Default gap between repeated modules in standard density screens |
| `layout.sectionGap` | `spacing.xl` / 24 | Gap between larger business sections or grouped card clusters |
| `layout.sectionGapLarge` | `spacing.xxl` / 32 | Strong module separation such as account groups or end-of-flow spacing |
| `layout.cardPaddingX` | `spacing.md` / 12 | Full-site default card and panel horizontal content inset |
| `layout.cardPaddingY` | `spacing.lg` / 16 | Full-site default card and panel vertical content inset |
| `layout.cardPaddingCompactX` | `spacing.md` / 12 | Compact card and dense panel horizontal content inset |
| `layout.cardPaddingCompactY` | `spacing.md` / 12 | Compact card and dense panel vertical content inset |
| `layout.cardPadding` | `spacing.lg` / 16 | Legacy scalar alias for older card padding code; new implementations must use `layout.cardPaddingX` + `layout.cardPaddingY` |
| `layout.cardPaddingCompact` | `spacing.md` / 12 | Legacy scalar alias for older compact card padding code; new implementations must use `layout.cardPaddingCompactX` + `layout.cardPaddingCompactY` |
| `layout.listRowPaddingX` | `spacing.lg` / 16 | Menu, option, account, transaction, and settings row horizontal padding |
| `layout.listRowPaddingY` | `spacing.md` / 12 | Menu, option, account, transaction, and settings row vertical padding |
| `layout.formFieldTextInset` | `spacing.md` / 12 | Shared form field shell horizontal text inset |
| `layout.formGroupGap` | `spacing.md` / 12 | Gap between fields in one form group |
| `layout.fieldGap` | `spacing.sm` / 8 | Gap between a field and helper, error, or secondary hint |
| `layout.inlineGap` | `spacing.xs` / 4 | Inline icon/text, label/value, and dense metadata spacing |
| `layout.controlGap` | `spacing.sm` / 8 | Gap between compact controls, button icon/text, and segmented options |
| `layout.sheetContentGap` | `spacing.md` / 12 | BottomSheet content stack gap |
| `layout.sheetFooterGap` | `spacing.md` / 12 | BottomSheet footer action gap |
| `layout.quoteGroupGap` | `spacing.sm` / 8 | Quote detail price/change/stat groups |
| `layout.dataRowGap` | `spacing.xs` / 4 | Dense metric rows, quote stats, and chart labels |
| `layout.touchTargetMin` | 44 | Minimum interactive hit area; not a generic spacing token |
| `layout.sheetHeaderHeight` | 56 | Fixed bottom-sheet title bar height; not a generic gap or padding token |
| Icon box sizes | component-owned layout values | Icon visual reservation; not generic spacing |

## Semantic Spacing Matrix

| Area | Use This | Do Not Use |
|---|---|---|
| Page shell | `layout.screenPaddingX`, `layout.screenGap`, `layout.screenBottomPadding` plus device bottom safe-area through `Screen` | Page-local `paddingHorizontal: 16`, arbitrary top margins, or removing the bottom safe gap |
| Business module stack | `layout.moduleGap`, `layout.sectionGap`, `layout.sectionGapLarge` | Child `marginTop` chains |
| Cards and panels | `layout.cardPaddingX`, `layout.cardPaddingY`, `layout.cardPaddingCompactX`, `layout.cardPaddingCompactY`; legacy scalar aliases only for compatibility | Page-owned card padding overrides or new `padding: layout.cardPadding` usage |
| Menu/list rows | `layout.listRowPaddingX`, `layout.listRowPaddingY` inside the row component | Page-local row padding or hidden spacer hacks |
| Forms | `layout.formFieldTextInset`, `layout.formGroupGap`, `layout.fieldGap` | One-off `10`, `14`, `18`, or field-specific margins |
| Controls | `layout.controlGap`, `layout.inlineGap` | Per-button icon/text gap guesses |
| BottomSheet | `layout.screenPaddingX`, `layout.sheetContentGap`, `layout.sheetFooterGap` | Header/content/footer alignment drift |
| Quote/data/chart areas | `layout.quoteGroupGap`, `layout.dataRowGap`, component-owned chart offsets | Absolute offsets to repair normal flow |
| Empty states and major breaks | `spacing.section` only through documented pattern tokens | Expanding the base scale for one page |

## Global Spacing Policy

- Full-site UI work must use this spacing scale. New pages and components may not guess local values such as `7`, `10`, `13`, `14`, `18`, or `20`.
- Page code should prefer semantic `layout.*` tokens for product layout decisions. Use raw `spacing.*` only inside token sources, shared component internals, or clearly documented low-level primitives.
- Design references must be mapped to the nearest existing spacing token. If a reference needs a new value, create a design-system change before implementation.
- UI Build handoff must report spacing tokens used by the page and any documented exceptions.
- Existing hardcoded spacing is a migration backlog, not an allowed pattern. When a legacy page is touched, migrate ordinary spacing to tokens in the same change.
- Do not expand the legacy baseline without a design-system review.
- The legacy baseline may only shrink. Adding a new page or component to the baseline is a QA failure unless a release blocker is documented in the changelog.

## Usage Rules

### Gap

- Use `gap` for relationships between siblings inside the same parent.
- Page flows should prefer parent `gap` over child `marginTop` or `marginBottom`.
- Use `layout.screenGap`, `layout.moduleGap`, and `layout.sectionGap` for page rhythm.
- Use `layout.inlineGap`, `layout.fieldGap`, `layout.controlGap`, `layout.quoteGroupGap`, and `layout.dataRowGap` for semantic micro relationships.

### Padding

- Use `padding` for internal space owned by a container.
- Page horizontal padding must come from `Screen` or `layout.screenPaddingX`.
- Page scroll content bottom padding must come from `Screen`; it must not be removed by page-local props or page-local padding overrides.
- Card padding must come from `layout.cardPaddingX`, `layout.cardPaddingY`, `layout.cardPaddingCompactX`, `layout.cardPaddingCompactY`, or a shared `Card` variant unless a business component documents another rule.
- `layout.cardPadding` and `layout.cardPaddingCompact` are legacy scalar aliases only. New card, panel, surface, and tile implementations must use the axis-specific card padding tokens so horizontal content inset remains 12 px while default vertical rhythm remains 16 px.
- List row padding must be owned by the row/list component through `layout.listRowPaddingX` and `layout.listRowPaddingY`.
- BottomSheet header, content, and footer must share `layout.screenPaddingX`.
- Form groups, list rows, status panels, and operation areas must declare their spacing in the component or pattern documentation.
- Shared form field horizontal content inset must use `layout.formFieldTextInset`.

### Margin

- Use `margin` only for relationships outside the current parent when `gap` cannot express the layout.
- Avoid stacking page sections with child `marginTop`; move spacing to the parent container.
- Negative margin is forbidden for normal alignment fixes. Use layout structure, component sizing, or a documented pattern token.

### Insets And Offsets

- `top`, `right`, `bottom`, `left`, and absolute/fixed offsets are allowed only for overlays, backdrops, graph labels, floating controls, sheet layers, and other component-owned positioning.
- Absolute offsets must not be used to repair normal page flow spacing.
- Chart/canvas/SVG offsets and optical icon offsets must stay in the owning component and be documented as exceptions.

## New Token Review

1. Map the requested value to the nearest base scale token.
2. If the relationship has product meaning, add or reuse a semantic `layout.*` token.
3. If the value belongs to one component only, add a component-owned `size.*` or component token instead of changing the spacing scale.
4. Add a base spacing value only after design-system review, registry mapping, QA rule update, changelog, and migration notes.
5. Never add a one-off page value during UI Build implementation.

## Runtime Mapping

- `Screen` uses 16 px horizontal padding, 12 px top gap, and a bottom safety gap of `layout.screenBottomPadding` / 32 px plus the device bottom safe-area inset.
- White-background page shells, including `AuthShell`, use 16 px horizontal padding through `layout.screenPaddingX`.
- Global BottomSheet content, header, and footer use the same 16 px horizontal padding through `layout.screenPaddingX`.
- `Card` uses 12 px horizontal padding through `layout.cardPaddingX` and 16 px vertical padding through `layout.cardPaddingY`.
- `Card compact` uses 12 px horizontal padding through `layout.cardPaddingCompactX` and 12 px vertical padding through `layout.cardPaddingCompactY`.
- `ActionButton` uses 18 px horizontal and 12 px vertical padding.
- `TextField`, `SelectField`, and `RichTextField` use `layout.formFieldTextInset` / 12 px for shell horizontal content inset.

## Full-Site Application

- New page contracts and UI Build output must read this file before layout work.
- Shared components must consume `spacing` or `layout` tokens directly.
- Page code should compose shared components instead of re-declaring padding for cards, sheets, inputs, buttons, or list rows.
- Legacy pages with hardcoded spacing must be migrated gradually, starting with high-frequency pages: markets, portfolio, quick, account, and instrument.
