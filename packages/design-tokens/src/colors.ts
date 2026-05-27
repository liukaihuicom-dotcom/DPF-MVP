export type ResolvedThemeMode = 'darkTerminal' | 'lightBroker' | 'midnightBlue';
export type ThemeMode = 'system' | ResolvedThemeMode;

export type ColorStep = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950';
export type ColorRamp = Record<ColorStep, string>;

export type ThemeColorState = {
  bg: string;
  border: string;
  fg: string;
  onSolid: string;
  solid: string;
};

export type ThemeOverlayScale = {
  muted: string;
  scrim: string;
  strong: string;
  subtle: string;
};

export type ThemeColors = {
  accent: {
    blue: ThemeColorState;
    cyan: ThemeColorState;
    purple: ThemeColorState;
  };
  border: {
    default: string;
    disabled: string;
    focus: string;
    strong: string;
    subtle: string;
  };
  brand: ThemeColorState & {
    active: string;
    disabled: string;
    launch: string;
  };
  chart: {
    categorical: readonly string[];
    diverging: {
      negative: string;
      neutral: string;
      positive: string;
    };
    sequential: {
      high: string;
      low: string;
      mid: string;
    };
  };
  icon: {
    active: string;
    danger: string;
    disabled: string;
    info: string;
    inverse: string;
    primary: string;
    secondary: string;
    success: string;
    tertiary: string;
    warning: string;
  };
  market: {
    down: ThemeColorState;
    flat: ThemeColorState;
    up: ThemeColorState;
  };
  overlay: {
    backdrop: string;
    black: ThemeOverlayScale;
    brand: ThemeOverlayScale;
    danger: ThemeOverlayScale;
    down: ThemeOverlayScale;
    info: ThemeOverlayScale;
    inverse: ThemeOverlayScale;
    scrim: string;
    up: ThemeOverlayScale;
    warning: ThemeOverlayScale;
    white: ThemeOverlayScale;
  };
  status: {
    danger: ThemeColorState;
    info: ThemeColorState;
    neutral: ThemeColorState;
    success: ThemeColorState;
    warning: ThemeColorState;
  };
  surface: {
    canvas: string;
    disabled: string;
    inverse: string;
    panel: string;
    raised: string;
    subtle: string;
  };
  text: {
    disabled: string;
    inverse: string;
    link: string;
    primary: string;
    secondary: string;
    tertiary: string;
  };
};

/**
 * @deprecated Use ThemeColors and useThemeColors(). This compatibility shape is
 * kept only for old integrations during the color-token migration.
 */
export type ThemePalette = {
  amber: string;
  bg: string;
  blue: string;
  brand: string;
  cyan: string;
  danger: string;
  disabledBorder: string;
  disabledSurface: string;
  disabledText: string;
  down: string;
  launch: string;
  line: string;
  lineSoft: string;
  link: string;
  panel: string;
  panelHigh: string;
  panelSoft: string;
  text: string;
  textDim: string;
  textMuted: string;
  up: string;
  white: string;
};

export const colorPrimitives = {
  amber: {
    '50': '#FFFBEB',
    '100': '#FEF3C7',
    '200': '#FDE68A',
    '300': '#FCD34D',
    '400': '#FBBF24',
    '500': '#F59E0B',
    '600': '#D97706',
    '700': '#A86D00',
    '800': '#92400E',
    '900': '#78350F',
    '950': '#451A03',
  },
  blue: {
    '50': '#EFF6FF',
    '100': '#DBEAFE',
    '200': '#BFDBFE',
    '300': '#93C5FD',
    '400': '#60A5FA',
    '500': '#3B82F6',
    '600': '#2563EB',
    '700': '#1D4ED8',
    '800': '#1E40AF',
    '900': '#1E3A8A',
    '950': '#172554',
  },
  brand: {
    teal: {
      '50': '#ECFEFF',
      '100': '#CFFAFE',
      '200': '#A5F3FC',
      '300': '#67E8F9',
      '400': '#22D3EE',
      '500': '#2EB5C4',
      '600': '#2399A5',
      '700': '#0E7490',
      '800': '#155E75',
      '900': '#164E63',
      '950': '#083344',
    },
  },
  cyan: {
    '50': '#ECFEFF',
    '100': '#CFFAFE',
    '200': '#A5F3FC',
    '300': '#67E8F9',
    '400': '#22D3EE',
    '500': '#06B6D4',
    '600': '#0891B2',
    '700': '#0E7490',
    '800': '#155E75',
    '900': '#164E63',
    '950': '#083344',
  },
  green: {
    '50': '#ECFDF5',
    '100': '#D1FAE5',
    '200': '#A7F3D0',
    '300': '#6EE7B7',
    '400': '#34D399',
    '500': '#10B981',
    '600': '#05A66B',
    '700': '#047857',
    '800': '#065F46',
    '900': '#064E3B',
    '950': '#022C22',
  },
  market: {
    down: {
      '50': '#ECFDF5',
      '100': '#D1FAE5',
      '200': '#A7F3D0',
      '300': '#6EE7B7',
      '400': '#34D399',
      '500': '#10B981',
      '600': '#05A66B',
      '700': '#047857',
      '800': '#065F46',
      '900': '#064E3B',
      '950': '#022C22',
    },
    up: {
      '50': '#FEF2F2',
      '100': '#FEE2E2',
      '200': '#FECACA',
      '300': '#FCA5A5',
      '400': '#F87171',
      '500': '#EF4444',
      '600': '#DC2626',
      '700': '#CF202F',
      '800': '#991B1B',
      '900': '#7F1D1D',
      '950': '#450A0A',
    },
  },
  neutral: {
    '50': '#FAFAFA',
    '100': '#F4F4F5',
    '200': '#E4E4E7',
    '300': '#D4D4D8',
    '400': '#A1A1AA',
    '500': '#71717A',
    '600': '#52525B',
    '700': '#3F3F46',
    '800': '#27272A',
    '900': '#18181B',
    '950': '#09090B',
  },
  purple: {
    '50': '#FAF5FF',
    '100': '#F3E8FF',
    '200': '#E9D5FF',
    '300': '#D8B4FE',
    '400': '#C084FC',
    '500': '#A855F7',
    '600': '#9333EA',
    '700': '#7E22CE',
    '800': '#6B21A8',
    '900': '#581C87',
    '950': '#3B0764',
  },
  red: {
    '50': '#FEF2F2',
    '100': '#FEE2E2',
    '200': '#FECACA',
    '300': '#FCA5A5',
    '400': '#F87171',
    '500': '#EF4444',
    '600': '#DC2626',
    '700': '#CF202F',
    '800': '#991B1B',
    '900': '#7F1D1D',
    '950': '#450A0A',
  },
} as const satisfies {
  amber: ColorRamp;
  blue: ColorRamp;
  brand: { teal: ColorRamp };
  cyan: ColorRamp;
  green: ColorRamp;
  market: { down: ColorRamp; up: ColorRamp };
  neutral: ColorRamp;
  purple: ColorRamp;
  red: ColorRamp;
};

function alpha(color: string, value: '08' | '10' | '12' | '14' | '18' | '24' | '28' | '30' | '40' | '44' | '45' | '55' | '66' | '80' | '99' | 'CC') {
  return `${color}${value}`;
}

function state({
  bg,
  border,
  fg,
  onSolid = colorPrimitives.neutral['50'],
  solid,
}: {
  bg: string;
  border: string;
  fg: string;
  onSolid?: string;
  solid: string;
}): ThemeColorState {
  return { bg, border, fg, onSolid, solid };
}

function overlays(color: string): ThemeOverlayScale {
  return {
    muted: alpha(color, '18'),
    scrim: alpha(color, '66'),
    strong: alpha(color, '55'),
    subtle: alpha(color, '12'),
  };
}

const white = '#FFFFFF';
const black = '#000000';
const teal = colorPrimitives.brand.teal;
const neutral = colorPrimitives.neutral;

export const themeColors: Record<ResolvedThemeMode, ThemeColors> = {
  darkTerminal: {
    accent: {
      blue: state({ bg: colorPrimitives.blue['950'], border: colorPrimitives.blue['700'], fg: '#74A8FF', solid: colorPrimitives.blue['500'] }),
      cyan: state({ bg: colorPrimitives.cyan['950'], border: colorPrimitives.cyan['700'], fg: teal['400'], solid: colorPrimitives.cyan['500'] }),
      purple: state({ bg: colorPrimitives.purple['950'], border: colorPrimitives.purple['700'], fg: colorPrimitives.purple['300'], solid: colorPrimitives.purple['500'] }),
    },
    border: {
      default: '#444444',
      disabled: '#555555',
      focus: teal['500'],
      strong: '#565656',
      subtle: '#2F2F2F',
    },
    brand: {
      ...state({ bg: teal['950'], border: teal['700'], fg: teal['500'], solid: teal['500'], onSolid: white }),
      active: teal['400'],
      disabled: teal['800'],
      launch: '#9CE56D',
    },
    chart: {
      categorical: [teal['500'], colorPrimitives.blue['400'], colorPrimitives.amber['400'], colorPrimitives.purple['400'], colorPrimitives.green['400'], colorPrimitives.red['400'], colorPrimitives.cyan['400'], colorPrimitives.blue['300'], colorPrimitives.amber['300'], colorPrimitives.purple['300'], colorPrimitives.green['300'], colorPrimitives.red['300']],
      diverging: { negative: '#FF6478', neutral: '#B8B8B8', positive: '#24C985' },
      sequential: { high: teal['300'], low: '#123337', mid: teal['500'] },
    },
    icon: {
      active: '#F8FAFC',
      danger: '#FF6B7E',
      disabled: '#B8B8B8',
      info: '#74A8FF',
      inverse: white,
      primary: '#F8FAFC',
      secondary: '#E2E2E2',
      success: '#24C985',
      tertiary: '#B8B8B8',
      warning: '#F4B000',
    },
    market: {
      down: state({ bg: colorPrimitives.green['950'], border: colorPrimitives.green['700'], fg: '#24C985', solid: colorPrimitives.green['500'] }),
      flat: state({ bg: '#222222', border: '#444444', fg: '#B8B8B8', solid: '#71717A' }),
      up: state({ bg: colorPrimitives.red['950'], border: colorPrimitives.red['700'], fg: '#FF5A68', solid: colorPrimitives.red['500'] }),
    },
    overlay: {
      backdrop: alpha('#070707', '99'),
      black: overlays(black),
      brand: overlays(teal['500']),
      danger: overlays('#FF6B7E'),
      down: overlays('#24C985'),
      info: overlays('#74A8FF'),
      inverse: overlays(white),
      scrim: alpha('#070707', 'CC'),
      up: overlays('#FF5A68'),
      warning: overlays(colorPrimitives.amber['400']),
      white: overlays(white),
    },
    status: {
      danger: state({ bg: colorPrimitives.red['950'], border: colorPrimitives.red['700'], fg: '#FF6B7E', solid: colorPrimitives.red['500'] }),
      info: state({ bg: colorPrimitives.blue['950'], border: colorPrimitives.blue['700'], fg: '#74A8FF', solid: colorPrimitives.blue['500'] }),
      neutral: state({ bg: '#222222', border: '#444444', fg: '#B8B8B8', solid: '#71717A' }),
      success: state({ bg: colorPrimitives.green['950'], border: colorPrimitives.green['700'], fg: '#24C985', solid: colorPrimitives.green['500'] }),
      warning: state({ bg: colorPrimitives.amber['950'], border: colorPrimitives.amber['700'], fg: '#F4B000', solid: colorPrimitives.amber['500'] }),
    },
    surface: {
      canvas: '#070707',
      disabled: '#303030',
      inverse: white,
      panel: '#181818',
      raised: '#222222',
      subtle: '#2C2C2C',
    },
    text: {
      disabled: '#B8B8B8',
      inverse: white,
      link: '#74A8FF',
      primary: '#F8FAFC',
      secondary: '#E2E2E2',
      tertiary: '#B8B8B8',
    },
  },
  lightBroker: {
    accent: {
      blue: state({ bg: colorPrimitives.blue['50'], border: colorPrimitives.blue['200'], fg: colorPrimitives.blue['600'], solid: colorPrimitives.blue['600'] }),
      cyan: state({ bg: colorPrimitives.cyan['50'], border: colorPrimitives.cyan['200'], fg: colorPrimitives.cyan['700'], solid: colorPrimitives.cyan['600'] }),
      purple: state({ bg: colorPrimitives.purple['50'], border: colorPrimitives.purple['200'], fg: colorPrimitives.purple['700'], solid: colorPrimitives.purple['600'] }),
    },
    border: {
      default: '#DEE1E6',
      disabled: '#D2D7DE',
      focus: teal['500'],
      strong: '#CBD5E1',
      subtle: '#EEF0F3',
    },
    brand: {
      ...state({ bg: teal['50'], border: teal['200'], fg: teal['500'], solid: teal['500'], onSolid: white }),
      active: teal['600'],
      disabled: '#B9E5EA',
      launch: '#9CE56D',
    },
    chart: {
      categorical: [teal['500'], colorPrimitives.blue['600'], colorPrimitives.amber['600'], colorPrimitives.purple['600'], colorPrimitives.green['600'], colorPrimitives.red['600'], colorPrimitives.cyan['600'], colorPrimitives.blue['400'], colorPrimitives.amber['500'], colorPrimitives.purple['400'], colorPrimitives.green['500'], colorPrimitives.red['500']],
      diverging: { negative: colorPrimitives.red['700'], neutral: neutral['500'], positive: colorPrimitives.green['600'] },
      sequential: { high: teal['700'], low: teal['100'], mid: teal['500'] },
    },
    icon: {
      active: '#0A0B0D',
      danger: '#CF202F',
      disabled: '#6D747E',
      info: colorPrimitives.blue['600'],
      inverse: white,
      primary: '#0A0B0D',
      secondary: '#5B616E',
      success: colorPrimitives.green['600'],
      tertiary: '#7C828A',
      warning: '#A86D00',
    },
    market: {
      down: state({ bg: colorPrimitives.green['50'], border: colorPrimitives.green['200'], fg: '#05A66B', solid: colorPrimitives.green['600'] }),
      flat: state({ bg: neutral['100'], border: neutral['300'], fg: neutral['500'], solid: neutral['500'] }),
      up: state({ bg: colorPrimitives.red['50'], border: colorPrimitives.red['200'], fg: '#CF202F', solid: colorPrimitives.red['700'] }),
    },
    overlay: {
      backdrop: alpha(neutral['950'], '66'),
      black: overlays(black),
      brand: overlays(teal['500']),
      danger: overlays(colorPrimitives.red['700']),
      down: overlays(colorPrimitives.green['600']),
      info: overlays(colorPrimitives.blue['600']),
      inverse: overlays(white),
      scrim: alpha(neutral['950'], '80'),
      up: overlays(colorPrimitives.red['700']),
      warning: overlays(colorPrimitives.amber['700']),
      white: overlays(white),
    },
    status: {
      danger: state({ bg: colorPrimitives.red['50'], border: colorPrimitives.red['200'], fg: '#CF202F', solid: colorPrimitives.red['700'] }),
      info: state({ bg: colorPrimitives.blue['50'], border: colorPrimitives.blue['200'], fg: colorPrimitives.blue['600'], solid: colorPrimitives.blue['600'] }),
      neutral: state({ bg: neutral['100'], border: neutral['300'], fg: neutral['600'], solid: neutral['500'] }),
      success: state({ bg: colorPrimitives.green['50'], border: colorPrimitives.green['200'], fg: colorPrimitives.green['600'], solid: colorPrimitives.green['600'] }),
      warning: state({ bg: colorPrimitives.amber['50'], border: colorPrimitives.amber['200'], fg: '#A86D00', solid: colorPrimitives.amber['600'] }),
    },
    surface: {
      canvas: '#F7F7F7',
      disabled: '#E3E7EC',
      inverse: neutral['950'],
      panel: white,
      raised: white,
      subtle: '#EEF0F3',
    },
    text: {
      disabled: '#6D747E',
      inverse: white,
      link: colorPrimitives.blue['600'],
      primary: '#0A0B0D',
      secondary: '#5B616E',
      tertiary: '#7C828A',
    },
  },
  midnightBlue: {
    accent: {
      blue: state({ bg: colorPrimitives.blue['950'], border: colorPrimitives.blue['700'], fg: '#7AB8FF', solid: colorPrimitives.blue['500'] }),
      cyan: state({ bg: colorPrimitives.cyan['950'], border: colorPrimitives.cyan['700'], fg: teal['400'], solid: colorPrimitives.cyan['500'] }),
      purple: state({ bg: colorPrimitives.purple['950'], border: colorPrimitives.purple['700'], fg: colorPrimitives.purple['300'], solid: colorPrimitives.purple['500'] }),
    },
    border: {
      default: '#464646',
      disabled: '#565656',
      focus: teal['500'],
      strong: '#5B5B5B',
      subtle: '#323232',
    },
    brand: {
      ...state({ bg: teal['950'], border: teal['700'], fg: teal['500'], solid: teal['500'], onSolid: white }),
      active: teal['400'],
      disabled: teal['800'],
      launch: '#9CE56D',
    },
    chart: {
      categorical: [teal['500'], colorPrimitives.blue['400'], colorPrimitives.amber['400'], colorPrimitives.purple['400'], colorPrimitives.green['400'], colorPrimitives.red['400'], colorPrimitives.cyan['400'], colorPrimitives.blue['300'], colorPrimitives.amber['300'], colorPrimitives.purple['300'], colorPrimitives.green['300'], colorPrimitives.red['300']],
      diverging: { negative: '#FF6478', neutral: '#BDBDBD', positive: '#24C985' },
      sequential: { high: teal['300'], low: '#123337', mid: teal['500'] },
    },
    icon: {
      active: '#F8FAFC',
      danger: '#FF7391',
      disabled: '#BCBCBC',
      info: '#7AB8FF',
      inverse: white,
      primary: '#F8FAFC',
      secondary: '#E3E3E3',
      success: '#24C985',
      tertiary: '#BDBDBD',
      warning: '#F4B000',
    },
    market: {
      down: state({ bg: colorPrimitives.green['950'], border: colorPrimitives.green['700'], fg: '#24C985', solid: colorPrimitives.green['500'] }),
      flat: state({ bg: '#242424', border: '#464646', fg: '#BDBDBD', solid: '#71717A' }),
      up: state({ bg: colorPrimitives.red['950'], border: colorPrimitives.red['700'], fg: '#FF6478', solid: colorPrimitives.red['500'] }),
    },
    overlay: {
      backdrop: alpha('#080808', '99'),
      black: overlays(black),
      brand: overlays(teal['500']),
      danger: overlays('#FF7391'),
      down: overlays('#24C985'),
      info: overlays('#7AB8FF'),
      inverse: overlays(white),
      scrim: alpha('#080808', 'CC'),
      up: overlays('#FF6478'),
      warning: overlays(colorPrimitives.amber['400']),
      white: overlays(white),
    },
    status: {
      danger: state({ bg: colorPrimitives.red['950'], border: colorPrimitives.red['700'], fg: '#FF7391', solid: colorPrimitives.red['500'] }),
      info: state({ bg: colorPrimitives.blue['950'], border: colorPrimitives.blue['700'], fg: '#7AB8FF', solid: colorPrimitives.blue['500'] }),
      neutral: state({ bg: '#242424', border: '#464646', fg: '#BDBDBD', solid: '#71717A' }),
      success: state({ bg: colorPrimitives.green['950'], border: colorPrimitives.green['700'], fg: '#24C985', solid: colorPrimitives.green['500'] }),
      warning: state({ bg: colorPrimitives.amber['950'], border: colorPrimitives.amber['700'], fg: '#F4B000', solid: colorPrimitives.amber['500'] }),
    },
    surface: {
      canvas: '#080808',
      disabled: '#333333',
      inverse: white,
      panel: '#1A1A1A',
      raised: '#242424',
      subtle: '#303030',
    },
    text: {
      disabled: '#BCBCBC',
      inverse: white,
      link: '#7AB8FF',
      primary: '#F8FAFC',
      secondary: '#E3E3E3',
      tertiary: '#BDBDBD',
    },
  },
};

function toDeprecatedPalette(colors: ThemeColors): ThemePalette {
  return {
    amber: colors.status.warning.fg,
    bg: colors.surface.canvas,
    blue: colors.status.info.fg,
    brand: colors.brand.fg,
    cyan: colors.accent.cyan.fg,
    danger: colors.status.danger.fg,
    disabledBorder: colors.border.disabled,
    disabledSurface: colors.surface.disabled,
    disabledText: colors.text.disabled,
    down: colors.market.down.fg,
    launch: colors.brand.launch,
    line: colors.border.default,
    lineSoft: colors.border.subtle,
    link: colors.text.link,
    panel: colors.surface.panel,
    panelHigh: colors.surface.raised,
    panelSoft: colors.surface.subtle,
    text: colors.text.primary,
    textDim: colors.text.tertiary,
    textMuted: colors.text.secondary,
    up: colors.market.up.fg,
    white: colors.text.inverse,
  };
}

/**
 * @deprecated Use themeColors.
 */
export const themePalettes: Record<ResolvedThemeMode, ThemePalette> = {
  darkTerminal: toDeprecatedPalette(themeColors.darkTerminal),
  lightBroker: toDeprecatedPalette(themeColors.lightBroker),
  midnightBlue: toDeprecatedPalette(themeColors.midnightBlue),
};

/**
 * @deprecated Use themeColors.lightBroker.
 */
export const palette = themePalettes.lightBroker;

export type ThemeToneKey = 'amber' | 'bg' | 'blue' | 'brand' | 'cyan' | 'danger' | 'default' | 'dim' | 'disabled' | 'down' | 'link' | 'muted' | 'panel' | 'panelMuted' | 'text' | 'textDim' | 'textMuted' | 'up' | 'white';

export function resolveThemeTone(colors: ThemeColors, tone: ThemeToneKey | string): string {
  const toneMap: Record<ThemeToneKey, string> = {
    amber: colors.status.warning.fg,
    bg: colors.surface.canvas,
    blue: colors.status.info.fg,
    brand: colors.brand.fg,
    cyan: colors.accent.cyan.fg,
    danger: colors.status.danger.fg,
    default: colors.text.primary,
    dim: colors.text.tertiary,
    disabled: colors.text.disabled,
    down: colors.market.down.fg,
    link: colors.text.link,
    muted: colors.text.secondary,
    panel: colors.surface.panel,
    panelMuted: colors.overlay.inverse.scrim,
    text: colors.text.primary,
    textDim: colors.text.tertiary,
    textMuted: colors.text.secondary,
    up: colors.market.up.fg,
    white: colors.text.inverse,
  };

  return tone in toneMap ? toneMap[tone as ThemeToneKey] : tone;
}

export const shadows = {
  dialog: {
    shadowColor: black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 16,
  },
  panel: {
    shadowColor: black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  toast: {
    shadowColor: black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 12,
  },
};
