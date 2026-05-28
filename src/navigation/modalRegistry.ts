import type { RelatedModalId, RiskLevel, RoutePath } from './routeRegistry';
import type { ModalCloseBehavior, ModalNavigationPolicy } from './navigationPolicy';

export type CloseBehavior =
  | 'autoDismiss'
  | 'back'
  | 'backOrFallback'
  | 'cancelOnly'
  | 'dismiss'
  | 'dismissOrSelect'
  | 'saveThenClose'
  | 'scrimOrCloseButton';

type BaseModalRegistryEntry = {
  id: RelatedModalId;
  modalComponent: string;
  triggerPages: readonly RoutePath[];
  triggerActions: readonly string[];
  modalCloseBehavior: ModalCloseBehavior;
  closeFallback?: string;
  confirmNavBehavior: ModalNavigationPolicy['confirmBehavior'];
  closeBehavior: string;
  confirmBehavior: string;
  riskLevel: RiskLevel;
};

type RouteableModalRegistryEntry = BaseModalRegistryEntry & {
  routeable: true;
  routePath: RoutePath;
  routingReason: string;
};

type NonRouteableModalRegistryEntry = BaseModalRegistryEntry & {
  routeable: false;
  routePath?: never;
  routingReason?: string;
};

export type ModalRegistryEntry = RouteableModalRegistryEntry | NonRouteableModalRegistryEntry;

export const modalRegistry = [
  {
    id: 'order.ticket.route',
    modalComponent: 'OrderTicketScreen',
    triggerPages: ['/instrument/[id]', '/markets', '/quick', '/discover', '/trade'],
    triggerActions: ['Tap buy/sell quote', 'Open challenge ticket', 'Open quick trade action'],
    modalCloseBehavior: 'backOrFallback',
    closeFallback: '/trade',
    confirmNavBehavior: 'submitThenNavigate',
    routeable: true,
    routePath: '/order/[id]',
    closeBehavior: 'Back to previous route, or replace with /trade when no history exists.',
    confirmBehavior: 'Validate lot, margin, side, and order type; submit local order; show success toast; replace to /trade.',
    riskLevel: 'high',
    routingReason: 'Trading ticket is a transaction flow that benefits from refresh recovery, deep links, and external task entry.',
  },
  {
    id: 'discover.layout.route',
    modalComponent: 'DiscoverLayoutScreen',
    triggerPages: ['/discover'],
    triggerActions: ['Open Discover layout settings'],
    modalCloseBehavior: 'backOrFallback',
    closeFallback: '/discover',
    confirmNavBehavior: 'saveThenClose',
    routeable: true,
    routePath: '/discover-layout',
    closeBehavior: 'Back to previous route, or replace with /discover when no history exists.',
    confirmBehavior: 'Persist local layout draft through ProductSettings and close the transparent modal route.',
    riskLevel: 'low',
    routingReason: 'Currently implemented as a route-backed configuration layer; consider demoting if deep link or recovery is not required.',
  },
  {
    id: 'auth.countryPicker',
    modalComponent: 'CountryPickerModal',
    triggerPages: ['/auth/register-phone', '/auth/forgot-password'],
    triggerActions: ['Tap country code selector'],
    modalCloseBehavior: 'dismiss',
    confirmNavBehavior: 'selectThenDismiss',
    routeable: false,
    closeBehavior: 'Dismiss through shared BottomSheet backdrop tap, pan-down gesture, or country selection without changing the selected country.',
    confirmBehavior: 'Select one country option, update the phone field, and close the sheet.',
    riskLevel: 'low',
  },
  {
    id: 'auth.contactConfirm',
    modalComponent: 'GlobalDialog + AuthContactConfirmDialog',
    triggerPages: ['/auth/register', '/auth/register-phone'],
    triggerActions: ['Continue after valid email or phone entry'],
    modalCloseBehavior: 'cancel',
    confirmNavBehavior: 'submitThenNavigate',
    routeable: false,
    closeBehavior: 'Cancel the GlobalDialog centered confirmation and return to the same form with current input preserved.',
    confirmBehavior: 'Confirm the visible contact target and navigate to the next code route.',
    riskLevel: 'medium',
  },
  {
    id: 'auth.leaveVerifiedStep',
    modalComponent: 'GlobalDialog + AuthLeaveVerifiedStepDialog',
    triggerPages: ['/auth/register-phone', '/auth/register-password'],
    triggerActions: ['Back from a verified registration step'],
    modalCloseBehavior: 'cancel',
    confirmNavBehavior: 'submitThenNavigate',
    routeable: false,
    closeBehavior: 'Cancel the GlobalDialog centered confirmation and stay on the current verified step.',
    confirmBehavior: 'Navigate back to the prior registration step and keep redirect context.',
    riskLevel: 'medium',
  },
  {
    id: 'auth.errorSheet',
    modalComponent: 'AuthErrorSheet',
    triggerPages: ['/auth', '/auth/register', '/auth/register-phone', '/auth/register-password', '/auth/forgot-password'],
    triggerActions: ['Submit invalid auth or reset form'],
    modalCloseBehavior: 'dismiss',
    confirmNavBehavior: 'acknowledge',
    routeable: false,
    closeBehavior: 'Dismiss sheet with Got it or sheet dismissal.',
    confirmBehavior: 'Acknowledge validation failure; no route change.',
    riskLevel: 'medium',
  },
  {
    id: 'auth.errorDialog',
    modalComponent: 'GlobalDialog + AuthErrorDialog',
    triggerPages: ['/auth/pin-setup'],
    triggerActions: ['Enter mismatched PIN confirmation or wrong unlock PIN'],
    modalCloseBehavior: 'dismiss',
    confirmNavBehavior: 'acknowledge',
    routeable: false,
    closeBehavior: 'Dismiss the GlobalDialog centered error feedback and keep the user on PIN entry.',
    confirmBehavior: 'Acknowledge error and reset the current PIN input.',
    riskLevel: 'high',
  },
  {
    id: 'global.bottomSheet',
    modalComponent: 'GlobalBottomSheetHost',
    triggerPages: ['/accounts', '/account', '/trade', '/portfolio', '/funding', '/settings/security-log'],
    triggerActions: ['Open registered bottom sheet preset from a page-level action'],
    modalCloseBehavior: 'dismiss',
    confirmNavBehavior: 'mutateThenFeedback',
    routeable: false,
    closeBehavior: 'Dismiss current sheet through shared backdrop tap, pan-down gesture, or nested back to the previous sheet; page bottom sheets must call GlobalBottomSheetHost through bottomSheetPresets.',
    confirmBehavior: 'Run the sheet-specific action supplied by the triggering page.',
    riskLevel: 'medium',
  },
  {
    id: 'global.toastFeedback',
    modalComponent: 'ToastProvider',
    triggerPages: [
      '/launch',
      '/markets',
      '/trade',
      '/portfolio',
      '/accounts',
      '/account',
      '/quick',
      '/instrument/[id]',
      '/order/[id]',
      '/client/[id]',
      '/funding',
      '/funding/deposit',
      '/funding/withdrawal',
      '/funding/transfer',
      '/settings/security-log',
      '/auth',
      '/auth/register-email-code',
      '/auth/register-phone-code',
      '/auth/forgot-password',
    ],
    triggerActions: ['Show success, warning, blocked, placeholder, or demo-only feedback'],
    modalCloseBehavior: 'autoDismiss',
    confirmNavBehavior: 'none',
    routeable: false,
    closeBehavior: 'Auto-dismiss after duration or replace with next toast.',
    confirmBehavior: 'No confirm action; feedback only.',
    riskLevel: 'low',
  },
  {
    id: 'global.webSelectMenu',
    modalComponent: 'TextField web select Modal',
    triggerPages: ['/markets', '/quick'],
    triggerActions: ['Open web select field menu'],
    modalCloseBehavior: 'dismiss',
    confirmNavBehavior: 'selectThenDismiss',
    routeable: false,
    closeBehavior: 'Non-sheet exception: click outside or request close hides the web select menu.',
    confirmBehavior: 'Select an option, update field value, and close the menu.',
    riskLevel: 'low',
  },
  {
    id: 'quick.actionSheet',
    modalComponent: 'GlobalBottomSheetHost + bottomSheetPresets.actionMenu + QuickActionSheetContent',
    triggerPages: ['/quick'],
    triggerActions: ['Open quick action menu'],
    modalCloseBehavior: 'dismiss',
    confirmNavBehavior: 'submitThenNavigate',
    routeable: false,
    closeBehavior: 'Dismiss through shared BottomSheet backdrop tap, pan-down gesture, or action completion.',
    confirmBehavior: 'Run selected action; may navigate to order, markets, funding, partner tools, or accounts.',
    riskLevel: 'medium',
  },
  {
    id: 'tradingAccount.switchSheet',
    modalComponent: 'TradingAccountSwitchSheet',
    triggerPages: ['/markets', '/trade', '/portfolio', '/funding/deposit', '/funding/withdrawal', '/funding/transfer'],
    triggerActions: ['Tap account selector or source/target account field'],
    modalCloseBehavior: 'dismiss',
    confirmNavBehavior: 'selectThenDismiss',
    routeable: false,
    closeBehavior: 'Dismiss without changing account selection.',
    confirmBehavior: 'Select an eligible account, update local selection, and close.',
    riskLevel: 'medium',
  },
  {
    id: 'funding.paymentMethodSheet',
    modalComponent: 'PaymentMethodSheet',
    triggerPages: ['/funding/deposit', '/funding/withdrawal'],
    triggerActions: ['Tap payment channel or payout method field'],
    modalCloseBehavior: 'dismiss',
    confirmNavBehavior: 'selectThenDismiss',
    routeable: false,
    closeBehavior: 'Dismiss without changing method.',
    confirmBehavior: 'Select available method, update form state, and close.',
    riskLevel: 'high',
  },
  {
    id: 'funding.submitFeedbackToast',
    modalComponent: 'ToastProvider',
    triggerPages: ['/funding/deposit', '/funding/withdrawal', '/funding/transfer'],
    triggerActions: ['Submit funding form'],
    modalCloseBehavior: 'autoDismiss',
    confirmNavBehavior: 'none',
    routeable: false,
    closeBehavior: 'Auto-dismiss after showing submitted reference.',
    confirmBehavior: 'No confirm action; submit handler navigates to funding transaction detail.',
    riskLevel: 'high',
  },
  {
    id: 'security.deviceDetailSheet',
    modalComponent: 'DeviceDetailSheet',
    triggerPages: ['/settings/security-log'],
    triggerActions: ['Tap a remembered device card'],
    modalCloseBehavior: 'dismiss',
    confirmNavBehavior: 'none',
    routeable: false,
    closeBehavior: 'Dismiss device detail or back out of nested confirmation sheet.',
    confirmBehavior: 'No direct confirmation; exposes revoke/report actions.',
    riskLevel: 'medium',
  },
  {
    id: 'security.revokeConfirmSheet',
    modalComponent: 'ConfirmActionSheet',
    triggerPages: ['/settings/security-log'],
    triggerActions: ['Tap revoke session in device detail'],
    modalCloseBehavior: 'cancel',
    confirmNavBehavior: 'mutateThenFeedback',
    routeable: false,
    closeBehavior: 'Cancel returns to device detail sheet.',
    confirmBehavior: 'Attempt local session revoke; show blocked or success toast; refresh device detail.',
    riskLevel: 'high',
  },
  {
    id: 'security.reportConfirmSheet',
    modalComponent: 'ConfirmActionSheet',
    triggerPages: ['/settings/security-log'],
    triggerActions: ['Tap report suspicious event in device detail'],
    modalCloseBehavior: 'cancel',
    confirmNavBehavior: 'mutateThenFeedback',
    routeable: false,
    closeBehavior: 'Cancel returns to device detail sheet.',
    confirmBehavior: 'Attempt local risk event report; show blocked or warning toast; close sheet stack.',
    riskLevel: 'high',
  },
  {
    id: 'portfolio.accountMenuSheet',
    modalComponent: 'AccountMenuSheet',
    triggerPages: ['/trade', '/portfolio'],
    triggerActions: ['Tap account menu button in portfolio header'],
    modalCloseBehavior: 'dismiss',
    confirmNavBehavior: 'submitThenNavigate',
    routeable: false,
    closeBehavior: 'Dismiss account menu sheet.',
    confirmBehavior: 'Navigate to selected account detail, balance, or basic info route.',
    riskLevel: 'medium',
  },
  {
    id: 'portfolio.positionDetailSheet',
    modalComponent: 'PositionDetailSheet',
    triggerPages: ['/trade', '/portfolio'],
    triggerActions: ['Tap an open position row'],
    modalCloseBehavior: 'dismiss',
    confirmNavBehavior: 'mutateThenFeedback',
    routeable: false,
    closeBehavior: 'Dismiss detail sheet without changing the position.',
    confirmBehavior: 'Footer action may open local close confirmation or demo modify feedback.',
    riskLevel: 'high',
  },
  {
    id: 'portfolio.pendingOrderDetailSheet',
    modalComponent: 'PendingOrderDetailSheet',
    triggerPages: ['/trade', '/portfolio'],
    triggerActions: ['Tap a pending order row'],
    modalCloseBehavior: 'dismiss',
    confirmNavBehavior: 'mutateThenFeedback',
    routeable: false,
    closeBehavior: 'Dismiss detail sheet without changing the order.',
    confirmBehavior: 'Footer action may modify or delete a pending order in local state.',
    riskLevel: 'high',
  },
  {
    id: 'portfolio.closePositionConfirm',
    modalComponent: 'ConfirmActionSheet',
    triggerPages: ['/trade', '/portfolio'],
    triggerActions: ['Tap close position from position detail'],
    modalCloseBehavior: 'cancel',
    confirmNavBehavior: 'mutateThenFeedback',
    routeable: false,
    closeBehavior: 'Cancel returns to the position detail sheet and leaves the position open.',
    confirmBehavior: 'Close the local position, dismiss the sheet stack, and show success toast.',
    riskLevel: 'high',
  },
  {
    id: 'portfolio.pendingOrderFeedbackToast',
    modalComponent: 'ToastProvider',
    triggerPages: ['/trade', '/portfolio'],
    triggerActions: ['Modify or delete a pending order'],
    modalCloseBehavior: 'autoDismiss',
    confirmNavBehavior: 'none',
    routeable: false,
    closeBehavior: 'Auto-dismiss feedback toast.',
    confirmBehavior: 'No extra confirm; action mutates local demo order state.',
    riskLevel: 'medium',
  },
  {
    id: 'account.moreActionSheet',
    modalComponent: 'AccountMoreSheet',
    triggerPages: ['/account-details/[id]'],
    triggerActions: ['Tap more action in account detail'],
    modalCloseBehavior: 'dismiss',
    confirmNavBehavior: 'mutateThenFeedback',
    routeable: false,
    closeBehavior: 'Dismiss action menu.',
    confirmBehavior: 'Run selected demo-only action and show toast.',
    riskLevel: 'medium',
  },
  {
    id: 'account.metricDescriptionSheet',
    modalComponent: 'MetricDescriptionSheet',
    triggerPages: ['/accounts', '/account', '/account-basic/[id]'],
    triggerActions: ['Tap an explainable metric label'],
    modalCloseBehavior: 'dismiss',
    confirmNavBehavior: 'none',
    routeable: false,
    closeBehavior: 'Dismiss descriptive sheet.',
    confirmBehavior: 'No confirm action; informational only.',
    riskLevel: 'low',
  },
  {
    id: 'account.balanceTransactionDetailSheet',
    modalComponent: 'TransactionDetailSheet',
    triggerPages: ['/account-balance/[id]'],
    triggerActions: ['Tap a balance transaction row'],
    modalCloseBehavior: 'dismiss',
    confirmNavBehavior: 'acknowledge',
    routeable: false,
    closeBehavior: 'Tap OK or dismiss sheet.',
    confirmBehavior: 'Acknowledge transaction details; no ledger mutation.',
    riskLevel: 'medium',
  },
] as const satisfies readonly ModalRegistryEntry[];

export type ModalId = (typeof modalRegistry)[number]['id'];

export const modalRegistryIds = modalRegistry.map((modal) => modal.id);

export const modalRegistryById = Object.fromEntries(
  modalRegistry.map((modal) => [modal.id, modal]),
) as Record<ModalId, (typeof modalRegistry)[number]>;
