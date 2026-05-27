import { StyleProp, ViewStyle } from 'react-native';

import { AppIcon, type AppIconName, type AppIconStyleVariant, type IconTone } from '@/src/components/AppIcon';

type TabBarIconProps = {
  name: AppIconName;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  tone: IconTone | string;
};

export function TabBarIcon({ name, selected, style, tone }: TabBarIconProps) {
  const styleVariant: AppIconStyleVariant = selected ? 'fill' : 'line';

  return <AppIcon name={name} sizeVariant="sm" style={[{ marginBottom: -2 }, style]} styleVariant={styleVariant} tone={tone} />;
}
