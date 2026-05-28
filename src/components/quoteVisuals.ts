import type { ThemeColors } from '@/src/theme/colors';

import type { AppTextTone } from './Typography';

type QuoteChangeVisual = {
  color: string;
  tone: AppTextTone;
};

export function getQuoteChangeVisual(changePercent: number, colors: ThemeColors): QuoteChangeVisual {
  if (changePercent > 0) {
    return { color: colors.market.up.fg, tone: 'up' };
  }

  if (changePercent < 0) {
    return { color: colors.market.down.fg, tone: 'down' };
  }

  return { color: colors.text.secondary, tone: 'muted' };
}
