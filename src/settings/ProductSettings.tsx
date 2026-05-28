import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';

import {
  tradingAccountCountPresets,
  tradingAccountDataPresets,
  tradingAccountStatusPresets,
  type TradingAccountCountPreset,
  type TradingAccountDataPreset,
  type TradingAccountScenario,
  type TradingAccountStatusPreset,
} from '@/src/domain/accountProfiles';
import { normalizeDiscoverLayoutItems, type DiscoverLayoutItem } from '@/src/domain/discoverLayout';
import type { Locale, TranslationKey } from '@/src/i18n/translations';
import { translations } from '@/src/i18n/translations';
import type { ProfileAvatarId } from '@/src/components/ProfileAvatar';
import { themeColors, type ResolvedThemeMode, type ThemeColors, type ThemeMode } from '@/src/theme/colors';
import type { AuthChannel, AuthStatus, DiscoverModuleId, KycStatus, PinStatus, Role, TradeWorkspaceDataPreset, TradingAccountUsageOverride } from '@/src/domain/types';

const STORAGE_KEY = 'dupoin-mvp-product-settings';
const DEFAULT_THEME_MODE: ThemeMode = 'system';
const FALLBACK_SYSTEM_THEME_MODE: ResolvedThemeMode = 'lightBroker';
const DEFAULT_DISCOVER_MODULE_BY_ROLE: Record<Role, DiscoverModuleId> = {
  partner: 'partner',
  trader: 'community',
};
const DEFAULT_PROFILE_AVATAR_ID: ProfileAvatarId = 'frank';
const DEFAULT_SELECTED_TRADING_ACCOUNT_ID = 'demo-main';
const discoverModuleIds: DiscoverModuleId[] = [
  'challenge',
  'education',
  'community',
  'profile',
  'onboarding',
  'partner',
  'markets',
  'accounts',
  'support',
  'rewards',
];
const tradingAccountScenarios: TradingAccountScenario[] = ['default', 'stateAnalysis'];
const tradingAccountUsageOverrides: TradingAccountUsageOverride[] = ['auto', 'normal', 'warning', 'abnormal'];
const kycStatuses: KycStatus[] = ['notStarted', 'reviewing', 'approved', 'rejected'];
export const tradeWorkspaceDataPresets: TradeWorkspaceDataPreset[] = ['empty', 'sample'];
const profileAvatarIds: ProfileAvatarId[] = ['frank', 'mika', 'alex', 'sophia'];
const rememberedLoginMethods = ['password', 'code', 'pin', 'register'] as const;
export const REMEMBERED_WEB_DEMO_DEVICE_LABEL = 'web-demo-device';
export const REMEMBERED_LOCAL_DEVICE_LABEL = 'local-device';

type RememberedLoginMethod = (typeof rememberedLoginMethods)[number];
type TranslationDictionary = Partial<Record<TranslationKey, string>>;

export type RememberedLoginSnapshot = {
  account: string;
  avatarId: ProfileAvatarId;
  channel: AuthChannel;
  deviceLabel?: string;
  ipHint?: string;
  lastLoginAt?: string;
  lastLoginMethod?: RememberedLoginMethod;
  locationHint?: string;
  nickname?: string;
};

type ProductSettings = {
  authStatus: AuthStatus;
  clearRememberedLoginSnapshot: () => void;
  discoverLayoutItems: DiscoverLayoutItem[];
  lastLoginAccount: string;
  lastLoginAvatarId: ProfileAvatarId;
  lastLoginChannel: AuthChannel;
  locale: Locale;
  localPinCode: string;
  kycStatus: KycStatus;
  colors: ThemeColors;
  /** @deprecated Use colors. */
  palette: ThemeColors;
  pinGateStatus: 'locked' | 'unlocked';
  pinStatus: PinStatus;
  resolvedThemeMode: ResolvedThemeMode;
  role: Role;
  pendingOrderDataPreset: TradeWorkspaceDataPreset;
  positionDataPreset: TradeWorkspaceDataPreset;
  profileAvatarId: ProfileAvatarId;
  profileNickname: string;
  rememberedLoginSnapshot: RememberedLoginSnapshot | null;
  resetProductSettings: () => void;
  selectedDiscoverModuleByRole: Record<Role, DiscoverModuleId>;
  selectedDiscoverModuleId: DiscoverModuleId;
  selectedTradingAccountId: string;
  setAuthStatus: (authStatus: AuthStatus) => void;
  setDiscoverLayoutItems: (discoverLayoutItems: DiscoverLayoutItem[]) => void;
  setLastLoginAccount: (lastLoginAccount: string) => void;
  setLastLoginAvatarId: (lastLoginAvatarId: ProfileAvatarId) => void;
  setLastLoginChannel: (lastLoginChannel: AuthChannel) => void;
  setKycStatus: (kycStatus: KycStatus) => void;
  setLocale: (locale: Locale) => void;
  setLocalPinCode: (localPinCode: string) => void;
  setPinGateStatus: (pinGateStatus: 'locked' | 'unlocked') => void;
  setPinStatus: (pinStatus: PinStatus) => void;
  setPendingOrderDataPreset: (pendingOrderDataPreset: TradeWorkspaceDataPreset) => void;
  setPositionDataPreset: (positionDataPreset: TradeWorkspaceDataPreset) => void;
  setProfileAvatarId: (profileAvatarId: ProfileAvatarId) => void;
  setProfileNickname: (profileNickname: string) => void;
  setRememberedLoginSnapshot: (snapshot: RememberedLoginSnapshot | null) => void;
  setRole: (role: Role) => void;
  setSelectedDiscoverModule: (moduleId: DiscoverModuleId) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
  setSelectedTradingAccountId: (selectedTradingAccountId: string) => void;
  setTradingAccountCountPreset: (tradingAccountCountPreset: TradingAccountCountPreset) => void;
  setTradingAccountDataPreset: (tradingAccountDataPreset: TradingAccountDataPreset) => void;
  setTradingAccountScenario: (tradingAccountScenario: TradingAccountScenario) => void;
  setTradingAccountStatusPreset: (tradingAccountStatusPreset: TradingAccountStatusPreset) => void;
  setTradingAccountUsageOverride: (tradingAccountUsageOverride: TradingAccountUsageOverride) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  themeMode: ThemeMode;
  tradingAccountCountPreset: TradingAccountCountPreset;
  tradingAccountDataPreset: TradingAccountDataPreset;
  tradingAccountScenario: TradingAccountScenario;
  tradingAccountStatusPreset: TradingAccountStatusPreset;
  tradingAccountUsageOverride: TradingAccountUsageOverride;
};

const ProductSettingsContext = createContext<ProductSettings | null>(null);

function readStoredSettings() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function isDiscoverModuleId(value: unknown): value is DiscoverModuleId {
  return typeof value === 'string' && discoverModuleIds.includes(value as DiscoverModuleId);
}

function isTradingAccountUsageOverride(value: unknown): value is TradingAccountUsageOverride {
  return typeof value === 'string' && tradingAccountUsageOverrides.includes(value as TradingAccountUsageOverride);
}

function isTradingAccountScenario(value: unknown): value is TradingAccountScenario {
  return typeof value === 'string' && tradingAccountScenarios.includes(value as TradingAccountScenario);
}

function isTradingAccountCountPreset(value: unknown): value is TradingAccountCountPreset {
  return typeof value === 'string' && tradingAccountCountPresets.includes(value as TradingAccountCountPreset);
}

function isTradingAccountDataPreset(value: unknown): value is TradingAccountDataPreset {
  return typeof value === 'string' && tradingAccountDataPresets.includes(value as TradingAccountDataPreset);
}

function isTradingAccountStatusPreset(value: unknown): value is TradingAccountStatusPreset {
  return typeof value === 'string' && tradingAccountStatusPresets.includes(value as TradingAccountStatusPreset);
}

function isTradeWorkspaceDataPreset(value: unknown): value is TradeWorkspaceDataPreset {
  return typeof value === 'string' && tradeWorkspaceDataPresets.includes(value as TradeWorkspaceDataPreset);
}

function isProfileAvatarId(value: unknown): value is ProfileAvatarId {
  return typeof value === 'string' && profileAvatarIds.includes(value as ProfileAvatarId);
}

function isAuthChannel(value: unknown): value is AuthChannel {
  return value === 'email' || value === 'phone';
}

function isRememberedLoginMethod(value: unknown): value is RememberedLoginMethod {
  return typeof value === 'string' && rememberedLoginMethods.includes(value as RememberedLoginMethod);
}

function isPinStatus(value: unknown): value is PinStatus {
  return value === 'unset' || value === 'skipped' || value === 'set';
}

function isKycStatus(value: unknown): value is KycStatus {
  return typeof value === 'string' && kycStatuses.includes(value as KycStatus);
}

function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && (value === 'system' || value in themeColors);
}

function readStoredDiscoverModules(stored: Record<string, unknown>): Record<Role, DiscoverModuleId> {
  const storedModules = stored.selectedDiscoverModuleByRole;

  if (!storedModules || typeof storedModules !== 'object') {
    return DEFAULT_DISCOVER_MODULE_BY_ROLE;
  }

  const modules = storedModules as Partial<Record<Role, unknown>>;

  return {
    partner: isDiscoverModuleId(modules.partner) ? modules.partner : DEFAULT_DISCOVER_MODULE_BY_ROLE.partner,
    trader: isDiscoverModuleId(modules.trader) ? modules.trader : DEFAULT_DISCOVER_MODULE_BY_ROLE.trader,
  };
}

function readOptionalString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function sanitizeIpHint(value: unknown) {
  const hint = readOptionalString(value);

  if (!hint) {
    return undefined;
  }

  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hint) ? hint.replace(/\.\d{1,3}$/, '.*') : hint;
}

function normalizeRememberedLoginSnapshot(stored: Record<string, unknown>): RememberedLoginSnapshot | null {
  const rawSnapshot = stored.rememberedLoginSnapshot;
  const snapshot = rawSnapshot && typeof rawSnapshot === 'object' ? (rawSnapshot as Record<string, unknown>) : null;
  const account = readOptionalString(snapshot?.account) ?? readOptionalString(stored.lastLoginAccount);

  if (!account) {
    return null;
  }

  const channelCandidate = snapshot?.channel ?? stored.lastLoginChannel;
  const avatarCandidate = snapshot?.avatarId ?? stored.lastLoginAvatarId ?? stored.profileAvatarId;
  const normalized: RememberedLoginSnapshot = {
    account,
    avatarId: isProfileAvatarId(avatarCandidate) ? avatarCandidate : DEFAULT_PROFILE_AVATAR_ID,
    channel: isAuthChannel(channelCandidate) ? channelCandidate : 'email',
  };
  const deviceLabel = readOptionalString(snapshot?.deviceLabel);
  const ipHint = sanitizeIpHint(snapshot?.ipHint);
  const lastLoginAt = readOptionalString(snapshot?.lastLoginAt);
  const locationHint = readOptionalString(snapshot?.locationHint);
  const nickname = readOptionalString(snapshot?.nickname);

  if (deviceLabel) {
    normalized.deviceLabel = deviceLabel;
  }
  if (ipHint) {
    normalized.ipHint = ipHint;
  }
  if (lastLoginAt) {
    normalized.lastLoginAt = lastLoginAt;
  }
  if (isRememberedLoginMethod(snapshot?.lastLoginMethod)) {
    normalized.lastLoginMethod = snapshot.lastLoginMethod;
  }
  if (locationHint) {
    normalized.locationHint = locationHint;
  }
  if (nickname) {
    normalized.nickname = nickname;
  }

  return normalized;
}

export function ProductSettingsProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useColorScheme();
  const stored = readStoredSettings();
  const initialRememberedLoginSnapshot = normalizeRememberedLoginSnapshot(stored);
  const [role, setRole] = useState<Role>(stored.role === 'partner' ? 'partner' : 'trader');
  const storedAuthStatus: AuthStatus =
    stored.authStatus === 'guest' || stored.authStatus === 'signedIn' ? stored.authStatus : 'guest';
  const [authStatus, setAuthStatus] = useState<AuthStatus>(storedAuthStatus);
  const [lastLoginAccount, updateLastLoginAccount] = useState(
    initialRememberedLoginSnapshot?.account ?? (typeof stored.lastLoginAccount === 'string' ? stored.lastLoginAccount : ''),
  );
  const [lastLoginChannel, updateLastLoginChannel] = useState<AuthChannel>(
    initialRememberedLoginSnapshot?.channel ?? (isAuthChannel(stored.lastLoginChannel) ? stored.lastLoginChannel : 'email'),
  );
  const [localPinCode, setLocalPinCode] = useState(typeof stored.localPinCode === 'string' ? stored.localPinCode : '');
  const [pinStatus, setPinStatus] = useState<PinStatus>(
    isPinStatus(stored.pinStatus) ? stored.pinStatus : storedAuthStatus === 'signedIn' && localPinCode.length === 6 ? 'set' : 'unset',
  );
  const [pinGateStatus, setPinGateStatus] = useState<'locked' | 'unlocked'>('unlocked');
  const [discoverLayoutItems, updateDiscoverLayoutItems] = useState<DiscoverLayoutItem[]>(
    normalizeDiscoverLayoutItems(stored.discoverLayoutItems),
  );
  const setDiscoverLayoutItems = (items: DiscoverLayoutItem[]) => {
    updateDiscoverLayoutItems(normalizeDiscoverLayoutItems(items));
  };
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    isThemeMode(stored.themeMode) ? stored.themeMode : DEFAULT_THEME_MODE,
  );
  const [locale, setLocale] = useState<Locale>(
    stored.locale === 'en-US' || stored.locale === 'id-ID' ? stored.locale : 'zh-CN',
  );
  const [kycStatus, setKycStatus] = useState<KycStatus>(isKycStatus(stored.kycStatus) ? stored.kycStatus : 'notStarted');
  const [selectedDiscoverModuleByRole, setSelectedDiscoverModuleByRole] = useState<Record<Role, DiscoverModuleId>>(
    readStoredDiscoverModules(stored),
  );
  const [tradingAccountScenario, setTradingAccountScenario] = useState<TradingAccountScenario>(
    isTradingAccountScenario(stored.tradingAccountScenario) ? stored.tradingAccountScenario : 'default',
  );
  const [tradingAccountCountPreset, setTradingAccountCountPreset] = useState<TradingAccountCountPreset>(
    isTradingAccountCountPreset(stored.tradingAccountCountPreset) ? stored.tradingAccountCountPreset : 'scenario',
  );
  const [tradingAccountDataPreset, setTradingAccountDataPreset] = useState<TradingAccountDataPreset>(
    isTradingAccountDataPreset(stored.tradingAccountDataPreset) ? stored.tradingAccountDataPreset : 'scenario',
  );
  const [tradingAccountStatusPreset, setTradingAccountStatusPreset] = useState<TradingAccountStatusPreset>(
    isTradingAccountStatusPreset(stored.tradingAccountStatusPreset) ? stored.tradingAccountStatusPreset : 'scenario',
  );
  const [tradingAccountUsageOverride, setTradingAccountUsageOverride] = useState<TradingAccountUsageOverride>(
    isTradingAccountUsageOverride(stored.tradingAccountUsageOverride) ? stored.tradingAccountUsageOverride : 'auto',
  );
  const [positionDataPreset, setPositionDataPreset] = useState<TradeWorkspaceDataPreset>(
    isTradeWorkspaceDataPreset(stored.positionDataPreset) ? stored.positionDataPreset : 'empty',
  );
  const [pendingOrderDataPreset, setPendingOrderDataPreset] = useState<TradeWorkspaceDataPreset>(
    isTradeWorkspaceDataPreset(stored.pendingOrderDataPreset) ? stored.pendingOrderDataPreset : 'empty',
  );
  const [selectedTradingAccountId, setSelectedTradingAccountId] = useState(
    typeof stored.selectedTradingAccountId === 'string' && stored.selectedTradingAccountId ? stored.selectedTradingAccountId : DEFAULT_SELECTED_TRADING_ACCOUNT_ID,
  );
  const [profileAvatarId, setProfileAvatarId] = useState<ProfileAvatarId>(
    isProfileAvatarId(stored.profileAvatarId) ? stored.profileAvatarId : DEFAULT_PROFILE_AVATAR_ID,
  );
  const [profileNickname, setProfileNickname] = useState(typeof stored.profileNickname === 'string' ? stored.profileNickname : '');
  const [lastLoginAvatarId, updateLastLoginAvatarId] = useState<ProfileAvatarId>(
    initialRememberedLoginSnapshot?.avatarId ??
      (isProfileAvatarId(stored.lastLoginAvatarId) ? stored.lastLoginAvatarId : isProfileAvatarId(stored.profileAvatarId) ? stored.profileAvatarId : DEFAULT_PROFILE_AVATAR_ID),
  );
  const [rememberedLoginSnapshot, updateRememberedLoginSnapshot] = useState<RememberedLoginSnapshot | null>(
    initialRememberedLoginSnapshot,
  );
  const setSelectedDiscoverModule = (moduleId: DiscoverModuleId) => {
    setSelectedDiscoverModuleByRole((current) => ({ ...current, [role]: moduleId }));
  };
  const setRememberedLoginSnapshot = (snapshot: RememberedLoginSnapshot | null) => {
    if (!snapshot || snapshot.account.trim().length === 0) {
      updateRememberedLoginSnapshot(null);
      updateLastLoginAccount('');
      updateLastLoginAvatarId(DEFAULT_PROFILE_AVATAR_ID);
      updateLastLoginChannel('email');
      return;
    }

    const normalized: RememberedLoginSnapshot = {
      account: snapshot.account.trim(),
      avatarId: isProfileAvatarId(snapshot.avatarId) ? snapshot.avatarId : DEFAULT_PROFILE_AVATAR_ID,
      channel: isAuthChannel(snapshot.channel) ? snapshot.channel : 'email',
    };
    const deviceLabel = readOptionalString(snapshot.deviceLabel);
    const ipHint = sanitizeIpHint(snapshot.ipHint);
    const lastLoginAt = readOptionalString(snapshot.lastLoginAt);
    const locationHint = readOptionalString(snapshot.locationHint);
    const nickname = readOptionalString(snapshot.nickname);

    if (deviceLabel) {
      normalized.deviceLabel = deviceLabel;
    }
    if (ipHint) {
      normalized.ipHint = ipHint;
    }
    if (lastLoginAt) {
      normalized.lastLoginAt = lastLoginAt;
    }
    if (isRememberedLoginMethod(snapshot.lastLoginMethod)) {
      normalized.lastLoginMethod = snapshot.lastLoginMethod;
    }
    if (locationHint) {
      normalized.locationHint = locationHint;
    }
    if (nickname) {
      normalized.nickname = nickname;
    }

    updateRememberedLoginSnapshot(normalized);
    updateLastLoginAccount(normalized.account);
    updateLastLoginAvatarId(normalized.avatarId);
    updateLastLoginChannel(normalized.channel);
  };
  const clearRememberedLoginSnapshot = () => {
    setRememberedLoginSnapshot(null);
  };
  const setLastLoginAccount = (account: string) => {
    const trimmed = account.trim();

    updateLastLoginAccount(trimmed);
    if (!trimmed) {
      updateRememberedLoginSnapshot(null);
      return;
    }

    updateRememberedLoginSnapshot((current) => {
      const next: RememberedLoginSnapshot = {
        account: trimmed,
        avatarId: current?.avatarId ?? lastLoginAvatarId,
        channel: current?.channel ?? lastLoginChannel,
      };

      if (current?.deviceLabel) {
        next.deviceLabel = current.deviceLabel;
      }
      if (current?.ipHint) {
        next.ipHint = current.ipHint;
      }
      if (current?.lastLoginAt) {
        next.lastLoginAt = current.lastLoginAt;
      }
      if (current?.lastLoginMethod) {
        next.lastLoginMethod = current.lastLoginMethod;
      }
      if (current?.locationHint) {
        next.locationHint = current.locationHint;
      }
      if (current?.nickname) {
        next.nickname = current.nickname;
      }

      return next;
    });
  };
  const setLastLoginAvatarId = (avatarId: ProfileAvatarId) => {
    const normalizedAvatarId = isProfileAvatarId(avatarId) ? avatarId : DEFAULT_PROFILE_AVATAR_ID;

    updateLastLoginAvatarId(normalizedAvatarId);
    updateRememberedLoginSnapshot((current) => (current ? { ...current, avatarId: normalizedAvatarId } : current));
  };
  const setLastLoginChannel = (channel: AuthChannel) => {
    const normalizedChannel = isAuthChannel(channel) ? channel : 'email';

    updateLastLoginChannel(normalizedChannel);
    updateRememberedLoginSnapshot((current) => (current ? { ...current, channel: normalizedChannel } : current));
  };
  const resetProductSettings = () => {
    setAuthStatus('guest');
    clearRememberedLoginSnapshot();
    setDiscoverLayoutItems([]);
    setLocale('zh-CN');
    setKycStatus('notStarted');
    setLocalPinCode('');
    setPendingOrderDataPreset('empty');
    setPinGateStatus('unlocked');
    setPinStatus('unset');
    setPositionDataPreset('empty');
    setProfileAvatarId(DEFAULT_PROFILE_AVATAR_ID);
    setProfileNickname('');
    setRole('trader');
    setSelectedDiscoverModuleByRole(DEFAULT_DISCOVER_MODULE_BY_ROLE);
    setSelectedTradingAccountId(DEFAULT_SELECTED_TRADING_ACCOUNT_ID);
    setThemeMode(DEFAULT_THEME_MODE);
    setTradingAccountCountPreset('scenario');
    setTradingAccountDataPreset('scenario');
    setTradingAccountScenario('default');
    setTradingAccountStatusPreset('scenario');
    setTradingAccountUsageOverride('auto');
  };

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        authStatus,
        discoverLayoutItems,
        lastLoginAccount,
        lastLoginAvatarId,
        lastLoginChannel,
        kycStatus,
        locale,
        localPinCode,
        pendingOrderDataPreset,
        pinStatus,
        positionDataPreset,
        profileAvatarId,
        profileNickname,
        rememberedLoginSnapshot,
        role,
        selectedDiscoverModuleByRole,
        selectedTradingAccountId,
        themeMode,
        tradingAccountCountPreset,
        tradingAccountDataPreset,
        tradingAccountScenario,
        tradingAccountStatusPreset,
        tradingAccountUsageOverride,
      }),
    );
  }, [
    authStatus,
    discoverLayoutItems,
    lastLoginAccount,
    lastLoginAvatarId,
    lastLoginChannel,
    kycStatus,
    locale,
    localPinCode,
    pendingOrderDataPreset,
    pinStatus,
    positionDataPreset,
    profileAvatarId,
    profileNickname,
    rememberedLoginSnapshot,
    role,
    selectedDiscoverModuleByRole,
    selectedTradingAccountId,
    themeMode,
    tradingAccountCountPreset,
    tradingAccountDataPreset,
    tradingAccountScenario,
    tradingAccountStatusPreset,
    tradingAccountUsageOverride,
  ]);

  const value = useMemo<ProductSettings>(() => {
    const dictionary = translations[locale] as TranslationDictionary;
    const fallbackLocale: Locale = locale === 'zh-CN' ? 'en-US' : 'zh-CN';
    const fallbackDictionary = translations[fallbackLocale] as TranslationDictionary;
    const resolvedThemeMode: ResolvedThemeMode =
      themeMode === 'system' ? (systemColorScheme === 'dark' ? 'darkTerminal' : FALLBACK_SYSTEM_THEME_MODE) : themeMode;

    return {
      authStatus,
      clearRememberedLoginSnapshot,
      discoverLayoutItems,
      lastLoginAccount,
      lastLoginAvatarId,
      lastLoginChannel,
      kycStatus,
      locale,
      localPinCode,
      colors: themeColors[resolvedThemeMode],
      palette: themeColors[resolvedThemeMode],
      pinGateStatus,
      pinStatus,
      pendingOrderDataPreset,
      positionDataPreset,
      profileAvatarId,
      profileNickname,
      rememberedLoginSnapshot,
      resetProductSettings,
      resolvedThemeMode,
      role,
      selectedDiscoverModuleByRole,
      selectedDiscoverModuleId: selectedDiscoverModuleByRole[role],
      selectedTradingAccountId,
      setAuthStatus,
      setDiscoverLayoutItems,
      setLastLoginAccount,
      setLastLoginAvatarId,
      setLastLoginChannel,
      setKycStatus,
      setLocale,
      setLocalPinCode,
      setPinGateStatus,
      setPinStatus,
      setPendingOrderDataPreset,
      setPositionDataPreset,
      setProfileAvatarId,
      setProfileNickname,
      setRememberedLoginSnapshot,
      setRole,
      setSelectedDiscoverModule,
      setSelectedTradingAccountId,
      setThemeMode,
      setTradingAccountCountPreset,
      setTradingAccountDataPreset,
      setTradingAccountScenario,
      setTradingAccountStatusPreset,
      setTradingAccountUsageOverride,
      t: (key, params) => {
        let text: string = dictionary[key] ?? fallbackDictionary[key] ?? key;

        if (params) {
          Object.entries(params).forEach(([paramKey, paramValue]) => {
            text = text.replaceAll(`{${paramKey}}`, String(paramValue));
          });
        }

        return text;
      },
      themeMode,
      tradingAccountCountPreset,
      tradingAccountDataPreset,
      tradingAccountScenario,
      tradingAccountStatusPreset,
      tradingAccountUsageOverride,
    };
  }, [
    authStatus,
    discoverLayoutItems,
    lastLoginAccount,
    lastLoginAvatarId,
    lastLoginChannel,
    kycStatus,
    locale,
    localPinCode,
    pinGateStatus,
    pinStatus,
    pendingOrderDataPreset,
    positionDataPreset,
    profileAvatarId,
    profileNickname,
    rememberedLoginSnapshot,
    role,
    selectedDiscoverModuleByRole,
    selectedTradingAccountId,
    systemColorScheme,
    themeMode,
    tradingAccountCountPreset,
    tradingAccountDataPreset,
    tradingAccountScenario,
    tradingAccountStatusPreset,
    tradingAccountUsageOverride,
  ]);

  return <ProductSettingsContext.Provider value={value}>{children}</ProductSettingsContext.Provider>;
}

export function useProductSettings() {
  const context = useContext(ProductSettingsContext);

  if (!context) {
    throw new Error('useProductSettings must be used inside ProductSettingsProvider');
  }

  return context;
}

export function useI18n() {
  const { locale, t } = useProductSettings();
  return { locale, t };
}

export function useThemeColors() {
  return useProductSettings().colors;
}

/** @deprecated Use useThemeColors(). */
export function useThemePalette() {
  return useThemeColors();
}
