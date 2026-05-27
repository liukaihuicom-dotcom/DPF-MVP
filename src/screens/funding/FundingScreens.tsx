import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ActionButton } from '@/src/components/ActionButton';
import { AppIcon, type AppIconName, type IconTone } from '@/src/components/AppIcon';
import { bottomSheetPresets, useBottomSheet } from '@/src/components/BottomSheet';
import { Card } from '@/src/components/Card';
import { DetailRow } from '@/src/components/data-display';
import { EmptyState } from '@/src/components/feedback';
import { FundActionGrid } from '@/src/components/FundActionGrid';
import { IconSurface, type IconSurfaceTone } from '@/src/components/IconSurface';
import { NativePressable } from '@/src/components/NativePressable';
import { Screen } from '@/src/components/Screen';
import { SegmentedTabs } from '@/src/components/SegmentedTabs';
import { StatusPill, type StatusPillTone } from '@/src/components/StatusPill';
import { TextField } from '@/src/components/TextField';
import { createTradingAccountSwitchHeader, TradingAccountSwitchSheet } from '@/src/components/TradingAccountSwitchSheet';
import { AppText } from '@/src/components/Typography';
import { buildTradingAccountProfiles } from '@/src/domain/accountProfiles';
import {
  buildFundingMeta,
  getFundingOperationActions,
  getFundingOperationIcon,
  getFundingSignedAmount,
  isFundingActiveAccount,
  isFundingFinalStatus,
  type FundingAccountStatus,
  type FundingErrorCode,
  type FundingMethodType,
  type FundingOperation,
  type FundingPaymentMethod,
  type FundingRuleConfig,
  type FundingStatus,
  type FundingTradingAccount,
  type FundingTransaction,
} from '@/src/domain/funding';
import { formatMoney, formatNumber, localizeText } from '@/src/domain/format';
import type { Locale, TranslationKey } from '@/src/i18n/translations';
import { mockFundingApi } from '@/src/services/fundingApi';
import { useToast } from '@/src/feedback/Toast';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';
import { lineWidth, layout, radius, size, spacing } from '@/src/theme/tokens';
import type { KycStatus, TradingAccountUsageStatus } from '@/src/domain/types';

type OperationFilter = FundingOperation | 'all';
type StatusFilter = FundingStatus | 'all';

const operationTabs: { labelKey: TranslationKey; value: OperationFilter }[] = [
  { labelKey: 'funding.operation.all', value: 'all' },
  { labelKey: 'funding.operation.deposit', value: 'deposit' },
  { labelKey: 'funding.operation.withdrawal', value: 'withdrawal' },
];

const depositQuickAmounts = [500000, 1000000, 2000000, 5000000, 20000000];

export function FundingHomeScreen() {
  const { accounts, gate, locale, colors, t, transactions } = useFundingData();
  const primary = accounts[0];
  const recent = transactions.slice(0, 3);

  if (!gate.allowed) {
    return <FundingGateScreen message={gate.reason} />;
  }

  const actionItems = getFundingOperationActions(t, primary?.id);
  const monthlyInflow = transactions
    .filter((transaction) => transaction.operation === 'deposit')
    .reduce((total, transaction) => total + Math.max(0, getFundingSignedAmount(transaction)), 0);
  const pendingCount = transactions.filter((transaction) => !isFundingFinalStatus(transaction.status)).length;

  return (
    <Screen
      align="center"
      back
      backHref="/trade"
      rightActions={[{ icon: 'icon.trading.history', label: t('funding.action.openTransactions'), onPress: () => router.push('/funding/transactions' as never) }]}
      title={t('funding.home.title')}>
      <Card highlight>
        <View style={styles.heroStack}>
          <View style={styles.heroHeader}>
            <IconSurface icon="icon.wallet.balance" sizeVariant="lg" tone="info" />
            <View style={styles.flex}>
              <AppText tone="muted" variant="eyebrow">{t('funding.home.eyebrow')}</AppText>
              <AppText variant="title">{t('funding.home.title')}</AppText>
            </View>
            <StatusPill compact label={primary ? statusLabel(primary.group, t) : t('funding.account.selectFirst')} tone={primary?.group === 'active' ? 'success' : 'warning'} />
          </View>
          <AppText tone="muted" variant="caption">{t('funding.home.subtitle')}</AppText>
          <View style={StyleSheet.flatten([styles.summaryGrid, { borderTopColor: colors.border.subtle }])}>
            <MiniSummary label={t('accountDetails.accountNo')} value={primary?.accountNo ?? '--'} />
            <MiniSummary label={t('funding.account.available')} value={primary ? formatMoney(primary.freeMargin, primary.currency, 0, locale) : '--'} />
          </View>
          <View style={styles.insightGrid}>
            <FundingInsight
              icon="icon.trading.history"
              label={t('funding.home.pending')}
              tone={pendingCount > 0 ? 'warning' : 'success'}
              value={String(pendingCount)}
            />
            <FundingInsight
              icon="icon.wallet.deposit"
              label={t('funding.home.monthlyInflow')}
              tone="info"
              value={formatMoney(monthlyInflow, 'USD', 2, locale)}
            />
          </View>
        </View>
      </Card>
      <FundingRiskBanner />
      <FundActionGrid items={actionItems} />
      <Card>
        <View style={styles.sectionHeader}>
          <AppText variant="subtitle">{t('funding.home.recent')}</AppText>
          <ActionButton label={t('funding.action.openTransactions')} onPress={() => router.push('/funding/transactions' as never)} tone="neutral" variant="text" />
        </View>
        {recent.length === 0 ? (
          <EmptyState body={t('funding.transactions.empty')} />
        ) : (
          <View style={StyleSheet.flatten([styles.listFrame, { borderColor: colors.border.subtle }])}>
            {recent.map((transaction, index) => (
              <FundingTransactionRow
                key={transaction.id}
                onPress={() => router.push(`/funding/transactions/${transaction.id}` as never)}
                showDivider={index < recent.length - 1}
                transaction={transaction}
              />
            ))}
          </View>
        )}
      </Card>
    </Screen>
  );
}

export function DepositScreen() {
  return <FundingFormScreen operation="deposit" />;
}

export function WithdrawalScreen() {
  return <FundingFormScreen operation="withdrawal" />;
}

export function TransferScreen() {
  return <FundingFormScreen operation="internal_transfer" />;
}

function FundingFormScreen({ operation }: { operation: FundingOperation }) {
  const params = useLocalSearchParams<{ accountId?: string }>();
  const { accounts, gate, kycStatus, locale, colors, profiles, t, tradingUsageStatus } = useFundingData();
  const bottomSheet = useBottomSheet();
  const toast = useToast();
  const eligibleAccounts = useMemo(() => accounts.filter((account) => isFundingSelectableAccount(account, tradingUsageStatus)), [accounts, tradingUsageStatus]);
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [targetAccountId, setTargetAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [methods, setMethods] = useState<FundingPaymentMethod[]>([]);
  const [methodId, setMethodId] = useState('');
  const [rules, setRules] = useState<FundingRuleConfig | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  useEffect(() => {
    if (operation === 'internal_transfer') {
      return;
    }

    mockFundingApi.getPaymentMethods(operation).then((rows) => {
      setMethods(rows);
      setMethodId((current) => current || rows.find((item) => item.available)?.id || rows[0]?.id || '');
    });
  }, [operation]);

  useEffect(() => {
    if (accounts.length === 0) {
      return;
    }

    if (params.accountId) {
      if (!sourceAccountId) {
        setSourceAccountId(params.accountId);
      }
      return;
    }

    const current = accounts.find((item) => item.id === sourceAccountId);
    if (isFundingSelectableAccount(current, tradingUsageStatus)) {
      return;
    }

    setSourceAccountId(eligibleAccounts.length === 1 ? eligibleAccounts[0].id : '');
  }, [accounts, eligibleAccounts, params.accountId, sourceAccountId, tradingUsageStatus]);

  useEffect(() => {
    if (!sourceAccountId) {
      setRules(null);
      return;
    }

    mockFundingApi.getFundingRules(operation, sourceAccountId).then(setRules);
  }, [operation, sourceAccountId]);

  useEffect(() => {
    if (operation !== 'internal_transfer' || accounts.length === 0) {
      return;
    }

    if (!sourceAccountId) {
      if (targetAccountId) {
        setTargetAccountId('');
      }
      return;
    }

    if (targetAccountId && targetAccountId !== sourceAccountId && eligibleAccounts.some((item) => item.id === targetAccountId)) {
      return;
    }

    setTargetAccountId(eligibleAccounts.find((item) => item.id !== sourceAccountId)?.id ?? '');
  }, [accounts.length, eligibleAccounts, operation, sourceAccountId, targetAccountId]);

  if (!gate.allowed) {
    return <FundingGateScreen message={gate.reason} />;
  }

  if (accounts.length > 0 && eligibleAccounts.length === 0) {
    return <FundingRestrictedScreen message={t('funding.account.noLiveAccounts')} title={titleForOperation(operation, t)} />;
  }

  const sourceAccount = accounts.find((item) => item.id === sourceAccountId);
  const targetAccount = accounts.find((item) => item.id === targetAccountId);
  const numericAmount = Number(amount) || 0;
  const amountEntered = numericAmount > 0;
  const missingSourceAccount = !sourceAccount;
  const missingTargetAccount = operation === 'internal_transfer' && !targetAccount;
  const accountBlocked = !missingSourceAccount && !isFundingSelectableAccount(sourceAccount, tradingUsageStatus);
  const targetAccountBlocked = operation === 'internal_transfer' && !missingTargetAccount && !isFundingSelectableAccount(targetAccount, tradingUsageStatus);
  const sameTransferAccount = operation === 'internal_transfer' && sourceAccountId === targetAccountId;
  const kycRequired = operation !== 'deposit' && kycStatus !== 'approved';
  const withdrawalDebitUsd = operation === 'withdrawal' && rules ? numericAmount / rules.fxQuote.rate : 0;
  const insufficientBalance = amountEntered && sourceAccount ? (operation === 'internal_transfer' ? numericAmount > sourceAccount.freeMargin : operation === 'withdrawal' ? withdrawalDebitUsd > sourceAccount.freeMargin : false) : false;
  const limitError = amountEntered && rules ? numericAmount < rules.minAmount || numericAmount > rules.maxAmount : false;
  const selectedMethod = methods.find((item) => item.id === methodId);
  const methodBlocked = operation !== 'internal_transfer' && amountEntered ? !selectedMethod?.available : false;
  const missingMethod = operation !== 'internal_transfer' && !selectedMethod;
  const disabledReason = missingSourceAccount
    ? t('funding.account.selectTradingAccount')
    : accountBlocked
      ? t('funding.error.FUNDING_ACCOUNT_NOT_ACTIVE')
      : missingTargetAccount
        ? t('funding.account.selectTarget')
        : targetAccountBlocked
          ? t('funding.error.TRANSFER_TARGET_RESTRICTED')
          : sameTransferAccount
            ? t('funding.error.TRANSFER_SAME_ACCOUNT_NOT_ALLOWED')
            : kycRequired
              ? t('funding.error.FUNDING_KYC_REQUIRED')
              : insufficientBalance
                ? t('funding.error.WITHDRAWAL_INSUFFICIENT_BALANCE')
                : missingMethod || methodBlocked
                  ? t('funding.error.FUNDING_METHOD_UNAVAILABLE')
                  : limitError
                    ? t('funding.error.FUNDING_LIMIT_EXCEEDED')
                    : '';
  const canSubmit = !disabledReason && amountEntered && Boolean(sourceAccountId) && Boolean(rules) && !submitting;
  const expectedUsd = operation === 'internal_transfer' ? numericAmount : rules ? Math.max(0, (numericAmount - (operation === 'deposit' ? rules.fee.feeAmount : 0)) / rules.fxQuote.rate) : 0;
  const title = titleForOperation(operation, t);
  const amountError = limitError ? t('funding.error.FUNDING_LIMIT_EXCEEDED') : insufficientBalance ? t('funding.error.WITHDRAWAL_INSUFFICIENT_BALANCE') : undefined;
  const accountHelper = sourceAccount ? `${sourceAccount.server} · ${t('funding.amount.available')} ${formatMoney(sourceAccount.freeMargin, sourceAccount.currency, 2, locale)}` : t('funding.account.publicEntryHint');
  const methodHelper = selectedMethod ? (amountEntered ? t('funding.method.estimated', { minutes: selectedMethod.estimatedMinutes }) : t('funding.amount.enterFirst')) : undefined;
  const previewRows = buildFundingPreviewRows(operation, numericAmount, expectedUsd, rules, locale, t);
  const footerPreviewRows = buildFundingFooterRows(operation, previewRows);
  const showAddAccountFeedback = () => {
    toast.show({
      message: t('common.demoActionNoChange'),
      title: t('account.addAccount'),
    });
  };

  const openAccountSheet = (mode: 'source' | 'target') => {
    bottomSheet.show(bottomSheetPresets.selection({
      ...createTradingAccountSwitchHeader({
        locale,
        onAddAccount: showAddAccountFeedback,
        title: t('funding.account.switchTitle'),
      }),
      content: (
        <TradingAccountSwitchSheet
          accounts={profiles}
          getDisabledReason={(profile) => {
            const account = accounts.find((item) => item.id === profile.id);
            const sameSource = mode === 'target' && profile.id === sourceAccountId;

            if (sameSource) {
              return t('funding.transfer.sameAccount');
            }

            return getFundingAccountDisabledReason(account, tradingUsageStatus, t);
          }}
          mode="detailed"
          onSelect={(nextId) => {
            if (mode === 'source') {
              setSourceAccountId(nextId);
            } else {
              setTargetAccountId(nextId);
            }
            bottomSheet.hide();
          }}
          selectedId={mode === 'source' ? sourceAccountId : targetAccountId}
        />
      ),
    }));
  };
  const openMethodSheet = () => {
    if (operation === 'internal_transfer') {
      return;
    }

    bottomSheet.show(bottomSheetPresets.selection({
      title: t(operation === 'deposit' ? 'funding.method.selectDeposit' : 'funding.method.selectWithdrawal'),
      content: (
        <PaymentMethodSheet
          methods={methods}
          onSelect={(nextId) => {
            setMethodId(nextId);
            bottomSheet.hide();
          }}
          selectedId={methodId}
        />
      ),
    }));
  };
  const selectMaxAmount = () => {
    if (!sourceAccount) {
      toast.show({ message: t('funding.account.selectTradingAccount'), title: t('funding.account.selectFirst'), tone: 'warning' });
      return;
    }

    if (operation === 'withdrawal') {
      const rate = rules?.fxQuote.rate ?? 0;
      setAmount(rate > 0 ? String(Math.floor(sourceAccount.freeMargin * rate)) : '');
      return;
    }

    setAmount(formatAmountInput(sourceAccount.freeMargin, 'USD'));
  };
  const amountStage = (
    <AmountStageField
      currency={operation === 'internal_transfer' ? 'USD' : 'IDR'}
      error={amountError}
      helperText={amountEntered && !rules ? t('funding.status.validating') : undefined}
      icon={operation === 'internal_transfer' ? 'icon.wallet.transfer' : 'icon.wallet.balance'}
      label={operation === 'internal_transfer' ? t('funding.amount.usd') : t('funding.amount.idr')}
      maxDisabled={operation === 'withdrawal' && Boolean(sourceAccount) && !rules}
      onChangeAmount={setAmount}
      onMaxPress={operation === 'deposit' ? undefined : selectMaxAmount}
      onQuickAmountPress={operation === 'deposit' ? (nextAmount) => setAmount(String(nextAmount)) : undefined}
      quickAmounts={operation === 'deposit' ? depositQuickAmounts : undefined}
      supportingRows={[
        { label: t('funding.amount.available'), value: sourceAccount ? formatMoney(sourceAccount.freeMargin, sourceAccount.currency, 2, locale) : '--' },
      ]}
      value={amount}
    />
  );
  const sourceAccountField = (
    <AccountSheetField
      account={sourceAccount}
      error={missingSourceAccount ? t('funding.account.selectTradingAccount') : accountBlocked ? t('funding.error.FUNDING_ACCOUNT_NOT_ACTIVE') : undefined}
      helperText={accountHelper}
      label={operation === 'internal_transfer' ? t('funding.account.selectSource') : t('accountDetails.accountNo')}
      onPress={() => openAccountSheet('source')}
    />
  );
  const targetAccountField =
    operation === 'internal_transfer' ? (
      <AccountSheetField
        account={targetAccount}
        error={sameTransferAccount ? t('funding.transfer.sameAccount') : targetAccountBlocked ? t('funding.error.TRANSFER_TARGET_RESTRICTED') : missingTargetAccount ? t('funding.account.selectTarget') : undefined}
        label={t('funding.account.selectTarget')}
        onPress={() => openAccountSheet('target')}
      />
    ) : null;
  const methodField =
    operation !== 'internal_transfer' ? (
      <PaymentMethodField
        error={methodBlocked ? t('funding.error.FUNDING_METHOD_UNAVAILABLE') : undefined}
        helperText={methodHelper}
        label={operation === 'deposit' ? t('funding.field.paymentChannel') : t('funding.field.receivingMethod')}
        method={selectedMethod}
        onPress={openMethodSheet}
      />
    ) : null;

  const submit = async () => {
    if (!canSubmit || !rules) {
      return;
    }

    setSubmitting(true);
    const meta = buildFundingMeta();
    const transaction =
      operation === 'deposit'
        ? await mockFundingApi.createDeposit({ ...meta, fxQuoteId: rules.fxQuote.fxQuoteId, paymentMethodId: methodId, requestedIdrAmount: numericAmount, tradingAccountId: sourceAccountId })
        : operation === 'withdrawal'
          ? await mockFundingApi.createWithdrawal({
              ...meta,
              fxQuoteId: rules.fxQuote.fxQuoteId,
              paymentMethodId: methodId,
              payoutAccountId: 'payout_demo_verified',
              requestedIdrAmount: numericAmount,
              tradingAccountId: sourceAccountId,
            })
          : await mockFundingApi.createTransfer({
              ...meta,
              requestedUsdAmount: numericAmount,
              sourceTradingAccountId: sourceAccountId,
              targetTradingAccountId: targetAccountId,
            });
    setSubmitting(false);
    toast.show({ message: transaction.reference, title: t('funding.toast.submitted'), tone: 'success' });
    router.push(`/funding/transactions/${transaction.id}` as never);
  };

  return (
    <Screen
      align="center"
      back
      backHref="/funding"
      keyboardAware
      stickyFooter={(
        <View style={styles.fundingFooter}>
          <FundingFooterSummary
            expanded={summaryExpanded}
            onToggle={() => setSummaryExpanded((current) => !current)}
            rows={footerPreviewRows}
          />
          {disabledReason ? <AppText tone="danger" variant="caption">{disabledReason}</AppText> : null}
          <ActionButton disabled={!canSubmit} label={submitLabel(operation, t)} loading={submitting} onPress={submit} tone="brand" variant="filled" />
        </View>
      )}
      stickyFooterBackground="page"
      title={title}>
      <FundingFormHint />
      <FundingRiskBanner />
      <View style={styles.formFlow}>
        {operation === 'withdrawal' ? (
          <>
            {methodField}
            {amountStage}
            {sourceAccountField}
          </>
        ) : operation === 'internal_transfer' ? (
          <>
            {sourceAccountField}
            {amountStage}
            {targetAccountField}
          </>
        ) : (
          <>
            {sourceAccountField}
            {amountStage}
            {methodField}
          </>
        )}
      </View>
    </Screen>
  );
}

export function FundingTransactionsScreen() {
  const params = useLocalSearchParams<{ accountId?: string; operation?: FundingOperation }>();
  const { gate, colors, t, transactions } = useFundingData({
    operation: params.operation ?? 'all',
    tradingAccountId: params.accountId,
  });
  const [operation, setOperation] = useState<OperationFilter>(params.operation ?? 'all');
  const [rows, setRows] = useState<FundingTransaction[]>(transactions);

  useEffect(() => {
    mockFundingApi.listTransactions({ operation, status: 'all' }).then((nextRows) => {
      setRows(nextRows.filter((row) => row.operation === 'deposit' || row.operation === 'withdrawal'));
    });
  }, [operation, transactions.length]);

  if (!gate.allowed) {
    return <FundingGateScreen message={gate.reason} />;
  }

  const groupedRows = groupFundingTransactionsByDate(rows);

  return (
    <Screen align="center" back backHref="/funding" title={t('funding.transactions.historyTitle')}>
      <FundingRiskBanner />
      <SegmentedTabs items={operationTabs.map((item) => ({ label: t(item.labelKey), value: item.value }))} onValueChange={setOperation} value={operation} />
      <Card>
        {rows.length === 0 ? (
          <EmptyState body={t('funding.transactions.empty')} icon="icon.trading.history" />
        ) : (
          <View style={styles.groupedList}>
            {groupedRows.map((group) => (
              <View key={group.title} style={styles.transactionDateGroup}>
                <AppText tone="muted" variant="caption">{group.title}</AppText>
                <View style={StyleSheet.flatten([styles.listFrame, { borderColor: colors.border.subtle }])}>
                  {group.rows.map((transaction, index) => (
                    <FundingTransactionRow
                      key={transaction.id}
                      onPress={() => router.push(`/funding/transactions/${transaction.id}` as never)}
                      showDivider={index < group.rows.length - 1}
                      transaction={transaction}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </Card>
    </Screen>
  );
}

export function FundingTransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { gate, locale, colors, t } = useFundingData();
  const [transaction, setTransaction] = useState<FundingTransaction | null>(null);

  useEffect(() => {
    if (id) {
      mockFundingApi.getTransaction(id).then(setTransaction);
    }
  }, [id]);

  if (!gate.allowed) {
    return <FundingGateScreen message={gate.reason} />;
  }

  if (!transaction) {
    return (
      <Screen align="center" back backHref="/funding/transactions" title={t('funding.detail.title')}>
        <EmptyState body={t('funding.transactions.empty')} icon="icon.trading.history" />
      </Screen>
    );
  }

  const statusTone = getStatusTone(transaction.status);
  const signedAmount = getFundingSignedAmount(transaction);

  return (
    <Screen align="center" back backHref="/funding/transactions" title={t('funding.detail.title')}>
      <Card highlight>
        <View style={styles.detailHero}>
          <IconSurface icon={detailStatusIcon(transaction.status)} sizeVariant="lg" tone={resolveStatusSurfaceTone(transaction.status)} />
          <StatusPill compact label={statusText(transaction.status, t)} tone={statusTone} />
          <AppText adjustsFontSizeToFit numberOfLines={1} tone={signedAmount >= 0 ? 'down' : 'up'} variant="largeNumber">
            {formatSignedMoney(signedAmount, 'USD', locale)}
          </AppText>
          <AppText tone="muted" variant="caption">{operationText(transaction.operation, t)}</AppText>
        </View>
      </Card>
      <FundingRiskBanner />
      <Card>
        <View style={StyleSheet.flatten([styles.detailRows, { borderColor: colors.border.subtle }])}>
          {buildDetailRows(transaction, locale, t).map((row, index, rows) => (
            <DetailRow key={row.label} row={row} showDivider={index < rows.length - 1} />
          ))}
        </View>
      </Card>
      <Card>
        <AppText variant="subtitle">{t('funding.detail.statusTimeline')}</AppText>
        <View style={styles.timeline}>
          {transaction.timeline.map((item, index) => (
            <View key={`${item.status}-${item.at}`} style={styles.timelineRow}>
              <View style={styles.timelineMarker}>
                <View style={StyleSheet.flatten([styles.timelineDot, { backgroundColor: resolveStatusColor(item.status, colors) }])} />
                {index < transaction.timeline.length - 1 ? <View style={StyleSheet.flatten([styles.timelineLine, { backgroundColor: colors.border.subtle }])} /> : null}
              </View>
              <View style={styles.flex}>
                <AppText variant="caption">{localizeText(item.label, locale)}</AppText>
                <AppText tone="muted" variant="eyebrow">{formatDateTime(item.at, locale)}</AppText>
              </View>
            </View>
          ))}
        </View>
      </Card>
      {!isFundingFinalStatus(transaction.status) ? (
        <ActionButton label={t('funding.action.cancel')} onPress={() => mockFundingApi.cancelTransaction(transaction.id, buildFundingMeta()).then(setTransaction)} tone="neutral" variant="outline" />
      ) : null}
    </Screen>
  );
}

function useFundingData(filters?: { operation?: OperationFilter; tradingAccountId?: string }) {
  const { account, positions } = useBroker();
  const settings = useProductSettings();
  const [accounts, setAccounts] = useState<FundingTradingAccount[]>([]);
  const [transactions, setTransactions] = useState<FundingTransaction[]>([]);
  const profiles = useMemo(
    () =>
      buildTradingAccountProfiles(account, positions, settings.tradingAccountScenario, {
        countPreset: settings.tradingAccountCountPreset,
        dataPreset: settings.tradingAccountDataPreset,
        statusPreset: settings.tradingAccountStatusPreset,
      }),
    [account, positions, settings.tradingAccountCountPreset, settings.tradingAccountDataPreset, settings.tradingAccountScenario, settings.tradingAccountStatusPreset],
  );

  useEffect(() => {
    mockFundingApi.getTradingAccounts(profiles).then(setAccounts);
  }, [profiles]);

  useEffect(() => {
    mockFundingApi.listTransactions(filters).then(setTransactions);
  }, [filters?.operation, filters?.tradingAccountId]);

  return {
    accounts,
    gate: resolveFundingGate(settings.authStatus, settings.role, settings.t),
    kycStatus: settings.kycStatus,
    locale: settings.locale,
    colors: settings.colors,
    profiles,
    t: settings.t,
    tradingUsageStatus: resolveTradingUsageStatus(settings.tradingAccountUsageOverride),
    transactions,
  };
}

function resolveFundingGate(authStatus: string, role: string, t: ReturnType<typeof useProductSettings>['t']) {
  if (authStatus !== 'signedIn' || role !== 'trader') {
    return { allowed: false, reason: t('funding.error.FUNDING_PERMISSION_DENIED') };
  }

  return { allowed: true, reason: '' };
}

function FundingGateScreen({ message }: { message: string }) {
  const { t } = useProductSettings();

  return (
    <Screen align="center" back backHref="/trade" title={t('funding.home.title')}>
      <EmptyState actionLabel={t('auth.action.signIn')} body={message} icon="icon.security.lock" onAction={() => router.push('/auth' as never)} title={t('funding.error.FUNDING_PERMISSION_DENIED')} variant="card" />
    </Screen>
  );
}

function FundingRestrictedScreen({ message, title }: { message: string; title: string }) {
  const { t } = useProductSettings();

  return (
    <Screen align="center" back backHref="/funding" title={title}>
      <FundingRiskBanner />
      <EmptyState body={message} icon="icon.security.lock" title={t('funding.account.activeOnly')} variant="card" />
    </Screen>
  );
}

function AccountSheetField({
  account,
  error,
  helperText,
  label,
  onPress,
}: {
  account?: FundingTradingAccount;
  error?: string;
  helperText?: string;
  label: string;
  onPress: () => void;
}) {
  const { colors, t } = useProductSettings();

  return (
    <View style={styles.sheetFieldWrap}>
      <NativePressable
        accessibilityLabel={label}
        accessibilityRole="button"
        minTouch={58}
        onPress={onPress}
        style={StyleSheet.flatten([styles.sheetField, { backgroundColor: colors.surface.panel, borderColor: error ? colors.status.danger.fg : colors.border.default }])}>
        <SheetFieldIcon icon="icon.account.trading" />
        <View style={styles.flex}>
          <AppText numberOfLines={1} tone="muted" variant="eyebrow">{label}</AppText>
          <AppText numberOfLines={1} variant="body">{account ? `${account.accountNo} · ${statusLabel(account.group, t)}` : label}</AppText>
        </View>
        <AppIcon name="icon.system.chevron_down" sizeVariant="xs" />
      </NativePressable>
      {error ? (
        <AppText style={styles.sheetFieldHelper} tone="danger" variant="caption">{error}</AppText>
      ) : helperText ? (
        <AppText style={styles.sheetFieldHelper} tone="muted" variant="caption">{helperText}</AppText>
      ) : null}
    </View>
  );
}

function PaymentMethodField({
  error,
  helperText,
  label,
  method,
  onPress,
}: {
  error?: string;
  helperText?: string;
  label: string;
  method?: FundingPaymentMethod;
  onPress: () => void;
}) {
  const { locale, colors, t } = useProductSettings();

  return (
    <View style={styles.sheetFieldWrap}>
      <NativePressable
        accessibilityLabel={label}
        accessibilityRole="button"
        minTouch={58}
        onPress={onPress}
        style={StyleSheet.flatten([styles.sheetField, { backgroundColor: colors.surface.panel, borderColor: error ? colors.status.danger.fg : colors.border.default }])}>
        <SheetFieldIcon icon={method?.icon ?? 'icon.wallet.balance'} />
        <View style={styles.flex}>
          <AppText numberOfLines={1} tone="muted" variant="eyebrow">{label}</AppText>
          <AppText numberOfLines={1} variant="body">{method ? localizeText(method.label, locale) : label}</AppText>
        </View>
        {method ? <StatusPill compact label={methodTypeText(method.type, t)} tone="neutral" /> : null}
        <AppIcon name="icon.system.chevron_down" sizeVariant="xs" />
      </NativePressable>
      {error ? (
        <AppText style={styles.sheetFieldHelper} tone="danger" variant="caption">{error}</AppText>
      ) : helperText ? (
        <AppText style={styles.sheetFieldHelper} tone="muted" variant="caption">{helperText}</AppText>
      ) : null}
    </View>
  );
}

function SheetFieldIcon({ icon }: { icon: AppIconName }) {
  return <IconSurface icon={icon} sizeVariant="sm" />;
}

function PaymentMethodSheet({
  methods,
  onSelect,
  selectedId,
}: {
  methods: FundingPaymentMethod[];
  onSelect: (id: string) => void;
  selectedId: string;
}) {
  const { t } = useProductSettings();
  const groups: FundingMethodType[] = ['virtual_account', 'bank_transfer', 'e_wallet'];

  return (
    <View style={styles.methodSheet}>
      {groups.map((type) => {
        const rows = methods.filter((method) => method.type === type);

        if (rows.length === 0) {
          return null;
        }

        return (
          <View key={type} style={styles.methodGroup}>
            <AppText tone="muted" variant="subtitle">{methodTypeText(type, t)} ({rows.length})</AppText>
            {rows.map((method) => (
              <PaymentMethodRow
                key={method.id}
                method={method}
                onPress={() => onSelect(method.id)}
                selected={method.id === selectedId}
              />
            ))}
          </View>
        );
      })}
    </View>
  );
}

function PaymentMethodRow({
  method,
  onPress,
  selected,
}: {
  method: FundingPaymentMethod;
  onPress: () => void;
  selected: boolean;
}) {
  const { locale, colors, t } = useProductSettings();
  const disabled = !method.available;
  const helper = disabled && method.maintenanceNote ? localizeText(method.maintenanceNote, locale) : t('funding.method.estimated', { minutes: method.estimatedMinutes });
  const borderWidth = selected ? lineWidth.selected : lineWidth.hairline;
  const paddingOffset = borderWidth - lineWidth.hairline;
  const selectedBorderColor = colors.text.primary;

  return (
    <NativePressable
      accessibilityLabel={localizeText(method.label, locale)}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      minTouch={72}
      onPress={onPress}
      style={StyleSheet.flatten([
        styles.methodRow,
        {
          backgroundColor: colors.surface.panel,
          borderColor: selected ? selectedBorderColor : colors.border.subtle,
          borderWidth,
          padding: spacing.md - paddingOffset,
        },
        disabled && { opacity: 0.5 },
      ])}>
      <IconSurface background={disabled ? 'hidden' : 'visible'} icon={method.icon} sizeVariant="sm" tone="neutral" />
      <View style={styles.flex}>
        <View style={styles.methodRowTop}>
          <AppText numberOfLines={1} tone={disabled ? 'dim' : 'default'} variant="subtitle">{localizeText(method.label, locale)}</AppText>
          <StatusPill compact label={disabled ? t('funding.method.unavailable') : t('status.active')} tone={disabled ? 'warning' : 'success'} />
        </View>
        <AppText numberOfLines={2} tone="muted" variant="caption">{helper}</AppText>
      </View>
      <AppIcon name={selected ? 'icon.status.verified' : 'icon.system.chevron_right'} sizeVariant="xs" tone={selected ? 'success' : 'tertiary'} />
    </NativePressable>
  );
}

function AmountStageField({
  currency,
  error,
  helperText,
  icon,
  label,
  maxDisabled,
  onChangeAmount,
  onMaxPress,
  onQuickAmountPress,
  quickAmounts,
  supportingRows,
  value,
}: {
  currency: 'IDR' | 'USD';
  error?: string;
  helperText?: string;
  icon: AppIconName;
  label: string;
  maxDisabled?: boolean;
  onChangeAmount: (value: string) => void;
  onMaxPress?: () => void;
  onQuickAmountPress?: (amount: number) => void;
  quickAmounts?: number[];
  supportingRows?: { label: string; value: string }[];
  value: string;
}) {
  const { locale, colors, t } = useProductSettings();

  return (
    <View style={StyleSheet.flatten([styles.amountStageWrap, { backgroundColor: colors.surface.raised, borderColor: error ? colors.status.danger.fg : colors.border.subtle }])}>
      <View style={styles.amountStageHeader}>
        <IconSurface icon={icon} sizeVariant="xs" />
        <View style={styles.flex}>
          <AppText numberOfLines={1} tone="muted" variant="eyebrow">{label}</AppText>
        </View>
        <StatusPill compact label={currency} tone="neutral" />
      </View>
      <TextField
        accessibilityLabel={label}
        error={error}
        inputMode="decimal"
        inputStyle={styles.amountStageInput}
        keyboardType="decimal-pad"
        label={label}
        labelHidden
        onChangeText={onChangeAmount}
        placeholder="0"
        rightSlot={onMaxPress ? (
          <NativePressable
            accessibilityLabel={t('funding.amount.max')}
            accessibilityRole="button"
            accessibilityState={{ disabled: maxDisabled }}
            disabled={maxDisabled}
            minTouch={size.button.textMinTouch}
            onPress={onMaxPress}
            style={styles.amountStageMaxInline}>
            <AppText tone={maxDisabled ? 'dim' : 'brand'} variant="subtitle">{t('funding.amount.max')}</AppText>
          </NativePressable>
        ) : null}
        shellStyle={StyleSheet.flatten([styles.amountStageShell, { backgroundColor: 'transparent', borderBottomColor: error ? colors.status.danger.fg : colors.brand.fg, borderColor: 'transparent' }])}
        value={value}
        variant="stage"
      />
      {supportingRows?.length || helperText ? (
        <View style={styles.amountStageFooter}>
          {supportingRows?.map((row) => (
            <View key={row.label} style={styles.amountStageFooterRow}>
              <AppText numberOfLines={1} tone="muted" variant="caption">{row.label}</AppText>
              <AppText adjustsFontSizeToFit numberOfLines={1} variant="caption">{row.value}</AppText>
            </View>
          ))}
          {helperText ? <AppText tone="muted" variant="caption">{helperText}</AppText> : null}
        </View>
      ) : null}
      {quickAmounts?.length ? (
        <ScrollView
          contentContainerStyle={styles.quickAmountGrid}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {quickAmounts.map((item) => (
            <NativePressable
              accessibilityLabel={`${t('funding.amount.quickAmount')} ${formatCompactAmount(item, currency, locale)}`}
              accessibilityRole="button"
              key={item}
              minTouch={size.tag.chipMinHeight}
              onPress={() => onQuickAmountPress?.(item)}
              style={StyleSheet.flatten([styles.quickAmountChip, { backgroundColor: colors.surface.panel, borderColor: Number(value) === item ? colors.text.tertiary : colors.border.subtle }])}>
              <AppText numberOfLines={1} variant="caption">{formatCompactAmount(item, currency, locale)}</AppText>
            </NativePressable>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

function FundingFormHint() {
  const { t } = useProductSettings();

  return (
    <AppText style={styles.formHint} tone="muted" variant="caption">{t('funding.form.hint')}</AppText>
  );
}

function FundingRiskBanner() {
  const { kycStatus, colors, t } = useProductSettings();
  const kycApproved = kycStatus === 'approved';

  if (kycApproved) {
    return null;
  }

  return (
    <View style={StyleSheet.flatten([styles.riskBanner, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
      <AppIcon tone="amber" name="icon.security.risk_shield" sizeVariant="sm" />
      <View style={styles.flex}>
        <AppText variant="caption">{t('funding.kyc.required')}</AppText>
        <AppText tone="muted" variant="caption">{t('funding.banner.synthetic')}</AppText>
      </View>
    </View>
  );
}

function FundingInsight({
  icon,
  label,
  tone,
  value,
}: {
  icon: AppIconName;
  label: string;
  tone: StatusPillTone;
  value: string;
}) {
  return (
    <View style={styles.insightCell}>
      <StatusPill compact icon={icon} label={label} tone={tone} />
      <AppText adjustsFontSizeToFit numberOfLines={1} variant="subtitle">{value}</AppText>
    </View>
  );
}

function FundingTransactionRow({ onPress, showDivider, transaction }: { onPress: () => void; showDivider?: boolean; transaction: FundingTransaction }) {
  const { locale, colors, t } = useProductSettings();

  return (
    <NativePressable accessibilityLabel={localizeText(transaction.note, locale)} accessibilityRole="button" minTouch={58} onPress={onPress} style={StyleSheet.flatten([styles.transactionRow, showDivider && { borderBottomColor: colors.border.subtle, borderBottomWidth: lineWidth.hairline }])}>
      <IconSurface icon={getFundingOperationIcon(transaction.operation)} sizeVariant="sm" tone={resolveOperationSurfaceTone(transaction.operation)} />
      <View style={styles.flex}>
        <AppText numberOfLines={1} variant="subtitle">{localizeText(transaction.note, locale)}</AppText>
        <AppText numberOfLines={1} tone="muted" variant="caption">{formatDateTime(transaction.createdAt, locale)} · {transaction.reference}</AppText>
      </View>
      <View style={styles.rowSide}>
        <AppText adjustsFontSizeToFit numberOfLines={1} tone={getFundingSignedAmount(transaction) >= 0 ? 'down' : 'up'} variant="subtitle">
          {formatSignedMoney(getFundingSignedAmount(transaction), 'USD', locale)}
        </AppText>
        <StatusPill compact label={statusText(transaction.status, t)} tone={getStatusTone(transaction.status)} />
      </View>
      <AppIcon name="icon.system.chevron_right" size={layout.menuDisclosureIconSize} tone="tertiary" />
    </NativePressable>
  );
}

function MiniSummary({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryCell}>
      <AppText tone="muted" variant="caption">{label}</AppText>
      <AppText adjustsFontSizeToFit numberOfLines={1} variant="subtitle">{value}</AppText>
    </View>
  );
}

function FundingFooterSummary({
  expanded,
  onToggle,
  rows,
}: {
  expanded: boolean;
  onToggle: () => void;
  rows: { label: string; value: string }[];
}) {
  const { colors, t } = useProductSettings();
  const canExpand = rows.length > 1;
  const visibleRows = canExpand && !expanded ? rows.slice(0, 1) : rows;

  return (
    <View style={StyleSheet.flatten([styles.fundingFooterSummary, { borderTopColor: colors.border.subtle }])}>
      <View style={styles.fundingFooterRows}>
        {visibleRows.map((row, index) => (
          <View
            key={row.label}
            style={StyleSheet.flatten([
              styles.fundingFooterRow,
              index > 0 && {
                borderTopColor: colors.border.subtle,
                borderTopWidth: lineWidth.hairline,
              },
            ])}>
            <AppText numberOfLines={1} tone="muted" variant="caption">{row.label}</AppText>
            <View style={styles.fundingFooterRowSide}>
              <AppText adjustsFontSizeToFit numberOfLines={1} variant="caption">{row.value}</AppText>
              {canExpand && index === 0 ? (
                <NativePressable
                  accessibilityLabel={t(expanded ? 'funding.summary.collapse' : 'funding.summary.expand')}
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}
                  minTouch={size.touch.min}
                  onPress={onToggle}
                  style={styles.fundingFooterToggle}>
                  <AppIcon name={expanded ? 'icon.system.chevron_down' : 'icon.system.chevron_right'} sizeVariant="sm" />
                </NativePressable>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function submitLabel(operation: FundingOperation, t: ReturnType<typeof useProductSettings>['t']) {
  return operation === 'deposit' ? t('funding.action.submitDeposit') : operation === 'withdrawal' ? t('funding.action.submitWithdrawal') : t('funding.action.submitTransfer');
}

function titleForOperation(operation: FundingOperation, t: ReturnType<typeof useProductSettings>['t']) {
  return t(operation === 'deposit' ? 'funding.action.deposit' : operation === 'withdrawal' ? 'funding.action.withdrawal' : 'funding.action.transfer');
}

function statusLabel(status: FundingAccountStatus, t: ReturnType<typeof useProductSettings>['t']) {
  if (status === 'active') return t('status.active');
  if (status === 'demo') return t('funding.account.status.demo');
  if (status === 'readOnly') return t('funding.account.status.readOnly');
  if (status === 'disabled') return t('funding.account.status.disabled');
  return t('funding.account.status.archived');
}

function accountRestrictionReason(status: FundingAccountStatus, t: ReturnType<typeof useProductSettings>['t']) {
  if (status === 'demo') {
    return t('funding.account.demoRestricted');
  }

  if (status === 'readOnly') {
    return t('funding.account.readOnlyRestricted');
  }

  if (status === 'disabled') {
    return t('funding.account.disabledRestricted');
  }

  if (status === 'archived') {
    return t('funding.account.archivedRestricted');
  }

  return t('funding.account.activeOnly');
}

function statusText(status: FundingStatus, t: ReturnType<typeof useProductSettings>['t']) {
  const key = `funding.status.${status}` as TranslationKey;
  return t(key);
}

function operationText(operation: FundingOperation, t: ReturnType<typeof useProductSettings>['t']) {
  return t(`funding.operation.${operation}` as TranslationKey);
}

function methodTypeText(type: FundingMethodType, t: ReturnType<typeof useProductSettings>['t']) {
  return t(`funding.method.type.${type}` as TranslationKey);
}

function getStatusTone(status: FundingStatus): StatusPillTone {
  if (status === 'completed' || status === 'paid') return 'success';
  if (status === 'failed' || status === 'rejected' || status === 'expired') return 'danger';
  if (status === 'reviewing' || status === 'awaiting_payment' || status === 'processing') return 'warning';
  return 'neutral';
}

function detailStatusIcon(status: FundingStatus): AppIconName {
  if (status === 'completed' || status === 'paid') return 'icon.status.verified';
  if (status === 'failed' || status === 'rejected' || status === 'expired') return 'icon.status.rejected';
  return 'icon.trading.history';
}

function resolveStatusColor(status: FundingStatus, colors: ReturnType<typeof useProductSettings>['colors']) {
  if (status === 'completed' || status === 'paid') return colors.market.down.fg;
  if (status === 'failed' || status === 'rejected' || status === 'expired') return colors.status.danger.fg;
  if (status === 'reviewing' || status === 'awaiting_payment' || status === 'processing') return colors.status.warning.fg;
  return colors.status.info.fg;
}

function resolveStatusIconTone(status: FundingStatus): IconTone {
  if (status === 'completed' || status === 'paid') return 'down';
  if (status === 'failed' || status === 'rejected' || status === 'expired') return 'danger';
  if (status === 'reviewing' || status === 'awaiting_payment' || status === 'processing') return 'amber';
  return 'blue';
}

function resolveStatusSurfaceTone(status: FundingStatus): IconSurfaceTone {
  if (status === 'completed' || status === 'paid') return 'down';
  if (status === 'failed' || status === 'rejected' || status === 'expired') return 'danger';
  if (status === 'reviewing' || status === 'awaiting_payment' || status === 'processing') return 'warning';
  return 'info';
}

function resolveOperationIconTone(operation: FundingOperation): IconTone {
  if (operation === 'deposit') return 'down';
  if (operation === 'withdrawal') return 'amber';
  return 'blue';
}

function resolveOperationSurfaceTone(operation: FundingOperation): IconSurfaceTone {
  if (operation === 'deposit') return 'down';
  if (operation === 'withdrawal') return 'warning';
  return 'info';
}

function buildDetailRows(transaction: FundingTransaction, locale: Locale, t: ReturnType<typeof useProductSettings>['t']) {
  const rows = [
    { label: t('funding.detail.reference'), value: transaction.reference },
    { label: t('funding.detail.method'), value: transaction.method ? localizeText(transaction.method.label, locale) : t('funding.operation.internal_transfer') },
    { label: t('funding.detail.requestedIdr'), value: transaction.requestedIdrAmount ? formatMoney(transaction.requestedIdrAmount, 'IDR', 0, locale) : '--' },
    { label: t('funding.detail.requestedUsd'), value: transaction.requestedUsdAmount ? formatMoney(transaction.requestedUsdAmount, 'USD', 2, locale) : '--' },
    { label: t('funding.detail.actualUsd'), value: transaction.actualUsdAmount ? formatMoney(transaction.actualUsdAmount, 'USD', 2, locale) : '--' },
    { label: t('funding.detail.fee'), value: formatMoney(transaction.fee.feeAmount, transaction.fee.currency, transaction.fee.currency === 'IDR' ? 0 : 2, locale) },
    { label: t('funding.detail.fxRate'), value: transaction.fxQuote ? `1 USD = ${formatNumber(transaction.fxQuote.rate, 2, locale)} IDR` : '--' },
    { label: t('funding.detail.sourceAccount'), value: transaction.sourceTradingAccountId ?? transaction.tradingAccountId ?? '--' },
    { label: t('funding.detail.targetAccount'), value: transaction.targetTradingAccountId ?? transaction.tradingAccountId ?? '--' },
    { label: t('funding.detail.riskFlags'), value: transaction.riskFlags.length ? transaction.riskFlags.join(', ') : '--' },
  ];

  if (transaction.errorCode) {
    rows.push({ label: t('funding.detail.error'), value: errorText(transaction.errorCode, t) });
  }

  return rows;
}

function errorText(code: FundingErrorCode, t: ReturnType<typeof useProductSettings>['t']) {
  return t(`funding.error.${code}` as TranslationKey);
}

function formatSignedMoney(value: number, currency: string, locale: Locale) {
  const sign = value >= 0 ? '+' : '-';
  return `${sign}${formatMoney(Math.abs(value), currency, 2, locale)}`;
}

function groupFundingTransactionsByDate(rows: FundingTransaction[]) {
  const groups: { rows: FundingTransaction[]; title: string }[] = [];

  rows.forEach((row) => {
    const title = formatDateTitle(row.createdAt);
    const existing = groups.find((group) => group.title === title);

    if (existing) {
      existing.rows.push(row);
      return;
    }

    groups.push({ rows: [row], title });
  });

  return groups;
}

function formatRuleAmount(value: number, operation: FundingOperation, locale: Locale, currency?: string) {
  return formatMoney(value, currency ?? (operation === 'internal_transfer' ? 'USD' : 'IDR'), operation === 'internal_transfer' || currency === 'USD' ? 2 : 0, locale);
}

function buildFundingPreviewRows(
  operation: FundingOperation,
  numericAmount: number,
  expectedUsd: number,
  rules: FundingRuleConfig | null,
  locale: Locale,
  t: ReturnType<typeof useProductSettings>['t'],
) {
  const rows = [
    {
      label: operation === 'withdrawal' ? t('funding.detail.estimatedDebit') : operation === 'internal_transfer' ? t('funding.detail.expectedTransfer') : t('funding.detail.expectedUsd'),
      value: formatMoney(expectedUsd, 'USD', 2, locale),
    },
    {
      label: t('funding.detail.fee'),
      value: rules ? formatRuleAmount(rules.fee.feeAmount, operation, locale, rules.fee.currency) : '--',
    },
  ];

  if (operation !== 'internal_transfer') {
    rows.push({
      label: t('funding.detail.fxRate'),
      value: rules ? `1 USD = ${formatNumber(rules.fxQuote.rate, 2, locale)} IDR` : '--',
    });
    rows.push({
      label: t('funding.detail.requestedIdr'),
      value: numericAmount > 0 ? formatMoney(numericAmount, 'IDR', 0, locale) : '--',
    });
  }

  return rows;
}

function buildFundingFooterRows(operation: FundingOperation, rows: { label: string; value: string }[]) {
  if (operation === 'internal_transfer') {
    return rows;
  }

  const [primary, fee, fxRate] = rows;
  return [primary, fee, fxRate].filter(Boolean);
}

function isFundingSelectableAccount(account: FundingTradingAccount | undefined, tradingUsageStatus: TradingAccountUsageStatus) {
  return isFundingActiveAccount(account) && tradingUsageStatus !== 'abnormal';
}

function getFundingAccountDisabledReason(
  account: FundingTradingAccount | undefined,
  tradingUsageStatus: TradingAccountUsageStatus,
  t: ReturnType<typeof useProductSettings>['t'],
) {
  if (!account) {
    return t('funding.error.FUNDING_ACCOUNT_NOT_ACTIVE');
  }

  if (!isFundingActiveAccount(account)) {
    return accountRestrictionReason(account.group, t);
  }

  if (tradingUsageStatus === 'abnormal') {
    return t('funding.account.abnormalRestricted');
  }

  return undefined;
}

function resolveTradingUsageStatus(override: 'auto' | TradingAccountUsageStatus): TradingAccountUsageStatus {
  return override === 'auto' ? 'normal' : override;
}

function formatAmountInput(value: number, currency: 'IDR' | 'USD') {
  if (!Number.isFinite(value) || value <= 0) {
    return '';
  }

  return currency === 'USD' ? String(Math.floor(value * 100) / 100) : String(Math.floor(value));
}

function formatCompactAmount(value: number, currency: 'IDR' | 'USD', locale: Locale) {
  if (currency === 'IDR' && value >= 1000000) {
    return `${formatNumber(value / 1000000, value % 1000000 === 0 ? 0 : 1, locale)}M`;
  }

  if (currency === 'IDR' && value >= 1000) {
    return `${formatNumber(value / 1000, value % 1000 === 0 ? 0 : 1, locale)}K`;
  }

  return formatMoney(value, currency, currency === 'USD' ? 2 : 0, locale);
}

function formatDateTime(value: string, locale: Locale) {
  const [, , month = '00', day = '00', hour = '00', minute = '00'] = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/.exec(value) ?? [];
  return locale === 'zh-CN' ? `${month}月${day}日 ${hour}:${minute}` : `${month}/${day} ${hour}:${minute}`;
}

function formatDateTitle(value: string) {
  const [, year = '0000', month = '00', day = '00'] = /^(\d{4})-(\d{2})-(\d{2})/.exec(value) ?? [];
  return `${year}-${month}-${day}`;
}

const styles = StyleSheet.create({
  detailHero: {
    alignItems: 'center',
    gap: spacing.md,
  },
  detailRows: {
    borderRadius: radius.md,
    borderWidth: lineWidth.none,
    overflow: 'hidden',
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  formFlow: {
    gap: spacing.md,
  },
  formHint: {
    paddingHorizontal: spacing.sm,
  },
  fundingFooter: {
    gap: spacing.sm,
  },
  fundingFooterRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    minWidth: 0,
    paddingVertical: spacing.xxs,
  },
  fundingFooterRows: {
    gap: spacing.none,
  },
  fundingFooterSummary: {
    borderTopWidth: lineWidth.hairline,
    gap: spacing.xxs,
    paddingTop: spacing.sm,
  },
  fundingFooterRowSide: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    minWidth: 0,
  },
  fundingFooterToggle: {
    alignItems: 'center',
    borderRadius: radius.full,
    justifyContent: 'center',
  },
  groupedList: {
    gap: spacing.md,
  },
  amountStageHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  amountStageInput: {
    minHeight: size.control.lg,
    textAlign: 'center',
  },
  amountStageFooter: {
    gap: spacing.xs,
  },
  amountStageFooterRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    minWidth: 0,
  },
  amountStageMaxInline: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: size.button.textMinTouch,
    minWidth: size.button.textMinTouch,
    paddingHorizontal: spacing.sm,
  },
  amountStageShell: {
    borderBottomWidth: lineWidth.selected,
    borderRadius: radius.none,
    minHeight: size.control.lg,
    paddingHorizontal: spacing.none,
  },
  amountStageWrap: {
    borderRadius: radius.lg,
    borderWidth: lineWidth.none,
    gap: spacing.md,
    paddingHorizontal: layout.cardPaddingX,
    paddingVertical: layout.cardPaddingY,
  },
  heroHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  heroStack: {
    gap: spacing.md,
  },
  insightCell: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  insightGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  listFrame: {
    borderRadius: radius.md,
    borderWidth: lineWidth.none,
    overflow: 'hidden',
  },
  methodGroup: {
    gap: spacing.sm,
  },
  methodRow: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  methodRowTop: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  methodSheet: {
    gap: spacing.lg,
  },
  quickAmountChip: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    justifyContent: 'center',
    minHeight: size.tag.chipMinHeight,
    minWidth: size.control.lg + size.control.md,
    paddingHorizontal: spacing.md,
  },
  quickAmountGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  riskBanner: {
    alignItems: 'flex-start',
    borderRadius: radius.md,
    borderWidth: lineWidth.none,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  sheetField: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: lineWidth.strong,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: size.input.floatingMinHeight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sheetFieldWrap: {
    gap: spacing.xs,
  },
  sheetFieldHelper: {
    paddingLeft: spacing.md,
  },
  rowSide: {
    alignItems: 'flex-end',
    gap: spacing.xs,
    minWidth: size.viewport.detailSideMinWidth,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  summaryCell: {
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
  timeline: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  timelineDot: {
    borderRadius: radius.full,
    height: size.icon.xs + spacing.xxs,
    width: size.icon.xs + spacing.xxs,
  },
  timelineLine: {
    flex: 1,
    width: lineWidth.strong,
  },
  timelineMarker: {
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: spacing.xs,
    paddingTop: spacing.xs,
    width: size.icon.sm,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: size.control.md,
  },
  transactionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.none,
    paddingVertical: spacing.md,
  },
  transactionDateGroup: {
    gap: spacing.sm,
  },
});
