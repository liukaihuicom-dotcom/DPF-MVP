import { router, type Href } from 'expo-router';

export type TopNavBehavior = 'none' | 'back' | 'close' | 'system';
export type LeaveGuard = 'none' | 'confirm-leave';
export type ModalCloseBehavior = 'dismiss' | 'cancel' | 'back' | 'backOrFallback' | 'saveThenClose' | 'autoDismiss';

export type NavigationTarget = Extract<Href, string>;

export type PageNavigationPolicy = {
  topNavBehavior: TopNavBehavior;
  backTarget?: NavigationTarget;
  closeTarget?: NavigationTarget;
  leaveGuard?: LeaveGuard;
};

export type ModalNavigationPolicy = {
  modalCloseBehavior: ModalCloseBehavior;
  closeFallback?: NavigationTarget;
  confirmBehavior: 'none' | 'selectThenDismiss' | 'saveThenClose' | 'submitThenNavigate' | 'acknowledge' | 'mutateThenFeedback';
};

export const safeRouteTargets = {
  accounts: '/accounts',
  discover: '/discover',
  funding: '/funding',
  launch: '/launch',
  markets: '/markets',
  quick: '/quick',
  settings: '/settings',
  trade: '/trade',
} as const satisfies Record<string, NavigationTarget>;

export function navigateBackOrReplace(fallback: NavigationTarget) {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace(fallback as never);
}

export function navigateReplace(target: NavigationTarget) {
  router.replace(target as never);
}
