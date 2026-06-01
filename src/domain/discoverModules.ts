import type { AppIconName, IconTone } from '@/src/components/AppIcon';
import type { DiscoverModuleId } from '@/src/domain/types';

export type DiscoverModuleMeta = {
  icon: AppIconName;
  tone: IconTone;
};

export function getDiscoverModuleIds(): DiscoverModuleId[] {
  return ['challenge', 'education', 'community', 'profile', 'onboarding', 'partner', 'markets', 'accounts', 'support', 'rewards'];
}

export function getDiscoverModuleMeta(moduleId: DiscoverModuleId): DiscoverModuleMeta {
  const meta: Record<DiscoverModuleId, DiscoverModuleMeta> = {
    accounts: { icon: 'icon.account.trading', tone: 'blue' },
    challenge: { icon: 'icon.promotion.achievement', tone: 'amber' },
    community: { icon: 'icon.copy.community', tone: 'textMuted' },
    education: { icon: 'icon.education.academy', tone: 'brand' },
    markets: { icon: 'icon.trading.market', tone: 'up' },
    onboarding: { icon: 'icon.kyc.identity', tone: 'down' },
    partner: { icon: 'icon.ib.network', tone: 'brand' },
    profile: { icon: 'icon.account.avatar', tone: 'text' },
    rewards: { icon: 'icon.promotion.reward', tone: 'amber' },
    support: { icon: 'icon.support.headset', tone: 'textMuted' },
  };

  return meta[moduleId];
}
