import type { NavigationAction } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { useProductSettings } from '@/src/settings/ProductSettings';

import type { AppIconName } from './AppIcon';
import { GlobalDialog, type GlobalDialogAction } from './GlobalDialog';
import type { IconSurfaceTone } from './IconSurface';

export type OverlayRiskLevel = 'critical' | 'high' | 'low' | 'medium';
export type OverlayQueuePriority = 'blocking' | 'critical' | 'normal';
export type OverlayAlertTone = 'danger' | 'info' | 'success' | 'warning';

export type QueuedAlertPayload = {
  actions?: GlobalDialogAction[];
  body?: string;
  dedupeKey?: string;
  icon?: AppIconName;
  onDismiss?: () => void;
  priority?: OverlayQueuePriority;
  riskLevel?: OverlayRiskLevel;
  title: string;
  tone?: OverlayAlertTone;
};

type QueuedAlert = QueuedAlertPayload & {
  id: string;
};

type OverlayQueueContextValue = {
  clear: () => void;
  enqueueAlert: (payload: QueuedAlertPayload) => string;
  showAlert: (payload: QueuedAlertPayload) => string;
};

const OverlayQueueContext = createContext<OverlayQueueContextValue | null>(null);

let nextOverlayQueueId = 0;

export function OverlayQueueProvider({ children }: PropsWithChildren) {
  const { t } = useProductSettings();
  const [queue, setQueue] = useState<QueuedAlert[]>([]);
  const queueRef = useRef<QueuedAlert[]>([]);
  queueRef.current = queue;
  const activeAlert = queue[0] ?? null;

  const removeAlert = useCallback((id: string) => {
    setQueue((current) => current.filter((item) => item.id !== id));
  }, []);

  const enqueueAlert = useCallback((payload: QueuedAlertPayload) => {
    const id = `overlay-alert-${++nextOverlayQueueId}`;
    const nextAlert = { ...payload, id };

    setQueue((current) => {
      if (payload.dedupeKey && current.some((item) => item.dedupeKey === payload.dedupeKey)) {
        return current;
      }

      const nextQueue = [...current, nextAlert];
      return nextQueue.sort(compareAlertPriority);
    });

    return id;
  }, []);

  const clear = useCallback(() => {
    queueRef.current.forEach((item) => item.onDismiss?.());
    setQueue([]);
  }, []);

  const showAlert = enqueueAlert;
  const value = useMemo(() => ({ clear, enqueueAlert, showAlert }), [clear, enqueueAlert, showAlert]);
  const dismissActiveAlert = useCallback(() => {
    if (!activeAlert) {
      return;
    }

    activeAlert.onDismiss?.();
    removeAlert(activeAlert.id);
  }, [activeAlert, removeAlert]);

  return (
    <OverlayQueueContext.Provider value={value}>
      {children}
        <GlobalDialog
        accessibilityLabel={activeAlert ? [activeAlert.title, activeAlert.body].filter(Boolean).join(' ') : undefined}
        actions={resolveAlertActions(activeAlert, dismissActiveAlert, t('balance.detail.ok'))}
        body={activeAlert?.body}
        icon={activeAlert?.icon ?? iconForAlert(activeAlert?.tone, activeAlert?.riskLevel)}
        iconTone={iconToneForAlert(activeAlert?.tone, activeAlert?.riskLevel)}
        onRequestClose={dismissActiveAlert}
        open={Boolean(activeAlert)}
        title={activeAlert?.title}
      />
    </OverlayQueueContext.Provider>
  );
}

export function useOverlayQueue() {
  const context = useContext(OverlayQueueContext);

  if (!context) {
    throw new Error('useOverlayQueue must be used inside OverlayQueueProvider');
  }

  return context;
}

export function useDirtyStateGuard({
  body,
  confirmLabel,
  dirty,
  stayLabel,
  title,
}: {
  body: string;
  confirmLabel: string;
  dirty: boolean;
  stayLabel: string;
  title: string;
}) {
  const navigation = useNavigation();
  const overlayQueue = useOverlayQueue();
  const pendingActionRef = useRef<NavigationAction | null>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (!dirty) {
        return;
      }

      event.preventDefault();
      pendingActionRef.current = event.data.action;
      overlayQueue.enqueueAlert({
        actions: [
          {
            label: stayLabel,
            onPress: () => {
              pendingActionRef.current = null;
            },
            tone: 'brand',
            variant: 'filled',
          },
          {
            label: confirmLabel,
            onPress: () => {
              const pendingAction = pendingActionRef.current;
              pendingActionRef.current = null;

              if (pendingAction) {
                navigation.dispatch(pendingAction);
              }
            },
            tone: 'danger',
            variant: 'outline',
          },
        ],
        body,
        dedupeKey: 'dirty-state-exit',
        icon: 'icon.risk.info',
        priority: 'blocking',
        riskLevel: 'high',
        title,
        tone: 'warning',
      });
    });

    return unsubscribe;
  }, [body, confirmLabel, dirty, navigation, overlayQueue, stayLabel, title]);

  if (Platform.OS === 'web') {
    return;
  }
}

function resolveAlertActions(activeAlert: QueuedAlert | null, dismiss: () => void, defaultLabel: string): GlobalDialogAction[] {
  if (!activeAlert) {
    return [];
  }

  if (activeAlert.actions?.length) {
    return activeAlert.actions.map((action) => ({
      ...action,
      onPress: () => {
        action.onPress();
        dismiss();
      },
    }));
  }

  return [
    {
      label: defaultLabel,
      onPress: dismiss,
      tone: activeAlert.tone === 'danger' ? 'danger' : 'brand',
      variant: 'filled',
    },
  ];
}

function compareAlertPriority(a: QueuedAlert, b: QueuedAlert) {
  return priorityWeight(b.priority, b.riskLevel) - priorityWeight(a.priority, a.riskLevel);
}

function priorityWeight(priority?: OverlayQueuePriority, riskLevel?: OverlayRiskLevel) {
  if (priority === 'blocking' || riskLevel === 'critical') {
    return 3;
  }

  if (priority === 'critical' || riskLevel === 'high') {
    return 2;
  }

  return 1;
}

function iconForAlert(tone?: OverlayAlertTone, riskLevel?: OverlayRiskLevel): AppIconName {
  if (riskLevel === 'critical' || riskLevel === 'high' || tone === 'danger') {
    return 'icon.security.risk_shield';
  }

  if (tone === 'success') {
    return 'icon.status.verified';
  }

  if (tone === 'warning') {
    return 'icon.risk.info';
  }

  return 'icon.risk.info';
}

function iconToneForAlert(tone?: OverlayAlertTone, riskLevel?: OverlayRiskLevel): IconSurfaceTone {
  if (riskLevel === 'critical' || riskLevel === 'high' || tone === 'danger') {
    return 'danger';
  }

  if (tone === 'success') {
    return 'success';
  }

  if (tone === 'warning') {
    return 'warning';
  }

  return 'info';
}
