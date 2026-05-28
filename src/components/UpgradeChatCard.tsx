import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { localizeText } from '@/src/domain/format';
import type { UpgradeRequest } from '@/src/domain/types';
import { notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';
import { lineWidth, layout, radius, size, spacing, typography } from '@/src/theme/tokens';

import { ActionButton } from './ActionButton';
import { Card } from './Card';
import { NativePressable } from './NativePressable';
import { AppIcon } from './AppIcon';
import { useOverlayQueue } from './OverlayQueue';
import { StatusPill } from './StatusPill';
import { RichTextField } from './TextField';
import { AppText } from './Typography';

type UpgradeChatCardProps = {
  request?: UpgradeRequest;
  readonly?: boolean;
};

export function UpgradeChatCard({ request, readonly }: UpgradeChatCardProps) {
  const { submitUpgradeRequest, upgradeRequest } = useBroker();
  const { locale, colors, t } = useProductSettings();
  const overlayQueue = useOverlayQueue();
  const activeRequest = request ?? upgradeRequest;
  const [reason, setReason] = useState(t('upgrade.defaultReason'));
  const pending = activeRequest.status === 'pending';
  const approved = activeRequest.status === 'approved';
  const chips = [t('upgrade.reason.community'), t('upgrade.reason.clients'), t('upgrade.reason.education')];

  const submit = () => {
    const trimmed = reason.trim();
    if (trimmed.length < 8) {
      void notifyWarning();
      overlayQueue.enqueueAlert({
        body: t('upgrade.reasonError'),
        dedupeKey: 'partner-upgrade-reason-blocked',
        icon: 'icon.risk.info',
        priority: 'normal',
        riskLevel: 'medium',
        title: t('upgrade.submitBlocked'),
        tone: 'warning',
      });
      return;
    }

    submitUpgradeRequest(trimmed);
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
  };

  return (
    <Card>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <AppText tone="dim" variant="eyebrow">
            {t('upgrade.chatRequest')}
          </AppText>
          <AppText variant="subtitle">{t('upgrade.applyTitle')}</AppText>
          <AppText numberOfLines={2} tone="muted" variant="caption">
            {t('upgrade.superior')}: {activeRequest.superiorName}
          </AppText>
        </View>
        <StatusPill compact label={t(`upgrade.status.${activeRequest.status}`)} tone={approved ? 'success' : pending ? 'warning' : 'neutral'} />
      </View>

      <View style={styles.messages}>
        {activeRequest.messages.map((message) => {
          const trader = message.author === 'trader';
          return (
            <View
              key={message.id}
              style={StyleSheet.flatten([
                styles.messageBubble,
                {
                  alignSelf: trader ? 'flex-end' : 'flex-start',
                  backgroundColor: trader ? colors.text.primary : colors.surface.subtle,
                  borderColor: trader ? colors.text.primary : colors.border.subtle,
                },
              ])}>
              <AppText tone={trader ? 'panel' : 'default'} variant="caption">
                {localizeText(message.body, locale)}
              </AppText>
              <AppText tone={trader ? 'panelMuted' : 'dim'} variant="caption">
                {message.createdAt}
              </AppText>
            </View>
          );
        })}
      </View>

      {!readonly && !pending && !approved ? (
        <View style={styles.applyForm}>
          <View style={styles.chipRow}>
            {chips.map((chip) => (
              <NativePressable
                accessibilityRole="button"
                key={chip}
                minTouch={34}
                onPress={() => setReason(chip)}
                style={StyleSheet.flatten([styles.reasonChip, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
                <AppText numberOfLines={1} variant="caption">
                  {chip}
                </AppText>
              </NativePressable>
            ))}
          </View>
          <RichTextField
            icon="icon.notification.feedback"
            inputStyle={styles.reasonInput}
            label={t('upgrade.chatRequest')}
            onChangeText={setReason}
            placeholder={t('upgrade.reasonPlaceholder')}
            value={reason}
          />
          <ActionButton label={t('upgrade.submit')} onPress={submit} tone="brand" variant="filled" />
        </View>
      ) : null}

      {!readonly && pending ? (
        <View style={StyleSheet.flatten([styles.waitingBox, { backgroundColor: colors.status.warning.bg }])}>
          <AppIcon tone="amber" name="icon.trading.history" sizeVariant="xs" />
          <AppText tone="amber" variant="caption">
            {t('upgrade.pendingHint')}
          </AppText>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  applyForm: {
    gap: layout.controlGap,
    marginTop: layout.financialPattern.heroGap,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.controlGap,
  },
  headerCopy: {
    flex: 1,
    gap: layout.inlineGap,
    minWidth: 0,
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: layout.financialPattern.heroGap,
    justifyContent: 'space-between',
  },
  messageBubble: {
    borderRadius: radius.card,
    borderWidth: lineWidth.hairline,
    gap: layout.messageBubble.gap,
    maxWidth: layout.messageBubble.maxWidth,
    paddingHorizontal: layout.messageBubble.paddingX,
    paddingVertical: layout.messageBubble.paddingY,
  },
  messages: {
    gap: layout.controlGap,
    marginTop: layout.financialPattern.heroGap,
  },
  reasonChip: {
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    paddingHorizontal: layout.statusPill.paddingX,
    paddingVertical: layout.statusPill.paddingY,
  },
  reasonInput: {
    ...typography.captionSm,
    minHeight: size.input.largeContentMinHeight,
  },
  waitingBox: {
    alignItems: 'center',
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    flexDirection: 'row',
    gap: layout.controlGap,
    marginTop: layout.financialPattern.heroGap,
    minHeight: size.control.sm,
    paddingHorizontal: layout.cardPaddingX,
  },
});
