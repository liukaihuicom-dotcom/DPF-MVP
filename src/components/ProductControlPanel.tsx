import { router, type Href } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, PanResponder, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import {
  buildTradingAccountProfiles,
  tradingAccountCountPresets,
  tradingAccountDataPresets,
  tradingAccountStatusPresets,
  type TradingAccountCountPreset,
  type TradingAccountDataPreset,
  type TradingAccountScenario,
  type TradingAccountStatusPreset,
} from '@/src/domain/accountProfiles';
import { formatNumber } from '@/src/domain/format';
import type {
  AuthChannel,
  AuthStatus,
  DiscoverModuleId,
  KycStatus,
  PinStatus,
  Role,
  TradeWorkspaceDataPreset,
  TradingAccountUsageOverride,
  TradingAccountUsageStatus,
  UpgradeStatus,
} from '@/src/domain/types';
import { fundingOperationEntries } from '@/src/domain/funding';
import { applyMockFundingPreset, resetMockFundingTransactions, type FundingDevPreset } from '@/src/services/fundingApi';
import { useToast } from '@/src/feedback/Toast';
import { impactLight, notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { localeOptions, type Locale, type TranslationKey } from '@/src/i18n/translations';
import { tradeWorkspaceDataPresets, useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';
import { shadows, themeColors, type ThemeMode } from '@/src/theme/colors';
import { layout, lineWidth, radius, spacing, size, typography, zIndex } from '@/src/theme/tokens';

import { AppIcon, type AppIconName, type IconTone } from './AppIcon';
import { HeaderIconButton } from './HeaderIconButton';
import { IconSurface } from './IconSurface';
import { NativePressable } from './NativePressable';
import { SelectField } from './TextField';
import { AppText } from './Typography';

type ConsoleScreen = 'home' | 'pages' | 'state';
type PageConsoleGroup = 'markets' | 'trading' | 'accounts' | 'funding' | 'growth' | 'auth';
type ScenarioTone = 'amber' | 'blue' | 'brand' | 'danger' | 'down' | 'up';
type DevScenarioId = 'guest' | 'login' | 'markets' | 'trade' | 'order' | 'accounts' | 'funding' | 'partner' | 'discover';

type PageConsoleEntry = {
  group: PageConsoleGroup;
  icon: AppIconName;
  moduleKey: TranslationKey;
  route: Href;
  routeLabel: string;
  titleKey: TranslationKey;
  tone: ScenarioTone;
};

type QuickScenario = {
  id: DevScenarioId;
  icon: AppIconName;
  metaKey: TranslationKey;
  route: Href;
  titleKey: TranslationKey;
  tone: ScenarioTone;
};

type DevConsoleFabOffset = {
  bottom: number;
  right: number;
};

const themeModes = ['system', ...Object.keys(themeColors)] as ThemeMode[];
const authStatuses: AuthStatus[] = ['guest', 'signedIn'];
const authChannels: AuthChannel[] = ['email', 'phone'];
const kycStatuses: KycStatus[] = ['notStarted', 'reviewing', 'approved', 'rejected'];
const pinStatuses: PinStatus[] = ['unset', 'skipped', 'set'];
const roles: Role[] = ['trader', 'partner'];
const tradingAccountScenarios: TradingAccountScenario[] = ['default', 'stateAnalysis'];
const tradingAccountUsageOverrides: TradingAccountUsageOverride[] = ['auto', 'normal', 'warning', 'abnormal'];
const discoverModuleIds: DiscoverModuleId[] = ['challenge', 'education', 'community', 'profile', 'onboarding', 'partner', 'markets', 'accounts', 'support', 'rewards'];
const upgradeStatuses: UpgradeStatus[] = ['none', 'pending', 'approved', 'rejected'];
const fundingPresets: FundingDevPreset[] = ['default', 'awaitingPayment', 'reviewing', 'cancelled'];
const pageGroups: PageConsoleGroup[] = ['markets', 'trading', 'accounts', 'funding', 'growth', 'auth'];
const maxVisibleScenarios = 6;
const devConsoleFabDragThreshold = spacing.xs;
const devConsoleFabEdgeInset = spacing.sm;
const devConsoleFabInitialOffset: DevConsoleFabOffset = { bottom: 82, right: spacing.lg };
const devConsoleFabSize = size.control.md;

const scenarioToneKeys: Record<ScenarioTone, IconTone> = {
  amber: 'amber',
  blue: 'blue',
  brand: 'brand',
  danger: 'danger',
  down: 'down',
  up: 'up',
};
const tradingAccountCountPresetLabels: Record<TradingAccountCountPreset, TranslationKey> = {
  scenario: 'control.tradingAccount.countPreset.scenario',
  seven: 'control.tradingAccount.countPreset.seven',
  single: 'control.tradingAccount.countPreset.single',
  three: 'control.tradingAccount.countPreset.three',
  twelve: 'control.tradingAccount.countPreset.twelve',
};
const tradingAccountDataPresetLabels: Record<TradingAccountDataPreset, TranslationKey> = {
  balanced: 'control.tradingAccount.dataPreset.balanced',
  drawdown: 'control.tradingAccount.dataPreset.drawdown',
  marginStress: 'control.tradingAccount.dataPreset.marginStress',
  noActivity: 'control.tradingAccount.dataPreset.noActivity',
  scenario: 'control.tradingAccount.dataPreset.scenario',
};
const tradingAccountStatusPresetLabels: Record<TradingAccountStatusPreset, TranslationKey> = {
  active: 'control.tradingAccount.statusPreset.active',
  archived: 'control.tradingAccount.statusPreset.archived',
  demo: 'control.tradingAccount.statusPreset.demo',
  disabled: 'control.tradingAccount.statusPreset.disabled',
  mixed: 'control.tradingAccount.statusPreset.mixed',
  readOnly: 'control.tradingAccount.statusPreset.readOnly',
  scenario: 'control.tradingAccount.statusPreset.scenario',
};
const tradeWorkspaceDataPresetLabels: Record<TradeWorkspaceDataPreset, TranslationKey> = {
  empty: 'control.tradeWorkspace.dataPreset.empty',
  sample: 'control.tradeWorkspace.dataPreset.sample',
};
const primaryScenarioIds: DevScenarioId[] = ['login', 'markets', 'trade', 'order', 'accounts', 'funding', 'partner', 'discover'];

export function ProductControlPanel() {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [fabOffset, setFabOffset] = useState<DevConsoleFabOffset>(devConsoleFabInitialOffset);
  const [open, setOpen] = useState(false);
  const [resetArmed, setResetArmed] = useState(false);
  const [screen, setScreen] = useState<ConsoleScreen>('home');
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const fabDragMovedRef = useRef(false);
  const fabDragStartRef = useRef<DevConsoleFabOffset>(devConsoleFabInitialOffset);
  const fabMaxBottomRef = useRef(devConsoleFabInitialOffset.bottom);
  const fabMaxRightRef = useRef(devConsoleFabInitialOffset.right);
  const fabOffsetRef = useRef<DevConsoleFabOffset>(devConsoleFabInitialOffset);
  const fabResponderHandledPressRef = useRef(false);
  const openRef = useRef(open);
  openRef.current = open;
  const settings = useProductSettings();
  const {
    authStatus,
    kycStatus,
    lastLoginAccount,
    lastLoginChannel,
    locale,
    colors,
    pendingOrderDataPreset,
    pinGateStatus,
    pinStatus,
    positionDataPreset,
    resetProductSettings,
    role,
    selectedDiscoverModuleId,
    setAuthStatus,
    setKycStatus,
    setLastLoginAccount,
    setLastLoginAvatarId,
    setLastLoginChannel,
    setLocalPinCode,
    setLocale,
    setPendingOrderDataPreset,
    setPinGateStatus,
    setPinStatus,
    setPositionDataPreset,
    setRole,
    setSelectedDiscoverModule,
    setSelectedTradingAccountId,
    setThemeMode,
    setTradingAccountCountPreset,
    setTradingAccountDataPreset,
    setTradingAccountScenario,
    setTradingAccountStatusPreset,
    setTradingAccountUsageOverride,
    t,
    themeMode,
    tradingAccountCountPreset,
    tradingAccountDataPreset,
    tradingAccountScenario,
    tradingAccountStatusPreset,
    tradingAccountUsageOverride,
  } = settings;
  const broker = useBroker();
  const {
    account,
    approveUpgradeRequest,
    instruments,
    orders,
    positions,
    quoteStatus,
    rejectUpgradeRequest,
    resetBrokerDemoState,
    submitUpgradeRequest,
    upgradeRequest,
  } = broker;
  const toast = useToast();
  const anchor = instruments.find((instrument) => instrument.symbol === 'EUR/USD') ?? instruments[0];
  const pageEntries = useMemo(() => buildPageEntries(anchor?.id ?? 'eur-usd'), [anchor?.id]);
  const quickScenarios = useMemo(() => buildQuickScenarios(anchor?.id ?? 'eur-usd'), [anchor?.id]);
  const maxFabBottom = Math.max(devConsoleFabEdgeInset, windowHeight - devConsoleFabSize - devConsoleFabEdgeInset);
  const maxFabRight = Math.max(devConsoleFabEdgeInset, windowWidth - devConsoleFabSize - devConsoleFabEdgeInset);
  fabMaxBottomRef.current = maxFabBottom;
  fabMaxRightRef.current = maxFabRight;
  const tradingAccounts = buildTradingAccountProfiles(account, positions, tradingAccountScenario, {
    countPreset: tradingAccountCountPreset,
    dataPreset: tradingAccountDataPreset,
    statusPreset: tradingAccountStatusPreset,
  });
  const visibleScenarios = quickScenarios.filter((scenario) => primaryScenarioIds.includes(scenario.id)).slice(0, maxVisibleScenarios);

  const updateFabOffset = useCallback((nextOffset: DevConsoleFabOffset) => {
    const clampedOffset = clampDevConsoleFabOffset(nextOffset, fabMaxRightRef.current, fabMaxBottomRef.current);
    fabOffsetRef.current = clampedOffset;
    setFabOffset(clampedOffset);
  }, []);

  const closePanel = useCallback(() => {
    setOpen(false);
    setScreen('home');
    setResetArmed(false);
  }, []);

  const togglePanelFromFab = useCallback(() => {
    if (fabResponderHandledPressRef.current) {
      fabResponderHandledPressRef.current = false;
      return;
    }
    if (fabDragMovedRef.current) {
      fabDragMovedRef.current = false;
      return;
    }
    if (openRef.current) {
      closePanel();
      return;
    }
    setOpen(true);
  }, [closePanel]);

  const fabPanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: (_, gestureState) =>
          Math.abs(gestureState.dx) > devConsoleFabDragThreshold || Math.abs(gestureState.dy) > devConsoleFabDragThreshold,
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > devConsoleFabDragThreshold || Math.abs(gestureState.dy) > devConsoleFabDragThreshold,
        onPanResponderGrant: () => {
          fabDragMovedRef.current = false;
          fabDragStartRef.current = fabOffsetRef.current;
        },
        onPanResponderMove: (_, gestureState) => {
          if (Math.abs(gestureState.dx) > devConsoleFabDragThreshold || Math.abs(gestureState.dy) > devConsoleFabDragThreshold) {
            fabDragMovedRef.current = true;
          }
          updateFabOffset({
            bottom: fabDragStartRef.current.bottom - gestureState.dy,
            right: fabDragStartRef.current.right - gestureState.dx,
          });
        },
        onPanResponderRelease: () => {
          if (!fabDragMovedRef.current) {
            togglePanelFromFab();
          }
          fabResponderHandledPressRef.current = true;
          setTimeout(() => {
            fabResponderHandledPressRef.current = false;
          }, 0);
        },
        onPanResponderTerminate: () => {
          setTimeout(() => {
            fabDragMovedRef.current = false;
            fabResponderHandledPressRef.current = false;
          }, 0);
        },
        onPanResponderTerminationRequest: () => true,
      }),
    [togglePanelFromFab, updateFabOffset],
  );

  useEffect(() => {
    updateFabOffset(fabOffsetRef.current);
  }, [maxFabBottom, maxFabRight, updateFabOffset]);

  const applySignedIn = () => {
    setAuthStatus('signedIn');
    setLastLoginAccount('client@dupoin.demo');
    setLastLoginAvatarId('frank');
    setLastLoginChannel('email');
    setLocalPinCode('123456');
    setPinGateStatus('unlocked');
    setPinStatus('set');
  };

  const applyGuest = () => {
    setAuthStatus('guest');
    setLastLoginAccount('');
    setLastLoginAvatarId('frank');
    setLastLoginChannel('email');
    setLocalPinCode('');
    setPinGateStatus('unlocked');
    setPinStatus('unset');
  };

  const applyUpgradeStatus = (status: UpgradeStatus) => {
    if (status === 'pending') {
      submitUpgradeRequest(t('upgrade.defaultReason'));
      return;
    }

    if (status === 'approved') {
      if (upgradeRequest.status === 'none' || upgradeRequest.status === 'rejected') {
        submitUpgradeRequest(t('upgrade.defaultReason'));
      }
      approveUpgradeRequest(upgradeRequest.applicantClientId);
      return;
    }

    if (status === 'rejected') {
      if (upgradeRequest.status === 'none') {
        submitUpgradeRequest(t('upgrade.defaultReason'));
      }
      rejectUpgradeRequest(upgradeRequest.applicantClientId);
    }
  };

  const applyScenario = (scenario: QuickScenario) => {
    void impactLight();

    if (scenario.id === 'guest') {
      applyGuest();
    }

    if (scenario.id === 'login') {
      setAuthStatus('guest');
      setLastLoginAccount('client@dupoin.demo');
      setLastLoginChannel('email');
      setLastLoginAvatarId('frank');
      setLocalPinCode('');
      setPinGateStatus('unlocked');
      setPinStatus('unset');
    }

    if (scenario.id === 'markets') {
      applySignedIn();
      setRole('trader');
      setTradingAccountUsageOverride('auto');
    }

    if (scenario.id === 'trade') {
      applySignedIn();
      setRole('trader');
      setPositionDataPreset('sample');
      setPendingOrderDataPreset('sample');
      setTradingAccountUsageOverride('normal');
    }

    if (scenario.id === 'order') {
      applySignedIn();
      setRole('trader');
      setTradingAccountUsageOverride('normal');
    }

    if (scenario.id === 'accounts') {
      applySignedIn();
      setRole('trader');
      setTradingAccountScenario('stateAnalysis');
      setTradingAccountCountPreset('seven');
      setTradingAccountDataPreset('marginStress');
      setTradingAccountStatusPreset('mixed');
      setSelectedTradingAccountId('account-900054');
    }

    if (scenario.id === 'funding') {
      applySignedIn();
      setRole('trader');
      setTradingAccountScenario('stateAnalysis');
      setTradingAccountCountPreset('three');
      setTradingAccountStatusPreset('mixed');
      applyMockFundingPreset('reviewing');
    }

    if (scenario.id === 'partner') {
      applySignedIn();
      setRole('partner');
      applyUpgradeStatus('approved');
    }

    if (scenario.id === 'discover') {
      applySignedIn();
      setRole('trader');
      setSelectedDiscoverModule('education');
    }

    toast.show({
      message: t('control.devConsole.toastScenarioBody'),
      title: t('control.devConsole.toastScenarioTitle'),
      tone: 'success',
    });
    closePanel();
    router.replace(scenario.route);
  };

  const handleFundingPreset = (preset: FundingDevPreset) => {
    applyMockFundingPreset(preset);
    void notifySuccess();
    toast.show({
      message: t('control.devConsole.toastDataBody'),
      title: t(`control.devConsole.fundingPreset.${preset}`),
      tone: 'success',
    });
  };

  const handleReset = () => {
    if (!resetArmed) {
      setResetArmed(true);
      void notifyWarning();
      toast.show({ message: t('control.devConsole.resetHint'), title: t('control.devConsole.resetConfirm'), tone: 'warning' });
      return;
    }

    resetProductSettings();
    resetBrokerDemoState();
    resetMockFundingTransactions();
    setAdvancedOpen(false);
    setResetArmed(false);
    void notifySuccess();
    toast.show({ message: t('control.devConsole.resetDoneBody'), title: t('control.devConsole.resetDone'), tone: 'success' });
    closePanel();
    router.replace('/launch');
  };

  const showControlToast = (title: string) => {
    void notifySuccess();
    toast.show({
      message: t('control.devConsole.toastDataBody'),
      title,
      tone: 'success',
    });
  };
  const handleAuthStatusChange = (value: string) => {
    const next = value as AuthStatus;

    if (next === authStatus) {
      return;
    }

    if (next === 'signedIn') {
      applySignedIn();
    } else {
      applyGuest();
    }

    showControlToast(t(`auth.status.${next}`));
  };
  const handleRoleChange = (value: string) => {
    const next = value as Role;

    if (next === role) {
      return;
    }

    setRole(next);
    showControlToast(next === 'partner' ? t('role.partner') : t('role.trader'));
  };
  const handleThemeChange = (value: string) => {
    const next = value as ThemeMode;

    if (next === themeMode) {
      return;
    }

    setThemeMode(next);
    showControlToast(t(`theme.${next}`));
  };
  const handleLocaleChange = (value: string) => {
    const next = value as Locale;

    if (next === locale) {
      return;
    }

    setLocale(next);
    showControlToast(localeOptions.find((item) => item.value === next)?.label ?? next);
  };
  const contextControls = (
    <View style={styles.contextGrid}>
      <TopSelectControl
        icon="icon.account.user"
        label={t('control.accountStatus')}
        onChange={handleAuthStatusChange}
        options={authStatuses.map((item) => ({ label: t(`auth.status.${item}`), value: item }))}
        value={authStatus}
      />
      <TopSelectControl
        icon="icon.ib.network"
        label={t('control.role')}
        onChange={handleRoleChange}
        options={roles.map((item) => ({ label: item === 'partner' ? t('role.partner') : t('role.trader'), value: item }))}
        value={role}
      />
      <TopSelectControl
        icon="icon.system.settings"
        label={t('control.theme')}
        onChange={handleThemeChange}
        options={themeModes.map((item) => ({ label: t(`theme.${item}`), value: item }))}
        value={themeMode}
      />
      <TopSelectControl
        icon="icon.market.global"
        label={t('control.language')}
        onChange={handleLocaleChange}
        options={localeOptions.map((item) => ({ label: item.label, value: item.value }))}
        value={locale}
      />
    </View>
  );
  const statePresetControls = (
    <View style={styles.detailStack}>
      <SectionTitle title={t('control.devConsole.editAuth')} />
      <View style={styles.formGrid}>
        <ControlSelect
          icon="icon.kyc.identity"
          label={t('control.kycStatus')}
          onChange={(value) => setKycStatus(value as KycStatus)}
          options={kycStatuses.map((item) => ({ label: t(`kyc.status.${item}` as TranslationKey), value: item }))}
          value={kycStatus}
        />
        <ControlSelect
          icon="icon.security.key_access"
          label={t('auth.pin.status')}
          onChange={(value) => {
            const next = value as PinStatus;
            setPinStatus(next);
            setLocalPinCode(next === 'set' ? '123456' : '');
            setPinGateStatus('unlocked');
          }}
          options={pinStatuses.map((item) => ({ label: t(`auth.pin.status.${item}`), value: item }))}
          value={pinStatus}
        />
        <ControlSelect
          icon="icon.notification.email"
          label={t('auth.method')}
          onChange={(value) => setLastLoginChannel(value as AuthChannel)}
          options={authChannels.map((item) => ({ label: t(`auth.method.${item}`), value: item }))}
          value={lastLoginChannel}
        />
      </View>

      <SectionTitle title={t('control.devConsole.editTrading')} />
      <View style={styles.formGrid}>
        <ControlSelect
          icon="icon.account.trading"
          label={t('control.tradingScenario')}
          onChange={(value) => setTradingAccountScenario(value as TradingAccountScenario)}
          options={tradingAccountScenarios.map((item) => ({ label: t(`control.tradingScenario.${item}`), value: item }))}
          value={tradingAccountScenario}
        />
        <ControlSelect
          icon="icon.account.trading"
          label={t('control.tradingAccount.statusPreset')}
          onChange={(value) => setTradingAccountStatusPreset(value as TradingAccountStatusPreset)}
          options={tradingAccountStatusPresets.map((item) => ({ label: t(tradingAccountStatusPresetLabels[item]), value: item }))}
          value={tradingAccountStatusPreset}
        />
        <ControlSelect
          icon="icon.trading.order"
          label={t('control.tradingAccount.countPreset')}
          onChange={(value) => setTradingAccountCountPreset(value as TradingAccountCountPreset)}
          options={tradingAccountCountPresets.map((item) => ({ label: t(tradingAccountCountPresetLabels[item]), value: item }))}
          value={tradingAccountCountPreset}
        />
        <ControlSelect
          icon="icon.trading.volume"
          label={t('control.tradingAccount.dataPreset')}
          onChange={(value) => setTradingAccountDataPreset(value as TradingAccountDataPreset)}
          options={tradingAccountDataPresets.map((item) => ({ label: t(tradingAccountDataPresetLabels[item]), value: item }))}
          value={tradingAccountDataPreset}
        />
        <ControlSelect
          icon="icon.security.risk_shield"
          label={t('control.tradingUsage.selectLabel')}
          onChange={(value) => setTradingAccountUsageOverride(value as TradingAccountUsageOverride)}
          options={tradingAccountUsageOverrides.map((item) => ({ label: t(`control.tradingUsage.override.${item}`), value: item }))}
          value={tradingAccountUsageOverride}
        />
        <ControlSelect
          icon="icon.trading.volume"
          label={t('control.tradeWorkspace.positionsPreset')}
          onChange={(value) => setPositionDataPreset(value as TradeWorkspaceDataPreset)}
          options={tradeWorkspaceDataPresets.map((item) => ({ label: t(tradeWorkspaceDataPresetLabels[item]), value: item }))}
          value={positionDataPreset}
        />
        <ControlSelect
          icon="icon.trading.order"
          label={t('control.tradeWorkspace.pendingPreset')}
          onChange={(value) => setPendingOrderDataPreset(value as TradeWorkspaceDataPreset)}
          options={tradeWorkspaceDataPresets.map((item) => ({ label: t(tradeWorkspaceDataPresetLabels[item]), value: item }))}
          value={pendingOrderDataPreset}
        />
        <ControlSelect
          icon="icon.navigation.discover"
          label={t('control.pageConsole.discoverModule')}
          onChange={(value) => setSelectedDiscoverModule(value as DiscoverModuleId)}
          options={discoverModuleIds.map((item) => ({ label: t(`discover.module.${item}.short`), value: item }))}
          value={selectedDiscoverModuleId}
        />
      </View>

      <SectionTitle title={t('control.devConsole.editFundingPartner')} />
      <View style={styles.formGrid}>
        <ControlSelect
          icon="icon.wallet.balance"
          label={t('control.devConsole.fundingPreset')}
          onChange={(value) => handleFundingPreset(value as FundingDevPreset)}
          options={fundingPresets.map((item) => ({ label: t(`control.devConsole.fundingPreset.${item}`), value: item }))}
          value="default"
        />
        <ControlSelect
          icon="icon.ib.network"
          label={t('control.pageConsole.partnerState')}
          onChange={(value) => {
            applyUpgradeStatus(value as UpgradeStatus);
            toast.show({ title: t('control.devConsole.toastDataTitle'), tone: 'success' });
          }}
          options={upgradeStatuses.map((item) => ({ label: t(`upgrade.status.${item}`), value: item }))}
          value={upgradeRequest.status}
        />
      </View>
    </View>
  );

  const panelFrameStyle = {
    maxHeight: Math.max(320, windowHeight - 120),
    maxWidth: Math.max(280, windowWidth - spacing.lg * 2),
  };
  const visibleFabOffset = clampDevConsoleFabOffset(fabOffset, maxFabRight, maxFabBottom);

  const panelFooter =
    screen === 'home' ? (
      <View style={StyleSheet.flatten([styles.panelFooter, { borderTopColor: colors.border.subtle }])}>
        <NativePressable
          accessibilityRole="button"
          minTouch={40}
          onPress={() => setScreen('pages')}
          style={StyleSheet.flatten([styles.secondaryButton, { borderColor: colors.border.subtle }])}>
          <AppIcon name="icon.navigation.function_center" sizeVariant="sm" />
          <AppText numberOfLines={1} variant="caption">
            {t('control.pageConsole.menu.pages')}
          </AppText>
        </NativePressable>
        <NativePressable
          accessibilityRole="button"
          minTouch={40}
          onPress={handleReset}
          style={StyleSheet.flatten([styles.resetButton, { borderColor: resetArmed ? colors.status.danger.fg : colors.border.subtle }])}>
          <AppIcon name="icon.system.settings" sizeVariant="sm" tone={resetArmed ? 'danger' : undefined} />
          <AppText numberOfLines={1} tone={resetArmed ? 'danger' : 'default'} variant="caption">
            {resetArmed ? t('control.devConsole.resetConfirm') : t('control.devConsole.reset')}
          </AppText>
        </NativePressable>
      </View>
    ) : null;

  return (
    <View style={StyleSheet.flatten([styles.host, { bottom: visibleFabOffset.bottom, right: visibleFabOffset.right }])}>
      {open ? (
        <View style={StyleSheet.flatten([styles.panel, panelFrameStyle, shadows.dialog, { backgroundColor: colors.surface.canvas, borderColor: colors.border.default }])}>
          <View style={StyleSheet.flatten([styles.panelTop, { borderBottomColor: colors.border.subtle }])}>
            {screen !== 'home' ? (
              <HeaderIconButton accessibilityLabel={t('top.back')} icon="icon.system.back" onPress={() => setScreen('home')} variant="ghost" />
            ) : (
              <View accessibilityLabel="Dupoin" accessibilityRole="image" style={StyleSheet.flatten([styles.headerLogo, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
                <Image resizeMode="contain" source={require('@/assets/images/dupoin-logo.png')} style={styles.headerLogoImage} />
              </View>
            )}
            <View style={styles.titleBlock}>
              <AppText tone="dim" variant="eyebrow">
                {t('control.pageConsole.eyebrow')}
              </AppText>
              <AppText numberOfLines={1} variant="subtitle">
                {screen === 'pages' ? t('control.pageConsole.menu.pages') : screen === 'state' ? t('control.pageConsole.menu.state') : t('control.devConsole.title')}
              </AppText>
            </View>
            <HeaderIconButton accessibilityLabel={t('common.cancel')} icon="icon.system.close" onPress={closePanel} variant="ghost" />
          </View>

          <ScrollView contentContainerStyle={styles.panelContent} showsVerticalScrollIndicator={false} style={styles.panelScroller}>
            {screen === 'home' ? (
              <>
                {contextControls}

                <SectionTitle title={t('control.pageConsole.menu.pages')} />
                <View style={StyleSheet.flatten([styles.formSurface, { backgroundColor: colors.surface.panel }])}>
                  <ModuleAction
                    body={t('control.pageConsole.menu.pagesBody')}
                    icon="icon.navigation.function_center"
                    label={t('control.pageConsole.menu.pages')}
                    meta={t('control.pageConsole.menu.pagesMeta')}
                    onPress={() => setScreen('pages')}
                    tone="brand"
                  />
                  <ModuleAction
                    body={t('control.pageConsole.menu.stateBody')}
                    icon="icon.security.risk_shield"
                    label={t('control.pageConsole.menu.state')}
                    meta={t('control.devConsole.advanced')}
                    onPress={() => setScreen('state')}
                    tone="amber"
                  />
                </View>

                <NativePressable
                  accessibilityRole="button"
                  minTouch={40}
                  onPress={() => setAdvancedOpen((value) => !value)}
                  style={StyleSheet.flatten([styles.foldButton, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
                  <View style={styles.foldTitle}>
                    <AppIcon name="icon.system.settings" sizeVariant="sm" tone="tertiary" />
                    <AppText variant="caption">{t('control.devConsole.advanced')}</AppText>
                  </View>
                  <AppIcon name={advancedOpen ? 'icon.system.chevron_down' : 'icon.system.chevron_right'} sizeVariant="sm" tone="tertiary" />
                </NativePressable>

                {advancedOpen ? (
                  statePresetControls
                ) : null}

                <SectionTitle title={t('control.devConsole.quickScenarios')} />
                <View style={StyleSheet.flatten([styles.formSurface, { backgroundColor: colors.surface.panel }])}>
                  <View style={styles.scenarioGrid}>
                    {visibleScenarios.map((scenario) => (
                      <ScenarioTile key={scenario.id} onPress={() => applyScenario(scenario)} scenario={scenario} />
                    ))}
                  </View>
                </View>

                <SectionTitle title={t('control.pageConsole.menu.runtime')} />
                <View style={StyleSheet.flatten([styles.statusLine, { backgroundColor: colors.surface.panel }])}>
                  <CompactMetric label={t('control.pageConsole.quoteState')} value={quoteStatus} />
                  <CompactMetric label={t('control.tradingUsage.positions')} value={formatNumber(positions.length, 0, locale)} />
                  <CompactMetric label={t('control.tradingUsage.orders')} value={formatNumber(orders.length, 0, locale)} />
                  <CompactMetric label={t('control.pageConsole.partnerState')} value={t(`upgrade.status.${upgradeRequest.status}`)} />
                </View>
              </>
            ) : screen === 'pages' ? (
              <View style={styles.list}>
                {pageGroups.map((group) => (
                  <View key={group} style={styles.groupBlock}>
                    <AppText tone="dim" variant="eyebrow">
                      {t(`control.pageConsole.group.${group}`)}
                    </AppText>
                    {pageEntries
                      .filter((entry) => entry.group === group)
                      .map((entry) => (
                        <PageRow entry={entry} key={entry.routeLabel} onClose={closePanel} />
                      ))}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.detailStack}>
                <View style={StyleSheet.flatten([styles.stateSummary, { backgroundColor: colors.surface.panel }])}>
                  <IconSurface background="hidden" icon="icon.security.risk_shield" sizeVariant="xs" tone="neutral" />
                  <View style={styles.rowText}>
                    <AppText numberOfLines={1} variant="caption">
                      {t('control.pageConsole.menu.state')}
                    </AppText>
                    <AppText numberOfLines={2} tone="muted" variant="caption">
                      {t('control.pageConsole.menu.stateBody')}
                    </AppText>
                  </View>
                </View>
                {contextControls}
                {statePresetControls}
              </View>
            )}
          </ScrollView>
          {panelFooter}
        </View>
      ) : null}

      <View {...fabPanResponder.panHandlers} style={styles.fabDragHandle}>
        <NativePressable
          accessibilityLabel={open ? t('common.cancel') : t('control.devConsole.title')}
          accessibilityRole="button"
          minTouch={layout.touchTargetMin}
          onPress={togglePanelFromFab}
          onPressIn={() => {
            if (fabDragMovedRef.current) {
              fabDragMovedRef.current = false;
            }
          }}
          style={StyleSheet.flatten([
            styles.fab,
            shadows.toast,
            {
              backgroundColor: open ? colors.surface.panel : colors.surface.raised,
            },
          ])}>
          <AppIcon name={open ? 'icon.system.close' : 'icon.system.settings'} sizeVariant="lg" tone={open ? 'tertiary' : 'brand'} />
        </NativePressable>
      </View>
    </View>
  );
}

function clampDevConsoleFabOffset(offset: DevConsoleFabOffset, maxRight: number, maxBottom: number): DevConsoleFabOffset {
  return {
    bottom: Math.min(Math.max(offset.bottom, devConsoleFabEdgeInset), maxBottom),
    right: Math.min(Math.max(offset.right, devConsoleFabEdgeInset), maxRight),
  };
}

function buildQuickScenarios(anchorId: string): QuickScenario[] {
  return [
    {
      id: 'guest',
      icon: 'icon.market.global',
      metaKey: 'control.devConsole.scenario.guest.meta',
      route: '/brand-splash',
      titleKey: 'control.devConsole.scenario.guest',
      tone: 'brand',
    },
    {
      id: 'login',
      icon: 'icon.security.lock',
      metaKey: 'control.devConsole.scenario.login.meta',
      route: '/auth',
      titleKey: 'control.devConsole.scenario.login',
      tone: 'danger',
    },
    {
      id: 'markets',
      icon: 'icon.trading.market',
      metaKey: 'control.devConsole.scenario.markets.meta',
      route: '/markets',
      titleKey: 'control.devConsole.scenario.markets',
      tone: 'brand',
    },
    {
      id: 'trade',
      icon: 'icon.trading.order_ticket',
      metaKey: 'control.devConsole.scenario.trade.meta',
      route: '/trade',
      titleKey: 'control.devConsole.scenario.trade',
      tone: 'up',
    },
    {
      id: 'order',
      icon: 'icon.trading.order_ticket',
      metaKey: 'control.devConsole.scenario.order.meta',
      route: `/order/${anchorId}?direction=buy` as Href,
      titleKey: 'control.devConsole.scenario.order',
      tone: 'up',
    },
    {
      id: 'accounts',
      icon: 'icon.account.trading',
      metaKey: 'control.devConsole.scenario.accounts.meta',
      route: '/accounts',
      titleKey: 'control.devConsole.scenario.accounts',
      tone: 'blue',
    },
    {
      id: 'funding',
      icon: 'icon.wallet.balance',
      metaKey: 'control.devConsole.scenario.funding.meta',
      route: '/funding/transactions',
      titleKey: 'control.devConsole.scenario.funding',
      tone: 'blue',
    },
    {
      id: 'partner',
      icon: 'icon.ib.network',
      metaKey: 'control.devConsole.scenario.partner.meta',
      route: '/partner-tools',
      titleKey: 'control.devConsole.scenario.partner',
      tone: 'amber',
    },
    {
      id: 'discover',
      icon: 'icon.navigation.discover',
      metaKey: 'control.devConsole.scenario.discover.meta',
      route: '/discover',
      titleKey: 'control.devConsole.scenario.discover',
      tone: 'brand',
    },
  ];
}

function buildPageEntries(anchorId: string): PageConsoleEntry[] {
  return [
    pageEntry('markets', 'icon.trading.market', 'control.pageConsole.module.markets', '/markets', '/markets', 'control.pageConsole.page.home.title', 'brand'),
    pageEntry('markets', 'icon.trading.market', 'control.pageConsole.module.markets', `/instrument/${anchorId}` as Href, '/instrument/[id]', 'control.pageConsole.page.instrument.title', 'blue'),
    pageEntry('trading', 'icon.trading.order_ticket', 'control.pageConsole.module.trading', '/trade', '/trade', 'control.pageConsole.page.trade.title', 'up'),
    pageEntry('trading', 'icon.trading.order_ticket', 'control.pageConsole.module.trading', `/order/${anchorId}?direction=buy` as Href, '/order/[id]', 'control.pageConsole.page.order.title', 'up'),
    pageEntry('accounts', 'icon.account.trading', 'control.pageConsole.module.accounts', '/accounts', '/accounts', 'control.pageConsole.page.accounts.title', 'blue'),
    pageEntry('accounts', 'icon.account.avatar', 'control.pageConsole.module.accounts', '/account-details/demo-main', '/account-details/[id]', 'control.pageConsole.page.accountDetails.title', 'blue'),
    pageEntry('accounts', 'icon.account.avatar', 'control.pageConsole.module.accounts', '/account-basic/demo-main', '/account-basic/[id]', 'accountDetails.menuBasicInfo', 'blue'),
    pageEntry('accounts', 'icon.wallet.balance', 'control.pageConsole.module.accounts', '/account-balance/demo-main', '/account-balance/[id]', 'balance.title', 'blue'),
    ...fundingOperationEntries.map((entry) =>
      pageEntry('funding', entry.icon, 'control.pageConsole.module.funding', entry.route, entry.routeLabel, `funding.operation.${entry.operation}` as TranslationKey, 'blue'),
    ),
    pageEntry('funding', 'icon.trading.history', 'control.pageConsole.module.funding', '/funding/transactions', '/funding/transactions', 'funding.transactions.title', 'blue'),
    pageEntry('growth', 'icon.navigation.discover', 'control.pageConsole.module.discover', '/discover', '/discover', 'control.pageConsole.page.discover.title', 'brand'),
    pageEntry('growth', 'icon.ib.network', 'control.pageConsole.module.partner', '/partner-tools', '/partner-tools', 'control.pageConsole.page.partnerTools.title', 'amber'),
    pageEntry('growth', 'icon.kyc.identity', 'control.pageConsole.module.partner', '/client/client-001', '/client/[id]', 'control.pageConsole.page.clientProfile.title', 'amber'),
    pageEntry('growth', 'icon.support.headset', 'control.pageConsole.module.discover', '/quick', '/quick', 'discover.module.support.title', 'brand'),
    pageEntry('auth', 'icon.market.global', 'control.pageConsole.module.auth', '/brand-splash', '/brand-splash', 'control.pageConsole.page.launch.title', 'brand'),
    pageEntry('auth', 'icon.market.global', 'control.pageConsole.module.auth', '/auth/onboarding', '/auth/onboarding', 'control.pageConsole.page.onboarding.title', 'blue'),
    pageEntry('auth', 'icon.security.lock', 'control.pageConsole.module.auth', '/auth', '/auth', 'control.pageConsole.page.login.title', 'danger'),
    pageEntry('auth', 'icon.account.add_user', 'control.pageConsole.module.auth', '/auth/register', '/auth/register', 'control.pageConsole.page.register.title', 'danger'),
    pageEntry('auth', 'icon.notification.email', 'control.pageConsole.module.auth', '/auth/forgot-password', '/auth/forgot-password', 'control.pageConsole.page.forgot.title', 'danger'),
  ];
}

function pageEntry(
  group: PageConsoleGroup,
  icon: AppIconName,
  moduleKey: TranslationKey,
  route: Href,
  routeLabel: string,
  titleKey: TranslationKey,
  tone: ScenarioTone,
): PageConsoleEntry {
  return { group, icon, moduleKey, route, routeLabel, titleKey, tone };
}

function TopSelectControl({
  icon,
  label,
  onChange,
  options,
  value,
}: {
  icon: AppIconName;
  label: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  value: string;
}) {
  const { colors } = useProductSettings();

  return (
    <SelectField
      containerStyle={styles.topSelectField}
      icon={icon}
      label={label}
      menuStyle={StyleSheet.flatten([styles.devSelectMenu, shadows.toast, { backgroundColor: colors.surface.panel, borderColor: colors.border.default }])}
      onChangeValue={onChange}
      optionTextStyle={styles.devSelectOptionText}
      options={options}
      shellStyle={StyleSheet.flatten([styles.devSelectShell, { backgroundColor: colors.surface.panel }])}
      value={value}
    />
  );
}

function ScenarioTile({ onPress, scenario }: { onPress: () => void; scenario: QuickScenario }) {
  const { colors, t } = useProductSettings();

  return (
    <NativePressable
      accessibilityRole="button"
      minTouch={40}
      onPress={onPress}
      style={styles.scenarioTile}>
      <IconSurface background="hidden" icon={scenario.icon} sizeVariant="xs" tone="neutral" />
      <View style={styles.rowText}>
        <AppText numberOfLines={1} variant="caption">
          {t(scenario.titleKey)}
        </AppText>
        <AppText numberOfLines={1} tone="dim" variant="eyebrow">
          {t(scenario.metaKey)}
        </AppText>
      </View>
    </NativePressable>
  );
}

function ModuleAction({
  body,
  icon,
  label,
  meta,
  onPress,
  tone,
}: {
  body: string;
  icon: AppIconName;
  label: string;
  meta: string;
  onPress: () => void;
  tone: IconTone;
}) {
  const { colors } = useProductSettings();
  const surfaceTone = tone === 'brand' ? 'brand' : 'neutral';

  return (
    <NativePressable
      accessibilityLabel={label}
      accessibilityRole="button"
      minTouch={44}
      onPress={onPress}
      style={StyleSheet.flatten([styles.moduleAction, { borderColor: colors.border.subtle }])}>
      <IconSurface background="hidden" icon={icon} sizeVariant="md" tone={surfaceTone} />
      <View style={styles.rowText}>
        <View style={styles.moduleActionHeader}>
          <AppText numberOfLines={1} variant="caption">
            {label}
          </AppText>
          <AppText numberOfLines={1} tone="dim" variant="eyebrow">
            {meta}
          </AppText>
        </View>
        <AppText numberOfLines={2} tone="muted" variant="caption">
          {body}
        </AppText>
      </View>
      <AppIcon name="icon.system.chevron_right" size={layout.menuDisclosureIconSize} tone="tertiary" />
    </NativePressable>
  );
}

function PageRow({ entry, onClose }: { entry: PageConsoleEntry; onClose: () => void }) {
  const { colors, t } = useProductSettings();

  return (
    <NativePressable
      accessibilityRole="button"
      minTouch={44}
      onPress={() => {
        void impactLight();
        onClose();
        router.push(entry.route);
      }}
      style={StyleSheet.flatten([styles.row, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
      <IconSurface background="hidden" icon={entry.icon} sizeVariant="xs" tone="neutral" />
      <View style={styles.rowText}>
        <AppText numberOfLines={1} variant="caption">
          {t(entry.titleKey)}
        </AppText>
        <AppText numberOfLines={1} tone="dim" variant="eyebrow">
          {entry.routeLabel}
        </AppText>
      </View>
      <AppText numberOfLines={1} tone="dim" variant="eyebrow">
        {t(entry.moduleKey)}
      </AppText>
    </NativePressable>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <AppText tone="dim" variant="eyebrow">
      {title}
    </AppText>
  );
}

function CompactMetric({ label, value }: { label: string; value: string }) {
  const { colors } = useProductSettings();

  return (
    <View style={StyleSheet.flatten([styles.compactMetric, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
      <AppText numberOfLines={1} tone="dim" variant="eyebrow">
        {label}
      </AppText>
      <AppText numberOfLines={1} variant="caption">
        {value}
      </AppText>
    </View>
  );
}

function getAutomaticTradingUsageStatus({
  authStatus,
  quoteStatus,
}: {
  authStatus: AuthStatus;
  quoteStatus: 'connecting' | 'connected' | 'failed';
}): TradingAccountUsageStatus {
  if (authStatus === 'guest' || quoteStatus === 'connecting') {
    return 'warning';
  }

  if (quoteStatus === 'failed') {
    return 'abnormal';
  }

  return 'normal';
}

function ControlSelect({
  icon,
  label,
  onChange,
  options,
  value,
}: {
  icon: AppIconName;
  label: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  value: string;
}) {
  const { colors } = useProductSettings();

  return (
    <SelectField
      containerStyle={styles.field}
      icon={icon}
      label={label}
      menuStyle={StyleSheet.flatten([styles.devSelectMenu, shadows.toast, { backgroundColor: colors.surface.panel, borderColor: colors.border.default }])}
      onChangeValue={onChange}
      optionTextStyle={styles.devSelectOptionText}
      options={options}
      shellStyle={StyleSheet.flatten([styles.devSelectShell, { backgroundColor: colors.surface.panel }])}
      value={value}
    />
  );
}

const styles = StyleSheet.create({
  compactMetric: {
    borderRadius: radius.sm,
    borderWidth: lineWidth.none,
    flexGrow: 1,
    gap: spacing.xxs,
    minWidth: '23%',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  contextGrid: {
    columnGap: spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.sm,
  },
  detailStack: {
    gap: spacing.sm,
  },
  devSelectMenu: {
    shadowOpacity: 0.18,
  },
  devSelectOptionText: {
    ...typography.bodyMd,
  },
  devSelectShell: {},
  fab: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.none,
    height: devConsoleFabSize,
    justifyContent: 'center',
    width: devConsoleFabSize,
  },
  fabDragHandle: {
    borderRadius: radius.full,
  },
  field: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 158,
  },
  foldButton: {
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: size.control.sm,
    paddingHorizontal: spacing.sm,
  },
  foldTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm - spacing.xxs,
    minWidth: 0,
  },
  formGrid: {
    columnGap: spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.sm,
  },
  formSurface: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    gap: spacing.xs,
    padding: spacing.xs,
  },
  groupBlock: {
    gap: spacing.sm - spacing.xxs,
  },
  headerLogo: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    height: size.button.icon,
    justifyContent: 'center',
    overflow: 'hidden',
    width: size.button.icon,
  },
  headerLogoImage: {
    height: '100%',
    width: '100%',
  },
  host: {
    alignItems: 'flex-end',
    gap: spacing.sm,
    pointerEvents: 'box-none',
    position: 'absolute',
    zIndex: zIndex.devOverlay,
  },
  list: {
    gap: spacing.sm - spacing.xxs,
  },
  moduleAction: {
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: lineWidth.none,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: size.control.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  moduleActionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  moduleBlock: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    gap: spacing.sm,
    padding: spacing.sm,
  },
  panel: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    overflow: 'hidden',
    width: size.viewport.devConsolePanelWidth,
  },
  panelContent: {
    gap: spacing.sm,
    padding: spacing.sm,
  },
  panelFooter: {
    borderTopWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  panelScroller: {
    flexGrow: 0,
    flexShrink: 1,
  },
  panelTop: {
    alignItems: 'center',
    borderBottomWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  resetButton: {
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: lineWidth.hairline,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm - spacing.xxs,
    justifyContent: 'center',
    minHeight: size.control.sm,
    paddingHorizontal: spacing.sm,
  },
  row: {
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  rowText: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  scenarioGrid: {
    columnGap: spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.sm,
  },
  scenarioPanel: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    padding: spacing.sm,
  },
  scenarioTile: {
    alignItems: 'center',
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    flexBasis: '48%',
    flexDirection: 'row',
    flexGrow: 1,
    gap: spacing.sm - spacing.xxs,
    minHeight: size.control.sm,
    minWidth: 0,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  secondaryButton: {
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: lineWidth.hairline,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm - spacing.xxs,
    justifyContent: 'center',
    minHeight: size.control.sm,
    paddingHorizontal: spacing.sm,
  },
  statusLine: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    padding: spacing.sm,
  },
  stateSummary: {
    alignItems: 'center',
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  titleBlock: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  topSelectField: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 0,
  },
});
