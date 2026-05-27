# Routing Governance

## Runtime

- Router: Expo Router 6 on Expo SDK 54.
- Entry: `expo-router/entry`.
- Root stack file: `app/_layout.tsx`.
- Tab layout file: `app/(tabs)/_layout.tsx`.
- Code source of truth: `src/navigation/routeRegistry.ts`.
- Modal governance source of truth: `src/navigation/modalRegistry.ts`.

## Registry Rules

- Every product page route under `app/**/*.tsx` must be in `routeRegistry`.
- Layout and HTML infrastructure are excluded from product page rows: `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `app/+html.tsx`.
- Each route entry must define path, page component, module, permission, navigation level, primary actions, related modals, states, route presentation, and risk level.
- Each route entry must define `topNavBehavior`. Routes using `back` must define `backTarget`; routes using `close` must define `closeTarget`.
- Each `relatedModals` value must exist in `modalRegistry`.
- Route permission labels are governance assumptions until production RBAC is connected: `guest`, `signedIn.any`, `signedIn.trader`, `signedIn.partner`, and `local.devOnly`.

## Close And Back Policy

The site uses these interaction meanings:

- `close`: exit an independent flow and replace to a safe public or module entry route. It must not depend on history.
- `back`: return to a deterministic previous step or parent page. It must have a fallback target for direct links and guard redirects.
- `cancel`: cancel an input, edit, selection, or confirmation and keep the current business state.
- `dismiss`: close a sheet, dialog, select menu, or toast without changing page state.
- `confirm-leave`: protect sensitive verified, funding, trading, or security flows before abandoning the current step.

Auth roots (`/auth`, `/auth/register`, `/auth/onboarding`, `/auth/forgot-password`) use close to `/launch`. Auth registration steps use back to their prior step and verified steps use `confirm-leave`. Protected-route redirects must not close back to the protected target, because that can trigger an auth-guard loop.

Primary tabs (`/markets`, `/trade`, `/accounts`, `/discover`, `/quick`) do not show a back control. Detail pages, funding pages, settings pages, and routeable modal pages must declare a deterministic parent fallback.

Shared navigation components must route through `src/navigation/navigationPolicy.ts`; page code must not call `router.back()` or `router.canGoBack()` directly.

## Modal Routing Policy

Do not route every modal. A modal is allowed to be routeable only when at least one of these conditions is true:

- It is a multi-step business flow.
- It can be entered directly from notifications, task center, or IM.
- Refreshing the page must restore the modal state.
- It involves KYC, video verification, funds, Partner application, compliance state, or similarly high-risk recovery needs.

The following must not become independent routes:

- Ordinary confirmation dialogs.
- Success or failure feedback.
- Toast messages.
- Tips and lightweight help.
- Delete confirmations.
- Local action sheets and picker sheets.

These entries belong in `modalRegistry` with `routeable: false` and no `routePath`.

Routeable modals must declare `modalCloseBehavior: "backOrFallback"` and `closeFallback`. Non-routeable sheets/dialogs must declare modal close semantics (`dismiss`, `cancel`, `autoDismiss`, or `saveThenClose`) and confirm behavior.

## Current Routeable Modals

| Route path | Modal id | Component | Presentation | Risk | Reason | Review note |
|---|---|---|---|---|---|---|
| `/order/[id]` | `order.ticket.route` | `OrderTicketScreen` | `transparentModal` | high | Trading ticket is a transaction flow that benefits from refresh recovery, deep links, and external task entry. | Keep routeable. Requires server-side pre-trade validation before production. |
| `/discover-layout` | `discover.layout.route` | `DiscoverLayoutScreen` | `transparentModal` | low | Current implementation is a route-backed configuration layer. | Consider demoting if deep link or refresh recovery is not required. |

## Route Groups

| Group | Routes | Purpose |
|---|---|---|
| Root stack | `/`, `/brand-splash`, `/launch`, `/auth/*`, `/instrument/[id]`, `/order/[id]`, `/client/[id]`, `/partner/*`, `/account-*`, `/funding/*`, `/settings/*`, `/appearance`, `/discover-layout` | Page-level screens outside persistent tab navigation plus routeable transparent modal flows |
| Visible tabs | `/markets`, `/trade`, `/accounts`, `/discover`, `/quick` | Primary mobile navigation |
| Hidden tab routes | `/portfolio`, `/account`, `/partner-tools` | Compatibility aliases and Partner first-level entry point |
| System | `/(not-found)` | Expo Router not-found handling |

## Protected Route Behavior

- Root layout redirects unauthenticated users away from protected routes to `/auth?redirect=...`.
- Signed-in users are not sent to PIN setup by default; PIN remains an optional local control.
- Users with an existing local PIN stay unlocked on app entry unless a future explicit lock action sets the PIN gate to `locked`.
- Locked signed-in users with an enabled local PIN are sent to `/auth/pin-setup?mode=unlock`.
- These are local controls only; production RBAC, account scope, Partner scope, and funding/KYC gates must be enforced server-side.

## Change Control

- Add a route only after updating `routeRegistry`, the page map, product route map, and QA coverage.
- Add a modal only after updating `modalRegistry`, the modal map, and the page-modal trigger table.
- Changing close/back behavior requires updating `routeRegistry`, `modalRegistry` when applicable, `docs/page-navigation-policy.md`, and release notes.
- If a route uses `presentation: "transparentModal"` in `RootLayout`, the matching `modalRegistry` entry must have `routeable: true` and the same `routePath`.
- If a modal has `routeable: false`, it must not define `routePath`.
