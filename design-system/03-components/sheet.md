# Sheet Component

## Runtime Component

`src/components/BottomSheet.tsx`

Built on `@gorhom/bottom-sheet` and mounted from the app root through:

- `GestureHandlerRootView`
- `SafeAreaProvider`
- `BottomSheetModalProvider`

## Usage

Use for global mobile action menus, order options, filters, account menus, and contextual detail flows.

All mobile bottom sheets must enter through `src/components/BottomSheet.tsx`, `useBottomSheet()`, and `bottomSheetPresets`.

`QuickActionSheet` is a content module rendered through the shared `BottomSheet` action-menu preset. It must not own a host, scrim, handle, SafeArea bottom shell, or fixed footer.

## API

`useBottomSheet()` returns `show(options)`, `push(options)`, `back()`, and `hide()`.

| Prop | Type | Required | Description |
|---|---|---:|---|
| title | string | no | Compatibility header title when `header` is omitted |
| subtitle | string | no | Compatibility header supporting context |
| header | false or BottomSheetHeaderOptions | no | Structured app-native header or explicit headerless mode |
| content | ReactNode | yes | Scrollable middle content |
| contentSizing | `auto` or `fill` | no | Defaults to content-first `auto`; use `fill` only when a documented business case needs the middle content to occupy all available height |
| footer | ReactNode or BottomSheetAction[] | no | Fixed bottom action area |
| snapPoints | Array<string \| number> | no | Explicit business override for fixed-height sheets only |

`BottomSheetHeaderOptions` supports `title`, `leftIcon`, `leftAction`, and `rightAction`.

`subtitle`, `rightIcon`, `rightAccessibilityLabel`, and `onRightPress` are compatibility-only fields. New sheets must put supporting copy in the content area and use `rightAction` for business actions.

`BottomSheetAction` supports `label`, `onPress`, `tone`, `variant`, `disabled`, `loading`, `icon`, and `accessibilityLabel`.

## Presets

Use `bottomSheetPresets` for repeatable global sheet composition:

- `actionMenu({ content, footer?, snapPoints? })`: headerless action or quick menu sheet; omit `snapPoints` unless fixed height is a documented exception.
- `detail({ title, leftIcon?, rightAction?, content, footer?, snapPoints? })`: standard detail sheet with app-native header; omit `snapPoints` for normal content-first height.
- `selection({ title, leftIcon?, rightAction?, content, footer?, snapPoints? })`: standard picker or account selection sheet; omit `snapPoints` for normal content-first height.

Page code must either call a preset or pass an explicit `header` / `header: false`. Do not rely on the legacy `title` / `subtitle` compatibility path for new or migrated sheets.

## Structure

- Header navigation area: fixed-height `56px` title bar below the handle.
- The header is a component-owned fixed visual navigation layer. When a header is present, `BottomSheetContent` must insert an internal `BottomSheetHeaderSpacer` with the same `sheetHeaderHeight` token before page content.
- Header copy, content, and fixed footer actions must share the same entrance progress and reveal together as one bottom panel. Content must never appear before the bottom action area.
- Page code must never use padding, margin, an empty `View`, or a locally drawn title bar to simulate global sheet header height.
- The header title bar does not render a divider line; separation comes from spacing, surface shape, and content hierarchy.
- Left slot is a reserved semantic/navigation icon slot, not the default close action.
- Left slot may become an explicit close action only when the caller provides `leftAction`.
- Nested sheets opened with `push()` must show a left back action and return with `back()`.
- Center title is single-line and visually centered; supporting description belongs in the content area by default.
- Center title uses the `sheetTitle` typography token: 20px size, 600 weight, 24px line height.
- Right slot is a business action slot for add, next, filter, open, or more actions. It must not default to close.
- Empty left or right slots keep equal width so the title stays centered.
- `header: false` removes the header area entirely for pure content/action sheets.
- `header: false` also removes the internal header spacer, so content starts naturally below the handle with no reserved title-bar height.
- Scrollable content area: default internal scroll for long content.
- The default content sizing is content-first: the sheet should open to the rendered header, content, and footer height before using the global maximum height.
- `contentSizing="fill"` is an explicit exception for experiences that need to fill the available middle area, such as stage-like layouts or dense selection flows. Do not use it to make normal detail sheets look taller.
- Sheet header, content, and footer horizontal padding must use `layout.screenPaddingX` (16px) so sheet modules align with page modules.
- Fixed footer action area: action buttons plus bottom safe area. Footer must be rendered by the global BottomSheet component through `@gorhom/bottom-sheet` `footerComponent`, aligned to the sheet width, and the scrollable content must reserve footer space.
- Destructive, edit, close, submit, and other explicit operations should pair their button label with a registered `AppIcon` unless the surrounding pattern already supplies the same icon semantics.
- Backdrop is rendered by the app-owned `AppBottomSheetBackdrop`, not the library default backdrop, and tapping it closes the sheet.
- The global sheet host sits above `AppViewport`; backdrop covers the full app stage while the sheet surface aligns to the active app page width.
- `enablePanDownToClose` is mandatory for every shared sheet, including headerless action-menu sheets.

## Height

- Default height is adaptive to the rendered header, content, and footer.
- Short content must not be forced to a minimum opening height.
- Footer sheets follow the same content-first rule; footer presence must not create a default fixed snap point.
- Long content is capped by `maxDynamicContentSize`: screen height minus top safe area and `24px` reserve. Only after this cap is reached should the middle content scroll.
- `snapPoints` is an explicit business override only. Do not use a default minimum snap point for global sheets or to fix ordinary detail-sheet visual height.

## Width

- Native and narrow mobile viewports use the full available page width.
- Web/tablet viewports center the sheet inside the active app page width.
- Current production cap: `430px`, matching `AppViewport` so global sheets do not stretch across the browser stage.
- Do not constrain the modal container to `430px`; keep the overlay full-screen and center only the sheet surface.

## Required States

default, opening, open, closing, disabled action, loading action, failed action.

## A11y

- Sheet title must describe the context.
- Dismiss paths must be available through the backdrop and pan-down gesture.
- Headerless sheets must still be dismissible through backdrop tap and pan-down gesture.
- Backdrop must not be exposed as a named focusable button.
- Header right actions are business actions and need labels.
- Icon-only actions in sheets need labels.
- Header icon slots reserve 40px. The rendered header icon is 24px.
- Header reserved semantic icons render as plain primary-text icons without a decorative circular background or outline frame.
- Header action icons may keep the shared 40px touch area, but must not draw an outlined circular frame.
- Header reserved icons and action icons use text-color contrast by default, matching the title color rather than muted secondary icon color.

## Governance

- Page code and ordinary components must not draw their own bottom sheet host, scrim, drag handle, SafeArea bottom shell, fixed bottom button area, or absolute bottom modal container.
- Page code must not call `BottomSheetModal` directly; only `src/components/BottomSheet.tsx` may import and render the bottom-sheet host.
- Page code must not call `bottomSheet.show({ ... })` or `bottomSheet.push({ ... })` with ad hoc sheet options. Use `bottomSheetPresets.actionMenu`, `bottomSheetPresets.detail`, or `bottomSheetPresets.selection`.
- Use `header.leftIcon` for semantic context icons such as account, options, order, or history.
- Do not use the right header slot for close. Use `rightAction` only for business actions.
- Do not put descriptions into the title bar unless approved as a compatibility exception; use content-area copy instead.
- Sheet title-bar icon actions must use the shared header icon-button pattern: 40px reserved area and 24px icon, without an outlined icon-badge frame.
- Sheet title-bar icon actions and reserved semantic icons must use the primary text token for icon color unless a specific business state is documented.
- Header height must come from the `sheetHeaderHeight` token and must not be simulated with content padding.
- Header title size must come from the `sheetTitle` typography token; page code must not override sheet title size.
- Header, content, and footer horizontal padding must come from `layout.screenPaddingX`; page code must not add outer padding to compensate for sheet module alignment.
- Header occupancy is a global component invariant: `BottomSheetHeader` and `BottomSheetHeaderSpacer` must both bind to `sheetHeaderHeight`, and any regression is a QA blocker for the component library.
- Footer actions must be owned by the global BottomSheet component and paired with `enableFooterMarginAdjustment`; page content must not simulate fixed operation buttons.
- Header, content, and fixed footer must use the shared entrance animation layer; async footer appearance is a QA blocker.
- New or modified sheets must be audited across dynamic height, max-height scrolling, footer obstruction, header spacer, page-width alignment, backdrop close, and pan-down close.
- Page code must not add `snapPoints` or `contentSizing="fill"` without recording the business reason in the component or page review.
- Use `header: false` only when the header would duplicate nearby content and the sheet remains understandable without a title.
- Detail sheets may use `header: false` when the first content block already presents the object identity, status, and context; position and pending-order detail sheets follow this mode.
- Footer actions for edit, close, delete, and submit flows must stay in the fixed bottom operation area and use documented action icons from `AppIcon`.
- Every `bottomSheet.show(...)` and `bottomSheet.push(...)` call must use a `bottomSheetPresets` factory so the header mode, action-menu mode, and content sizing remain governed.
- Full-page interaction acceptance covers every global sheet entry in `app/**`, not only the trade page: home account switching, portfolio account switching and menus, position/order details, account detail actions, and balance transaction details.
- Each accepted sheet must pass open, backdrop-close, pan-down-close, header-close when present, dynamic-height, max-height safe area, and page-width alignment checks.
- Auth confirmation dialogs, PIN error dialogs, and the TextField web select menu are registered non-sheet exceptions. Country pickers and auth error sheets are bottom-sheet interactions and must use `GlobalBottomSheetHost`.
