export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type RoutePresentation = 'screen' | 'tab' | 'hiddenTab' | 'redirect' | 'transparentModal' | 'notFound';

export type NavigationLevel = 'root' | 'primaryTab' | 'hiddenTab' | 'detail' | 'modalRoute' | 'system';

export type RoutePermission = 'guest' | 'guest / signedIn.optional' | 'signedIn.any' | 'signedIn.trader' | 'signedIn.partner' | 'local.devOnly';

export type RouteModule =
  | 'Accounts'
  | 'Auth'
  | 'Discover'
  | 'Funding'
  | 'Launch'
  | 'Markets'
  | 'Navigation'
  | 'Partner'
  | 'Settings'
  | 'Trading';

export type RouteState =
  | 'default'
  | 'loading'
  | 'empty'
  | 'error'
  | 'disabled'
  | 'inputting'
  | 'validating'
  | 'submitting'
  | 'success'
  | 'failed'
  | 'permission_denied'
  | 'restricted'
  | 'reviewing'
  | 'expired'
  | 'bypassed'
  | 'timeout'
  | 'redirecting'
  | 'not_found';

export type RelatedModalId =
  | 'account.balanceTransactionDetailSheet'
  | 'account.metricDescriptionSheet'
  | 'account.moreActionSheet'
  | 'auth.contactConfirm'
  | 'auth.countryPicker'
  | 'auth.errorDialog'
  | 'auth.errorSheet'
  | 'auth.leaveVerifiedStep'
  | 'discover.layout.route'
  | 'funding.paymentMethodSheet'
  | 'funding.submitFeedbackAlert'
  | 'global.bottomSheet'
  | 'global.modalQueue'
  | 'global.modalStack'
  | 'global.toastFeedback'
  | 'global.webSelectMenu'
  | 'order.ticket.route'
  | 'partner.upgradeFeedbackAlert'
  | 'portfolio.accountMenuSheet'
  | 'portfolio.closePositionConfirm'
  | 'portfolio.orderMutationAlert'
  | 'portfolio.pendingOrderDetailSheet'
  | 'portfolio.pendingOrderFeedbackToast'
  | 'portfolio.positionDetailSheet'
  | 'quick.actionSheet'
  | 'security.deviceDetailSheet'
  | 'security.reportConfirmSheet'
  | 'security.revokeConfirmSheet'
  | 'tradingAccount.switchSheet';

export type RouteRegistryEntry = {
  path: string;
  pageComponent: string;
  module: RouteModule;
  permission: RoutePermission;
  navigationLevel: NavigationLevel;
  topNavBehavior: 'none' | 'back' | 'close' | 'system';
  backTarget?: string;
  closeTarget?: string;
  leaveGuard?: 'none' | 'confirm-leave';
  primaryActions: readonly string[];
  relatedModals: readonly RelatedModalId[];
  states: readonly RouteState[];
  routePresentation: RoutePresentation;
  riskLevel: RiskLevel;
  permissionGap?: string;
  routingReview?: string;
};

const basicStates = ['default', 'loading', 'empty', 'error'] as const;
const formStates = ['default', 'inputting', 'validating', 'submitting', 'success', 'failed', 'error'] as const;
const protectedStates = ['default', 'loading', 'empty', 'error', 'permission_denied', 'restricted'] as const;
const noTopNav = { topNavBehavior: 'none' } as const;
const systemTopNav = { topNavBehavior: 'system' } as const;
const closeToLaunch = { closeTarget: '/launch', topNavBehavior: 'close' } as const;
const backToMarkets = { backTarget: '/markets', topNavBehavior: 'back' } as const;
const backToTrade = { backTarget: '/trade', topNavBehavior: 'back' } as const;
const backToAccounts = { backTarget: '/accounts', topNavBehavior: 'back' } as const;
const backToDiscover = { backTarget: '/discover', topNavBehavior: 'back' } as const;
const backToFunding = { backTarget: '/funding', topNavBehavior: 'back' } as const;
const backToSettings = { backTarget: '/settings', topNavBehavior: 'back' } as const;

export const routeRegistry = [
  {
    path: '/',
    pageComponent: 'IndexRoute',
    module: 'Launch',
    permission: 'guest',
    navigationLevel: 'root',
    ...noTopNav,
    primaryActions: ['Redirect to brand splash'],
    relatedModals: [],
    states: ['redirecting'],
    routePresentation: 'redirect',
    riskLevel: 'low',
  },
  {
    path: '/brand-splash',
    pageComponent: 'BrandSplashScreen',
    module: 'Launch',
    permission: 'guest',
    navigationLevel: 'root',
    ...noTopNav,
    primaryActions: ['Show brand intro', 'Continue to launch'],
    relatedModals: [],
    states: ['default', 'redirecting', 'error'],
    routePresentation: 'screen',
    riskLevel: 'low',
  },
  {
    path: '/launch',
    pageComponent: 'LaunchScreen',
    module: 'Launch',
    permission: 'guest',
    navigationLevel: 'root',
    ...noTopNav,
    primaryActions: ['Start login', 'Start registration'],
    relatedModals: ['global.toastFeedback'],
    states: ['default', 'loading', 'error'],
    routePresentation: 'screen',
    riskLevel: 'low',
  },
  {
    path: '/markets',
    pageComponent: 'MarketsScreen',
    module: 'Markets',
    permission: 'signedIn.trader',
    navigationLevel: 'primaryTab',
    ...noTopNav,
    primaryActions: ['Search instruments', 'Switch trading account', 'Open instrument detail'],
    relatedModals: ['tradingAccount.switchSheet', 'global.toastFeedback', 'global.webSelectMenu'],
    states: protectedStates,
    routePresentation: 'tab',
    riskLevel: 'medium',
    permissionGap: 'Root layout currently allows public /discover only; production market access still needs server-side quote entitlement and account scope.',
  },
  {
    path: '/markets-account-demo',
    pageComponent: 'MarketsAccountHeaderDemoScreen',
    module: 'Markets',
    permission: 'local.devOnly',
    navigationLevel: 'detail',
    ...backToMarkets,
    primaryActions: ['Compare trading-account header visual variants'],
    relatedModals: [],
    states: basicStates,
    routePresentation: 'screen',
    riskLevel: 'low',
    routingReview: 'Local design review route for account-header variants; not a production trading route.',
  },
  {
    path: '/trade',
    pageComponent: 'PortfolioScreen',
    module: 'Trading',
    permission: 'signedIn.trader',
    navigationLevel: 'primaryTab',
    ...noTopNav,
    primaryActions: ['Review positions', 'Review pending orders', 'Close position', 'Modify or delete order', 'Open account menu'],
    relatedModals: [
      'portfolio.accountMenuSheet',
      'portfolio.closePositionConfirm',
      'portfolio.pendingOrderDetailSheet',
      'portfolio.pendingOrderFeedbackToast',
      'portfolio.positionDetailSheet',
      'portfolio.orderMutationAlert',
      'tradingAccount.switchSheet',
      'global.modalQueue',
      'global.toastFeedback',
    ],
    states: protectedStates,
    routePresentation: 'tab',
    riskLevel: 'high',
    permissionGap: 'Local role controls are not production trading entitlement checks; server-side order and account scope validation is required.',
  },
  {
    path: '/accounts',
    pageComponent: 'AccountScreen',
    module: 'Accounts',
    permission: 'signedIn.trader',
    navigationLevel: 'primaryTab',
    ...noTopNav,
    primaryActions: ['Inspect trading accounts', 'Open account detail', 'Review funding shortcuts'],
    relatedModals: ['account.metricDescriptionSheet', 'global.bottomSheet', 'global.toastFeedback'],
    states: protectedStates,
    routePresentation: 'tab',
    riskLevel: 'medium',
    permissionGap: 'Trading account ownership and ledger access are local simulation until production account scope is integrated.',
  },
  {
    path: '/discover',
    pageComponent: 'DupoinDiscoverScreen',
    module: 'Discover',
    permission: 'guest',
    navigationLevel: 'primaryTab',
    ...noTopNav,
    primaryActions: ['Browse discovery modules', 'Open function entry', 'Open layout settings'],
    relatedModals: ['discover.layout.route', 'global.toastFeedback'],
    states: basicStates,
    routePresentation: 'tab',
    riskLevel: 'low',
  },
  {
    path: '/quick',
    pageComponent: 'DiscoverModuleScreen',
    module: 'Discover',
    permission: 'signedIn.any',
    navigationLevel: 'primaryTab',
    ...noTopNav,
    primaryActions: ['Show selected function module', 'Open order ticket', 'Open partner tools', 'Submit partner application demo'],
    relatedModals: ['order.ticket.route', 'partner.upgradeFeedbackAlert', 'global.modalQueue', 'global.toastFeedback'],
    states: protectedStates,
    routePresentation: 'tab',
    riskLevel: 'medium',
    permissionGap: 'Quick tab actions can trigger trading, funding, and partner flows; production must enforce per-action permission checks.',
  },
  {
    path: '/portfolio',
    pageComponent: 'PortfolioScreen',
    module: 'Trading',
    permission: 'signedIn.trader',
    navigationLevel: 'hiddenTab',
    ...noTopNav,
    primaryActions: ['Compatibility entry for trade workspace', 'Review and manage positions'],
    relatedModals: [
      'portfolio.accountMenuSheet',
      'portfolio.closePositionConfirm',
      'portfolio.pendingOrderDetailSheet',
      'portfolio.pendingOrderFeedbackToast',
      'portfolio.positionDetailSheet',
      'portfolio.orderMutationAlert',
      'tradingAccount.switchSheet',
      'global.modalQueue',
      'global.toastFeedback',
    ],
    states: protectedStates,
    routePresentation: 'hiddenTab',
    riskLevel: 'high',
  },
  {
    path: '/account',
    pageComponent: 'AccountScreen',
    module: 'Accounts',
    permission: 'signedIn.trader',
    navigationLevel: 'hiddenTab',
    ...noTopNav,
    primaryActions: ['Compatibility entry for accounts workspace', 'Open trading account details'],
    relatedModals: ['account.metricDescriptionSheet', 'global.bottomSheet', 'global.toastFeedback'],
    states: protectedStates,
    routePresentation: 'hiddenTab',
    riskLevel: 'medium',
  },
  {
    path: '/partner-tools',
    pageComponent: 'PartnerToolsScreen',
    module: 'Partner',
    permission: 'signedIn.partner',
    navigationLevel: 'hiddenTab',
    ...noTopNav,
    primaryActions: ['Open partner module', 'Review partner growth tools', 'Open client workspace'],
    relatedModals: ['global.toastFeedback'],
    states: protectedStates,
    routePresentation: 'hiddenTab',
    riskLevel: 'medium',
    permissionGap: 'Partner route is hidden but not backed by production partner entitlement checks yet.',
  },
  {
    path: '/instrument/[id]',
    pageComponent: 'InstrumentDetailScreen',
    module: 'Markets',
    permission: 'signedIn.trader',
    navigationLevel: 'detail',
    ...backToMarkets,
    primaryActions: ['Review quote detail', 'Switch detail tab', 'Open buy ticket', 'Open sell ticket'],
    relatedModals: ['order.ticket.route', 'global.toastFeedback'],
    states: ['default', 'loading', 'error', 'not_found', 'restricted'],
    routePresentation: 'screen',
    riskLevel: 'medium',
  },
  {
    path: '/order/[id]',
    pageComponent: 'OrderTicketScreen',
    module: 'Trading',
    permission: 'signedIn.trader',
    navigationLevel: 'modalRoute',
    ...backToTrade,
    leaveGuard: 'confirm-leave',
    primaryActions: ['Select side', 'Select order type', 'Edit lots', 'Toggle risk controls', 'Submit order'],
    relatedModals: ['order.ticket.route', 'global.modalQueue'],
    states: ['default', 'inputting', 'validating', 'submitting', 'success', 'failed', 'error', 'not_found', 'restricted'],
    routePresentation: 'transparentModal',
    riskLevel: 'high',
    permissionGap: 'Local submit is not a production execution permission; server-side pre-trade validation is required.',
  },
  {
    path: '/client/[id]',
    pageComponent: 'ClientProfileScreen',
    module: 'Partner',
    permission: 'signedIn.partner',
    navigationLevel: 'detail',
    ...backToTrade,
    primaryActions: ['Review client profile', 'Approve upgrade request demo', 'Open client action feedback'],
    relatedModals: ['partner.upgradeFeedbackAlert', 'global.modalQueue', 'global.toastFeedback'],
    states: ['default', 'loading', 'error', 'not_found', 'permission_denied', 'restricted', 'reviewing'],
    routePresentation: 'screen',
    riskLevel: 'high',
    permissionGap: 'Client data route needs production PII scope, audit logging, and partner hierarchy checks.',
  },
  {
    path: '/partner/client-orders',
    pageComponent: 'PartnerClientsScreen',
    module: 'Partner',
    permission: 'signedIn.partner',
    navigationLevel: 'detail',
    backTarget: '/quick',
    topNavBehavior: 'back',
    primaryActions: ['Review partner client order summary', 'Open client profile', 'Review upgrade request status'],
    relatedModals: ['global.toastFeedback'],
    states: protectedStates,
    routePresentation: 'screen',
    riskLevel: 'high',
    permissionGap: 'Partner client-order data is local mock state; production requires partner hierarchy, PII scope, and audit controls.',
  },
  {
    path: '/partner/commission',
    pageComponent: 'CommissionScreen',
    module: 'Partner',
    permission: 'signedIn.partner',
    navigationLevel: 'detail',
    backTarget: '/quick',
    topNavBehavior: 'back',
    primaryActions: ['Review pending rebates', 'Review settled rebates', 'Inspect monthly commission details'],
    relatedModals: [],
    states: protectedStates,
    routePresentation: 'screen',
    riskLevel: 'medium',
    permissionGap: 'Commission settlement is local preview data; production requires settlement, statement, tax, and reporting integration.',
  },
  {
    path: '/discover-entry/[id]',
    pageComponent: 'DiscoverEntryScreen',
    module: 'Discover',
    permission: 'guest',
    navigationLevel: 'detail',
    ...backToDiscover,
    primaryActions: ['Review discovery entry details', 'Return to Discover'],
    relatedModals: ['global.toastFeedback'],
    states: ['default', 'loading', 'empty', 'error', 'not_found'],
    routePresentation: 'screen',
    riskLevel: 'medium',
  },
  {
    path: '/discover-layout',
    pageComponent: 'DiscoverLayoutScreen',
    module: 'Discover',
    permission: 'signedIn.any',
    navigationLevel: 'modalRoute',
    ...backToDiscover,
    primaryActions: ['Reorder discovery modules', 'Change module display mode', 'Save layout', 'Cancel layout changes'],
    relatedModals: ['discover.layout.route'],
    states: ['default', 'inputting', 'submitting', 'success', 'failed', 'error'],
    routePresentation: 'transparentModal',
    riskLevel: 'low',
    routingReview: 'consider demoting if not needed for deep link/recovery',
  },
  {
    path: '/account-details/[id]',
    pageComponent: 'AccountDetailsScreen',
    module: 'Accounts',
    permission: 'signedIn.trader',
    navigationLevel: 'detail',
    ...backToAccounts,
    primaryActions: ['Review account metrics', 'Open account menu', 'Open funding route', 'Open basic info', 'Open balance', 'Open orders'],
    relatedModals: ['account.moreActionSheet', 'global.toastFeedback'],
    states: protectedStates,
    routePresentation: 'screen',
    riskLevel: 'high',
    permissionGap: 'Account ownership and ledger access are local only; production account scope is required.',
  },
  {
    path: '/account-basic/[id]',
    pageComponent: 'AccountBasicScreen',
    module: 'Accounts',
    permission: 'signedIn.trader',
    navigationLevel: 'detail',
    ...backToAccounts,
    primaryActions: ['Review basic account profile', 'Open metric description'],
    relatedModals: ['account.metricDescriptionSheet'],
    states: protectedStates,
    routePresentation: 'screen',
    riskLevel: 'medium',
  },
  {
    path: '/account-balance/[id]',
    pageComponent: 'AccountBalanceScreen',
    module: 'Accounts',
    permission: 'signedIn.trader',
    navigationLevel: 'detail',
    ...backToAccounts,
    primaryActions: ['Review balance trend', 'Filter balance transactions', 'Open balance transaction detail'],
    relatedModals: ['account.balanceTransactionDetailSheet'],
    states: protectedStates,
    routePresentation: 'screen',
    riskLevel: 'high',
    permissionGap: 'Balance details are local ledger simulation until production ledger service is integrated.',
  },
  {
    path: '/account-orders/[id]',
    pageComponent: 'AccountOrdersScreen',
    module: 'Accounts',
    permission: 'signedIn.trader',
    navigationLevel: 'detail',
    ...backToAccounts,
    primaryActions: ['Review account order records', 'Inspect order summary'],
    relatedModals: [],
    states: protectedStates,
    routePresentation: 'screen',
    riskLevel: 'medium',
  },
  {
    path: '/funding',
    pageComponent: 'FundingHomeScreen',
    module: 'Funding',
    permission: 'signedIn.trader',
    navigationLevel: 'detail',
    ...backToTrade,
    primaryActions: ['Open deposit', 'Open withdrawal', 'Open transfer', 'Open funding transaction history'],
    relatedModals: ['global.toastFeedback'],
    states: ['default', 'loading', 'empty', 'error', 'permission_denied', 'restricted', 'reviewing'],
    routePresentation: 'screen',
    riskLevel: 'high',
    permissionGap: 'Funding gate is local; production must enforce KYC, active-account, jurisdiction, and limit policies server-side.',
  },
  {
    path: '/funding/deposit',
    pageComponent: 'DepositScreen',
    module: 'Funding',
    permission: 'signedIn.trader',
    navigationLevel: 'detail',
    ...backToFunding,
    leaveGuard: 'confirm-leave',
    primaryActions: ['Select account', 'Enter amount', 'Select payment method', 'Submit deposit'],
    relatedModals: ['tradingAccount.switchSheet', 'funding.paymentMethodSheet', 'funding.submitFeedbackAlert', 'global.modalQueue', 'global.toastFeedback'],
    states: formStates,
    routePresentation: 'screen',
    riskLevel: 'high',
  },
  {
    path: '/funding/withdrawal',
    pageComponent: 'WithdrawalScreen',
    module: 'Funding',
    permission: 'signedIn.trader',
    navigationLevel: 'detail',
    ...backToFunding,
    leaveGuard: 'confirm-leave',
    primaryActions: ['Select payout method', 'Enter amount', 'Select trading account', 'Submit withdrawal'],
    relatedModals: ['tradingAccount.switchSheet', 'funding.paymentMethodSheet', 'funding.submitFeedbackAlert', 'global.modalQueue', 'global.toastFeedback'],
    states: ['default', 'inputting', 'validating', 'submitting', 'reviewing', 'success', 'failed', 'error', 'restricted'],
    routePresentation: 'screen',
    riskLevel: 'high',
  },
  {
    path: '/funding/transfer',
    pageComponent: 'TransferScreen',
    module: 'Funding',
    permission: 'signedIn.trader',
    navigationLevel: 'detail',
    ...backToFunding,
    leaveGuard: 'confirm-leave',
    primaryActions: ['Select source account', 'Enter amount', 'Select target account', 'Submit internal transfer'],
    relatedModals: ['tradingAccount.switchSheet', 'funding.submitFeedbackAlert', 'global.modalQueue', 'global.toastFeedback'],
    states: ['default', 'inputting', 'validating', 'submitting', 'success', 'failed', 'error', 'restricted'],
    routePresentation: 'screen',
    riskLevel: 'high',
  },
  {
    path: '/funding/transactions',
    pageComponent: 'FundingTransactionsScreen',
    module: 'Funding',
    permission: 'signedIn.trader',
    navigationLevel: 'detail',
    ...backToFunding,
    primaryActions: ['Filter funding transactions', 'Open transaction detail'],
    relatedModals: [],
    states: protectedStates,
    routePresentation: 'screen',
    riskLevel: 'medium',
  },
  {
    path: '/funding/transactions/[id]',
    pageComponent: 'FundingTransactionDetailScreen',
    module: 'Funding',
    permission: 'signedIn.trader',
    navigationLevel: 'detail',
    backTarget: '/funding/transactions',
    topNavBehavior: 'back',
    primaryActions: ['Review transaction status', 'Review timeline', 'Open support context'],
    relatedModals: ['global.toastFeedback'],
    states: ['default', 'loading', 'error', 'not_found', 'reviewing', 'restricted'],
    routePresentation: 'screen',
    riskLevel: 'high',
  },
  {
    path: '/settings',
    pageComponent: 'SettingsScreen',
    module: 'Settings',
    permission: 'signedIn.any',
    navigationLevel: 'detail',
    backTarget: '/accounts',
    topNavBehavior: 'back',
    primaryActions: ['Review profile module', 'Open PIN security setup', 'Open security login log', 'Open profile related settings'],
    relatedModals: ['global.toastFeedback'],
    states: protectedStates,
    routePresentation: 'screen',
    riskLevel: 'medium',
  },
  {
    path: '/settings/security-log',
    pageComponent: 'SecurityLoginLogScreen',
    module: 'Settings',
    permission: 'signedIn.any',
    navigationLevel: 'detail',
    ...backToSettings,
    primaryActions: ['Open device detail', 'Revoke session', 'Report suspicious event'],
    relatedModals: ['security.deviceDetailSheet', 'security.revokeConfirmSheet', 'security.reportConfirmSheet', 'global.modalQueue', 'global.toastFeedback'],
    states: ['default', 'loading', 'empty', 'error', 'submitting', 'success', 'failed', 'restricted'],
    routePresentation: 'screen',
    riskLevel: 'high',
    permissionGap: 'Security action outcomes are local; production device/session mutation requires server audit and re-auth policy.',
  },
  {
    path: '/appearance',
    pageComponent: 'AppearanceScreen',
    module: 'Settings',
    permission: 'signedIn.any',
    navigationLevel: 'detail',
    ...backToSettings,
    primaryActions: ['Select system theme', 'Select light theme', 'Select dark theme'],
    relatedModals: [],
    states: ['default', 'inputting', 'success', 'error'],
    routePresentation: 'screen',
    riskLevel: 'low',
  },
  {
    path: '/auth/onboarding',
    pageComponent: 'OnboardingScreen',
    module: 'Auth',
    permission: 'guest',
    navigationLevel: 'root',
    ...closeToLaunch,
    primaryActions: ['Choose trader onboarding', 'Choose partner onboarding', 'Start registration', 'Open login'],
    relatedModals: ['global.toastFeedback'],
    states: basicStates,
    routePresentation: 'screen',
    riskLevel: 'medium',
  },
  {
    path: '/auth',
    pageComponent: 'LoginScreen',
    module: 'Auth',
    permission: 'guest',
    navigationLevel: 'root',
    ...closeToLaunch,
    primaryActions: ['Choose email or phone login', 'Select country for phone login', 'Enter account', 'Enter password', 'Submit login', 'Use remembered account', 'Open forgot password'],
    relatedModals: ['auth.countryPicker', 'auth.errorSheet', 'global.toastFeedback'],
    states: formStates,
    routePresentation: 'screen',
    riskLevel: 'medium',
  },
  {
    path: '/auth/register',
    pageComponent: 'RegisterPhoneScreen',
    module: 'Auth',
    permission: 'guest',
    navigationLevel: 'root',
    ...closeToLaunch,
    primaryActions: ['Select country', 'Enter phone', 'Confirm contact', 'Continue to phone code'],
    relatedModals: ['auth.countryPicker', 'auth.contactConfirm', 'auth.errorSheet', 'global.toastFeedback'],
    states: formStates,
    routePresentation: 'screen',
    riskLevel: 'medium',
  },
  {
    path: '/auth/register-email-code',
    pageComponent: 'RegisterEmailCodeScreen',
    module: 'Auth',
    permission: 'guest',
    navigationLevel: 'root',
    backTarget: '/auth/register',
    topNavBehavior: 'back',
    primaryActions: ['Enter OTP', 'Resend code', 'Change email', 'Open recovery help'],
    relatedModals: ['global.toastFeedback'],
    states: ['default', 'inputting', 'validating', 'success', 'failed', 'expired', 'timeout', 'error'],
    routePresentation: 'screen',
    riskLevel: 'medium',
  },
  {
    path: '/auth/register-phone',
    pageComponent: 'RegisterEmailScreen',
    module: 'Auth',
    permission: 'guest',
    navigationLevel: 'root',
    backTarget: '/auth/register',
    leaveGuard: 'confirm-leave',
    topNavBehavior: 'back',
    primaryActions: ['Enter email after phone verification', 'Confirm contact', 'Continue to email code', 'Leave verified phone step'],
    relatedModals: ['auth.contactConfirm', 'auth.errorSheet', 'auth.leaveVerifiedStep', 'global.toastFeedback'],
    states: formStates,
    routePresentation: 'screen',
    riskLevel: 'medium',
  },
  {
    path: '/auth/register-phone-code',
    pageComponent: 'RegisterPhoneCodeScreen',
    module: 'Auth',
    permission: 'guest',
    navigationLevel: 'root',
    backTarget: '/auth/register',
    topNavBehavior: 'back',
    primaryActions: ['Enter OTP', 'Resend code', 'Change phone', 'Open recovery help'],
    relatedModals: ['global.toastFeedback'],
    states: ['default', 'inputting', 'validating', 'success', 'failed', 'expired', 'timeout', 'error'],
    routePresentation: 'screen',
    riskLevel: 'medium',
  },
  {
    path: '/auth/register-password',
    pageComponent: 'RegisterPasswordScreen',
    module: 'Auth',
    permission: 'guest',
    navigationLevel: 'root',
    backTarget: '/auth/register-phone',
    leaveGuard: 'confirm-leave',
    topNavBehavior: 'back',
    primaryActions: ['Enter password', 'Confirm password', 'Continue to optional PIN setup', 'Leave verified email step'],
    relatedModals: ['auth.errorSheet', 'auth.leaveVerifiedStep', 'global.toastFeedback'],
    states: formStates,
    routePresentation: 'screen',
    riskLevel: 'medium',
  },
  {
    path: '/auth/forgot-password',
    pageComponent: 'ForgotPasswordScreen',
    module: 'Auth',
    permission: 'guest / signedIn.optional',
    navigationLevel: 'root',
    ...closeToLaunch,
    primaryActions: ['Choose reset channel', 'Enter reset account', 'Verify code', 'Set new password'],
    relatedModals: ['auth.countryPicker', 'auth.errorSheet', 'global.toastFeedback'],
    states: ['default', 'inputting', 'validating', 'submitting', 'success', 'failed', 'expired', 'timeout', 'error'],
    routePresentation: 'screen',
    riskLevel: 'medium',
  },
  {
    path: '/auth/pin-setup',
    pageComponent: 'PinSetupScreen',
    module: 'Auth',
    permission: 'guest',
    navigationLevel: 'root',
    ...noTopNav,
    primaryActions: ['Create optional local PIN after registration', 'Confirm local PIN', 'Unlock only after explicit local lock', 'Skip local PIN setup', 'Open from Me settings menu'],
    relatedModals: ['auth.errorDialog'],
    states: ['default', 'inputting', 'validating', 'success', 'failed', 'restricted', 'bypassed'],
    routePresentation: 'screen',
    riskLevel: 'high',
    permissionGap: 'PIN gate is optional by default and remains a local control; production device trust and re-auth policies are not connected.',
  },
  {
    path: '/auth/verify',
    pageComponent: 'VerifyDeprecatedScreen',
    module: 'Auth',
    permission: 'guest',
    navigationLevel: 'root',
    ...noTopNav,
    primaryActions: ['Redirect legacy verification entry to login'],
    relatedModals: [],
    states: ['redirecting', 'error'],
    routePresentation: 'redirect',
    riskLevel: 'low',
    routingReview: 'compatibility redirect retained for old deep links',
  },
  {
    path: '/(not-found)',
    pageComponent: 'NotFoundScreen',
    module: 'Navigation',
    permission: 'guest',
    navigationLevel: 'system',
    ...systemTopNav,
    primaryActions: ['Explain missing route', 'Return to app'],
    relatedModals: [],
    states: ['not_found'],
    routePresentation: 'notFound',
    riskLevel: 'low',
  },
] as const satisfies readonly RouteRegistryEntry[];

export type RoutePath = (typeof routeRegistry)[number]['path'];

export const routeRegistryPaths = routeRegistry.map((route) => route.path);

export const routeRegistryByPath = Object.fromEntries(
  routeRegistry.map((route) => [route.path, route]),
) as Record<RoutePath, (typeof routeRegistry)[number]>;
