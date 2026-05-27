import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/src/components/AppIcon';
import { Card } from '@/src/components/Card';
import { DetailRow } from '@/src/components/data-display';
import { EmptyState } from '@/src/components/feedback';
import { NativePressable } from '@/src/components/NativePressable';
import { Screen } from '@/src/components/Screen';
import { StatusPill } from '@/src/components/StatusPill';
import { TradeDirectionIcon } from '@/src/components/TradeDirectionIcon';
import { AppText } from '@/src/components/Typography';
import { closedOrderHistory, getCloseDateTitle, type ClosedOrder } from '@/src/domain/closedOrders';
import { directionLabel, formatMoney, formatNumber } from '@/src/domain/format';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { lineWidth, layout, radius, size, spacing } from '@/src/theme/tokens';

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
          <SummaryMetric label={t('accountOrders.realizedPnl')} tone={realized >= 0 ? 'down' : 'up'} value={formatMoney(realized, 'USD', 2, locale)} />
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
                <View style={StyleSheet.flatten([styles.listFrame, { borderColor: colors.border.subtle }])}>
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
            <AppText numberOfLines={1} tone={order.direction === 'buy' ? 'down' : 'up'} variant="caption">
              {directionLabel(order.direction, locale)} {order.lots}
            </AppText>
          </View>
          <AppText numberOfLines={1} tone="muted" variant="caption">{order.priceRange}</AppText>
        </View>
        <View style={styles.orderSide}>
          <AppText tone={order.pnl >= 0 ? 'down' : 'up'} variant="subtitle">{formatNumber(order.pnl, 2, locale)}</AppText>
          <AppText tone="muted" variant="caption">{t('portfolio.ticket')} {order.dealId}</AppText>
        </View>
        <AppIcon name="icon.system.chevron_right" size={layout.menuDisclosureIconSize} tone="tertiary" />
      </View>
      <View style={StyleSheet.flatten([styles.detailBox, { borderColor: colors.border.subtle }])}>
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
    borderRadius: radius.md,
    borderWidth: lineWidth.none,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  groupedList: {
    gap: spacing.md,
  },
  listFrame: {
    borderRadius: radius.md,
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
