export type Role = 'trader' | 'partner';

export type AuthStatus = 'guest' | 'signedIn';

export type AuthChannel = 'email' | 'phone';

export type PinStatus = 'unset' | 'skipped' | 'set';

export type KycStatus = 'notStarted' | 'reviewing' | 'approved' | 'rejected';

export type TradingAccountUsageOverride = 'auto' | 'normal' | 'warning' | 'abnormal';

export type TradingAccountUsageStatus = 'normal' | 'warning' | 'abnormal';

export type TradeWorkspaceDataPreset = 'empty' | 'sample';

export type DiscoverModuleId =
  | 'challenge'
  | 'education'
  | 'community'
  | 'profile'
  | 'onboarding'
  | 'partner'
  | 'markets'
  | 'accounts'
  | 'support'
  | 'rewards';

export type Direction = 'buy' | 'sell';

export type OrderType = 'market' | 'limit' | 'stop';

export type OrderStatus = 'filled' | 'pending' | 'closed' | 'cancelled';

export type TransactionStatus = 'completed' | 'reviewing' | 'rejected';

export type UpgradeStatus = 'none' | 'pending' | 'approved' | 'rejected';

export type LocalizedText = {
  'en-US': string;
  'id-ID'?: string;
  'zh-CN': string;
};

export type InstrumentAssetClass = 'forex' | 'metals' | 'futures' | 'stocks';

export type InstrumentChartTimeframe = '1m' | '5m' | '15m' | '30m' | '1H' | '4H' | '1D' | '1W';

export type InstrumentQuoteStatus = 'live' | 'stale' | 'delayed' | 'closed' | 'restricted';

export type InstrumentMarketStatus = 'open' | 'closed' | 'preMarket' | 'restricted';

export type InstrumentCandle = {
  close: number;
  high: number;
  low: number;
  open: number;
  time: string;
  volume: number;
};

export type Instrument = {
  id: string;
  symbol: string;
  name: LocalizedText;
  assetClass: InstrumentAssetClass;
  baseCurrency: string;
  quoteCurrency: string;
  bid: number;
  ask: number;
  openPrice: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  weekHigh: number;
  weekLow: number;
  yearHigh: number;
  yearLow: number;
  leverage: number;
  spread: number;
  pipSize: number;
  tickSize: number;
  tickValue: number;
  contractSize: number;
  minLot: number;
  maxLot: number;
  lotStep: number;
  marginCurrency: string;
  swapLong: number;
  swapShort: number;
  tradingHours: LocalizedText;
  quoteStatus: InstrumentQuoteStatus;
  quoteUpdatedAt: string;
  marketStatus: InstrumentMarketStatus;
  candlesByTimeframe: Record<InstrumentChartTimeframe, InstrumentCandle[]>;
  favorite: boolean;
  sparkline: number[];
};

export type Order = {
  id: string;
  instrumentId: string;
  symbol: string;
  direction: Direction;
  type: OrderType;
  lots: number;
  requestedPrice: number;
  filledPrice: number;
  marginRequired: number;
  status: OrderStatus;
  createdAt: string;
};

export type Position = {
  id: string;
  instrumentId: string;
  symbol: string;
  direction: Direction;
  lots: number;
  openPrice: number;
  currentPrice: number;
  marginUsed: number;
  unrealizedPnl: number;
  openedAt: string;
};

export type Transaction = {
  id: string;
  type: 'deposit' | 'withdrawal' | 'adjustment';
  amount: number;
  status: TransactionStatus;
  createdAt: string;
  note: LocalizedText;
};

export type Account = {
  accountId: string;
  label: LocalizedText;
  mode: LocalizedText;
  server: string;
  leverageProfile: string;
  currency: string;
  balance: number;
  equity: number;
  usedMargin: number;
  freeMargin: number;
  marginLevel: number;
  credit: number;
  transactions: Transaction[];
};

export type PartnerClient = {
  id: string;
  name: string;
  status: 'invited' | 'funded' | 'active' | 'dormant';
  role: Role;
  upgradeStatus: UpgradeStatus;
  superiorName: string;
  joinedAt: string;
  netDeposit: number;
  monthlyVolume: number;
  openPositions: number;
  lastActive: LocalizedText;
  country: string;
};

export type UpgradeMessage = {
  id: string;
  author: 'trader' | 'superior';
  body: LocalizedText;
  createdAt: string;
};

export type UpgradeRequest = {
  id: string;
  applicantClientId: string;
  applicantName: string;
  superiorName: string;
  status: UpgradeStatus;
  reason: string;
  submittedAt: string;
  messages: UpgradeMessage[];
};

export type Commission = {
  id: string;
  clientId: string;
  clientName: string;
  symbol: string;
  volume: number;
  ratePerMillion: number;
  amount: number;
  status: 'pending' | 'settled';
  period: string;
};

export type PartnerMetrics = {
  month: LocalizedText;
  clients: number;
  activeClients: number;
  monthlyVolume: number;
  pendingCommission: number;
  settledCommission: number;
  conversionRate: number;
  referralCode: string;
  referralLink: string;
};
