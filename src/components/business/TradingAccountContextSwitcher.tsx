import { createTradingAccountSwitchHeader, TradingAccountSwitchSheet, type TradingAccountSwitchSheetProps } from '@/src/components/TradingAccountSwitchSheet';
import type { Locale } from '@/src/i18n/translations';

type TradingAccountContextSwitcherHeaderInput = {
  locale: Locale;
  onAddAccount: () => void;
  title: string;
};

export type TradingAccountContextSwitcherProps = TradingAccountSwitchSheetProps;

export function TradingAccountContextSwitcher(props: TradingAccountContextSwitcherProps) {
  return <TradingAccountSwitchSheet {...props} />;
}

export function createTradingAccountContextSwitcherHeader(input: TradingAccountContextSwitcherHeaderInput) {
  return createTradingAccountSwitchHeader(input);
}
