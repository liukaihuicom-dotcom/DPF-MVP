import type { AppIconName } from '@/src/components/AppIcon';

import type { LocalizedText } from './types';

export type DiscoverLayoutItemId =
  | 'profile'
  | 'functionCenter'
  | 'academy'
  | 'challenge'
  | 'support'
  | 'risk'
  | 'partnerPreview'
  | 'marketBrief';

export type DiscoverLayoutViewMode = 'large' | 'medium' | 'list';

export type DiscoverLayoutItem = {
  id: DiscoverLayoutItemId;
  viewMode: DiscoverLayoutViewMode;
};

export type DiscoverLayoutDefinition = {
  body: LocalizedText;
  defaultViewMode: DiscoverLayoutViewMode;
  icon: AppIconName;
  id: DiscoverLayoutItemId;
  moduleId?: 'profile' | 'education' | 'challenge' | 'support' | 'onboarding' | 'partner';
  title: LocalizedText;
};

export const discoverLayoutDefinitions: DiscoverLayoutDefinition[] = [
  {
    body: { 'en-US': 'Enter your account workspace, assets, rebate state, and application status.', 'zh-CN': '进入账户工作台、资产、返佣和申请状态。' },
    defaultViewMode: 'large',
    icon: 'icon.account.avatar',
    id: 'profile',
    moduleId: 'profile',
    title: { 'en-US': 'Me', 'zh-CN': '我的' },
  },
  {
    body: { 'en-US': 'Markets, trading, wallet, and learning shortcuts live here.', 'zh-CN': '行情、交易、钱包和学习入口集中在这里。' },
    defaultViewMode: 'large',
    icon: 'icon.navigation.function_center',
    id: 'functionCenter',
    title: { 'en-US': 'Function entry', 'zh-CN': '功能入口' },
  },
  {
    body: { 'en-US': 'Short lessons for spread, leverage, margin call, and CFD order basics.', 'zh-CN': '点差、杠杆、保证金追缴和 CFD 下单基础短课。' },
    defaultViewMode: 'medium',
    icon: 'icon.education.academy',
    id: 'academy',
    moduleId: 'education',
    title: { 'en-US': 'Dupoin Academy', 'zh-CN': 'Dupoin 学堂' },
  },
  {
    body: { 'en-US': 'Leaderboard with weekly ROI, drawdown, and trade discipline.', 'zh-CN': '按周展示收益、回撤和交易纪律的挑战榜。' },
    defaultViewMode: 'medium',
    icon: 'icon.promotion.achievement',
    id: 'challenge',
    moduleId: 'challenge',
    title: { 'en-US': 'Demo challenge', 'zh-CN': '模拟挑战赛' },
  },
  {
    body: { 'en-US': 'Help center, service status, and guided support for account setup.', 'zh-CN': '帮助中心、服务状态和账户设置引导客服。' },
    defaultViewMode: 'medium',
    icon: 'icon.support.headset',
    id: 'support',
    moduleId: 'support',
    title: { 'en-US': 'Support desk', 'zh-CN': '客服中心' },
  },
  {
    body: { 'en-US': 'Risk acknowledgement stays visible before every trade flow.', 'zh-CN': '每条交易路径都保留风险确认和提示。' },
    defaultViewMode: 'medium',
    icon: 'icon.security.risk_shield',
    id: 'risk',
    moduleId: 'onboarding',
    title: { 'en-US': 'Risk controls', 'zh-CN': '风险控制' },
  },
  {
    body: { 'en-US': 'IB growth loop kept in the MVP for referrals.', 'zh-CN': 'MVP 保留 IB 推荐增长闭环。' },
    defaultViewMode: 'large',
    icon: 'icon.ib.network',
    id: 'partnerPreview',
    moduleId: 'partner',
    title: { 'en-US': 'Partner preview', 'zh-CN': 'Partner 预览' },
  },
  {
    body: { 'en-US': 'Editorial cards ready for a future CMS feed.', 'zh-CN': '为后续 CMS 资讯流预留的编辑卡片。' },
    defaultViewMode: 'large',
    icon: 'icon.trading.market',
    id: 'marketBrief',
    title: { 'en-US': 'Market brief', 'zh-CN': '市场简报' },
  },
];

export const discoverLayoutItemIds = discoverLayoutDefinitions.map((item) => item.id);
export const discoverLayoutViewModes: DiscoverLayoutViewMode[] = ['large', 'medium', 'list'];

export const defaultDiscoverLayoutItems: DiscoverLayoutItem[] = discoverLayoutDefinitions.map((item) => ({
  id: item.id,
  viewMode: item.defaultViewMode,
}));

export function normalizeDiscoverLayoutItems(value: unknown): DiscoverLayoutItem[] {
  if (!Array.isArray(value)) {
    return defaultDiscoverLayoutItems;
  }

  const seen = new Set<DiscoverLayoutItemId>();
  const normalized: DiscoverLayoutItem[] = [];

  value.forEach((item) => {
    if (!item || typeof item !== 'object') {
      return;
    }

    const candidate = item as Partial<DiscoverLayoutItem>;
    if (!discoverLayoutItemIds.includes(candidate.id as DiscoverLayoutItemId) || seen.has(candidate.id as DiscoverLayoutItemId)) {
      return;
    }

    normalized.push({
      id: candidate.id as DiscoverLayoutItemId,
      viewMode: discoverLayoutViewModes.includes(candidate.viewMode as DiscoverLayoutViewMode) ? (candidate.viewMode as DiscoverLayoutViewMode) : 'list',
    });
    seen.add(candidate.id as DiscoverLayoutItemId);
  });

  defaultDiscoverLayoutItems.forEach((item) => {
    if (!seen.has(item.id)) {
      normalized.push(item);
    }
  });

  return normalized;
}
