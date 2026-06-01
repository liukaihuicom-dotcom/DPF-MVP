import { router, type Href } from 'expo-router';
import { Keyboard, Platform } from 'react-native';

export type TopNavBehavior = 'none' | 'back' | 'close' | 'system';
export type LeaveGuard = 'none' | 'confirm-leave';
export type ModalCloseBehavior = 'dismiss' | 'cancel' | 'back' | 'backOrFallback' | 'saveThenClose' | 'autoDismiss';
export type ScreenType =
  | 'root-tab'
  | 'stack-page'
  | 'step-flow'
  | 'critical-flow'
  | 'fullscreen-modal'
  | 'preview'
  | 'webview'
  | 'auth-reset'
  | 'success-terminal';
export type LeftAction = 'none' | 'back' | 'close' | 'cancel';
export type BackBehavior =
  | 'system-default'
  | 'pop-stack'
  | 'previous-step'
  | 'dismiss-overlay'
  | 'dismiss-modal'
  | 'dismiss-preview'
  | 'webview-go-back-first'
  | 'confirm-leave'
  | 'reset-stack'
  | 'controlled-exit';
export type GesturePolicy = 'enabled' | 'disabled' | 'guarded' | 'platform-default';
export type SourceFallback = 'previous-route' | 'route-param-return-to' | 'root-tab' | 'safe-list-page' | 'dashboard' | 'blocked';
export type Criticality = 'low' | 'medium' | 'high' | 'critical';
export type OverlayType =
  | 'dialog'
  | 'alert'
  | 'bottom-sheet'
  | 'action-sheet'
  | 'popover'
  | 'dropdown'
  | 'toast'
  | 'loading-blocker'
  | 'modal-page'
  | 'fullscreen-modal';

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

export type NavigationContract = {
  androidBackBehavior: BackBehavior;
  backBehavior: BackBehavior;
  criticality: Criticality;
  iosGesturePolicy: GesturePolicy;
  leftAction: LeftAction;
  preserveSourceState: boolean;
  requiresUnsavedGuard: boolean;
  routeName: string;
  screenType: ScreenType;
  sourceFallback: SourceFallback;
};

export type OverlayContract = {
  allowAndroidBackDismiss: boolean;
  allowBackdropDismiss: boolean;
  allowCancelAction: boolean;
  allowCloseAction: boolean;
  allowPanDownDismiss: boolean;
  androidBackBehavior: BackBehavior;
  criticality: Criticality;
  id: string;
  overlayType: OverlayType;
  requiresUnsavedGuard: boolean;
};

type IntentGuard = () => boolean | Promise<boolean>;

type GlobalBackIntent = {
  beforeBack?: IntentGuard;
  fallback?: NavigationTarget;
  onBack?: () => void;
};

type CloseIntent = {
  beforeClose?: IntentGuard;
  closeTarget?: NavigationTarget;
  fallback?: NavigationTarget;
  onClose?: () => void;
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

export async function handleGlobalBack({ beforeBack, fallback = safeRouteTargets.launch, onBack }: GlobalBackIntent = {}) {
  dismissActiveKeyboard();

  if (beforeBack && !(await beforeBack())) {
    return;
  }

  if (onBack) {
    onBack();
    return;
  }

  navigateBackOrReplace(fallback);
}

export async function handleCloseIntent({ beforeClose, closeTarget, fallback = safeRouteTargets.launch, onClose }: CloseIntent = {}) {
  dismissActiveKeyboard();

  if (beforeClose && !(await beforeClose())) {
    return;
  }

  if (onClose) {
    onClose();
    return;
  }

  navigateBackOrReplace(closeTarget ?? fallback);
}

export function handleCancelIntent(intent: CloseIntent = {}) {
  return handleCloseIntent(intent);
}

function dismissActiveKeyboard() {
  Keyboard.dismiss();

  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return;
  }

  const activeElement = document.activeElement;
  if (activeElement instanceof HTMLElement) {
    activeElement.blur();
  }
}
