import type { TextStyle } from 'react-native';

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  section: 48,
} as const;

export const radius = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  sheet: 24,
  full: 999,
} as const;

export const lineWidth = {
  none: 0,
  hairline: 0.5,
  default: 0.5,
  icon: {
    default: 1.5,
  },
  strong: 1,
  selected: 2,
} as const;

export const size = {
  button: {
    icon: 40,
    minHeight: 48,
    textMinTouch: 44,
  },
  control: {
    xs: 28,
    sm: 40,
    md: 48,
    lg: 56,
  },
  icon: {
    nano: 8,
    micro: 12,
    mini: 12,
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 48,
    display: 64,
    header: 24,
    fundAction: 24,
    fundActionBox: 40,
  },
  iconSurface: {
    micro: 20,
    xs: 28,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  },
  input: {
    authOtpCellHeight: 52,
    authOtpCellWidth: 44,
    badgeSm: 18,
    contentMinHeight: 46,
    countryBadge: 30,
    countryDialWidth: 52,
    countryRowMinHeight: 58,
    countrySearchMinHeight: 42,
    floatingMinHeight: 58,
    hiddenInput: 1,
    largeContentMinHeight: 54,
    largeFloatingMinHeight: 66,
    multilineContentMinHeight: 92,
    multilineMinHeight: 118,
    phoneChipMinHeight: 58,
    singleLineMinHeight: 58,
  },
  sheet: {
    handleWidth: 40,
    headerHeight: 56,
    tradeHeaderMinHeight: 76,
  },
  surface: {
    toastMinHeight: 52,
  },
  tab: {
    barHeight: 68,
    icon: 20,
    indicatorHeight: 2,
    indicatorWidth: 64,
    itemMinHeight: 44,
    pillMinHeight: 40,
    underlineMinHeight: 56,
  },
  tag: {
    barMinHeight: 6,
    chipMinHeight: 34,
    mdMinHeight: 30,
    smMinHeight: 26,
  },
  touch: {
    min: 44,
  },
  viewport: {
    appMaxWidth: 430,
    chartCompactMinHeight: 176,
    detailSideMaxWidth: 132,
    detailSideMinWidth: 104,
    launchVisualMaxHeight: 360,
    launchVisualMinHeight: 260,
    toastMaxWidth: 420,
  },
} as const;

export const layout = {
  appMaxWidth: size.viewport.appMaxWidth,
  fundActionIconBoxSize: size.icon.fundActionBox,
  fundActionIconSize: size.icon.fundAction,
  iconSurface: {
    micro: { container: size.iconSurface.micro, icon: size.icon.micro },
    xs: { container: size.iconSurface.xs, icon: size.icon.xs },
    sm: { container: size.iconSurface.sm, icon: size.icon.sm },
    md: { container: size.iconSurface.md, icon: size.icon.md },
    lg: { container: size.iconSurface.lg, icon: size.icon.lg },
    xl: { container: size.iconSurface.xl, icon: size.icon.xl },
  },
  menuDisclosureIconSize: size.icon.xs,
  screenPaddingX: spacing.lg,
  screenGap: spacing.md,
  /** Minimum visual page-end gap; Screen adds the device bottom safe-area inset. */
  screenBottomPadding: spacing.xxl,
  moduleGap: spacing.md,
  sectionGap: spacing.xl,
  sectionGapLarge: spacing.xxl,
  cardPaddingX: spacing.md,
  cardPaddingY: spacing.lg,
  cardPaddingCompactX: spacing.md,
  cardPaddingCompactY: spacing.md,
  /** @legacy Use cardPaddingX and cardPaddingY for new card implementations. */
  cardPadding: spacing.lg,
  /** @legacy Use cardPaddingCompactX and cardPaddingCompactY for compact card implementations. */
  cardPaddingCompact: spacing.md,
  bottomActionArea: {
    contentInset: 148,
    gap: spacing.sm,
    keyboardContentInset: 96,
    keyboardPaddingBottom: spacing.sm,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
    paddingX: spacing.lg,
  },
  listRowPaddingX: spacing.lg,
  listRowPaddingY: spacing.md,
  formFieldTextInset: spacing.md,
  formGroupGap: spacing.md,
  fieldGap: spacing.sm,
  inlineGap: spacing.xs,
  controlGap: spacing.sm,
  sheetContentGap: spacing.md,
  sheetFooterGap: spacing.md,
  quoteGroupGap: spacing.sm,
  dataRowGap: spacing.xs,
  headerIconButtonSize: size.button.icon,
  headerIconSize: size.icon.header,
  sheetHeaderHeight: size.sheet.headerHeight,
  sheetTradeHeaderMinHeight: size.sheet.tradeHeaderMinHeight,
  touchTargetMin: size.touch.min,
  topReservedSpace: spacing.xl,
} as const;

export const typography = {
  displayXl: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 40,
  },
  displayLg: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 40,
  },
  titleMd: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  titleSm: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
  bodyLg: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
  },
  bodyMd: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  bodySm: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  captionRegular: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
  },
  captionSm: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  microMeta: {
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
  microLabel: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  buttonMd: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  buttonLg: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
  },
  number: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
  quote: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 40,
  },
  quoteLg: {
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 50,
  },
} satisfies Record<string, TextStyle>;

export type TypographyToken = keyof typeof typography;

export const titleTypography = {
  page: typography.displayXl,
  pageCompact: typography.displayLg,
  dialog: typography.sheetTitle,
  sheet: typography.sheetTitle,
  card: typography.titleMd,
  section: typography.titleMd,
  list: typography.caption,
  listItem: typography.titleMd,
  tabs: typography.caption,
  bottomTabs: typography.microLabel,
} satisfies Record<string, TextStyle>;

export type TitleTypographyRole = keyof typeof titleTypography;

export const bodyTypography = {
  primary: typography.bodyMd,
  secondary: typography.bodySm,
  dense: typography.bodySm,
  prominent: typography.bodyLg,
} satisfies Record<string, TextStyle>;

export type BodyTypographyRole = keyof typeof bodyTypography;

export const labelTypography = {
  default: typography.caption,
  helper: typography.captionSm,
  metadata: typography.captionSm,
  field: typography.bodySm,
  control: typography.caption,
  controlLarge: typography.titleSm,
  metric: typography.captionRegular,
  status: typography.microLabel,
  minimum: typography.microMeta,
} satisfies Record<string, TextStyle>;

export type LabelTypographyRole = keyof typeof labelTypography;
