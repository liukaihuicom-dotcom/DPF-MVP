import type { TradingAccountProfile } from '@/src/domain/accountProfiles';
import {
  buildFundingMeta,
  type CreateDepositPayload,
  type CreateTransferPayload,
  type CreateWithdrawalPayload,
  type FundingMethodType,
  type FundingOperation,
  type FundingPaymentMethod,
  type FundingRuleConfig,
  type FundingStatus,
  type FundingTradingAccount,
  type FundingTransaction,
  type FundingTransactionFilters,
  type FundingMutationMeta,
} from '@/src/domain/funding';
import type { LocalizedText } from '@/src/domain/types';

export type FundingApi = {
  cancelTransaction: (id: string, meta: FundingMutationMeta) => Promise<FundingTransaction>;
  createDeposit: (payload: CreateDepositPayload) => Promise<FundingTransaction>;
  createTransfer: (payload: CreateTransferPayload) => Promise<FundingTransaction>;
  createWithdrawal: (payload: CreateWithdrawalPayload) => Promise<FundingTransaction>;
  getFundingRules: (operation: FundingOperation, tradingAccountId: string) => Promise<FundingRuleConfig>;
  getPaymentMethods: (operation: Exclude<FundingOperation, 'internal_transfer'>) => Promise<FundingPaymentMethod[]>;
  getTradingAccounts: (profiles: TradingAccountProfile[]) => Promise<FundingTradingAccount[]>;
  getTransaction: (id: string) => Promise<FundingTransaction | null>;
  listTransactions: (filters?: FundingTransactionFilters) => Promise<FundingTransaction[]>;
};

const idText = (en: string, zh: string, id: string): LocalizedText & { 'id-ID': string } => ({
  'en-US': en,
  'id-ID': id,
  'zh-CN': zh,
});

const baseFxQuote = {
  expiresAt: '2026-05-24T10:15:00Z',
  fxQuoteId: 'fxq_idr_usd_demo',
  pair: 'USDIDR' as const,
  rate: 16216.21,
};

const paymentMethods: Record<Exclude<FundingOperation, 'internal_transfer'>, FundingPaymentMethod[]> = {
  deposit: [
    {
      available: true,
      estimatedMinutes: 12,
      icon: 'icon.wallet.balance',
      id: 'pm_va_bca_demo',
      label: idText('Virtual Account', '虚拟账户', 'Virtual Account'),
      type: 'virtual_account',
    },
    {
      available: true,
      estimatedMinutes: 30,
      icon: 'icon.wallet.deposit',
      id: 'pm_bank_transfer_demo',
      label: idText('Bank transfer', '银行转账', 'Transfer bank'),
      type: 'bank_transfer',
    },
    {
      available: false,
      estimatedMinutes: 10,
      icon: 'icon.wallet.transfer',
      id: 'pm_ewallet_demo',
      label: idText('E-wallet', '电子钱包', 'Dompet elektronik'),
      maintenanceNote: idText('Temporary maintenance', '临时维护中', 'Sedang pemeliharaan'),
      type: 'e_wallet',
    },
  ],
  withdrawal: [
    {
      available: true,
      estimatedMinutes: 120,
      icon: 'icon.wallet.balance',
      id: 'pm_bank_payout_demo',
      label: idText('Verified bank account', '已验证银行账户', 'Rekening bank terverifikasi'),
      type: 'bank_transfer',
    },
    {
      available: true,
      estimatedMinutes: 90,
      icon: 'icon.wallet.transfer',
      id: 'pm_ewallet_payout_demo',
      label: idText('Verified e-wallet', '已验证电子钱包', 'Dompet elektronik terverifikasi'),
      type: 'e_wallet',
    },
  ],
};

const initialTransactions: FundingTransaction[] = [
  {
    actualUsdAmount: 92.5,
    amount: 92.5,
    createdAt: '2026-05-24 10:00',
    fee: { currency: 'IDR', feeAmount: 5000, feeType: 'fixed' },
    fxQuote: baseFxQuote,
    id: 'fund_txn_deposit_100001',
    method: paymentMethods.deposit[0],
    note: idText('IDR deposit to trading account', 'IDR 入金至交易账号', 'Setoran dana IDR ke akun trading'),
    operation: 'deposit',
    reference: 'REF-0524-DP1001',
    requestedIdrAmount: 1500000,
    requestedUsdAmount: 92.5,
    riskFlags: [],
    status: 'awaiting_payment',
    targetTradingAccountId: 'account-900054',
    timeline: [
      { at: '2026-05-24 10:00', label: idText('Request submitted', '申请已提交', 'Pengajuan dikirim'), status: 'submitted' },
      { at: '2026-05-24 10:01', label: idText('Waiting for payment', '等待付款', 'Menunggu pembayaran'), status: 'awaiting_payment' },
    ],
    tradingAccountId: 'account-900054',
    updatedAt: '2026-05-24 10:01',
  },
  {
    actualUsdAmount: 280,
    amount: -280,
    createdAt: '2026-05-22 14:20',
    fee: { currency: 'IDR', feeAmount: 7500, feeType: 'fixed' },
    fxQuote: baseFxQuote,
    id: 'fund_txn_withdrawal_100002',
    method: paymentMethods.withdrawal[0],
    note: idText('Withdrawal under review', '出金审核中', 'Penarikan dana sedang ditinjau'),
    operation: 'withdrawal',
    reference: 'REF-0522-WD1002',
    requestedIdrAmount: 4540000,
    requestedUsdAmount: 280,
    riskFlags: ['manual_review'],
    status: 'reviewing',
    timeline: [
      { at: '2026-05-22 14:20', label: idText('Request submitted', '申请已提交', 'Pengajuan dikirim'), status: 'submitted' },
      { at: '2026-05-22 14:22', label: idText('Manual review required', '需要人工审核', 'Perlu tinjauan manual'), status: 'reviewing' },
    ],
    tradingAccountId: 'account-900055',
    updatedAt: '2026-05-22 14:22',
  },
  {
    actualUsdAmount: 120,
    amount: -120,
    createdAt: '2026-05-20 09:16',
    fee: { currency: 'USD', feeAmount: 0, feeType: 'none' },
    id: 'fund_txn_transfer_100003',
    note: idText('Transfer between own accounts', '本人账号间转账', 'Transfer antar akun sendiri'),
    operation: 'internal_transfer',
    reference: 'REF-0520-TR1003',
    requestedUsdAmount: 120,
    riskFlags: [],
    sourceTradingAccountId: 'account-900054',
    status: 'completed',
    targetTradingAccountId: 'account-900055',
    timeline: [
      { at: '2026-05-20 09:16', label: idText('Request submitted', '申请已提交', 'Pengajuan dikirim'), status: 'submitted' },
      { at: '2026-05-20 09:17', label: idText('Transfer completed', '转账已完成', 'Transfer selesai'), status: 'completed' },
    ],
    updatedAt: '2026-05-20 09:17',
  },
];

function cloneTransactions(rows: FundingTransaction[]) {
  return rows.map((transaction) => ({
    ...transaction,
    riskFlags: [...transaction.riskFlags],
    timeline: transaction.timeline.map((item) => ({ ...item })),
  }));
}

let transactions: FundingTransaction[] = cloneTransactions(initialTransactions);

export type FundingDevPreset = 'default' | 'awaitingPayment' | 'reviewing' | 'cancelled';

export function resetMockFundingTransactions() {
  transactions = cloneTransactions(initialTransactions);
}

export function applyMockFundingPreset(preset: FundingDevPreset) {
  resetMockFundingTransactions();

  if (preset === 'awaitingPayment') {
    transactions = transactions.map((transaction, index) =>
      index === 0
        ? {
            ...transaction,
            status: 'awaiting_payment',
            updatedAt: '2026-05-24 10:01',
          }
        : transaction,
    );
    return;
  }

  if (preset === 'reviewing') {
    transactions = transactions.map((transaction, index) =>
      index === 0
        ? {
            ...transaction,
            riskFlags: ['manual_review'],
            status: 'reviewing',
            timeline: [
              ...transaction.timeline,
              { at: '2026-05-24 10:03', label: idText('Manual review required', '需要人工审核', 'Perlu tinjauan manual'), status: 'reviewing' },
            ],
            updatedAt: '2026-05-24 10:03',
          }
        : transaction,
    );
    return;
  }

  if (preset === 'cancelled') {
    transactions = transactions.map((transaction, index) =>
      index === 0
        ? {
            ...transaction,
            status: 'cancelled',
            timeline: [
              ...transaction.timeline,
              { at: '2026-05-24 10:09', label: idText('Request cancelled', '申请已取消', 'Permintaan dibatalkan'), status: 'cancelled' },
            ],
            updatedAt: '2026-05-24 10:09',
          }
        : transaction,
    );
  }
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 220));
}

function accountStatusFromProfile(profile: TradingAccountProfile): FundingTradingAccount['group'] {
  return profile.group === 'active' || profile.group === 'demo' || profile.group === 'readOnly' || profile.group === 'disabled' || profile.group === 'archived'
    ? profile.group
    : 'active';
}

function buildRules(operation: FundingOperation): FundingRuleConfig {
  const isTransfer = operation === 'internal_transfer';
  const isWithdrawal = operation === 'withdrawal';

  return {
    dailyLimit: isTransfer ? 5000 : 80000000,
    fee: isTransfer
      ? { currency: 'USD', feeAmount: 0, feeType: 'none' }
      : { currency: 'IDR', feeAmount: isWithdrawal ? 7500 : 5000, feeType: 'fixed' },
    fxQuote: baseFxQuote,
    maxAmount: isTransfer ? 5000 : 50000000,
    minAmount: isTransfer ? 10 : 100000,
    monthlyLimit: isTransfer ? 50000 : 250000000,
    operation,
  };
}

function createTimeline(operation: FundingOperation, status: FundingStatus) {
  const base = [{ at: '2026-05-24 10:00', label: idText('Request submitted', '申请已提交', 'Pengajuan dikirim'), status: 'submitted' as FundingStatus }];

  if (operation === 'deposit') {
    return [
      ...base,
      { at: '2026-05-24 10:01', label: idText('Waiting for payment', '等待付款', 'Menunggu pembayaran'), status: 'awaiting_payment' as FundingStatus },
      ...(status === 'completed'
        ? [{ at: '2026-05-24 10:14', label: idText('USD credit completed', 'USD 入账完成', 'Kredit USD selesai'), status }]
        : []),
    ];
  }

  if (operation === 'withdrawal') {
    return [
      ...base,
      { at: '2026-05-24 10:02', label: idText('Manual review required', '需要人工审核', 'Perlu tinjauan manual'), status: 'reviewing' as FundingStatus },
    ];
  }

  return [
    ...base,
    { at: '2026-05-24 10:01', label: idText('Transfer completed', '转账已完成', 'Transfer selesai'), status: 'completed' as FundingStatus },
  ];
}

function makeTransaction(partial: Omit<FundingTransaction, 'createdAt' | 'id' | 'reference' | 'timeline' | 'updatedAt'>): FundingTransaction {
  const stamp = Date.now().toString(36);
  const prefix = partial.operation === 'deposit' ? 'DP' : partial.operation === 'withdrawal' ? 'WD' : 'TR';

  return {
    ...partial,
    createdAt: '2026-05-24 10:00',
    id: `fund_txn_${partial.operation}_${stamp}`,
    reference: `REF-0524-${prefix}${stamp.toUpperCase().slice(-5)}`,
    timeline: createTimeline(partial.operation, partial.status),
    updatedAt: '2026-05-24 10:02',
  };
}

function idrToUsd(amount: number, feeAmount = 0) {
  return Math.max(0, (amount - feeAmount) / baseFxQuote.rate);
}

export const mockFundingApi: FundingApi = {
  async cancelTransaction(id) {
    const existing = transactions.find((item) => item.id === id);
    if (!existing) {
      return delay(null as unknown as FundingTransaction);
    }

    const cancelled = {
      ...existing,
      status: 'cancelled' as const,
      timeline: [
        ...existing.timeline,
        { at: '2026-05-24 10:09', label: idText('Request cancelled', '申请已取消', 'Permintaan dibatalkan'), status: 'cancelled' as const },
      ],
      updatedAt: '2026-05-24 10:09',
    };
    transactions = transactions.map((item) => (item.id === id ? cancelled : item));

    return delay(cancelled);
  },
  async createDeposit(payload) {
    const method = paymentMethods.deposit.find((item) => item.id === payload.paymentMethodId) ?? paymentMethods.deposit[0];
    const fee = { currency: 'IDR' as const, feeAmount: 5000, feeType: 'fixed' as const };
    const usd = idrToUsd(payload.requestedIdrAmount, fee.feeAmount);
    const transaction = makeTransaction({
      actualUsdAmount: undefined,
      amount: usd,
      fee,
      fxQuote: baseFxQuote,
      method,
      note: idText('IDR deposit to trading account', 'IDR 入金至交易账号', 'Setoran dana IDR ke akun trading'),
      operation: 'deposit',
      requestedIdrAmount: payload.requestedIdrAmount,
      requestedUsdAmount: usd,
      riskFlags: [],
      status: payload.requestedIdrAmount >= 10000000 ? 'reviewing' : 'awaiting_payment',
      targetTradingAccountId: payload.tradingAccountId,
      tradingAccountId: payload.tradingAccountId,
    });
    transactions = [transaction, ...transactions];

    return delay(transaction);
  },
  async createTransfer(payload) {
    const transaction = makeTransaction({
      actualUsdAmount: payload.requestedUsdAmount,
      amount: -payload.requestedUsdAmount,
      fee: { currency: 'USD', feeAmount: 0, feeType: 'none' },
      note: idText('Transfer between own accounts', '本人账号间转账', 'Transfer antar akun sendiri'),
      operation: 'internal_transfer',
      requestedUsdAmount: payload.requestedUsdAmount,
      riskFlags: [],
      sourceTradingAccountId: payload.sourceTradingAccountId,
      status: 'completed',
      targetTradingAccountId: payload.targetTradingAccountId,
    });
    transactions = [transaction, ...transactions];

    return delay(transaction);
  },
  async createWithdrawal(payload) {
    const method = paymentMethods.withdrawal.find((item) => item.id === payload.paymentMethodId) ?? paymentMethods.withdrawal[0];
    const fee = { currency: 'IDR' as const, feeAmount: 7500, feeType: 'fixed' as const };
    const usd = idrToUsd(payload.requestedIdrAmount, 0);
    const transaction = makeTransaction({
      actualUsdAmount: undefined,
      amount: -usd,
      fee,
      fxQuote: baseFxQuote,
      method,
      note: idText('Withdrawal under review', '出金审核中', 'Penarikan dana sedang ditinjau'),
      operation: 'withdrawal',
      requestedIdrAmount: payload.requestedIdrAmount,
      requestedUsdAmount: usd,
      riskFlags: ['manual_review'],
      status: 'reviewing',
      tradingAccountId: payload.tradingAccountId,
    });
    transactions = [transaction, ...transactions];

    return delay(transaction);
  },
  async getFundingRules(operation) {
    return delay(buildRules(operation));
  },
  async getPaymentMethods(operation) {
    return delay(paymentMethods[operation]);
  },
  async getTradingAccounts(profiles) {
    return delay(
      profiles.map((profile, index) => ({
        accountNo: profile.accountNo,
        balance: profile.balance,
        currency: 'USD',
        equity: profile.equity,
        freeMargin: profile.freeMargin,
        group: accountStatusFromProfile(profile),
        id: profile.id,
        label: index === 0 ? 'Primary trading account' : `Trading account ${profile.accountNo}`,
        ownerId: 'owner-local-demo',
        server: profile.server,
      })),
    );
  },
  async getTransaction(id) {
    return delay(transactions.find((item) => item.id === id) ?? null);
  },
  async listTransactions(filters = {}) {
    const rows = transactions.filter((item) => {
      const operationMatch = !filters.operation || filters.operation === 'all' || item.operation === filters.operation;
      const statusMatch = !filters.status || filters.status === 'all' || item.status === filters.status;
      const accountMatch =
        !filters.tradingAccountId ||
        item.tradingAccountId === filters.tradingAccountId ||
        item.sourceTradingAccountId === filters.tradingAccountId ||
        item.targetTradingAccountId === filters.tradingAccountId;

      return operationMatch && statusMatch && accountMatch;
    });

    return delay(rows);
  },
};

export function getDefaultFundingMeta() {
  return buildFundingMeta();
}

export function getMethodTypeLabel(type: FundingMethodType) {
  return type.replace('_', '-');
}
