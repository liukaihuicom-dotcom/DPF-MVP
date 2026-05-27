import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton } from '@/src/components/ActionButton';
import { AppIcon } from '@/src/components/AppIcon';
import { OrderInfoRow, RiskPriceRow } from '@/src/components/business';
import { Card } from '@/src/components/Card';
import { StepperButton, SwitchControl } from '@/src/components/forms';
import { InstrumentIcon } from '@/src/components/InstrumentIcon';
import { useKeyboardVisible } from '@/src/components/layout/useKeyboardVisible';
import { NativePressable } from '@/src/components/NativePressable';
import { Screen } from '@/src/components/Screen';
import { SegmentedTabs } from '@/src/components/SegmentedTabs';
import { TextField } from '@/src/components/TextField';
import { AppText } from '@/src/components/Typography';
import { directionLabel, formatMoney, formatPrice, orderTypeLabel } from '@/src/domain/format';
import { calculateMargin, calculateNotional, getTradePrice } from '@/src/domain/trading';
import type { Direction, Instrument, OrderType } from '@/src/domain/types';
import type { Locale } from '@/src/i18n/translations';
import { useToast } from '@/src/feedback/Toast';
import { impactLight, notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { navigateBackOrReplace, safeRouteTargets } from '@/src/navigation/navigationPolicy';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';
import { lineWidth, layout, radius, spacing, typography } from '@/src/theme/tokens';

const orderTypes: OrderType[] = ['market', 'limit', 'stop'];

export default function OrderTicketScreen() {
  const { direction = 'buy', id, type = 'market' } = useLocalSearchParams<{ direction?: Direction; id: string; type?: OrderType }>();
  const { account, findInstrument, placeOrder } = useBroker();
  const { locale, colors, t } = useProductSettings();
  const toast = useToast();
  const keyboardVisible = useKeyboardVisible();
  const [side, setSide] = useState<Direction>(direction === 'sell' ? 'sell' : 'buy');
  const [orderType, setOrderType] = useState<OrderType>(type === 'limit' || type === 'stop' ? type : 'market');
  const [lotsText, setLotsText] = useState('0.10');
  const [riskEnabled, setRiskEnabled] = useState(true);
  const instrument = findInstrument(id);

  const lots = Number(lotsText) > 0 ? Number(lotsText) : 0;
  const price = instrument ? getTradePrice(instrument, side) : 0;
  const margin = instrument ? calculateMargin(instrument, lots, price) : 0;
  const notional = instrument ? calculateNotional(instrument, lots, price) : 0;
  const canSubmit = Boolean(instrument && lots > 0 && margin < account.freeMargin);
  const errorText = lots <= 0 ? t('order.errorLots') : margin >= account.freeMargin ? t('order.errorMargin') : '';
  const stopLossPrice = instrument ? getRiskPrice(instrument, price, side, 'stopLoss') : 0;
  const takeProfitPrice = instrument ? getRiskPrice(instrument, price, side, 'takeProfit') : 0;
  const stopLossPnl = instrument ? getRiskPnl(instrument, lots, price, stopLossPrice, side) : 0;
  const takeProfitPnl = instrument ? getRiskPnl(instrument, lots, price, takeProfitPrice, side) : 0;
  const tradeTone = side === 'buy' ? 'down' : 'up';
  const tradeColor = side === 'buy' ? colors.market.down.fg : colors.market.up.fg;
  const submitLabel = canSubmit
    ? t('order.submitCompact', { direction: directionLabel(side, locale), lots: formatLots(lots, locale) })
    : t('order.invalid');

  const presetLots = useMemo(() => ['0.01', '0.05', '0.10', instrument?.symbol === 'XAU/USD' ? '0.20' : '0.50'], [instrument]);

  if (!instrument) {
    return (
      <Screen back backHref="/trade" title={t('common.invalidInstrument')}>
        <AppText variant="title">{t('common.invalidInstrument')}</AppText>
      </Screen>
    );
  }

  const setLots = (nextLots: number) => {
    const normalized = Math.max(0.01, Number(nextLots.toFixed(2)));
    setLotsText(normalized.toFixed(2));
  };

  const submitOrder = () => {
    if (!canSubmit) {
      void notifyWarning();
      toast.show({
        message: errorText || t('order.invalid'),
        title: t('order.submitBlocked'),
        tone: 'warning',
      });
      return;
    }

    const order = placeOrder({
      direction: side,
      instrumentId: instrument.id,
      lots,
      type: orderType,
    });

    if (order) {
      void notifySuccess();
      toast.show({
        message: t('order.submittedMessage', { symbol: instrument.symbol }),
        title: t('order.submittedTitle'),
        tone: 'success',
      });
      setTimeout(() => router.replace('/trade'), 450);
    }
  };

  const closeTicket = () => {
    navigateBackOrReplace(safeRouteTargets.trade);
  };

  return (
    <SafeAreaView edges={['top']} style={StyleSheet.flatten([styles.modalRoot, { backgroundColor: `${colors.text.primary}66` }])}>
      <Stack.Screen options={{ title: `${instrument.symbol} ${t('order.titleSuffix')}` }} />
      <Pressable accessibilityLabel={t('common.cancel')} onPress={closeTicket} style={styles.modalBackdrop} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardPanel}>
        <SafeAreaView edges={keyboardVisible ? [] : ['bottom']} style={StyleSheet.flatten([styles.ticketSheet, { backgroundColor: colors.surface.canvas, borderColor: colors.border.subtle }])}>
          <View style={styles.handleWrap}>
            <View style={StyleSheet.flatten([styles.handle, { backgroundColor: colors.border.default }])} />
          </View>
          <View style={styles.sheetHeader}>
            <View style={styles.headerAccountBlock}>
              <AppText numberOfLines={1} tone="dim" variant="caption">
                {t('order.accountNumber', { accountId: account.accountId })}
              </AppText>
              <AppText numberOfLines={1} tone="muted" variant="caption">
                {t('order.freeMargin')}
              </AppText>
              <AppText adjustsFontSizeToFit numberOfLines={1} variant="titleMd">
                {formatMoney(account.freeMargin, account.currency, 2, locale)}
              </AppText>
            </View>
            <View style={styles.headerInstrumentBlock}>
              <View style={styles.headerInstrumentIdentity}>
                <InstrumentIcon instrument={instrument} size={32} />
                <AppText adjustsFontSizeToFit numberOfLines={1} variant="subtitle">
                  {instrument.symbol}
                </AppText>
              </View>
              <AppText adjustsFontSizeToFit numberOfLines={1} tone={tradeTone} variant="number">
                {formatPrice(instrument, price)}
              </AppText>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.sheetContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.sheetScroller}>
            <SegmentedTabs
              items={orderTypes.map((item) => ({
                label: orderTypeLabel(item, locale),
                value: item,
              }))}
              onValueChange={(nextOrderType) => {
                void impactLight();
                setOrderType(nextOrderType);
              }}
              value={orderType}
            />

            <Card>
              <View style={styles.cardHeaderRow}>
                <View>
                  <AppText variant="subtitle">{t('order.positionSize')}</AppText>
                  <AppText tone="muted" variant="caption">
                    {t('order.lotHint', { baseCurrency: instrument.baseCurrency, contractSize: instrument.contractSize })}
                  </AppText>
                </View>
                <View style={StyleSheet.flatten([styles.sidePill, { backgroundColor: `${tradeColor}12`, borderColor: `${tradeColor}55` }])}>
                  <AppText tone={tradeTone} variant="caption">
                    {directionLabel(side, locale)}
                  </AppText>
                </View>
              </View>

              <View style={StyleSheet.flatten([styles.sideSwitch, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
                {(['buy', 'sell'] as Direction[]).map((item) => {
                  const selected = side === item;

                  return (
                    <NativePressable
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      key={item}
                      onPress={() => {
                        void impactLight();
                        setSide(item);
                      }}
                      style={StyleSheet.flatten([
                        styles.sideSwitchButton,
                        selected && { borderColor: colors.text.primary },
                      ])}>
                      <AppText tone={selected ? 'default' : 'muted'} variant="subtitle">
                        {directionLabel(item, locale)}
                      </AppText>
                    </NativePressable>
                  );
                })}
              </View>

              <View style={StyleSheet.flatten([styles.stepper, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
                <StepperButton
                  label={t('order.decreaseLots')}
                  onPress={() => {
                    void impactLight();
                    setLots(lots - 0.01);
                  }}
                  symbol="-"
                />
                <TextField
                  containerStyle={styles.stepperInputContainer}
                  error={errorText}
                  inputStyle={styles.stepperInput}
                  keyboardType="decimal-pad"
                  label={t('order.positionSize')}
                  labelHidden
                  onChangeText={setLotsText}
                  placeholder="0.10"
                  shellStyle={styles.stepperInputShell}
                  value={lotsText}
                />
                <StepperButton
                  label={t('order.increaseLots')}
                  onPress={() => {
                    void impactLight();
                    setLots(lots + 0.01);
                  }}
                  symbol="+"
                />
              </View>

              <View style={styles.presetRow}>
                {presetLots.map((preset) => (
                  <NativePressable
                    accessibilityRole="button"
                    key={preset}
                    onPress={() => {
                      void impactLight();
                      setLotsText(preset);
                    }}
                    style={StyleSheet.flatten([
                      styles.preset,
                      { backgroundColor: lotsText === preset ? `${tradeColor}12` : colors.surface.subtle, borderColor: lotsText === preset ? tradeColor : colors.border.subtle },
                    ])}>
                    <AppText tone={lotsText === preset ? tradeTone : 'default'} variant="caption">
                      {preset}
                    </AppText>
                  </NativePressable>
                ))}
              </View>

              <View style={StyleSheet.flatten([styles.valueRows, { borderTopColor: colors.border.subtle }])}>
                <OrderInfoRow label={t('order.notionalValue')} value={formatMoney(notional, 'USD', 2, locale)} />
                <OrderInfoRow label={t('order.estimatedMargin')} tone={margin > account.freeMargin ? 'danger' : 'default'} value={formatMoney(margin, 'USD', 2, locale)} />
              </View>
            </Card>

            <Card>
              <View style={styles.cardHeaderRow}>
                <View style={styles.riskTitle}>
                  <AppIcon name="icon.security.risk_shield" sizeVariant="sm" />
                  <View>
                    <AppText variant="subtitle">{t('order.riskManagement')}</AppText>
                    <AppText tone="muted" variant="caption">
                      {t('order.riskManagementHint')}
                    </AppText>
                  </View>
                </View>
                <SwitchControl
                  accessibilityLabel={t('order.riskManagement')}
                  onValueChange={(nextValue) => {
                    void impactLight();
                    setRiskEnabled(nextValue);
                  }}
                  value={riskEnabled}
                />
              </View>

              {riskEnabled ? (
                <View style={styles.riskFields}>
                  <RiskPriceRow
                    caption={side === 'buy' ? t('order.belowMarket') : t('order.aboveMarket')}
                    label={t('order.stopLoss')}
                    pnl={stopLossPnl}
                    price={formatPrice(instrument, stopLossPrice)}
                  />
                  <RiskPriceRow
                    caption={side === 'buy' ? t('order.aboveMarket') : t('order.belowMarket')}
                    label={t('order.takeProfit')}
                    pnl={takeProfitPnl}
                    price={formatPrice(instrument, takeProfitPrice)}
                  />
                </View>
              ) : null}
            </Card>

            <Card compact style={styles.riskNotice}>
              <AppIcon name="icon.risk.info" sizeVariant="xs" tone="amber" />
              <AppText numberOfLines={3} tone="amber" variant="caption">
                {t('risk.order')}
              </AppText>
            </Card>
          </ScrollView>

          <View style={StyleSheet.flatten([
            styles.footerStack,
            keyboardVisible && styles.footerStackKeyboard,
            { backgroundColor: colors.surface.canvas, borderTopColor: colors.border.subtle },
          ])}>
            {errorText ? (
              <AppText numberOfLines={2} tone="danger" variant="caption">
                {errorText}
              </AppText>
            ) : null}
            <ActionButton
              accessibilityLabel={submitLabel}
              emphasis="solid"
              label={submitLabel}
              onPress={submitOrder}
              tone={tradeTone}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function formatLots(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

function getRiskPrice(instrument: Instrument, price: number, direction: Direction, kind: 'stopLoss' | 'takeProfit') {
  const distance = Math.max(instrument.pipSize * 20, price * 0.012);
  const multiplier = kind === 'takeProfit' ? 1 : -1;
  const sideMultiplier = direction === 'buy' ? 1 : -1;

  return price + distance * multiplier * sideMultiplier;
}

function getRiskPnl(
  instrument: Instrument,
  lots: number,
  entryPrice: number,
  riskPrice: number,
  direction: Direction,
) {
  const multiplier = direction === 'buy' ? 1 : -1;

  return (riskPrice - entryPrice) * multiplier * lots * instrument.contractSize;
}

const styles = StyleSheet.create({
  accountCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  cardHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  footerStack: {
    borderTopWidth: lineWidth.hairline,
    gap: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.md,
  },
  footerStackKeyboard: {
    paddingBottom: layout.bottomActionArea.keyboardPaddingBottom,
  },
  handle: {
    borderRadius: radius.full,
    height: 4,
    width: 42,
  },
  handleWrap: {
    alignItems: 'center',
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
  },
  headerAccountBlock: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  headerInstrumentBlock: {
    alignItems: 'flex-end',
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  headerInstrumentIdentity: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    maxWidth: '100%',
  },
  keyboardPanel: {
    height: '94%',
    justifyContent: 'flex-end',
    position: 'relative',
    width: '100%',
    zIndex: 1,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  preset: {
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  riskFields: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  riskNotice: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  riskTitle: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minWidth: 0,
  },
  sheetContent: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.sm,
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: layout.sheetTradeHeaderMinHeight,
    paddingBottom: spacing.sm,
    paddingHorizontal: layout.screenPaddingX,
  },
  sheetScroller: {
    flex: 1,
  },
  sidePill: {
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sideSwitch: {
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.lg,
    padding: spacing.xs,
  },
  sideSwitchButton: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: radius.full,
    borderWidth: lineWidth.selected,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
  },
  stepper: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  stepperInput: {
    ...typography.displayXl,
    textAlign: 'center',
  },
  stepperInputContainer: {
    flex: 1,
    minWidth: 0,
  },
  stepperInputShell: {
    borderColor: 'transparent',
    minHeight: 50,
    paddingHorizontal: spacing.sm,
  },
  ticketSheet: {
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderTopWidth: lineWidth.hairline,
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    zIndex: 1,
  },
  valueRows: {
    borderTopWidth: lineWidth.hairline,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
  },
});
