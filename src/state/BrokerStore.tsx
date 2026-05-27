import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { initialAccount, initialUpgradeRequest, instruments as initialInstruments, partnerClients as initialPartnerClients } from '@/src/domain/mockData';
import {
  applyQuote,
  calculateMargin,
  calculatePositionPnl,
  createOrder,
  createPosition,
  recalculateAccount,
  refreshPositions,
} from '@/src/domain/trading';
import type { Account, Direction, Instrument, Order, OrderType, PartnerClient, Position, Role, UpgradeRequest } from '@/src/domain/types';
import { useProductSettings } from '@/src/settings/ProductSettings';

const UPGRADE_STORAGE_KEY = 'broker-fx-upgrade-state';
const LOCAL_QUOTE_PROXY_PORT = 8091;
const QUOTE_CONNECTION_TIMEOUT_MS = 8000;
const QUOTE_RECONNECT_DELAY_MS = 2500;
const SPARKLINE_SAMPLE_INTERVAL_MS = 30_000;
const QUOTE_SYMBOLS = ['EURUSD', 'GBPUSD', 'AUDUSD', 'NZDUSD', 'USDJPY', 'USDCAD', 'USDCHF', 'XAUUSD'];

type PlaceOrderInput = {
  instrumentId: string;
  direction: Direction;
  type: OrderType;
  lots: number;
  limitPrice?: number;
};

type BrokerStore = {
  role: Role;
  setRole: (role: Role) => void;
  instruments: Instrument[];
  account: Account;
  partnerClients: PartnerClient[];
  upgradeRequest: UpgradeRequest;
  positions: Position[];
  orders: Order[];
  quoteStatus: 'connecting' | 'connected' | 'failed';
  resetBrokerDemoState: () => void;
  submitUpgradeRequest: (reason: string) => void;
  approveUpgradeRequest: (clientId: string) => void;
  rejectUpgradeRequest: (clientId: string) => void;
  getPartnerClientProfile: (clientId: string) => PartnerClient | undefined;
  placeOrder: (input: PlaceOrderInput) => Order | null;
  modifyOrder: (orderId: string) => void;
  deleteOrder: (orderId: string) => void;
  closePosition: (positionId: string) => void;
  findInstrument: (id: string) => Instrument | undefined;
};

const BrokerContext = createContext<BrokerStore | null>(null);

type DupoinQuoteMessage = {
  t?: number;
  type?: string;
  status?: 'connecting' | 'connected' | 'failed';
  d?: {
    m?: string;
    s?: string;
    b?: { p?: number }[];
    a?: { p?: number }[];
  };
};

function normalizeQuoteSymbol(symbol: string) {
  return symbol.replace('/', '').toUpperCase();
}

function isSubscribedQuoteSymbol(instrument: Instrument) {
  return QUOTE_SYMBOLS.includes(normalizeQuoteSymbol(instrument.symbol));
}

function getQuoteSocketUrl() {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    return `ws://${window.location.hostname}:${LOCAL_QUOTE_PROXY_PORT}`;
  }

  const hostUri = Constants.expoConfig?.hostUri ?? Constants.manifest2?.extra?.expoClient?.hostUri ?? Constants.manifest?.debuggerHost;
  const host = typeof hostUri === 'string' ? hostUri.split(':')[0] : null;

  if (host) {
    return `ws://${host}:${LOCAL_QUOTE_PROXY_PORT}`;
  }

  return `ws://localhost:${LOCAL_QUOTE_PROXY_PORT}`;
}

function readStoredUpgradeState() {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(UPGRADE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as { partnerClients?: PartnerClient[]; upgradeRequest?: UpgradeRequest }) : null;
  } catch {
    return null;
  }
}

function getSeedInstrument(id: string) {
  return initialInstruments.find((instrument) => instrument.id === id) ?? initialInstruments[0];
}

function getPricePrecision(instrument: Instrument) {
  return instrument.pipSize >= 0.01 ? 3 : 5;
}

function buildSamplePosition(params: {
  direction: Direction;
  id: string;
  instrument: Instrument;
  lots: number;
  openPriceOffset: number;
  openedAt: string;
}): Position {
  const precision = getPricePrecision(params.instrument);
  const openPriceSource = params.direction === 'buy' ? params.instrument.ask : params.instrument.bid;
  const openPrice = Number((openPriceSource + params.openPriceOffset).toFixed(precision));
  const currentPrice = params.direction === 'buy' ? params.instrument.bid : params.instrument.ask;

  return {
    id: params.id,
    instrumentId: params.instrument.id,
    symbol: params.instrument.symbol,
    direction: params.direction,
    lots: params.lots,
    openPrice,
    currentPrice,
    marginUsed: calculateMargin(params.instrument, params.lots, openPrice),
    unrealizedPnl: calculatePositionPnl(params.instrument, params.direction, params.lots, openPrice),
    openedAt: params.openedAt,
  };
}

function buildSamplePositions(): Position[] {
  const eurUsd = getSeedInstrument('eur-usd');
  const xauUsd = getSeedInstrument('xau-usd');

  return [
    buildSamplePosition({
      direction: 'buy',
      id: 'dev-pos-eur-usd',
      instrument: eurUsd,
      lots: 0.4,
      openedAt: '05/22 10:08',
      openPriceOffset: -eurUsd.pipSize * 18,
    }),
    buildSamplePosition({
      direction: 'sell',
      id: 'dev-pos-xau-usd',
      instrument: xauUsd,
      lots: 0.18,
      openedAt: '05/22 11:34',
      openPriceOffset: xauUsd.pipSize * 96,
    }),
  ];
}

function buildSamplePendingOrder(params: {
  direction: Direction;
  id: string;
  instrument: Instrument;
  lots: number;
  priceOffset: number;
  createdAt: string;
}): Order {
  const precision = getPricePrecision(params.instrument);
  const priceSource = params.direction === 'buy' ? params.instrument.bid : params.instrument.ask;
  const price = Number((priceSource + params.priceOffset).toFixed(precision));

  return {
    id: params.id,
    instrumentId: params.instrument.id,
    symbol: params.instrument.symbol,
    direction: params.direction,
    type: 'limit',
    lots: params.lots,
    requestedPrice: price,
    filledPrice: price,
    marginRequired: calculateMargin(params.instrument, params.lots, price),
    status: 'pending',
    createdAt: params.createdAt,
  };
}

function buildSamplePendingOrders(): Order[] {
  const gbpUsd = getSeedInstrument('gbp-usd');
  const usdJpy = getSeedInstrument('usd-jpy');

  return [
    buildSamplePendingOrder({
      createdAt: '05/22 12:10',
      direction: 'buy',
      id: 'dev-pending-gbp-usd',
      instrument: gbpUsd,
      lots: 0.25,
      priceOffset: -gbpUsd.pipSize * 22,
    }),
    buildSamplePendingOrder({
      createdAt: '05/22 12:26',
      direction: 'sell',
      id: 'dev-pending-usd-jpy',
      instrument: usdJpy,
      lots: 0.12,
      priceOffset: usdJpy.pipSize * 18,
    }),
  ];
}

export function BrokerProvider({ children }: PropsWithChildren) {
  const { pendingOrderDataPreset, positionDataPreset, role, setRole } = useProductSettings();
  const storedUpgradeState = readStoredUpgradeState();
  const [instruments, setInstruments] = useState(initialInstruments);
  const [baseAccount, setBaseAccount] = useState(initialAccount);
  const [partnerClients, setPartnerClients] = useState<PartnerClient[]>(storedUpgradeState?.partnerClients ?? initialPartnerClients);
  const [upgradeRequest, setUpgradeRequest] = useState<UpgradeRequest>(storedUpgradeState?.upgradeRequest ?? initialUpgradeRequest);
  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quoteStatus, setQuoteStatus] = useState<'connecting' | 'connected' | 'failed'>('connecting');
  const sparklineSampledAtRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (typeof WebSocket === 'undefined') {
      setQuoteStatus('failed');
      return;
    }

    let socket: WebSocket | null = null;
    let failureTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let closedByCleanup = false;

    const clearFailureTimer = () => {
      if (failureTimer) {
        clearTimeout(failureTimer);
        failureTimer = null;
      }
    };

    const startFailureTimer = () => {
      clearFailureTimer();
      failureTimer = setTimeout(() => {
        failureTimer = null;
        setQuoteStatus('failed');
        closeCurrentSocket();
        scheduleReconnect();
      }, QUOTE_CONNECTION_TIMEOUT_MS);
    };

    const clearReconnectTimer = () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    const scheduleReconnect = () => {
      if (closedByCleanup || reconnectTimer) {
        return;
      }

      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connectQuoteSocket();
      }, QUOTE_RECONNECT_DELAY_MS);
    };

    const closeCurrentSocket = () => {
      const currentSocket = socket;
      socket = null;

      if (!currentSocket) {
        return;
      }

      currentSocket.onopen = null;
      currentSocket.onmessage = null;
      currentSocket.onerror = null;
      currentSocket.onclose = null;

      if (currentSocket.readyState === WebSocket.CONNECTING || currentSocket.readyState === WebSocket.OPEN) {
        currentSocket.close();
      }
    };

    const handleQuoteMessage = (symbol: string, bid: number, ask: number) => {
      clearFailureTimer();
      clearReconnectTimer();
      setQuoteStatus('connected');

      const quoteSymbol = normalizeQuoteSymbol(symbol);
      const sampledAt = Date.now();
      const lastSampledAt = sparklineSampledAtRef.current[quoteSymbol] ?? 0;
      const updateSparkline = sampledAt - lastSampledAt >= SPARKLINE_SAMPLE_INTERVAL_MS;

      if (updateSparkline) {
        sparklineSampledAtRef.current[quoteSymbol] = sampledAt;
      }

      setInstruments((current) =>
        current.map((instrument) => (normalizeQuoteSymbol(instrument.symbol) === quoteSymbol ? applyQuote(instrument, bid, ask, { updateSparkline }) : instrument)),
      );
    };

    function connectQuoteSocket() {
      closeCurrentSocket();
      setQuoteStatus('connecting');
      startFailureTimer();

      const nextSocket = new WebSocket(getQuoteSocketUrl());
      socket = nextSocket;

      nextSocket.onopen = () => {
        setQuoteStatus('connecting');
        startFailureTimer();
      };

      nextSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(String(event.data)) as DupoinQuoteMessage;

          if (message.type === 'quote-status') {
            if (message.status === 'failed') {
              clearFailureTimer();
              setQuoteStatus('failed');
            } else if (message.status === 'connecting') {
              setQuoteStatus('connecting');
              startFailureTimer();
            } else if (message.status === 'connected') {
              clearFailureTimer();
              clearReconnectTimer();
              setQuoteStatus('connected');
            }
            return;
          }

          const symbol = message.d?.s ?? message.d?.m;
          const bid = message.d?.b?.[0]?.p;
          const ask = message.d?.a?.[0]?.p;

          if (message.t !== 2 || !symbol || typeof bid !== 'number' || typeof ask !== 'number') {
            return;
          }

          handleQuoteMessage(symbol, bid, ask);
        } catch {
          // Ignore malformed quote payloads and keep the last known quote.
        }
      };

      nextSocket.onerror = () => {
        setQuoteStatus('failed');
        scheduleReconnect();
      };

      nextSocket.onclose = () => {
        if (socket === nextSocket) {
          socket = null;
        }

        clearFailureTimer();

        if (!closedByCleanup) {
          setQuoteStatus('failed');
          scheduleReconnect();
        }
      };
    }

    connectQuoteSocket();

    return () => {
      closedByCleanup = true;
      clearFailureTimer();
      clearReconnectTimer();

      closeCurrentSocket();
    };
  }, []);

  useEffect(() => {
    setPositions((current) => refreshPositions(current, instruments));
  }, [instruments]);

  useEffect(() => {
    setPositions(positionDataPreset === 'sample' ? buildSamplePositions() : []);
  }, [positionDataPreset]);

  useEffect(() => {
    setOrders(pendingOrderDataPreset === 'sample' ? buildSamplePendingOrders() : []);
  }, [pendingOrderDataPreset]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    window.localStorage.setItem(UPGRADE_STORAGE_KEY, JSON.stringify({ partnerClients, upgradeRequest }));
  }, [partnerClients, upgradeRequest]);

  const account = useMemo(() => recalculateAccount(baseAccount, positions), [baseAccount, positions]);

  const placeOrder = (input: PlaceOrderInput) => {
    const instrument = instruments.find((item) => item.id === input.instrumentId);

    if (!instrument) {
      return null;
    }

    const order = createOrder({ ...input, instrument });

    setOrders((current) => [order, ...current]);
    if (order.status === 'filled') {
      const position = createPosition(order);
      setPositions((current) => [position, ...current]);
    }
    return order;
  };

  const closePosition = (positionId: string) => {
    setPositions((current) => {
      const position = current.find((item) => item.id === positionId);

      if (!position) {
        return current;
      }

      setBaseAccount((accountValue) => ({
        ...accountValue,
        balance: accountValue.balance + position.unrealizedPnl,
      }));

      setOrders((existingOrders) => [
        {
          id: `cls-${Date.now()}`,
          instrumentId: position.instrumentId,
          symbol: position.symbol,
          direction: position.direction === 'buy' ? 'sell' : 'buy',
          type: 'market',
          lots: position.lots,
          requestedPrice: position.currentPrice,
          filledPrice: position.currentPrice,
          marginRequired: 0,
          status: 'closed',
          createdAt: new Date().toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
        ...existingOrders,
      ]);

      return current.filter((item) => item.id !== positionId);
    });
  };

  const modifyOrder = (orderId: string) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? {
              ...order,
              lots: Number((order.lots + 0.01).toFixed(2)),
              marginRequired: Number((order.marginRequired * 1.002).toFixed(2)),
            }
          : order,
      ),
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((current) => current.filter((order) => order.id !== orderId));
  };

  const submitUpgradeRequest = (reason: string) => {
    if (upgradeRequest.status === 'pending') {
      return;
    }

    const submittedAt = new Date().toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    setUpgradeRequest({
      applicantClientId: 'client-001',
      applicantName: '陈思远',
      id: `upgrade-${Date.now()}`,
      messages: [
        {
          author: 'trader',
          body: {
            'en-US': reason,
            'zh-CN': reason,
          },
          createdAt: submittedAt,
          id: `msg-${Date.now()}`,
        },
        {
          author: 'superior',
          body: {
            'en-US': 'Application received. I will review your client activation plan from the Partner desk.',
            'zh-CN': '申请已收到，我会在 Partner 工作台审核你的客户激活计划。',
          },
          createdAt: submittedAt,
          id: `msg-reply-${Date.now()}`,
        },
      ],
      reason,
      status: 'pending',
      submittedAt,
      superiorName: 'Dupoin IB Desk',
    });
    setPartnerClients((current) =>
      current.map((client) =>
        client.id === 'client-001' ? { ...client, role: 'trader', upgradeStatus: 'pending', superiorName: 'Dupoin IB Desk' } : client,
      ),
    );
  };

  const approveUpgradeRequest = (clientId: string) => {
    setPartnerClients((current) =>
      current.map((client) => (client.id === clientId ? { ...client, role: 'partner', upgradeStatus: 'approved' } : client)),
    );
    if (clientId === upgradeRequest.applicantClientId) {
      setUpgradeRequest((current) => ({
        ...current,
        status: 'approved',
        messages: [
          ...current.messages,
          {
            author: 'superior',
            body: {
              'en-US': 'Approved. Your Partner workspace is now enabled for this session.',
              'zh-CN': '已批准。你的 Partner 工作台已在当前会话中启用。',
            },
            createdAt: new Date().toLocaleString('zh-CN', {
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }),
            id: `msg-approved-${Date.now()}`,
          },
        ],
      }));
      setRole('partner');
    }
  };

  const rejectUpgradeRequest = (clientId: string) => {
    setPartnerClients((current) =>
      current.map((client) => (client.id === clientId ? { ...client, role: 'trader', upgradeStatus: 'rejected' } : client)),
    );
    if (clientId === upgradeRequest.applicantClientId) {
      setUpgradeRequest((current) => ({ ...current, status: 'rejected' }));
    }
  };

  const resetBrokerDemoState = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(UPGRADE_STORAGE_KEY);
    }

    setBaseAccount(initialAccount);
    setOrders([]);
    setPartnerClients(initialPartnerClients);
    setPositions([]);
    setUpgradeRequest(initialUpgradeRequest);
  };

  const value = useMemo(
    () => ({
      role,
      setRole,
      instruments,
      account,
      partnerClients,
      upgradeRequest,
      positions,
      orders,
      quoteStatus,
      resetBrokerDemoState,
      submitUpgradeRequest,
      approveUpgradeRequest,
      rejectUpgradeRequest,
      getPartnerClientProfile: (clientId: string) => partnerClients.find((client) => client.id === clientId),
      placeOrder,
      modifyOrder,
      deleteOrder,
      closePosition,
      findInstrument: (id: string) => instruments.find((instrument) => instrument.id === id),
    }),
    [account, instruments, orders, partnerClients, positions, quoteStatus, role, upgradeRequest],
  );

  return <BrokerContext.Provider value={value}>{children}</BrokerContext.Provider>;
}

export function useBroker() {
  const context = useContext(BrokerContext);

  if (!context) {
    throw new Error('useBroker must be used inside BrokerProvider');
  }

  return context;
}
