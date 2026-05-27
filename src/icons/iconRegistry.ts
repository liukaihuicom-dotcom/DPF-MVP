import type { ThemeColors } from '@/src/theme/colors';

export type IconCategory =
  | 'account'
  | 'banking'
  | 'brand'
  | 'copy_trading'
  | 'data'
  | 'education'
  | 'ib_partner'
  | 'kyc_compliance'
  | 'navigation'
  | 'notification'
  | 'promotion'
  | 'review'
  | 'security'
  | 'status'
  | 'support'
  | 'system'
  | 'trading'
  | 'trading_account'
  | 'wallet';
export type IconPlatform = 'app' | 'h5' | 'web' | 'admin';
export type IconTone =
  | 'amber'
  | 'blue'
  | 'brand'
  | 'danger'
  | 'disabled'
  | 'down'
  | 'info'
  | 'inverse'
  | 'panel'
  | 'primary'
  | 'success'
  | 'tertiary'
  | 'text'
  | 'textDim'
  | 'textMuted'
  | 'up'
  | 'warning'
  | 'white';
export type IconSourceLibrary = 'iconsax' | 'custom';
export type IconState = 'default' | 'active' | 'disabled' | 'success' | 'warning' | 'danger' | 'inverse';
export type IconStyleName = 'line' | 'fill' | 'duotone';

export type AppIconDefinition = {
  category: IconCategory;
  defaultSize: number;
  defaultTone: IconTone;
  forbidden: string[];
  legacyNames: string[];
  license: {
    attributionRequired: boolean;
    name: 'MIT' | 'ISC' | 'Remix Icon License v1.0' | 'custom-owned';
    url: string;
  };
  localAssetPath: string;
  meaning: string;
  modified: boolean;
  platforms: IconPlatform[];
  sizes: readonly number[];
  sourceIconName: string;
  sourceLibrary: IconSourceLibrary;
  states: IconState[];
  status: 'approved' | 'deprecated' | 'blocked' | 'draft';
  style: {
    active: IconStyleName;
    default: IconStyleName;
    disabled: IconStyleName;
  };
  tokenBinding: {
    color: string;
    size: string;
  };
  toneTokens: IconTone[];
  usage: string[];
};

export const iconRegistry = {
  "icon.brand.apple": {
    category: "brand",
    defaultSize: 17,
    defaultTone: "text",
    forbidden: [
      "Do not recolor as risk or market status."
    ],
    legacyNames: [
      "appApple"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalAppleIcon.tsx",
    meaning: "Apple sign-in provider mark",
    modified: true,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Apple",
    sourceLibrary: "custom",
    states: [
      "default"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.primary",
      size: "size.icon.md"
    },
    toneTokens: [
      "text"
    ],
    usage: [
      "Apple sign-in provider mark.",
      "Apple sign-in provider mark"
    ]
  },
  "icon.wallet.withdrawal": {
    category: "wallet",
    defaultSize: 24,
    defaultTone: "amber",
    forbidden: [
      "Do not use for price trend.",
      "Do not use for refresh, exchange, or internal transfer."
    ],
    legacyNames: [
      "actionRefresh",
      "walletWithdrawal"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalMoneySendIcon.tsx",
    meaning: "Withdrawal, outgoing funds, payout request, or send-money transaction",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "MoneySend",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "warning",
      "danger"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.warning",
      size: "size.icon.md"
    },
    toneTokens: [
      "amber",
      "danger",
      "text"
    ],
    usage: [
      "Refresh or withdraw-style cyclical action when paired with label.",
      "Withdrawal, outgoing funds, payout request, or send-money transaction.",
      "Withdrawal, outgoing funds, payout request, or send-money transaction"
    ]
  },
  "icon.wallet.transfer": {
    category: "wallet",
    defaultSize: 24,
    defaultTone: "textDim",
    forbidden: [
      "Do not use for market volatility."
    ],
    legacyNames: [
      "transferSwitch"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalArrowSwapHorizontalIcon.tsx",
    meaning: "Transfer, swap, or two-way movement between accounts",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "ArrowSwapHorizontal",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active",
      "disabled"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.info",
      size: "size.icon.md"
    },
    toneTokens: [
      "blue",
      "text",
      "brand"
    ],
    usage: [
      "Transfer, swap, or two-way movement between accounts.",
      "Transfer, swap, or two-way movement between accounts"
    ]
  },
  "icon.account.trading": {
    category: "trading_account",
    defaultSize: 24,
    defaultTone: "blue",
    forbidden: [
      "Avoid for generic profile or archive action.",
      "Do not use for personal profile, bank institution, deposit, withdrawal, archive action, or wallet balance."
    ],
    legacyNames: [
      "accountBank",
      "tradingAccount"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalWalletIcon.tsx",
    meaning: "Trading account workspace, account switcher, account list, and margin account identity",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Wallet",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active",
      "danger"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.info",
      size: "size.icon.md"
    },
    toneTokens: [
      "blue",
      "text",
      "brand"
    ],
    usage: [
      "Trading account entry points must visually match the bottom-navigation Accounts tab glyph.",
      "Trading account workspace, account switcher, account list, and margin account identity.",
      "Trading account workspace, account switcher, account list, and margin account identity"
    ]
  },
  "icon.notification.bell": {
    category: "notification",
    defaultSize: 24,
    defaultTone: "textMuted",
    forbidden: [
      "Do not use for alert risk severity; use riskWarning/riskShield."
    ],
    legacyNames: [
      "notificationBell"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalNotificationIcon.tsx",
    meaning: "Notifications entry",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Notification",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active",
      "disabled"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.secondary",
      size: "size.icon.md"
    },
    toneTokens: [
      "textMuted",
      "textDim"
    ],
    usage: [
      "Notifications entry.",
      "Notifications entry"
    ]
  },
  "icon.system.chevron_down": {
    category: "system",
    defaultSize: 24,
    defaultTone: "textDim",
    forbidden: [
      "Do not use as next navigation.",
      "Do not use shafted down arrows for dropdown controls."
    ],
    legacyNames: [
      "expandDown"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalArrowDown2Icon.tsx",
    meaning: "Dropdown or expandable control",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "ArrowDown2",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.tertiary",
      size: "size.icon.md"
    },
    toneTokens: [
      "text",
      "textDim"
    ],
    usage: [
      "Dropdown or expandable control. Use the chevron-style down arrow without a shaft for global dropdown affordances.",
      "Dropdown or expandable control"
    ]
  },
  "icon.system.back": {
    category: "system",
    defaultSize: 24,
    defaultTone: "text",
    forbidden: [
      "Do not use for previous market movement."
    ],
    legacyNames: [
      "navigateBack"
    ],
    license: {
      attributionRequired: false,
      name: "custom-owned",
      url: "internal-custom-icon-request"
    },
    localAssetPath: "src/icons/local/iconsax/LocalArrowLeftLineIcon.tsx",
    meaning: "Back navigation with a horizontal shaft",
    modified: true,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "ArrowLeftLine",
    sourceLibrary: "custom",
    states: [
      "default",
      "active",
      "disabled"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.primary",
      size: "size.icon.md"
    },
    toneTokens: [
      "text",
      "textMuted"
    ],
    usage: [
      "Back navigation with a horizontal shaft for app headers.",
      "Back navigation"
    ]
  },
  "icon.system.chevron_right": {
    category: "system",
    defaultSize: 24,
    defaultTone: "textDim",
    forbidden: [
      "Do not use for market up/down state."
    ],
    legacyNames: [
      "navigateNext"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalArrowRight2Icon.tsx",
    meaning: "Next row navigation and disclosure",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "ArrowRight2",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active",
      "disabled"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.tertiary",
      size: "size.icon.md"
    },
    toneTokens: [
      "text",
      "textDim",
      "panel"
    ],
    usage: [
      "Next row navigation and disclosure.",
      "Next row navigation and disclosure"
    ]
  },
  "icon.trading.market": {
    category: "trading",
    defaultSize: 24,
    defaultTone: "textDim",
    forbidden: [
      "Use up/down tones only when representing market direction."
    ],
    legacyNames: [
      "marketTrend"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalChartSquareIcon.tsx",
    meaning: "Market trend, quote movement, chart entry, or trading direction",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "ChartSquare",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active",
      "success",
      "danger"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.active",
      size: "size.icon.md"
    },
    toneTokens: [
      "brand",
      "up",
      "down",
      "text",
      "textDim"
    ],
    usage: [
      "Market trend, quote movement, trading volume, or position direction.",
      "Market trend, quote movement, chart entry, or trading direction"
    ]
  },
  "icon.notification.feedback": {
    category: "notification",
    defaultSize: 24,
    defaultTone: "brand",
    forbidden: [
      "Do not use for community group."
    ],
    legacyNames: [
      "chatFeedback"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalMessageIcon.tsx",
    meaning: "Feedback or single conversation entry",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Message",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.active",
      size: "size.icon.md"
    },
    toneTokens: [
      "brand",
      "textMuted"
    ],
    usage: [
      "Feedback or single conversation entry.",
      "Feedback or single conversation entry"
    ]
  },
  "icon.copy.community": {
    category: "copy_trading",
    defaultSize: 24,
    defaultTone: "textMuted",
    forbidden: [
      "Do not use for individual support ticket."
    ],
    legacyNames: [
      "communityChat"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalPeopleIcon.tsx",
    meaning: "Community, group chat, or social trading discussions",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "People",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.secondary",
      size: "size.icon.md"
    },
    toneTokens: [
      "textMuted",
      "down",
      "brand"
    ],
    usage: [
      "Community, group chat, or social trading discussions.",
      "Community, group chat, or social trading discussions"
    ]
  },
  "icon.status.check": {
    category: "status",
    defaultSize: 24,
    defaultTone: "textMuted",
    forbidden: [
      "Do not use as full verification badge."
    ],
    legacyNames: [
      "checkMark"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalTickIcon.tsx",
    meaning: "Plain check mark for checkbox, single-select, or compact selected indicator",
    modified: true,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Tick",
    sourceLibrary: "custom",
    states: [
      "default",
      "success"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.active",
      size: "size.icon.md"
    },
    toneTokens: [
      "panel",
      "white",
      "brand",
      "down"
    ],
    usage: [
      "Single-select selected indicator, checkbox selected indicator, or compact selected state.",
      "Use this plain check mark instead of radio dots or circled check icons when a row selection already has a selected container state."
    ]
  },
  "icon.status.verified": {
    category: "status",
    defaultSize: 24,
    defaultTone: "brand",
    forbidden: [
      "Do not use for generic checkbox when checkMark is enough."
    ],
    legacyNames: [
      "statusVerified"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalVerifyIcon.tsx",
    meaning: "Verified state, selected account, completed status",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Verify",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "success",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.active",
      size: "size.icon.md"
    },
    toneTokens: [
      "brand",
      "down",
      "text"
    ],
    usage: [
      "Verified state, selected account, completed status.",
      "Verified state, selected account, completed status"
    ]
  },
  "icon.trading.history": {
    category: "trading",
    defaultSize: 24,
    defaultTone: "text",
    forbidden: [
      "Do not use for countdown risk unless paired with warning tone."
    ],
    legacyNames: [
      "historyClock"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalClockIcon.tsx",
    meaning: "Order history, transaction history, pending activity, or time filter",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Clock",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "warning"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.primary",
      size: "size.icon.md"
    },
    toneTokens: [
      "text",
      "textDim",
      "amber"
    ],
    usage: [
      "Order history, pending review, recent activity, time filter.",
      "Order history, transaction history, pending activity, or time filter"
    ]
  },
  "icon.navigation.discover": {
    category: "navigation",
    defaultSize: 24,
    defaultTone: "brand",
    forbidden: [
      "Do not use for location."
    ],
    legacyNames: [
      "discoverCompass"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalDiscoverIcon.tsx",
    meaning: "Discover and module exploration entry",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Discover",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.active",
      size: "size.icon.md"
    },
    toneTokens: [
      "brand",
      "textDim"
    ],
    usage: [
      "Discover and module exploration entry.",
      "Discover and module exploration entry"
    ]
  },
  "icon.system.more": {
    category: "system",
    defaultSize: 24,
    defaultTone: "textMuted",
    forbidden: [
      "Do not use for loading."
    ],
    legacyNames: [
      "moreDots"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalMoreIcon.tsx",
    meaning: "More actions menu",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "More",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.secondary",
      size: "size.icon.md"
    },
    toneTokens: [
      "text",
      "textMuted"
    ],
    usage: [
      "More actions menu.",
      "More actions menu"
    ]
  },
  "icon.notification.email": {
    category: "notification",
    defaultSize: 24,
    defaultTone: "brand",
    forbidden: [
      "Do not use for app notifications."
    ],
    legacyNames: [
      "emailMessage"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalSmsIcon.tsx",
    meaning: "Email, inbox, password recovery",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Sms",
    sourceLibrary: "iconsax",
    states: [
      "default"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.active",
      size: "size.icon.md"
    },
    toneTokens: [
      "brand",
      "textMuted"
    ],
    usage: [
      "Email, inbox, password recovery.",
      "Email, inbox, password recovery"
    ]
  },
  "icon.account.phone_verified": {
    category: "account",
    defaultSize: 24,
    defaultTone: "brand",
    forbidden: [
      "Do not use for voice support or customer service headset."
    ],
    legacyNames: [
      "phoneVerified"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalMobileIcon.tsx",
    meaning: "Phone number entry, SMS verification, and confirmed phone contact",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Mobile",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "success"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.active",
      size: "size.icon.md"
    },
    toneTokens: [
      "brand",
      "textMuted",
      "down"
    ],
    usage: [
      "Phone number entry, SMS verification, and confirmed phone contact.",
      "Phone number entry, SMS verification, and confirmed phone contact"
    ]
  },
  "icon.promotion.reward": {
    category: "promotion",
    defaultSize: 24,
    defaultTone: "amber",
    forbidden: [
      "Do not use for trading ticket or coupon unless promo-specific."
    ],
    legacyNames: [
      "rewardGift"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalGiftIcon.tsx",
    meaning: "Rewards, bonus, promotional gift",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Gift",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.warning",
      size: "size.icon.md"
    },
    toneTokens: [
      "amber",
      "brand"
    ],
    usage: [
      "Rewards, bonus, promotional gift.",
      "Rewards, bonus, promotional gift"
    ]
  },
  "icon.market.global": {
    category: "trading",
    defaultSize: 24,
    defaultTone: "brand",
    forbidden: [
      "Do not use for account identity."
    ],
    legacyNames: [
      "globalMarket"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalGlobalIcon.tsx",
    meaning: "Global market, language, regional onboarding",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Global",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.active",
      size: "size.icon.md"
    },
    toneTokens: [
      "brand",
      "panel"
    ],
    usage: [
      "Global market, language, regional onboarding.",
      "Global market, language, regional onboarding"
    ]
  },
  "icon.education.academy": {
    category: "education",
    defaultSize: 24,
    defaultTone: "brand",
    forbidden: [
      "Do not use for KYC completion."
    ],
    legacyNames: [
      "educationCap"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalTeacherIcon.tsx",
    meaning: "Education, academy, trading lessons",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Teacher",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "success"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.active",
      size: "size.icon.md"
    },
    toneTokens: [
      "brand",
      "textDim"
    ],
    usage: [
      "Education, academy, trading lessons.",
      "Education, academy, trading lessons"
    ]
  },
  "icon.support.headset": {
    category: "support",
    defaultSize: 24,
    defaultTone: "textMuted",
    forbidden: [
      "Do not use for audio/media."
    ],
    legacyNames: [
      "supportHeadset"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalHeadphoneIcon.tsx",
    meaning: "Support center or service contact",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Headphone",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.secondary",
      size: "size.icon.md"
    },
    toneTokens: [
      "textMuted",
      "brand"
    ],
    usage: [
      "Support center or service contact.",
      "Support center or service contact"
    ]
  },
  "icon.kyc.identity": {
    category: "kyc_compliance",
    defaultSize: 24,
    defaultTone: "brand",
    forbidden: [
      "Do not use for generic account tab."
    ],
    legacyNames: [
      "identityCard"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalPersonalcardIcon.tsx",
    meaning: "Identity verification, onboarding KYC, profile document",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Personalcard",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "warning",
      "success"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.active",
      size: "size.icon.md"
    },
    toneTokens: [
      "down",
      "brand",
      "text"
    ],
    usage: [
      "Identity verification, onboarding KYC, profile document.",
      "Identity verification, onboarding KYC, profile document"
    ]
  },
  "icon.risk.info": {
    category: "status",
    defaultSize: 24,
    defaultTone: "textMuted",
    forbidden: [
      "Do not use as success status."
    ],
    legacyNames: [
      "infoCircle"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalInfoCircleIcon.tsx",
    meaning: "Inline help, disclosure, risk explanation",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "InfoCircle",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "warning",
      "danger"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.secondary",
      size: "size.icon.md"
    },
    toneTokens: [
      "textMuted",
      "blue",
      "danger"
    ],
    usage: [
      "Inline help, disclosure, risk explanation.",
      "Inline help, disclosure, risk explanation"
    ]
  },
  "icon.market.watchlist": {
    category: "trading",
    defaultSize: 24,
    defaultTone: "text",
    forbidden: [
      "Do not use for task checklist."
    ],
    legacyNames: [
      "quoteList"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalBookSavedIcon.tsx",
    meaning: "Watchlist, quote list, list view",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "BookSaved",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.primary",
      size: "size.icon.md"
    },
    toneTokens: [
      "text",
      "textDim"
    ],
    usage: [
      "Watchlist, quote list, list view.",
      "Watchlist, quote list, list view"
    ]
  },
  "icon.trading.order": {
    category: "trading",
    defaultSize: 24,
    defaultTone: "brand",
    forbidden: [
      "Do not use for plain market quote list.",
      "Do not use for task checklist or KYC checklist."
    ],
    legacyNames: [
      "taskChecklist",
      "orderList"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalClipboardTickIcon.tsx",
    meaning: "Order list, open orders, and order-based position grouping",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "ClipboardTick",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.active",
      size: "size.icon.md"
    },
    toneTokens: [
      "brand",
      "text",
      "textDim"
    ],
    usage: [
      "Orders, trading journal, task checklist, execution list.",
      "Order list, open orders, and order-based position grouping.",
      "Order list, open orders, and order-based position grouping"
    ]
  },
  "icon.security.lock": {
    category: "security",
    defaultSize: 24,
    defaultTone: "textDim",
    forbidden: [
      "Do not use for regulatory review."
    ],
    legacyNames: [
      "secureLock"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalLockIcon.tsx",
    meaning: "Password, locked field, protected content",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Lock",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "danger",
      "success",
      "disabled"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.tertiary",
      size: "size.icon.md"
    },
    toneTokens: [
      "textDim",
      "brand"
    ],
    usage: [
      "Password, locked field, protected content.",
      "Password, locked field, protected content"
    ]
  },
  "icon.security.password_rules": {
    category: "security",
    defaultSize: 24,
    defaultTone: "brand",
    forbidden: [
      "Do not use for PIN keypad or account lock."
    ],
    legacyNames: [
      "passwordRules"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalPasswordCheckIcon.tsx",
    meaning: "Password rule validation and credential setup guidance",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "PasswordCheck",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "warning",
      "success"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.active",
      size: "size.icon.md"
    },
    toneTokens: [
      "textDim",
      "brand",
      "down"
    ],
    usage: [
      "Password rule validation and credential setup guidance.",
      "Password rule validation and credential setup guidance"
    ]
  },
  "icon.security.key_access": {
    category: "security",
    defaultSize: 24,
    defaultTone: "brand",
    forbidden: [
      "Do not use for password visibility toggle."
    ],
    legacyNames: [
      "keyAccess"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalKeyIcon.tsx",
    meaning: "PIN setup, unlock, or access-key semantics",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Key",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "success"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.active",
      size: "size.icon.md"
    },
    toneTokens: [
      "brand",
      "textDim"
    ],
    usage: [
      "PIN setup, unlock, or access-key semantics.",
      "PIN setup, unlock, or access-key semantics"
    ]
  },
  "icon.system.keyboard_digits": {
    category: "system",
    defaultSize: 24,
    defaultTone: "textDim",
    forbidden: [
      "Do not use for text search or trading keyboard shortcuts."
    ],
    legacyNames: [
      "keyboardDigits"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalKeyboardIcon.tsx",
    meaning: "Numeric keyboard, OTP input, or PIN keypad hint",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Keyboard",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.tertiary",
      size: "size.icon.md"
    },
    toneTokens: [
      "textDim",
      "brand"
    ],
    usage: [
      "Numeric keyboard, OTP input, or PIN keypad hint.",
      "Numeric keyboard, OTP input, or PIN keypad hint"
    ]
  },
  "icon.system.password_visible": {
    category: "system",
    defaultSize: 24,
    defaultTone: "textDim",
    forbidden: [
      "Do not use for market watchlist visibility."
    ],
    legacyNames: [
      "showPassword"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalEyeIcon.tsx",
    meaning: "Toggle password visibility in credential fields",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Eye",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.tertiary",
      size: "size.icon.md"
    },
    toneTokens: [
      "textDim",
      "text"
    ],
    usage: [
      "Toggle password visibility in credential fields.",
      "Toggle password visibility in credential fields"
    ]
  },
  "icon.system.password_hidden": {
    category: "system",
    defaultSize: 24,
    defaultTone: "textDim",
    forbidden: [
      "Do not use for market watchlist visibility.",
      "Do not use as a hidden-state placeholder outside credential fields."
    ],
    legacyNames: [
      "hidePassword"
    ],
    license: {
      attributionRequired: false,
      name: "custom-owned",
      url: "internal-custom-icon-request"
    },
    localAssetPath: "src/icons/local/iconsax/LocalEyeSlashIcon.tsx",
    meaning: "Toggle password hidden state in credential fields",
    modified: true,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "EyeSlash",
    sourceLibrary: "custom",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.tertiary",
      size: "size.icon.md"
    },
    toneTokens: [
      "textDim",
      "text"
    ],
    usage: [
      "Toggle password hidden state in credential fields.",
      "Use when the password is currently visible and the next action will hide it."
    ]
  },
  "icon.system.search": {
    category: "system",
    defaultSize: 24,
    defaultTone: "text",
    forbidden: [
      "Do not use for inspect/detail navigation."
    ],
    legacyNames: [
      "searchGlass"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalSearchNormalIcon.tsx",
    meaning: "Search entry and field prefix",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "SearchNormal",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active",
      "disabled"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.primary",
      size: "size.icon.md"
    },
    toneTokens: [
      "text",
      "textDim"
    ],
    usage: [
      "Search entry and field prefix.",
      "Search entry and field prefix"
    ]
  },
  "icon.wallet.deposit": {
    category: "wallet",
    defaultSize: 24,
    defaultTone: "down",
    forbidden: [
      "Do not use for generic code/coupon.",
      "Do not use for account balance, wallet overview, or transfer between accounts."
    ],
    legacyNames: [
      "qrCode",
      "walletDeposit"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalMoneyReciveIcon.tsx",
    meaning: "Deposit, incoming funds, successful credit, or receive-money transaction",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "MoneyRecive",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "success",
      "warning"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.success",
      size: "size.icon.md"
    },
    toneTokens: [
      "down",
      "brand",
      "text"
    ],
    usage: [
      "Deposit QR, account QR, scan code.",
      "Deposit, incoming funds, successful credit, or receive-money transaction.",
      "Deposit, incoming funds, successful credit, or receive-money transaction"
    ]
  },
  "icon.ib.network": {
    category: "ib_partner",
    defaultSize: 24,
    defaultTone: "brand",
    forbidden: [
      "Do not use for transfer funds."
    ],
    legacyNames: [
      "partnerNetwork"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalShareIcon.tsx",
    meaning: "Partner network, sharing, referral graph",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Share",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.active",
      size: "size.icon.md"
    },
    toneTokens: [
      "brand",
      "blue",
      "text"
    ],
    usage: [
      "Partner network, sharing, referral graph.",
      "Partner network, sharing, referral graph"
    ]
  },
  "icon.security.risk_shield": {
    category: "security",
    defaultSize: 24,
    defaultTone: "brand",
    forbidden: [
      "Do not use as generic success when statusVerified is clearer."
    ],
    legacyNames: [
      "riskShield"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalShieldTickIcon.tsx",
    meaning: "Security, fraud prevention, compliance protection",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "ShieldTick",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "success",
      "warning"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.active",
      size: "size.icon.md"
    },
    toneTokens: [
      "brand",
      "down",
      "textMuted"
    ],
    usage: [
      "Security, fraud prevention, compliance protection.",
      "Security, fraud prevention, compliance protection"
    ]
  },
  "icon.system.settings": {
    category: "system",
    defaultSize: 24,
    defaultTone: "textDim",
    forbidden: [
      "Do not use for market depth."
    ],
    legacyNames: [
      "settingsSliders"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalSetting2Icon.tsx",
    meaning: "Settings, filters, product controls, sort",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Setting2",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.tertiary",
      size: "size.icon.md"
    },
    toneTokens: [
      "brand",
      "textDim"
    ],
    usage: [
      "Settings, filters, product controls, sort.",
      "Settings, filters, product controls, sort"
    ]
  },
  "icon.promotion.ticket": {
    category: "promotion",
    defaultSize: 24,
    defaultTone: "amber",
    forbidden: [
      "Do not use for trading order ticket; use icon.trading.order."
    ],
    legacyNames: [
      "promoTicket"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalTicketIcon.tsx",
    meaning: "Coupon, promotion, simulated contest badge",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Ticket",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.warning",
      size: "size.icon.md"
    },
    toneTokens: [
      "amber",
      "textDim"
    ],
    usage: [
      "Coupon, promotion, simulated contest badge.",
      "Coupon, promotion, simulated contest badge"
    ]
  },
  "icon.promotion.achievement": {
    category: "promotion",
    defaultSize: 24,
    defaultTone: "amber",
    forbidden: [
      "Do not use for account status."
    ],
    legacyNames: [
      "achievementTrophy"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalAwardIcon.tsx",
    meaning: "Challenge, leaderboard, achievement",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Award",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.warning",
      size: "size.icon.md"
    },
    toneTokens: [
      "amber",
      "textDim"
    ],
    usage: [
      "Challenge, leaderboard, achievement.",
      "Challenge, leaderboard, achievement"
    ]
  },
  "icon.account.user": {
    category: "account",
    defaultSize: 24,
    defaultTone: "text",
    forbidden: [
      "Do not use for bank/funding account."
    ],
    legacyNames: [
      "userProfile"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalProfileIcon.tsx",
    meaning: "User, client, account owner, profile preview",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Profile",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.primary",
      size: "size.icon.md"
    },
    toneTokens: [
      "text",
      "blue"
    ],
    usage: [
      "User, client, account owner, profile preview.",
      "User, client, account owner, profile preview"
    ]
  },
  "icon.account.avatar": {
    category: "account",
    defaultSize: 24,
    defaultTone: "text",
    forbidden: [
      "Do not use for add-account action."
    ],
    legacyNames: [
      "userAvatar"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalProfileCircleIcon.tsx",
    meaning: "Profile avatar placeholder and profile module",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "ProfileCircle",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.primary",
      size: "size.icon.md"
    },
    toneTokens: [
      "text",
      "textMuted"
    ],
    usage: [
      "Profile avatar placeholder and profile module.",
      "Profile avatar placeholder and profile module"
    ]
  },
  "icon.account.add_user": {
    category: "account",
    defaultSize: 24,
    defaultTone: "text",
    forbidden: [
      "Do not use for KYC verification."
    ],
    legacyNames: [
      "addUser"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalProfileAddIcon.tsx",
    meaning: "Add account, add client, invite user",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "ProfileAdd",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.primary",
      size: "size.icon.md"
    },
    toneTokens: [
      "text",
      "brand"
    ],
    usage: [
      "Add account, add client, invite user.",
      "Add account, add client, invite user"
    ]
  },
  "icon.system.close": {
    category: "system",
    defaultSize: 24,
    defaultTone: "textDim",
    forbidden: [
      "Do not use as failed status without label."
    ],
    legacyNames: [
      "closeX"
    ],
    license: {
      attributionRequired: false,
      name: "custom-owned",
      url: "internal-custom-icon-request"
    },
    localAssetPath: "src/icons/local/iconsax/LocalCloseIcon.tsx",
    meaning: "Close, cancel, or dismiss action",
    modified: true,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Close",
    sourceLibrary: "custom",
    states: [
      "default",
      "active",
      "danger"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.tertiary",
      size: "size.icon.md"
    },
    toneTokens: [
      "textDim",
      "danger",
      "panel"
    ],
    usage: [
      "Close, cancel, or dismiss action without status container semantics.",
      "Close, cancel, or dismiss action"
    ]
  },
  "icon.wallet.balance": {
    category: "wallet",
    defaultSize: 24,
    defaultTone: "blue",
    forbidden: [
      "Do not use for bank institution, deposit action, or archive action."
    ],
    legacyNames: [
      "accountBalance"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalWalletIcon.tsx",
    meaning: "Account balance, available funds, equity snapshot, and wallet balance detail",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Wallet",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.info",
      size: "size.icon.md"
    },
    toneTokens: [
      "blue",
      "text",
      "brand"
    ],
    usage: [
      "Account balance, available funds, equity snapshot, and wallet balance detail.",
      "Account balance, available funds, equity snapshot, and wallet balance detail"
    ]
  },
  "icon.account.archive": {
    category: "account",
    defaultSize: 24,
    defaultTone: "text",
    forbidden: [
      "Do not use for wallet, balance, delete, or download."
    ],
    legacyNames: [
      "archiveAccount"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalArchiveIcon.tsx",
    meaning: "Archive or hide a trading account from active lists",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Archive",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.primary",
      size: "size.icon.md"
    },
    toneTokens: [
      "text",
      "textDim"
    ],
    usage: [
      "Archive or hide a trading account from active lists.",
      "Archive or hide a trading account from active lists"
    ]
  },
  "icon.system.delete": {
    category: "system",
    defaultSize: 24,
    defaultTone: "danger",
    forbidden: [
      "Do not use for modal close or temporary dismiss."
    ],
    legacyNames: [
      "destructiveDelete"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalTrashIcon.tsx",
    meaning: "Delete, remove, or irreversible destructive action",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Trash",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "danger"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.danger",
      size: "size.icon.md"
    },
    toneTokens: [
      "danger",
      "text"
    ],
    usage: [
      "Delete, remove, or irreversible destructive action.",
      "Delete, remove, or irreversible destructive action"
    ]
  },
  "icon.system.logout": {
    category: "system",
    defaultSize: 24,
    defaultTone: "danger",
    forbidden: [
      "Do not use for deleting account data or closing a modal."
    ],
    legacyNames: [
      "logoutSession"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalLogoutIcon.tsx",
    meaning: "Log out of the current session while preserving remembered account identity",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Logout",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "danger"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.danger",
      size: "size.icon.md"
    },
    toneTokens: [
      "danger",
      "textDim",
      "text"
    ],
    usage: [
      "Log out of the current session while preserving remembered account identity.",
      "Log out of the current session while preserving remembered account identity"
    ]
  },
  "icon.trading.order_ticket": {
    category: "trading",
    defaultSize: 24,
    defaultTone: "brand",
    forbidden: [
      "Do not use for market watchlist or transaction history."
    ],
    legacyNames: [
      "tradeTicket"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalReceiptTextIcon.tsx",
    meaning: "Trade ticket, market order entry, and order creation flow",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "ReceiptText",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.active",
      size: "size.icon.md"
    },
    toneTokens: [
      "brand",
      "up",
      "down",
      "text"
    ],
    usage: [
      "Trade ticket, market order entry, and order creation flow.",
      "Trade ticket, market order entry, and order creation flow"
    ]
  },
  "icon.trading.group_by_symbol": {
    category: "trading",
    defaultSize: 24,
    defaultTone: "textDim",
    forbidden: [
      "Do not use for QR code, scan, or payment address."
    ],
    legacyNames: [
      "groupBySymbol"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalSortIcon.tsx",
    meaning: "Sort or group positions by trading symbol",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Sort",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.tertiary",
      size: "size.icon.md"
    },
    toneTokens: [
      "text",
      "textDim",
      "brand"
    ],
    usage: [
      "Sort or group positions by trading symbol.",
      "Sort or group positions by trading symbol"
    ]
  },
  "icon.trading.close_position": {
    category: "trading",
    defaultSize: 24,
    defaultTone: "danger",
    forbidden: [
      "Do not use for modal close; use icon.system.close for dismissal."
    ],
    legacyNames: [
      "closePosition"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalCloseSquareIcon.tsx",
    meaning: "Close all positions or cancel an active trading exposure",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "CloseSquare",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "danger"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.danger",
      size: "size.icon.md"
    },
    toneTokens: [
      "danger",
      "textDim"
    ],
    usage: [
      "Close all positions or cancel an active trading exposure.",
      "Close all positions or cancel an active trading exposure"
    ]
  },
  "icon.trading.close_losing_position": {
    category: "trading",
    defaultSize: 24,
    defaultTone: "danger",
    forbidden: [
      "Do not use for successful verification or completed status."
    ],
    legacyNames: [
      "closeLosingPosition"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalTrendDownIcon.tsx",
    meaning: "Close losing positions, stop-loss related action, or downside exposure reduction",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "TrendDown",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "danger"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.danger",
      size: "size.icon.md"
    },
    toneTokens: [
      "danger",
      "amber"
    ],
    usage: [
      "Close losing positions, stop-loss related action, or downside exposure reduction.",
      "Close losing positions, stop-loss related action, or downside exposure reduction"
    ]
  },
  "icon.trading.buy": {
    category: "trading",
    defaultSize: 24,
    defaultTone: "down",
    forbidden: [
      "Do not use for generic market trend without an actual buy direction."
    ],
    legacyNames: [
      "tradeBuy"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalTrendUpIcon.tsx",
    meaning: "Buy direction marker in positions and order details",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "TrendUp",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active",
      "success"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.success",
      size: "size.icon.md"
    },
    toneTokens: [
      "down",
      "brand"
    ],
    usage: [
      "Buy direction marker in positions and order details.",
      "Buy direction marker in positions and order details"
    ]
  },
  "icon.trading.sell": {
    category: "trading",
    defaultSize: 24,
    defaultTone: "up",
    forbidden: [
      "Do not use for generic market trend without an actual sell direction."
    ],
    legacyNames: [
      "tradeSell"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalTrendDownIcon.tsx",
    meaning: "Sell direction marker in positions and order details",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "TrendDown",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active",
      "danger"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.danger",
      size: "size.icon.md"
    },
    toneTokens: [
      "up",
      "danger"
    ],
    usage: [
      "Sell direction marker in positions and order details.",
      "Sell direction marker in positions and order details"
    ]
  },
  "icon.status.rejected": {
    category: "status",
    defaultSize: 24,
    defaultTone: "danger",
    forbidden: [
      "Do not use for user-close or dismiss actions."
    ],
    legacyNames: [
      "statusRejected"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalDangerIcon.tsx",
    meaning: "Rejected, failed, or blocked status in financial workflows",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Danger",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "danger"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.danger",
      size: "size.icon.md"
    },
    toneTokens: [
      "danger",
      "textDim"
    ],
    usage: [
      "Rejected, failed, or blocked status in financial workflows.",
      "Rejected, failed, or blocked status in financial workflows"
    ]
  },
  "icon.feedback.rating": {
    category: "support",
    defaultSize: 24,
    defaultTone: "amber",
    forbidden: [
      "Do not use for challenge award, promotion, or verified status."
    ],
    legacyNames: [
      "appRating"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalStarIcon.tsx",
    meaning: "App rating or satisfaction scoring entry",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Star",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.warning",
      size: "size.icon.md"
    },
    toneTokens: [
      "amber",
      "textDim"
    ],
    usage: [
      "App rating or satisfaction scoring entry.",
      "App rating or satisfaction scoring entry"
    ]
  },
  "icon.support.help_center": {
    category: "support",
    defaultSize: 24,
    defaultTone: "textMuted",
    forbidden: [
      "Do not use for regulatory disclosure; use icon.risk.info."
    ],
    legacyNames: [
      "helpCenter"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalMessageQuestionIcon.tsx",
    meaning: "Help center, FAQ, and guided assistance",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "MessageQuestion",
    sourceLibrary: "iconsax",
    states: [
      "default"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.secondary",
      size: "size.icon.md"
    },
    toneTokens: [
      "textMuted",
      "brand"
    ],
    usage: [
      "Help center, FAQ, and guided assistance.",
      "Help center, FAQ, and guided assistance"
    ]
  },
  "icon.support.about": {
    category: "support",
    defaultSize: 24,
    defaultTone: "textMuted",
    forbidden: [
      "Do not use for risk warning or inline disclosure."
    ],
    legacyNames: [
      "aboutApp"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalInformationIcon.tsx",
    meaning: "About app, product information, and company information entry",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Information",
    sourceLibrary: "iconsax",
    states: [
      "default"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.secondary",
      size: "size.icon.md"
    },
    toneTokens: [
      "textMuted",
      "brand"
    ],
    usage: [
      "About app, product information, and company information entry.",
      "About app, product information, and company information entry"
    ]
  },
  "icon.navigation.function_center": {
    category: "navigation",
    defaultSize: 24,
    defaultTone: "brand",
    forbidden: [
      "Do not use for trading orders or task checklist."
    ],
    legacyNames: [
      "functionCenter"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalElement4Icon.tsx",
    meaning: "Function center, app module dashboard, or shortcut hub",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Element4",
    sourceLibrary: "iconsax",
    states: [
      "default",
      "active"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.active",
      size: "size.icon.md"
    },
    toneTokens: [
      "brand",
      "textDim"
    ],
    usage: [
      "Function center, app module dashboard, or shortcut hub.",
      "Function center, app module dashboard, or shortcut hub"
    ]
  },
  "icon.trading.volume": {
    category: "trading",
    defaultSize: 24,
    defaultTone: "brand",
    forbidden: [
      "Do not use for price trend or market direction."
    ],
    legacyNames: [
      "tradeVolume"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalChartSquareIcon.tsx",
    meaning: "Trading volume, analytics volume metric, and aggregated activity size",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "ChartSquare",
    sourceLibrary: "iconsax",
    states: [
      "default"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.active",
      size: "size.icon.md"
    },
    toneTokens: [
      "brand",
      "text",
      "textDim"
    ],
    usage: [
      "Trading volume, analytics volume metric, and aggregated activity size.",
      "Trading volume, analytics volume metric, and aggregated activity size"
    ]
  },
  "icon.market.gold": {
    category: "trading",
    defaultSize: 24,
    defaultTone: "amber",
    forbidden: [
      "Do not use for deposit, reward, or balance."
    ],
    legacyNames: [
      "goldCommodity"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalCoinIcon.tsx",
    meaning: "Gold, metals, and commodity instrument visual",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Coin",
    sourceLibrary: "iconsax",
    states: [
      "default"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.warning",
      size: "size.icon.md"
    },
    toneTokens: [
      "amber",
      "brand"
    ],
    usage: [
      "Gold, metals, and commodity instrument visual.",
      "Gold, metals, and commodity instrument visual"
    ]
  },
  "icon.market.index": {
    category: "trading",
    defaultSize: 24,
    defaultTone: "blue",
    forbidden: [
      "Do not use for account analytics or volume metric."
    ],
    legacyNames: [
      "indexMarket"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalChartIcon.tsx",
    meaning: "Index, futures, and benchmark market instrument visual",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Chart",
    sourceLibrary: "iconsax",
    states: [
      "default"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.info",
      size: "size.icon.md"
    },
    toneTokens: [
      "blue",
      "brand",
      "text"
    ],
    usage: [
      "Index, futures, and benchmark market instrument visual.",
      "Index, futures, and benchmark market instrument visual"
    ]
  },
  "icon.market.stock": {
    category: "trading",
    defaultSize: 24,
    defaultTone: "text",
    forbidden: [
      "Do not use proprietary company logos as functional instrument icons."
    ],
    legacyNames: [
      "stockAsset"
    ],
    license: {
      attributionRequired: false,
      name: "MIT",
      url: "https://github.com/rendinjast/iconsax-react/blob/master/LICENSE"
    },
    localAssetPath: "src/icons/local/iconsax/LocalChart21Icon.tsx",
    meaning: "Stock and equity instrument visual without brand-logo copying",
    modified: false,
    platforms: [
      "app",
      "h5",
      "web"
    ],
    sizes: [
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      64
    ],
    sourceIconName: "Chart21",
    sourceLibrary: "iconsax",
    states: [
      "default"
    ],
    status: "approved",
    style: {
      default: "line",
      active: "fill",
      disabled: "line"
    },
    tokenBinding: {
      color: "color.icon.primary",
      size: "size.icon.md"
    },
    toneTokens: [
      "text",
      "brand",
      "blue"
    ],
    usage: [
      "Stock and equity instrument visual without brand-logo copying.",
      "Stock and equity instrument visual without brand-logo copying"
    ]
  }
} as const satisfies Record<string, AppIconDefinition>;

export const legacyIconNameMap = {
  "appApple": "icon.brand.apple",
  "actionRefresh": "icon.wallet.withdrawal",
  "transferSwitch": "icon.wallet.transfer",
  "accountBank": "icon.account.trading",
  "notificationBell": "icon.notification.bell",
  "expandDown": "icon.system.chevron_down",
  "navigateBack": "icon.system.back",
  "navigateNext": "icon.system.chevron_right",
  "marketTrend": "icon.trading.market",
  "chatFeedback": "icon.notification.feedback",
  "communityChat": "icon.copy.community",
  "checkMark": "icon.status.check",
  "statusVerified": "icon.status.verified",
  "historyClock": "icon.trading.history",
  "discoverCompass": "icon.navigation.discover",
  "moreDots": "icon.system.more",
  "emailMessage": "icon.notification.email",
  "phoneVerified": "icon.account.phone_verified",
  "rewardGift": "icon.promotion.reward",
  "globalMarket": "icon.market.global",
  "educationCap": "icon.education.academy",
  "supportHeadset": "icon.support.headset",
  "identityCard": "icon.kyc.identity",
  "quoteList": "icon.market.watchlist",
  "taskChecklist": "icon.trading.order",
  "secureLock": "icon.security.lock",
  "passwordRules": "icon.security.password_rules",
  "keyAccess": "icon.security.key_access",
  "keyboardDigits": "icon.system.keyboard_digits",
  "showPassword": "icon.system.password_visible",
  "hidePassword": "icon.system.password_hidden",
  "searchGlass": "icon.system.search",
  "qrCode": "icon.wallet.deposit",
  "partnerNetwork": "icon.ib.network",
  "riskShield": "icon.security.risk_shield",
  "settingsSliders": "icon.system.settings",
  "promoTicket": "icon.promotion.ticket",
  "achievementTrophy": "icon.promotion.achievement",
  "userProfile": "icon.account.user",
  "userAvatar": "icon.account.avatar",
  "addUser": "icon.account.add_user",
  "walletDeposit": "icon.wallet.deposit",
  "walletWithdrawal": "icon.wallet.withdrawal",
  "accountBalance": "icon.wallet.balance",
  "tradingAccount": "icon.account.trading",
  "archiveAccount": "icon.account.archive",
  "destructiveDelete": "icon.system.delete",
  "logoutSession": "icon.system.logout",
  "tradeTicket": "icon.trading.order_ticket",
  "orderList": "icon.trading.order",
  "groupBySymbol": "icon.trading.group_by_symbol",
  "closePosition": "icon.trading.close_position",
  "closeLosingPosition": "icon.trading.close_losing_position",
  "tradeBuy": "icon.trading.buy",
  "tradeSell": "icon.trading.sell",
  "statusRejected": "icon.status.rejected",
  "appRating": "icon.feedback.rating",
  "helpCenter": "icon.support.help_center",
  "aboutApp": "icon.support.about",
  "functionCenter": "icon.navigation.function_center",
  "tradeVolume": "icon.trading.volume",
  "goldCommodity": "icon.market.gold",
  "indexMarket": "icon.market.index",
  "stockAsset": "icon.market.stock",
  "infoCircle": "icon.risk.info",
  "closeX": "icon.system.close"
} as const;

export type AppIconName = keyof typeof iconRegistry;
export type LegacyAppIconName = keyof typeof legacyIconNameMap;

export function isAppIconName(name: string): name is AppIconName {
  return name in iconRegistry;
}

export function resolveIconName(name: AppIconName | LegacyAppIconName): AppIconName {
  return (name in iconRegistry ? name : legacyIconNameMap[name as LegacyAppIconName]) as AppIconName;
}

export function resolveIconTone(colors: ThemeColors, tone: IconTone | string): string {
  switch (tone) {
    case 'danger':
      return colors.icon.danger;
    case 'disabled':
      return colors.icon.disabled;
    case 'down':
    case 'success':
      return colors.icon.success;
    case 'inverse':
    case 'panel':
    case 'white':
      return colors.icon.inverse;
    case 'up':
      return colors.icon.danger;
    case 'amber':
    case 'warning':
      return colors.icon.warning;
    case 'blue':
    case 'info':
      return colors.icon.info;
    case 'brand':
    case 'cyan':
    case 'primary':
    case 'text':
      return colors.icon.primary;
    case 'tertiary':
    case 'textDim':
    case 'textMuted':
      return colors.icon.tertiary;
    default:
      return tone;
  }
}
