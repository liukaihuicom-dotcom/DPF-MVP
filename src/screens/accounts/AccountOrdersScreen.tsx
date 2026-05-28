import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/src/design-public-assets/components';
import { Card } from '@/src/design-public-assets/components';
import { DetailRow } from '@/src/design-public-assets/components';
import { EmptyState } from '@/src/design-public-assets/components';
import { NativePressable } from '@/src/design-public-assets/components';
import { Screen } from '@/src/design-public-assets/components';
import { StatusPill } from '@/src/design-public-assets/components';
import { TradeDirectionIcon } from '@/src/design-public-assets/components';
import { AppText } from '@/src/design-public-assets/components';
import { closedOrderHistory, getCloseDateTitle, type ClosedOrder } from '@/src/domain/closedOrders';
import { directionLabel, formatMoney, formatNumber } from '@/src/domain/format';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { lineWidth, layout, radius, size, spacing } from '@/src/design-public-assets/tokens';

export default function AccountOrdersScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale, colors, t } = useProductSettings();
  const groups = groupClosedOrdersByDate(closedOrderHistory);
  const realized = closedOrderHistory.reduce((total, order) => total + order.pnl, 0);

  return (
    <Screen align="center" back backHref="/accounts" title={t('portfolio.orderRecords')}>
      <Card compact>
        <View style={styles.summaryHeader}>
          <View style={styles.summaryCopy}>
            <AppText variant="subtitle">{t('accountOrders.closedTitle')}</AppText>
            <AppText numberOfLines={2} tone="muted" variant="caption">
              {t('accountOrders.closedHint', { account: id ?? '--' })}
            </AppText>
          </View>
          <StatusPill compact icon="icon.trading.history" label={t('status.closed')} tone="neutral" />
        </View>
        <View style={StyleSheet.flatten([styles.summaryGrid, { borderTopColor: colors.border.subtle }])}>
          <SummaryMetric label={t('accountOrders.realizedPnl')} tone={realized >= 0 ? 'up' : 'down'} value={formatMoney(realized, 'USD', 2, locale)} />
          <SummaryMetric label={t('accountOrders.closedCount')} value={String(closedOrderHistory.length)} />
        </View>
      </Card>

      {groups.length === 0 ? (
        <EmptyState body={t('portfolio.emptyOrders')} icon="icon.trading.history" variant="card" />
      ) : (
        <Card>
          <View style={styles.groupedList}>
            {groups.map((group) => (
              <View key={group.title} style={styles.dateGroup}>
                <AppText tone="muted" variant="caption">{group.title}</AppText>
                <View style={styles.listFrame}>
                  {group.rows.map((order, index) => (
                    <ClosedOrderRow key={order.id} order={order} showDivider={index < group.rows.length - 1} />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </Card>
      )}
    </Screen>
  );
}

function ClosedOrderRow({ order, showDivider }: { order: ClosedOrder; showDivider?: boolean }) {
  const { locale, colors, t } = useProductSettings();

  return (
    <NativePressable
      accessibilityLabel={`${order.symbol} ${directionLabel(order.direction, locale)} ${order.lots}`}
      minTouch={76}
      style={StyleSheet.flatten([styles.orderRow, showDivider && { borderBottomColor: colors.border.subtle, borderBottomWidth: lineWidth.hairline }])}>
      <View style={styles.orderTop}>
        <TradeDirectionIcon direction={order.direction} sizeVariant="md" />
        <View style={styles.orderMain}>
          <View style={styles.orderTitleRow}>
            <AppText numberOfLines={1} variant="subtitle">{order.symbol}</AppText>
            <AppText numberOfLines={1} tone={order.direction === 'buy' ? 'up' : 'down'} variant="caption">
              {directionLabel(order.direction, locale)} {order.lots}
            </AppText>
          </View>
          <AppText numberOfLines={1} tone="muted" variant="caption">{order.priceRange}</AppText>
        </View>
        <View style={styles.orderSide}>
          <AppText tone={order.pnl >= 0 ? 'up' : 'down'} variant="subtitle">{formatNumber(order.pnl, 2, locale)}</AppText>
          <AppText tone="muted" variant="caption">{t('portfolio.ticket')} {order.dealId}</AppText>
        </View>
        <AppIcon name="icon.system.chevron_right" size={layout.menuDisclosureIconSize} tone="tertiary" />
      </View>
      <View style={styles.detailBox}>
        <DetailRow row={{ label: t('portfolio.openTime'), value: order.openTime }} showDivider />
        <DetailRow row={{ label: t('portfolio.closeTime'), value: order.closeTime }} showDivider />
        <DetailRow row={{ label: t('portfolio.commissionSwap'), value: `${formatNumber(order.commission, 2, locale)} / ${formatNumber(order.swap, 2, locale)}` }} />
      </View>
    </NativePressable>
  );
}

function SummaryMetric({ label, tone, value }: { label: string; tone?: 'down' | 'up'; value: string }) {
  return (
    <View style={styles.summaryMetric}>
      <AppText adjustsFontSizeToFit numberOfLines={1} tone={tone} variant="subtitle">{value}</AppText>
      <AppText numberOfLines={1} tone="muted" variant="caption">{label}</AppText>
    </View>
  );
}

function groupClosedOrdersByDate(rows: ClosedOrder[]) {
  const groups: { rows: ClosedOrder[]; title: string }[] = [];

  rows.forEach((row) => {
    const title = getCloseDateTitle(row);
    const existing = groups.find((group) => group.title === title);

    if (existing) {
      existing.rows.push(row);
      return;
    }

    groups.push({ rows: [row], title });
  });

  return groups;
}

const styles = StyleSheet.create({
  dateGroup: {
    gap: spacing.sm,
  },
  detailBox: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  groupedList: {
    gap: spacing.md,
  },
  listFrame: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    overflow: 'hidden',
  },
  orderMain: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  orderRow: {
    gap: spacing.md,
    padding: spacing.md,
  },
  orderSide: {
    alignItems: 'flex-end',
    gap: spacing.xs,
    minWidth: size.viewport.detailSideMinWidth,
  },
  orderTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  orderTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  summaryCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  summaryGrid: {
    borderTopWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.md,
  },
  summaryHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  summaryMetric: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
});
