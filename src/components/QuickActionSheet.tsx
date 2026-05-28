import { useCallback, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { layout, radius, spacing } from '@/src/theme/tokens';
import { getFundingOperationHref } from '@/src/domain/funding';
import { useToast } from '@/src/feedback/Toast';
import { impactLight, notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';

import { NativePressable } from './NativePressable';
import { AppIcon, type AppIconName, type IconTone } from './AppIcon';
import { bottomSheetPresets, useBottomSheet } from './BottomSheet';
import { useOverlayQueue } from './OverlayQueue';
import { AppText } from './Typography';

type QuickActionSheetProps = {
  onClose: () => void;
  open: boolean;
};

export function QuickActionSheet({ onClose, open }: QuickActionSheetProps) {
  const bottomSheet = useBottomSheet();
  const ownsSheetRef = useRef(false);
  const handleDismiss = useCallback(() => {
    ownsSheetRef.current = false;
    onClose();
  }, [onClose]);
  const handleClose = useCallback(() => {
    bottomSheet.hide();
  }, [bottomSheet]);

  useEffect(() => {
    if (!open) {
      if (ownsSheetRef.current) {
        bottomSheet.hide();
      }
      return;
    }

    ownsSheetRef.current = true;
    bottomSheet.show(bottomSheetPresets.actionMenu({
      content: <QuickActionSheetContent onClose={handleClose} />,
      onDismiss: handleDismiss,
    }));
  }, [bottomSheet, handleClose, handleDismiss, open]);

  return null;
}

export function QuickActionSheetContent({ onClose }: { onClose: () => void }) {
  const { instruments, role, submitUpgradeRequest, upgradeRequest } = useBroker();
  const { authStatus, colors, t } = useProductSettings();
  const toast = useToast();
  const overlayQueue = useOverlayQueue();
  const anchor = instruments.find((instrument) => instrument.symbol === 'EUR/USD') ?? instruments[0];
  const requireSignedIn = () => {
    if (authStatus === 'signedIn') {
      return true;
    }

    void notifyWarning();
    toast.show({ message: t('auth.traderLocked'), title: t('auth.lockedToastTitle'), tone: 'warning' });
    router.push('/auth');
    onClose();
    return false;
  };
  const runPartnerFlow = () => {
    if (!requireSignedIn()) {
      return;
    }

    if (role === 'partner' || upgradeRequest.status === 'approved') {
      void impactLight();
      router.push('/partner-tools');
      onClose();
      return;
    }

    if (upgradeRequest.status === 'pending') {
      void notifyWarning();
      overlayQueue.enqueueAlert({
        body: t('upgrade.pendingHint'),
        dedupeKey: 'partner-upgrade-pending',
        icon: 'icon.risk.info',
        priority: 'critical',
        riskLevel: 'high',
        title: t('upgrade.status.pending'),
        tone: 'warning',
      });
      router.push('/accounts');
      onClose();
      return;
    }

    submitUpgradeRequest(t('upgrade.defaultReason'));
    void notifySuccess();
    overlayQueue.enqueueAlert({
      body: t('upgrade.pendingHint'),
      dedupeKey: 'partner-upgrade-submitted',
      icon: 'icon.ib.network',
      priority: 'critical',
      riskLevel: 'high',
      title: t('upgrade.submitted'),
      tone: 'success',
    });
    router.push('/accounts');
    onClose();
  };
  const partnerLabel =
    role === 'partner' || upgradeRequest.status === 'approved'
      ? t('control.simulator.action.partnerOpen')
      : upgradeRequest.status === 'pending'
        ? t('control.simulator.action.partnerStatus')
        : t('control.simulator.action.partnerApply');
  const actions: {
    icon: AppIconName;
    label: string;
    onPress: () => void;
    tone: IconTone;
  }[] = [
    {
      icon: 'icon.trading.order_ticket',
      label: t('quick.trade'),
      onPress: () => {
        if (requireSignedIn()) {
          router.push(`/order/${anchor.id}?direction=buy` as never);
          onClose();
        }
      },
      tone: 'up',
    },
    {
      icon: 'icon.trading.market',
      label: t('quick.markets'),
      onPress: () => {
        if (requireSignedIn()) {
          router.push('/markets');
          onClose();
        }
      },
      tone: 'brand',
    },
    {
      icon: 'icon.wallet.deposit',
      label: t('quick.deposit'),
      onPress: () => {
        if (requireSignedIn()) {
          router.push(getFundingOperationHref('deposit') as never);
          onClose();
        }
      },
      tone: 'blue',
    },
    {
      icon: 'icon.ib.network',
      label: partnerLabel,
      onPress: runPartnerFlow,
      tone: 'amber',
    },
    {
      icon: 'icon.copy.community',
      label: t('upgrade.applyShort'),
      onPress: () => {
        if (!requireSignedIn()) {
          return;
        }

        if (upgradeRequest.status === 'none' || upgradeRequest.status === 'rejected') {
          submitUpgradeRequest(t('upgrade.defaultReason'));
          overlayQueue.enqueueAlert({
            body: t('upgrade.pendingHint'),
            dedupeKey: 'partner-upgrade-submitted',
            icon: 'icon.ib.network',
            priority: 'critical',
            riskLevel: 'high',
            title: t('upgrade.submitted'),
            tone: 'success',
          });
        } else if (upgradeRequest.status === 'pending') {
          overlayQueue.enqueueAlert({
            body: t('upgrade.pendingHint'),
            dedupeKey: 'partner-upgrade-pending',
            icon: 'icon.risk.info',
            priority: 'critical',
            riskLevel: 'high',
            title: t('upgrade.status.pending'),
            tone: 'warning',
          });
        } else {
          overlayQueue.enqueueAlert({
            body: t('upgrade.approvedMessage', { name: upgradeRequest.applicantName }),
            dedupeKey: 'partner-upgrade-approved',
            icon: 'icon.status.verified',
            priority: 'critical',
            riskLevel: 'high',
            title: t('upgrade.status.approved'),
            tone: 'success',
          });
        }
        router.push('/accounts');
        onClose();
      },
      tone: 'blue',
    },
    {
      icon: 'icon.support.headset',
      label: t('quick.support'),
      onPress: () => {
        if (requireSignedIn()) {
          void impactLight();
          toast.show({ message: t('top.placeholderMessage'), title: t('top.placeholderTitle', { action: t('top.support') }) });
          onClose();
        }
      },
      tone: 'textMuted',
    },
  ];

  return (
    <View style={styles.content}>
      <View style={styles.sheetHead}>
        <AppText tone="dim" variant="eyebrow">
          {t('tabs.quick')}
        </AppText>
        <AppText variant="title.card">{t('quick.title')}</AppText>
      </View>
      <View style={styles.actionGrid}>
        {actions.map((action) => (
          <NativePressable
            accessibilityRole="button"
            key={action.label}
            minTouch={64}
            onPress={action.onPress}
            style={StyleSheet.flatten([styles.actionItem, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
            <View style={styles.actionIcon}>
              <AppIcon name={action.icon} sizeVariant="sm" tone={action.tone} />
            </View>
            <AppText numberOfLines={1} variant="caption">
              {action.label}
            </AppText>
          </NativePressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionIcon: {
    alignItems: 'center',
    height: layout.iconSurface.sm.container,
    justifyContent: 'center',
    width: layout.iconSurface.sm.container,
  },
  actionItem: {
    alignItems: 'center',
    borderRadius: radius.card,
    flexBasis: '30%',
    flexGrow: 1,
    gap: spacing.sm,
    minWidth: 88,
    padding: spacing.md,
  },
  content: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  sheetHead: {
    gap: spacing.xs,
  },
});
