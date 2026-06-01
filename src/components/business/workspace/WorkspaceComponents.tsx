import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/src/components/ActionButton';
import { AppIcon, type AppIconName, type IconTone } from '@/src/components/AppIcon';
import { Card } from '@/src/components/Card';
import { HeaderIconButton } from '@/src/components/HeaderIconButton';
import { IconSurface, type IconSurfaceTone } from '@/src/components/IconSurface';
import { NativePressable } from '@/src/components/NativePressable';
import { StatusPill, type StatusPillTone } from '@/src/components/StatusPill';
import { AppText, type AppTextTone } from '@/src/components/Typography';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { lineWidth, layout, radius, size, spacing } from '@/src/design-public-assets/tokens';
import type {
  WorkspaceAction,
  WorkspaceMarket,
  WorkspaceMetric,
  WorkspaceTone,
  WorkspaceViewModel,
} from '@/src/domain/workspace';

export function WorkspaceHeader({ viewModel }: { viewModel: WorkspaceViewModel }) {
  const { colors, t } = useProductSettings();

  return (
    <View style={StyleSheet.flatten([styles.header, { backgroundColor: colors.surface.canvas }])}>
      <View style={styles.headerCopy}>
        <AppText tone="dim" variant="eyebrow">
          Dupoin
        </AppText>
        <View style={styles.headerTitleRow}>
          <AppText numberOfLines={1} variant="title.page">
            {t('tabs.workspace')}
          </AppText>
          <ModeStatusBadge label={t(viewModel.header.modeKey)} tone={viewModel.segment === 'partner_mode' ? 'brand' : 'neutral'} />
        </View>
        <AppText numberOfLines={1} tone="muted" variant="caption">
          {t(viewModel.header.statusKey)}
        </AppText>
      </View>
      <View style={styles.headerActions}>
        <HeaderIconButton accessibilityLabel={t('top.notifications')} icon="icon.notification.bell" onPress={() => router.push(viewModel.assist.route as never)} variant="ghost" />
        <HeaderIconButton accessibilityLabel={t('tabs.profile')} icon="icon.account.avatar" onPress={() => router.push('/settings' as never)} variant="ghost" />
      </View>
    </View>
  );
}

export function ModeStatusBadge({ label, tone }: { label: string; tone: StatusPillTone }) {
  return <StatusPill compact label={label} tone={tone} />;
}

export function WorkspaceSummaryCard({ viewModel }: { viewModel: WorkspaceViewModel }) {
  const { t } = useProductSettings();

  return (
    <Card>
      <View style={styles.summaryHead}>
        <View style={styles.summaryIconBlock}>
          <IconSurface icon={getSegmentIcon(viewModel.segment)} sizeVariant="lg" tone={getSegmentIconTone(viewModel.segment)} />
        </View>
        <View style={styles.summaryCopy}>
          <AppText variant="subtitle">{t(viewModel.primary.titleKey)}</AppText>
          <AppText numberOfLines={3} tone="muted" variant="body.secondary">
            {t(viewModel.primary.bodyKey)}
          </AppText>
        </View>
      </View>
      <View style={styles.summaryFooter}>
        <StatusPill compact label={t(viewModel.primary.badgeKey)} tone={toStatusPillTone(viewModel.primary.badgeTone)} />
        <NativePressable accessibilityRole="button" minTouch={layout.touchTargetMin} onPress={() => router.push(viewModel.assist.route as never)} style={styles.askInline}>
          <AppIcon name="icon.support.help_center" sizeVariant="xs" tone="tertiary" />
          <AppText tone="muted" variant="caption">
            {t(viewModel.assist.promptKey)}
          </AppText>
        </NativePressable>
      </View>
    </Card>
  );
}

export function StatusMetricTile({ metric }: { metric: WorkspaceMetric }) {
  const { colors, t } = useProductSettings();
  const value = metric.value ?? (metric.valueKey ? t(metric.valueKey) : '');

  return (
    <View style={StyleSheet.flatten([styles.metricTile, { backgroundColor: colors.surface.panel }])}>
      <AppText numberOfLines={1} tone="dim" variant="caption">
        {t(metric.labelKey)}
      </AppText>
      <AppText numberOfLines={1} tone={toTextTone(metric.tone)} variant="number">
        {value}
      </AppText>
      {metric.caption ? (
        <AppText numberOfLines={1} tone="muted" variant="caption">
          {metric.caption}
        </AppText>
      ) : null}
    </View>
  );
}

export function PriorityFocusCard({ viewModel }: { viewModel: WorkspaceViewModel }) {
  const { t } = useProductSettings();

  return (
    <Card>
      <View style={styles.focusContent}>
        <View style={styles.focusCopy}>
          <AppText tone="dim" variant="eyebrow">
            {t('workspace.section.priority')}
          </AppText>
          <AppText variant="subtitle">{t(viewModel.primary.titleKey)}</AppText>
          <AppText numberOfLines={4} tone="muted" variant="body.secondary">
            {t(viewModel.primary.bodyKey)}
          </AppText>
        </View>
        <ActionButton label={t(viewModel.primary.ctaKey)} onPress={() => router.push(viewModel.primary.route as never)} tone="neutral" variant="outline" />
      </View>
    </Card>
  );
}

export function CompactActionRow({ action }: { action: WorkspaceAction }) {
  const { colors, t } = useProductSettings();

  return (
    <NativePressable
      accessibilityLabel={t(action.labelKey)}
      accessibilityRole="button"
      minTouch={layout.menuRowMinTouch}
      onPress={() => router.push(action.route as never)}
      style={StyleSheet.flatten([styles.actionRow, { backgroundColor: colors.surface.panel }])}>
      <IconSurface icon={action.icon} sizeVariant="sm" tone={toIconSurfaceTone(action.tone)} />
      <View style={styles.actionCopy}>
        <AppText numberOfLines={1} variant="body">
          {t(action.labelKey)}
        </AppText>
        <AppText numberOfLines={2} tone="muted" variant="caption">
          {t(action.descriptionKey)}
        </AppText>
      </View>
      <AppIcon name="icon.system.chevron_right" size={layout.menuDisclosureIconSize} tone="tertiary" />
    </NativePressable>
  );
}

export function MarketMiniCard({ market }: { market: WorkspaceMarket }) {
  const { colors } = useProductSettings();

  return (
    <View style={StyleSheet.flatten([styles.marketCard, { backgroundColor: colors.surface.panel }])}>
      <AppText numberOfLines={1} variant="subtitle">
        {market.symbol}
      </AppText>
      <AppText numberOfLines={1} tone="muted" variant="caption">
        {market.price}
      </AppText>
      <AppText numberOfLines={1} tone={market.tone === 'muted' ? 'muted' : market.tone} variant="caption">
        {market.change}
      </AppText>
    </View>
  );
}

export function PartnerMetricCard() {
  const { t } = useProductSettings();

  return (
    <Card compact>
      <View style={styles.partnerMetrics}>
        <PartnerMetricItem label={t('workspace.partner.conversion')} value="32%" />
        <PartnerMetricItem label={t('workspace.partner.activeClients')} value="12" />
        <PartnerMetricItem label={t('workspace.partner.activeSubPartners')} value="7" />
      </View>
    </Card>
  );
}

export function ModeSwitchEntry({ action, onPress }: { action: WorkspaceAction; onPress: () => void }) {
  const { colors, t } = useProductSettings();

  return (
    <NativePressable
      accessibilityLabel={t(action.labelKey)}
      accessibilityRole="button"
      minTouch={layout.menuRowMinTouch}
      onPress={onPress}
      style={StyleSheet.flatten([styles.modeSwitch, { backgroundColor: colors.surface.subtle }])}>
      <IconSurface icon={action.icon} sizeVariant="sm" tone="info" />
      <View style={styles.actionCopy}>
        <AppText variant="body">{t(action.labelKey)}</AppText>
        <AppText numberOfLines={2} tone="muted" variant="caption">
          {t(action.descriptionKey)}
        </AppText>
      </View>
      <AppIcon name="icon.system.chevron_right" size={layout.menuDisclosureIconSize} tone="tertiary" />
    </NativePressable>
  );
}

export function QuietAssistBar({ viewModel }: { viewModel: WorkspaceViewModel }) {
  const { colors, t } = useProductSettings();

  return (
    <View style={StyleSheet.flatten([styles.assistBar, { backgroundColor: colors.surface.panel }])}>
      <AppText tone="dim" variant="eyebrow">
        {t(viewModel.assist.eyebrowKey)}
      </AppText>
      <View style={styles.assistCopy}>
        <AppIcon name="icon.support.help_center" sizeVariant="sm" tone="tertiary" />
        <AppText style={styles.flex} tone="muted" variant="body.secondary">
          {t(viewModel.assist.promptKey)}
        </AppText>
      </View>
      <View style={styles.assistTags}>
        {viewModel.assist.tags.slice(0, 3).map((tag) => (
          <StatusPill appearance="outline" compact key={tag} label={t(tag)} tone="neutral" />
        ))}
        <ActionButton label={t(viewModel.assist.ctaKey)} onPress={() => router.push(viewModel.assist.route as never)} tone="neutral" variant="outline" />
      </View>
    </View>
  );
}

function PartnerMetricItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.partnerMetricItem}>
      <AppText numberOfLines={1} tone="dim" variant="caption">
        {label}
      </AppText>
      <AppText numberOfLines={1} variant="subtitle">
        {value}
      </AppText>
    </View>
  );
}

function toStatusPillTone(tone: WorkspaceTone): StatusPillTone {
  if (tone === 'brand' || tone === 'success' || tone === 'warning' || tone === 'danger' || tone === 'info' || tone === 'up' || tone === 'down') {
    return tone;
  }

  return 'neutral';
}

function toTextTone(tone?: WorkspaceTone): AppTextTone {
  if (tone === 'brand' || tone === 'up' || tone === 'down' || tone === 'danger') {
    return tone;
  }

  if (tone === 'warning') {
    return 'amber';
  }

  if (tone === 'info') {
    return 'blue';
  }

  if (tone === 'success') {
    return 'success';
  }

  return 'default';
}

function toIconSurfaceTone(tone?: IconTone | string): IconSurfaceTone {
  if (tone === 'brand' || tone === 'success' || tone === 'warning' || tone === 'danger' || tone === 'up' || tone === 'down') {
    return tone;
  }

  if (tone === 'blue' || tone === 'info') {
    return 'info';
  }

  if (tone === 'amber') {
    return 'warning';
  }

  return 'neutral';
}

function getSegmentIcon(segment: WorkspaceViewModel['segment']): AppIconName {
  if (segment === 'partner_mode') {
    return 'icon.ib.network';
  }

  if (segment === 'active_trader') {
    return 'icon.account.trading';
  }

  if (segment === 'kyc_approved_no_deposit') {
    return 'icon.kyc.identity';
  }

  return 'icon.education.academy';
}

function getSegmentIconTone(segment: WorkspaceViewModel['segment']): IconSurfaceTone {
  if (segment === 'partner_mode') {
    return 'brand';
  }

  if (segment === 'active_trader') {
    return 'info';
  }

  if (segment === 'kyc_approved_no_deposit') {
    return 'success';
  }

  return 'neutral';
}

const styles = StyleSheet.create({
  actionCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  actionRow: {
    alignItems: 'center',
    borderRadius: radius.card,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: layout.menuRowMinHeight,
    paddingHorizontal: layout.cardPaddingX,
    paddingVertical: spacing.md,
  },
  askInline: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'flex-end',
    minWidth: 0,
  },
  assistBar: {
    borderRadius: radius.card,
    gap: spacing.md,
    paddingHorizontal: layout.cardPaddingX,
    paddingVertical: layout.cardPaddingY,
  },
  assistCopy: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  assistTags: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  focusContent: {
    gap: spacing.lg,
  },
  focusCopy: {
    gap: spacing.xs,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: size.sheet.headerHeight,
    paddingBottom: spacing.sm,
    paddingHorizontal: layout.topBarPaddingX,
    paddingTop: spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  headerTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    minWidth: 0,
  },
  marketCard: {
    borderRadius: radius.card,
    flex: 1,
    gap: spacing.xs,
    minWidth: size.themePreview.optionMinWidth,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  metricTile: {
    borderRadius: radius.card,
    flex: 1,
    gap: spacing.xs,
    minHeight: layout.menuDescriptiveRowMinHeight,
    minWidth: size.viewport.detailSideMinWidth,
    paddingHorizontal: layout.cardPaddingX,
    paddingVertical: spacing.md,
  },
  modeSwitch: {
    alignItems: 'center',
    borderRadius: radius.card,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: layout.menuRowMinHeight,
    paddingHorizontal: layout.cardPaddingX,
    paddingVertical: spacing.md,
  },
  partnerMetricItem: {
    flex: 1,
    gap: spacing.xs,
    minWidth: size.metric.minWidth,
  },
  partnerMetrics: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  summaryCopy: {
    flex: 1,
    gap: spacing.sm,
    minWidth: 0,
  },
  summaryFooter: {
    alignItems: 'center',
    borderTopWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
  },
  summaryHead: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  summaryIconBlock: {
    paddingTop: spacing.xs,
  },
});
