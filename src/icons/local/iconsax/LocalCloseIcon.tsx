import Svg, { Path } from 'react-native-svg';

import type { LocalIconProps } from '../types';

export function LocalCustomCloseIcon({ color = 'currentColor', height, size = 24, style, strokeWidth = 1.5, width }: LocalIconProps) {
  const resolvedSize = size;
  const resolvedWidth = width ?? resolvedSize;
  const resolvedHeight = height ?? resolvedSize;

  return (
    <Svg fill="none" height={resolvedHeight} style={style} viewBox="0 0 24 24" width={resolvedWidth}>
      <Path d="M7 7l10 10" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
      <Path d="M17 7 7 17" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
    </Svg>
  );
}
