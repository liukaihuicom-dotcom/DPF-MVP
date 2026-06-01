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

## Workspace Tab Policy

The app uses Expo Router JavaScript Tabs. SDK 54 native tabs are not adopted in this release. `Workspace` is fixed as the first visible tab and the remaining bottom tabs are segment-driven by `src/domain/workspace.ts`. Hidden segment routes use `href: null`; Copy Trading is not added to the default bottom bar.

| Segment | Visible bottom tabs | Notes |
|---|---|---|
| `new_trader` | Workspace, Markets, Trade, Accounts, Discover, Dynamic Discover Module | Trader bottom navigation is unified; destination pages and backend entitlement still enforce KYC, account, trading, funding, and high-risk action permissions. |
| `kyc_approved_no_deposit` | Workspace, Markets, Trade, Accounts, Discover, Dynamic Discover Module | Trader bottom navigation is unified; Workspace still keeps KYC, account readiness, funding rule, and risk status visible in GUI. |
| `active_trader` | Workspace, Markets, Trade, Accounts, Discover, Dynamic Discover Module | Shows account, margin/PnL, position risk, funding record paths, and low-noise market context with explicit GUI trade flows. |
| `partner_mode` | Workspace, Clients, Growth, Wallet, Me | Commission Wallet is separate from Trader trading accounts and includes a switch back to Trader mode. |

## Close And Back Policy

The site uses these interaction meanings:

- `close`: exit an independent flow and replace to a safe public or module entry route. It must not depend on history.
- `back`: return to a deterministic previous step or parent page. It must have a fallback target for direct links and guard redirects.
- `cancel`: cancel an input, edit, selection, or confirmation and keep the current business state.
- `dismiss`: close a sheet, dialog, select menu, or toast without changing page state.
- `confirm-leave`: protect sensitive verified, funding, trading, or security flows before abandoning the current step.

Auth roots (`/auth`, `/auth/register`, `/auth/onboarding`, `/auth/forgot-password`) use close to `/launch`. Auth registration steps use back to their prior step and verified steps use `confirm-leave`. Protected-route redirects must not close back to the protected target, because that can trigger an auth-guard loop.

Primary tabs do not show a back control. Detail pages, funding pages, settings pages, and routeable modal pages must declare a deterministic parent fallback. Shared navigation components must route through `src/navigation/navigationPolicy.ts`; page code must not call `router.back()` or `router.canGoBack()` directly.

## Modal Routing Policy

Do not route every modal. A modal is allowed to be routeable only when it is a multi-step business flow, can be entered directly from notifications/task center/IM, must restore state after refresh, or involves KYC, video verification, funds, Partner application, compliance state, or similarly high-risk recovery needs. Ordinary confirmations, feedback, tips, delete confirmations, local action sheets, and picker sheets stay in `modalRegistry` with `routeable: false`.

## Current Routeable Modals

| Route path | Modal id | Component | Presentation | Risk | Reason | Review note |
|---|---|---|---|---|---|---|
| `/order/[id]` | `order.ticket.route` | `OrderTicketScreen` | `transparentModal` | high | Trading ticket is a transaction flow that benefits from refresh recovery, deep links, and external task entry. | Keep routeable. Requires server-side pre-trade validation before production. |
| `/discover-layout` | `discover.layout.route` | `DiscoverLayoutScreen` | `transparentModal` | low | Current implementation is a route-backed configuration layer. | Consider demoting if deep link or refresh recovery is not required. |

## Route Groups

| Group | Routes | Purpose |
|---|---|---|
| Root stack | `/`, `/brand-splash`, `/launch`, `/auth/*`, `/instrument/[id]`, `/order/[id]`, `/client/[id]`, `/partner-tools`, `/partner/*`, `/account-*`, `/funding/*`, `/settings/*`, `/appearance`, `/discover-layout` | Page-level screens outside persistent tab navigation plus routeable transparent modal flows. |
| Segment visible tabs | Trader segments: `/workspace`, `/markets`, `/trade`, `/accounts`, `/discover`, `/quick`; Partner: `/workspace`, `/clients`, `/growth`, `/wallet`, `/me` | Workspace-governed bottom navigation. `/quick` is the dynamic Discover module carrier and its label/icon depend on the selected module. |
| Hidden tab routes | `/portfolio`, `/account` | Compatibility aliases and legacy implementation entries hidden from default bottom navigation. |
| System | `/(not-found)` | Expo Router not-found handling. |

## Protected Route Behavior

- Root layout redirects unauthenticated users away from protected routes to `/auth?redirect=...`.
- `/workspace`, `/learn`, `/demo`, `/discover`, and `/quick` remain public or signed-in optional for onboarding and education.
- Signed-in users are not sent to PIN setup by default; PIN remains an optional local control.
- Locked signed-in users with an enabled local PIN are sent to `/auth/pin-setup?mode=unlock`.
- These are local controls only; production RBAC, account scope, Partner scope, and funding/KYC gates must be enforced server-side.

## Change Control

- Add a route only after updating `routeRegistry`, the page map, product route map, public-resource graph, and QA coverage.
- Add a modal only after updating `modalRegistry`, the modal map, and the page-modal trigger table.
- Changing close/back behavior requires updating `routeRegistry`, `modalRegistry` when applicable, `docs/page-navigation-policy.md`, and release notes.
- If a route uses `presentation: "transparentModal"` in `RootLayout`, the matching `modalRegistry` entry must have `routeable: true` and the same `routePath`.
- If a modal has `routeable: false`, it must not define `routePath`.
