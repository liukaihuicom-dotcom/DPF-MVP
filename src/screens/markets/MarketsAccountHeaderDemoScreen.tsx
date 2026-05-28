import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppIcon, AppText, Card, NativePressable, Screen, SegmentedTabs } from '@/src/design-public-assets/components';
import type { AppTextTone } from '@/src/design-public-assets/components';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { layout, lineWidth, radius, size, spacing } from '@/src/design-public-assets/tokens';

type AccountMetric = {
  label: string;
  tone?: AppTextTone;
  value: string;
};

type DemoVariant = {
  detail: string;
  emphasis: string;
  information: string;
  key: string;
  recommended?: boolean;
  render: () => ReactNode;
  title: string;
};

const demoAccount = {
  accountNo: '900061',
  equity: '$67,295',
  pnl: '-$205',
  title: '交易账号（900061）',
};

const marketTabs = [
  { label: '自选', value: 'watchlist' },
  { label: 'Forex', value: 'forex' },
  { label: 'Metals', value: 'metals' },
];

export default function MarketsAccountHeaderDemoScreen() {
  const { colors } = useProductSettings();
  const metrics: AccountMetric[] = [
    { label: 'Equity', value: demoAccount.equity },
    { label: '浮动盈亏', tone: 'down', value: demoAccount.pnl },
  ];
  const variants: DemoVariant[] = [
    {
      detail: '最弱化，适合把行情列表作为绝对主角。',
      emphasis: '弱化程度 5/5',
      information: '信息完整度 3/5',
      key: 'line',
      render: () => <ThinInfoBar metrics={metrics} />,
      title: '方案 1 · 细信息条',
    },
    {
      detail: '推荐方案，内容完整，同时明显降低头部存在感。',
      emphasis: '弱化程度 4/5',
      information: '信息完整度 5/5',
      key: 'compact',
      recommended: true,
      render: () => <CompactAccountCard metrics={metrics} />,
      title: '方案 2 · 紧凑白底账户卡',
    },
    {
      detail: '更像 App 原生导航里的当前上下文。',
      emphasis: '弱化程度 4/5',
      information: '信息完整度 4/5',
      key: 'pill',
      render: () => <TitlePillContext metrics={metrics} />,
      title: '方案 3 · 标题下方胶囊',
    },
    {
      detail: '信息最省空间，但 PnL 第一眼可见性降低。',
      emphasis: '弱化程度 5/5',
      information: '信息完整度 3/5',
      key: 'collapsed',
      render: () => <CollapsedSummary />,
      title: '方案 4 · 折叠摘要态',
    },
    {
      detail: '把账号信息变成行情筛选上下文，而不是主卡片。',
      emphasis: '弱化程度 4/5',
      information: '信息完整度 4/5',
      key: 'context',
      render: () => <TabsContextBar metrics={metrics} />,
      title: '方案 5 · Tabs 上方上下文条',
    },
  ];

  return (
    <Screen contentPadding="plain" title="交易账号模块弱化方案">
      <View style={styles.intro}>
        <AppText tone="muted" variant="body.secondary">
          独立 Demo 页面，不影响当前 /markets。五个方案使用同一组账号数据，方便直接比较头部信息强弱。
        </AppText>
      </View>

      <View style={styles.variantList}>
        {variants.map((variant) => (
          <Card
            compact
            key={variant.key}
            style={styles.variantCard}>
            <View style={styles.variantHeading}>
              <View style={styles.variantTitleBlock}>
                <AppText numberOfLines={1} variant="title.card">
                  {variant.title}
                </AppText>
                <AppText tone="muted" variant="body.secondary">
                  {variant.detail}
                </AppText>
              </View>
              {variant.recommended ? (
                <View style={StyleSheet.flatten([styles.recommendBadge, { backgroundColor: colors.status.success.bg }])}>
                  <AppText tone="success" variant="label.status">
                    推荐
                  </AppText>
                </View>
              ) : null}
            </View>

            <View style={styles.demoSurface}>{variant.render()}</View>

            <View style={styles.scoreRow}>
              <AppText tone="muted" variant="label.metadata">
                {variant.emphasis}
              </AppText>
              <AppText tone="muted" variant="label.metadata">
                {variant.information}
              </AppText>
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

function ThinInfoBar({ metrics }: { metrics: AccountMetric[] }) {
  const { colors } = useProductSettings();

  return (
    <NativePressable
      accessibilityLabel="查看交易账号摘要"
      minTouch={layout.touchTargetMin}
      style={StyleSheet.flatten([styles.thinBar, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
      <AppText numberOfLines={1} style={styles.thinBarAccount} variant="label.control">
        {demoAccount.title}
      </AppText>
      <View style={styles.thinBarMetrics}>
        {metrics.map((metric) => (
          <AppText key={metric.label} numberOfLines={1} tone={metric.tone ?? 'muted'} variant="label.metadata">
            {metric.label} {metric.value}
          </AppText>
        ))}
      </View>
      <AppIcon name="icon.system.chevron_down" sizeVariant="xs" tone="tertiary" />
    </NativePressable>
  );
}

function CompactAccountCard({ metrics }: { metrics: AccountMetric[] }) {
  const { colors } = useProductSettings();

  return (
    <NativePressable
      accessibilityLabel="切换交易账号"
      minTouch={64}
      style={StyleSheet.flatten([styles.compactCard, { backgroundColor: colors.surface.panel }])}>
      <View style={styles.compactHeader}>
        <AppText numberOfLines={1} style={styles.compactAccountText} variant="label.control">
          {demoAccount.title}
        </AppText>
        <AppIcon name="icon.system.chevron_down" sizeVariant="xs" tone="tertiary" />
      </View>
      <View style={styles.compactMetrics}>
        {metrics.map((metric, index) => (
          <View key={metric.label} style={StyleSheet.flatten([styles.compactMetric, index > 0 && styles.compactMetricEnd])}>
            <AppText numberOfLines={1} tone={metric.tone} variant="title.listItem">
              {metric.value}
            </AppText>
            <AppText numberOfLines={1} tone="muted" variant="label.metadata">
              {metric.label}
            </AppText>
          </View>
        ))}
      </View>
    </NativePressable>
  );
}

function TitlePillContext({ metrics }: { metrics: AccountMetric[] }) {
  const { colors } = useProductSettings();

  return (
    <View style={StyleSheet.flatten([styles.titleMockHeader, { backgroundColor: colors.surface.canvas }])}>
      <View style={styles.titleMockTop}>
        <AppText variant="displayLg">Dupoin</AppText>
        <View style={StyleSheet.flatten([styles.searchCircle, { backgroundColor: colors.surface.panel }])}>
          <AppIcon name="icon.system.search" sizeVariant="sm" />
        </View>
      </View>
      <NativePressable
        accessibilityLabel="切换交易账号"
        minTouch={layout.touchTargetMin}
        style={StyleSheet.flatten([styles.contextPill, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
        <AppText numberOfLines={1} style={styles.contextPillAccount} variant="label.control">
          {demoAccount.title}
        </AppText>
        <View style={styles.contextPillMetrics}>
          {metrics.map((metric) => (
            <AppText key={metric.label} numberOfLines={1} tone={metric.tone ?? 'muted'} variant="label.metadata">
              {metric.value}
            </AppText>
          ))}
        </View>
        <AppIcon name="icon.system.chevron_down" sizeVariant="xs" tone="tertiary" />
      </NativePressable>
    </View>
  );
}

function CollapsedSummary() {
  const { colors } = useProductSettings();

  return (
    <NativePressable
      accessibilityLabel="展开交易账号详情"
      minTouch={layout.touchTargetMin}
      style={StyleSheet.flatten([styles.collapsedRow, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
      <View style={styles.collapsedMain}>
        <AppText numberOfLines={1} style={styles.flexText} variant="label.control">
          {demoAccount.title}
        </AppText>
        <AppText numberOfLines={1} variant="label.control">
          Equity {demoAccount.equity}
        </AppText>
      </View>
      <View style={styles.collapsedMeta}>
        <AppText numberOfLines={1} tone="down" variant="label.metadata">
          浮动盈亏 {demoAccount.pnl}
        </AppText>
        <AppIcon name="icon.system.chevron_down" sizeVariant="xs" tone="tertiary" />
      </View>
    </NativePressable>
  );
}

function TabsContextBar({ metrics }: { metrics: AccountMetric[] }) {
  const { colors } = useProductSettings();

  return (
    <View style={styles.tabsPreview}>
      <NativePressable
        accessibilityLabel="切换行情账号上下文"
        minTouch={layout.touchTargetMin}
        style={StyleSheet.flatten([styles.tabsContext, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
        <View style={styles.tabsContextLeft}>
          <AppText numberOfLines={1} tone="muted" variant="label.metadata">
            账户
          </AppText>
          <AppText numberOfLines={1} style={styles.flexText} variant="label.control">
            {demoAccount.accountNo}
          </AppText>
        </View>
        <View style={styles.tabsContextMetrics}>
          {metrics.map((metric) => (
            <AppText key={metric.label} numberOfLines={1} tone={metric.tone ?? 'muted'} variant="label.metadata">
              {metric.label} {metric.value}
            </AppText>
          ))}
        </View>
        <AppIcon name="icon.system.chevron_down" sizeVariant="xs" tone="tertiary" />
      </NativePressable>
      <SegmentedTabs
        items={marketTabs}
        onValueChange={() => undefined}
        scrollable
        value="watchlist"
        variant="pill"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  collapsedMain: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    minWidth: 0,
  },
  collapsedMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  collapsedRow: {
    borderRadius: radius.md,
    borderWidth: lineWidth.hairline,
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  compactCard: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  compactAccountText: {
    flexShrink: 1,
    minWidth: 0,
  },
  compactHeader: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: spacing.xs,
    maxWidth: '100%',
    minWidth: 0,
  },
  compactMetric: {
    flex: 1,
    gap: lineWidth.strong,
    minWidth: 0,
  },
  compactMetricEnd: {
    alignItems: 'flex-end',
  },
  compactMetrics: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  contextPill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.xs,
    maxWidth: '100%',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  contextPillAccount: {
    flexShrink: 1,
    minWidth: 0,
  },
  contextPillMetrics: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  demoSurface: {
    gap: spacing.sm,
  },
  flexText: {
    flexShrink: 1,
    minWidth: 0,
  },
  intro: {
    paddingHorizontal: spacing.xs,
  },
  recommendBadge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  searchCircle: {
    alignItems: 'center',
    borderRadius: radius.full,
    height: size.control.sm,
    justifyContent: 'center',
    width: size.control.sm,
  },
  tabsContext: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  tabsContextLeft: {
    minWidth: size.control.lg,
  },
  tabsContextMetrics: {
    flex: 1,
    gap: lineWidth.strong,
    minWidth: 0,
  },
  tabsPreview: {
    gap: spacing.sm,
  },
  thinBar: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  thinBarAccount: {
    flexShrink: 1,
    minWidth: 0,
  },
  thinBarMetrics: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  titleMockHeader: {
    borderRadius: radius.lg,
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  titleMockTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  variantCard: {
    borderWidth: lineWidth.none,
    gap: spacing.md,
  },
  variantHeading: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  variantList: {
    gap: spacing.md,
  },
  variantTitleBlock: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
});
