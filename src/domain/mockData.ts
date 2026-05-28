import type { Account, Commission, Instrument, InstrumentCandle, InstrumentChartTimeframe, PartnerClient, PartnerMetrics, UpgradeRequest } from './types';

type BaseInstrument = Omit<
  Instrument,
  | 'candlesByTimeframe'
  | 'lotStep'
  | 'marginCurrency'
  | 'marketStatus'
  | 'maxLot'
  | 'minLot'
  | 'openPrice'
  | 'quoteStatus'
  | 'quoteUpdatedAt'
  | 'swapLong'
  | 'swapShort'
  | 'tickSize'
  | 'tickValue'
  | 'weekHigh'
  | 'weekLow'
  | 'yearHigh'
  | 'yearLow'
>;

const quoteSnapshotTime = '2026-05-28T09:32:00+08:00';
const chartTimeframes: InstrumentChartTimeframe[] = ['1m', '5m', '15m', '30m', '1H', '4H', '1D', '1W'];

const baseInstruments: BaseInstrument[] = [
  {
    id: 'eur-usd',
    symbol: 'EUR/USD',
    name: { 'en-US': 'Euro / US Dollar', 'zh-CN': '欧元兑美元' },
    assetClass: 'forex',
    baseCurrency: 'EUR',
    quoteCurrency: 'USD',
    bid: 1.08642,
    ask: 1.08657,
    previousClose: 1.0831,
    dayHigh: 1.08812,
    dayLow: 1.08184,
    leverage: 100,
    spread: 1.5,
    pipSize: 0.0001,
    contractSize: 100000,
    tradingHours: { 'en-US': 'Mon 06:05 - Sat 05:55', 'zh-CN': '周一 06:05 - 周六 05:55' },
    favorite: true,
    sparkline: [1.0831, 1.0842, 1.0838, 1.0851, 1.086, 1.0857, 1.0865],
  },
  {
    id: 'gbp-usd',
    symbol: 'GBP/USD',
    name: { 'en-US': 'British Pound / US Dollar', 'zh-CN': '英镑兑美元' },
    assetClass: 'forex',
    baseCurrency: 'GBP',
    quoteCurrency: 'USD',
    bid: 1.27486,
    ask: 1.27508,
    previousClose: 1.2792,
    dayHigh: 1.28022,
    dayLow: 1.27341,
    leverage: 100,
    spread: 2.2,
    pipSize: 0.0001,
    contractSize: 100000,
    tradingHours: { 'en-US': 'Mon 06:05 - Sat 05:55', 'zh-CN': '周一 06:05 - 周六 05:55' },
    favorite: true,
    sparkline: [1.2792, 1.2783, 1.2769, 1.2775, 1.2756, 1.2742, 1.275],
  },
  {
    id: 'usd-jpy',
    symbol: 'USD/JPY',
    name: { 'en-US': 'US Dollar / Japanese Yen', 'zh-CN': '美元兑日元' },
    assetClass: 'forex',
    baseCurrency: 'USD',
    quoteCurrency: 'JPY',
    bid: 156.318,
    ask: 156.342,
    previousClose: 155.742,
    dayHigh: 156.51,
    dayLow: 155.49,
    leverage: 100,
    spread: 2.4,
    pipSize: 0.01,
    contractSize: 100000,
    tradingHours: { 'en-US': 'Mon 06:05 - Sat 05:55', 'zh-CN': '周一 06:05 - 周六 05:55' },
    favorite: true,
    sparkline: [155.74, 155.88, 156.03, 156.21, 156.02, 156.41, 156.34],
  },
  {
    id: 'xau-usd',
    symbol: 'XAU/USD',
    name: { 'en-US': 'Gold / US Dollar', 'zh-CN': '黄金兑美元' },
    assetClass: 'metals',
    baseCurrency: 'XAU',
    quoteCurrency: 'USD',
    bid: 2364.18,
    ask: 2364.67,
    previousClose: 2348.91,
    dayHigh: 2371.4,
    dayLow: 2344.2,
    leverage: 50,
    spread: 4.9,
    pipSize: 0.01,
    contractSize: 100,
    tradingHours: { 'en-US': 'Mon 07:00 - Sat 05:45', 'zh-CN': '周一 07:00 - 周六 05:45' },
    favorite: true,
    sparkline: [2348.9, 2354.2, 2351.6, 2360.8, 2367.1, 2359.4, 2364.7],
  },
  {
    id: 'us30',
    symbol: 'US30',
    name: { 'en-US': 'Dow Jones Index CFD', 'zh-CN': '道琼斯指数 CFD' },
    assetClass: 'futures',
    baseCurrency: 'US30',
    quoteCurrency: 'USD',
    bid: 39184.2,
    ask: 39186.7,
    previousClose: 39088.4,
    dayHigh: 39230.5,
    dayLow: 38942.9,
    leverage: 50,
    spread: 25,
    pipSize: 0.1,
    contractSize: 1,
    tradingHours: { 'en-US': 'Mon 06:00 - Sat 05:00', 'zh-CN': '周一 06:00 - 周六 05:00' },
    favorite: false,
    sparkline: [39088, 39142, 39096, 39188, 39212, 39163, 39186],
  },
  {
    id: 'aud-usd',
    symbol: 'AUD/USD',
    name: { 'en-US': 'Australian Dollar / US Dollar', 'zh-CN': '澳元兑美元' },
    assetClass: 'forex',
    baseCurrency: 'AUD',
    quoteCurrency: 'USD',
    bid: 0.66154,
    ask: 0.66172,
    previousClose: 0.65984,
    dayHigh: 0.6624,
    dayLow: 0.6586,
    leverage: 100,
    spread: 1.8,
    pipSize: 0.0001,
    contractSize: 100000,
    tradingHours: { 'en-US': 'Mon 06:05 - Sat 05:55', 'zh-CN': '周一 06:05 - 周六 05:55' },
    favorite: false,
    sparkline: [0.6598, 0.6604, 0.6601, 0.6609, 0.6618, 0.6612, 0.6617],
  },
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: { 'en-US': 'Apple Inc. CFD', 'zh-CN': '苹果公司 CFD' },
    assetClass: 'stocks',
    baseCurrency: 'AAPL',
    quoteCurrency: 'USD',
    bid: 193.42,
    ask: 193.58,
    previousClose: 191.84,
    dayHigh: 194.21,
    dayLow: 190.96,
    leverage: 20,
    spread: 1.6,
    pipSize: 0.01,
    contractSize: 100,
    tradingHours: { 'en-US': 'US session 21:30 - 04:00', 'zh-CN': '美股时段 21:30 - 04:00' },
    favorite: false,
    sparkline: [191.8, 192.1, 191.9, 192.8, 193.4, 193.1, 193.6],
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    name: { 'en-US': 'Tesla Inc. CFD', 'zh-CN': '特斯拉 CFD' },
    assetClass: 'stocks',
    baseCurrency: 'TSLA',
    quoteCurrency: 'USD',
    bid: 178.26,
    ask: 178.48,
    previousClose: 181.12,
    dayHigh: 182.4,
    dayLow: 176.92,
    leverage: 20,
    spread: 2.2,
    pipSize: 0.01,
    contractSize: 100,
    tradingHours: { 'en-US': 'US session 21:30 - 04:00', 'zh-CN': '美股时段 21:30 - 04:00' },
    favorite: false,
    sparkline: [181.1, 180.4, 179.7, 180.1, 178.8, 177.9, 178.5],
  },
  {
    id: 'nvda',
    symbol: 'NVDA',
    name: { 'en-US': 'NVIDIA Corp. CFD', 'zh-CN': '英伟达 CFD' },
    assetClass: 'stocks',
    baseCurrency: 'NVDA',
    quoteCurrency: 'USD',
    bid: 924.7,
    ask: 925.4,
    previousClose: 913.5,
    dayHigh: 931.8,
    dayLow: 909.2,
    leverage: 20,
    spread: 7,
    pipSize: 0.1,
    contractSize: 10,
    tradingHours: { 'en-US': 'US session 21:30 - 04:00', 'zh-CN': '美股时段 21:30 - 04:00' },
    favorite: false,
    sparkline: [913.5, 916.8, 920.4, 918.6, 925.1, 923.9, 925.4],
  },
];

export const instruments: Instrument[] = baseInstruments.map(enrichInstrument);

function enrichInstrument(instrument: BaseInstrument): Instrument {
  const midPrice = (instrument.bid + instrument.ask) / 2;
  const sourceValues = instrument.sparkline.length > 1 ? instrument.sparkline : [instrument.previousClose, midPrice];
  const rangeHigh = Math.max(instrument.dayHigh, ...sourceValues, midPrice);
  const rangeLow = Math.min(instrument.dayLow, ...sourceValues, midPrice);
  const spreadValue = Math.max(rangeHigh - rangeLow, instrument.pipSize * instrument.spread);
  const lotProfile = resolveLotProfile(instrument);

  return {
    ...instrument,
    candlesByTimeframe: Object.fromEntries(
      chartTimeframes.map((timeframe) => [timeframe, buildCandles(instrument, timeframe)]),
    ) as Record<InstrumentChartTimeframe, InstrumentCandle[]>,
    lotStep: lotProfile.lotStep,
    marginCurrency: instrument.quoteCurrency,
    marketStatus: 'open',
    maxLot: lotProfile.maxLot,
    minLot: lotProfile.minLot,
    openPrice: sourceValues[0] ?? instrument.previousClose,
    quoteStatus: 'live',
    quoteUpdatedAt: quoteSnapshotTime,
    swapLong: lotProfile.swapLong,
    swapShort: lotProfile.swapShort,
    tickSize: instrument.pipSize,
    tickValue: lotProfile.tickValue,
    weekHigh: roundPrice(instrument, rangeHigh + spreadValue * 0.72),
    weekLow: roundPrice(instrument, Math.max(instrument.pipSize, rangeLow - spreadValue * 0.66)),
    yearHigh: roundPrice(instrument, rangeHigh + spreadValue * 4.2),
    yearLow: roundPrice(instrument, Math.max(instrument.pipSize, rangeLow - spreadValue * 3.6)),
  };
}

function resolveLotProfile(instrument: BaseInstrument) {
  if (instrument.assetClass === 'stocks') {
    return { lotStep: 0.01, maxLot: 50, minLot: 0.01, swapLong: -3.8, swapShort: -2.7, tickValue: instrument.contractSize * instrument.pipSize };
  }

  if (instrument.assetClass === 'metals') {
    return { lotStep: 0.01, maxLot: 100, minLot: 0.01, swapLong: -18.6, swapShort: 7.2, tickValue: instrument.contractSize * instrument.pipSize };
  }

  if (instrument.assetClass === 'futures') {
    return { lotStep: 0.1, maxLot: 100, minLot: 0.1, swapLong: -4.8, swapShort: -4.2, tickValue: instrument.contractSize * instrument.pipSize };
  }

  return { lotStep: 0.01, maxLot: 200, minLot: 0.01, swapLong: -6.2, swapShort: 2.1, tickValue: instrument.contractSize * instrument.pipSize };
}

function buildCandles(instrument: BaseInstrument, timeframe: InstrumentChartTimeframe): InstrumentCandle[] {
  const countByTimeframe: Record<InstrumentChartTimeframe, number> = {
    '1m': 96,
    '5m': 96,
    '15m': 88,
    '30m': 80,
    '1H': 72,
    '4H': 64,
    '1D': 56,
    '1W': 52,
  };
  const minutesByTimeframe: Record<InstrumentChartTimeframe, number> = {
    '1m': 1,
    '5m': 5,
    '15m': 15,
    '30m': 30,
    '1H': 60,
    '4H': 240,
    '1D': 1440,
    '1W': 10080,
  };
  const count = countByTimeframe[timeframe];
  const intervalMs = minutesByTimeframe[timeframe] * 60 * 1000;
  const endTime = Date.parse(quoteSnapshotTime);
  const source = instrument.sparkline.length > 1 ? instrument.sparkline : [instrument.previousClose, instrument.bid];
  const sourceMin = Math.min(...source, instrument.dayLow);
  const sourceMax = Math.max(...source, instrument.dayHigh);
  const baseRange = Math.max(sourceMax - sourceMin, instrument.pipSize * instrument.spread * 4);
  const timeframeVolatility = resolveTimeframeVolatility(timeframe);
  const candles: InstrumentCandle[] = [];
  let previousClose = instrument.previousClose;

  for (let index = 0; index < count; index += 1) {
    const progress = index / Math.max(count - 1, 1);
    const sourceIndex = Math.min(Math.floor(progress * (source.length - 1)), source.length - 1);
    const nextSourceIndex = Math.min(sourceIndex + 1, source.length - 1);
    const sourceProgress = progress * (source.length - 1) - sourceIndex;
    const anchor = source[sourceIndex] + (source[nextSourceIndex] - source[sourceIndex]) * sourceProgress;
    const wave = Math.sin((index + instrument.symbol.length) * 0.72) * baseRange * 0.22 * timeframeVolatility;
    const pulse = Math.cos((index + instrument.symbol.charCodeAt(0)) * 0.37) * baseRange * 0.12 * timeframeVolatility;
    const close = roundPrice(instrument, index === count - 1 ? (instrument.bid + instrument.ask) / 2 : anchor + wave + pulse);
    const open = roundPrice(instrument, previousClose);
    const candleRange = Math.max(Math.abs(close - open), instrument.pipSize * instrument.spread * (1.2 + timeframeVolatility));
    const high = roundPrice(instrument, Math.max(open, close) + candleRange * (0.35 + ((index % 5) + 1) * 0.08));
    const low = roundPrice(instrument, Math.max(instrument.pipSize, Math.min(open, close) - candleRange * (0.28 + ((index % 7) + 1) * 0.05)));
    const volumeBase = instrument.assetClass === 'forex' ? 850 : instrument.assetClass === 'metals' ? 620 : instrument.assetClass === 'stocks' ? 1280 : 960;
    candles.push({
      close,
      high,
      low,
      open,
      time: new Date(endTime - (count - 1 - index) * intervalMs).toISOString(),
      volume: Math.round(volumeBase * (1 + Math.abs(Math.sin(index * 0.46)) * 2.4 + timeframeVolatility)),
    });
    previousClose = close;
  }

  return candles;
}

function resolveTimeframeVolatility(timeframe: InstrumentChartTimeframe) {
  const volatility: Record<InstrumentChartTimeframe, number> = {
    '1m': 0.42,
    '5m': 0.56,
    '15m': 0.72,
    '30m': 0.86,
    '1H': 1,
    '4H': 1.28,
    '1D': 1.58,
    '1W': 2.2,
  };

  return volatility[timeframe];
}

function roundPrice(instrument: Pick<BaseInstrument, 'pipSize'>, value: number) {
  return Number(value.toFixed(instrument.pipSize >= 0.01 ? 3 : 5));
}

export const initialAccount: Account = {
  accountId: 'DP-FX-208839',
  label: { 'en-US': 'Dupoin Demo Margin', 'zh-CN': 'Dupoin 模拟保证金账户' },
  mode: { 'en-US': 'Demo', 'zh-CN': '模拟' },
  server: 'MT5-Demo-01',
  leverageProfile: '1:100',
  currency: 'USD',
  balance: 50000,
  equity: 50000,
  usedMargin: 0,
  freeMargin: 50000,
  marginLevel: 0,
  credit: 2000,
  transactions: [
    {
      id: 'tx-1001',
      type: 'deposit',
      amount: 30000,
      status: 'completed',
      createdAt: '2026-05-02 11:42',
      note: { 'en-US': 'Demo deposit', 'zh-CN': '模拟入金' },
    },
    {
      id: 'tx-1002',
      type: 'deposit',
      amount: 20000,
      status: 'completed',
      createdAt: '2026-05-10 15:08',
      note: { 'en-US': 'Practice trading credit', 'zh-CN': '交易练习金' },
    },
    {
      id: 'tx-1003',
      type: 'withdrawal',
      amount: -2500,
      status: 'reviewing',
      createdAt: '2026-05-19 09:36',
      note: { 'en-US': 'Demo withdrawal review', 'zh-CN': '模拟出金审核' },
    },
  ],
};

export const partnerMetrics: PartnerMetrics = {
  month: { 'en-US': 'May 2026', 'zh-CN': '2026年5月' },
  clients: 126,
  activeClients: 74,
  monthlyVolume: 186_400_000,
  pendingCommission: 18420,
  settledCommission: 42760,
  conversionRate: 31.8,
  referralCode: 'IB-ALPHA-2688',
  referralLink: 'https://broker.example/open/IB-ALPHA-2688',
};

export const partnerClients: PartnerClient[] = [
  {
    id: 'client-001',
    name: '陈思远',
    status: 'active',
    role: 'trader',
    upgradeStatus: 'none',
    superiorName: 'Dupoin IB Desk',
    joinedAt: '2026-04-18',
    netDeposit: 62500,
    monthlyVolume: 18_400_000,
    openPositions: 5,
    lastActive: { 'en-US': '12 min ago', 'zh-CN': '12分钟前' },
    country: 'SG',
  },
  {
    id: 'client-002',
    name: '林佳怡',
    status: 'funded',
    role: 'trader',
    upgradeStatus: 'none',
    superiorName: 'Dupoin IB Desk',
    joinedAt: '2026-05-04',
    netDeposit: 18000,
    monthlyVolume: 4_200_000,
    openPositions: 1,
    lastActive: { 'en-US': '2 hours ago', 'zh-CN': '2小时前' },
    country: 'HK',
  },
  {
    id: 'client-003',
    name: 'Aaron Tan',
    status: 'active',
    role: 'partner',
    upgradeStatus: 'approved',
    superiorName: 'Dupoin IB Desk',
    joinedAt: '2026-03-29',
    netDeposit: 124000,
    monthlyVolume: 36_800_000,
    openPositions: 8,
    lastActive: { 'en-US': 'Online', 'zh-CN': '在线' },
    country: 'MY',
  },
  {
    id: 'client-004',
    name: '王若宁',
    status: 'invited',
    role: 'trader',
    upgradeStatus: 'none',
    superiorName: 'Dupoin IB Desk',
    joinedAt: '2026-05-17',
    netDeposit: 0,
    monthlyVolume: 0,
    openPositions: 0,
    lastActive: { 'en-US': 'Awaiting account', 'zh-CN': '待开户' },
    country: 'CN',
  },
  {
    id: 'client-005',
    name: 'Mina Lee',
    status: 'dormant',
    role: 'trader',
    upgradeStatus: 'rejected',
    superiorName: 'Dupoin IB Desk',
    joinedAt: '2026-02-11',
    netDeposit: 9200,
    monthlyVolume: 680_000,
    openPositions: 0,
    lastActive: { 'en-US': '9 days ago', 'zh-CN': '9天前' },
    country: 'KR',
  },
];

export const initialUpgradeRequest: UpgradeRequest = {
  applicantClientId: 'client-001',
  applicantName: '陈思远',
  id: 'upgrade-client-001',
  messages: [],
  reason: '',
  status: 'none',
  submittedAt: '',
  superiorName: 'Dupoin IB Desk',
};

export const commissions: Commission[] = [
  {
    id: 'com-001',
    clientId: 'client-001',
    clientName: '陈思远',
    symbol: 'XAU/USD',
    volume: 7_200_000,
    ratePerMillion: 120,
    amount: 864,
    status: 'pending',
    period: '2026-05',
  },
  {
    id: 'com-002',
    clientId: 'client-003',
    clientName: 'Aaron Tan',
    symbol: 'EUR/USD',
    volume: 18_600_000,
    ratePerMillion: 82,
    amount: 1525.2,
    status: 'pending',
    period: '2026-05',
  },
  {
    id: 'com-003',
    clientId: 'client-002',
    clientName: '林佳怡',
    symbol: 'GBP/USD',
    volume: 4_200_000,
    ratePerMillion: 96,
    amount: 403.2,
    status: 'settled',
    period: '2026-04',
  },
  {
    id: 'com-004',
    clientId: 'client-005',
    clientName: 'Mina Lee',
    symbol: 'USD/JPY',
    volume: 680_000,
    ratePerMillion: 75,
    amount: 51,
    status: 'settled',
    period: '2026-04',
  },
];
