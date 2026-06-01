# Page Inventory

Source of truth: `src/navigation/routeRegistry.ts`.

| Page ID | Route | Platform | Primary role | Purpose | Risk |
|---|---|---|---|---|---|
| `index_redirect` | `/` | App/Web | guest | Redirect to brand splash | low |
| `brand_splash` | `/brand-splash` | App/Web | guest | Show brand intro | low |
| `launch` | `/launch` | App/Web | guest | Start login | low |
| `workspace` | `/workspace` | App/Web | guest / signedIn.optional | Role-aware broker workspace that resolves Trader and Partner state, priority focus, metrics, assist entry, and bottom-tab segment contract. | medium |
| `learn` | `/learn` | App/Web | guest | Education and risk-learning tab wrapper for new Trader onboarding. | low |
| `demo` | `/demo` | App/Web | guest | Paper-trading demo tab wrapper with no real funds or live execution. | medium |
| `markets` | `/markets` | App/Web | signedIn.trader | Search instruments | medium |
| `markets_account_demo` | `/markets-account-demo` | App/Web | local.devOnly | Compare trading-account header visual variants | low |
| `trade` | `/trade` | App/Web | signedIn.trader | Review positions | high |
| `accounts` | `/accounts` | App/Web | signedIn.trader | Inspect trading accounts | medium |
| `discover` | `/discover` | App/Web | guest | Browse discovery modules | low |
| `quick` | `/quick` | App/Web | signedIn.any | Show selected function module | medium |
| `clients` | `/clients` | App/Web | signedIn.partner | Approved Partner client funnel tab. | high |
| `growth` | `/growth` | App/Web | signedIn.partner | Approved Partner growth and function-center tab. | medium |
| `wallet` | `/wallet` | App/Web | signedIn.partner | Approved Partner commission wallet tab separated from Trader accounts. | medium |
| `me` | `/me` | App/Web | signedIn.any | Profile, settings, local PIN, security, and appearance entry. | medium |
| `portfolio_alias` | `/portfolio` | App/Web | signedIn.trader | Compatibility entry for trade workspace | high |
| `account_alias` | `/account` | App/Web | signedIn.trader | Compatibility entry for accounts workspace | medium |
| `instrument_detail` | `/instrument/[id]` | App/Web | signedIn.trader | Review quote detail | medium |
| `order_ticket` | `/order/[id]` | App/Web | signedIn.trader | Select side | high |
| `client_profile` | `/client/[id]` | App/Web | signedIn.partner | Review client profile | high |
| `partner_tools` | `/partner-tools` | App/Web | signedIn.partner | Open partner growth tools | medium |
| `partner_client_orders` | `/partner/client-orders` | App/Web | signedIn.partner | Review partner client order summary | high |
| `partner_commission` | `/partner/commission` | App/Web | signedIn.partner | Review pending rebates | medium |
| `discover_entry` | `/discover-entry/[id]` | App/Web | guest | Review discovery entry details | medium |
| `discover_layout` | `/discover-layout` | App/Web | signedIn.any | Reorder discovery modules | low |
| `account_details` | `/account-details/[id]` | App/Web | signedIn.trader | Review account metrics | high |
| `account_basic` | `/account-basic/[id]` | App/Web | signedIn.trader | Review basic account profile | medium |
| `account_balance` | `/account-balance/[id]` | App/Web | signedIn.trader | Review balance trend | high |
| `account_orders` | `/account-orders/[id]` | App/Web | signedIn.trader | Review account order records | medium |
| `funding_home` | `/funding` | App/Web | signedIn.trader | Open deposit | high |
| `deposit_form` | `/funding/deposit` | App/Web | signedIn.trader | Select account | high |
| `withdrawal_form` | `/funding/withdrawal` | App/Web | signedIn.trader | Select payout method | high |
| `transfer_form` | `/funding/transfer` | App/Web | signedIn.trader | Select source account | high |
| `funding_transaction_list` | `/funding/transactions` | App/Web | signedIn.trader | Filter funding transactions | medium |
| `funding_transaction_detail` | `/funding/transactions/[id]` | App/Web | signedIn.trader | Review transaction status | high |
| `settings` | `/settings` | App/Web | signedIn.any | Review profile module | medium |
| `security_login_log` | `/settings/security-log` | App/Web | signedIn.any | Open device detail | high |
| `appearance` | `/appearance` | App/Web | signedIn.any | Select system theme | low |
| `onboarding` | `/auth/onboarding` | App/Web | guest | Choose trader onboarding | medium |
| `login` | `/auth` | App/Web | guest | Choose email or phone login | medium |
| `register_phone` | `/auth/register` | App/Web | guest | Select country | medium |
| `register_email_code` | `/auth/register-email-code` | App/Web | guest | Enter OTP | medium |
| `register_email` | `/auth/register-phone` | App/Web | guest | Enter email after phone verification | medium |
| `register_phone_code` | `/auth/register-phone-code` | App/Web | guest | Enter OTP | medium |
| `register_password` | `/auth/register-password` | App/Web | guest | Enter password | medium |
| `forgot_password` | `/auth/forgot-password` | App/Web | guest / signedIn.optional | Choose reset channel | medium |
| `pin_setup` | `/auth/pin-setup` | App/Web | guest | Create optional local PIN after registration | high |
| `verify_legacy_redirect` | `/auth/verify` | App/Web | guest | Redirect legacy verification entry to login | low |
| `not_found` | `/(not-found)` | App/Web | guest | Explain missing route | low |

## Product Gaps

- Production RBAC, Partner data scope, trading execution, funding/KYC policy, and device/session mutation are not backed by server-side services yet.
- Route permissions in the registry are delivery assumptions and must be reconciled with production entitlement policy before release.
- `/settings/security-center` is a contract-first planned canonical route; do not add it to runtime route coverage or public-resource graph pages until the App implementation stage creates the route wrapper and screen.
