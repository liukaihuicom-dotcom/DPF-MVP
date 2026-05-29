# Sheet Component

## Runtime Component

`src/components/BottomSheet.tsx`

Built on `@gorhom/bottom-sheet` and mounted from the app root through:

- `GestureHandlerRootView`
- `SafeAreaProvider`
- `BottomSheetModalProvider`

All mobile bottom sheets must enter through `src/components/BottomSheet.tsx`, `useBottomSheet()`, and `bottomSheetPresets`.

## API

`useBottomSheet()` returns `show(options)`, `push(options)`, `back()`, and `hide()`.

| Prop | Type | Required | Description |
|---|---|---:|---|
| header | false or BottomSheetHeaderOptions | no | Structured app-native header or explicit headerless mode |
| content | ReactNode | yes | Scrollable middle content |
| contentPadding | `card`, `plain`, or `flush` | no | Controls governed content inset and surface style |
| contentSizing | `auto` or `fill` | no | Compatibility input; `fill` maps to fixed-height behavior |
| footer | ReactNode or BottomSheetAction[] | no | In-panel bottom action area |
| heightMode | `adaptive`, `fixed`, or `fullscreen` | no | Governs panel height and content flex behavior |
| sheetSurface | `canvas` or `panel` | no | Governs sheet bed color |
| snapPoints | Array<string \| number> | no | Compatibility input for fixed-height sheets only |

`BottomSheetHeaderOptions` supports `title`, `leftIcon`, `leftAction`, and `rightAction`.

`BottomSheetAction` supports `label`, `onPress`, `tone`, `variant`, `disabled`, `loading`, `icon`, and `accessibilityLabel`.

## Presets

Use `bottomSheetPresets` for repeatable global sheet composition:

- `actionMenu({ content, footer?, heightMode?, sheetSurface? })`: headerless action or quick menu sheet; defaults to adaptive height and gray canvas bed.
- `detail({ title, leftIcon?, rightAction?, content, footer?, heightMode?, sheetSurface? })`: standard detail sheet with app-native header; defaults to adaptive height and gray canvas bed.
- `selection({ title, leftIcon?, rightAction?, content, footer?, heightMode?, sheetSurface? })`: standard picker, list, or account selection sheet; defaults to fixed height and white panel bed for plain lists. Card-based selections must explicitly use `sheetSurface="canvas"` and `contentPadding="card"`.

Page code must call a preset or pass an explicit `header` / `header: false`. Do not rely on legacy `title` / `subtitle` compatibility fields for new or migrated sheets.

## Structure

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

- Header, Content, and Footer are direct Panel children.
- Panel is the only slide animation container; Overlay may fade.
- Header is an in-flow fixed-height child using `layout.sheetHeaderHeight` and `layout.topBarPaddingX` (`16px`) for left/right inset.
- Content has `minHeight: 0` and scrolls internally only when over height.
- Content uses `layout.contentCardPaddingX` (`12px`) left/right inset for card content and `layout.sheetContentPaddingX` (`16px`) for list content, article/detail introduction content, and normal descriptive content.
- Footer is an in-flow child with `flex: 0 0 auto`, `layout.bottomActionArea.paddingX` (`16px`) left/right inset, and bottom safe-area padding.
- Footer must not use `footerComponent`, portal placement, fixed positioning, absolute positioning, separate animation, or separate conditional mount.

## Surface / Background

BottomSheet has two governed sheet bed colors. Do not hardcode colors or add page-local wrapper backgrounds to simulate them.

| Content type | Required sheetSurface | Token | Expected visual |
|---|---|---|---|
| Card/detail/form/confirmation content | `sheetSurface="canvas"` | `colors.surface.canvas` | Gray sheet bed with white card bodies |
| Plain list/picker/selection content | `sheetSurface="panel"` | `colors.surface.panel` | White sheet bed for list rows |
| Card-based selection content, such as trading account selection | `sheetSurface="canvas"` | `colors.surface.canvas` | Gray sheet bed with selectable white cards |
| Public business component with complete internal surface | caller chooses, usually `canvas` | component-owned | Use only with `contentPadding="flush"` |

Rules:

- `contentPadding="card"` or card-like detail content uses `sheetSurface="canvas"` by default.
- Card bodies inside gray sheets keep their own `surface.panel` white background.
- `contentPadding="plain"` or pure list content uses `sheetSurface="panel"` by default.
- `contentPadding="card"` uses `layout.contentCardPaddingX` (`12px`) for the middle content area's left/right inset.
- `contentPadding="plain"` uses `layout.sheetContentPaddingX` (`16px`) for list, article/detail introduction, and normal descriptive content.
- `bottomSheetPresets.selection` defaults to `sheetSurface="panel"` so pickers and plain lists open on white.
- Card-based selection sheets, including `TradingAccountContextSwitcher`, must override the selection preset with `contentPadding="card"` and `sheetSurface="canvas"` because the account list is built from selectable cards.
- `contentPadding="flush"` is reserved for public business components that own complete internal spacing and surface decisions.

## Horizontal Spacing

BottomSheet left/right spacing is fixed by zone and content type:

| Zone | Token | Value | Applies to |
|---|---|---:|---|
| Header | `layout.topBarPaddingX` | 16px | Sheet title, left action, right action |
| Content: card | `layout.contentCardPaddingX` | 12px | Card-based sheet content and card-based selections |
| Content: list / article detail introduction | `layout.sheetContentPaddingX` | 16px | Plain lists, picker rows, article/detail introduction, descriptive content |
| Footer | `layout.bottomActionArea.paddingX` | 16px | Primary/secondary action buttons and fixed footer modules |

- Do not use page-local padding to simulate these insets.
- `contentPadding="card"` sets the middle content area to `12px`; `contentPadding="plain"` sets the middle content area to `16px`.
- `contentPadding="flush"` may remove the outer content inset only when a public business component owns its complete internal spacing and background.

## Height

- `heightMode="adaptive"`: Panel grows from Header + Content + Footer, max `90dvh`; Content uses `flex: 0 1 auto`.
- `heightMode="fixed"`: Panel height is `90dvh`; Content uses `flex: 1 1 auto`.
- `heightMode="fullscreen"`: Panel height is `100dvh`; Content uses `flex: 1 1 auto`, handle is hidden, and radius is removed.
- `Panel` itself must not scroll in any mode; only Content scrolls after the height cap.
- `snapPoints` and `contentSizing="fill"` are compatibility inputs and should map to fixed behavior.

## Governance

- Page code and ordinary components must not draw their own bottom sheet host, scrim, drag handle, SafeArea bottom shell, fixed bottom button area, or absolute bottom modal container.
- Page code must not call `BottomSheetModal` directly; only `src/components/BottomSheet.tsx` may import and render the bottom-sheet host.
- Page code must not call `bottomSheet.show({ ... })` or `bottomSheet.push({ ... })` with ad hoc sheet options. Use `bottomSheetPresets.actionMenu`, `bottomSheetPresets.detail`, or `bottomSheetPresets.selection`.
- Page code must not override the entire sheet bed color with local `View backgroundColor`; choose `sheetSurface="canvas"` for card gray bed or `sheetSurface="panel"` for list white bed.
- Use `header.leftIcon` for semantic context icons such as account, options, order, or history.
- Do not use the right header slot for close. Use `rightAction` only for business actions.
- Footer actions for edit, close, delete, and submit flows must stay in the Panel Footer and use documented action icons from `AppIcon`.
- New or modified sheets must be audited across height mode, surface mode, max-height scrolling, footer obstruction, page-width alignment, backdrop close, pan-down close, keyboard, and safe area.

## A11y

- Sheet title must describe the context when a header is present.
- Headerless sheets must still be understandable from their content and remain dismissible through backdrop tap and pan-down gesture.
- Backdrop must not be exposed as a named focusable button.
- Header right actions and icon-only footer actions need accessibility labels.
- Nested sheets opened with `push()` must show a left back action and return with `back()`.

## Registered Exceptions

Auth confirmation dialogs, PIN error dialogs, and the TextField web select menu are registered non-sheet exceptions. Country pickers and auth error sheets are bottom-sheet interactions and must use `GlobalBottomSheetHost`.
