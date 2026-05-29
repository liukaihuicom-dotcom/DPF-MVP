import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActionButton } from "@/src/design-public-assets/components";
import { AppIcon } from "@/src/design-public-assets/components";
import {
  OrderInfoRow,
  RiskPriceRow,
} from "@/src/design-public-assets/business-components";
import { Card } from "@/src/design-public-assets/components";
import {
  StepperButton,
  SwitchControl,
} from "@/src/design-public-assets/components";
import { InstrumentIcon } from "@/src/design-public-assets/components";
import { useKeyboardVisible } from "@/src/design-public-assets/components";
import { NativePressable } from "@/src/design-public-assets/components";
import {
  useDirtyStateGuard,
  useOverlayQueue,
} from "@/src/design-public-assets/components";
import { Screen } from "@/src/design-public-assets/components";
import { SegmentedTabs } from "@/src/design-public-assets/components";
import { TextField } from "@/src/design-public-assets/components";
import { AppText } from "@/src/design-public-assets/components";
import {
  directionLabel,
  formatMoney,
  formatNumber,
  formatPrice,
  orderTypeLabel,
} from "@/src/domain/format";
import {
  calculateMargin,
  calculateNotional,
  getTradePrice,
} from "@/src/domain/trading";
import type {
  Direction,
  Instrument,
  OrderExpirationType,
  OrderType,
} from "@/src/domain/types";
import type { Locale } from "@/src/design-public-assets/copy";
import {
  impactLight,
  notifySuccess,
  notifyWarning,
} from "@/src/feedback/haptics";
import {
  navigateBackOrReplace,
  safeRouteTargets,
} from "@/src/navigation/navigationPolicy";
import { useProductSettings } from "@/src/design-public-assets/copy";
import { useBroker } from "@/src/state/BrokerStore";
import {
  lineWidth,
  layout,
  motion,
  radius,
  size,
  spacing,
  typography,
  zIndex,
} from "@/src/design-public-assets/tokens";

const ORDER_TICKET_MOTION_MS = motion.overlay.standardMs;
const ORDER_TICKET_SHEET_OFFSET = layout.topReservedSpace * 3;
const ORDER_TICKET_DRAG_CLOSE_DISTANCE =
  layout.headerIconButtonSize + spacing.xxl;
const ORDER_TICKET_DRAG_CLOSE_VELOCITY = 0.7;
const DEFAULT_EXPIRY_OFFSET_DAYS = 30;

const orderTypes: OrderType[] = ["market", "limit", "stop"];
const expirationTypes: OrderExpirationType[] = ["gtc", "specified"];

export default function OrderTicketScreen() {
  const {
    direction = "buy",
    id,
    type = "market",
  } = useLocalSearchParams<{
    direction?: Direction;
    id: string;
    type?: OrderType;
  }>();
  const { account, findInstrument, placeOrder } = useBroker();
  const {
    locale,
    colors,
    oneClickTradingEnabled,
    setOneClickTradingEnabled,
    t,
  } = useProductSettings();
  const overlayQueue = useOverlayQueue();
  const keyboardVisible = useKeyboardVisible();
  const [side, setSide] = useState<Direction>(
    direction === "sell" ? "sell" : "buy",
  );
  const [orderType, setOrderType] = useState<OrderType>(
    type === "limit" || type === "stop" ? type : "market",
  );
  const [pendingPriceText, setPendingPriceText] = useState("");
  const [lotsText, setLotsText] = useState("0.10");
  const [riskEnabled, setRiskEnabled] = useState(true);
  const [stopLossText, setStopLossText] = useState("");
  const [takeProfitText, setTakeProfitText] = useState("");
  const [expirationType, setExpirationType] =
    useState<OrderExpirationType>("gtc");
  const [expiresAtText, setExpiresAtText] = useState("");
  const [closing, setClosing] = useState(false);
  const entranceProgress = useSharedValue(0);
  const dragY = useSharedValue(0);
  const instrument = findInstrument(id);

  const lots = Number(lotsText) > 0 ? Number(lotsText) : 0;
  const marketPrice = instrument ? getTradePrice(instrument, side) : 0;
  const pendingPrice = parsePositiveNumber(pendingPriceText);
  const stopLossInputPrice = parsePositiveNumber(stopLossText);
  const takeProfitInputPrice = parsePositiveNumber(takeProfitText);
  const orderPrice = orderType === "market" ? marketPrice : pendingPrice;
  const margin =
    instrument && orderPrice
      ? calculateMargin(instrument, lots, orderPrice)
      : 0;
  const notional =
    instrument && orderPrice
      ? calculateNotional(instrument, lots, orderPrice)
      : 0;
  const pendingPriceError =
    instrument && orderType !== "market"
      ? getPendingPriceError(orderType, side, marketPrice, pendingPrice, t)
      : "";
  const expirationError =
    orderType !== "market" &&
    expirationType === "specified" &&
    !expiresAtText.trim()
      ? t("order.errorExpiration")
      : "";
  const errorText =
    lots <= 0
      ? t("order.errorLots")
      : pendingPriceError ||
        expirationError ||
        (margin >= account.freeMargin ? t("order.errorMargin") : "");
  const canSubmit = Boolean(
    instrument &&
    lots > 0 &&
    orderPrice > 0 &&
    !pendingPriceError &&
    !expirationError &&
    margin < account.freeMargin,
  );
  const stopLossPrice = instrument
    ? stopLossInputPrice ||
      getRiskPrice(instrument, orderPrice || marketPrice, side, "stopLoss")
    : 0;
  const takeProfitPrice = instrument
    ? takeProfitInputPrice ||
      getRiskPrice(instrument, orderPrice || marketPrice, side, "takeProfit")
    : 0;
  const stopLossPnl = instrument
    ? getRiskPnl(
        instrument,
        lots,
        orderPrice || marketPrice,
        stopLossPrice,
        side,
      )
    : 0;
  const takeProfitPnl = instrument
    ? getRiskPnl(
        instrument,
        lots,
        orderPrice || marketPrice,
        takeProfitPrice,
        side,
      )
    : 0;
  const tradeTone = side === "buy" ? "up" : "down";
  const tradeColor =
    side === "buy" ? colors.market.up.fg : colors.market.down.fg;
  const submitLabel = canSubmit
    ? t("order.submitCompact", {
        direction: directionLabel(side, locale),
        lots: formatLots(lots, locale),
      })
    : t("order.invalid");

  const presetLots = useMemo(
    () => [
      "0.01",
      "0.05",
      "0.10",
      instrument?.symbol === "XAU/USD" ? "0.20" : "0.50",
    ],
    [instrument],
  );
  const defaultExpiresAtText = useMemo(
    () => getDefaultExpirationText(locale),
    [locale],
  );
  const shownExpiresAtText = expiresAtText || defaultExpiresAtText;
  const dirty =
    side !== (direction === "sell" ? "sell" : "buy") ||
    orderType !== (type === "limit" || type === "stop" ? type : "market") ||
    pendingPriceText.length > 0 ||
    lotsText !== "0.10" ||
    riskEnabled !== true ||
    stopLossText.length > 0 ||
    takeProfitText.length > 0 ||
    expirationType !== "gtc" ||
    expiresAtText.length > 0;

  useEffect(() => {
    entranceProgress.value = withTiming(1, {
      duration: ORDER_TICKET_MOTION_MS,
    });
  }, [entranceProgress]);

  const finishClose = useCallback(() => {
    navigateBackOrReplace(safeRouteTargets.trade);
  }, []);

  const closeTicket = useCallback(() => {
    if (closing) {
      return;
    }

    if (dirty) {
      overlayQueue.enqueueAlert({
        actions: [
          {
            label: t("overlay.dirty.stay"),
            onPress: () => undefined,
            tone: "brand",
            variant: "filled",
          },
          {
            label: t("overlay.dirty.exit"),
            onPress: () => {
              setClosing(true);
              void impactLight();
              dragY.value = withTiming(0, { duration: ORDER_TICKET_MOTION_MS });
              entranceProgress.value = withTiming(
                0,
                { duration: ORDER_TICKET_MOTION_MS },
                (finished) => {
                  if (finished) {
                    runOnJS(finishClose)();
                  }
                },
              );
            },
            tone: "danger",
            variant: "outline",
          },
        ],
        body: t("overlay.dirty.order.body"),
        dedupeKey: "order-dirty-close",
        icon: "icon.risk.info",
        priority: "blocking",
        riskLevel: "high",
        title: t("overlay.dirty.order.title"),
        tone: "warning",
      });
      return;
    }

    setClosing(true);
    void impactLight();
    dragY.value = withTiming(0, { duration: ORDER_TICKET_MOTION_MS });
    entranceProgress.value = withTiming(
      0,
      { duration: ORDER_TICKET_MOTION_MS },
      (finished) => {
        if (finished) {
          runOnJS(finishClose)();
        }
      },
    );
  }, [closing, dirty, dragY, entranceProgress, finishClose, overlayQueue, t]);

  const sheetCloseResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_event, gestureState) =>
          gestureState.dy > spacing.sm &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onPanResponderMove: (_event, gestureState) => {
          dragY.value = Math.max(0, gestureState.dy);
        },
        onPanResponderRelease: (_event, gestureState) => {
          const shouldClose =
            gestureState.dy > ORDER_TICKET_DRAG_CLOSE_DISTANCE ||
            gestureState.vy > ORDER_TICKET_DRAG_CLOSE_VELOCITY;

          if (shouldClose) {
            closeTicket();
            return;
          }

          dragY.value = withTiming(0, { duration: ORDER_TICKET_MOTION_MS });
        },
        onPanResponderTerminate: () => {
          dragY.value = withTiming(0, { duration: ORDER_TICKET_MOTION_MS });
        },
      }),
    [closeTicket, dragY],
  );

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      entranceProgress.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const sheetAnimatedStyle = useAnimatedStyle(() => {
    const translateY =
      interpolate(
        entranceProgress.value,
        [0, 1],
        [ORDER_TICKET_SHEET_OFFSET, 0],
        Extrapolation.CLAMP,
      ) + dragY.value;

    return {
      opacity: interpolate(
        entranceProgress.value,
        [0, 1],
        [0, 1],
        Extrapolation.CLAMP,
      ),
      transform: [{ translateY }],
    };
  });

  if (!instrument) {
    return (
      <Screen back backHref="/trade" title={t("common.invalidInstrument")}>
        <AppText variant="title">{t("common.invalidInstrument")}</AppText>
      </Screen>
    );
  }

  const setLots = (nextLots: number) => {
    const normalized = Math.max(0.01, Number(nextLots.toFixed(2)));
    setLotsText(normalized.toFixed(2));
  };

  const executeOrder = () => {
    const order = placeOrder({
      direction: side,
      expirationType: orderType === "market" ? undefined : expirationType,
      expiresAt:
        orderType === "market" || expirationType !== "specified"
          ? undefined
          : shownExpiresAtText,
      instrumentId: instrument.id,
      limitPrice: orderType === "limit" ? pendingPrice : undefined,
      lots,
      oneClickTradingEnabled,
      stopLoss: riskEnabled ? stopLossPrice : undefined,
      stopPrice: orderType === "stop" ? pendingPrice : undefined,
      takeProfit: riskEnabled ? takeProfitPrice : undefined,
      type: orderType,
    });

    if (order) {
      void notifySuccess();
      overlayQueue.enqueueAlert({
        body: t(
          order.status === "pending"
            ? "order.submittedPendingMessage"
            : "order.submittedMessage",
          { symbol: instrument.symbol },
        ),
        dedupeKey: `order-submitted-${order.id}`,
        icon: "icon.trading.order_ticket",
        priority: "critical",
        riskLevel: "high",
        title: t(
          order.status === "pending"
            ? "order.submittedPendingTitle"
            : "order.submittedTitle",
        ),
        tone: "success",
      });
      setTimeout(() => router.replace("/trade"), 450);
    }
  };

  const submitOrder = () => {
    if (!canSubmit) {
      void notifyWarning();
      overlayQueue.enqueueAlert({
        body: errorText || t("order.invalid"),
        dedupeKey: "order-submit-blocked",
        icon: "icon.status.rejected",
        priority: "critical",
        riskLevel: "high",
        title: t("order.submitBlocked"),
        tone: "warning",
      });
      return;
    }

    if (oneClickTradingEnabled) {
      executeOrder();
      return;
    }

    overlayQueue.enqueueAlert({
      actions: [
        {
          label: t("common.cancel"),
          onPress: () => undefined,
          tone: "neutral",
          variant: "outline",
        },
        {
          label: t("common.confirm"),
          onPress: executeOrder,
          tone: side === "buy" ? "brand" : "danger",
          variant: "filled",
        },
      ],
      body: t("order.confirmSubmitBody", {
        lots: formatLots(lots, locale),
        orderType: orderTypeLabel(orderType, locale),
        price: formatPrice(instrument, orderPrice),
        side: directionLabel(side, locale),
        symbol: instrument.symbol,
      }),
      dedupeKey: "order-submit-confirm",
      icon: "icon.security.risk_shield",
      priority: "critical",
      riskLevel: "high",
      title: t("order.confirmSubmitTitle"),
      tone: "danger",
    });
  };

  const confirmOneClickTradingChange = (nextValue: boolean) => {
    overlayQueue.enqueueAlert({
      actions: [
        {
          label: t("common.cancel"),
          onPress: () => undefined,
          tone: "neutral",
          variant: "outline",
        },
        {
          label: t(
            nextValue
              ? "order.oneClick.enableCta"
              : "order.oneClick.disableCta",
          ),
          onPress: () => {
            setOneClickTradingEnabled(nextValue);
            void impactLight();
          },
          tone: nextValue ? "brand" : "danger",
          variant: "filled",
        },
      ],
      body: t(
        nextValue ? "order.oneClick.enableBody" : "order.oneClick.disableBody",
      ),
      dedupeKey: "one-click-trading-toggle",
      icon: "icon.security.risk_shield",
      priority: "blocking",
      riskLevel: "high",
      title: t(
        nextValue
          ? "order.oneClick.enableTitle"
          : "order.oneClick.disableTitle",
      ),
      tone: nextValue ? "warning" : "danger",
    });
  };

  useDirtyStateGuard({
    body: t("overlay.dirty.order.body"),
    confirmLabel: t("overlay.dirty.exit"),
    dirty: dirty && !closing,
    stayLabel: t("overlay.dirty.stay"),
    title: t("overlay.dirty.order.title"),
  });

  return (
    <SafeAreaView edges={["top"]} style={styles.modalRoot}>
      <Stack.Screen
        options={{ title: `${instrument.symbol} ${t("order.titleSuffix")}` }}
      />
      <Animated.View
        style={[
          styles.modalBackdrop,
          { backgroundColor: colors.overlay.scrim },
          backdropAnimatedStyle,
        ]}
      >
        <Pressable
          accessibilityLabel={t("common.cancel")}
          disabled={closing}
          onPress={closeTicket}
          style={styles.backdropPressTarget}
        />
      </Animated.View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardPanel}
      >
        <Animated.View style={[styles.sheetMotionLayer, sheetAnimatedStyle]}>
          <SafeAreaView
            edges={keyboardVisible ? [] : ["bottom"]}
            style={StyleSheet.flatten([
              styles.ticketSheet,
              {
                backgroundColor: colors.surface.canvas,
                borderColor: colors.border.subtle,
              },
            ])}
          >
            <Animated.View
              style={styles.handleWrap}
              {...sheetCloseResponder.panHandlers}
            >
              <View
                style={StyleSheet.flatten([
                  styles.handle,
                  { backgroundColor: colors.border.default },
                ])}
              />
            </Animated.View>
            <View style={styles.sheetHeader}>
              <View style={styles.headerAccountBlock}>
                <AppText numberOfLines={1} tone="dim" variant="caption">
                  {t("order.accountNumber", { accountId: account.accountId })}
                </AppText>
                <AppText numberOfLines={1} tone="muted" variant="caption">
                  {t("order.freeMargin")}
                </AppText>
                <AppText
                  adjustsFontSizeToFit
                  numberOfLines={1}
                  variant="titleMd"
                >
                  {formatMoney(account.freeMargin, account.currency, 2, locale)}
                </AppText>
              </View>
              <View style={styles.headerInstrumentBlock}>
                <View style={styles.headerInstrumentIdentity}>
                  <InstrumentIcon instrument={instrument} size={32} />
                  <AppText numberOfLines={1} variant="subtitle">
                    {instrument.symbol}
                  </AppText>
                </View>
                <AppText
                  adjustsFontSizeToFit
                  numberOfLines={1}
                  tone={tradeTone}
                  variant="number"
                >
                  {formatPrice(instrument, marketPrice)}
                </AppText>
              </View>
            </View>

            <ScrollView
              contentContainerStyle={styles.sheetContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              style={styles.sheetScroller}
            >
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

              {orderType !== "market" ? (
                <Card>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.fieldTitle}>
                      <AppText variant="subtitle">
                        {t("order.setPrice")}
                      </AppText>
                      <AppText tone="muted" variant="caption">
                        {t(
                          orderType === "limit"
                            ? "order.limitPriceHint"
                            : "order.stopPriceHint",
                          {
                            price: formatPrice(instrument, marketPrice),
                          },
                        )}
                      </AppText>
                    </View>
                  </View>
                  <View
                    style={StyleSheet.flatten([
                      styles.stepper,
                      {
                        backgroundColor: colors.surface.subtle,
                        borderColor: colors.border.subtle,
                      },
                    ])}
                  >
                    <StepperButton
                      label={t("order.decreasePrice")}
                      onPress={() => {
                        void impactLight();
                        setPendingPriceText(
                          stepPrice(
                            instrument,
                            pendingPrice || marketPrice,
                            -1,
                          ),
                        );
                      }}
                      symbol="-"
                    />
                    <TextField
                      containerStyle={styles.stepperInputContainer}
                      error={pendingPriceError}
                      inputStyle={styles.priceInput}
                      keyboardType="decimal-pad"
                      label={t("order.setPrice")}
                      labelHidden
                      onChangeText={setPendingPriceText}
                      placeholder={formatPrice(instrument, marketPrice)}
                      rightSlot={
                        pendingPriceText ? (
                          <NativePressable
                            accessibilityLabel={t("order.clearPrice")}
                            accessibilityRole="button"
                            onPress={() => setPendingPriceText("")}
                            style={styles.clearPriceAction}
                          >
                            <AppIcon
                              name="icon.system.close"
                              sizeVariant="xs"
                              tone="tertiary"
                            />
                          </NativePressable>
                        ) : null
                      }
                      shellStyle={styles.stepperInputShell}
                      value={pendingPriceText}
                    />
                    <StepperButton
                      label={t("order.increasePrice")}
                      onPress={() => {
                        void impactLight();
                        setPendingPriceText(
                          stepPrice(instrument, pendingPrice || marketPrice, 1),
                        );
                      }}
                      symbol="+"
                    />
                  </View>
                  <AppText
                    tone={pendingPriceError ? "danger" : "muted"}
                    variant="caption"
                  >
                    {pendingPriceError ||
                      t(
                        orderType === "limit"
                          ? "order.limitPriceRule"
                          : "order.stopPriceRule",
                      )}
                  </AppText>
                </Card>
              ) : null}

              <Card>
                <View style={styles.cardHeaderRow}>
                  <View>
                    <AppText variant="subtitle">
                      {t("order.positionSize")}
                    </AppText>
                    <AppText tone="muted" variant="caption">
                      {t("order.lotHint", {
                        baseCurrency: instrument.baseCurrency,
                        contractSize: instrument.contractSize,
                      })}
                    </AppText>
                  </View>
                  <View
                    style={StyleSheet.flatten([
                      styles.sidePill,
                      {
                        backgroundColor:
                          side === "buy"
                            ? colors.overlay.up.subtle
                            : colors.overlay.down.subtle,
                        borderColor:
                          side === "buy"
                            ? colors.overlay.up.strong
                            : colors.overlay.down.strong,
                      },
                    ])}
                  >
                    <AppText tone={tradeTone} variant="caption">
                      {directionLabel(side, locale)}
                    </AppText>
                  </View>
                </View>

                <View
                  style={StyleSheet.flatten([
                    styles.sideSwitch,
                    {
                      backgroundColor: colors.surface.subtle,
                      borderColor: colors.border.subtle,
                    },
                  ])}
                >
                  {(["buy", "sell"] as Direction[]).map((item) => {
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
                        ])}
                      >
                        <AppText
                          tone={selected ? "default" : "muted"}
                          variant="subtitle"
                        >
                          {directionLabel(item, locale)}
                        </AppText>
                      </NativePressable>
                    );
                  })}
                </View>

                <View
                  style={StyleSheet.flatten([
                    styles.stepper,
                    {
                      backgroundColor: colors.surface.subtle,
                      borderColor: colors.border.subtle,
                    },
                  ])}
                >
                  <StepperButton
                    label={t("order.decreaseLots")}
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
                    label={t("order.positionSize")}
                    labelHidden
                    onChangeText={setLotsText}
                    placeholder="0.10"
                    shellStyle={styles.stepperInputShell}
                    value={lotsText}
                  />
                  <StepperButton
                    label={t("order.increaseLots")}
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
                        {
                          backgroundColor:
                            lotsText === preset
                              ? side === "buy"
                                ? colors.overlay.up.subtle
                                : colors.overlay.down.subtle
                              : colors.surface.subtle,
                          borderColor:
                            lotsText === preset
                              ? tradeColor
                              : colors.border.subtle,
                        },
                      ])}
                    >
                      <AppText
                        tone={lotsText === preset ? tradeTone : "default"}
                        variant="caption"
                      >
                        {preset}
                      </AppText>
                    </NativePressable>
                  ))}
                </View>

                <View
                  style={StyleSheet.flatten([
                    styles.valueRows,
                    { borderTopColor: colors.border.subtle },
                  ])}
                >
                  <OrderInfoRow
                    label={t("order.notionalValue")}
                    value={formatMoney(notional, "USD", 2, locale)}
                  />
                  <OrderInfoRow
                    label={t("order.estimatedMargin")}
                    tone={margin > account.freeMargin ? "danger" : "default"}
                    value={formatMoney(margin, "USD", 2, locale)}
                  />
                </View>
              </Card>

              <Card>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.riskTitle}>
                    <AppIcon
                      name="icon.security.risk_shield"
                      sizeVariant="sm"
                    />
                    <View>
                      <AppText variant="subtitle">
                        {t("order.riskManagement")}
                      </AppText>
                      <AppText tone="muted" variant="caption">
                        {t("order.riskManagementHint")}
                      </AppText>
                    </View>
                  </View>
                  <SwitchControl
                    accessibilityLabel={t("order.riskManagement")}
                    onValueChange={(nextValue) => {
                      void impactLight();
                      setRiskEnabled(nextValue);
                    }}
                    value={riskEnabled}
                  />
                </View>

                {riskEnabled ? (
                  <View style={styles.riskFields}>
                    <RiskPriceInputRow
                      caption={
                        side === "buy"
                          ? t("order.belowMarket")
                          : t("order.aboveMarket")
                      }
                      instrument={instrument}
                      label={t("order.stopLoss")}
                      onChangeText={setStopLossText}
                      onStep={(directionStep) =>
                        setStopLossText(
                          stepPrice(instrument, stopLossPrice, directionStep),
                        )
                      }
                      pnl={stopLossPnl}
                      price={stopLossPrice}
                      value={stopLossText}
                    />
                    <RiskPriceInputRow
                      caption={
                        side === "buy"
                          ? t("order.aboveMarket")
                          : t("order.belowMarket")
                      }
                      instrument={instrument}
                      label={t("order.takeProfit")}
                      onChangeText={setTakeProfitText}
                      onStep={(directionStep) =>
                        setTakeProfitText(
                          stepPrice(instrument, takeProfitPrice, directionStep),
                        )
                      }
                      pnl={takeProfitPnl}
                      price={takeProfitPrice}
                      value={takeProfitText}
                    />
                  </View>
                ) : null}
              </Card>

              {orderType !== "market" ? (
                <Card>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.fieldTitle}>
                      <AppText variant="subtitle">
                        {t("order.expiration")}
                      </AppText>
                      <AppText tone="muted" variant="caption">
                        {t("order.expirationHint")}
                      </AppText>
                    </View>
                  </View>
                  <SegmentedTabs
                    items={expirationTypes.map((item) => ({
                      label: t(
                        item === "gtc"
                          ? "order.expirationGtc"
                          : "order.expirationSpecified",
                      ),
                      value: item,
                    }))}
                    onValueChange={(nextExpirationType) => {
                      void impactLight();
                      setExpirationType(nextExpirationType);
                    }}
                    value={expirationType}
                  />
                  {expirationType === "specified" ? (
                    <TextField
                      error={expirationError}
                      icon="icon.system.keyboard_digits"
                      label={t("order.expiresAt")}
                      onChangeText={setExpiresAtText}
                      placeholder={defaultExpiresAtText}
                      value={expiresAtText}
                    />
                  ) : (
                    <View
                      style={StyleSheet.flatten([
                        styles.expirationReadOnly,
                        { backgroundColor: colors.surface.subtle },
                      ])}
                    >
                      <AppText variant="body.prominent">
                        {t("order.expirationGtc")}
                      </AppText>
                      <AppText tone="muted" variant="caption">
                        {t("order.expirationGtcHint")}
                      </AppText>
                    </View>
                  )}
                </Card>
              ) : null}

              <Card>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.riskTitle}>
                    <AppIcon
                      name="icon.trading.order_ticket"
                      sizeVariant="sm"
                    />
                    <View>
                      <AppText variant="subtitle">
                        {t("order.summaryTitle")}
                      </AppText>
                      <AppText tone="muted" variant="caption">
                        {t("order.summaryHint")}
                      </AppText>
                    </View>
                  </View>
                  <View
                    style={StyleSheet.flatten([
                      styles.oneClickPill,
                      {
                        backgroundColor: oneClickTradingEnabled
                          ? colors.overlay.warning.subtle
                          : colors.surface.subtle,
                      },
                    ])}
                  >
                    <AppText
                      tone={oneClickTradingEnabled ? "amber" : "muted"}
                      variant="caption"
                    >
                      {t(
                        oneClickTradingEnabled
                          ? "order.oneClick.on"
                          : "order.oneClick.off",
                      )}
                    </AppText>
                  </View>
                </View>
                <View
                  style={StyleSheet.flatten([
                    styles.valueRows,
                    { borderTopColor: colors.border.subtle },
                  ])}
                >
                  <OrderInfoRow
                    label={t("order.orderType")}
                    value={orderTypeLabel(orderType, locale)}
                  />
                  <OrderInfoRow
                    label={t(
                      orderType === "market"
                        ? "order.fillPrice"
                        : "order.requestedPrice",
                    )}
                    value={formatPrice(instrument, orderPrice || marketPrice)}
                  />
                  {orderType !== "market" ? (
                    <OrderInfoRow
                      label={t("order.expiration")}
                      value={
                        expirationType === "gtc"
                          ? t("order.expirationGtc")
                          : shownExpiresAtText
                      }
                    />
                  ) : null}
                  <OrderInfoRow
                    label={t("order.stopLoss")}
                    value={
                      riskEnabled
                        ? formatPrice(instrument, stopLossPrice)
                        : "--"
                    }
                  />
                  <OrderInfoRow
                    label={t("order.takeProfit")}
                    value={
                      riskEnabled
                        ? formatPrice(instrument, takeProfitPrice)
                        : "--"
                    }
                  />
                </View>
                <View
                  style={StyleSheet.flatten([
                    styles.oneClickRow,
                    { borderTopColor: colors.border.subtle },
                  ])}
                >
                  <View style={styles.oneClickCopy}>
                    <AppText variant="subtitle">
                      {t("order.oneClick.title")}
                    </AppText>
                    <AppText tone="muted" variant="caption">
                      {t("order.oneClick.description")}
                    </AppText>
                  </View>
                  <SwitchControl
                    accessibilityLabel={t("order.oneClick.title")}
                    onValueChange={confirmOneClickTradingChange}
                    value={oneClickTradingEnabled}
                  />
                </View>
              </Card>

              <Card compact style={styles.riskNotice}>
                <AppIcon name="icon.risk.info" sizeVariant="xs" tone="amber" />
                <AppText numberOfLines={3} tone="amber" variant="caption">
                  {t("risk.order")}
                </AppText>
              </Card>
            </ScrollView>

            <View
              style={StyleSheet.flatten([
                styles.footerStack,
                keyboardVisible && styles.footerStackKeyboard,
                {
                  backgroundColor: colors.surface.canvas,
                  borderTopColor: colors.border.subtle,
                },
              ])}
            >
              {errorText ? (
                <AppText numberOfLines={2} tone="danger" variant="caption">
                  {errorText}
                </AppText>
              ) : null}
              <ActionButton
                accessibilityLabel={submitLabel}
                label={submitLabel}
                onPress={submitOrder}
                tone={tradeTone}
                variant="filled"
              />
            </View>
          </SafeAreaView>
        </Animated.View>
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

function RiskPriceInputRow({
  caption,
  instrument,
  label,
  onChangeText,
  onStep,
  pnl,
  price,
  value,
}: {
  caption: string;
  instrument: Instrument;
  label: string;
  onChangeText: (value: string) => void;
  onStep: (direction: -1 | 1) => void;
  pnl: number;
  price: number;
  value: string;
}) {
  return (
    <View style={styles.riskInputBlock}>
      <View style={styles.riskInputHeader}>
        <AppText variant="body.prominent">{label}</AppText>
        <AppText tone={pnl >= 0 ? "success" : "danger"} variant="caption">
          {formatNumber(pnl, 2)}
        </AppText>
      </View>
      <View style={styles.riskStepper}>
        <StepperButton
          label={`${label} -`}
          onPress={() => onStep(-1)}
          symbol="-"
        />
        <TextField
          containerStyle={styles.stepperInputContainer}
          inputStyle={styles.riskPriceInput}
          keyboardType="decimal-pad"
          label={label}
          labelHidden
          onChangeText={onChangeText}
          placeholder={formatPrice(instrument, price)}
          shellStyle={styles.stepperInputShell}
          value={value}
        />
        <StepperButton
          label={`${label} +`}
          onPress={() => onStep(1)}
          symbol="+"
        />
      </View>
      <RiskPriceRow
        caption={caption}
        label={label}
        pnl={pnl}
        price={formatPrice(instrument, price)}
      />
    </View>
  );
}

function parsePositiveNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function stepPrice(instrument: Instrument, value: number, direction: -1 | 1) {
  const nextValue = Math.max(instrument.tickSize, value + instrument.tickSize * direction);
  return formatPrice(instrument, nextValue);
}

function getPendingPriceError(
  orderType: OrderType,
  direction: Direction,
  marketPrice: number,
  pendingPrice: number,
  t: (key: "order.errorPendingPriceRequired" | "order.errorLimitPrice" | "order.errorStopPrice") => string,
) {
  if (pendingPrice <= 0) {
    return t("order.errorPendingPriceRequired");
  }

  if (orderType === "limit") {
    const invalid = direction === "buy" ? pendingPrice >= marketPrice : pendingPrice <= marketPrice;
    return invalid ? t("order.errorLimitPrice") : "";
  }

  if (orderType === "stop") {
    const invalid = direction === "buy" ? pendingPrice <= marketPrice : pendingPrice >= marketPrice;
    return invalid ? t("order.errorStopPrice") : "";
  }

  return "";
}

function getDefaultExpirationText(locale: Locale) {
  const date = new Date();
  date.setDate(date.getDate() + DEFAULT_EXPIRY_OFFSET_DAYS);
  date.setHours(23, 59, 0, 0);

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getRiskPrice(
  instrument: Instrument,
  price: number,
  direction: Direction,
  kind: "stopLoss" | "takeProfit",
) {
  const distance = Math.max(instrument.pipSize * 20, price * 0.012);
  const multiplier = kind === "takeProfit" ? 1 : -1;
  const sideMultiplier = direction === "buy" ? 1 : -1;

  return price + distance * multiplier * sideMultiplier;
}

function getRiskPnl(
  instrument: Instrument,
  lots: number,
  entryPrice: number,
  riskPrice: number,
  direction: Direction,
) {
  const multiplier = direction === "buy" ? 1 : -1;

  return (riskPrice - entryPrice) * multiplier * lots * instrument.contractSize;
}

const styles = StyleSheet.create({
  accountCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  cardHeaderRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  clearPriceAction: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: size.touch.min,
    minWidth: size.touch.min,
  },
  expirationReadOnly: {
    borderRadius: radius.md,
    gap: spacing.xxs,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  fieldTitle: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  backdropPressTarget: {
    flex: 1,
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
    height: size.sheet.handleHeight,
    width: size.sheet.handleWidth,
  },
  handleWrap: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: layout.headerIconButtonSize,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
  },
  headerAccountBlock: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  headerInstrumentBlock: {
    alignItems: "flex-end",
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  headerInstrumentIdentity: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    maxWidth: "100%",
  },
  keyboardPanel: {
    height: "94%",
    justifyContent: "flex-end",
    position: "relative",
    width: "100%",
    zIndex: zIndex.raised,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: zIndex.base,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  preset: {
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  oneClickCopy: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  oneClickPill: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  oneClickRow: {
    alignItems: "center",
    borderTopWidth: lineWidth.hairline,
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.md,
  },
  priceInput: {
    ...typography.titleMd,
    textAlign: "center",
  },
  riskFields: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  riskInputBlock: {
    gap: spacing.xs,
  },
  riskInputHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  riskPriceInput: {
    ...typography.bodyLg,
    textAlign: "center",
  },
  riskStepper: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  riskNotice: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
  },
  riskTitle: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
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
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    minHeight: layout.sheetTradeHeaderMinHeight,
    paddingBottom: spacing.sm,
    paddingHorizontal: layout.screenPaddingX,
  },
  sheetScroller: {
    flex: 1,
  },
  sheetMotionLayer: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
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
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.lg,
    padding: spacing.xs,
  },
  sideSwitchButton: {
    alignItems: "center",
    borderColor: "transparent",
    borderRadius: radius.full,
    borderWidth: lineWidth.selected,
    flex: 1,
    justifyContent: "center",
    minHeight: 42,
  },
  stepper: {
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: lineWidth.hairline,
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  stepperInput: {
    ...typography.displayXl,
    textAlign: "center",
  },
  stepperInputContainer: {
    flex: 1,
    minWidth: 0,
  },
  stepperInputShell: {
    borderColor: "transparent",
    minHeight: 50,
    paddingHorizontal: spacing.sm,
  },
  ticketSheet: {
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderTopWidth: lineWidth.hairline,
    flex: 1,
    overflow: "hidden",
    position: "relative",
    width: "100%",
    zIndex: zIndex.raised,
  },
  valueRows: {
    borderTopWidth: lineWidth.hairline,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
  },
});
