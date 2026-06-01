import type { Href } from 'expo-router';

import {
  buildTradingAccountProfiles,
  type TradingAccountCountPreset,
  type TradingAccountDataPreset,
  type TradingAccountScenario,
  type TradingAccountStatusPreset,
} from '@/src/domain/accountProfiles';
import type { AppIconName, IconTone } from '@/src/design-public-assets/components';
import type { Locale, TranslationKey } from '@/src/i18n/translations';
import type {
  Account,
  AuthStatus,
  Instrument,
  KycStatus,
  PartnerClient,
  Position,
  Role,
  TradeWorkspaceDataPreset,
  TradingAccountUsageOverride,
  UpgradeRequest,
  WorkspaceSegment,
} from './types';
import { formatMoney, formatPercent, formatPrice } from './format';
import { partnerMetrics } from './mockData';

export type WorkspaceTabKey = 'workspace' | 'learn' | 'demo' | 'accounts' | 'trade' | 'markets' | 'discover' | 'quick' | 'me' | 'clients' | 'growth' | 'wallet';
export type WorkspaceTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'up' | 'down';

export type WorkspaceMetric = {
  caption?: string;
  id: string;
  labelKey: TranslationKey;
  tone?: WorkspaceTone;
  value?: string;
  valueKey?: TranslationKey;
};

export type WorkspaceAction = {
  descriptionKey: TranslationKey;
  icon: AppIconName;
  id: string;
  labelKey: TranslationKey;
  route: Href;
  tone?: IconTone;
};

export type WorkspaceMarket = {
  change: string;
  id: string;
  price: string;
  symbol: string;
  tone: 'up' | 'down' | 'muted';
};

export type WorkspaceViewModel = {
  actions: WorkspaceAction[];
  assist: {
    ctaKey: TranslationKey;
    eyebrowKey: TranslationKey;
    promptKey: TranslationKey;
    route: Href;
    tags: TranslationKey[];
  };
  header: {
    modeKey: TranslationKey;
    statusKey: TranslationKey;
  };
  markets: WorkspaceMarket[];
  metrics: WorkspaceMetric[];
  modeSwitch?: WorkspaceAction;
  primary: {
    badgeKey: TranslationKey;
    badgeTone: WorkspaceTone;
    bodyKey: TranslationKey;
    ctaKey: TranslationKey;
    route: Href;
    titleKey: TranslationKey;
  };
  segment: WorkspaceSegment;
  tabs: WorkspaceTabKey[];
};

export type WorkspaceContext = {
  account: Account;
  authStatus: AuthStatus;
  instruments: Instrument[];
  kycStatus: KycStatus;
  locale: Locale;
  partnerClients: PartnerClient[];
  pendingOrderDataPreset: TradeWorkspaceDataPreset;
  positionDataPreset: TradeWorkspaceDataPreset;
  positions: Position[];
  role: Role;
  tradingAccountCountPreset: TradingAccountCountPreset;
  tradingAccountDataPreset: TradingAccountDataPreset;
  tradingAccountScenario: TradingAccountScenario;
  tradingAccountStatusPreset: TradingAccountStatusPreset;
  tradingAccountUsageOverride: TradingAccountUsageOverride;
  upgradeRequest: UpgradeRequest;
};

export function resolveWorkspaceSegment(context: WorkspaceContext): WorkspaceSegment {
  const partnerApproved = context.role === 'partner' && context.upgradeRequest.status === 'approved';

  if (partnerApproved) {
    return 'partner_mode';
  }

  if (context.authStatus === 'guest' || context.kycStatus !== 'approved') {
    return 'new_trader';
  }

  const accounts = buildWorkspaceAccounts(context);
  const hasActiveLiveAccount = accounts.some((account) => account.group === 'active');
  const hasTradingActivity =
    context.positions.length > 0 ||
    context.positionDataPreset === 'sample' ||
    context.pendingOrderDataPreset === 'sample' ||
    context.tradingAccountUsageOverride !== 'auto';

  if (hasActiveLiveAccount || hasTradingActivity) {
    return 'active_trader';
  }

  return 'kyc_approved_no_deposit';
}

export function buildWorkspaceViewModel(context: WorkspaceContext): WorkspaceViewModel {
  const segment = resolveWorkspaceSegment(context);

  if (segment === 'partner_mode') {
    return buildPartnerWorkspace(context);
  }

  if (segment === 'active_trader') {
    return buildActiveTraderWorkspace(context);
  }

  if (segment === 'kyc_approved_no_deposit') {
    return buildReadyTraderWorkspace(context);
  }

  return buildNewTraderWorkspace(context);
}

function buildNewTraderWorkspace(context: WorkspaceContext): WorkspaceViewModel {
  const reviewing = context.kycStatus === 'reviewing';
  const approved = context.kycStatus === 'approved';
  const badgeKey = reviewing ? 'workspace.badge.reviewing' : approved ? 'workspace.badge.pendingActivation' : 'workspace.badge.unverified';

  return {
    actions: [
      action('documents', 'workspace.action.documents', 'workspace.action.documents.desc', 'icon.kyc.identity', '/learn'),
      action('demo', 'workspace.action.demo', 'workspace.action.demo.desc', 'icon.education.academy', '/demo'),
      action('risk', 'workspace.action.fundingRules', 'workspace.action.fundingRules.desc', 'icon.security.risk_shield', '/learn'),
    ],
    assist: {
      ctaKey: 'common.ask',
      eyebrowKey: 'workspace.assist.eyebrow',
      promptKey: 'workspace.assist.newTrader',
      route: '/learn',
      tags: ['workspace.assist.tag.documents', 'workspace.assist.tag.risk', 'workspace.assist.tag.funding'],
    },
    header: { modeKey: 'workspace.mode.trader', statusKey: 'workspace.header.newTrader' },
    markets: [],
    metrics: [
      metric('kyc', 'workspace.metric.kyc', context.kycStatus === 'reviewing' ? 'workspace.value.reviewing' : context.kycStatus === 'approved' ? 'workspace.value.approved' : 'workspace.value.notStarted', 'warning'),
      metric('experience', 'workspace.metric.experience', 'workspace.value.demoAvailable', 'info'),
      metric('next', 'workspace.metric.next', reviewing ? 'workspace.value.waitReview' : approved ? 'workspace.value.learnFunding' : 'workspace.value.prepareDocs', 'brand'),
    ],
    primary: {
      badgeKey,
      badgeTone: reviewing ? 'warning' : 'neutral',
      bodyKey: reviewing ? 'workspace.primary.newTrader.reviewBody' : 'workspace.primary.newTrader.body',
      ctaKey: reviewing ? 'workspace.cta.viewProcess' : 'workspace.cta.viewGuide',
      route: reviewing ? '/me' : '/learn',
      titleKey: 'workspace.primary.newTrader.title',
    },
    segment: 'new_trader',
    tabs: traderTabs(),
  };
}

function buildReadyTraderWorkspace(context: WorkspaceContext): WorkspaceViewModel {
  return {
    actions: [
      action('account', 'workspace.action.accountStatus', 'workspace.action.accountStatus.desc', 'icon.account.trading', '/accounts', 'blue'),
      action('markets', 'workspace.action.marketWatch', 'workspace.action.marketWatch.desc', 'icon.trading.market', '/markets', 'up'),
      action('risk', 'workspace.action.fundingRules', 'workspace.action.fundingRules.desc', 'icon.security.risk_shield', '/me', 'warning'),
    ],
    assist: {
      ctaKey: 'common.ask',
      eyebrowKey: 'workspace.assist.eyebrow',
      promptKey: 'workspace.assist.readyTrader',
      route: '/me',
      tags: ['workspace.assist.tag.funding', 'workspace.assist.tag.account', 'workspace.assist.tag.risk'],
    },
    header: { modeKey: 'workspace.mode.trader', statusKey: 'workspace.header.readyTrader' },
    markets: buildMarketMiniCards(context.instruments),
    metrics: [
      metric('kyc', 'workspace.metric.kyc', 'workspace.value.approved', 'success'),
      metric('account', 'workspace.metric.account', 'workspace.value.ready', 'brand'),
      metric('next', 'workspace.metric.next', 'workspace.value.learnFunding', 'info'),
    ],
    primary: {
      badgeKey: 'workspace.badge.pendingActivation',
      badgeTone: 'brand',
      bodyKey: 'workspace.primary.readyTrader.body',
      ctaKey: 'workspace.cta.viewAccount',
      route: '/accounts',
      titleKey: 'workspace.primary.readyTrader.title',
    },
    segment: 'kyc_approved_no_deposit',
    tabs: traderTabs(),
  };
}

function buildActiveTraderWorkspace(context: WorkspaceContext): WorkspaceViewModel {
  const accounts = buildWorkspaceAccounts(context);
  const activeCount = accounts.filter((account) => account.group === 'active' || account.group === 'demo').length;
  const totalPnl = accounts.reduce((sum, account) => sum + account.unrealizedPnl, 0);
  const freeMargin = accounts.reduce((sum, account) => sum + account.freeMargin, 0);
  const hasRestrictedAccount = accounts.some((account) => account.group === 'readOnly' || account.group === 'disabled');

  return {
    actions: [
      action('account', 'workspace.action.accountStatus', 'workspace.action.accountStatus.desc', 'icon.account.trading', '/accounts', 'blue'),
      action('risk', 'workspace.action.positionRisk', 'workspace.action.positionRisk.desc', 'icon.security.risk_shield', '/trade', totalPnl < 0 ? 'down' : 'up'),
      action('wallet', 'workspace.action.earningsWallet', 'workspace.action.earningsWallet.desc', 'icon.wallet.balance', '/me', 'amber'),
    ],
    assist: {
      ctaKey: 'common.ask',
      eyebrowKey: 'workspace.assist.eyebrow',
      promptKey: 'workspace.assist.activeTrader',
      route: '/me',
      tags: ['workspace.assist.tag.margin', 'workspace.assist.tag.position', 'workspace.assist.tag.market'],
    },
    header: { modeKey: 'workspace.mode.trader', statusKey: 'workspace.header.activeTrader' },
    markets: buildMarketMiniCards(context.instruments),
    metrics: [
      { id: 'accounts', labelKey: 'workspace.metric.tradeAccounts', value: `${activeCount} / ${accounts.length}`, tone: 'brand' },
      { id: 'freeMargin', labelKey: 'workspace.metric.freeMargin', value: formatMoney(freeMargin, context.account.currency, 0, context.locale), tone: 'info' },
      { id: 'floatingPnl', labelKey: 'workspace.metric.floatingPnl', value: formatMoney(totalPnl, context.account.currency, 2, context.locale), tone: totalPnl < 0 ? 'down' : 'up' },
    ],
    primary: {
      badgeKey: hasRestrictedAccount ? 'workspace.badge.riskAttention' : 'workspace.badge.tradable',
      badgeTone: hasRestrictedAccount ? 'warning' : 'success',
      bodyKey: hasRestrictedAccount ? 'workspace.primary.activeTrader.restrictedBody' : 'workspace.primary.activeTrader.body',
      ctaKey: hasRestrictedAccount ? 'workspace.cta.viewStatus' : 'workspace.cta.viewRisk',
      route: hasRestrictedAccount ? '/accounts' : '/trade',
      titleKey: 'workspace.primary.activeTrader.title',
    },
    segment: 'active_trader',
    tabs: traderTabs(),
  };
}

function buildPartnerWorkspace(context: WorkspaceContext): WorkspaceViewModel {
  const kycClients = Math.max(1, Math.round(context.partnerClients.length * 0.64));
  const fundedClients = context.partnerClients.filter((client) => client.status === 'funded' || client.status === 'active').length;
  const followUpClients = context.partnerClients.filter((client) => client.status === 'funded').length;
  const availableCommission = partnerMetrics.pendingCommission;

  return {
    actions: [
      action('clients', 'workspace.action.highIntentClients', 'workspace.action.highIntentClients.desc', 'icon.kyc.identity', '/clients', 'brand'),
      action('growth', 'workspace.action.promoMaterial', 'workspace.action.promoMaterial.desc', 'icon.promotion.achievement', '/growth', 'amber'),
      action('wallet', 'workspace.action.commissionWallet', 'workspace.action.commissionWallet.desc', 'icon.wallet.balance', '/wallet', 'up'),
    ],
    assist: {
      ctaKey: 'common.ask',
      eyebrowKey: 'workspace.assist.eyebrow',
      promptKey: 'workspace.assist.partner',
      route: '/me',
      tags: ['workspace.assist.tag.clients', 'workspace.assist.tag.commission', 'workspace.assist.tag.material'],
    },
    header: { modeKey: 'workspace.mode.partner', statusKey: 'workspace.header.partner' },
    markets: [],
    metrics: [
      { id: 'clients', labelKey: 'workspace.metric.registeredClients', value: String(context.partnerClients.length || partnerMetrics.clients), tone: 'brand' },
      { id: 'kyc', labelKey: 'workspace.metric.kycClients', value: String(kycClients), tone: 'info' },
      { id: 'commission', labelKey: 'workspace.metric.availableCommission', value: formatMoney(availableCommission, 'USD', 0, context.locale), tone: 'up' },
    ],
    modeSwitch: action('switchTrader', 'workspace.action.switchTrader', 'workspace.action.switchTrader.desc', 'icon.account.trading', '/accounts', 'blue'),
    primary: {
      badgeKey: followUpClients > 0 ? 'workspace.badge.conversionBreak' : 'workspace.badge.growing',
      badgeTone: followUpClients > 0 ? 'warning' : 'success',
      bodyKey: 'workspace.primary.partner.body',
      ctaKey: 'workspace.cta.viewClients',
      route: '/clients',
      titleKey: 'workspace.primary.partner.title',
    },
    segment: 'partner_mode',
    tabs: ['workspace', 'clients', 'growth', 'wallet', 'me'],
  };
}

function buildWorkspaceAccounts(context: WorkspaceContext) {
  return buildTradingAccountProfiles(context.account, context.positions, context.tradingAccountScenario, {
    countPreset: context.tradingAccountCountPreset,
    dataPreset: context.tradingAccountDataPreset,
    statusPreset: context.tradingAccountStatusPreset,
  });
}

function traderTabs(): WorkspaceTabKey[] {
  return ['workspace', 'markets', 'trade', 'accounts', 'discover', 'quick'];
}

function buildMarketMiniCards(instruments: Instrument[]): WorkspaceMarket[] {
  return instruments
    .filter((instrument) => ['XAU/USD', 'EUR/USD', 'US30'].includes(instrument.symbol))
    .slice(0, 3)
    .map((instrument) => {
      const mid = (instrument.bid + instrument.ask) / 2;
      const changeValue = instrument.previousClose ? ((mid - instrument.previousClose) / instrument.previousClose) * 100 : 0;
      return {
        change: formatPercent(changeValue, 2),
        id: instrument.id,
        price: formatPrice(instrument, mid),
        symbol: instrument.symbol,
        tone: changeValue > 0 ? 'up' : changeValue < 0 ? 'down' : 'muted',
      };
    });
}

function action(
  id: string,
  labelKey: TranslationKey,
  descriptionKey: TranslationKey,
  icon: AppIconName,
  route: Href,
  tone: IconTone = 'text',
): WorkspaceAction {
  return { descriptionKey, icon, id, labelKey, route, tone };
}

function metric(id: string, labelKey: TranslationKey, valueKey: TranslationKey, tone?: WorkspaceTone): WorkspaceMetric {
  return {
    id,
    labelKey,
    tone,
    valueKey,
  };
}
