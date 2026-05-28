import { PropsWithChildren } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { resolveThemeTone } from '@/src/theme/colors';
import {
  bodyTypography,
  labelTypography,
  titleTypography,
  typography,
  type BodyTypographyRole,
  type LabelTypographyRole,
  type TitleTypographyRole,
  type TypographyToken,
} from '@/src/theme/tokens';

export type AppTextTone =
  | 'amber'
  | 'bg'
  | 'blue'
  | 'brand'
  | 'cyan'
  | 'danger'
  | 'default'
  | 'dim'
  | 'disabled'
  | 'down'
  | 'link'
  | 'muted'
  | 'panel'
  | 'panelMuted'
  | 'success'
  | 'up'
  | 'white';

type AppTextProps = PropsWithChildren<
  TextProps & {
    tone?: AppTextTone;
    variant?:
      | TypographyToken
      | 'body'
      | 'caption'
      | 'eyebrow'
      | 'largeNumber'
      | 'number'
      | 'subtitle'
      | 'title'
      | `body.${BodyTypographyRole}`
      | `label.${LabelTypographyRole}`
      | `title.${TitleTypographyRole}`;
  }
>;

const MIN_AUTO_FIT_FONT_SCALE = 0.92;

export function AppText({
  adjustsFontSizeToFit,
  children,
  minimumFontScale,
  tone = 'default',
  variant = 'body',
  style,
  ...props
}: AppTextProps) {
  const colors = useThemeColors();
  const variantStyle = variantStyles[variant];
  const resolvedMinimumFontScale = adjustsFontSizeToFit
    ? Math.max(minimumFontScale ?? MIN_AUTO_FIT_FONT_SCALE, MIN_AUTO_FIT_FONT_SCALE)
    : minimumFontScale;

  return (
    <Text
      {...props}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={resolvedMinimumFontScale}
      style={StyleSheet.flatten([styles.base, variantStyle, { color: resolveThemeTone(colors, tone) }, style])}>
      {children}
    </Text>
  );
}

const variantStyles = {
  ...typography,
  ...(Object.fromEntries(
    Object.entries(titleTypography).map(([role, style]) => [`title.${role}`, style]),
  ) as Record<`title.${TitleTypographyRole}`, (typeof titleTypography)[TitleTypographyRole]>),
  ...(Object.fromEntries(
    Object.entries(bodyTypography).map(([role, style]) => [`body.${role}`, style]),
  ) as Record<`body.${BodyTypographyRole}`, (typeof bodyTypography)[BodyTypographyRole]>),
  ...(Object.fromEntries(
    Object.entries(labelTypography).map(([role, style]) => [`label.${role}`, style]),
  ) as Record<`label.${LabelTypographyRole}`, (typeof labelTypography)[LabelTypographyRole]>),
  body: typography.bodySm,
  caption: typography.captionSm,
  eyebrow: {
    ...typography.microLabel,
    textTransform: 'uppercase',
  },
  largeNumber: typography.displayXl,
  number: typography.number,
  subtitle: typography.titleMd,
  title: typography.displayLg,
} as const;

const styles = StyleSheet.create({
  base: {
    letterSpacing: 0,
  },
});
