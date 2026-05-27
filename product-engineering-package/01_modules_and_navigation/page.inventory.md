# Page Inventory

Source of truth: `src/navigation/routeRegistry.ts`.

| Page ID | Route | Platform | Primary role | Purpose | Risk |
|---|---|---|---|---|---|
| `index_redirect` | `/` | App/Web | Guest | Redirect cold start to brand splash. | low |
| `brand_splash` | `/brand-splash` | App/Web | Guest / signed-in | Show brand intro and hand off to launch. | low |
| `launch` | `/launch` | App/Web | Guest | Provide login and registration entry. | low |
| `markets` | `/markets` | App/Web | Trader | Browse instruments, switch account, open instrument detail. | medium |
| `trade` | `/trade` | App/Web | Trader | Manage positions and orders from the primary tab. | high |
| `accounts` | `/accounts` | App/Web | Trader | Review trading accounts, account details, and funding shortcuts from the primary tab. | medium |
| `discover` | `/discover` | App/Web | Guest / signed-in | Browse growth, education, onboarding, support, and function entries. | low |
| `quick` | `/quick` | App/Web | Signed-in user | Show selected Discover module and quick business actions. | medium |
| `portfolio_alias` | `/portfolio` | App/Web | Trader | Hidden compatibility route for portfolio implementation. | high |
| `account_alias` | `/account` | App/Web | Trader | Hidden compatibility route for account implementation. | medium |
| `partner_tools` | `/partner-tools` | App/Web | Partner | Partner function center and growth tools. | medium |
| `instrument_detail` | `/instrument/[id]` | App/Web | Trader | Quote detail with buy/sell entry. | medium |
| `order_ticket` | `/order/[id]` | App/Web | Trader | Routeable transparent order ticket for trading flow. | high |
| `client_profile` | `/client/[id]` | App/Web | Partner | Review client status and upgrade request context. | high |
| `partner_client_orders` | `/partner/client-orders` | App/Web | Partner | Review authorized client order summaries and upgrade status as a Partner secondary page. | high |
| `partner_commission` | `/partner/commission` | App/Web | Partner | Review pending and settled rebate settlement details as a Partner secondary page. | medium |
| `discover_entry` | `/discover-entry/[id]` | App/Web | Guest / signed-in | Explain a Discover function entry and production readiness. | medium |
| `discover_layout` | `/discover-layout` | App/Web | Signed-in user | Route-backed Discover layout editor. | low |
| `account_details` | `/account-details/[id]` | App/Web | Trader | Account drilldown, funding shortcuts, performance widgets. | high |
| `account_basic` | `/account-basic/[id]` | App/Web | Trader | Basic trading account attributes and metric explanations. | medium |
| `account_balance` | `/account-balance/[id]` | App/Web | Trader | Account balance trend and balance transaction detail. | high |
| `account_orders` | `/account-orders/[id]` | App/Web | Trader | Account order records. | medium |
| `funding_home` | `/funding` | App/Web | Trader | Funding actions, balances, risk status, and recent transactions. | high |
| `deposit_form` | `/funding/deposit` | App/Web | Trader | Submit IDR deposit to a selected USD trading account. | high |
| `withdrawal_form` | `/funding/withdrawal` | App/Web | Trader | Submit IDR withdrawal from a selected USD trading account. | high |
| `transfer_form` | `/funding/transfer` | App/Web | Trader | Transfer USD between same-owner active trading accounts. | high |
| `funding_transaction_list` | `/funding/transactions` | App/Web | Trader | List deposits, withdrawals, and funding records. | medium |
| `funding_transaction_detail` | `/funding/transactions/[id]` | App/Web | Trader | Unified transaction detail for support and audit. | high |
| `settings` | `/settings` | App/Web | Signed-in user | Profile/settings module entry. | medium |
| `security_login_log` | `/settings/security-log` | App/Web | Signed-in user | Review remembered devices and local security events. | high |
| `appearance` | `/appearance` | App/Web | Signed-in user | Select local appearance mode. | low |
| `onboarding` | `/auth/onboarding` | App/Web | Guest | Activation path and trader/partner onboarding entry. | medium |
| `login` | `/auth` | App/Web | Guest | Email/phone login and remembered account entry. | medium |
| `register_phone` | `/auth/register` | App/Web | Guest | Registration phone-first entry. | medium |
| `register_email_code` | `/auth/register-email-code` | App/Web | Guest | Email OTP verification. | medium |
| `register_email` | `/auth/register-phone` | App/Web | Guest | Registration email entry after phone verification. | medium |
| `register_phone_code` | `/auth/register-phone-code` | App/Web | Guest | Phone OTP verification. | medium |
| `register_password` | `/auth/register-password` | App/Web | Guest | Password creation before optional PIN setup. | medium |
| `forgot_password` | `/auth/forgot-password` | App/Web | Guest | Multi-step local password reset. | medium |
| `pin_setup` | `/auth/pin-setup` | App/Web | Guest / signed-in optional | Optional local PIN setup and explicit-lock unlock gate. | high |
| `verify_legacy_redirect` | `/auth/verify` | App/Web | Guest | Legacy verification redirect to login. | low |
| `not_found` | `/(not-found)` | App/Web | Any | Missing route recovery. | low |

## Product Gaps

- Production RBAC, Partner data scope, trading execution, funding/KYC policy, and device/session mutation are not backed by server-side services yet.
- Route permissions in the registry are delivery assumptions and must be reconciled with production entitlement policy before release.
