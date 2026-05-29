# Bottom Sheet Design Principles

Version: `1.1.4`
Owner: `design-system-engineering`
Status: `approved`
Scope: App, H5, WebView, Codex preview
Source of truth: `component.base.BottomSheet`, `registry.overlay-system`

## Core Position

Bottom Sheet is the shared mobile overlay container for short, local, non-routeable tasks. It is not a replacement for page-level financial flows.

Every bottom sheet must use the public `BottomSheetProvider`, `GlobalBottomSheetHost`, `useBottomSheet`, and `bottomSheetPresets` contract. Pages must not create private sheet shells, scrims, handles, safe-area wrappers, local modal containers, or page-owned fixed footers.

## Height Modes

| Height mode | Panel height | Content flex | Use when | Do not use when |
|---|---:|---|---|---|
| `adaptive` | Natural height, max `90dvh` | `flex: 0 1 auto` | Action menus, 1-3 field forms, short confirmations, small detail sheets, simple selections | The sheet is page-like, multi-step, or requires a fixed middle canvas |
| `fixed` | `90dvh` | `flex: 1 1 auto` | Long selections, page-like local flows, transaction/account details, partner/settings flows, legacy explicit `snapPoints`, legacy `contentSizing: 'fill'` | Short content that should sit near its natural height |
| `fullscreen` | `100dvh` | `flex: 1 1 auto` | Login/register modal equivalents, full KYC/security/PIN/password reset flows, high-risk account flows that still use the shared host API | Ordinary short sheets or reversible local actions |

`snapPoints` and `contentSizing` remain compatibility inputs. New work must choose `heightMode` first. Explicit `snapPoints` and `contentSizing: 'fill'` map to `fixed` unless `heightMode` is intentionally overridden.

## Panel Structure

```tsx
<Overlay>
  <Panel>
    <Header />
    <Content>
      <ContentInner />
    </Content>
    <Footer />
  </Panel>
</Overlay>
```

- `Panel` is the only slide animation container; Overlay may fade.
- `Header`, `Content`, and `Footer` must stay mounted together until Panel dismissal completes.
- `Footer` is a direct Panel child with `flex: 0 0 auto`.
- `Footer` must not use `footerComponent`, portal placement, `position: fixed`, `position: absolute`, independent animation, delayed render, or separate `AnimatePresence`.
- `Content` must include `min-height: 0` and `overflow-y: auto` equivalent behavior.

## Surface / Background

Bottom Sheet background color is governed by `sheetSurface`; pages must not simulate the sheet bed with local wrapper backgrounds.

| Surface decision | Token | Use when |
|---|---|---|
| `sheetSurface="canvas"` | `colors.surface.canvas` | Card/detail/form/confirmation content needs a gray bed behind white cards |
| `sheetSurface="panel"` | `colors.surface.panel` | Plain list, picker, selection, and plain-row content needs a white bed |

- Card-type content uses the gray `surface.canvas` sheet bed; the cards inside it remain white `surface.panel`.
- List-type content uses the white `surface.panel` sheet bed by default.
- Card-based selection content is governed as card-type content, not plain-list content. `TradingAccountContextSwitcher` uses `contentPadding="card"` plus `sheetSurface="canvas"` because account options are selectable cards on a gray bed.
- `contentPadding="card"` maps to card/detail surface expectations.
- `contentPadding="plain"` maps to list/picker surface expectations.
- Header and Footer use 16px horizontal inset. Middle content uses 12px when it is card content and 16px when it is list content, article/detail introduction content, or normal descriptive content.
- `contentPadding="flush"` is reserved for public business components that own complete internal background and spacing.

## Horizontal Spacing

| Panel zone | Token | Value | Rule |
|---|---|---:|---|
| Header | `layout.topBarPaddingX` | 16px | Header left/right inset is always 16px |
| Content: card | `layout.contentCardPaddingX` | 12px | Card content and card-based selections keep 12px left/right inset |
| Content: list / article detail introduction | `layout.sheetContentPaddingX` | 16px | Plain lists, picker rows, article/detail introduction, and descriptive content keep 16px left/right inset |
| Footer | `layout.bottomActionArea.paddingX` | 16px | Footer actions and bottom modules keep 16px left/right inset |

Do not add page-local padding to override these structural insets.

## Scenario Matrix

| Sheet class | Default heightMode | Default surface | Required behavior |
|---|---|---|---|
| Action Sheet | `adaptive` | `canvas` for card/grouped actions, `panel` for pure list actions | Headerless when it is a pure action menu; tap action closes or navigates |
| Detail Sheet | `adaptive` | `canvas` | Summary first, actions secondary, natural height until content exceeds `90dvh` |
| Form Sheet | `adaptive` | `canvas` | Maximum 1-3 fields; keyboard-safe; Footer remains inside Panel below Content |
| Confirmation Sheet | `adaptive` | `canvas` | Short reversible decision only; two action buttons stack vertically in Footer |
| Simple Selection Sheet | `adaptive` or `fixed` | `panel` for plain lists; `canvas` for card-based selections such as trading account selection | Use adaptive for a few options; fixed for long or searchable lists. Card-based selections keep a gray bed behind selectable cards |
| Search Selection Sheet | `fixed` | `panel` | Search stays near the top; list scrolls inside Content |
| Filter Sheet | `fixed` | `canvas` when grouped, `panel` when pure list | Clear/apply actions remain reachable; long filters scroll inside Content |
| Modal Page Sheet | `fixed` | scene-specific, documented | Page-like local flow with Header and Footer fixed inside Panel |
| Full-screen Modal Sheet | `fullscreen` | scene-specific, documented | Edge-to-edge layout, no rounded sheet chrome, safe-area aware Footer |

## Overflow Rules

- Adaptive content grows naturally until the Panel reaches `90dvh`; after that, only `Content` scrolls.
- Fixed content occupies the space between Header and Footer; only `Content` scrolls.
- Fullscreen content occupies the space between Header and Footer inside `100dvh`; only `Content` scrolls.
- `Panel` itself must not scroll in any mode.
- Do not add page-local or content-local bottom padding to reserve Footer space. Footer owns its layout slot inside Panel.

## Close Lifecycle

All close triggers must enter the same `closeModal` lifecycle:

- Backdrop tap.
- Header close button.
- Pan-down dismissal.
- Android system back.
- Cancel action.
- Business completion close.

Close sequence: trigger `closeModal`, keep Header / Content / Footer mounted inside Panel, fade Overlay, slide Panel down, then dismiss and clean up the entire overlay after the Panel finishes.

## Escalation To Modal Page

Use Modal Page or Full-screen Modal instead of ordinary Bottom Sheet when any of these are true:

- The task has more than 3 input fields.
- The task has multiple steps, nested decisions, or route recovery needs.
- The content is a funding, KYC, security, compliance, agreement, or trading risk flow.
- The user must read long legal/risk copy before deciding.
- The user needs to compare several sections or preserve progress after leaving the screen.
- The sheet would need another sheet shell inside it.

## Forbidden

- Do not use Bottom Sheet for high-risk funding confirmation, KYC submission, security blocking, or compliance acknowledgement unless it is promoted to Modal Page / Full-screen Modal semantics.
- Do not stack Bottom Sheet inside Bottom Sheet. Use the shared stack `push/back` only for governed content transitions, or use Alert Dialog for secondary confirmation.
- Do not choose `fullscreen` or `fixed` only because content is unstructured. First simplify, group, or promote the task to Modal Page.
- Do not hardcode arbitrary heights in page code. Choose `heightMode` and a governed preset.
- Do not hardcode sheet bed colors or wrap the whole sheet content with page-local background views. Choose `sheetSurface="canvas"` for card gray beds or `sheetSurface="panel"` for list white beds.
- Do not bypass registered copy, icons, tokens, or public business sheet components.

## QA Gate

| Gate item | Pass condition |
|---|---|
| Type decision | Sheet class maps to adaptive, fixed, or fullscreen |
| Surface decision | Card/detail and card-based selection content uses `surface.canvas`; plain list/selection content uses `surface.panel` |
| Horizontal spacing | Header 16px, card content 12px, list/article/detail-introduction content 16px, Footer 16px |
| Panel structure | Header, Content, and Footer are direct Panel children |
| Adaptive layout | Panel natural height, max `90dvh`, Content `flex: 0 1 auto` |
| Fixed layout | Panel `90dvh`, Content `flex: 1 1 auto` |
| Fullscreen layout | Panel `100dvh`, Content `flex: 1 1 auto`, safe-area aware Footer |
| Overflow | Over-height content scrolls inside Content without Panel scroll |
| Footer | Footer is in normal Panel flow and never overlays Content |
| Lifecycle | Backdrop, close button, pan-down, Android back, cancel, and completion close share one cleanup path |
| Platform | Android back, pan-down, backdrop tap, keyboard, and safe area are covered |
| Risk | High-risk financial/security/compliance tasks are not carried by ordinary Bottom Sheet |

Release decision: `bottom_sheet_principles_ready`
