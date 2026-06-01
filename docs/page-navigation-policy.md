# Page Navigation Policy

Source of truth: `src/navigation/routeRegistry.ts`, `src/navigation/modalRegistry.ts`, and `src/navigation/navigationPolicy.ts`.

## Semantics

| Behavior | Meaning | Runtime rule |
|---|---|---|
| `none` | No top-left navigation control | Used by launch, primary tabs, redirects, and PIN gate |
| `close` | Exit the current independent flow | Replace to `closeTarget`; never depend on history |
| `back` | Return to the previous step or parent page | Back if possible, otherwise replace to `backTarget` |
| `system` | System recovery route | Provide a visible safe route such as `/launch` |
| `dismiss` | Close a local layer without changing data | Used by sheets, dialogs, pickers, menus, and toasts |
| `cancel` | Cancel a pending decision | Keep page state unchanged |
| `confirm-leave` | Protect sensitive progress | Confirm before abandoning verified or high-risk steps |

## Route Groups

| Group | Routes | Top navigation policy |
|---|---|---|
| Launch and splash | `/`, `/brand-splash`, `/launch` | `none` |
| Primary tabs | `/workspace`, `/markets`, `/trade`, `/accounts`, `/discover`, `/quick`, `/learn`, `/demo`, `/clients`, `/growth`, `/wallet`, `/me` | `none` |
| Hidden tab aliases | `/portfolio`, `/account`, `/partner-tools` | `none` |
| Market detail | `/instrument/[id]` | `back` to `/markets` |
| Trading routeable modal | `/order/[id]` | `close` to `/trade`, `confirm-leave` for input progress |
| Partner detail | `/client/[id]` | `back` to `/trade` |
| Discover detail | `/discover-entry/[id]` | `back` to `/discover` |
| Discover modal | `/discover-layout` | `close` / `cancel` to `/discover`, `save` then close |
| Account details | `/account-details/[id]`, `/account-basic/[id]`, `/account-balance/[id]`, `/account-orders/[id]` | `back` to `/accounts` |
| Funding | `/funding` | `back` to `/trade` |
| Funding forms | `/funding/deposit`, `/funding/withdrawal`, `/funding/transfer` | `back` to `/funding`, `confirm-leave` |
| Funding history | `/funding/transactions` | `back` to `/funding` |
| Funding detail | `/funding/transactions/[id]` | `back` to `/funding/transactions` |
| Settings | `/settings` | `back` to `/accounts` |
| Security and appearance | `/settings/security-log`, `/appearance` | `back` to `/settings` |
| Auth roots | `/auth`, `/auth/register`, `/auth/onboarding`, `/auth/forgot-password` | `close` to `/launch` |
| Auth registration steps | `/auth/register-email-code`, `/auth/register-phone`, `/auth/register-phone-code`, `/auth/register-password` | `back` to prior auth step; verified steps use `confirm-leave` |
| PIN and legacy auth | `/auth/pin-setup`, `/auth/verify` | `none` |
| Not found | `/(not-found)` | `system`; visible link to `/launch` |

## QA Gate

- `MISSING_NAV_BEHAVIOR`: every route must declare `topNavBehavior`.
- `MISSING_BACK_FALLBACK`: every `back` route must declare `backTarget`.
- `AUTH_CLOSE_BACK_MISMATCH`: auth root and auth step routes must use the expected close/back behavior.
- `ROUTEABLE_MODAL_MISSING_CLOSE_FALLBACK`: routeable modals must have `modalCloseBehavior: "backOrFallback"` and `closeFallback`.
- `UNSAFE_ROUTER_BACK`: page and component code must use `navigationPolicy` helpers instead of direct `router.back()` or `router.canGoBack()`.
- `PRIMARY_TAB_LEFT_ACTION`: primary Tab entries must not render Back or Close.
- `DISCOVER_LAYOUT_BACK_ICON`: routeable modal roots must use Close / Cancel / Save, not page Back.
- `ORDER_TICKET_MISSING_CLOSE`: high-risk full-screen Modal Page roots must use Close and dirty-state confirmation.
- `PRIVATE_PAN_RESPONDER_SHEET`: pages must not implement private sheet drag/backdrop shells outside registered public overlay hosts.
