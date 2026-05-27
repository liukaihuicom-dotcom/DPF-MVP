import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { lineWidth } from '@/src/theme/tokens';
import { Card } from '@/src/components/Card';
import { NativePressable } from '@/src/components/NativePressable';
import { AppIcon, type AppIconName, type IconTone } from '@/src/components/AppIcon';
import { Screen } from '@/src/components/Screen';
import { StatusPill } from '@/src/components/StatusPill';
import { AppText } from '@/src/components/Typography';
import type { DiscoverModuleId } from '@/src/domain/types';
import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { resolveThemeTone, type ThemeColors } from '@/src/theme/colors';

export default function PartnerToolsScreen() {
  const { colors, role, selectedDiscoverModuleId, setSelectedDiscoverModule, t } = useProductSettings();
  const tiles: DiscoverTile[] = [
    { group: 'growth', icon: 'icon.promotion.achievement', id: 'challenge', tone: 'amber' },
    { group: 'growth', icon: 'icon.education.academy', id: 'education', tone: 'brand' },
    { group: 'growth', icon: 'icon.copy.community', id: 'community', tone: 'textMuted' },
    { group: 'account', icon: 'icon.account.avatar', id: 'profile', tone: 'text' },
    { group: 'account', icon: 'icon.kyc.identity', id: 'onboarding', tone: 'down' },
    { group: 'account', icon: 'icon.ib.network', id: 'partner', tone: 'brand' },
    { group: 'trading', icon: 'icon.trading.market', id: 'markets', tone: 'up' },
    { group: 'trading', icon: 'icon.account.trading', id: 'accounts', tone: 'textMuted' },
    { group: 'service', icon: 'icon.support.headset', id: 'support', tone: 'textMuted' },
    { group: 'service', icon: 'icon.promotion.reward', id: 'rewards', tone: 'amber' },
  ];
  const selectedTile = tiles.find((tile) => tile.id === selectedDiscoverModuleId) ?? tiles[0];

  return (
    <Screen title={t('discover.title')}>
      <Card highlight>
        <View style={styles.menuHero}>
          <View style={styles.copyBlock}>
            <AppText tone="dim" variant="eyebrow">
              {t('discover.menuEyebrow')}
            </AppText>
            <AppText variant="subtitle">{t('discover.menuTitle')}</AppText>
            <AppText tone="muted" variant="caption">
              {t('discover.menuHint')}
            </AppText>
          </View>
          <StatusPill compact label={t(`discover.module.${selectedDiscoverModuleId}.short`)} tone="brand" />
        </View>
      </Card>

      <Card compact>
        <View style={styles.selectedSummary}>
          <View style={styles.copyBlock}>
            <AppText tone="dim" variant="eyebrow">
              {t('discover.statusEntry')}
            </AppText>
            <AppText variant="subtitle">{t(`discover.module.${selectedDiscoverModuleId}.title`)}</AppText>
            <AppText numberOfLines={2} tone="muted" variant="caption">
              {t('discover.selected')}
            </AppText>
          </View>
          <StatusPill icon={selectedTile.icon} label={t(`discover.module.${selectedDiscoverModuleId}.short`)} tone="brand" />
        </View>
      </Card>

      {role === 'partner' ? (
        <Card compact>
          <View style={styles.partnerShortcutGrid}>
            <NativePressable
              accessibilityRole="button"
              minTouch={72}
              onPress={() => router.push('/partner/client-orders' as never)}
              style={StyleSheet.flatten([styles.partnerShortcut, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
              <AppIcon name="icon.trading.order_ticket" sizeVariant="sm" tone="up" />
              <View style={styles.copyBlock}>
                <AppText variant="subtitle">{t('portfolio.partnerTitle')}</AppText>
                <AppText numberOfLines={2} tone="muted" variant="caption">
                  {t('portfolio.partnerSubtitle')}
                </AppText>
              </View>
            </NativePressable>
            <NativePressable
              accessibilityRole="button"
              minTouch={72}
              onPress={() => router.push('/partner/commission' as never)}
              style={StyleSheet.flatten([styles.partnerShortcut, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
              <AppIcon name="icon.wallet.balance" sizeVariant="sm" tone="tertiary" />
              <View style={styles.copyBlock}>
                <AppText variant="subtitle">{t('commission.title')}</AppText>
                <AppText numberOfLines={2} tone="muted" variant="caption">
                  {t('commission.subtitle')}
                </AppText>
              </View>
            </NativePressable>
          </View>
        </Card>
      ) : null}

      <View style={styles.sectionTitle}>
        <AppText variant="subtitle">{t('discover.functionCenter')}</AppText>
        <AppText tone="dim" variant="caption">
          {role === 'partner' ? t('role.partner') : t('role.trader')}
        </AppText>
      </View>

      {(['growth', 'account', 'trading', 'service'] as DiscoverTileGroup[]).map((group) => (
        <View key={group} style={styles.groupBlock}>
          <View style={styles.groupTitle}>
            <AppText tone="dim" variant="eyebrow">
              {t(`discover.group.${group}`)}
            </AppText>
          </View>
          <View style={styles.tileGrid}>
            {tiles
              .filter((tile) => tile.group === group)
              .map((tile) => (
                <DiscoverSelectableTile
                  key={tile.id}
                  onPress={() => {
                    setSelectedDiscoverModule(tile.id);
                    void impactLight();
                    router.replace('/quick' as never);
                  }}
                  selected={selectedDiscoverModuleId === tile.id}
                  tile={tile}
                />
              ))}
          </View>
        </View>
      ))}
    </Screen>
  );
}

type DiscoverTileGroup = 'growth' | 'account' | 'trading' | 'service';

type DiscoverTile = {
  group: DiscoverTileGroup;
  icon: AppIconName;
  id: DiscoverModuleId;
  tone: IconTone;
};

function DiscoverSelectableTile({ onPress, selected, tile }: { onPress: () => void; selected: boolean; tile: DiscoverTile }) {
  const { colors, t } = useProductSettings();
  const tileColor = resolvePaletteIconTone(colors, tile.tone);

  return (
    <NativePressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      minTouch={88}
      onPress={onPress}
      style={StyleSheet.flatten([
        styles.selectableTile,
        {
          backgroundColor: colors.surface.panel,
          borderColor: selected ? colors.text.primary : colors.border.subtle,
        },
      ])}>
      <View style={styles.tileHead}>
        <View
          style={StyleSheet.flatten([
            styles.tileIcon,
            {
              backgroundColor: `${tileColor}12`,
              borderColor: selected ? colors.text.primary : `${tileColor}55`,
            },
          ])}>
          <AppIcon name={tile.icon} sizeVariant="sm" tone={tile.tone} />
        </View>
        <View style={StyleSheet.flatten([styles.selectedDot, { backgroundColor: selected ? colors.text.primary : colors.border.subtle }])} />
      </View>
      <AppText numberOfLines={1} variant="subtitle">
        {t(`discover.module.${tile.id}.title`)}
      </AppText>
      <AppText numberOfLines={3} tone="muted" variant="caption">
        {t(`discover.module.${tile.id}.hint`)}
      </AppText>
    </NativePressable>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  copyBlock: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  tileHead: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tileIcon: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: lineWidth.hairline,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  selectableTile: {
    borderRadius: 12,
    borderWidth: lineWidth.selected,
    flexBasis: '30.5%',
    flexGrow: 1,
    gap: 8,
    minHeight: 118,
    minWidth: 104,
    padding: 10,
  },
  selectedDot: {
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  partnerShortcut: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: lineWidth.hairline,
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    minWidth: 152,
    padding: 12,
  },
  partnerShortcutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  selectedSummary: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  menuHero: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  groupBlock: {
    gap: 8,
  },
  groupTitle: {
    paddingLeft: 2,
  },
});

function resolvePaletteIconTone(colors: ThemeColors, tone: IconTone) {
  return resolveThemeTone(colors, tone);
}
