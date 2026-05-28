import type { Account, Direction, Instrument, InstrumentCandle, InstrumentChartTimeframe, Order, OrderType, Position } from './types';

export function getMidPrice(instrument: Instrument) {
  return (instrument.bid + instrument.ask) / 2;
}

export function getDisplayChange(instrument: Instrument) {
  const midpoint = getMidPrice(instrument);
  const change = midpoint - instrument.previousClose;
  const changePercent = (change / instrument.previousClose) * 100;
  return { change, changePercent };
}

export function getTradePrice(instrument: Instrument, direction: Direction) {
  return direction === 'buy' ? instrument.ask : instrument.bid;
}

export function calculateNotional(instrument: Instrument, lots: number, price: number) {
  return lots * instrument.contractSize * price;
}

export function calculateMargin(instrument: Instrument, lots: number, price: number) {
  return calculateNotional(instrument, lots, price) / instrument.leverage;
}

export function calculatePositionPnl(
  instrument: Instrument,
  direction: Direction,
  lots: number,
  openPrice: number,
) {
  const exitPrice = direction === 'buy' ? instrument.bid : instrument.ask;
  const multiplier = direction === 'buy' ? 1 : -1;
  return (exitPrice - openPrice) * multiplier * lots * instrument.contractSize;
}

export function createOrder(params: {
  instrument: Instrument;
  direction: Direction;
  type: OrderType;
  lots: number;
  limitPrice?: number;
}): Order {
  const price = params.limitPrice ?? getTradePrice(params.instrument, params.direction);
  return {
    id: `ord-${Date.now()}`,
    instrumentId: params.instrument.id,
    symbol: params.instrument.symbol,
    direction: params.direction,
    type: params.type,
    lots: params.lots,
    requestedPrice: price,
    filledPrice: price,
    marginRequired: calculateMargin(params.instrument, params.lots, price),
    status: params.type === 'market' ? 'filled' : 'pending',
    createdAt: new Date().toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

export function createPosition(order: Order): Position {
  return {
    id: `pos-${order.id}`,
    instrumentId: order.instrumentId,
    symbol: order.symbol,
    direction: order.direction,
    lots: order.lots,
    openPrice: order.filledPrice,
    currentPrice: order.filledPrice,
    marginUsed: order.marginRequired,
    unrealizedPnl: 0,
    openedAt: order.createdAt,
  };
}

export function recalculateAccount(account: Account, positions: Position[]) {
  const unrealizedPnl = positions.reduce((total, position) => total + position.unrealizedPnl, 0);
  const usedMargin = positions.reduce((total, position) => total + position.marginUsed, 0);
  const equity = account.balance + account.credit + unrealizedPnl;
  const freeMargin = equity - usedMargin;
  const marginLevel = usedMargin > 0 ? (equity / usedMargin) * 100 : 0;

  return {
    ...account,
    equity,
    usedMargin,
    freeMargin,
    marginLevel,
  };
}

export function refreshPositions(positions: Position[], latestInstruments: Instrument[]) {
  return positions.map((position) => {
    const instrument = latestInstruments.find((item) => item.id === position.instrumentId);

    if (!instrument) {
      return position;
    }

    const currentPrice = position.direction === 'buy' ? instrument.bid : instrument.ask;
    return {
      ...position,
      currentPrice,
      unrealizedPnl: calculatePositionPnl(
        instrument,
        position.direction,
        position.lots,
        position.openPrice,
      ),
    };
  });
}

export function moveQuote(instrument: Instrument, tick: number): Instrument {
  const wave = Math.sin((tick + instrument.symbol.length) / 3) * instrument.pipSize * 2.2;
  const drift = Math.cos((tick + instrument.symbol.charCodeAt(0)) / 5) * instrument.pipSize * 1.2;
  const nextBid = instrument.bid + wave + drift;
  const nextAsk = nextBid + instrument.spread * instrument.pipSize;
  const nextMid = (nextBid + nextAsk) / 2;

  return {
    ...instrument,
    bid: Number(nextBid.toFixed(instrument.pipSize >= 0.01 ? 3 : 5)),
    ask: Number(nextAsk.toFixed(instrument.pipSize >= 0.01 ? 3 : 5)),
    dayHigh: Math.max(instrument.dayHigh, nextMid),
    dayLow: Math.min(instrument.dayLow, nextMid),
    quoteStatus: 'live',
    quoteUpdatedAt: new Date().toISOString(),
    sparkline: [...instrument.sparkline.slice(-9), nextMid],
    candlesByTimeframe: appendLatestCandle(instrument, nextMid),
  };
}

export function applyQuote(instrument: Instrument, bid: number, ask: number, options?: { updateSparkline?: boolean }): Instrument {
  const nextMid = (bid + ask) / 2;
  const digits = instrument.pipSize >= 0.01 ? 3 : 5;
  const updateSparkline = options?.updateSparkline ?? true;

  return {
    ...instrument,
    ask: Number(ask.toFixed(digits)),
    bid: Number(bid.toFixed(digits)),
    dayHigh: Math.max(instrument.dayHigh, nextMid),
    dayLow: Math.min(instrument.dayLow, nextMid),
    quoteStatus: 'live',
    quoteUpdatedAt: new Date().toISOString(),
    sparkline: updateSparkline ? [...instrument.sparkline.slice(-9), nextMid] : instrument.sparkline,
    spread: Number(((ask - bid) / instrument.pipSize).toFixed(1)),
    candlesByTimeframe: updateSparkline ? appendLatestCandle(instrument, nextMid) : instrument.candlesByTimeframe,
  };
}

function appendLatestCandle(instrument: Instrument, nextMid: number) {
  return (Object.entries(instrument.candlesByTimeframe) as [InstrumentChartTimeframe, InstrumentCandle[]][]).reduce(
    (nextCandles, [timeframe, candles]) => {
      const lastCandle = candles[candles.length - 1];
      const nextClose = roundInstrumentPrice(instrument, nextMid);
      const updatedCandle: InstrumentCandle = {
        close: nextClose,
        high: roundInstrumentPrice(instrument, Math.max(lastCandle?.high ?? nextClose, nextClose)),
        low: roundInstrumentPrice(instrument, Math.min(lastCandle?.low ?? nextClose, nextClose)),
        open: lastCandle?.open ?? nextClose,
        time: new Date().toISOString(),
        volume: Math.max((lastCandle?.volume ?? 0) + 1, 1),
      };

      nextCandles[timeframe] = [...candles.slice(-95), updatedCandle];
      return nextCandles;
    },
    {} as Instrument['candlesByTimeframe'],
  );
}

function roundInstrumentPrice(instrument: Instrument, value: number) {
  return Number(value.toFixed(instrument.pipSize >= 0.01 ? 3 : 5));
}
