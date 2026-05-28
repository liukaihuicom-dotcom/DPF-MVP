/* Vendored local search icon; source license: MIT. */
import Svg, { Path } from 'react-native-svg';

import type { LocalIconProps } from '../types';

export function LocalIconsaxSearchNormalIcon({ color = 'currentColor', height, size = 24, style, strokeWidth = 1.8, width }: LocalIconProps) {
  const resolvedSize = size;
  const resolvedWidth = width ?? resolvedSize;
  const resolvedHeight = height ?? resolvedSize;

  return (
    <Svg fill="none" height={resolvedHeight} style={style} viewBox="0 0 24 24" width={resolvedWidth}>
      <Path d="M10.8 18.1a7.3 7.3 0 1 0 0-14.6 7.3 7.3 0 0 0 0 14.6Z" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
      <Path d="m16.2 16.2 4.3 4.3" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
    </Svg>
  );
}
