import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppIcon, type AppIconName, type IconTone } from '@/src/design-public-assets/components';
import { openConfirmSheet, openScrollableDetailSheet, useBottomSheet } from '@/src/design-public-assets/components';
import { DeviceDetailSheet } from '@/src/design-public-assets/business-components';
import { Card } from '@/src/design-public-assets/components';
import { ConfirmActionSheet } from '@/src/design-public-assets/components';
import { IconSurface, type IconSurfaceTone } from '@/src/design-public-assets/components';
import { NativePressable } from '@/src/design-public-assets/components';
import { useOverlayQueue } from '@/src/design-public-assets/components';
import { Screen } from '@/src/design-public-assets/components';
import { StatusPill, type StatusPillTone } from '@/src/design-public-assets/components';
import { AppText } from '@/src/design-public-assets/components';
import {
  buildSecurityLoginDevices,
  reportSecurityEvent,
  revokeSecuritySession,
  type SecurityDevice,
  type SecurityDeviceType,
  type SecurityLoginEvent,
  type SecurityRiskLevel,
  type SecuritySession,
} from '@/src/domain/securityLoginLog';
import { impactLight, notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { layout, lineWidth, radius, size, spacing } from '@/src/design-public-assets/tokens';

type SummaryMetric = {
  label: string;
  tone?: 'amber' | 'danger' | 'default';
  value: string;
};

export default function SecurityLoginLogScreen() {
  const { locale, colors, rememberedLoginSnapshot, t } = useProductSettings();
  const bottomSheet = useBottomSheet();
  const overlayQueue = useOverlayQueue();
  const [devices, setDevices] = useState(() => buildSecurityLoginDevices(rememberedLoginSnapshot));
  const activeDeviceCount = devices.filter((device) => device.sessions.some((session) => session.status === 'active')).length;
  const riskEventCount = devices.flatMap((device) => device.events).filter((event) => event.riskLevel !== 'low' && event.status !== 'resolved').length;
  const currentDevice = devices.find((device) => device.isCurrentDevice);
  const metrics: SummaryMetric[] = [
    { label: t('securityLog.summary.activeDevices'), value: String(activeDeviceCount) },
    { label: t('securityLog.summary.riskEvents'), tone: riskEventCount > 0 ? 'danger' : 'default', value: String(riskEventCount) },
    { label: t('securityLog.summary.currentDevice'), tone: 'amber', value: currentDevice?.deviceName ?? t('securityLog.device.unknown') },
  ];

  const updateDevices = (nextDevices: SecurityDevice[]) => {
    setDevices(nextDevices);
  };

  const openDevice = (device: SecurityDevice) => {
    openScrollableDetailSheet(
      bottomSheet,
      {
        content: (
          <DeviceDetailSheet
            device={device}
            formatDate={(value) => formatSecurityDate(value, locale)}
            onOpenConfirmReport={(event) => openReportConfirm(device, event)}
            onOpenConfirmRevoke={(session) => openRevokeConfirm(device, session)}
          />
        ),
        leftIcon: deviceIcon(device.deviceType),
        title: device.deviceName,
      },
    );
  };

  const openRevokeConfirm = (device: SecurityDevice, session: SecuritySession) => {
    openConfirmSheet(
      bottomSheet,
      {
        content: (
          <ConfirmActionSheet
            body={session.isCurrentSession ? t('securityLog.revoke.currentBlockedBody') : t('securityLog.revoke.confirmBody', { app: session.appName })}
            confirmTone="danger"
            icon="icon.system.logout"
            title={t('securityLog.revoke.confirmTitle')}
          />
        ),
        footer: [
          {
            label: t('securityLog.action.cancel'),
            onPress: () => {
              bottomSheet.back();
              return false;
            },
            tone: 'neutral',
            variant: 'outline',
          },
          {
            disabled: session.isCurrentSession || session.status === 'revoked',
            label: t('securityLog.action.revokeSession'),
            onPress: () => {
              const result = revokeSecuritySession(devices, session.sessionId);
              if (result.code !== 'ok') {
                void notifyWarning();
                overlayQueue.enqueueAlert({
                  body: t(`securityLog.error.${result.code}`),
                  dedupeKey: `security-revoke-blocked-${result.code}`,
                  icon: 'icon.status.rejected',
                  priority: 'critical',
                  riskLevel: 'high',
                  title: t('securityLog.toast.actionBlocked'),
                  tone: 'warning',
                });
                bottomSheet.back();
                return false;
              }

              updateDevices(result.devices);
              void notifySuccess();
              overlayQueue.enqueueAlert({
                body: t('securityLog.toast.revokeBody'),
                dedupeKey: `security-revoke-success-${session.sessionId}`,
                icon: 'icon.system.logout',
                priority: 'critical',
                riskLevel: 'high',
                title: t('securityLog.toast.revokeTitle'),
                tone: 'success',
              });
              openScrollableDetailSheet(
                bottomSheet,
                {
                  content: (
                    <DeviceDetailSheet
                      device={result.devices.find((item) => item.deviceId === device.deviceId) ?? device}
                      formatDate={(value) => formatSecurityDate(value, locale)}
                      onOpenConfirmReport={(event) => openReportConfirm(result.devices.find((item) => item.deviceId === device.deviceId) ?? device, event)}
                      onOpenConfirmRevoke={(nextSession) => openRevokeConfirm(result.devices.find((item) => item.deviceId === device.deviceId) ?? device, nextSession)}
                    />
                  ),
                  leftIcon: deviceIcon(device.deviceType),
                  title: device.deviceName,
                },
              );
              return false;
            },
            tone: 'danger',
            variant: 'filled',
          },
        ],
        leftIcon: 'icon.system.logout',
        title: t('securityLog.revoke.confirmTitle'),
      },
    );
  };

  const openReportConfirm = (device: SecurityDevice, event: SecurityLoginEvent) => {
    openConfirmSheet(
      bottomSheet,
      {
        content: (
          <ConfirmActionSheet
            body={t('securityLog.report.confirmBody', { device: device.deviceName })}
            confirmTone="danger"
            icon="icon.security.risk_shield"
            title={t('securityLog.report.confirmTitle')}
          />
        ),
        footer: [
          {
            label: t('securityLog.action.cancel'),
            onPress: () => {
              bottomSheet.back();
              return false;
            },
            tone: 'neutral',
            variant: 'outline',
          },
          {
            disabled: event.status === 'reported',
            label: t('securityLog.action.reportNotMe'),
            onPress: () => {
              const result = reportSecurityEvent(devices, event.eventId);
              if (result.code !== 'ok') {
                void notifyWarning();
                overlayQueue.enqueueAlert({
                  body: t(`securityLog.error.${result.code}`),
                  dedupeKey: `security-report-blocked-${result.code}`,
                  icon: 'icon.status.rejected',
                  priority: 'critical',
                  riskLevel: 'high',
                  title: t('securityLog.toast.actionBlocked'),
                  tone: 'warning',
                });
                bottomSheet.back();
                return false;
              }

              updateDevices(result.devices);
              void notifyWarning();
              overlayQueue.enqueueAlert({
                body: t('securityLog.toast.reportBody'),
                dedupeKey: `security-report-success-${event.eventId}`,
                icon: 'icon.security.risk_shield',
                priority: 'critical',
                riskLevel: 'high',
                title: t('securityLog.toast.reportTitle'),
                tone: 'warning',
              });
              bottomSheet.hide();
              return false;
            },
            tone: 'danger',
            variant: 'filled',
          },
        ],
        leftIcon: 'icon.security.risk_shield',
        title: t('securityLog.report.confirmTitle'),
      },
    );
  };

  return (
    <Screen align="center" back backHref="/settings" rightActions={[]} subtitle={t('securityLog.subtitle')} title={t('securityLog.title')}>
      <Card highlight>
        <View style={styles.summaryHeader}>
          <IconSurface icon="icon.security.risk_shield" sizeVariant="lg" tone="info" />
          <View style={styles.flex}>
            <AppText variant="subtitle">{t('securityLog.summary.title')}</AppText>
            <AppText tone="muted" variant="caption">
              {t('securityLog.summary.demoNotice')}
            </AppText>
          </View>
        </View>
        <View style={styles.summaryGrid}>
          {metrics.map((metric) => (
            <View key={metric.label} style={StyleSheet.flatten([styles.summaryMetric, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
              <AppText adjustsFontSizeToFit numberOfLines={1} tone={metric.tone ?? 'default'} variant="subtitle">
                {metric.value}
              </AppText>
              <AppText numberOfLines={2} tone="muted" variant="caption">
                {metric.label}
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <AppText variant="subtitle">{t('securityLog.devices.title')}</AppText>
        <AppText tone="muted" variant="caption">
          {t('securityLog.devices.subtitle')}
        </AppText>
      </View>

      {devices.map((device) => (
        <SecurityDeviceCard
          device={device}
          formatDate={(value) => formatSecurityDate(value, locale)}
          key={device.deviceId}
          onPress={() => {
            void impactLight();
            openDevice(device);
          }}
        />
      ))}
    </Screen>
  );
}

function SecurityDeviceCard({ device, formatDate, onPress }: { device: SecurityDevice; formatDate: (value: string) => string; onPress: () => void }) {
  const { colors, t } = useProductSettings();
  const activeSessions = device.sessions.filter((session) => session.status === 'active').length;

  return (
    <NativePressable
      accessibilityLabel={t('securityLog.device.open', { device: device.deviceName })}
      accessibilityRole="button"
      minTouch={96}
      onPress={onPress}
      style={StyleSheet.flatten([styles.deviceCard, { backgroundColor: colors.surface.panel }])}>
      <IconSurface icon={deviceIcon(device.deviceType)} sizeVariant="md" tone={resolveRiskIconSurfaceTone(device.riskLevel)} />
      <View style={styles.deviceBody}>
        <View style={styles.deviceTopRow}>
          <View style={styles.flex}>
            <View style={styles.inlineRow}>
              <AppText numberOfLines={1} variant="subtitle">
                {device.deviceName}
              </AppText>
              {device.isCurrentDevice ? <StatusPill compact label={t('securityLog.status.current')} tone="info" /> : null}
            </View>
            <AppText numberOfLines={1} tone="muted" variant="caption">
              {device.os} · {device.locationLabel}
            </AppText>
          </View>
          <StatusPill compact label={t(`securityLog.risk.${device.riskLevel}`)} tone={riskTone(device.riskLevel)} />
        </View>
        <View style={StyleSheet.flatten([styles.divider, { backgroundColor: colors.border.subtle }])} />
        <View style={styles.deviceMetaRow}>
          <AppText tone="muted" variant="caption">
            {t('securityLog.device.lastActive')}: {formatDate(device.lastActiveAt)}
          </AppText>
          <AppText tone="muted" variant="caption">
            {t('securityLog.device.sessions', { count: activeSessions })}
          </AppText>
        </View>
      </View>
      <AppIcon name="icon.system.chevron_right" size={layout.menuDisclosureIconSize} tone="tertiary" />
    </NativePressable>
  );
}

function deviceIcon(deviceType: SecurityDeviceType): AppIconName {
  if (deviceType === 'phone') {
    return 'icon.security.key_access';
  }

  if (deviceType === 'unknown') {
    return 'icon.security.risk_shield';
  }

  return 'icon.security.lock';
}

function resolveRiskIconSurfaceTone(riskLevel: SecurityRiskLevel): IconSurfaceTone {
  if (riskLevel === 'high') {
    return 'danger';
  }

  if (riskLevel === 'medium') {
    return 'warning';
  }

  return 'neutral';
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

function formatSecurityDate(value: string, locale: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  }).format(date);
}

const styles = StyleSheet.create({
  deviceBody: {
    flex: 1,
    gap: spacing.sm,
    minWidth: 0,
  },
  deviceCard: {
    alignItems: 'center',
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  deviceMetaRow: {
    gap: spacing.xs,
  },
  deviceTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  divider: {
    height: lineWidth.hairline,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  inlineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sectionHeader: {
    gap: spacing.xs,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  summaryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  summaryMetric: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    flex: 1,
    gap: spacing.xs,
    minHeight: size.control.lg + spacing.xl,
    padding: spacing.md,
  },
});
