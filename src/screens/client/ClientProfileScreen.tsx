import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { lineWidth } from '@/src/theme/tokens';
import { ActionButton } from '@/src/components/ActionButton';
import { Card } from '@/src/components/Card';
import { Metric } from '@/src/components/Metric';
import { Screen } from '@/src/components/Screen';
import { StatusPill } from '@/src/components/StatusPill';
import { AppText } from '@/src/components/Typography';
import { UpgradeChatCard } from '@/src/components/UpgradeChatCard';
import { formatMoney, formatVolumeMillions, localizeText, statusLabel } from '@/src/domain/format';
import { useToast } from '@/src/feedback/Toast';
import { notifySuccess } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';

export default function ClientProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { approveUpgradeRequest, getPartnerClientProfile, upgradeRequest } = useBroker();
  const { locale, t } = useProductSettings();
  const toast = useToast();
  const client = id ? getPartnerClientProfile(id) : undefined;

  if (!client) {
    return (
      <Screen back backHref="/trade" subtitle={t('notFound.title')} title={t('upgrade.clientProfile')}>
        <Card>
          <AppText tone="muted">{t('common.invalidInstrument')}</AppText>
        </Card>
      </Screen>
    );
  }

  const relatedRequest = upgradeRequest.applicantClientId === client.id ? upgradeRequest : undefined;
  const canApprove = client.upgradeStatus === 'pending';
  const approve = () => {
    approveUpgradeRequest(client.id);
    void notifySuccess();
    toast.show({ message: t('upgrade.approvedMessage', { name: client.name }), title: t('upgrade.approvedTitle'), tone: 'success' });
    router.replace('/trade');
  };

  return (
    <Screen
      back
      backHref="/trade"
      contentInsetBottom={canApprove ? 18 : 0}
      stickyFooter={
        canApprove ? <ActionButton accessibilityLabel={t('upgrade.approve')} label={t('upgrade.approve')} onPress={approve} tone="brand" /> : undefined
      }
      subtitle={`${client.country} · ${localizeText(client.lastActive, locale)}`}
      title={client.name}>
      <Card highlight>
        <View style={styles.profileTop}>
          <View style={styles.avatar}>
            <AppText variant="subtitle">{client.name.slice(0, 1)}</AppText>
          </View>
          <View style={styles.profileCopy}>
            <AppText variant="subtitle">{client.name}</AppText>
            <AppText tone="muted" variant="caption">
              {t('upgrade.currentRole')}: {client.role === 'partner' ? t('role.partner') : t('role.trader')}
            </AppText>
          </View>
          <StatusPill
            compact
            label={t(`upgrade.status.${client.upgradeStatus}`)}
            tone={client.upgradeStatus === 'approved' ? 'success' : client.upgradeStatus === 'pending' ? 'warning' : 'neutral'}
          />
        </View>
        <View style={styles.metricRow}>
          <Metric label={t('partner.netDeposit')} value={formatMoney(client.netDeposit, 'USD', 2, locale)} />
          <Metric label={t('partner.monthVolume')} value={formatVolumeMillions(client.monthlyVolume, locale)} />
          <Metric label={t('partner.openPositions')} value={`${client.openPositions}`} />
        </View>
      </Card>

      <Card>
        <View style={styles.metricRow}>
          <Metric label={t('status.active')} value={statusLabel(client.status, locale)} />
          <Metric label={t('upgrade.superior')} value={client.superiorName} />
        </View>
        <AppText tone="muted" variant="caption">
          {t('upgrade.profileHint')}
        </AppText>
      </Card>

      {relatedRequest ? <UpgradeChatCard readonly request={relatedRequest} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: lineWidth.hairline,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  profileCopy: {
    flex: 1,
    minWidth: 0,
  },
  profileTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
});
