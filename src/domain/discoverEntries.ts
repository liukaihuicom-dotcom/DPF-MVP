import type { AppIconName } from '@/src/components/AppIcon';
import type { IconSurfaceTone } from '@/src/components/IconSurface';

import type { DiscoverModuleId, LocalizedText, Role } from './types';

export type DiscoverEntryGroup = 'profile' | 'onboarding' | 'learning' | 'growth' | 'partner' | 'service';

export type DiscoverEntryStatus = 'ready' | 'demo' | 'placeholder';

export type DiscoverEntryId =
  | 'profile'
  | 'openAccount'
  | 'education'
  | 'challenge'
  | 'rewards'
  | 'community'
  | 'partnerPortal'
  | 'support';

export type DiscoverEntryDefinition = {
  group: DiscoverEntryGroup;
  icon: AppIconName;
  iconTone: IconSurfaceTone;
  id: DiscoverEntryId;
  moduleId: DiscoverModuleId;
  roles: Array<Role | 'guest'>;
  route: string;
  status: DiscoverEntryStatus;
  subtitle: LocalizedText;
  title: LocalizedText;
};

export type DiscoverCampaignId = 'referCommission' | 'riskQuizCredit' | 'paperChallenge' | 'academySprint' | 'partnerBooster';

export type DiscoverCampaignDefinition = {
  badge: LocalizedText;
  icon: AppIconName;
  iconTone: IconSurfaceTone;
  id: DiscoverCampaignId;
  moduleId: DiscoverModuleId;
  roles: Array<Role | 'guest'>;
  subtitle: LocalizedText;
  title: LocalizedText;
};

export const discoverEntryGroups: { id: DiscoverEntryGroup; title: LocalizedText }[] = [
  { id: 'profile', title: { 'en-US': 'Profile', 'id-ID': 'Profil', 'zh-CN': '我的' } },
  { id: 'onboarding', title: { 'en-US': 'Open & verify', 'id-ID': 'Buka akun & verifikasi', 'zh-CN': '开户认证' } },
  { id: 'learning', title: { 'en-US': 'Learning & risk', 'id-ID': 'Edukasi & risiko', 'zh-CN': '学习风控' } },
  { id: 'growth', title: { 'en-US': 'Growth', 'id-ID': 'Pertumbuhan', 'zh-CN': '成长活动' } },
  { id: 'partner', title: { 'en-US': 'Partner / IB', 'id-ID': 'Partner / IB', 'zh-CN': 'Partner / IB' } },
  { id: 'service', title: { 'en-US': 'Service', 'id-ID': 'Layanan', 'zh-CN': '服务支持' } },
];

export const discoverEntryDefinitions: DiscoverEntryDefinition[] = [
  {
    group: 'profile',
    icon: 'icon.account.avatar',
    iconTone: 'info',
    id: 'profile',
    moduleId: 'profile',
    roles: ['trader', 'partner'],
    route: '/me',
    status: 'ready',
    subtitle: { 'en-US': 'Profile, verification tags, settings, and relationship manager.', 'id-ID': 'Profil, tag verifikasi, pengaturan, dan manajer relasi.', 'zh-CN': '个人资料、认证标签、设置和客户经理。' },
    title: { 'en-US': 'Me', 'id-ID': 'Saya', 'zh-CN': '我的' },
  },
  {
    group: 'partner',
    icon: 'icon.ib.network',
    iconTone: 'brand',
    id: 'partnerPortal',
    moduleId: 'partner',
    roles: ['trader', 'partner'],
    route: '/partner',
    status: 'demo',
    subtitle: { 'en-US': 'Partner function center, client funnel, and commission progress.', 'id-ID': 'Pusat fungsi Partner, funnel klien, dan progres komisi.', 'zh-CN': 'Partner 功能中心、客户漏斗和返佣进度。' },
    title: { 'en-US': 'Partner Portal', 'id-ID': 'Portal Partner', 'zh-CN': 'Partner Portal' },
  },
  {
    group: 'onboarding',
    icon: 'icon.kyc.identity',
    iconTone: 'success',
    id: 'openAccount',
    moduleId: 'onboarding',
    roles: ['guest', 'trader'],
    route: '/open-account',
    status: 'demo',
    subtitle: { 'en-US': 'Guided registration, account setup, and risk acknowledgement.', 'id-ID': 'Pendaftaran terpandu, pengaturan akun, dan konfirmasi risiko.', 'zh-CN': '注册引导、开户设置和风险确认。' },
    title: { 'en-US': 'Open account', 'id-ID': 'Buka akun', 'zh-CN': '开户' },
  },
  {
    group: 'learning',
    icon: 'icon.education.academy',
    iconTone: 'info',
    id: 'education',
    moduleId: 'education',
    roles: ['guest', 'trader', 'partner'],
    route: '/academy',
    status: 'placeholder',
    subtitle: { 'en-US': 'Spread, leverage, margin call, and CFD basics.', 'id-ID': 'Dasar spread, leverage, margin call, dan CFD.', 'zh-CN': '点差、杠杆、保证金追缴和 CFD 基础。' },
    title: { 'en-US': 'Derivative academy', 'id-ID': 'Akademi derivatif', 'zh-CN': '衍生品学堂' },
  },
  {
    group: 'growth',
    icon: 'icon.promotion.achievement',
    iconTone: 'warning',
    id: 'challenge',
    moduleId: 'challenge',
    roles: ['trader', 'partner'],
    route: '/challenge',
    status: 'placeholder',
    subtitle: { 'en-US': 'Paper-trading challenge with virtual ROI and drawdown context.', 'id-ID': 'Tantangan trading paper dengan ROI virtual dan konteks drawdown.', 'zh-CN': '练习交易挑战赛，展示虚拟收益率与回撤。' },
    title: { 'en-US': 'Paper FX challenge', 'id-ID': 'Tantangan FX paper', 'zh-CN': '外汇挑战赛' },
  },
  {
    group: 'growth',
    icon: 'icon.promotion.reward',
    iconTone: 'warning',
    id: 'rewards',
    moduleId: 'rewards',
    roles: ['trader', 'partner'],
    route: '/rewards',
    status: 'placeholder',
    subtitle: { 'en-US': 'Reward ledger, badges, and growth missions.', 'id-ID': 'Buku besar hadiah, badge, dan misi pertumbuhan.', 'zh-CN': '奖励台账、成长徽章和任务。' },
    title: { 'en-US': 'Rewards', 'id-ID': 'Hadiah', 'zh-CN': '奖励' },
  },
  {
    group: 'growth',
    icon: 'icon.copy.community',
    iconTone: 'success',
    id: 'community',
    moduleId: 'community',
    roles: ['trader', 'partner'],
    route: '/community',
    status: 'placeholder',
    subtitle: { 'en-US': 'Signal posts, trade reviews, and trader community updates.', 'id-ID': 'Unggahan sinyal, ulasan trading, dan update komunitas trader.', 'zh-CN': '信号帖、交易复盘和交易社区动态。' },
    title: { 'en-US': 'Community', 'id-ID': 'Komunitas', 'zh-CN': '社区' },
  },
  {
    group: 'service',
    icon: 'icon.support.headset',
    iconTone: 'info',
    id: 'support',
    moduleId: 'support',
    roles: ['guest', 'trader', 'partner'],
    route: '/support',
    status: 'placeholder',
    subtitle: { 'en-US': 'Help center, support desk, notifications, and service status.', 'id-ID': 'Pusat bantuan, meja dukungan, notifikasi, dan status layanan.', 'zh-CN': '帮助中心、客服、通知和服务状态。' },
    title: { 'en-US': 'Support center', 'id-ID': 'Pusat dukungan', 'zh-CN': '客服中心' },
  },
];

export const discoverCampaignDefinitions: DiscoverCampaignDefinition[] = [
  {
    badge: { 'en-US': 'Referral', 'id-ID': 'Referral', 'zh-CN': '邀请' },
    icon: 'icon.promotion.reward',
    iconTone: 'warning',
    id: 'referCommission',
    moduleId: 'partner',
    roles: ['partner'],
    subtitle: {
      'en-US': 'Invite qualified clients and review rebate rules before sharing.',
      'id-ID': 'Undang klien yang memenuhi syarat dan tinjau aturan komisi sebelum berbagi.',
      'zh-CN': '邀请合格客户，分享前请先查看返佣规则。',
    },
    title: { 'en-US': 'Earn up to 10,000 USDC commission', 'id-ID': 'Komisi hingga 10.000 USDC', 'zh-CN': '最高 10,000 USDC 返佣活动' },
  },
  {
    badge: { 'en-US': 'Risk first', 'id-ID': 'Risiko dulu', 'zh-CN': '先学风险' },
    icon: 'icon.education.academy',
    iconTone: 'info',
    id: 'riskQuizCredit',
    moduleId: 'education',
    roles: ['guest', 'trader', 'partner'],
    subtitle: {
      'en-US': 'Finish leverage and margin lessons to unlock practice credits.',
      'id-ID': 'Selesaikan pelajaran leverage dan margin untuk membuka kredit latihan.',
      'zh-CN': '完成杠杆与保证金课程，解锁练习体验金。',
    },
    title: { 'en-US': 'Complete the risk quiz', 'id-ID': 'Selesaikan kuis risiko', 'zh-CN': '完成风险测验' },
  },
  {
    badge: { 'en-US': 'Weekly', 'id-ID': 'Mingguan', 'zh-CN': '每周' },
    icon: 'icon.promotion.achievement',
    iconTone: 'warning',
    id: 'paperChallenge',
    moduleId: 'challenge',
    roles: ['trader', 'partner'],
    subtitle: {
      'en-US': 'Paper-trade majors and metals with drawdown context.',
      'id-ID': 'Latihan trading pada major dan metal dengan konteks drawdown.',
      'zh-CN': '用练习账户交易主要货币对与贵金属，并查看回撤。',
    },
    title: { 'en-US': 'Paper FX challenge is live', 'id-ID': 'Tantangan FX latihan berlangsung', 'zh-CN': '外汇挑战赛进行中' },
  },
  {
    badge: { 'en-US': '3 min', 'id-ID': '3 mnt', 'zh-CN': '3 分钟' },
    icon: 'icon.promotion.ticket',
    iconTone: 'success',
    id: 'academySprint',
    moduleId: 'rewards',
    roles: ['guest', 'trader', 'partner'],
    subtitle: {
      'en-US': 'Build a safer trading routine with short CFD missions.',
      'id-ID': 'Bangun rutinitas trading yang lebih terukur lewat misi CFD singkat.',
      'zh-CN': '通过 CFD 短任务建立更稳健的交易习惯。',
    },
    title: { 'en-US': 'Academy sprint rewards', 'id-ID': 'Hadiah sprint akademi', 'zh-CN': '学堂冲刺奖励' },
  },
  {
    badge: { 'en-US': 'IB', 'id-ID': 'IB', 'zh-CN': 'IB' },
    icon: 'icon.ib.network',
    iconTone: 'brand',
    id: 'partnerBooster',
    moduleId: 'partner',
    roles: ['partner'],
    subtitle: {
      'en-US': 'Review client funnel tasks and monthly commission progress.',
      'id-ID': 'Tinjau tugas funnel klien dan progres komisi bulanan.',
      'zh-CN': '查看客户漏斗任务与月度返佣进度。',
    },
    title: { 'en-US': 'Partner growth booster', 'id-ID': 'Akselerator pertumbuhan Partner', 'zh-CN': 'Partner 增长加速' },
  },
];

export function getDiscoverEntryById(id: string) {
  return discoverEntryDefinitions.find((entry) => entry.id === id);
}
