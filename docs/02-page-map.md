# Site Page Map

Source of truth: `src/navigation/routeRegistry.ts`.

This document is the review map for all current Expo Router page files. Layout and HTML infrastructure files are not product pages: `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, and `app/+html.tsx`.

## Runtime Page Inventory

| Route path | Page component | Module | Permission | Navigation level | Primary actions | Related modals | Empty / loading / error states |
|---|---|---|---|---|---|---|---|
| `/` | `IndexRoute` | Launch | `guest` | root | Redirect to brand splash | None | redirecting |
| `/brand-splash` | `BrandSplashScreen` | Launch | `guest` | root | Show brand intro, Continue to launch | None | default, redirecting, error |
| `/launch` | `LaunchScreen` | Launch | `guest` | root | Start login, Start registration | `global.toastFeedback` | default, loading, error |
| `/workspace` | `WorkspaceScreen` | Workspace | `guest / signedIn.optional` | primary tab | Review role-aware workspace status, Open guided next step, Open quiet assist entry | `global.toastFeedback` | default, loading, empty, error, permission denied, restricted, reviewing |
| `/learn` | `LearnRoute` | Discover | `guest` | primary tab | Review learning and risk education entries, Open paper-practice support content | `global.toastFeedback` |  |
| `/demo` | `DemoRoute` | Discover | `guest` | primary tab | Open paper-trading challenge, Review virtual ROI and drawdown context | `order.ticket.route`, `global.toastFeedback` |  |
| `/markets` | `MarketsScreen` | Markets | `signedIn.trader` | primary tab | Search instruments, Switch trading account, Open instrument detail | `tradingAccount.switchSheet`, `global.toastFeedback`, `global.webSelectMenu` |  |
| `/markets-account-demo` | `MarketsAccountHeaderDemoScreen` | Markets | `local.devOnly` | detail | Compare trading-account header visual variants | None |  |
| `/trade` | `PortfolioScreen` | Trading | `signedIn.trader` | primary tab | Review positions, Review pending orders, Close position, Modify or delete order, Open account menu | `portfolio.accountMenuSheet`, `portfolio.closePositionConfirm`, `portfolio.pendingOrderDetailSheet`, `portfolio.pendingOrderFeedbackToast`, `portfolio.positionDetailSheet`, `portfolio.orderMutationAlert`, `tradingAccount.switchSheet`, `global.modalQueue`, `global.toastFeedback` |  |
| `/accounts` | `AccountScreen` | Accounts | `signedIn.trader` | primary tab | Inspect trading accounts, Open account detail, Review funding shortcuts | `account.metricDescriptionSheet`, `global.bottomSheet`, `global.toastFeedback` |  |
| `/discover` | `DupoinDiscoverScreen` | Discover | `guest` | primary tab | Browse discovery modules, Open function entry, Open layout settings | `discover.layout.route`, `global.toastFeedback` |  |
| `/quick` | `DiscoverModuleScreen` | Discover | `signedIn.any` | primary tab | Show selected function module, Open order ticket, Open partner tools, Submit partner application demo | `order.ticket.route`, `partner.upgradeFeedbackAlert`, `global.modalQueue`, `global.toastFeedback` |  |
| `/clients` | `PartnerClientsScreen` | Partner | `signedIn.partner` | primary tab | Review Partner client funnel, Open client profile, Review upgrade status | `global.toastFeedback` |  |
| `/growth` | `PartnerToolsScreen` | Partner | `signedIn.partner` | primary tab | Open Partner growth tools, Select approved material or function module | `global.toastFeedback` |  |
| `/wallet` | `CommissionScreen` | Partner | `signedIn.partner` | primary tab | Review pending rebates, Review settled rebates, Inspect commission rules | None |  |
| `/me` | `SettingsScreen` | Settings | `signedIn.any` | primary tab | Review profile module, Open security settings, Open appearance settings | `global.toastFeedback` |  |
| `/portfolio` | `PortfolioScreen` | Trading | `signedIn.trader` | hidden tab | Compatibility entry for trade workspace, Review and manage positions | `portfolio.accountMenuSheet`, `portfolio.closePositionConfirm`, `portfolio.pendingOrderDetailSheet`, `portfolio.pendingOrderFeedbackToast`, `portfolio.positionDetailSheet`, `portfolio.orderMutationAlert`, `tradingAccount.switchSheet`, `global.modalQueue`, `global.toastFeedback` |  |
| `/account` | `AccountScreen` | Accounts | `signedIn.trader` | hidden tab | Compatibility entry for accounts workspace, Open trading account details | `account.metricDescriptionSheet`, `global.bottomSheet`, `global.toastFeedback` |  |
| `/instrument/[id]` | `InstrumentDetailScreen` | Markets | `signedIn.trader` | detail | Review quote detail, Switch detail tab, Open buy ticket, Open sell ticket | `order.ticket.route`, `global.toastFeedback` | default, loading, error, not found, restricted |
| `/order/[id]` | `OrderTicketScreen` | Trading | `signedIn.trader` | modal route | Select side, Select order type, Edit lots, Toggle risk controls, Submit order | `order.ticket.route`, `global.modalQueue`, `global.toastFeedback` | default, inputting, validating, submitting, success, failed, error, not found, restricted |
| `/client/[id]` | `ClientProfileScreen` | Partner | `signedIn.partner` | detail | Review client profile, Approve upgrade request demo, Open client action feedback | `partner.upgradeFeedbackAlert`, `global.modalQueue`, `global.toastFeedback` | default, loading, error, not found, permission denied, restricted, reviewing |
| `/partner-tools` | `PartnerToolsScreen` | Partner | `signedIn.partner` | detail | Open partner growth tools, Select growth module, Open client or commission workspace | `global.toastFeedback` |  |
| `/partner/client-orders` | `PartnerClientsScreen` | Partner | `signedIn.partner` | detail | Review partner client order summary, Open client profile, Review upgrade request status | `global.toastFeedback` |  |
| `/partner/commission` | `CommissionScreen` | Partner | `signedIn.partner` | detail | Review pending rebates, Review settled rebates, Inspect monthly commission details | None |  |
| `/discover-entry/[id]` | `DiscoverEntryScreen` | Discover | `guest` | detail | Review discovery entry details, Return to Discover | `global.toastFeedback` | default, loading, empty, error, not found |
| `/discover-layout` | `DiscoverLayoutScreen` | Discover | `signedIn.any` | modal route | Reorder discovery modules, Change module display mode, Save layout, Cancel layout changes | `discover.layout.route` | default, inputting, submitting, success, failed, error |
| `/account-details/[id]` | `AccountDetailsScreen` | Accounts | `signedIn.trader` | detail | Review account metrics, Open account menu, Open funding route, Open basic info, Open balance, Open orders | `account.moreActionSheet`, `global.toastFeedback` |  |
| `/account-basic/[id]` | `AccountBasicScreen` | Accounts | `signedIn.trader` | detail | Review basic account profile, Open metric description | `account.metricDescriptionSheet` |  |
| `/account-balance/[id]` | `AccountBalanceScreen` | Accounts | `signedIn.trader` | detail | Review balance trend, Filter balance transactions, Open balance transaction detail | `account.balanceTransactionDetailSheet` |  |
| `/account-orders/[id]` | `AccountOrdersScreen` | Accounts | `signedIn.trader` | detail | Review account order records, Inspect order summary | None |  |
| `/funding` | `FundingHomeScreen` | Funding | `signedIn.trader` | detail | Open deposit, Open withdrawal, Open transfer, Open funding transaction history | `global.toastFeedback` | default, loading, empty, error, permission denied, restricted, reviewing |
| `/funding/deposit` | `DepositScreen` | Funding | `signedIn.trader` | detail | Select account, Enter amount, Select payment method, Submit deposit | `tradingAccount.switchSheet`, `funding.paymentMethodSheet`, `funding.submitFeedbackAlert`, `global.modalQueue`, `global.toastFeedback` |  |
| `/funding/withdrawal` | `WithdrawalScreen` | Funding | `signedIn.trader` | detail | Select payout method, Enter amount, Select trading account, Submit withdrawal | `tradingAccount.switchSheet`, `funding.paymentMethodSheet`, `funding.submitFeedbackAlert`, `global.modalQueue`, `global.toastFeedback` | default, inputting, validating, submitting, reviewing, success, failed, error, restricted |
| `/funding/transfer` | `TransferScreen` | Funding | `signedIn.trader` | detail | Select source account, Enter amount, Select target account, Submit internal transfer | `tradingAccount.switchSheet`, `funding.submitFeedbackAlert`, `global.modalQueue`, `global.toastFeedback` | default, inputting, validating, submitting, success, failed, error, restricted |
| `/funding/transactions` | `FundingTransactionsScreen` | Funding | `signedIn.trader` | detail | Filter funding transactions, Open transaction detail | None |  |
| `/funding/transactions/[id]` | `FundingTransactionDetailScreen` | Funding | `signedIn.trader` | detail | Review transaction status, Review timeline, Open support context | `global.toastFeedback` | default, loading, error, not found, reviewing, restricted |
| `/settings` | `SettingsScreen` | Settings | `signedIn.any` | detail | Review profile module, Open PIN security setup, Open security login log, Open profile related settings | `global.toastFeedback` |  |
| `/settings/security-log` | `SecurityLoginLogScreen` | Settings | `signedIn.any` | detail | Open device detail, Revoke session, Report suspicious event | `security.deviceDetailSheet`, `security.revokeConfirmSheet`, `security.reportConfirmSheet`, `global.modalQueue`, `global.toastFeedback` | default, loading, empty, error, submitting, success, failed, restricted |
| `/appearance` | `AppearanceScreen` | Settings | `signedIn.any` | detail | Select system theme, Select light theme, Select dark theme | None | default, inputting, success, error |
| `/auth/onboarding` | `OnboardingScreen` | Auth | `guest` | root | Choose trader onboarding, Choose partner onboarding, Start registration, Open login | `global.toastFeedback` |  |
| `/auth` | `LoginScreen` | Auth | `guest` | root | Choose email or phone login, Select country for phone login, Enter account, Enter password, Submit login, Use remembered account, Open forgot password | `auth.countryPicker`, `auth.errorSheet`, `global.toastFeedback` |  |
| `/auth/register` | `RegisterPhoneScreen` | Auth | `guest` | root | Select country, Enter phone, Confirm contact, Continue to phone code | `auth.countryPicker`, `auth.contactConfirm`, `auth.errorSheet`, `global.toastFeedback` |  |
| `/auth/register-email-code` | `RegisterEmailCodeScreen` | Auth | `guest` | root | Enter OTP, Resend code, Change email, Open recovery help | `global.toastFeedback` | default, inputting, validating, success, failed, expired, timeout, error |
| `/auth/register-phone` | `RegisterEmailScreen` | Auth | `guest` | root | Enter email after phone verification, Confirm contact, Continue to email code, Leave verified phone step | `auth.contactConfirm`, `auth.errorSheet`, `auth.leaveVerifiedStep`, `global.toastFeedback` |  |
| `/auth/register-phone-code` | `RegisterPhoneCodeScreen` | Auth | `guest` | root | Enter OTP, Resend code, Change phone, Open recovery help | `global.toastFeedback` | default, inputting, validating, success, failed, expired, timeout, error |
| `/auth/register-password` | `RegisterPasswordScreen` | Auth | `guest` | root | Enter password, Confirm password, Continue to optional PIN setup, Leave verified email step | `auth.errorSheet`, `auth.leaveVerifiedStep`, `global.toastFeedback` |  |
| `/auth/forgot-password` | `ForgotPasswordScreen` | Auth | `guest / signedIn.optional` | root | Choose reset channel, Enter reset account, Verify code, Set new password | `auth.countryPicker`, `auth.errorSheet`, `global.toastFeedback` | default, inputting, validating, submitting, success, failed, expired, timeout, error |
| `/auth/pin-setup` | `PinSetupScreen` | Auth | `guest` | root | Create optional local PIN after registration, Confirm local PIN, Unlock only after explicit local lock, Skip local PIN setup, Open from Me settings menu | `auth.errorDialog` | default, inputting, validating, success, failed, restricted, bypassed |
| `/auth/verify` | `VerifyDeprecatedScreen` | Auth | `guest` | root | Redirect legacy verification entry to login | None | redirecting, error |
| `/(not-found)` | `NotFoundScreen` | Navigation | `guest` | system | Explain missing route, Return to app | None | not found |

## Workspace Bottom Navigation

- Workspace is the first visible tab for all governed segments.
- Trader segments (`new_trader`, `kyc_approved_no_deposit`, and `active_trader`): `Workspace / Markets / Trade / Accounts / Discover / Dynamic Discover Module`.
- Trader destination pages and production backend entitlement must still enforce KYC, trading, funding, account-scope, and high-risk action permissions.
- Approved Partner Mode: `Workspace / Clients / Growth / Wallet / Me`.
- Tabs not allowed for the current segment use Expo Router `href: null` and remain hidden.

## Governance Notes

- All new page files under `app/**/*.tsx` must be represented in `routeRegistry`, except layout and HTML infrastructure.
- Every route entry must declare `topNavBehavior`; `back` routes must declare `backTarget`, and `close` routes must declare `closeTarget`.
- Page-level close/back behavior is governed in `docs/page-navigation-policy.md`.
- `relatedModals` must reference existing `modalRegistry` ids.
- Ordinary confirmation dialogs, error sheets, success feedback, toast, tips, and delete confirmations must stay in `modalRegistry` and must not become independent routes.
- Production RBAC is not yet connected; route entries with role-sensitive behavior use `permissionGap` until server-side entitlement and data-scope checks exist.
