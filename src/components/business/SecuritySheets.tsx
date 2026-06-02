import { StyleSheet, View } from 'react-native';

import {
  type SecurityDevice,
  type SecurityLoginEvent,
  type SecurityRiskLevel,
  type SecuritySession,
} from '@/src/domain/securityLoginLog';
import { useToast } from '@/src/feedback/Toast';
import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { layout, lineWidth, radius, size, spacing } from '@/src/theme/tokens';

import { ActionButton } from '../ActionButton';
import { AppIcon } from '../AppIcon';
import { NativePressable } from '../NativePressable';
import { StatusPill, type StatusPillTone } from '../StatusPill';
import { AppText } from '../Typography';

export type DeviceDetailSheetProps = {
  device: SecurityDevice;
  formatDate: (value: string) => string;
  onOpenConfirmReport: (event: SecurityLoginEvent) => void;
  onOpenConfirmRevoke: (session: SecuritySession) => void;
};

export function DeviceDetailSheet({
  device,
  formatDate,
  onOpenConfirmReport,
  onOpenConfirmRevoke,
}: DeviceDetailSheetProps) {
  const { colors, t } = useProductSettings();
  const toast = useToast();
  const riskyEvents = device.events.filter((event) => event.riskLevel !== 'low' && event.status !== 'resolved');
  const showPlaceholder = (title: string) => {
    void impactLight();
    toast.show({
      message: t('securityLog.toast.placeholderBody'),
      title,
    });
  };

  return (
    <View style={styles.sheetContent}>
      <View style={StyleSheet.flatten([styles.detailHeaderCard, { backgroundColor: colors.surface.panel }])}>
        <View style={styles.inlineRow}>
          <StatusPill compact label={t(`securityLog.risk.${device.riskLevel}`)} tone={riskTone(device.riskLevel)} />
          {device.isCurrentDevice ? <StatusPill compact label={t('securityLog.status.current')} tone="info" /> : null}
        </View>
        <AppText tone="muted" variant="caption">
          {device.os} · {device.locationLabel}
        </AppText>
        <AppText tone="dim" variant="caption">
          {t('securityLog.device.lastActive')}: {formatDate(device.lastActiveAt)}
        </AppText>
      </View>

      <View style={styles.sheetSection}>
        <AppText variant="subtitle">{t('securityLog.sessions.title')}</AppText>
        {device.sessions.map((session) => (
          <View key={session.sessionId} style={StyleSheet.flatten([styles.recordRow, { borderColor: colors.border.subtle }])}>
            <View style={styles.recordIcon}>
              <AppIcon name={session.status === 'revoked' ? 'icon.system.logout' : 'icon.security.lock'} sizeVariant="sm" />
            </View>
            <View style={styles.recordBody}>
              <View style={styles.inlineRow}>
                <AppText numberOfLines={1} variant="subtitle">
                  {session.appName}
                </AppText>
                <StatusPill compact label={t(`securityLog.session.${session.status}`)} tone={session.status === 'active' ? 'success' : 'neutral'} />
              </View>
              <AppText tone="muted" variant="caption">
                {session.ipHintMasked} · {formatDate(session.lastActiveAt)}
              </AppText>
              {session.isCurrentSession ? (
                <AppText tone="blue" variant="caption">
                  {t('securityLog.session.currentHelp')}
                </AppText>
              ) : null}
            </View>
            <NativePressable
              accessibilityLabel={t('securityLog.action.revokeShort')}
              accessibilityRole="button"
              accessibilityState={{ disabled: session.isCurrentSession || session.status === 'revoked' }}
              disabled={session.isCurrentSession || session.status === 'revoked'}
              minTouch={size.button.textMinTouch}
              onPress={() => onOpenConfirmRevoke(session)}
              style={styles.textAction}>
              <AppIcon name="icon.system.logout" sizeVariant="sm" tone={session.isCurrentSession || session.status === 'revoked' ? 'disabled' : 'danger'} />
              <AppText tone={session.isCurrentSession || session.status === 'revoked' ? 'disabled' : 'danger'} variant="subtitle">
                {t('securityLog.action.revokeShort')}
              </AppText>
            </NativePressable>
          </View>
        ))}
      </View>

      <View style={styles.sheetSection}>
        <AppText variant="subtitle">{t('securityLog.events.title')}</AppText>
        {device.events.map((event) => (
          <View key={event.eventId} style={StyleSheet.flatten([styles.recordRow, { borderColor: colors.border.subtle }])}>
            <View style={styles.recordIcon}>
              <AppIcon name={event.riskLevel === 'low' ? 'icon.trading.history' : 'icon.security.risk_shield'} sizeVariant="sm" tone={event.riskLevel === 'high' ? 'danger' : event.riskLevel === 'medium' ? 'amber' : undefined} />
            </View>
            <View style={styles.recordBody}>
              <View style={styles.inlineRow}>
                <AppText numberOfLines={1} variant="subtitle">
                  {t(event.descriptionKey as never)}
                </AppText>
                <StatusPill compact label={t(`securityLog.eventStatus.${event.status}`)} tone={event.status === 'reported' ? 'danger' : event.status === 'open' ? riskTone(event.riskLevel) : 'neutral'} />
              </View>
              <AppText tone="muted" variant="caption">
                {formatDate(event.createdAt)}
              </AppText>
            </View>
            {event.status === 'open' && event.riskLevel !== 'low' ? (
              <NativePressable
                accessibilityLabel={t('securityLog.action.reportShort')}
                accessibilityRole="button"
                minTouch={size.button.textMinTouch}
                onPress={() => onOpenConfirmReport(event)}
                style={styles.textAction}>
                <AppIcon name="icon.security.risk_shield" sizeVariant="sm" tone="danger" />
                <AppText tone="danger" variant="subtitle">
                  {t('securityLog.action.reportShort')}
                </AppText>
              </NativePressable>
            ) : null}
          </View>
        ))}
      </View>

      <View style={styles.sheetActions}>
        <ActionButton icon="icon.security.lock" label={t('securityLog.action.changePassword')} onPress={() => showPlaceholder(t('securityLog.action.changePassword'))} tone="blue" variant="outline" />
        <ActionButton icon="icon.security.key_access" label={t('securityLog.action.enablePin')} onPress={() => showPlaceholder(t('securityLog.action.enablePin'))} tone="brand" variant="outline" />
      </View>
      {riskyEvents.length > 0 ? (
        <AppText tone="danger" variant="caption">
          {t('securityLog.recoveryHint')}
        </AppText>
      ) : null}
    </View>
  );
}

function riskTone(riskLevel: SecurityRiskLevel): StatusPillTone {
  if (riskLevel === 'high') {
    return 'danger';
  }

  if (riskLevel === 'medium') {
    return 'warning';
  }

  return 'success';
}

const styles = StyleSheet.create({
  detailHeaderCard: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    gap: spacing.sm,
    padding: spacing.md,
  },
  inlineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  recordBody: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  recordIcon: {
    paddingTop: spacing.xs,
  },
  recordRow: {
    alignItems: 'flex-start',
    borderTopWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  sheetActions: {
    gap: spacing.sm,
  },
  sheetContent: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
  sheetSection: {
    gap: spacing.sm,
  },
  textAction: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
});
