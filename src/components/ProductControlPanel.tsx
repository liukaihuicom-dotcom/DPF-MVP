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
import { IconSurface, type IconSurfaceTone } from './IconSurface';
import { NativePressable } from './NativePressable';
import { SelectField } from './TextField';
import { AppText } from './Typography';

type ConsoleScreen = 'home' | 'pages' | 'state';
type PageConsoleGroup = 'markets' | 'trading' | 'accounts' | 'funding' | 'growth' | 'auth';
type PageConsoleLevel = 'detail' | 'modal' | 'primary';
type ScenarioTone = 'amber' | 'blue' | 'brand' | 'danger' | 'down' | 'up';
type DevScenarioGroup = 'activeTrader' | 'edgeCases' | 'fundingAccount' | 'guestOnboarding' | 'newTrader' | 'partnerGrowth';
type DevScenarioRiskLevel = 'blocked' | 'gap' | 'normal' | 'review';
type DevUserScenarioId =
  | 'funding_deposit_entry'
  | 'funding_reviewing'
  | 'guest_forgot_password'
  | 'guest_onboarding_start'
  | 'guest_register_risk_ack'
  | 'new_trader_kyc_approved'
  | 'new_trader_kyc_not_started'
  | 'new_trader_kyc_reviewing'
  | 'partner_approved_workspace'
  | 'partner_client_profile'
  | 'partner_pending'
  | 'quote_failed_state'
  | 'returning_login_pin_required'
  | 'risk_warning_state'
  | 'trader_account_stress'
  | 'trader_markets_ready'
  | 'trader_order_ticket'
  | 'trader_trade_workspace';

type PageConsoleEntry = {
  fitKey: TranslationKey;
  group: PageConsoleGroup;
  icon: AppIconName;
  level: PageConsoleLevel;
  moduleKey: TranslationKey;
  route: Href;
  routeLabel: string;
  titleKey: TranslationKey;
  tone: ScenarioTone;
};

type DevUserScenario = {
  apply?: () => void;
  group: DevScenarioGroup;
  icon: AppIconName;
  id: DevUserScenarioId;
  intentKey: TranslationKey;
  personaKey: TranslationKey;
  riskLevel: DevScenarioRiskLevel;
  route: Href;
  stateSummaryKey: TranslationKey;
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
const pageLevelLabels: Record<Exclude<PageConsoleLevel, 'primary'>, TranslationKey> = {
  detail: 'control.pageConsole.level.detail',
  modal: 'control.pageConsole.level.modal',
};
const scenarioGroups: DevScenarioGroup[] = ['guestOnboarding', 'newTrader', 'activeTrader', 'fundingAccount', 'partnerGrowth', 'edgeCases'];
const defaultVisibleScenarioCount = 2;
const devConsoleFabDragThreshold = spacing.xs;
const devConsoleFabEdgeInset = spacing.sm;
const devConsoleFabInitialOffset: DevConsoleFabOffset = { bottom: 82, right: spacing.lg };
const devConsoleFabSize = size.control.md;

const scenarioSurfaceToneKeys: Record<ScenarioTone, IconSurfaceTone> = {
  amber: 'warning',
  blue: 'info',
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

export function ProductControlPanel() {
  const [expandedScenarioGroups, setExpandedScenarioGroups] = useState<Partial<Record<DevScenarioGroup, boolean>>>({});
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
  const maxFabBottom = Math.max(devConsoleFabEdgeInset, windowHeight - devConsoleFabSize - devConsoleFabEdgeInset);
  const maxFabRight = Math.max(devConsoleFabEdgeInset, windowWidth - devConsoleFabSize - devConsoleFabEdgeInset);
  fabMaxBottomRef.current = maxFabBottom;
  fabMaxRightRef.current = maxFabRight;
  const tradingAccounts = buildTradingAccountProfiles(account, positions, tradingAccountScenario, {
    countPreset: tradingAccountCountPreset,
    dataPreset: tradingAccountDataPreset,
    statusPreset: tradingAccountStatusPreset,
  });

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

  const applyReturningLogin = () => {
    setAuthStatus('guest');
    setLastLoginAccount('client@dupoin.demo');
    setLastLoginChannel('email');
    setLastLoginAvatarId('frank');
    setLocalPinCode('');
    setPinGateStatus('unlocked');
    setPinStatus('unset');
  };

  const applyTraderBase = () => {
    applySignedIn();
    setRole('trader');
    setTradingAccountUsageOverride('auto');
  };

  const applyTraderKyc = (status: KycStatus) => {
    applyTraderBase();
    setKycStatus(status);
    setTradingAccountScenario('default');
    setTradingAccountCountPreset('single');
    setTradingAccountDataPreset('balanced');
    setTradingAccountStatusPreset('demo');
    setSelectedTradingAccountId('demo-main');
  };

  const applyTradingReady = () => {
    applyTraderBase();
    setKycStatus('approved');
    setPositionDataPreset('sample');
    setPendingOrderDataPreset('sample');
    setTradingAccountScenario('default');
    setTradingAccountCountPreset('three');
    setTradingAccountDataPreset('balanced');
    setTradingAccountStatusPreset('active');
    setTradingAccountUsageOverride('normal');
  };

  const applyAccountStress = () => {
    applyTraderBase();
    setKycStatus('approved');
    setTradingAccountScenario('stateAnalysis');
    setTradingAccountCountPreset('seven');
    setTradingAccountDataPreset('marginStress');
    setTradingAccountStatusPreset('mixed');
    setTradingAccountUsageOverride('warning');
    setSelectedTradingAccountId('account-900054');
  };

  const applyFundingReview = () => {
    applyTraderBase();
    setKycStatus('approved');
    setTradingAccountScenario('stateAnalysis');
    setTradingAccountCountPreset('three');
    setTradingAccountDataPreset('balanced');
    setTradingAccountStatusPreset('mixed');
    setTradingAccountUsageOverride('warning');
    setSelectedTradingAccountId('account-900054');
    applyMockFundingPreset('reviewing');
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

  const applyScenario = (scenario: DevUserScenario) => {
    if (!scenario.apply) {
      void notifyWarning();
      toast.show({
        message: t(scenario.stateSummaryKey),
        title: t('control.scenario.status.gap'),
        tone: 'warning',
      });
      closePanel();
      router.replace(scenario.route);
      return;
    }

    void impactLight();
    scenario.apply();

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

  const devScenarios = useMemo<DevUserScenario[]>(
    () => [
      {
        apply: applyGuest,
        group: 'guestOnboarding',
        icon: 'icon.market.global',
        id: 'guest_onboarding_start',
        intentKey: 'control.scenario.guestOnboarding.start.intent',
        personaKey: 'control.scenario.persona.guest',
        riskLevel: 'normal',
        route: '/brand-splash',
        stateSummaryKey: 'control.scenario.guestOnboarding.start.state',
        tone: 'brand',
      },
      {
        apply: applyGuest,
        group: 'guestOnboarding',
        icon: 'icon.account.add_user',
        id: 'guest_register_risk_ack',
        intentKey: 'control.scenario.guestOnboarding.register.intent',
        personaKey: 'control.scenario.persona.guest',
        riskLevel: 'review',
        route: '/auth/register',
        stateSummaryKey: 'control.scenario.guestOnboarding.register.state',
        tone: 'danger',
      },
      {
        apply: applyReturningLogin,
        group: 'guestOnboarding',
        icon: 'icon.security.lock',
        id: 'returning_login_pin_required',
        intentKey: 'control.scenario.guestOnboarding.returning.intent',
        personaKey: 'control.scenario.persona.returningGuest',
        riskLevel: 'normal',
        route: '/auth',
        stateSummaryKey: 'control.scenario.guestOnboarding.returning.state',
        tone: 'danger',
      },
      {
        apply: applyGuest,
        group: 'guestOnboarding',
        icon: 'icon.notification.email',
        id: 'guest_forgot_password',
        intentKey: 'control.scenario.guestOnboarding.forgot.intent',
        personaKey: 'control.scenario.persona.guest',
        riskLevel: 'normal',
        route: '/auth/forgot-password',
        stateSummaryKey: 'control.scenario.guestOnboarding.forgot.state',
        tone: 'blue',
      },
      {
        apply: () => applyTraderKyc('notStarted'),
        group: 'newTrader',
        icon: 'icon.kyc.identity',
        id: 'new_trader_kyc_not_started',
        intentKey: 'control.scenario.newTrader.notStarted.intent',
        personaKey: 'control.scenario.persona.newTrader',
        riskLevel: 'review',
        route: '/workspace',
        stateSummaryKey: 'control.scenario.newTrader.notStarted.state',
        tone: 'amber',
      },
      {
        apply: () => applyTraderKyc('reviewing'),
        group: 'newTrader',
        icon: 'icon.security.risk_shield',
        id: 'new_trader_kyc_reviewing',
        intentKey: 'control.scenario.newTrader.reviewing.intent',
        personaKey: 'control.scenario.persona.newTrader',
        riskLevel: 'review',
        route: '/workspace',
        stateSummaryKey: 'control.scenario.newTrader.reviewing.state',
        tone: 'amber',
      },
      {
        apply: () => applyTraderKyc('approved'),
        group: 'newTrader',
        icon: 'icon.status.verified',
        id: 'new_trader_kyc_approved',
        intentKey: 'control.scenario.newTrader.approved.intent',
        personaKey: 'control.scenario.persona.readyTrader',
        riskLevel: 'normal',
        route: '/workspace',
        stateSummaryKey: 'control.scenario.newTrader.approved.state',
        tone: 'brand',
      },
      {
        apply: () => {
          applyTradingReady();
          setPositionDataPreset('empty');
          setPendingOrderDataPreset('empty');
        },
        group: 'activeTrader',
        icon: 'icon.trading.market',
        id: 'trader_markets_ready',
        intentKey: 'control.scenario.activeTrader.markets.intent',
        personaKey: 'control.scenario.persona.activeTrader',
        riskLevel: 'normal',
        route: '/markets',
        stateSummaryKey: 'control.scenario.activeTrader.markets.state',
        tone: 'brand',
      },
      {
        apply: applyTradingReady,
        group: 'activeTrader',
        icon: 'icon.trading.order_ticket',
        id: 'trader_order_ticket',
        intentKey: 'control.scenario.activeTrader.order.intent',
        personaKey: 'control.scenario.persona.activeTrader',
        riskLevel: 'review',
        route: `/order/${anchor?.id ?? 'eur-usd'}?direction=buy` as Href,
        stateSummaryKey: 'control.scenario.activeTrader.order.state',
        tone: 'up',
      },
      {
        apply: applyTradingReady,
        group: 'activeTrader',
        icon: 'icon.trading.volume',
        id: 'trader_trade_workspace',
        intentKey: 'control.scenario.activeTrader.workspace.intent',
        personaKey: 'control.scenario.persona.activeTrader',
        riskLevel: 'normal',
        route: '/trade',
        stateSummaryKey: 'control.scenario.activeTrader.workspace.state',
        tone: 'up',
      },
      {
        apply: applyAccountStress,
        group: 'fundingAccount',
        icon: 'icon.account.trading',
        id: 'trader_account_stress',
        intentKey: 'control.scenario.fundingAccount.accountStress.intent',
        personaKey: 'control.scenario.persona.stressTrader',
        riskLevel: 'review',
        route: '/accounts',
        stateSummaryKey: 'control.scenario.fundingAccount.accountStress.state',
        tone: 'blue',
      },
      {
        apply: applyFundingReview,
        group: 'fundingAccount',
        icon: 'icon.wallet.balance',
        id: 'funding_reviewing',
        intentKey: 'control.scenario.fundingAccount.reviewing.intent',
        personaKey: 'control.scenario.persona.fundingTrader',
        riskLevel: 'review',
        route: '/funding/transactions',
        stateSummaryKey: 'control.scenario.fundingAccount.reviewing.state',
        tone: 'blue',
      },
      {
        apply: () => {
          applyFundingReview();
          applyMockFundingPreset('awaitingPayment');
        },
        group: 'fundingAccount',
        icon: 'icon.wallet.deposit',
        id: 'funding_deposit_entry',
        intentKey: 'control.scenario.fundingAccount.deposit.intent',
        personaKey: 'control.scenario.persona.fundingTrader',
        riskLevel: 'normal',
        route: '/funding/deposit',
        stateSummaryKey: 'control.scenario.fundingAccount.deposit.state',
        tone: 'brand',
      },
      {
        apply: () => {
          applySignedIn();
          setRole('trader');
          applyUpgradeStatus('pending');
          setSelectedDiscoverModule('partner');
        },
        group: 'partnerGrowth',
        icon: 'icon.ib.network',
        id: 'partner_pending',
        intentKey: 'control.scenario.partnerGrowth.pending.intent',
        personaKey: 'control.scenario.persona.partnerApplicant',
        riskLevel: 'review',
        route: '/partner-tools',
        stateSummaryKey: 'control.scenario.partnerGrowth.pending.state',
        tone: 'amber',
      },
      {
        apply: () => {
          applySignedIn();
          setRole('partner');
          applyUpgradeStatus('approved');
          setSelectedDiscoverModule('partner');
        },
        group: 'partnerGrowth',
        icon: 'icon.ib.network',
        id: 'partner_approved_workspace',
        intentKey: 'control.scenario.partnerGrowth.approved.intent',
        personaKey: 'control.scenario.persona.partnerApproved',
        riskLevel: 'normal',
        route: '/partner-tools',
        stateSummaryKey: 'control.scenario.partnerGrowth.approved.state',
        tone: 'amber',
      },
      {
        apply: () => {
          applySignedIn();
          setRole('partner');
          applyUpgradeStatus('approved');
        },
        group: 'partnerGrowth',
        icon: 'icon.account.avatar',
        id: 'partner_client_profile',
        intentKey: 'control.scenario.partnerGrowth.client.intent',
        personaKey: 'control.scenario.persona.partnerApproved',
        riskLevel: 'normal',
        route: '/client/client-001',
        stateSummaryKey: 'control.scenario.partnerGrowth.client.state',
        tone: 'blue',
      },
      {
        apply: applyAccountStress,
        group: 'edgeCases',
        icon: 'icon.security.risk_shield',
        id: 'risk_warning_state',
        intentKey: 'control.scenario.edgeCases.risk.intent',
        personaKey: 'control.scenario.persona.stressTrader',
        riskLevel: 'review',
        route: '/workspace',
        stateSummaryKey: 'control.scenario.edgeCases.risk.state',
        tone: 'danger',
      },
      {
        group: 'edgeCases',
        icon: 'icon.trading.market',
        id: 'quote_failed_state',
        intentKey: 'control.scenario.edgeCases.quote.intent',
        personaKey: 'control.scenario.persona.activeTrader',
        riskLevel: 'gap',
        route: '/markets',
        stateSummaryKey: 'control.scenario.edgeCases.quote.state',
        tone: 'down',
      },
    ],
    [anchor?.id, upgradeRequest.status],
  );
  const currentUsageStatus =
    tradingAccountUsageOverride === 'auto'
      ? getAutomaticTradingUsageStatus({ authStatus, quoteStatus })
      : (tradingAccountUsageOverride as TradingAccountUsageStatus);
  const selectedAccountLabel = tradingAccounts.find((item) => item.id === settings.selectedTradingAccountId)?.accountNo ?? settings.selectedTradingAccountId;
  const runtimeMetrics = [
    { label: t('control.pageConsole.quickState.auth'), value: t(`auth.status.${authStatus}`) },
    { label: t('control.role'), value: role === 'partner' ? t('role.partner') : t('role.trader') },
    { label: t('control.kycStatus'), value: t(`kyc.status.${kycStatus}` as TranslationKey) },
    { label: t('control.tradingUsage.selectLabel'), value: t(`control.tradingUsage.status.${currentUsageStatus}`) },
    { label: t('control.devConsole.fundingPreset'), value: t('control.scenario.snapshot.fundingLocal') },
    { label: t('control.pageConsole.partnerState'), value: t(`upgrade.status.${upgradeRequest.status}`) },
    { label: t('control.pageConsole.quoteState'), value: t(`control.scenario.quoteStatus.${quoteStatus}`) },
    { label: t('control.scenario.snapshot.account'), value: selectedAccountLabel },
    { label: t('control.tradingUsage.positions'), value: formatNumber(positions.length, 0, locale) },
    { label: t('control.tradingUsage.orders'), value: formatNumber(orders.length, 0, locale) },
  ];
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
    <>
      {open ? (
        <NativePressable
          accessibilityElementsHidden
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          minTouch={0}
          onPress={closePanel}
          pressedStyle={styles.blankDismissLayer}
          style={styles.blankDismissLayer}
        />
      ) : null}

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
                <View style={StyleSheet.flatten([styles.homeHero, { backgroundColor: colors.surface.panel }])}>
                  <AppText tone="dim" variant="eyebrow">
                    {t('control.scenario.heroEyebrow')}
                  </AppText>
                  <AppText variant="subtitle">{t('control.scenario.heroTitle')}</AppText>
                  <AppText tone="muted" variant="caption">
                    {t('control.scenario.heroBody')}
                  </AppText>
                </View>

                <SectionTitle title={t('control.scenario.userJourneys')} />
                <View style={styles.scenarioGroupStack}>
                  {scenarioGroups.map((group) => {
                    const groupScenarios = devScenarios.filter((scenario) => scenario.group === group);
                    const expanded = expandedScenarioGroups[group] ?? false;
                    const visibleGroupScenarios = expanded ? groupScenarios : groupScenarios.slice(0, defaultVisibleScenarioCount);

                    return (
                      <ScenarioGroup
                        expanded={expanded}
                        group={group}
                        key={group}
                        onToggle={() => setExpandedScenarioGroups((current) => ({ ...current, [group]: !expanded }))}
                        scenarios={visibleGroupScenarios}
                        totalCount={groupScenarios.length}
                        onPressScenario={applyScenario}
                      />
                    );
                  })}
                </View>

                <SectionTitle title={t('control.scenario.currentIdentity')} />
                <View style={StyleSheet.flatten([styles.identitySurface, { backgroundColor: colors.surface.panel }])}>
                  {contextControls}
                  <View style={styles.statusLine}>
                    {runtimeMetrics.map((metric) => (
                      <CompactMetric key={metric.label} label={metric.label} value={metric.value} />
                    ))}
                  </View>
                </View>

                <SectionTitle title={t('control.scenario.diagnosticsReset')} />
                <View style={StyleSheet.flatten([styles.formSurface, { backgroundColor: colors.surface.panel }])}>
                  <ModuleAction
                    body={t('control.pageConsole.menu.pagesBody')}
                    icon="icon.navigation.function_center"
                    label={t('control.pageConsole.menu.pages')}
                    meta={t('control.scenario.pageMapMeta')}
                    onPress={() => setScreen('pages')}
                    tone="brand"
                  />
                  <ModuleAction
                    body={t('control.pageConsole.menu.stateBody')}
                    icon="icon.security.risk_shield"
                    label={t('control.pageConsole.menu.state')}
                    meta={t('control.scenario.fineTuneMeta')}
                    onPress={() => setScreen('state')}
                    tone="amber"
                  />
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
    </>
  );
}

function clampDevConsoleFabOffset(offset: DevConsoleFabOffset, maxRight: number, maxBottom: number): DevConsoleFabOffset {
  return {
    bottom: Math.min(Math.max(offset.bottom, devConsoleFabEdgeInset), maxBottom),
    right: Math.min(Math.max(offset.right, devConsoleFabEdgeInset), maxRight),
  };
}

function buildPageEntries(anchorId: string): PageConsoleEntry[] {
  return [
    pageEntry('markets', 'icon.trading.market', 'control.pageConsole.module.markets', '/markets', '/markets', 'control.pageConsole.page.home.title', 'control.pageConsole.fit.markets', 'brand'),
    pageEntry('markets', 'icon.trading.market', 'control.pageConsole.module.markets', `/instrument/${anchorId}` as Href, '/instrument/[id]', 'control.pageConsole.page.instrument.title', 'control.pageConsole.fit.instrument', 'blue', 'detail'),
    pageEntry('trading', 'icon.trading.order_ticket', 'control.pageConsole.module.trading', '/trade', '/trade', 'control.pageConsole.page.trade.title', 'control.pageConsole.fit.trade', 'up'),
    pageEntry('trading', 'icon.trading.order_ticket', 'control.pageConsole.module.trading', `/order/${anchorId}?direction=buy` as Href, '/order/[id]', 'control.pageConsole.page.order.title', 'control.pageConsole.fit.order', 'up'),
    pageEntry('accounts', 'icon.account.trading', 'control.pageConsole.module.accounts', '/accounts', '/accounts', 'control.pageConsole.page.accounts.title', 'control.pageConsole.fit.accounts', 'blue'),
    pageEntry('accounts', 'icon.account.avatar', 'control.pageConsole.module.accounts', '/account-details/demo-main', '/account-details/[id]', 'control.pageConsole.page.accountDetails.title', 'control.pageConsole.fit.accountDetail', 'blue'),
    pageEntry('accounts', 'icon.account.avatar', 'control.pageConsole.module.accounts', '/account-basic/demo-main', '/account-basic/[id]', 'accountDetails.menuBasicInfo', 'control.pageConsole.fit.accountDetail', 'blue'),
    pageEntry('accounts', 'icon.wallet.balance', 'control.pageConsole.module.accounts', '/account-balance/demo-main', '/account-balance/[id]', 'balance.title', 'control.pageConsole.fit.accountDetail', 'blue'),
    ...fundingOperationEntries.map((entry) =>
      pageEntry('funding', entry.icon, 'control.pageConsole.module.funding', entry.route, entry.routeLabel, `funding.operation.${entry.operation}` as TranslationKey, 'control.pageConsole.fit.funding', 'blue'),
    ),
    pageEntry('funding', 'icon.trading.history', 'control.pageConsole.module.funding', '/funding/transactions', '/funding/transactions', 'funding.transactions.title', 'control.pageConsole.fit.fundingReview', 'blue'),
    pageEntry('growth', 'icon.navigation.discover', 'control.pageConsole.module.discover', '/discover', '/discover', 'control.pageConsole.page.discover.title', 'control.pageConsole.fit.discover', 'brand'),
    pageEntry('growth', 'icon.ib.network', 'control.pageConsole.module.partner', '/partner-tools', '/partner-tools', 'control.pageConsole.page.partnerTools.title', 'control.pageConsole.fit.partner', 'amber'),
    pageEntry('growth', 'icon.kyc.identity', 'control.pageConsole.module.partner', '/client/client-001', '/client/[id]', 'control.pageConsole.page.clientProfile.title', 'control.pageConsole.fit.client', 'amber'),
    pageEntry('growth', 'icon.support.headset', 'control.pageConsole.module.discover', '/quick', '/quick', 'discover.module.support.title', 'control.pageConsole.fit.discover', 'brand'),
    pageEntry('auth', 'icon.market.global', 'control.pageConsole.module.auth', '/brand-splash', '/brand-splash', 'control.pageConsole.page.launch.title', 'control.pageConsole.fit.launch', 'brand'),
    pageEntry('auth', 'icon.market.global', 'control.pageConsole.module.auth', '/auth/onboarding', '/auth/onboarding', 'control.pageConsole.page.onboarding.title', 'control.pageConsole.fit.onboarding', 'blue'),
    pageEntry('auth', 'icon.security.lock', 'control.pageConsole.module.auth', '/auth', '/auth', 'control.pageConsole.page.login.title', 'control.pageConsole.fit.login', 'danger'),
    pageEntry('auth', 'icon.account.add_user', 'control.pageConsole.module.auth', '/auth/register', '/auth/register', 'control.pageConsole.page.register.title', 'control.pageConsole.fit.register', 'danger'),
    pageEntry('auth', 'icon.notification.email', 'control.pageConsole.module.auth', '/auth/forgot-password', '/auth/forgot-password', 'control.pageConsole.page.forgot.title', 'control.pageConsole.fit.forgot', 'danger'),
  ];
}

function pageEntry(
  group: PageConsoleGroup,
  icon: AppIconName,
  moduleKey: TranslationKey,
  route: Href,
  routeLabel: string,
  titleKey: TranslationKey,
  fitKey: TranslationKey,
  tone: ScenarioTone,
  level: PageConsoleLevel = 'primary',
): PageConsoleEntry {
  return { fitKey, group, icon, level, moduleKey, route, routeLabel, titleKey, tone };
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

function ScenarioGroup({
  expanded,
  group,
  onPressScenario,
  onToggle,
  scenarios,
  totalCount,
}: {
  expanded: boolean;
  group: DevScenarioGroup;
  onPressScenario: (scenario: DevUserScenario) => void;
  onToggle: () => void;
  scenarios: DevUserScenario[];
  totalCount: number;
}) {
  const { colors, t } = useProductSettings();
  const hiddenCount = Math.max(0, totalCount - defaultVisibleScenarioCount);

  return (
    <View style={StyleSheet.flatten([styles.scenarioGroup, { backgroundColor: colors.surface.panel }])}>
      <View style={styles.scenarioGroupHeader}>
        <View style={styles.rowText}>
          <AppText variant="caption">{t(`control.scenario.group.${group}`)}</AppText>
          <AppText numberOfLines={2} tone="muted" variant="caption">
            {t(`control.scenario.group.${group}.hint`)}
          </AppText>
        </View>
        {hiddenCount > 0 ? (
          <NativePressable accessibilityRole="button" minTouch={40} onPress={onToggle} style={styles.groupToggle}>
            <AppText tone="brand" variant="caption">
              {expanded ? t('control.scenario.collapse') : t('control.scenario.expand')}
            </AppText>
            <AppIcon name={expanded ? 'icon.system.chevron_down' : 'icon.system.chevron_right'} sizeVariant="sm" tone="tertiary" />
          </NativePressable>
        ) : null}
      </View>

      <View style={styles.scenarioCardStack}>
        {scenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} onPress={() => onPressScenario(scenario)} scenario={scenario} />
        ))}
      </View>
    </View>
  );
}

function ScenarioCard({ onPress, scenario }: { onPress: () => void; scenario: DevUserScenario }) {
  const { colors, t } = useProductSettings();
  const surfaceTone = scenarioSurfaceToneKeys[scenario.tone] ?? 'neutral';
  const accessibilityLabel = `${t(scenario.intentKey)}. ${t('control.scenario.personaPrefix')} ${t(scenario.personaKey)}. ${t('control.scenario.statePrefix')} ${t(scenario.stateSummaryKey)}.`;

  return (
    <NativePressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      minTouch={44}
      onPress={onPress}
      style={StyleSheet.flatten([styles.scenarioCard, { backgroundColor: colors.surface.subtle }])}>
      <IconSurface background="hidden" icon={scenario.icon} sizeVariant="sm" tone={surfaceTone} />
      <View style={styles.rowText}>
        <View style={styles.scenarioCardHeader}>
          <AppText numberOfLines={1} variant="caption">
            {t(scenario.intentKey)}
          </AppText>
          <AppText numberOfLines={1} tone={scenario.riskLevel === 'gap' || scenario.riskLevel === 'blocked' ? 'danger' : 'dim'} variant="eyebrow">
            {t(`control.scenario.status.${scenario.riskLevel}`)}
          </AppText>
        </View>
        <AppText numberOfLines={1} tone="muted" variant="caption">
          {t('control.scenario.personaPrefix')} {t(scenario.personaKey)}
        </AppText>
        <AppText numberOfLines={2} tone="muted" variant="caption">
          {t('control.scenario.statePrefix')} {t(scenario.stateSummaryKey)}
        </AppText>
        <AppText numberOfLines={1} tone="dim" variant="eyebrow">
          {t('control.scenario.routePrefix')} {String(scenario.route)}
        </AppText>
      </View>
      <AppIcon name="icon.system.chevron_right" size={layout.menuDisclosureIconSize} tone="tertiary" />
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
  const surfaceTone = tone === 'brand' ? 'brand' : tone === 'amber' || tone === 'warning' ? 'warning' : 'neutral';

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
        <AppText numberOfLines={1} tone="muted" variant="caption">
          {t('control.pageConsole.bestFor')} {t(entry.fitKey)}
        </AppText>
        <AppText numberOfLines={1} tone="dim" variant="eyebrow">
          {entry.routeLabel}
        </AppText>
      </View>
      <View style={styles.pageMetaStack}>
        <AppText numberOfLines={1} tone="dim" variant="eyebrow">
          {t(entry.moduleKey)}
        </AppText>
        {entry.level !== 'primary' ? (
          <AppText numberOfLines={1} tone="dim" variant="eyebrow">
            {t(pageLevelLabels[entry.level])}
          </AppText>
        ) : null}
      </View>
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
  blankDismissLayer: {
    backgroundColor: 'transparent',
    bottom: 0,
    left: 0,
    position: 'fixed' as unknown as 'absolute',
    right: 0,
    top: 0,
    zIndex: zIndex.devOverlay,
  },
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
  groupToggle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xxs,
    minWidth: 0,
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
  homeHero: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    gap: spacing.xs,
    padding: spacing.sm,
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
  identitySurface: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    gap: spacing.xs,
    padding: spacing.sm,
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
  pageMetaStack: {
    alignItems: 'flex-end',
    gap: spacing.xxs,
  },
  scenarioCard: {
    alignItems: 'flex-start',
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: size.menu.rowMinHeight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  scenarioCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    minWidth: 0,
  },
  scenarioCardStack: {
    gap: spacing.xs,
  },
  scenarioGroup: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    gap: spacing.xs,
    padding: spacing.sm,
  },
  scenarioGroupHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  scenarioGroupStack: {
    gap: spacing.sm,
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
