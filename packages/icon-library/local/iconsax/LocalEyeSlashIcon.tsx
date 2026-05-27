import Svg, { Path } from 'react-native-svg';

import type { LocalIconProps } from '../types';

export function LocalIconsaxEyeSlashIcon({ color = 'currentColor', height, size = 24, style, strokeWidth = 1.5, width }: LocalIconProps) {
  const resolvedSize = size;
  const resolvedWidth = width ?? resolvedSize;
  const resolvedHeight = height ?? resolvedSize;

  return (
    <Svg fill="none" height={resolvedHeight} style={style} viewBox="0 0 24 24" width={resolvedWidth}>
      <Path
        d="M14.54 14.54A3.58 3.58 0 0 1 9.46 9.46"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <Path
        d="M17.56 17.56A9.5 9.5 0 0 1 12 20.27c-3.53 0-6.82-2.08-9.11-5.68-.9-1.41-.9-3.78 0-5.19a13.86 13.86 0 0 1 3.44-3.78"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <Path
        d="M9.88 3.96A9.23 9.23 0 0 1 12 3.73c3.53 0 6.82 2.08 9.11 5.68.9 1.41.9 3.78 0 5.19-.42.66-.9 1.28-1.43 1.85"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <Path d="M3 3l18 18" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} />
    </Svg>
  );
}
