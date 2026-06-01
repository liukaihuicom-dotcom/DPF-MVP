import { StyleSheet, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { DetailInline } from '@/src/components/data-display';
import { GlobalMenuList, type GlobalMenuListItem } from '@/src/components/GlobalMenuList';
import { KeyValueList, type KeyValueListItem } from '@/src/components/KeyValueList';
import { SheetGroupTitle } from '@/src/components/layout/SheetGroupTitle';
import { TradeDirectionIcon } from '@/src/components/TradeDirectionIcon';
import { AppText, type AppTextTone } from '@/src/components/Typography';
import type { Direction } from '@/src/domain/types';
import { useThemeColors } from '@/src/settings/ProductSettings';
import { layout, lineWidth, spacing } from '@/src/theme/tokens';

export type DataSummaryHeroProps = {
  emphasis?: 'default' | 'strong';
  label: string;
  supportingValue?: string;
  tone?: AppTextTone;
  value: string;
};

export type DirectionSummary = {
  direction: Direction;
  label: string;
  lots: string;
  priceRange?: string;
  symbol: string;
};

export type OrderPositionDetailSheetProps = {
  detailItems: KeyValueListItem[];
  summary: DirectionSummary;
  title?: string;
  valueHero?: DataSummaryHeroProps;
};

type OrderActionGroup = {
  id: string;
  items: GlobalMenuListItem[];
  title: string;
};

export type TradingOrderActionSheetProps = {
  groups: OrderActionGroup[];
};

type ClosedOrderDeal = {
  delta: string;
  detailItems?: { label: string; value: string }[];
  id: string;
  lots: string;
  pnlText: string;
  priceRange: string;
};

type ClosedOrderDetailSheetProps = {
  dealCountLabel: string;
  deals: ClosedOrderDeal[];
  detailItems: { label: string; value: string }[];
  pnlDelta: string;
  pnlText: string;
  summary: DirectionSummary;
  ticketLabel: string;
  ticketValue: string;
};

export function OrderPositionDetailSheet({ detailItems, summary, title, valueHero }: OrderPositionDetailSheetProps) {
  return (
    <View style={styles.sheet}>
      {valueHero ? (
        <DataSummaryHero {...valueHero} />
      ) : (
        <View style={styles.hero}>
          <TradeDirectionIcon direction={summary.direction} sizeVariant="lg" />
          {title ? <AppText variant="title">{title}</AppText> : null}
          <DirectionSummaryHeader summary={summary} />
          {summary.priceRange ? (
            <AppText tone="muted" variant="caption">
              {summary.priceRange}
            </AppText>
          ) : null}
        </View>
      )}

      <OrderDetailCard items={detailItems} />
    </View>
  );
}

export function PositionDetailSheet({ detailItems, summary, valueHero }: OrderPositionDetailSheetProps) {
  return <OrderPositionDetailSheet detailItems={detailItems} summary={summary} valueHero={valueHero} />;
}

export function PendingOrderDetailSheet({ detailItems, summary, title }: OrderPositionDetailSheetProps) {
  return <OrderPositionDetailSheet detailItems={detailItems} summary={summary} title={title} />;
}

export function TradingOrderActionSheet({ groups }: TradingOrderActionSheetProps) {
  return (
    <View style={styles.actionSheet}>
      {groups.map((group) => (
        <View key={group.id} style={styles.actionModule}>
          <SheetGroupTitle title={group.title} />
          <GlobalMenuList contained containerShape="plain" items={group.items} variant="descriptive" />
        </View>
      ))}
    </View>
  );
}

export function ClosedOrderDetailSheet({ dealCountLabel, deals, detailItems, pnlDelta, pnlText, summary, ticketLabel, ticketValue }: ClosedOrderDetailSheetProps) {
  const colors = useThemeColors();
  const pnlTone = pnlText.trim().startsWith('-') ? 'down' : 'up';

  return (
    <View style={styles.closedSheet}>
      <AppText variant="title">
        {ticketLabel} {ticketValue}
      </AppText>
      <View style={styles.closedSummary}>
        <View style={styles.closedTop}>
          <View style={styles.closedIdentity}>
            <TradeDirectionIcon direction={summary.direction} sizeVariant="lg" />
            <View style={styles.tradeMain}>
              <DirectionSummaryHeader summary={summary} titleVariant="title" />
              {summary.priceRange ? (
                <AppText tone="muted" variant="subtitle">
                  {summary.priceRange}
                </AppText>
              ) : null}
            </View>
          </View>
          <PnlBlock delta={pnlDelta} pnlText={pnlText} tone={pnlTone} />
        </View>
        <OrderDetailCard
          items={detailItems.map((item) => ({
            label: item.label,
            value: item.value,
          }))}
        />
      </View>

      <View style={styles.dealsSection}>
        <AppText style={styles.dealsTitle} variant="subtitle">
          {dealCountLabel}
        </AppText>
        {deals.map((deal, index) => (
          <View
            key={deal.id}
            style={StyleSheet.flatten([
              styles.dealRow,
              index < deals.length - 1 && {
                borderBottomColor: colors.border.subtle,
                borderBottomWidth: lineWidth.hairline,
              },
            ])}>
            <TradeDirectionIcon direction={summary.direction} sizeVariant="sm" />
            <View style={styles.tradeMain}>
              <AppText variant="subtitle">
                {summary.symbol} {deal.lots}
              </AppText>
              <AppText tone="muted" variant="body">
                {deal.priceRange}
              </AppText>
              {deal.detailItems?.length ? (
                <View style={styles.dealMeta}>
                  {deal.detailItems.map((item) => (
                    <DetailInline key={item.label} label={item.label} value={item.value} />
                  ))}
                </View>
              ) : null}
            </View>
            <PnlBlock delta={deal.delta} pnlText={deal.pnlText} tone={pnlTone} />
          </View>
        ))}
      </View>
    </View>
  );
}

function DataSummaryHero({ emphasis = 'default', label, supportingValue, tone, value }: DataSummaryHeroProps) {
  return (
    <View style={styles.dataHero}>
      <View style={styles.dataCopy}>
        <View style={styles.dataValueGroup}>
          <AppText adjustsFontSizeToFit numberOfLines={1} tone={tone} variant={emphasis === 'strong' ? 'largeNumber' : 'number'}>
            {value}
          </AppText>
          <AppText numberOfLines={1} tone="muted" variant="caption">
            {label}
          </AppText>
        </View>
        {supportingValue ? (
          <View style={styles.dataSupport}>
            <AppText numberOfLines={1} variant="subtitle">
              {supportingValue}
            </AppText>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function DirectionSummaryHeader({ summary, titleVariant = 'subtitle' }: { summary: DirectionSummary; titleVariant?: 'subtitle' | 'title' }) {
  return (
    <View style={styles.inlineTitle}>
      <AppText variant={titleVariant}>{summary.symbol}</AppText>
      <AppText tone={summary.direction === 'buy' ? 'up' : 'down'} variant={titleVariant}>
        {summary.label} {summary.lots}
      </AppText>
    </View>
  );
}

function PnlBlock({ delta, pnlText, tone }: { delta: string; pnlText: string; tone: AppTextTone }) {
  return (
    <View style={styles.closedPnl}>
      <AppText tone={tone} variant="title">
        {pnlText}
      </AppText>
      <AppText tone={tone} variant="body">
        {delta}
      </AppText>
    </View>
  );
}

function OrderDetailCard({ items }: { items: KeyValueListItem[] }) {
  return (
    <Card surface="list" style={styles.detailCard}>
      <KeyValueList divided inset="none" items={items} variant="detail" />
    </Card>
  );
}

const styles = StyleSheet.create({
  actionModule: {
    gap: layout.controlGap,
  },
  actionSheet: {
    gap: layout.sheetContentGap,
    paddingTop: spacing.xxs,
  },
  closedSummary: {
    gap: layout.controlGap,
  },
  closedIdentity: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
    minWidth: 0,
  },
  closedPnl: {
    alignItems: 'flex-end',
  },
  closedSheet: {
    gap: layout.sheetContentGap,
  },
  closedTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  dataCopy: {
    alignItems: 'center',
    gap: lineWidth.selected + lineWidth.strong,
  },
  dataHero: {
    alignItems: 'center',
    paddingBottom: spacing.xs + lineWidth.selected,
  },
  dataSupport: {
    paddingTop: spacing.sm + lineWidth.selected,
  },
  dataValueGroup: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  dealMeta: {
    gap: spacing.sm - lineWidth.selected,
    marginTop: spacing.md,
  },
  dealRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  dealsSection: {
    gap: spacing.xs,
  },
  dealsTitle: {
    paddingHorizontal: layout.listRowPaddingX,
  },
  detailCard: {
    width: '100%',
  },
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.sm + lineWidth.selected,
  },
  inlineTitle: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + lineWidth.strong,
  },
  sheet: {
    gap: layout.sheetContentGap,
  },
  tradeMain: {
    flex: 1,
    gap: lineWidth.selected + lineWidth.strong,
    justifyContent: 'center',
    minWidth: 0,
  },
});
