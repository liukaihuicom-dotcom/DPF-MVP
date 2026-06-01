# Page Overlay Matrix

Source of truth: `src/navigation/routeRegistry.ts`, `src/navigation/modalRegistry.ts`, and `src/design-public-assets/overlays/registry/overlay-registry.json`.

| Page route | Overlay usage after stage 2 | Risk | Dirty state | Android back | Queue / stack |
|---|---|---:|---|---|---|
| `/trade` | `portfolio.positionDetailSheet`, `portfolio.pendingOrderDetailSheet`, `portfolio.closePositionConfirm`, `portfolio.orderMutationAlert`, `tradingAccount.switchSheet`, `global.modalQueue` | high | not applicable | sheet back plus queued alerts | BottomSheet Stack + Modal Queue |
| `/portfolio` | `portfolio.positionDetailSheet`, `portfolio.pendingOrderDetailSheet`, `portfolio.closePositionConfirm`, `portfolio.orderMutationAlert`, `tradingAccount.switchSheet`, `global.modalQueue` | high | not applicable | sheet back plus queued alerts | BottomSheet Stack + Modal Queue |
| `/order/[id]` | `order.ticket.route`, `trading.orderSubmitAlert`, `global.modalQueue` | high | guarded | Close intent first enters queued dirty confirm, then closes Modal Page | Modal Queue |
| `/discover-layout` | `discover.layout.route`, `global.modalQueue` | low | guarded when draft changed | Close / Cancel first enters queued dirty confirm, then closes modal route | Modal Queue |
| `/funding/deposit` | `tradingAccount.switchSheet`, `funding.paymentMethodSheet`, `funding.submitFeedbackAlert`, `global.modalQueue` | high | guarded when amount entered | queued dirty confirm | Modal Queue |
| `/funding/withdrawal` | `tradingAccount.switchSheet`, `funding.paymentMethodSheet`, `funding.submitFeedbackAlert`, `global.modalQueue` | high | guarded when amount entered | queued dirty confirm | Modal Queue |
| `/funding/transfer` | `tradingAccount.switchSheet`, `funding.submitFeedbackAlert`, `global.modalQueue` | high | guarded when amount or target entered | queued dirty confirm | Modal Queue |
| `/settings/security-log` | `security.deviceDetailSheet`, `security.revokeConfirmSheet`, `security.reportConfirmSheet`, `security.resultAlert`, `global.modalQueue` | high | not applicable | sheet back plus queued alerts | BottomSheet Stack + Modal Queue |
| `/quick` | `order.ticket.route`, `partner.upgradeFeedbackAlert`, `quick.actionSheet`, `global.modalQueue`, `global.toastFeedback` | high | not applicable | queued partner role-change alerts | BottomSheet + Modal Queue |
| `/client/[id]` | `partner.upgradeFeedbackAlert`, `global.modalQueue`, `global.toastFeedback` | high | not applicable | queued partner approval alert | Modal Queue |
| `/auth/register-phone` | `auth.contactConfirm`, `auth.errorSheet`, `auth.leaveVerifiedStep`, `global.modalQueue` | medium | guarded after verified phone step | queued dirty confirm | Modal Queue |
| `/auth/register-password` | `auth.errorSheet`, `auth.leaveVerifiedStep`, `global.modalQueue` | medium | guarded after verified email step | queued dirty confirm | Modal Queue |
| `/instrument/[id]` | `order.ticket.route`, `global.modalStack`, `global.toastFeedback` | medium | not applicable | Modal Stack nested Back before root Close | Modal Stack |

## Stage 2 Decisions

- Funding submit feedback was changed from `Toast` to queued `Alert Dialog`.
- Trading blocked/submitted feedback was changed from `Toast` to queued `Alert Dialog`; submission now requires a high-risk confirmation dialog.
- Portfolio close-position and pending-order mutation feedback was changed from `Toast` to queued `Alert Dialog`.
- Security revoke/report results were changed from `Toast` to queued `Alert Dialog`.
- Partner application, pending status, and approval feedback were changed from `Toast` to queued `Alert Dialog` because they change role / permission state.
- Full-screen chart modal was moved from a private React Native `Modal` call to the public `ModalStackProvider`.
- Overlay z-index values now bind to `zIndex` tokens instead of page-local constants.

## Stage 3 Decisions — BottomSheet Close-Rhythm Governance

- BottomSheet container dismissal now hands the slide-out to `@gorhom/bottom-sheet` through `animationConfigs` aligned to `motion.overlay.standardMs` (220ms) `Easing.out(Easing.cubic)`; the reanimated `sheetEntranceProgress` only drives the shared Header / Content / Footer visual layer so the container and visual layer no longer stop on two unsynced tracks.
- Footer enter and exit curves were split by progress direction. Entrance keeps the dramatic `148px → 0` rise so the sheet floats up before the action area brightens; exit translates `0 → motion.overlay.exitTranslateY` (18px) in lockstep with content and holds opacity until `motion.overlay.footerExitOpacityPivot` (0.85), removing the prior 8x footer/content exit-speed mismatch flagged as the async-footer QA blocker.
- The old measured avoidance model is retired. Current BottomSheet layout gives Footer a real Panel slot, so Content never masks an out-of-flow Footer with extra bottom padding.
- Footer pointer events follow a shared `sheetEntranceProgress` threshold (0.4) on close rather than being disabled on the first dismissal frame, so the action area stays tappable until it has visibly receded.

## Stage 4 Decisions — BottomSheet HeightMode Panel Governance

- Stage 4 supersedes the Stage 3 avoidance model: Footer is now a direct Panel child in normal layout flow, so Content no longer reserves measured Footer height.
- Shared BottomSheet now supports `heightMode="adaptive" | "fixed" | "fullscreen"`; adaptive short sheets keep natural height, fixed sheets use a stable `90dvh` Panel, and fullscreen sheets use `100dvh` with no rounded sheet chrome.
- Header, Content, and Footer are mounted and dismissed together inside one Panel. Overlay may fade and Panel may slide; Header, Content, and Footer no longer carry separate entrance/exit animation layers.
- Backdrop tap, close button, pan-down, Android back, cancel action, and business-completion close all route through the shared `closeModal` lifecycle.

## Stage 5 Decisions — BottomSheet Safe-Area Governance

- Footer remains a direct Panel child and now uses `layout.sheetFooterPaddingBottom + useSafeAreaInsets().bottom` for the bottom slot, so iPhone Home Indicator and Android gesture regions are covered by Footer background and spacing.
- ContentInner uses `layout.sheetContentPaddingBottom` as the final-item breathing space before Footer; Content does not reserve Footer height and does not mask an out-of-flow Footer.
- The shared Footer action stack uses `layout.sheetFooterGap` for fixed action spacing across adaptive, fixed, and fullscreen modes.

## BottomSheet Dismissal Governance Matrix

| Sheet class | Source | Close paths | Footer layout | Decision |
|---|---|---|---|---|
| Position detail sheet | `PortfolioScreen` + `OrderPositionDetailSheet` | footer action, backdrop, pan-down, Android back | Footer is a direct Panel child; no reserve padding | governed by `global.bottomSheet` |
| Pending-order detail sheet | `PortfolioScreen` + `OrderPositionDetailSheet` | footer action, backdrop, pan-down, Android back | Footer is a direct Panel child; no reserve padding | governed by `global.bottomSheet` |
| Close confirmation sheet | `ConfirmActionSheet` | cancel/confirm action, backdrop, pan-down, Android back | Footer action stack remains inside Panel when supplied by sheet options | governed by `global.bottomSheet` |
| Trading action menu sheet | `TradingOrderActionSheet` | action item, backdrop, pan-down, Android back | No external fixed footer; optional footer stays inside Panel | governed by `global.bottomSheet` |
| Quick/filter/detail sheets | `QuickActionSheet`, filter sheets, `MetricDescriptionSheet` | item action, backdrop, pan-down, Android back | Header / Content / Footer share one Panel lifecycle | governed by `global.bottomSheet` |

## BottomSheet Height Governance Matrix

Source of truth: `src/design-public-assets/overlays/registry/bottom-sheet-design-principles.md`.

| Sheet class | Default heightMode | Panel height | Content behavior | Escalation trigger |
|---|---|---:|---|---|
| Action Sheet | `adaptive` | natural, max `90dvh` | No forced fill for short actions; over-height Content scrolls | More than one task group or destructive risk requires Alert Dialog / Modal Page |
| Selection Sheet | `fixed` for long lists, `adaptive` for short lists | `90dvh` or natural max `90dvh` | Content scrolls internally; explicit `snapPoints` maps to fixed compatibility | Multi-step selection or comparison requires Modal Page |
| Search Selection Sheet | `fixed` | `90dvh` | Search stays visible near top; result list scrolls inside Content | Risk copy, legal copy, or multi-select workflow requires Modal Page |
| Filter Sheet | `fixed` | `90dvh` | Filter sections scroll; apply/clear actions stay in Footer | Complex saved filters or cross-page state requires Modal Page |
| Detail Sheet | `adaptive` by default, `fixed` for page-like detail | natural max `90dvh` or `90dvh` | Summary first; long detail scrolls inside Content | Long reading, agreement, or route recovery requires Modal Page |
| Form Sheet | `adaptive` | natural, max `90dvh` | Keyboard-safe; submit remains reachable inside Panel Footer | More than 3 fields requires Modal Page |
| Confirmation Sheet | `adaptive` | natural, max `90dvh` | Short copy; two buttons stack vertically in Panel Footer | Funding, KYC, security, compliance, or trading risk requires Alert Dialog / Modal Page |
| Full-screen Modal Sheet | `fullscreen` | `100dvh` | Content fills the middle area; Footer is safe-area aware | Ordinary short local actions should stay adaptive |

## BottomSheet Safe-Area Matrix

| Sheet mode | Panel behavior | Footer safe-area rule | Content bottom rule | Decision |
|---|---|---|---|---|
| `adaptive` | Natural height, max `90dvh`, Panel does not scroll | `layout.sheetFooterPaddingBottom + bottom inset` | `layout.sheetContentPaddingBottom` | Short sheets keep natural height with no clipped action area |
| `fixed` | `90dvh`, Content fills middle and scrolls internally | `layout.sheetFooterPaddingBottom + bottom inset` | `layout.sheetContentPaddingBottom` | Long sheets scroll the middle content without Footer overlap |
| `fullscreen` | `100dvh`, Content fills middle and scrolls internally | `layout.sheetFooterPaddingBottom + bottom inset` | `layout.sheetContentPaddingBottom` | Fullscreen sheets keep Header/Footer in one Panel and protect system gesture areas |

## BottomSheet Surface Governance Matrix

| Sheet class | Surface | Content padding | Decision |
|---|---|---|---|
| Plain picker / selection list | `sheetSurface="panel"` | `contentPadding="plain"` | Uses `colors.surface.panel` as the white sheet bed for country, language, and simple picker rows |
| Trading account selection | `sheetSurface="canvas"` | `contentPadding="card"` | Uses `colors.surface.canvas` as the gray sheet bed because `TradingAccountContextSwitcher` renders selectable account cards with white card bodies |
| Detail / form / confirmation | `sheetSurface="canvas"` | `contentPadding="card"` | Uses `colors.surface.canvas` as the gray sheet bed behind white cards or grouped content |

## BottomSheet Horizontal Spacing Matrix

| Panel zone | Token | Value | Decision |
|---|---|---:|---|
| Header | `layout.topBarPaddingX` | 16px | Header left/right inset is stable across all sheet modes |
| Content: card | `layout.contentCardPaddingX` | 12px | Card content and card-based selections keep the compact card inset |
| Content: list / article detail introduction | `layout.sheetContentPaddingX` | 16px | Plain lists, picker rows, article/detail introduction, and descriptive content keep the wider reading/list inset |
| Footer | `layout.bottomActionArea.paddingX` | 16px | Footer modules and action buttons align with Header and Content |
