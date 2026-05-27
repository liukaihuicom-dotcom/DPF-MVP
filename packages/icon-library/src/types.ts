import type { StyleProp, ViewStyle } from 'react-native';

export type LocalIconProps = {
  color?: string;
  fill?: string;
  height?: number | string;
  size?: number | string;
  styleVariant?: 'line' | 'fill';
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  width?: number | string;
};

export type LocalIconComponent = (props: LocalIconProps) => React.JSX.Element;
