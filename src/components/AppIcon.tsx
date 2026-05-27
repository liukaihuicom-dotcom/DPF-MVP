import { StyleProp, ViewStyle } from 'react-native';

import { localIconComponents } from '@/src/icons/local/iconComponentMap';
import { iconRegistry, resolveIconName, resolveIconTone, type AppIconName, type IconTone, type LegacyAppIconName } from '@/src/icons/iconRegistry';
import { useThemeColors } from '@/src/settings/ProductSettings';
import { lineWidth, size as sizeTokens } from '@/src/theme/tokens';

export type AppIconSizeVariant = 'nano' | 'micro' | 'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'display';
export type AppIconStyleVariant = 'line' | 'fill';

type AppIconProps = {
  name: AppIconName | LegacyAppIconName;
  size?: number;
  sizeVariant?: AppIconSizeVariant;
  style?: StyleProp<ViewStyle>;
  styleVariant?: AppIconStyleVariant;
  tone?: IconTone | string;
};

export function AppIcon({ name, size, sizeVariant = 'md', style, styleVariant = 'line', tone }: AppIconProps) {
  const colors = useThemeColors();
  const resolvedName = resolveIconName(name);
  const icon = iconRegistry[resolvedName];
  const resolvedColor = resolveIconTone(colors, tone ?? 'primary');
  const resolvedSize = size ?? sizeTokens.icon[sizeVariant] ?? sizeTokens.icon.md;
  const fill = styleVariant === 'fill' ? resolvedColor : undefined;
  const componentKey = `${icon.sourceLibrary}:${icon.sourceIconName}` as keyof typeof localIconComponents;
  const Icon = localIconComponents[componentKey];

  if (!Icon) {
    return null;
  }

  return <Icon color={resolvedColor} fill={fill} size={resolvedSize} strokeWidth={lineWidth.icon.default} style={style} styleVariant={styleVariant} />;
}

export type { AppIconName, IconTone, LegacyAppIconName };
