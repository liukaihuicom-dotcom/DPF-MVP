import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useState } from "react";

import { layout, lineWidth, radius, spacing } from '@/src/design-public-assets/tokens';
import { ActionButton } from '@/src/design-public-assets/components';
import { bottomSheetPresets, useBottomSheet } from '@/src/design-public-assets/components';
import { ClosedOrderDetailSheet as SharedClosedOrderDetailSheet, createTradingAccountContextSwitcherHeader, FilterPillGroup, PendingOrderDetailSheet as SharedPendingOrderDetailSheet, PositionDetailSheet as SharedPositionDetailSheet, TradingAccountContextSwitcher, TradingOrderActionSheet } from '@/src/design-public-assets/business-components';
import { Card } from '@/src/design-public-assets/components';
import { ConfirmActionSheet } from '@/src/design-public-assets/components';
import { MiniBarChart, TradeOrderList } from '@/src/design-public-assets/components';
import { EmptyState } from '@/src/design-public-assets/components';
import { FundActionGrid } from '@/src/design-public-assets/components';
import { GlobalMenuList } from '@/src/design-public-assets/components';
import { IconSurface } from '@/src/design-public-assets/components';
import {
  KeyValueList,
  type KeyValueListItem,
} from '@/src/design-public-assets/components';
import { Metric } from '@/src/design-public-assets/components';
import { NativePressable } from '@/src/design-public-assets/components';
import { useOverlayQueue } from '@/src/design-public-assets/components';
import { AppIcon } from '@/src/design-public-assets/components';
import { Screen } from '@/src/design-public-assets/components';
import { SegmentedTabs } from '@/src/design-public-assets/components';
import { StatusPill, type StatusPillTone } from '@/src/design-public-assets/components';
import { AppText } from '@/src/design-public-assets/components';
import { getAccountStatusLabel, type TradingAccountProfile } from "@/src/domain/accountProfiles";
import {
  directionLabel,
  formatMoney,
  formatNumber,
  formatPrice,
  formatVolumeMillions,
  localizeText,
  statusLabel,
} from "@/src/domain/format";
import { getFundingOperationActions } from "@/src/domain/funding";
import { buildSharedTradingAccountProfiles } from "@/src/domain/tradingAccountView";
import type { Instrument, OrderType } from "@/src/domain/types";
import type { Locale } from '@/src/design-public-assets/copy';
import { useToast } from "@/src/feedback/Toast";
import { notifySuccess, notifyWarning } from "@/src/feedback/haptics";
import type { AppIconName } from '@/src/design-public-assets/icons';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { useBroker } from "@/src/state/BrokerStore";

function signedPnlTone(value: number) {
  if (value > 0) {
    return "up";
  }

  if (value < 0) {
    return "down";
  }

  return "default";
}

export default function PortfolioScreen() {
  return <TraderPortfolioScreen />;
}

export function TraderPortfolioScreen() {
  const {
    account,
    closePosition,
    deleteOrder,
    findInstrument,
    instruments,
    modifyOrder,
    orders,
    positions,
  } = useBroker();
  const {
    locale,
    colors,
    selectedTradingAccountId,
    setSelectedTradingAccountId,
    t,
    tradingAccountCountPreset,
    tradingAccountDataPreset,
    tradingAccountScenario,
    tradingAccountStatusPreset,
  } = useProductSettings();
  const toast = useToast();
  const overlayQueue = useOverlayQueue();
  const bottomSheet = useBottomSheet();
  const [orderView, setOrderView] = useState<
    "history" | "pending" | "positions"
  >("positions");
  const pnl = positions.reduce(
    (total, position) => total + position.unrealizedPnl,
    0,
  );
  const accountProfiles = buildSharedTradingAccountProfiles(
    account,
    positions,
    tradingAccountScenario,
    {
      countPreset: tradingAccountCountPreset,
      dataPreset: tradingAccountDataPreset,
      statusPreset: tradingAccountStatusPreset,
    },
  );
  const selectedAccount =
    accountProfiles.find(
      (profile) => profile.id === selectedTradingAccountId,
    ) ?? accountProfiles[0];
  const accountSuffix = selectedAccount.accountNo.slice(-4);
  const selectedMarginLevel =
    selectedAccount.marginLevel > 0
      ? formatNumber(selectedAccount.marginLevel, 2, locale)
      : "0.00";
  const anchorInstrument =
    instruments.find((instrument) => instrument.symbol === "EUR/USD") ??
    instruments[0];
  const positionRows = positions.map((position) => {
    const instrument = findInstrument(position.instrumentId);
    return {
      closable: true,
      currentPrice: instrument
        ? formatPrice(instrument, position.currentPrice)
        : formatNumber(position.currentPrice, 2, locale),
      direction: position.direction,
      id: position.id,
      instrument,
      lots: formatNumber(position.lots, 2, locale),
      openPrice: instrument
        ? formatPrice(instrument, position.openPrice)
        : formatNumber(position.openPrice, 2, locale),
      pnl: position.unrealizedPnl,
      symbol: position.symbol,
    };
  });
  const orderRows: PendingOrderRow[] = orders.map((order) => {
    const instrument = findInstrument(order.instrumentId);
    const price = instrument
      ? formatPrice(instrument, order.filledPrice || order.requestedPrice)
      : formatNumber(order.filledPrice || order.requestedPrice, 2, locale);
    const statusTone: PendingOrderRow["statusTone"] =
      order.status === "pending"
        ? "amber"
        : order.status === "closed"
          ? "muted"
          : order.direction === "buy"
            ? "down"
            : "up";
    return {
      canEdit: order.status === "pending",
      direction: order.direction,
      id: order.id,
      instrument,
      lots: formatNumber(order.lots, 2, locale),
      priceRange: `${price} - ${price}`,
      status: statusLabel(order.status, locale),
      statusTone,
      symbol: order.symbol,
      type: order.type,
    };
  });
  const historyRows = getHistoryOrderRows(locale);
  const pendingOrderRows = orderRows.filter((order) => order.canEdit);
  const accountMetricItems: KeyValueListItem[] = [
    {
      id: "balance",
      label: t("account.balance"),
      value: formatMoney(
        selectedAccount.balance,
        selectedAccount.currency,
        2,
        locale,
      ),
    },
    {
      id: "equity",
      label: t("account.equity"),
      value: formatMoney(
        selectedAccount.equity,
        selectedAccount.currency,
        2,
        locale,
      ),
    },
    {
      id: "margin",
      label: t("account.margin"),
      tone: "amber",
      value: formatMoney(
        selectedAccount.usedMargin,
        selectedAccount.currency,
        2,
        locale,
      ),
    },
    {
      id: "free-margin",
      label: t("account.freeMargin"),
      value: formatMoney(
        selectedAccount.freeMargin,
        selectedAccount.currency,
        2,
        locale,
      ),
    },
    {
      id: "margin-level",
      label: `${t("account.marginRate")} (%)`,
      value: selectedMarginLevel,
    },
  ];
  const confirmClose = (positionId: string, symbol: string) => {
    const close = () => {
      closePosition(positionId);
      void notifySuccess();
      overlayQueue.enqueueAlert({
        body: t("portfolio.closeSuccessMessage", { symbol }),
        dedupeKey: `portfolio-close-position-${positionId}`,
        icon: "icon.trading.close_position",
        priority: "critical",
        riskLevel: "high",
        title: t("portfolio.closeSuccessTitle"),
        tone: "success",
      });
    };

    void notifyWarning();

    bottomSheet.push(bottomSheetPresets.detail({
      content: (
        <ConfirmActionSheet
          body={t("portfolio.closeConfirmMessage", { symbol })}
          cancelLabel={t("common.cancel")}
          confirmLabel={t("common.confirm")}
          confirmTone="danger"
          icon="icon.trading.close_position"
          onCancel={bottomSheet.back}
          onConfirm={() => {
            close();
            bottomSheet.hide();
          }}
          title={t("portfolio.closeConfirmTitle")}
        />
      ),
      leftIcon: "icon.trading.close_position",
      title: t("portfolio.closeConfirmTitle"),
    }));
  };
  const openAccountSwitcher = () => {
    const showAddAccountFeedback = () => {
      toast.show({
        message: t("common.demoActionNoAccount"),
        title: t("account.addAccount"),
      });
    };

    bottomSheet.show(bottomSheetPresets.selection({
      ...createTradingAccountContextSwitcherHeader({
        locale,
        onAddAccount: showAddAccountFeedback,
        title: t("funding.account.switchTitle"),
      }),
      contentPadding: "card",
      contentSizing: "auto",
      content: (
        <TradingAccountContextSwitcher
          accounts={accountProfiles}
          mode="detailed"
          onSelect={(nextId) => {
            setSelectedTradingAccountId(nextId);
            bottomSheet.hide();
          }}
          selectedId={selectedAccount.id}
        />
      ),
      heightMode: "adaptive",
      sheetSurface: "canvas",
    }));
  };
  const openAccountMenu = () => {
    bottomSheet.show(bottomSheetPresets.actionMenu({
      content: (
        <AccountMenuSheet
          account={selectedAccount}
          onViewBalance={() => {
            bottomSheet.hide();
            router.push(`/account-balance/${selectedAccount.id}` as never);
          }}
          onViewDetails={() => {
            bottomSheet.hide();
            router.push(`/account-details/${selectedAccount.id}`);
          }}
          onViewBasicInfo={() => {
            bottomSheet.hide();
            router.push(`/account-basic/${selectedAccount.id}` as never);
          }}
        />
      ),
    }));
  };
  const openPositionOptions = () => {
    bottomSheet.show(bottomSheetPresets.detail({
      contentPadding: "plain",
      title: t("portfolio.positionOptionsTitle"),
      content: (
        <TradingOrderActionSheet
          groups={[
            {
              id: "view-mode",
              title: t("portfolio.optionGroupViewMode"),
              items: [
                {
                  description: t("portfolio.optionByOrderDesc"),
                  icon: "icon.trading.order",
                  label: t("portfolio.optionByOrder"),
                  onPress: () => showPositionOptionFeedback(t("portfolio.optionByOrder")),
                },
                {
                  description: t("portfolio.optionBySymbolDesc"),
                  icon: "icon.trading.group_by_symbol",
                  label: t("portfolio.optionBySymbol"),
                  onPress: () => showPositionOptionFeedback(t("portfolio.optionBySymbol")),
                },
              ],
            },
            {
              id: "bulk-actions",
              title: t("portfolio.optionGroupBulkActions"),
              items: [
                {
                  description: t("portfolio.optionCloseAllDesc"),
                  icon: "icon.trading.close_position",
                  label: t("portfolio.optionCloseAll"),
                  onPress: () => showPositionOptionFeedback(t("portfolio.optionCloseAll")),
                },
                {
                  description: t("portfolio.optionCloseLosingDesc"),
                  icon: "icon.trading.close_losing_position",
                  label: t("portfolio.optionCloseLosing"),
                  onPress: () => showPositionOptionFeedback(t("portfolio.optionCloseLosing")),
                },
              ],
            },
          ]}
        />
      ),
    }));
  };
  const openPendingOrderOptions = () => {
    bottomSheet.show(bottomSheetPresets.detail({
      contentPadding: "plain",
      leftIcon: "icon.system.settings",
      title: t("portfolio.pendingOptionsTitle"),
      content: (
        <TradingOrderActionSheet
          groups={[
            {
              id: "list",
              title: t("portfolio.pendingOptionGroupList"),
              items: [
                {
                  description: t("portfolio.pendingOptionSortDesc"),
                  icon: "icon.system.settings",
                  label: t("portfolio.pendingOptionSort"),
                  onPress: () => showPendingOptionFeedback(t("portfolio.pendingOptionSort")),
                },
                {
                  description: t("portfolio.pendingOptionBySymbolDesc"),
                  icon: "icon.trading.group_by_symbol",
                  label: t("portfolio.pendingOptionBySymbol"),
                  onPress: () => showPendingOptionFeedback(t("portfolio.pendingOptionBySymbol")),
                },
              ],
            },
            {
              id: "bulk-actions",
              title: t("portfolio.optionGroupBulkActions"),
              items: [
                {
                  description: t("portfolio.pendingOptionCancelSelectedDesc"),
                  icon: "icon.trading.order",
                  label: t("portfolio.pendingOptionCancelSelected"),
                  onPress: () => showPendingOptionFeedback(t("portfolio.pendingOptionCancelSelected")),
                },
                {
                  description: t("portfolio.pendingOptionCancelAllDesc"),
                  icon: "icon.system.delete",
                  label: t("portfolio.pendingOptionCancelAll"),
                  onPress: () => showPendingOptionFeedback(t("portfolio.pendingOptionCancelAll")),
                },
              ],
            },
          ]}
        />
      ),
    }));
  };
  const showPositionOptionFeedback = (title: string) => {
    toast.show({
      message: t("common.demoActionNoPosition"),
      title,
      tone: "default",
    });
    bottomSheet.hide();
  };
  const showPendingOptionFeedback = (title: string) => {
    toast.show({
      message: t("common.demoActionNoPendingOrder"),
      title,
      tone: "default",
    });
    bottomSheet.hide();
  };
  const openPositionDetail = (position: (typeof positionRows)[number]) => {
    bottomSheet.show(bottomSheetPresets.actionMenu({
      sheetSurface: "canvas",
      content: <PositionDetailSheet position={position} />,
      footer: [
        {
          icon: "icon.system.settings",
          label: t("portfolio.action.modifyPosition"),
          onPress: () => {
            overlayQueue.enqueueAlert({
              body: t("portfolio.positionCannotModify"),
              dedupeKey: `portfolio-position-modify-blocked-${position.id}`,
              icon: "icon.status.rejected",
              priority: "critical",
              riskLevel: "high",
              title: t("portfolio.action.modifyPosition"),
              tone: "warning",
            });
          },
          tone: "neutral",
        },
        {
          icon: "icon.system.close",
          label: t("portfolio.action.closePosition"),
          onPress: () => {
            if (position.closable) {
              confirmClose(position.id, position.symbol);
            } else {
              overlayQueue.enqueueAlert({
                body: t("portfolio.positionCannotClose"),
                dedupeKey: `portfolio-position-close-blocked-${position.id}`,
                icon: "icon.status.rejected",
                priority: "critical",
                riskLevel: "high",
                title: t("portfolio.positionMutationTitle"),
                tone: "warning",
              });
            }
          },
          tone: "danger",
        },
      ],
    }));
  };
  const openClosedOrderDetail = (order: HistoryOrderRow) => {
    bottomSheet.show(bottomSheetPresets.detail({
      leftIcon: "icon.trading.history",
      title: t("portfolio.closedOrderDetailTitle"),
      content: <ClosedOrderDetailSheet order={order} />,
      sheetSurface: "canvas",
    }));
  };
  const openPendingOrderDetail = (order: (typeof orderRows)[number]) => {
    bottomSheet.show(bottomSheetPresets.actionMenu({
      sheetSurface: "canvas",
      content: <PendingOrderDetailSheet order={order} />,
      footer: [
        {
          icon: "icon.system.settings",
          label: t("portfolio.action.modifyOrder"),
          onPress: () => {
            if (!order.canEdit) {
              overlayQueue.enqueueAlert({
                body: t("portfolio.orderCannotModify"),
                dedupeKey: `portfolio-order-modify-blocked-${order.id}`,
                icon: "icon.status.rejected",
                priority: "critical",
                riskLevel: "high",
                title: t("portfolio.orderMutationTitle"),
                tone: "warning",
              });
              return;
            }

            modifyOrder(order.id);
            overlayQueue.enqueueAlert({
              body: t("portfolio.orderModifiedMessage", { symbol: order.symbol }),
              dedupeKey: `portfolio-order-modified-${order.id}`,
              icon: "icon.trading.order_ticket",
              priority: "critical",
              riskLevel: "high",
              title: t("portfolio.orderModifiedTitle"),
              tone: "success",
            });
          },
          tone: "neutral",
        },
        {
          icon: "icon.system.close",
          label: t("portfolio.action.deleteOrder"),
          onPress: () => {
            if (!order.canEdit) {
              overlayQueue.enqueueAlert({
                body: t("portfolio.orderCannotDelete"),
                dedupeKey: `portfolio-order-delete-blocked-${order.id}`,
                icon: "icon.status.rejected",
                priority: "critical",
                riskLevel: "high",
                title: t("portfolio.orderMutationTitle"),
                tone: "warning",
              });
              return;
            }

            deleteOrder(order.id);
            overlayQueue.enqueueAlert({
              body: t("portfolio.orderDeletedMessage", { symbol: order.symbol }),
              dedupeKey: `portfolio-order-deleted-${order.id}`,
              icon: "icon.trading.close_position",
              priority: "critical",
              riskLevel: "high",
              title: t("portfolio.orderDeletedTitle"),
              tone: "success",
            });
          },
          tone: "down",
        },
      ],
    }));
  };

  return (
    <Screen contentPadding="flush">
      <Card compact style={styles.accountPanel}>
        <View style={styles.accountPanelHeader}>
          <View style={styles.accountHeaderSide} />
          <View style={styles.accountTitleBlock}>
            <AppText
              adjustsFontSizeToFit
              numberOfLines={1}
              tone={signedPnlTone(pnl)}
              variant="largeNumber"
            >
              {formatMoney(pnl, selectedAccount.currency, 2, locale)}
            </AppText>
            <NativePressable
              accessibilityLabel={t("funding.account.accessibilitySwitch")}
              minTouch={layout.touchTargetMin}
              onPress={openAccountSwitcher}
              style={styles.accountSelector}
            >
              <AppText numberOfLines={1} variant="body">
                {t("funding.account.marginLabel", { suffix: accountSuffix })}
              </AppText>
              <AppIcon name="icon.system.chevron_down" sizeVariant="xs" />
            </NativePressable>
          </View>
          <NativePressable
            accessibilityLabel={t("portfolio.accountShortcutsAccessibility")}
            minTouch={layout.touchTargetMin}
            onPress={openAccountMenu}
            style={styles.accountMenuButton}
          >
            <IconSurface icon="icon.navigation.function_center" sizeVariant="md" />
          </NativePressable>
        </View>

        <KeyValueList inset="none" items={accountMetricItems} />
      </Card>

      <View style={styles.orderPageBody}>
        <OrderViewTabs
          counts={{
            history: historyRows.length,
            pending: pendingOrderRows.length,
            positions: positionRows.length,
          }}
          current={orderView}
          onChange={setOrderView}
        />

        <View style={styles.orderContent}>
        {orderView === "positions" ? (
          <>
            <OrderSectionToolbar
              accessibilityLabel={
                t("portfolio.toolbar.positionAccessibility")
              }
              actionLabel={t("top.more")}
              onPress={openPositionOptions}
              subtitle={t("portfolio.positionOptionsSubtitle")}
            />
            {positionRows.length > 0 ? (
              <TradeOrderList
                rows={positionRows.map((position) => ({
                  accessibilityLabel: `${position.symbol} ${directionLabel(position.direction, locale)}`,
                  direction: position.direction,
                  id: position.id,
                  meta: `${position.openPrice} - ${position.currentPrice}`,
                  onPress: () => openPositionDetail(position),
                  quantityLabel: `${directionLabel(position.direction, locale).toLowerCase()} ${position.lots}`,
                  rightTone: signedPnlTone(position.pnl),
                  rightValue: formatNumber(position.pnl, 2, locale),
                  symbol: position.symbol,
                }))}
              />
            ) : (
              <EmptyState
                variant="card"
                actionLabel={t("portfolio.emptyPositionsAction")}
                body={t("portfolio.emptyPositionsGuide")}
                icon="icon.trading.market"
                onAction={
                  anchorInstrument
                    ? () =>
                        router.push(
                          `/order/${anchorInstrument.id}?direction=buy&type=market` as never,
                        )
                    : undefined
                }
                onSecondaryAction={
                  anchorInstrument
                    ? () =>
                        router.push(
                          `/instrument/${anchorInstrument.id}` as never,
                        )
                    : undefined
                }
                secondaryLabel={t("portfolio.emptyViewMarketAction")}
                title={t("portfolio.noCurrentPositions")}
              />
            )}
          </>
        ) : null}

        {orderView === "pending" ? (
          <>
            <OrderSectionToolbar
              accessibilityLabel={
                t("portfolio.toolbar.pendingAccessibility")
              }
              actionLabel={t("top.more")}
              onPress={openPendingOrderOptions}
              subtitle={t("portfolio.pendingOptionsSubtitle")}
            />
            {pendingOrderRows.length > 0 ? (
              <TradeOrderList
                rows={pendingOrderRows.map((order) => ({
                  accessibilityLabel: `${order.symbol} ${directionLabel(order.direction, locale)} ${order.type}`,
                  direction: order.direction,
                  id: order.id,
                  meta: order.priceRange,
                  onPress: () => openPendingOrderDetail(order),
                  quantityLabel: `${directionLabel(order.direction, locale).toLowerCase()} ${order.type === "limit" ? "limit " : ""}${order.lots}`,
                  rightTone:
                    order.statusTone === "amber"
                      ? "amber"
                      : order.statusTone === "up"
                        ? "up"
                        : order.statusTone === "down"
                          ? "down"
                          : "dim",
                  rightValue: order.status,
                  showDisclosure: true,
                  symbol: order.symbol,
                }))}
              />
            ) : (
              <EmptyState
                variant="card"
                actionLabel={t("portfolio.emptyPendingAction")}
                body={t("portfolio.emptyPendingGuide")}
                icon="icon.trading.order"
                onAction={
                  anchorInstrument
                    ? () =>
                        router.push(
                          `/order/${anchorInstrument.id}?direction=buy&type=limit` as never,
                        )
                    : undefined
                }
                onSecondaryAction={
                  anchorInstrument
                    ? () =>
                        router.push(
                          `/instrument/${anchorInstrument.id}` as never,
                        )
                    : undefined
                }
                secondaryLabel={t("portfolio.emptyViewMarketAction")}
                title={t("portfolio.noPendingOrders")}
              />
            )}
          </>
        ) : null}

        {orderView === "history" ? (
          <HistoryOrdersView
            orders={historyRows}
            onOpenOrder={openClosedOrderDetail}
          />
        ) : null}
        </View>
      </View>
    </Screen>
  );
}

function OrderViewTabs({
  counts,
  current,
  onChange,
}: {
  counts: Record<"history" | "pending" | "positions", number>;
  current: "history" | "pending" | "positions";
  onChange: (view: "history" | "pending" | "positions") => void;
}) {
  const { t } = useProductSettings();
  const items: { id: "history" | "pending" | "positions"; label: string }[] = [
    { id: "positions", label: t("portfolio.tab.positions") },
    { id: "pending", label: t("portfolio.tab.pending") },
    { id: "history", label: t("portfolio.tab.history") },
  ];

  return (
    <SegmentedTabs
      items={items.map((item) => ({
        accessibilityLabel: item.label,
        label: `${item.label} ${counts[item.id]}`,
        value: item.id,
      }))}
      labelSize="large"
      onValueChange={onChange}
      style={styles.orderTabs}
      value={current}
      variant="underline"
    />
  );
}

function AccountMenuSheet({
  account,
  onViewBasicInfo,
  onViewBalance,
  onViewDetails,
}: {
  account: TradingAccountProfile;
  onViewBasicInfo: () => void;
  onViewBalance: () => void;
  onViewDetails: () => void;
}) {
  const { locale, colors, t } = useProductSettings();
  const status = getAccountStatusLabel(account.group, locale);
  const statusTone: StatusPillTone =
    account.group === "demo"
      ? "brand"
      : account.group === "readOnly"
        ? "warning"
        : "success";
  const statusIcon =
    account.group === "readOnly"
      ? "icon.security.lock"
      : account.group === "demo"
        ? "icon.account.avatar"
        : "icon.status.verified";
  const menuItems = [
    {
      icon: "icon.kyc.identity" as const,
      label: t("accountDetails.menuBasicInfo"),
      onPress: onViewBasicInfo,
    },
    { icon: "icon.trading.history" as const, label: t("portfolio.orderRecords") },
    { icon: "icon.wallet.balance" as const, label: t("balance.title"), onPress: onViewBalance },
    { icon: "icon.wallet.transfer" as const, label: t("accountDetails.swap") },
  ];

  return (
    <View style={styles.accountMenuSheet}>
      <View style={styles.menuAccountHeader}>
        <AppText style={styles.menuAccountNo} variant="largeNumber">
          {account.accountNo}
        </AppText>
        <AppText tone="muted" variant="subtitle">
          {t("account.margin")} · {account.currency}
        </AppText>
        <StatusPill icon={statusIcon} label={status} tone={statusTone} />
      </View>

      <FundActionGrid items={getFundingOperationActions(t, account.id)} />

      <View style={StyleSheet.flatten([styles.menuListInset, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
        <GlobalMenuList contained items={menuItems} />
      </View>

      <NativePressable
        accessibilityLabel={t("accountDetails.open")}
        minTouch={spacing.xxl + spacing.xl + spacing.xxs}
        onPress={onViewDetails}
        style={StyleSheet.flatten([
          styles.viewDetailsButton,
          { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle },
        ])}
      >
        <AppText tone="blue" variant="subtitle">
          {t("accountDetails.open")}
        </AppText>
      </NativePressable>
    </View>
  );
}

type PositionDetailRow = {
  closable: boolean;
  currentPrice: string;
  direction: "buy" | "sell";
  id: string;
  instrument?: Instrument;
  lots: string;
  openPrice: string;
  pnl: number;
  symbol: string;
};

type PendingOrderRow = {
  canEdit: boolean;
  direction: "buy" | "sell";
  id: string;
  instrument?: Instrument;
  lots: string;
  priceRange: string;
  status: string;
  statusTone: "amber" | "muted" | "down" | "up";
  symbol: string;
  type: OrderType;
};

function PendingOrderDetailSheet({ order }: { order: PendingOrderRow }) {
  const { locale, t } = useProductSettings();
  const direction = directionLabel(order.direction, locale).toLowerCase();
  const details = [
    { label: t("portfolio.detail.symbol"), value: order.symbol },
    {
      label: t("portfolio.detail.direction"),
      value: `${direction} ${order.lots}`,
    },
    {
      label: t("common.orderType"),
      value: order.type,
    },
    { label: t("portfolio.detail.price"), value: order.priceRange },
    { label: t("portfolio.detail.status"), value: order.status },
  ];

  return (
    <SharedPendingOrderDetailSheet
      detailItems={details}
      summary={{
        direction: order.direction,
        label: direction,
        lots: order.lots,
        priceRange: order.priceRange,
        symbol: order.symbol,
      }}
      title={t("portfolio.detail.pendingOrderTitle")}
    />
  );
}

function PositionDetailSheet({ position }: { position: PositionDetailRow }) {
  const { locale, t } = useProductSettings();
  const direction = directionLabel(position.direction, locale).toLowerCase();
  const details = [
    { label: t("portfolio.detail.symbol"), value: position.symbol },
    {
      label: t("portfolio.detail.direction"),
      value: `${direction} ${position.lots}`,
    },
    { label: t("portfolio.ticket"), value: `${"#"}3339900` },
    { label: t("accountDetails.commission"), value: "-10.00" },
    { label: t("accountDetails.swap"), value: "-7.00" },
    { label: t("portfolio.openTime"), value: "05/01/2026 14:22:39" },
    { label: t("order.stopLoss"), value: "--" },
    { label: t("order.takeProfit"), value: "--" },
  ];

  return (
    <SharedPositionDetailSheet
      detailItems={details}
      summary={{
        direction: position.direction,
        label: direction,
        lots: position.lots,
        symbol: position.symbol,
      }}
      valueHero={{
        emphasis: "strong",
        label: t("portfolio.detail.unrealizedPnl"),
        supportingValue: `${position.openPrice} - ${position.currentPrice}`,
        tone: signedPnlTone(position.pnl),
        value: formatMoney(position.pnl, "USD", 2, locale),
      }}
    />
  );
}

type HistoryOrderRow = {
  closeTime: string;
  commission: number;
  dealId: string;
  delta: string;
  direction: "buy" | "sell";
  id: string;
  lots: string;
  openTime: string;
  priceRange: string;
  pnl: number;
  symbol: string;
  swap: number;
};

function HistoryOrdersView({
  onOpenOrder,
  orders,
}: {
  onOpenOrder: (order: HistoryOrderRow) => void;
  orders: HistoryOrderRow[];
}) {
  const { locale, colors, t } = useProductSettings();
  const realized = orders.reduce((total, order) => total + order.pnl, 0);
  const volume = orders.reduce((total, order) => total + Number(order.lots), 0);
  const profitableOrders = orders.filter((order) => order.pnl >= 0).length;
  const losingOrders = Math.max(0, orders.length - profitableOrders);
  const summaryItems = [
    {
      label: t("portfolio.history.realizedPnl"),
      tone: realized >= 0 ? ("down" as const) : ("up" as const),
      value: formatMoney(realized, "USD", 2, locale),
    },
    {
      label: t("portfolio.history.totalVolume"),
      value: `${formatNumber(volume, 2, locale)} ${t("portfolio.volumeUnit.lot")}`,
    },
    {
      label: t("portfolio.history.closedOrders"),
      value: `${orders.length}`,
    },
  ];

  return (
    <>
      <Card compact style={styles.historySummaryCard}>
        <View style={styles.historySummaryTop}>
          <View style={styles.historySummaryTitle}>
            <AppText variant="subtitle">
              {t("portfolio.history.summaryTitle")}
            </AppText>
            <AppText tone="muted" variant="caption">
              {t("portfolio.history.closedOrderPeriod")}
            </AppText>
          </View>
          <StatusPill
            compact
            icon="icon.trading.history"
            label={t("portfolio.history.filter.last30")}
            tone="neutral"
          />
        </View>
        <View style={styles.historySummaryGrid}>
          {summaryItems.map((item, index) => (
            <View
              key={item.label}
              style={StyleSheet.flatten([
                styles.historySummaryItem,
                index > 0 && {
                  borderLeftColor: colors.border.subtle,
                  borderLeftWidth: lineWidth.hairline,
                },
              ])}
            >
              <AppText
                adjustsFontSizeToFit
                numberOfLines={1}
                tone={item.tone}
                variant="number"
              >
                {item.value}
              </AppText>
              <AppText numberOfLines={1} tone="muted" variant="caption">
                {item.label}
              </AppText>
            </View>
          ))}
        </View>
        <View style={styles.historyOutcomeRow}>
          <View style={styles.historyOutcomeItem}>
            <View
              style={StyleSheet.flatten([
                styles.legendDot,
                { backgroundColor: colors.market.up.fg },
              ])}
            />
            <AppText tone="muted" variant="caption">
              {t("portfolio.history.profitCount", { count: profitableOrders })}
            </AppText>
          </View>
          <View style={styles.historyOutcomeItem}>
            <View
              style={StyleSheet.flatten([
                styles.legendDot,
                { backgroundColor: colors.market.down.fg },
              ])}
            />
            <AppText tone="muted" variant="caption">
              {t("portfolio.history.lossCount", { count: losingOrders })}
            </AppText>
          </View>
        </View>
      </Card>

      <Card compact style={styles.historyChartCard}>
        <View style={styles.historySummaryTop}>
          <View style={styles.historySummaryTitle}>
            <AppText variant="subtitle">
              {t("portfolio.history.realizedPnl")}
            </AppText>
            <AppText tone="muted" variant="caption">
              {t("portfolio.history.realizedPnlDescription")}
            </AppText>
          </View>
          <FilterPillGroup
            items={[{ icon: "icon.trading.history", label: t("portfolio.history.filter.last30"), value: "last30" }]}
            onChange={() => undefined}
            value="last30"
            variant="status"
          />
        </View>
        <MiniBarChart
          tone="up"
          values={[190, 420, 70, 1600, 180, 7600, 180, 1200]}
        />
        <View style={styles.chartLegend}>
          <View
            style={StyleSheet.flatten([
              styles.legendDot,
              { backgroundColor: colors.market.up.fg },
            ])}
          />
          <AppText tone="muted" variant="caption">
            {t("portfolio.history.profitLegend")}
          </AppText>
          <View
            style={StyleSheet.flatten([
              styles.legendDot,
              { backgroundColor: colors.market.down.fg, marginLeft: radius.lg },
            ])}
          />
          <AppText tone="muted" variant="caption">
            {t("portfolio.history.lossLegend")}
          </AppText>
        </View>
      </Card>

      <Card compact style={styles.historyChartCard}>
        <View style={styles.historySummaryTop}>
          <View style={styles.historySummaryTitle}>
            <AppText variant="subtitle">
              {t("portfolio.history.volumeTitle")}
            </AppText>
            <AppText tone="muted" variant="caption">
              {t("portfolio.history.volumeDescription")}
            </AppText>
          </View>
          <FilterPillGroup
            items={[
              { icon: "icon.trading.group_by_symbol", label: t("portfolio.history.filter.symbols"), value: "symbols" },
              { icon: "icon.trading.history", label: t("portfolio.history.filter.last30"), value: "last30" },
            ]}
            onChange={() => undefined}
            value="symbols"
            variant="status"
          />
        </View>
        <MiniBarChart
          tone="amber"
          maxValue={100}
          values={[10, 42, 3, 16, 9, 28, 9, 26]}
        />
        <View style={styles.chartLegend}>
          <View
            style={StyleSheet.flatten([
              styles.legendDot,
              { backgroundColor: colors.status.warning.fg },
            ])}
          />
          <AppText tone="muted" variant="caption">
            {t("portfolio.history.volumeLegend")}
          </AppText>
        </View>
      </Card>

      <View style={styles.historyToolbar}>
        <AppText variant="subtitle">
          {t("portfolio.history.orderListTitle")}
        </AppText>
        <FilterPillGroup
          items={[
            { icon: "icon.trading.history", label: t("portfolio.history.filter.last7"), value: "last7" },
            { icon: "icon.system.settings", label: t("portfolio.history.filter.sort"), value: "sort" },
          ]}
          onChange={() => undefined}
          value="last7"
          variant="status"
        />
      </View>
      <TradeOrderList
        rowMinTouch={spacing.section + radius.lg}
        rows={orders.map((order) => ({
          accessibilityLabel: `${order.symbol} ${directionLabel(order.direction, locale)} ${order.lots}`,
          direction: order.direction,
          id: order.id,
          meta: order.priceRange,
          onPress: () => onOpenOrder(order),
          quantityLabel: `${directionLabel(order.direction, locale).toLowerCase()} ${order.lots}`,
          rightTone: signedPnlTone(order.pnl),
          rightValue: formatNumber(order.pnl, 2, locale),
          symbol: order.symbol,
        }))}
      />
    </>
  );
}

function ClosedOrderDetailSheet({ order }: { order: HistoryOrderRow }) {
  const { locale, t } = useProductSettings();
  const direction = directionLabel(order.direction, locale).toLowerCase();
  const details = [
    { label: t("portfolio.openTime"), value: order.openTime },
    { label: t("portfolio.closeTime"), value: order.closeTime },
    {
      label: t("portfolio.commissionSwap"),
      value: `${formatNumber(order.commission, 2, locale)} / ${formatNumber(order.swap, 2, locale)}`,
    },
    { label: t("portfolio.stopLossTakeProfit"), value: "-/-" },
  ];
  const deals = [0, 1, 2, 3];

  return (
    <SharedClosedOrderDetailSheet
      dealCountLabel={t("portfolio.dealsCount", { count: 3 })}
      deals={deals.map((deal, index) => ({
        delta: order.delta,
        detailItems: index === 1 ? [
          { label: t("portfolio.deal"), value: order.dealId },
          { label: t("accountDetails.swap"), value: "0.90" },
          { label: t("portfolio.openTime"), value: order.openTime },
          { label: t("portfolio.closeTime"), value: order.closeTime },
        ] : undefined,
        id: `${order.id}-${deal}`,
        lots: order.lots,
        pnlText: formatNumber(order.pnl, 2, locale),
        priceRange: order.priceRange,
      }))}
      detailItems={details}
      pnlDelta={order.delta}
      pnlText={formatNumber(order.pnl, 2, locale)}
      summary={{
        direction: order.direction,
        label: direction,
        lots: order.lots,
        priceRange: order.priceRange,
        symbol: order.symbol,
      }}
      ticketLabel={t("portfolio.ticket")}
      ticketValue={`${"#"}14808934`}
    />
  );
}

function OrderSectionToolbar({
  actionLabel,
  accessibilityLabel,
  onPress,
  subtitle,
}: {
  actionLabel: string;
  accessibilityLabel?: string;
  onPress: () => void;
  subtitle: string;
}) {
  const { colors } = useProductSettings();
  return (
    <View style={styles.orderToolbar}>
      <AppText
        numberOfLines={1}
        style={styles.orderToolbarText}
        tone="muted"
        variant="caption"
      >
        {subtitle}
      </AppText>
      <NativePressable
        accessibilityLabel={accessibilityLabel ?? actionLabel}
        minTouch={layout.headerIconButtonSize}
        onPress={onPress}
        style={StyleSheet.flatten([
          styles.orderToolbarAction,
          { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle },
        ])}
      >
        <AppText numberOfLines={1} variant="caption">
          {actionLabel}
        </AppText>
        <AppIcon name="icon.system.more" sizeVariant="sm" />
      </NativePressable>
    </View>
  );
}

function getHistoryOrderRows(_locale: Locale): HistoryOrderRow[] {
  return [
    {
      closeTime: "15/04/2023 12:27:28",
      commission: 0,
      dealId: "90002333",
      delta: "△=10",
      direction: "buy",
      id: "hist-1",
      lots: "5.00",
      openTime: "15/04/2023 12:00:00",
      pnl: 500,
      priceRange: "1887.87 - 1888.87",
      symbol: "XAUUSD",
      swap: -0.9,
    },
    {
      closeTime: "16/04/2023 15:18:10",
      commission: 0,
      dealId: "90002334",
      delta: "△=10",
      direction: "buy",
      id: "hist-2",
      lots: "5.00",
      openTime: "16/04/2023 14:42:00",
      pnl: 500,
      priceRange: "1887.87 - 1888.87",
      symbol: "XAUUSD",
      swap: -0.9,
    },
    {
      closeTime: "18/04/2023 09:52:30",
      commission: 0,
      dealId: "90002335",
      delta: "△=10",
      direction: "buy",
      id: "hist-3",
      lots: "5.00",
      openTime: "18/04/2023 09:12:09",
      pnl: 500,
      priceRange: "1887.87 - 1888.87",
      symbol: "XAUUSD",
      swap: -0.9,
    },
    {
      closeTime: "19/04/2023 18:22:42",
      commission: 0,
      dealId: "90002336",
      delta: "△=10",
      direction: "sell",
      id: "hist-4",
      lots: "5.00",
      openTime: "19/04/2023 17:11:00",
      pnl: -500,
      priceRange: "1887.87 - 1888.87",
      symbol: "XAUUSD",
      swap: -0.9,
    },
    {
      closeTime: "22/04/2023 11:27:28",
      commission: 0,
      dealId: "90002337",
      delta: "△=10",
      direction: "buy",
      id: "hist-5",
      lots: "5.00",
      openTime: "22/04/2023 10:00:00",
      pnl: 500,
      priceRange: "1887.87 - 1888.87",
      symbol: "XAUUSD",
      swap: -0.9,
    },
  ];
}

export function PartnerClientsScreen({ backHref = '/quick', showBack = false }: { backHref?: '/quick' | '/workspace'; showBack?: boolean }) {
  const { partnerClients, upgradeRequest } = useBroker();
  const { locale, t } = useProductSettings();
  const active = partnerClients.filter(
    (client) => client.status === "active",
  ).length;
  const volume = partnerClients.reduce(
    (total, client) => total + client.monthlyVolume,
    0,
  );
  const pending = partnerClients.filter(
    (client) => client.upgradeStatus === "pending",
  ).length;

  return (
    <Screen back={showBack} backHref={backHref} title={t("portfolio.partnerTitle")}>
      <Card highlight>
        <View style={styles.metricRow}>
          <Metric
            label={t("partner.activeClients")}
            tone="up"
            value={`${active}`}
          />
          <Metric
            label={t("partner.clientVolume")}
            value={formatVolumeMillions(volume, locale)}
          />
          <Metric
            label={t("upgrade.pendingCount")}
            tone="amber"
            value={`${pending}`}
          />
        </View>
      </Card>

      {upgradeRequest.status === "pending" ? (
        <View style={styles.sectionTitle}>
          <AppText variant="subtitle">{t("upgrade.pendingList")}</AppText>
          <AppText tone="amber" variant="caption">
            {upgradeRequest.applicantName}
          </AppText>
        </View>
      ) : null}

      {partnerClients.map((client) => (
        <Card key={client.id}>
          <View style={styles.positionTop}>
            <View>
              <AppText variant="subtitle">{client.name}</AppText>
              <AppText tone="muted" variant="caption">
                {client.country} · {client.joinedAt} ·{" "}
                {localizeText(client.lastActive, locale)} ·{" "}
                {client.role === "partner"
                  ? t("role.partner")
                  : t("role.trader")}
              </AppText>
            </View>
            <View style={styles.badgeStack}>
              <StatusPill
                compact
                label={statusLabel(client.status, locale)}
                tone={
                  client.status === "active"
                    ? "success"
                    : client.status === "funded"
                      ? "info"
                      : "neutral"
                }
              />
              {client.upgradeStatus !== "none" ? (
                <StatusPill
                  compact
                  label={t(`upgrade.status.${client.upgradeStatus}`)}
                  tone={
                    client.upgradeStatus === "approved"
                      ? "success"
                      : client.upgradeStatus === "pending"
                        ? "warning"
                        : "neutral"
                  }
                />
              ) : null}
            </View>
          </View>
          <View style={styles.grid}>
            <Metric
              label={t("partner.netDeposit")}
              value={formatMoney(client.netDeposit, "USD", 2, locale)}
            />
            <Metric
              label={t("partner.monthVolume")}
              value={formatVolumeMillions(client.monthlyVolume, locale)}
            />
            <Metric
              label={t("partner.openPositions")}
              value={`${client.openPositions}`}
            />
          </View>
          <ActionButton
            label={t("upgrade.viewProfile")}
            onPress={() => router.push(`/client/${client.id}`)}
            tone={client.upgradeStatus === "pending" ? "amber" : "neutral"}
            variant="outline"
          />
        </Card>
      ))}
    </Screen>
  );
}

export function PartnerClientOrdersRoute() {
  return <PartnerClientsScreen backHref="/workspace" showBack />;
}

const styles = StyleSheet.create({
  accountHeaderSide: {
    height: layout.touchTargetMin,
    width: layout.touchTargetMin,
  },
  accountMenuButton: {
    alignItems: "center",
    borderRadius: radius.full,
    height: layout.touchTargetMin,
    justifyContent: "center",
    width: layout.touchTargetMin,
  },
  accountPanel: {
    borderLeftWidth: lineWidth.none,
    borderRadius: radius.none,
    borderRightWidth: lineWidth.none,
    borderTopWidth: lineWidth.none,
    gap: radius.lg,
    paddingHorizontal: layout.cardPaddingX,
    paddingVertical: layout.cardPaddingY,
  },
  accountPanelHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: layout.touchTargetMin + spacing.sm,
  },
  accountSelector: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    gap: spacing.xs + spacing.xxs,
    minHeight: spacing.xl - spacing.xs,
  },
  accountTitleBlock: {
    alignItems: "center",
    flex: 1,
    gap: spacing.none,
    minWidth: 0,
  },
  badgeStack: {
    alignItems: "flex-end",
    gap: spacing.xs + lineWidth.strong,
  },
  chartLegend: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  grid: {
    flexDirection: "row",
    gap: spacing.sm + spacing.xxs,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  metricRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  accountMenuSheet: {
    gap: spacing.lg,
  },
  menuAccountHeader: {
    alignItems: "center",
    gap: spacing.xs + lineWidth.strong,
    paddingBottom: spacing.xs,
    paddingTop: spacing.sm,
  },
  menuAccountNo: {
    textAlign: "center",
  },
  listCard: {
    paddingVertical: spacing.none,
  },
  historyDivider: {
    height: spacing.xs + spacing.xxs,
    marginHorizontal: -spacing.lg,
  },
  historyOutcomeItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs + spacing.xxs,
  },
  historyOutcomeRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: radius.lg,
    paddingHorizontal: spacing.xxs,
  },
  historyRowSide: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 86,
  },
  historyChartCard: {
    gap: spacing.sm + spacing.xxs,
    padding: radius.lg,
  },
  historySummaryCard: {
    gap: spacing.md,
    padding: radius.lg,
  },
  historySummaryGrid: {
    flexDirection: "row",
    marginHorizontal: -spacing.sm,
  },
  historySummaryItem: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
    paddingHorizontal: spacing.sm,
  },
  historySummaryTitle: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  historySummaryTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm + spacing.xxs,
    justifyContent: "space-between",
  },
  historyToolbar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  legendDot: {
    borderRadius: radius.xs,
    height: spacing.sm + spacing.xxs,
    marginRight: spacing.xs + spacing.xxs,
    width: spacing.sm + spacing.xxs,
  },
  orderMain: {
    flex: 1,
    minWidth: 0,
  },
  orderRow: {
    alignItems: "center",
    borderBottomWidth: lineWidth.hairline,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: spacing.xxl + spacing.xl + spacing.xxs,
    paddingVertical: spacing.sm + spacing.xxs,
  },
  orderSide: {
    alignItems: "flex-end",
    minWidth: 92,
  },
  menuListInset: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    overflow: "hidden",
  },
  orderContent: {
    gap: spacing.sm + spacing.xxs,
    minHeight: spacing.section * 5 + spacing.xxs,
  },
  orderPageBody: {
    gap: spacing.md,
    paddingHorizontal: layout.screenPaddingX,
  },
  orderTabs: {
    height: spacing.xxl + spacing.xl + spacing.xxs,
  },
  orderToolbar: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    minHeight: layout.headerIconButtonSize,
    paddingHorizontal: spacing.xxs,
  },
  orderToolbarAction: {
    alignItems: "center",
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    flexDirection: "row",
    gap: spacing.xs + spacing.xxs,
    paddingHorizontal: spacing.md,
  },
  orderToolbarText: {
    flex: 1,
    minWidth: 0,
  },
  positionTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm + spacing.xxs,
    justifyContent: "space-between",
  },
  sectionTitle: {
    alignItems: "center",
    flexDirection: "row",
    height: layout.touchTargetMin + spacing.xs,
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
  },
  sectionAction: {
    alignItems: "center",
    justifyContent: "center",
  },
  tradeRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  viewDetailsButton: {
    alignItems: "center",
    borderRadius: radius.xl,
    borderWidth: lineWidth.hairline,
    minHeight: spacing.xxl + spacing.xl + spacing.xxs,
  },
});
