import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/src/design-public-assets/components';
import { Card } from '@/src/design-public-assets/components';
import { IconSurface } from '@/src/design-public-assets/components';
import { Screen } from '@/src/design-public-assets/components';
import { AppText } from '@/src/design-public-assets/components';
import { getDiscoverEntryById, type DiscoverEntryDefinition } from '@/src/domain/discoverEntries';
import { localizeText } from '@/src/domain/format';
import { useProductSettings } from '@/src/design-public-assets/copy';
import type { TranslationKey } from '@/src/design-public-assets/copy';
import { lineWidth, spacing } from '@/src/design-public-assets/tokens';

export default function DiscoverEntryScreen({ entryId }: { entryId?: string } = {}) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale, colors, t } = useProductSettings();
  const entry = getDiscoverEntryById(entryId ?? id ?? '');

  if (!entry) {
    return (
      <Screen back backHref="/discover" title={t('discover.entry.unavailableTitle')}>
        <Card>
          <AppText variant="subtitle">{t('discover.entry.unavailableSubtitle')}</AppText>
          <AppText tone="muted" variant="caption">
            {t('discover.entry.unavailableBody')}
          </AppText>
        </Card>
      </Screen>
    );
  }

  const details = getEntryDetails(entry, t);

  return (
    <Screen back backHref="/discover" title={localizeText(entry.title, locale)}>
      <Card highlight>
        <View style={styles.heroTop}>
          <IconSurface icon={entry.icon} sizeVariant="lg" tone={entry.iconTone} />
          <View style={styles.flex}>
            <View style={styles.titleRow}>
              <AppText numberOfLines={1} variant="subtitle">
                {localizeText(entry.title, locale)}
              </AppText>
            </View>
            <AppText numberOfLines={3} tone="muted" variant="caption">
              {localizeText(entry.subtitle, locale)}
            </AppText>
          </View>
        </View>
      </Card>

      <Card compact style={styles.detailCard}>
        {details.map((item, index) => (
          <View key={item.label} style={StyleSheet.flatten([styles.detailRow, index < details.length - 1 && { borderBottomColor: colors.border.subtle, borderBottomWidth: lineWidth.hairline }])}>
            <AppText tone="muted" variant="caption">
              {item.label}
            </AppText>
            <AppText numberOfLines={3} variant="body">
              {item.value}
            </AppText>
          </View>
        ))}
      </Card>

      <Card>
        <AppText variant="subtitle">{t('discover.entry.productionNoteTitle')}</AppText>
        <AppText tone="muted" variant="caption">
          {t('discover.entry.productionNoteBody')}
        </AppText>
        <ActionButton label={t('discover.entry.backToDiscover')} onPress={() => router.push('/discover' as never)} style={styles.action} tone="neutral" variant="outline" />
      </Card>
    </Screen>
  );
}

function getEntryDetails(entry: DiscoverEntryDefinition, t: (key: TranslationKey, params?: Record<string, string | number>) => string) {
  const common = [
    {
      label: t('discover.entry.hostTabLabel'),
      value: t('discover.entry.hostTabValue'),
    },
  ];

  const detailById: Partial<Record<string, TranslationKey>> = {
    academy: 'discover.entry.detail.academy',
    challenge: 'discover.entry.detail.challenge',
    community: 'discover.entry.detail.community',
    identity: 'discover.entry.detail.identity',
    referral: 'discover.entry.detail.referral',
    rewards: 'discover.entry.detail.rewards',
    risk: 'discover.entry.detail.risk',
    support: 'discover.entry.detail.support',
    videoVerify: 'discover.entry.detail.videoVerify',
  };
  const fallbackKey = detailById[entry.id];

  return [
    {
      label: t('discover.entry.purposeLabel'),
      value: fallbackKey ? t(fallbackKey) : localizeText(entry.subtitle, 'en-US'),
    },
    ...common,
  ];
}

const styles = StyleSheet.create({
  action: {
    marginTop: spacing.md,
  },
  detailCard: {
    gap: spacing.none,
    paddingVertical: spacing.none,
  },
  detailRow: {
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  heroTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
});
