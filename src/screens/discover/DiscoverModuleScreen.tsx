import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { DimensionValue } from 'react-native';

import { ActionButton } from '@/src/design-public-assets/components';
import { bottomSheetPresets, useBottomSheet } from '@/src/design-public-assets/components';
import { PartnerPortalSummary, RelationshipManagerCard, RewardSummaryCard, VerificationStatusCard } from '@/src/design-public-assets/business-components';
import { Card } from '@/src/design-public-assets/components';
import { GlobalMenuList, type GlobalMenuListItem } from '@/src/design-public-assets/components';
import { InstrumentIcon } from '@/src/design-public-assets/components';
import { IconSurface, type IconSurfaceTone } from '@/src/design-public-assets/components';
import { Metric } from '@/src/design-public-assets/components';
import { NativePressable } from '@/src/design-public-assets/components';
import { AppIcon, type AppIconName, type IconTone } from '@/src/design-public-assets/components';
import { getQuoteChangeVisual } from '@/src/design-public-assets/components';
import { Screen } from '@/src/design-public-assets/components';
import { Sparkline } from '@/src/design-public-assets/components';
import { StatusPill } from '@/src/design-public-assets/components';
import { TextField } from '@/src/design-public-assets/components';
import { useOverlayQueue } from '@/src/design-public-assets/components';
import { AppText } from '@/src/design-public-assets/components';
import { ProfileAvatar, getProfileAvatarUri, profileAvatarOptions, type ProfileAvatarId } from '@/src/design-public-assets/components';
import { dupoinInsights, dupoinOnboardingSteps } from '@/src/domain/dupoinMvp';
import { formatCompactMoney, formatMoney, formatPercent, formatPrice, localizeText } from '@/src/domain/format';
import { partnerMetrics } from '@/src/domain/mockData';
import { getDisplayChange } from '@/src/domain/trading';
import type { Account, DiscoverModuleId, Instrument } from '@/src/domain/types';
import { useToast } from '@/src/feedback/Toast';
import { impactLight, notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { useBroker } from '@/src/state/BrokerStore';
import { lineWidth, layout, radius, size, spacing, typography, zIndex } from '@/src/design-public-assets/tokens';

export default function DiscoverModuleScreen() {
  const { account, instruments, positions, role, submitUpgradeRequest, upgradeRequest } = useBroker();
  const { locale, colors, selectedDiscoverModuleId, setSelectedDiscoverModule, t } = useProductSettings();
  const selectedInstrument = getPrimaryInstrument(selectedDiscoverModuleId, instruments);
  const moduleMeta = getModuleMeta(selectedDiscoverModuleId);

  if (selectedDiscoverModuleId === 'profile') {
    return (
      <Screen
        contentInsetBottom={12}
        rightActions={[
          { icon: 'icon.support.headset', label: t('top.support') },
          { icon: 'icon.notification.email', label: t('top.notifications') },
        ]}
        title={t('discover.module.profile.title')}>
        <ProfileModule account={account} role={role} upgradeStatus={upgradeRequest.status} />
      </Screen>
    );
  }

  return (
    <Screen
      rightActions={[{ icon: 'icon.navigation.discover', label: t('tabs.discover'), onPress: () => router.push('/partner-tools' as never) }]}
      subtitle={t('discover.subtitle')}
      title={t(`discover.module.${selectedDiscoverModuleId}.title`)}>
      <Card>
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <IconSurface icon={moduleMeta.icon} sizeVariant="lg" tone={resolveDiscoverIconSurfaceTone(moduleMeta.tone)} />
            <View style={styles.flex}>
              <AppText variant="largeNumber">{t(`discover.module.${selectedDiscoverModuleId}.short`)}</AppText>
              <AppText numberOfLines={3} tone="muted" variant="caption">
                {t(`discover.module.${selectedDiscoverModuleId}.hint`)}
              </AppText>
            </View>
          </View>
          <ActionButton label={t('discover.menuTitle')} onPress={() => router.push('/partner-tools' as never)} style={styles.heroAction} tone="neutral" variant="outline" />
        </View>
      </Card>

      {selectedDiscoverModuleId === 'challenge' ? <ChallengeModule instrument={selectedInstrument} /> : null}
      {selectedDiscoverModuleId === 'education' ? <EducationModule /> : null}
      {selectedDiscoverModuleId === 'community' ? <CommunityModule /> : null}
      {selectedDiscoverModuleId === 'onboarding' ? <OnboardingModule /> : null}
      {selectedDiscoverModuleId === 'partner' ? <PartnerModule role={role} submitUpgradeRequest={submitUpgradeRequest} upgradeStatus={upgradeRequest.status} /> : null}
      {selectedDiscoverModuleId === 'markets' ? <MarketsModule instruments={instruments} /> : null}
      {selectedDiscoverModuleId === 'accounts' ? <AccountsModule account={account} positionsCount={positions.length} /> : null}
      {selectedDiscoverModuleId === 'support' ? <SupportModule /> : null}
      {selectedDiscoverModuleId === 'rewards' ? <RewardsModule /> : null}

      <ScrollView contentContainerStyle={styles.moduleRail} horizontal showsHorizontalScrollIndicator={false}>
        {getModuleIds().map((moduleId) => {
          const meta = getModuleMeta(moduleId);
          const selected = selectedDiscoverModuleId === moduleId;

          return (
            <NativePressable
              accessibilityLabel={t(`discover.module.${moduleId}.title`)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={moduleId}
              minTouch={size.control.lg + spacing.xxl + spacing.xs}
              onPress={() => {
                setSelectedDiscoverModule(moduleId);
                void impactLight();
                router.replace('/quick' as never);
              }}
              style={StyleSheet.flatten([
                styles.modulePill,
                {
                  backgroundColor: colors.surface.panel,
                  borderColor: selected ? colors.text.primary : colors.border.subtle,
                },
              ])}>
              <IconSurface icon={meta.icon} sizeVariant="sm" tone={resolveDiscoverIconSurfaceTone(meta.tone)} />
              <AppText numberOfLines={1} tone="default" variant="caption">
                {t(`discover.module.${moduleId}.short`)}
              </AppText>
            </NativePressable>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

function ChallengeModule({ instrument }: { instrument: Instrument }) {
  const { locale, colors, t } = useProductSettings();
  const { changePercent } = getDisplayChange(instrument);
  const quoteVisual = getQuoteChangeVisual(changePercent, colors);
  const rows = [
    { label: t('discover.challenge.weeklyRoi'), tone: 'down', value: '+18.6%' },
    { label: t('discover.challenge.riskScore'), tone: 'amber', value: '82' },
    { label: t('discover.challenge.rank'), tone: 'brand', value: '#12' },
  ] as const;

  return (
    <>
      <Card>
        <View style={styles.marketFocusTop}>
          <InstrumentIcon instrument={instrument} size={layout.touchTargetMin - spacing.xxs} />
          <View style={styles.flex}>
            <AppText tone="dim" variant="eyebrow">
              {t('discover.challenge.market')}
            </AppText>
            <AppText variant="subtitle">{instrument.symbol}</AppText>
            <AppText numberOfLines={1} tone="muted" variant="caption">
              {localizeText(instrument.name, locale)}
            </AppText>
          </View>
          <View style={StyleSheet.flatten([styles.changeBadge, { backgroundColor: changePercent >= 0 ? colors.overlay.up.subtle : colors.overlay.down.subtle }])}>
            <AppText tone={quoteVisual.tone} variant="caption">
              {formatPercent(changePercent)}
            </AppText>
          </View>
        </View>
        <View style={styles.sparklineWrap}>
          <Sparkline color={quoteVisual.color} height={58} values={instrument.sparkline} width={232} />
        </View>
        <ActionButton label={t('discover.challenge.openTicket')} onPress={() => router.push(`/order/${instrument.id}?direction=buy` as never)} tone="brand" variant="filled" />
      </Card>
      <Card compact>
        <View style={styles.metricRow}>
          {rows.map((row) => (
            <Metric key={row.label} label={row.label} tone={row.tone} value={row.value} />
          ))}
        </View>
      </Card>
    </>
  );
}

function EducationModule() {
  const { colors, t } = useProductSettings();
  const lessons = [
    [t('discover.education.lesson.spread.title'), t('discover.education.lesson.spread.body')],
    [t('discover.education.lesson.marginCall.title'), t('discover.education.lesson.marginCall.body')],
    [t('discover.education.lesson.cfdRisk.title'), t('discover.education.lesson.cfdRisk.body')],
  ];

  return (
    <Card>
      <View style={styles.timeline}>
        {lessons.map(([title, body], index) => (
          <View key={title} style={styles.timelineRow}>
            <View style={StyleSheet.flatten([styles.timelineMark, { backgroundColor: index === 0 ? colors.brand.fg : colors.surface.subtle, borderColor: index === 0 ? colors.brand.fg : colors.border.subtle }])}>
              <AppText tone={index === 0 ? 'white' : 'dim'} variant="eyebrow">
                {index + 1}
              </AppText>
            </View>
            <View style={styles.flex}>
              <AppText variant="body">{title}</AppText>
              <AppText tone="muted" variant="caption">
                {body}
              </AppText>
            </View>
          </View>
        ))}
      </View>
      <ActionButton label={t('discover.education.practiceCta')} onPress={() => router.push('/order/eur-usd' as never)} style={styles.cardAction} tone="brand" variant="filled" />
    </Card>
  );
}

function CommunityModule() {
  const { locale, colors } = useProductSettings();

  return (
    <Card>
      <View style={styles.insightList}>
        {dupoinInsights.map((insight) => (
          <View key={insight.id} style={StyleSheet.flatten([styles.insightRow, { borderTopColor: colors.border.subtle }])}>
            <View style={styles.flex}>
              <AppText tone="brand" variant="eyebrow">
                {localizeText(insight.category, locale)}
              </AppText>
              <AppText variant="subtitle">{localizeText(insight.title, locale)}</AppText>
              <AppText numberOfLines={3} tone="muted" variant="caption">
                {localizeText(insight.body, locale)}
              </AppText>
            </View>
            <AppText tone="dim" variant="caption">
              {localizeText(insight.time, locale)}
            </AppText>
          </View>
        ))}
      </View>
    </Card>
  );
}

export function ProfileModule({
  account,
  role,
  upgradeStatus,
}: {
  account: Account;
  role: 'trader' | 'partner';
  upgradeStatus: 'none' | 'pending' | 'approved' | 'rejected';
}) {
  const {
    locale,
    colors,
    profileAvatarId,
    profileNickname,
    pinStatus,
    rememberedLoginSnapshot,
    resolvedThemeMode,
    setAuthStatus,
    setLocalPinCode,
    setRememberedLoginSnapshot,
    setPinGateStatus,
    setPinStatus,
    setProfileAvatarId,
    setProfileNickname,
    t,
    themeMode,
  } = useProductSettings();
  const bottomSheet = useBottomSheet();
  const rebateValue = role === 'partner' || upgradeStatus === 'approved' ? partnerMetrics.pendingCommission + partnerMetrics.settledCommission : 10005;
  const statCards = [
    { icon: 'icon.wallet.deposit' as AppIconName, label: t('discover.profile.stat.deposit'), value: '$10K' },
    { icon: 'icon.trading.volume' as AppIconName, label: t('discover.profile.stat.volume'), value: '990' },
    { icon: 'icon.status.verified' as AppIconName, label: t('discover.profile.stat.newVerified'), value: '10' },
  ];
  const settingsRows: GlobalMenuListItem[] = [
    {
      accessory: {
        accessibilityLabel: t('discover.profile.setting.oneClickTradingToggle'),
        onValueChange: () => undefined,
        type: 'switch',
        value: false,
      },
      icon: 'icon.trading.order_ticket',
      label: t('discover.profile.setting.oneClickTrading'),
    },
    {
      accessory: {
        accessibilityLabel: t('discover.profile.setting.soundToggle'),
        onValueChange: () => undefined,
        type: 'switch',
        value: true,
      },
      icon: 'icon.notification.bell',
      label: t('discover.profile.setting.sound'),
    },
    { icon: 'icon.notification.bell', label: t('top.notifications') },
    { icon: 'icon.trading.market', label: t('discover.profile.setting.language') },
    {
      accessory: {
        type: 'value',
        value: t(`auth.pin.status.${pinStatus}`),
      },
      description: t('auth.pin.localCheckSubtitle'),
      icon: 'icon.security.key_access' as AppIconName,
      label: t('auth.pin.title'),
      onPress: () => router.push('/auth/pin-setup?mode=setup&redirect=%2Fsettings' as never),
    },
    {
      icon: 'icon.security.risk_shield' as AppIconName,
      label: t('settings.securityLog.title'),
      onPress: () => router.push('/settings/security-log' as never),
    },
    {
      accessory: {
        type: 'value',
        value: getThemeModeLabel(themeMode, resolvedThemeMode, t),
      },
      icon: 'icon.system.settings' as AppIconName,
      label: t('settings.appearance.title'),
      onPress: () => router.push('/appearance' as never),
    },
  ];
  const supportRows: GlobalMenuListItem[] = [
    { icon: 'icon.security.risk_shield', label: t('discover.profile.support.fraudPrevention') },
    { icon: 'icon.notification.feedback', label: t('discover.profile.support.feedback') },
    { icon: 'icon.support.help_center', label: t('discover.profile.support.helpCenter') },
    { accessory: { type: 'rating' }, icon: 'icon.feedback.rating', label: t('discover.profile.support.ratingApp') },
    { icon: 'icon.support.about', label: t('discover.profile.support.aboutUs') },
  ];
  const openManagerChat = () => {
    void impactLight();
    bottomSheet.show(bottomSheetPresets.detail({
      content: <ManagerChatSheet />,
      leftIcon: 'icon.notification.feedback',
      title: t('discover.profile.manager.name'),
    }));
  };
  const openProfileEditSheet = () => {
    bottomSheet.show(bottomSheetPresets.detail({
      content: <ProfileEditSheetContent />,
      title: t('discover.profile.edit.title'),
    }));
  };
  const logout = () => {
    if (rememberedLoginSnapshot) {
      setRememberedLoginSnapshot({
        ...rememberedLoginSnapshot,
        avatarId: profileAvatarId,
        nickname: profileNickname.trim() || rememberedLoginSnapshot.nickname,
      });
    }

    setPinGateStatus('unlocked');
    setPinStatus('unset');
    setLocalPinCode('');
    setAuthStatus('guest');
    void notifySuccess();
    router.replace('/auth' as never);
  };
  const avatarUri = getProfileAvatarUri(profileAvatarId);

  return (
    <>
      <View style={styles.profileHeader}>
        <NativePressable
          accessibilityLabel={t('discover.profile.edit.avatarAccessibility')}
          minTouch={size.control.lg + spacing.xxs}
          onPress={openProfileEditSheet}
          style={styles.avatarPressable}>
          <ProfileAvatar id={profileAvatarId} key={avatarUri} size={size.control.lg + spacing.xxs} />
          <View style={StyleSheet.flatten([styles.avatarEditBadge, { backgroundColor: colors.brand.fg, borderColor: colors.surface.panel }])}>
            <AppIcon tone="white" name="icon.system.settings" sizeVariant="micro" />
          </View>
        </NativePressable>
        <View style={styles.profileIdentity}>
          <NativePressable
            accessibilityLabel={t('discover.profile.edit.identityAccessibility')}
            minTouch={layout.touchTargetMin}
            onPress={openProfileEditSheet}
            style={styles.profileNameRow}>
            <AppText variant="title">{profileNickname.trim() || t('auth.profile.noNickname')}</AppText>
          </NativePressable>
          <View style={styles.profileTagRow}>
            <StatusPill compact icon="icon.security.risk_shield" label={t('discover.profile.tag.idVerified')} style={styles.profileTag} tone="brand" />
            <StatusPill compact icon="icon.status.verified" label={t('discover.profile.tag.videoVerified')} style={styles.profileTag} tone="brand" />
          </View>
        </View>
      </View>

      <VerificationStatusCard
        subtitle={t('discover.profile.verification.subtitle')}
        title={t('discover.profile.verification.title')}
      />

      <PartnerPortalSummary
        accountCurrency={account.currency}
        locale={locale}
        rebateValue={rebateValue}
        title={t('discover.profile.partnerPortal.title')}
        totalLabel={t('discover.profile.partnerPortal.totalRebate')}
        trendLabel={t('discover.profile.partnerPortal.trendYesterday')}
      />

      <View style={styles.profileStatsGrid}>
        {statCards.map((item) => (
          <Card compact key={item.label} style={styles.profileStatCard}>
            <IconSurface icon={item.icon} sizeVariant="md" />
            <AppText variant="body">{item.label}</AppText>
            <AppText variant="title">{item.value}</AppText>
            <AppText tone="up" variant="caption">
              {t('discover.profile.stat.todayChange')}
            </AppText>
          </Card>
        ))}
      </View>

      <RewardSummaryCard
        activeCampaignsLabel={t('discover.profile.reward.activeCampaigns', { count: 3 })}
        title={t('discover.module.rewards.title')}
        totalLabel={t('discover.profile.reward.totalValue')}
      />

      <RelationshipManagerCard
        accessibilityLabel={t('discover.profile.manager.openChat', { name: t('discover.profile.manager.name') })}
        managerName={t('discover.profile.manager.name')}
        onPress={openManagerChat}
        title={t('discover.profile.manager.title')}
      />

      <View style={StyleSheet.flatten([styles.profileMenuList, { backgroundColor: colors.surface.panel }])}>
        <GlobalMenuList contained items={settingsRows} />
      </View>

      <View style={StyleSheet.flatten([styles.profileMenuList, { backgroundColor: colors.surface.panel }])}>
        <GlobalMenuList contained items={supportRows} />
      </View>

      <ActionButton icon="icon.system.logout" label={t('auth.logout')} onPress={logout} tone="danger" variant="outline" />
    </>
  );
}

function ProfileEditSheetContent() {
  const { colors, profileAvatarId, profileNickname, setProfileAvatarId, setProfileNickname, t } = useProductSettings();
  const chooseAvatar = (nextId: ProfileAvatarId) => {
    void impactLight();
    setProfileAvatarId(nextId);
  };
  const updateNickname = (value: string) => {
    setProfileNickname(value.slice(0, 24).trim());
  };

  return (
    <View style={styles.profileEditSheet}>
      <View style={styles.profileEditHero}>
        <ProfileAvatar id={profileAvatarId} size={size.icon.display} />
        <View style={styles.flex}>
          <AppText variant="subtitle">{profileNickname.trim() || t('auth.profile.noNickname')}</AppText>
          <AppText tone="muted" variant="caption">
            {t('discover.profile.edit.description')}
          </AppText>
        </View>
      </View>
      <TextField
        label={t('auth.profile.nickname')}
        onChangeText={updateNickname}
        placeholder={t('auth.profile.nicknamePlaceholder')}
        value={profileNickname}
      />
      <ScrollView contentContainerStyle={styles.avatarRail} horizontal showsHorizontalScrollIndicator={false}>
        {profileAvatarOptions.map((option) => {
          const selected = option.id === profileAvatarId;

          return (
            <Pressable
              accessibilityLabel={t('discover.profile.edit.chooseAvatar', { name: option.name })}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={option.id}
              onPress={() => chooseAvatar(option.id)}
              style={StyleSheet.flatten([
                styles.avatarRailItem,
                {
                  backgroundColor: colors.surface.panel,
                  borderColor: selected ? colors.text.primary : colors.border.subtle,
                },
              ])}>
              <ProfileAvatar id={option.id} selected={selected} size={size.control.sm - spacing.xs} />
              <AppText numberOfLines={1} tone={selected ? 'default' : 'muted'} variant="caption">
                {option.name}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function ManagerChatSheet() {
  const { colors, t } = useProductSettings();
  const messages = [
    {
      body: t('discover.profile.manager.messageIntro'),
      side: 'manager',
    },
    {
      body: t('discover.profile.manager.messageUser'),
      side: 'user',
    },
    {
      body: t('discover.profile.manager.messageSync'),
      side: 'manager',
    },
  ] as const;

  return (
    <View style={styles.managerChatSheet}>
      <View style={StyleSheet.flatten([styles.managerChatProfile, { backgroundColor: colors.surface.panel }])}>
        <ProfileAvatar id="alex" size={layout.touchTargetMin} />
        <View style={styles.flex}>
          <AppText variant="subtitle">{t('discover.profile.manager.name')}</AppText>
          <AppText tone="muted" variant="body.secondary">
            {t('discover.profile.manager.status')}
          </AppText>
        </View>
      </View>
      <View style={styles.managerMessageList}>
        {messages.map((message, index) => {
          const isUser = message.side === 'user';

          return (
            <View
              key={`${message.side}-${index}`}
              style={StyleSheet.flatten([
                styles.managerMessageRow,
                isUser && styles.managerMessageRowUser,
              ])}>
              <View
                style={StyleSheet.flatten([
                  styles.managerMessageBubble,
                  { backgroundColor: isUser ? colors.brand.fg : colors.surface.panel },
                ])}>
                <AppText tone={isUser ? 'panel' : 'default'} variant="body.secondary">
                  {message.body}
                </AppText>
              </View>
            </View>
          );
        })}
      </View>
      <View style={StyleSheet.flatten([styles.managerComposer, { backgroundColor: colors.surface.panel }])}>
        <AppText tone="muted" variant="body.secondary">
          {t('discover.profile.manager.composerState')}
        </AppText>
        <AppIcon name="icon.notification.feedback" size={layout.menuDisclosureIconSize} styleVariant="fill" tone="tertiary" />
      </View>
    </View>
  );
}

function getThemeModeLabel(themeMode: ReturnType<typeof useProductSettings>['themeMode'], resolvedThemeMode: ReturnType<typeof useProductSettings>['resolvedThemeMode'], t: ReturnType<typeof useProductSettings>['t']) {
  if (themeMode === 'system') {
    return resolvedThemeMode === 'lightBroker' ? t('theme.systemLight') : t('theme.systemDark');
  }

  return t(themeMode === 'lightBroker' ? 'theme.light' : 'theme.dark');
}

function OnboardingModule() {
  const { locale, colors, t } = useProductSettings();

  return (
    <Card>
      <View style={styles.timeline}>
        {dupoinOnboardingSteps.map((step, index) => (
          <View key={step.id} style={styles.timelineRow}>
            <View style={StyleSheet.flatten([styles.timelineMark, { backgroundColor: index < 2 ? colors.status.success.fg : colors.brand.fg, borderColor: index < 2 ? colors.status.success.fg : colors.brand.fg }])}>
              <AppText tone="white" variant="eyebrow">
                {index + 1}
              </AppText>
            </View>
            <View style={styles.flex}>
              <AppText variant="body">{localizeText(step.label, locale)}</AppText>
              <AppText tone={index < 2 ? 'success' : 'brand'} variant="caption">
                {localizeText(step.state, locale)}
              </AppText>
            </View>
          </View>
        ))}
      </View>
      <ActionButton label={t('discover.onboarding.continueCta')} onPress={() => router.push('/auth/onboarding' as never)} style={styles.cardAction} tone="brand" variant="filled" />
    </Card>
  );
}

function PartnerModule({
  role,
  submitUpgradeRequest,
  upgradeStatus,
}: {
  role: 'trader' | 'partner';
  submitUpgradeRequest: (reason: string) => void;
  upgradeStatus: 'none' | 'pending' | 'approved' | 'rejected';
}) {
  const { t } = useProductSettings();
  const overlayQueue = useOverlayQueue();
  const isPartner = role === 'partner' || upgradeStatus === 'approved';
  const actionLabel = isPartner
    ? t('partner.toolsTitle')
    : upgradeStatus === 'pending'
      ? t('upgrade.status.pending')
      : t('upgrade.applyTitle');

  return (
    <>
      <Card>
        <View style={styles.metricRow}>
          <Metric label={t('partner.monthClients')} value={String(partnerMetrics.clients)} />
          <Metric label={t('partner.activeClients')} tone="up" value={String(partnerMetrics.activeClients)} />
          <Metric label={t('partner.conversion')} tone="brand" value={formatPercent(partnerMetrics.conversionRate)} />
        </View>
        <ActionButton
          label={actionLabel}
          onPress={() => {
            if (isPartner) {
              router.push('/partner-tools' as never);
              return;
            }

            if (upgradeStatus === 'pending') {
              void notifyWarning();
              overlayQueue.enqueueAlert({
                body: t('upgrade.pendingHint'),
                dedupeKey: 'partner-upgrade-pending',
                icon: 'icon.risk.info',
                priority: 'critical',
                riskLevel: 'high',
                title: t('upgrade.status.pending'),
                tone: 'warning',
              });
              return;
            }

            submitUpgradeRequest(t('upgrade.defaultReason'));
            void notifySuccess();
            overlayQueue.enqueueAlert({
              body: t('upgrade.pendingHint'),
              dedupeKey: 'partner-upgrade-submitted',
              icon: 'icon.ib.network',
              priority: 'critical',
              riskLevel: 'high',
              title: t('upgrade.submitted'),
              tone: 'success',
            });
          }}
          style={styles.cardAction}
          tone={isPartner ? 'brand' : upgradeStatus === 'pending' ? 'amber' : 'neutral'}
          variant={isPartner ? 'filled' : 'outline'}
        />
      </Card>
    </>
  );
}

function MarketsModule({ instruments }: { instruments: Instrument[] }) {
  const { locale, colors } = useProductSettings();
  const movers = [...instruments].sort((a, b) => Math.abs(getDisplayChange(b).changePercent) - Math.abs(getDisplayChange(a).changePercent)).slice(0, 4);

  return (
    <Card compact>
      {movers.map((instrument, index) => {
        const { changePercent } = getDisplayChange(instrument);
        const quoteVisual = getQuoteChangeVisual(changePercent, colors);

        return (
          <NativePressable
            accessibilityLabel={instrument.symbol}
            key={instrument.id}
            minTouch={size.icon.display}
            onPress={() => router.push(`/instrument/${instrument.id}` as never)}
            style={StyleSheet.flatten([styles.instrumentRow, index < movers.length - 1 && { borderBottomColor: colors.border.subtle, borderBottomWidth: lineWidth.hairline }])}>
            <InstrumentIcon instrument={instrument} size={size.control.sm - spacing.xs} />
            <View style={styles.flex}>
              <AppText variant="subtitle">{instrument.symbol}</AppText>
              <AppText numberOfLines={1} tone="muted" variant="caption">
                {localizeText(instrument.name, locale)}
              </AppText>
            </View>
            <View style={styles.instrumentSide}>
              <AppText tone={quoteVisual.tone} variant="number">
                {formatPrice(instrument, instrument.ask)}
              </AppText>
              <AppText tone={quoteVisual.tone} variant="caption">
                {formatPercent(changePercent)}
              </AppText>
            </View>
          </NativePressable>
        );
      })}
    </Card>
  );
}

function AccountsModule({ account, positionsCount }: { account: Account; positionsCount: number }) {
  const { locale, t } = useProductSettings();

  return (
    <>
      <Card>
        <View style={styles.metricRow}>
          <Metric label={t('account.balance')} value={formatMoney(account.balance, account.currency, 0, locale)} />
          <Metric label={t('account.usedMargin')} tone="amber" value={formatCompactMoney(account.usedMargin, account.currency, locale)} />
          <Metric label={t('home.positions')} tone="brand" value={String(positionsCount)} />
        </View>
      </Card>
      <Card compact>
        <View style={styles.detailRows}>
          <DetailRow label={t('account.currentTrading')} value={account.accountId} />
          <DetailRow label={t('account.marginRate')} value={account.marginLevel > 0 ? `${account.marginLevel.toFixed(2)}%` : t('home.noMargin')} />
          <DetailRow label={t('account.credit')} value={formatMoney(account.credit, account.currency, 0, locale)} />
        </View>
        <ActionButton label={t('discover.accounts.openList')} onPress={() => router.push('/accounts' as never)} style={styles.cardAction} tone="neutral" variant="outline" />
      </Card>
    </>
  );
}

function SupportModule() {
  const { t } = useProductSettings();
  const toast = useToast();
  const rows = [
    [t('top.support'), t('discover.support.helpDesk')],
    [t('top.notifications'), t('discover.support.alerts')],
    [t('discover.support.serviceStatus'), t('discover.support.serviceStatusBody')],
  ];

  return (
    <Card compact>
      <View style={styles.detailRows}>
        {rows.map(([label, value]) => (
          <DetailRow key={label} label={label} value={value} />
        ))}
      </View>
      <ActionButton
        label={t('top.support')}
        onPress={() => {
          void impactLight();
          toast.show({ message: t('top.placeholderMessage'), title: t('top.placeholderTitle', { action: t('top.support') }) });
        }}
        style={styles.cardAction}
        tone="neutral"
        variant="outline"
      />
    </Card>
  );
}

function RewardsModule() {
  const { colors, t } = useProductSettings();
  const missions = [
    [t('discover.rewards.mission.watchlist'), '75%'],
    [t('discover.rewards.mission.firstOrder'), '40%'],
    [t('discover.rewards.mission.riskQuiz'), '100%'],
  ] as const satisfies readonly (readonly [string, DimensionValue])[];

  return (
    <Card>
      <View style={styles.rewardHeader}>
        <Metric label={t('discover.rewards.practiceCredits')} tone="amber" value="$2K" />
        <Metric label={t('discover.rewards.badges')} tone="brand" value="6" />
      </View>
      <View style={styles.rewardList}>
        {missions.map(([label, value]) => (
          <View key={label} style={styles.rewardRow}>
            <AppText variant="body">{label}</AppText>
            <View style={StyleSheet.flatten([styles.rewardProgressTrack, { backgroundColor: colors.border.subtle }])}>
              <View style={StyleSheet.flatten([styles.rewardProgressFill, { backgroundColor: colors.brand.fg, width: value }])} />
            </View>
            <AppText tone="dim" variant="caption">
              {value}
            </AppText>
          </View>
        ))}
      </View>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const { colors } = useProductSettings();

  return (
    <View style={StyleSheet.flatten([styles.detailRow, { borderBottomColor: colors.border.subtle }])}>
      <AppText tone="muted" variant="caption">
        {label}
      </AppText>
      <AppText numberOfLines={1} variant="body">
        {value}
      </AppText>
    </View>
  );
}

function getPrimaryInstrument(moduleId: DiscoverModuleId, instruments: Instrument[]) {
  const preferredId = moduleId === 'challenge' ? 'xau-usd' : 'eur-usd';
  return instruments.find((instrument) => instrument.id === preferredId) ?? instruments[0];
}

function getModuleIds(): DiscoverModuleId[] {
  return ['challenge', 'education', 'community', 'profile', 'onboarding', 'partner', 'markets', 'accounts', 'support', 'rewards'];
}

function getModuleMeta(moduleId: DiscoverModuleId) {
  const meta: Record<DiscoverModuleId, { icon: AppIconName; tone: IconTone }> = {
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

function resolveDiscoverIconSurfaceTone(tone: IconTone): IconSurfaceTone {
  if (tone === 'brand') return 'brand';
  if (tone === 'amber' || tone === 'warning') return 'warning';
  if (tone === 'danger' || tone === 'up') return 'danger';
  if (tone === 'blue' || tone === 'info') return 'info';
  if (tone === 'down' || tone === 'success') return 'success';
  return 'neutral';
}

const styles = StyleSheet.create({
  avatarEditBadge: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.selected,
    bottom: spacing.none,
    height: spacing.xl - spacing.xxs - lineWidth.strong,
    justifyContent: 'center',
    position: 'absolute',
    right: -lineWidth.strong,
    width: spacing.xl - spacing.xxs - lineWidth.strong,
  },
  avatarRail: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xxs,
    paddingRight: spacing.lg,
  },
  avatarRailItem: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.xs + spacing.xxs,
    minHeight: layout.touchTargetMin + spacing.xxs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + lineWidth.strong,
  },
  avatarPressable: {
    height: size.icon.display,
    justifyContent: 'center',
    position: 'relative',
    width: size.icon.display,
    zIndex: zIndex.raised,
  },
  cardAction: {
    marginTop: radius.lg,
  },
  changeBadge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  detailRow: {
    alignItems: 'center',
    borderBottomWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    minHeight: layout.touchTargetMin - spacing.xxs,
  },
  detailRows: {
    gap: spacing.xxs,
  },
  flex: {
    flex: 1,
    gap: spacing.xxs + lineWidth.strong,
    minWidth: 0,
  },
  gainBadge: {
    alignSelf: 'flex-start',
    borderRadius: radius.xs,
    marginTop: spacing.xs + spacing.xxs,
    paddingHorizontal: spacing.xs + spacing.xxs,
    paddingVertical: spacing.xxs,
  },
  hero: {
    gap: radius.lg,
  },
  heroAction: {
    alignSelf: 'flex-start',
    minHeight: size.control.sm - spacing.xxs,
    paddingHorizontal: radius.lg,
    paddingVertical: spacing.sm,
  },
  heroCopy: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  insightList: {
    gap: spacing.xxs,
  },
  insightRow: {
    alignItems: 'flex-start',
    borderTopWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  instrumentRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + spacing.xxs,
  },
  instrumentSide: {
    alignItems: 'flex-end',
    gap: spacing.xxs,
  },
  marketFocusTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  metricRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  managerChat: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  managerChatProfile: {
    alignItems: 'center',
    borderRadius: radius.card,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  managerChatSheet: {
    gap: spacing.lg,
    paddingTop: spacing.xs,
  },
  managerComposer: {
    alignItems: 'center',
    borderRadius: radius.full,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    minHeight: size.control.md,
    paddingHorizontal: spacing.lg,
  },
  managerMessageBubble: {
    borderRadius: radius.card,
    maxWidth: '84%',
    padding: spacing.md,
  },
  managerMessageList: {
    gap: spacing.sm,
  },
  managerMessageRow: {
    alignItems: 'flex-start',
  },
  managerMessageRowUser: {
    alignItems: 'flex-end',
  },
  modulePill: {
    alignItems: 'center',
    borderRadius: radius.card,
    borderWidth: lineWidth.hairline,
    gap: spacing.xs + spacing.xxs + lineWidth.strong,
    minWidth: size.control.lg + spacing.xl + spacing.xxs,
    padding: spacing.sm + spacing.xxs,
  },
  moduleRail: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  rewardHeader: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rewardList: {
    gap: spacing.md,
    marginTop: radius.lg,
  },
  rewardProgressFill: {
    borderRadius: radius.full,
    height: spacing.sm - lineWidth.strong,
  },
  rewardProgressTrack: {
    borderRadius: radius.full,
    flex: 1,
    height: spacing.sm - lineWidth.strong,
    overflow: 'hidden',
  },
  rewardRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm + spacing.xxs,
  },
  profileEditHero: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  profileEditSheet: {
    gap: spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xxs,
    paddingTop: spacing.xxs,
  },
  profileIdentity: {
    flex: 1,
    gap: spacing.xs + lineWidth.strong,
    minWidth: 0,
  },
  profileMenuList: {
    borderRadius: radius.card,
    overflow: 'hidden',
    paddingHorizontal: spacing.none,
  },
  profileNameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm + spacing.xxs,
    justifyContent: 'space-between',
  },
  profileStatCard: {
    flex: 1,
    gap: spacing.xs + spacing.xxs + lineWidth.strong,
    minHeight: size.icon.display + size.iconSurface.lg + radius.lg,
    minWidth: 0,
  },
  profileStatsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  profileTag: {
    flex: 1,
    minWidth: 0,
  },
  profileTagRow: {
    flexDirection: 'row',
    gap: spacing.xs + spacing.xxs,
    width: '100%',
  },
  sparklineWrap: {
    alignItems: 'center',
    marginVertical: radius.lg,
    overflow: 'hidden',
  },
  timeline: {
    gap: spacing.md,
  },
  timelineMark: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    height: size.iconSurface.xs,
    justifyContent: 'center',
    width: size.iconSurface.xs,
  },
  timelineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm + spacing.xxs,
  },
  verifiedBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.xs,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.xxs + lineWidth.strong,
    paddingHorizontal: spacing.xs + lineWidth.strong,
    paddingVertical: spacing.xxs,
  },
});
