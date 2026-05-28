/* Custom-owned plus glyph for generic add actions. */
import Svg, { Path } from 'react-native-svg';

import type { LocalIconProps } from '../types';

export function LocalCustomAddIcon({ color = 'currentColor', height, size = 24, style, strokeWidth = 2, width }: LocalIconProps) {
  const resolvedSize = size;
  const resolvedWidth = width ?? resolvedSize;
  const resolvedHeight = height ?? resolvedSize;

  return (
    <Svg fill="none" height={resolvedHeight} style={style} viewBox="0 0 24 24" width={resolvedWidth}>
      <Path d="M12 5v14" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
      <Path d="M5 12h14" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
    </Svg>
  );
}
