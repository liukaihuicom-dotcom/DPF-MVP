/* Custom-owned plain check glyph for compact selected indicators. */
import Svg, { Path } from 'react-native-svg';

import type { LocalIconProps } from '../types';

export function LocalCustomTickIcon({ color = 'currentColor', height, size = 24, style, strokeWidth = 2, width }: LocalIconProps) {
  const resolvedSize = size;
  const resolvedWidth = width ?? resolvedSize;
  const resolvedHeight = height ?? resolvedSize;

  return (
    <Svg fill="none" height={resolvedHeight} style={style} viewBox="0 0 24 24" width={resolvedWidth}>
      <Path d="M5 12.4 9.2 16.6 19 7" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
    </Svg>
  );
}
