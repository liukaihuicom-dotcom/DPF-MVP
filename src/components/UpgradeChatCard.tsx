import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { localizeText } from '@/src/domain/format';
import type { UpgradeRequest } from '@/src/domain/types';
import { useToast } from '@/src/feedback/Toast';
import { notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';
import { lineWidth, typography } from '@/src/theme/tokens';

import { ActionButton } from './ActionButton';
import { Card } from './Card';
import { NativePressable } from './NativePressable';
import { AppIcon } from './AppIcon';
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
  const toast = useToast();
  const activeRequest = request ?? upgradeRequest;
  const [reason, setReason] = useState(t('upgrade.defaultReason'));
  const pending = activeRequest.status === 'pending';
  const approved = activeRequest.status === 'approved';
  const chips = [t('upgrade.reason.community'), t('upgrade.reason.clients'), t('upgrade.reason.education')];

  const submit = () => {
    const trimmed = reason.trim();
    if (trimmed.length < 8) {
      void notifyWarning();
      toast.show({ message: t('upgrade.reasonError'), title: t('upgrade.submitBlocked'), tone: 'warning' });
      return;
    }

    submitUpgradeRequest(trimmed);
    void notifySuccess();
    toast.show({ message: t('upgrade.pendingHint'), title: t('upgrade.submitted'), tone: 'success' });
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
        <View style={StyleSheet.flatten([styles.waitingBox, { backgroundColor: `${colors.status.warning.fg}10`, borderColor: colors.status.warning.fg }])}>
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
    gap: 10,
    marginTop: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  headerCopy: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  messageBubble: {
    borderRadius: 14,
    borderWidth: lineWidth.hairline,
    gap: 4,
    maxWidth: '86%',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  messages: {
    gap: 8,
    marginTop: 12,
  },
  reasonChip: {
    borderRadius: 999,
    borderWidth: lineWidth.hairline,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  reasonInput: {
    ...typography.captionSm,
    minHeight: 54,
  },
  waitingBox: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    minHeight: 40,
    paddingHorizontal: 10,
  },
});
