# Overlay System L5 Report

Date: `2026-05-29`
Scope: shared `BottomSheet` height modes, Panel layout structure, Footer lifecycle, safe-area spacing, and close-path unification.

## Overlay Type Decision

| Scenario | Overlay type | Source | heightMode | Risk | Decision |
|---|---|---|---|---:|---|
| Short form / confirmation / detail | Adaptive Bottom Sheet | `src/components/BottomSheet.tsx` | `adaptive` | medium | keep shared host |
| Long selection / filter / page-like detail | Fixed Bottom Sheet | `src/components/BottomSheet.tsx` | `fixed` | medium | keep shared host |
| Login / KYC / security / PIN modal equivalent | Fullscreen Modal Sheet | `src/components/BottomSheet.tsx` | `fullscreen` | high | API supported; use only when product contract allows |
| Close confirmation | Bottom Sheet content / Alert fallback through queue when needed | `src/components/ConfirmActionSheet.tsx` | `adaptive` | high | keep shared host plus queued alerts |
| Quick actions and filters | Action / Filter Sheet | `src/components/BottomSheet.tsx` | `adaptive` or `fixed` | medium | keep shared host |

## Redline Items

| ID | Severity | Evidence | Fix |
|---|---|---|---|
| R1 | Critical | Footer was rendered through `footerComponent`, outside the shared Panel layout flow. | Footer now renders as a direct child of the Panel. |
| R2 | Critical | Header used absolute positioning and Content used spacer/reserve logic, so Header / Content / Footer were not one structural flow. | Header, Content, and Footer are direct Panel children with column flex rules. |
| R3 | Major | Short sheets could be treated like fixed-height modal pages. | Added `heightMode` and defaulted action/detail short sheets to `adaptive`; explicit snapPoints and fill sizing stay fixed. |
| R4 | Major | Content depended on footer reserve padding and measured footer height. | Removed footer reserve; Content scrolls internally and Footer occupies a normal layout slot. |
| R5 | Major | Footer had separate animation / pointer lifecycle and could lag behind Content on close. | Panel is the only slide container; Footer stays mounted and moves with Panel. |
| R6 | Major | Footer safe-area and Content final-item breathing space were not represented as BottomSheet-specific tokens. | Footer now uses `layout.sheetFooterPaddingBottom + insets.bottom`; ContentInner uses `layout.sheetContentPaddingBottom`. |
| R6 | Major | Pan-down and other close paths could reach different lifecycle edges. | Added shared `closeModal` lifecycle across backdrop, close button, pan-down, Android back, cancel, and completion close. |

## Fix Cards

| Fix | Target layer | Target files | Exact action | Acceptance criteria |
|---|---|---|---|---|
| F1 | Component | `src/components/BottomSheet.tsx` | Add `heightMode` resolver for `adaptive`, `fixed`, and `fullscreen`. | Short content uses adaptive natural height; long and legacy explicit sizing use fixed; fullscreen is available. |
| F2 | Component | `src/components/BottomSheet.tsx` | Replace `footerComponent` with in-Panel Footer rendering. | Footer is `flex: 0 0 auto`, safe-area aware, and never overlays Content. |
| F3 | Component | `src/components/BottomSheet.tsx` | Make Panel the only slide lifecycle owner. | Header / Content / Footer mount, slide, dismiss, and unmount together. |
| F4 | Component | `src/components/BottomSheet.tsx` | Route every close trigger through `closeModal` and complete cleanup after native dismiss. | Backdrop, close button, pan-down, Android back, cancel, and completion close behave consistently. |
| F5 | Governance | manifests, overlay registry, page overlay matrix, public-resource records, QA scripts | Document and statically guard heightMode and in-Panel Footer rules. | QA blocks old footerComponent / reserve / separate animation patterns. |
| F6 | Token / Component | token registries, `src/components/BottomSheet.tsx` | Add BottomSheet safe-area tokens and consume them in shared Footer / ContentInner. | Safe area is centralized and not repeated in page files. |

## L5 Gate

| Gate item | Score |
|---|---:|
| Public host ownership | 20 / 20 |
| Panel structure | 20 / 20 |
| Height mode coverage | 20 / 20 |
| Footer safe area and layout flow | 20 / 20 |
| Close-path coverage | 15 / 20 |
| Governance documentation | 20 / 20 |

Overlay System L5 score: `110 / 120`

Normalized score: `92 / 100`

Decision: `conditional_ready`

Blocking note: true `l5_overlay_ready` still requires iOS and Android device slow-motion verification for pan-down, keyboard focus, safe-area, and footer/content frame sync.
