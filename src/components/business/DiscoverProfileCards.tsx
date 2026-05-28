import { StyleSheet, View } from 'react-native';

import { formatMoney } from '@/src/domain/format';
import type { Locale } from '@/src/i18n/translations';
import { useThemeColors } from '@/src/settings/ProductSettings';
import type { ThemeColors } from '@/src/theme/colors';
import { lineWidth, layout, radius, size, spacing, typography } from '@/src/theme/tokens';

import { AppIcon, type AppIconName, type IconTone } from '../AppIcon';
import { Card } from '../Card';
import { IconSurface, type IconSurfaceTone } from '../IconSurface';
import { NativePressable } from '../NativePressable';
import { ProfileAvatar } from '../ProfileAvatar';
import { Sparkline } from '../Sparkline';
import { StatusPill } from '../StatusPill';
import { AppText } from '../Typography';

type ProfileListCardProps = {
  icon: AppIconName;
  iconTone: IconTone;
  subtitle?: string;
  title: string;
};

type PartnerPortalSummaryProps = {
  accountCurrency: string;
  colors?: ThemeColors;
  locale: Locale;
  rebateValue: number;
  title: string;
  totalLabel: string;
  trendLabel: string;
};

type RewardSummaryCardProps = {
  activeCampaignsLabel: string;
  title: string;
  totalLabel: string;
};

type RelationshipManagerCardProps = {
  accessibilityLabel: string;
  managerName: string;
  onPress: () => void;
  title: string;
};

type VerificationStatusCardProps = {
  subtitle: string;
  title: string;
};

export function VerificationStatusCard({ subtitle, title }: VerificationStatusCardProps) {
  return (
    <ProfileListCard
      icon="icon.status.verified"
      iconTone="brand"
      subtitle={subtitle}
      title={title}
    />
  );
}

export function PartnerPortalSummary({ accountCurrency, colors, locale, rebateValue, title, totalLabel, trendLabel }: PartnerPortalSummaryProps) {
  const resolvedColors = useThemeColors();

  return (
    <Card compact style={styles.partnerPortalCard}>
      <ProfileCardHeader icon="icon.ib.network" iconTone="blue" title={title} />
      <View style={styles.rebateDataBlock}>
        <AppText variant="body">{totalLabel}</AppText>
        <View style={styles.rebateAmountRow}>
          <AppText style={styles.rebateCurrency} variant="largeNumber">$</AppText>
          <AppText style={styles.rebateMajor} variant="largeNumber">
            {formatCompactProfileNumber(rebateValue)}
          </AppText>
          <AppText style={styles.rebateMinor} variant="number">.09</AppText>
        </View>
        <View style={styles.rebateMetaRow}>
          <AppText variant="number">{formatMoney(rebateValue, accountCurrency, 2, locale)}</AppText>
          <StatusPill appearance="filled" compact label={trendLabel} tone="success" />
        </View>
      </View>
      <View style={styles.trendLine}>
        <Sparkline color={(colors ?? resolvedColors).market.down.fg} edgeToEdge height={size.profile.listCardMinHeight} values={[2, 2.4, 3.2, 3, 4.6, 4.3, 3.4, 3.1, 4.2, 4, 4.4, 5.8, 6.5, 7.1]} width="100%" />
      </View>
    </Card>
  );
}

export function RewardSummaryCard({ activeCampaignsLabel, title, totalLabel }: RewardSummaryCardProps) {
  const colors = useThemeColors();

  return (
    <Card compact style={styles.profileCard}>
      <ProfileCardHeader icon="icon.promotion.reward" iconTone="amber" title={title} />
      <View style={StyleSheet.flatten([styles.profileDivider, { backgroundColor: colors.border.subtle }])} />
      <View style={styles.rewardProfileBody}>
        <View style={styles.flex}>
          <AppText variant="body">{totalLabel}</AppText>
          <View style={styles.rebateAmountRow}>
            <AppText style={styles.rebateCurrency} variant="largeNumber">$</AppText>
            <AppText style={styles.rebateMajor} variant="largeNumber">10</AppText>
            <AppText style={styles.rebateMinor} variant="number">.09</AppText>
          </View>
        </View>
        <GiftIllustration />
      </View>
      <View style={StyleSheet.flatten([styles.profileDivider, { backgroundColor: colors.border.subtle }])} />
      <AppText tone="muted" variant="body">{activeCampaignsLabel}</AppText>
    </Card>
  );
}

export function RelationshipManagerCard({ accessibilityLabel, managerName, onPress, title }: RelationshipManagerCardProps) {
  return (
    <Card compact style={styles.managerCard}>
      <ProfileAvatar id="alex" size={50} />
      <View style={styles.flex}>
        <AppText variant="body">{title}</AppText>
        <AppText variant="subtitle">{managerName}</AppText>
      </View>
      <NativePressable accessibilityLabel={accessibilityLabel} accessibilityRole="button" minTouch={layout.iconSurface.md.container} onPress={onPress} style={styles.managerChat}>
        <IconSurface icon="icon.notification.feedback" sizeVariant="md" styleVariant="fill" />
      </NativePressable>
    </Card>
  );
}

function ProfileListCard({ icon, iconTone, subtitle, title }: ProfileListCardProps) {
  return (
    <Card compact style={styles.profileListCard}>
      <IconSurface icon={icon} sizeVariant="md" tone={resolveDiscoverIconSurfaceTone(iconTone)} />
      <View style={styles.flex}>
        <AppText variant="subtitle">{title}</AppText>
        {subtitle ? (
          <AppText numberOfLines={1} tone="muted" variant="caption">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <AppIcon name="icon.system.chevron_right" size={layout.menuDisclosureIconSize} tone="tertiary" />
    </Card>
  );
}

function ProfileCardHeader({ icon, iconTone, title }: { icon: AppIconName; iconTone: IconTone; title: string }) {
  return (
    <View style={styles.profileCardHeader}>
      <IconSurface icon={icon} sizeVariant="md" tone={resolveDiscoverIconSurfaceTone(iconTone)} />
      <AppText style={styles.profileCardTitle} variant="subtitle">
        {title}
      </AppText>
      <AppIcon name="icon.system.chevron_right" size={layout.menuDisclosureIconSize} tone="tertiary" />
    </View>
  );
}

function GiftIllustration() {
  return (
    <View style={styles.giftScene}>
      <View style={StyleSheet.flatten([styles.coin, styles.coinOne])}>
        <AppText tone="amber" variant="eyebrow">$</AppText>
      </View>
      <View style={StyleSheet.flatten([styles.coin, styles.coinTwo])}>
        <AppText tone="amber" variant="eyebrow">$</AppText>
      </View>
      <View style={styles.giftBox}>
        <AppIcon name="icon.promotion.reward" sizeVariant="xl" />
      </View>
    </View>
  );
}

function formatCompactProfileNumber(value: number) {
  if (value >= 1000) {
    return `${Math.floor(value / 1000)}K`;
  }

  return String(Math.floor(value));
}

function resolveDiscoverIconSurfaceTone(tone: IconTone): IconSurfaceTone {
  if (tone === 'brand') return 'brand';
  if (tone === 'amber' || tone === 'warning') return 'warning';
  if (tone === 'danger' || tone === 'up') return 'danger';
  if (tone === 'blue' || tone === 'info') return 'info';
  if (tone === 'down' || tone === 'success') return 'success';
  return 'neutral';
}

const styles = StyleSheet.create({
  coin: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    height: spacing.xl - spacing.xxs,
    justifyContent: 'center',
    position: 'absolute',
    width: spacing.xl - spacing.xxs,
    zIndex: 2,
  },
  coinOne: {
    left: spacing.xs,
    top: typography.titleMd.lineHeight,
  },
  coinTwo: {
    left: typography.titleMd.lineHeight,
    top: size.control.lg - spacing.md + spacing.xxs,
  },
  flex: {
    flex: 1,
    gap: lineWidth.selected + lineWidth.strong,
    minWidth: 0,
  },
  giftBox: {
    alignItems: 'center',
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    height: size.icon.display + spacing.sm,
    justifyContent: 'center',
    marginLeft: size.control.xs,
    width: size.icon.display + spacing.lg + spacing.xxs,
  },
  giftScene: {
    height: size.icon.display + typography.bodyMd.lineHeight,
    justifyContent: 'center',
    position: 'relative',
    width: size.profile.rewardSceneWidth,
  },
  managerCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: layout.controlGap + spacing.xs,
    minHeight: size.profile.managerCardMinHeight,
  },
  managerChat: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerPortalCard: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  profileCard: {
    gap: layout.controlGap + spacing.xs,
  },
  profileCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: layout.controlGap + spacing.xs,
  },
  profileCardTitle: {
    flex: 1,
  },
  profileDivider: {
    height: lineWidth.hairline,
  },
  profileListCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: layout.controlGap + spacing.xs,
    minHeight: size.profile.listCardMinHeight,
  },
  rebateAmountRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  rebateCurrency: {
    ...typography.quote,
  },
  rebateDataBlock: {
    gap: spacing.xs,
  },
  rebateMajor: {
    ...typography.quoteLg,
  },
  rebateMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  rebateMinor: {
    ...typography.displayXl,
    marginBottom: spacing.xs,
  },
  rewardProfileBody: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: layout.controlGap + spacing.xs,
    justifyContent: 'space-between',
  },
  trendLine: {
    overflow: 'hidden',
    paddingTop: spacing.xs,
    width: '100%',
  },
});
