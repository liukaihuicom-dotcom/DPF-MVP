import { type StyleProp, type ViewStyle } from 'react-native';

import { type IconSurfaceSizeVariant, IconSurface, type IconSurfaceTone } from '@/src/components/IconSurface';
import type { Direction } from '@/src/domain/types';

type TradeDirectionIconProps = {
  direction: Direction;
  sizeVariant?: IconSurfaceSizeVariant;
  style?: StyleProp<ViewStyle>;
};

export function TradeDirectionIcon({ direction, sizeVariant = 'lg', style }: TradeDirectionIconProps) {
  const tone: IconSurfaceTone = direction === 'buy' ? 'down' : 'up';
  const iconName = direction === 'buy' ? 'icon.trading.buy' : 'icon.trading.sell';

  return <IconSurface icon={iconName} sizeVariant={sizeVariant} style={style} tone={tone} />;
}
