import { useId } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import { lineWidth } from '@/src/theme/tokens';
import { AppIcon, type AppIconName, type IconTone } from '@/src/components/AppIcon';
import type { Instrument, InstrumentAssetClass } from '@/src/domain/types';
import { useProductSettings } from '@/src/settings/ProductSettings';

type InstrumentIconProps = {
  instrument?: Instrument;
  size?: number;
  style?: StyleProp<ViewStyle>;
  symbol?: string;
};

type InstrumentIconKind = InstrumentAssetClass | 'unknown';

export function InstrumentIcon({ instrument, size = 36, style, symbol }: InstrumentIconProps) {
  const { colors } = useProductSettings();
  const normalizedSymbol = normalizeSymbol(instrument?.symbol ?? symbol);
  const kind = resolveIconKind(instrument, normalizedSymbol);

  if (kind === 'forex') {
    const base = instrument?.baseCurrency ?? normalizedSymbol.slice(0, 3);
    const quote = instrument?.quoteCurrency ?? normalizedSymbol.slice(3, 6);
    const flagSize = Math.round(size * 0.72);

    return (
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={StyleSheet.flatten([styles.root, { height: size, width: size }, style])}>
        <CurrencyMedallion currency={base} size={flagSize} style={[styles.baseFlag, { borderColor: colors.surface.panel }]} />
        <CurrencyMedallion currency={quote} size={flagSize} style={[styles.quoteFlag, { borderColor: colors.surface.panel }]} />
      </View>
    );
  }

  const assetIcon = resolveAssetIcon(kind, normalizedSymbol);
  const assetTone: IconTone = kind === 'metals' || normalizedSymbol.includes('XAU') ? 'amber' : kind === 'futures' ? 'blue' : 'text';

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={StyleSheet.flatten([styles.assetShell, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle, borderRadius: size / 2, height: size, width: size }, style])}>
      <AppIcon name={assetIcon} size={Math.max(20, Math.round(size * 0.55))} tone={assetTone} />
    </View>
  );
}

function CurrencyMedallion({ currency, size, style }: { currency: string; size: number; style?: StyleProp<ViewStyle> }) {
  const { colors } = useProductSettings();
  const id = useId().replace(/:/g, '');
  const clipId = `flag-${currency}-${id}`;

  return (
    <View style={StyleSheet.flatten([styles.medallion, { borderRadius: size / 2, height: size, width: size }, style])}>
      <Svg height={size} viewBox="0 0 40 40" width={size}>
        <Defs>
          <ClipPath id={clipId}>
            <Circle cx={20} cy={20} r={19} />
          </ClipPath>
        </Defs>
        <G clipPath={`url(#${clipId})`}>{renderFlag(currency)}</G>
        <Circle cx={20} cy={20} fill="none" r={19} stroke={colors.overlay.white.strong} strokeWidth={1.2} />
      </Svg>
    </View>
  );
}

function renderFlag(currency: string) {
  switch (currency.toUpperCase()) {
    case 'EUR':
      return (
        <>
          <Rect fill="#244AA5" height={40} width={40} x={0} y={0} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((point) => {
            const angle = (point / 8) * Math.PI * 2;
            return <Circle cx={20 + Math.cos(angle) * 9} cy={20 + Math.sin(angle) * 9} fill="#FFCC33" key={point} r={1.45} />;
          })}
        </>
      );
    case 'GBP':
      return (
        <>
          <Rect fill="#1F3F91" height={40} width={40} x={0} y={0} />
          <Path d="M-6 1 L3 -6 L46 39 L37 46 Z M37 -6 L46 1 L3 46 L-6 39 Z" fill="#FFFFFF" />
          <Path d="M-3 0 L1 -3 L43 40 L39 43 Z M39 -3 L43 0 L1 43 L-3 40 Z" fill="#C8102E" />
          <Rect fill="#FFFFFF" height={40} width={9} x={15.5} y={0} />
          <Rect fill="#FFFFFF" height={9} width={40} x={0} y={15.5} />
          <Rect fill="#C8102E" height={40} width={5} x={17.5} y={0} />
          <Rect fill="#C8102E" height={5} width={40} x={0} y={17.5} />
        </>
      );
    case 'JPY':
      return (
        <>
          <Rect fill="#FFFFFF" height={40} width={40} x={0} y={0} />
          <Circle cx={20} cy={20} fill="#BC002D" r={8.5} />
        </>
      );
    case 'AUD':
      return (
        <>
          <Rect fill="#123B7A" height={40} width={40} x={0} y={0} />
          <Rect fill="#1F3F91" height={19} width={21} x={0} y={0} />
          <Path d="M0 0 L21 19 M21 0 L0 19" stroke="#FFFFFF" strokeWidth={4} />
          <Path d="M0 0 L21 19 M21 0 L0 19" stroke="#C8102E" strokeWidth={2} />
          <Rect fill="#FFFFFF" height={19} width={4} x={8.5} y={0} />
          <Rect fill="#FFFFFF" height={4} width={21} x={0} y={7.5} />
          <Rect fill="#C8102E" height={19} width={2} x={9.5} y={0} />
          <Rect fill="#C8102E" height={2} width={21} x={0} y={8.5} />
          <Circle cx={27} cy={27} fill="#FFFFFF" r={3.6} />
          <Circle cx={33} cy={13} fill="#FFFFFF" r={1.8} />
        </>
      );
    case 'USD':
    default:
      return (
        <>
          <Rect fill="#FFFFFF" height={40} width={40} x={0} y={0} />
          {[0, 1, 2, 3, 4, 5, 6].map((stripe) => (
            <Rect fill="#B22234" height={3.08} key={stripe} width={40} x={0} y={stripe * 6.16} />
          ))}
          <Rect fill="#3C3B6E" height={21.5} width={21.5} x={0} y={0} />
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => <Circle cx={4.4 + col * 6} cy={4.6 + row * 6} fill="#FFFFFF" key={`${row}-${col}`} r={1} />),
          )}
        </>
      );
  }
}

function resolveAssetIcon(kind: InstrumentIconKind, symbol: string): AppIconName {
  if (kind === 'metals' || symbol.includes('XAU') || symbol.includes('XAG')) {
    return 'icon.market.gold';
  }

  if (kind === 'futures' || /^(US30|NAS100|SPX500|GER40|UK100|JP225)$/.test(symbol)) {
    return 'icon.market.index';
  }

  if (kind === 'stocks') {
    return 'icon.market.stock';
  }

  return 'icon.trading.market';
}

function normalizeSymbol(value?: string) {
  return (value ?? '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

function resolveIconKind(instrument?: Instrument, symbol = ''): InstrumentIconKind {
  if (instrument) {
    return instrument.assetClass;
  }

  if (/^[A-Z]{6}$/.test(symbol)) {
    return 'forex';
  }

  if (symbol.includes('XAU') || symbol.includes('XAG')) {
    return 'metals';
  }

  if (/^(US30|NAS100|SPX500|GER40|UK100|JP225)$/.test(symbol)) {
    return 'futures';
  }

  if (/^[A-Z]{1,5}$/.test(symbol)) {
    return 'stocks';
  }

  return 'unknown';
}

const styles = StyleSheet.create({
  baseFlag: {
    left: 0,
    top: 0,
  },
  assetShell: {
    alignItems: 'center',
    borderWidth: lineWidth.hairline,
    flexShrink: 0,
    justifyContent: 'center',
  },
  medallion: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    overflow: 'hidden',
    position: 'absolute',
  },
  quoteFlag: {
    bottom: 0,
    right: 0,
  },
  root: {
    flexShrink: 0,
    position: 'relative',
  },
});
