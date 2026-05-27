import type { LocalizedText } from './types';

export type DupoinMvpAction = {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  icon: 'icon.trading.market' | 'icon.trading.order_ticket' | 'icon.wallet.balance' | 'icon.promotion.achievement' | 'icon.education.academy' | 'icon.ib.network' | 'icon.support.headset' | 'icon.security.risk_shield';
  route: string;
};

export type DupoinMarketInsight = {
  id: string;
  category: LocalizedText;
  title: LocalizedText;
  body: LocalizedText;
  time: LocalizedText;
};

export type DupoinProfileItem = {
  id: string;
  label: LocalizedText;
  value: LocalizedText;
  status: 'ready' | 'review' | 'locked';
};

export const dupoinHeroStats = [
  { id: 'quotes', label: { 'en-US': 'Live markets', 'zh-CN': '实时行情' }, value: '42' },
  { id: 'wallet', label: { 'en-US': 'Practice equity', 'zh-CN': '练习净值' }, value: '$50K' },
  { id: 'risk', label: { 'en-US': 'Risk mode', 'zh-CN': '风控模式' }, value: 'Practice' },
];

export const dupoinQuickActions: DupoinMvpAction[] = [
  {
    id: 'markets',
    icon: 'icon.trading.market',
    route: '/markets',
    subtitle: { 'en-US': 'FX, metals, indices', 'zh-CN': '外汇、贵金属、指数' },
    title: { 'en-US': 'Watch markets', 'zh-CN': '看行情' },
  },
  {
    id: 'order',
    icon: 'icon.trading.order_ticket',
    route: '/order/eur-usd',
    subtitle: { 'en-US': 'EUR/USD ticket', 'zh-CN': 'EUR/USD 下单票' },
    title: { 'en-US': 'Practice trade', 'zh-CN': '练习交易' },
  },
  {
    id: 'wallet',
    icon: 'icon.wallet.balance',
    route: '/accounts',
    subtitle: { 'en-US': 'Equity and margin', 'zh-CN': '净值与保证金' },
    title: { 'en-US': 'Wallet', 'zh-CN': '钱包' },
  },
  {
    id: 'academy',
    icon: 'icon.education.academy',
    route: '/discover',
    subtitle: { 'en-US': 'CFD risk primers', 'zh-CN': 'CFD 风险入门' },
    title: { 'en-US': 'Learn', 'zh-CN': '学习' },
  },
];

export const dupoinOnboardingSteps = [
  {
    id: 'identity',
    label: { 'en-US': 'Create profile', 'zh-CN': '创建身份' },
    state: { 'en-US': 'Done', 'zh-CN': '已完成' },
  },
  {
    id: 'risk',
    label: { 'en-US': 'Risk acknowledgement', 'zh-CN': '风险确认' },
    state: { 'en-US': 'Ready', 'zh-CN': '已就绪' },
  },
  {
    id: 'trade',
    label: { 'en-US': 'First practice trade', 'zh-CN': '首笔练习交易' },
    state: { 'en-US': 'Next', 'zh-CN': '下一步' },
  },
];

export const dupoinInsights: DupoinMarketInsight[] = [
  {
    body: {
      'en-US': 'Gold volatility remains elevated ahead of the US session. Keep lot size small for practice orders.',
      'zh-CN': '美盘前黄金波动仍高，练习下单建议控制手数。',
    },
    category: { 'en-US': 'Market brief', 'zh-CN': '市场简报' },
    id: 'gold-vol',
    time: { 'en-US': '10 min ago', 'zh-CN': '10 分钟前' },
    title: { 'en-US': 'XAU/USD tests the upper range', 'zh-CN': 'XAU/USD 测试上沿区间' },
  },
  {
    body: {
      'en-US': 'EUR/USD spread is stable. Good pair for first order practice.',
      'zh-CN': '当前 EUR/USD 点差稳定，适合首单练习。',
    },
    category: { 'en-US': 'Beginner path', 'zh-CN': '新手路径' },
    id: 'eur-spread',
    time: { 'en-US': '32 min ago', 'zh-CN': '32 分钟前' },
    title: { 'en-US': 'Major FX pairs stay orderly', 'zh-CN': '主要货币对波动有序' },
  },
];

export const dupoinProfileItems: DupoinProfileItem[] = [
  {
    id: 'demo-account',
    label: { 'en-US': 'Practice trading account', 'zh-CN': '练习交易账户' },
    status: 'ready',
    value: { 'en-US': 'Active', 'zh-CN': '已启用' },
  },
  {
    id: 'risk',
    label: { 'en-US': 'Risk notice', 'zh-CN': '风险提示' },
    status: 'ready',
    value: { 'en-US': 'Accepted', 'zh-CN': '已确认' },
  },
  {
    id: 'kyc',
    label: { 'en-US': 'Live account KYC', 'zh-CN': '真实账户 KYC' },
    status: 'locked',
    value: { 'en-US': 'Not connected', 'zh-CN': '未接入' },
  },
  {
    id: 'partner',
    label: { 'en-US': 'Partner program', 'zh-CN': 'Partner 计划' },
    status: 'review',
    value: { 'en-US': 'Under review', 'zh-CN': '审核中' },
  },
];
