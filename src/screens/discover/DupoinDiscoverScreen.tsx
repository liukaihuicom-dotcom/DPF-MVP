import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppIcon, type AppIconName } from '@/src/design-public-assets/components';
import { IconSurface } from '@/src/design-public-assets/components';
import { NativePressable } from '@/src/design-public-assets/components';
import { Screen } from '@/src/design-public-assets/components';
import { AppText } from '@/src/design-public-assets/components';
import {
  discoverCampaignDefinitions,
  discoverEntryDefinitions,
  type DiscoverCampaignDefinition,
  type DiscoverEntryDefinition,
} from '@/src/domain/discoverEntries';
import { localizeText } from '@/src/domain/format';
import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { lineWidth, layout, radius, size, spacing } from '@/src/design-public-assets/tokens';

export default function DupoinDiscoverScreen() {
  const { role, t } = useProductSettings();
  const visibleEntries = discoverEntryDefinitions.filter((entry) => entry.roles.includes(role) || entry.roles.includes('guest'));
  const visibleCampaigns = discoverCampaignDefinitions.filter((campaign) => campaign.roles.includes(role) || campaign.roles.includes('guest')).slice(0, 5);

  return (
    <Screen title={t('tabs.discover')}>
      <View style={styles.entryList}>
        {visibleEntries.map((entry) => (
          <DiscoverEntryRow entry={entry} key={entry.id} />
        ))}
      </View>
      {visibleCampaigns.length ? <LatestCampaigns campaigns={visibleCampaigns} /> : null}
    </Screen>
  );
}

function LatestCampaigns({ campaigns }: { campaigns: DiscoverCampaignDefinition[] }) {
  const { locale, colors, setSelectedDiscoverModule, t } = useProductSettings();

  return (
    <View style={styles.campaignSection}>
      <ScrollView contentContainerStyle={styles.campaignRail} horizontal showsHorizontalScrollIndicator={false}>
        {campaigns.map((campaign) => (
          <NativePressable
            accessibilityHint={t('discover.campaigns.accessibilityHint')}
            accessibilityLabel={localizeText(campaign.title, locale)}
            key={campaign.id}
            minTouch={118}
            onPress={() => {
              setSelectedDiscoverModule(campaign.moduleId);
              void impactLight();
              router.replace('/quick' as never);
            }}
            style={StyleSheet.flatten([styles.campaignCard, { backgroundColor: colors.surface.panel }])}>
            <View style={styles.campaignCopy}>
              <View style={StyleSheet.flatten([styles.campaignBadge, { backgroundColor: colors.overlay.brand.subtle, borderColor: colors.overlay.brand.strong }])}>
                <AppText numberOfLines={1} tone="brand" variant="caption">
                  {localizeText(campaign.badge, locale)}
                </AppText>
              </View>
              <AppText numberOfLines={2} variant="subtitle">
                {localizeText(campaign.title, locale)}
              </AppText>
              <AppText numberOfLines={2} tone="muted" variant="caption">
                {localizeText(campaign.subtitle, locale)}
              </AppText>
            </View>
            <IconSurface icon={campaign.icon} sizeVariant="xl" tone={campaign.iconTone} />
          </NativePressable>
        ))}
      </ScrollView>
    </View>
  );
}

function DiscoverEntryRow({ entry }: { entry: DiscoverEntryDefinition }) {
  const { locale, colors, setSelectedDiscoverModule } = useProductSettings();

  return (
    <NativePressable
      accessibilityLabel={localizeText(entry.title, locale)}
      minTouch={68}
      onPress={() => {
        setSelectedDiscoverModule(entry.moduleId);
        void impactLight();
        router.replace('/quick' as never);
      }}
      style={StyleSheet.flatten([styles.entryRow, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
      <IconSurface icon={entry.icon} sizeVariant="md" tone={entry.iconTone} />
      <View style={styles.entryCopy}>
        <AppText numberOfLines={1} style={styles.entryTitle} variant="subtitle">
          {localizeText(entry.title, locale)}
        </AppText>
        <AppText numberOfLines={2} tone="muted" variant="body.secondary">
          {localizeText(entry.subtitle, locale)}
        </AppText>
      </View>
      <AppIcon name="icon.system.chevron_right" size={layout.menuDisclosureIconSize} tone="tertiary" />
    </NativePressable>
  );
}

const styles = StyleSheet.create({
  entryCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  entryList: {
    gap: spacing.md,
  },
  entryRow: {
    alignItems: 'center',
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 76,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  entryTitle: {
    flex: 1,
    minWidth: 0,
  },
  campaignBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    maxWidth: 112,
    minHeight: 26,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  campaignCard: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 142,
    overflow: 'hidden',
    paddingHorizontal: layout.cardPaddingX,
    paddingVertical: layout.cardPaddingY,
    width: size.discover.campaignCardWidth,
  },
  campaignCopy: {
    flex: 1,
    gap: spacing.sm,
    justifyContent: 'center',
    minWidth: 0,
  },
  campaignRail: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  campaignSection: {
    gap: spacing.md,
  },
});
