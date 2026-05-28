import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { formatNumber } from '@/src/domain/format';
import type { Locale } from '@/src/i18n/translations';
import { useThemeColors } from '@/src/settings/ProductSettings';
import { lineWidth, size, spacing } from '@/src/theme/tokens';

import { StatusPill } from '../StatusPill';
import { AppText } from '../Typography';

type RiskGaugeProps = {
  locale: Locale;
  riskLabel: string;
  safeLabel: string;
  title: string;
  value: number;
};

export function RiskGauge({ locale, riskLabel, safeLabel, title, value }: RiskGaugeProps) {
  const colors = useThemeColors();
  const normalized = Math.max(0, Math.min(value / 1000, 100));
  const needleAngle = (-150 + normalized * 1.2) * (Math.PI / 180);
  const centerX = size.chart.riskGaugeWidth / 2;
  const centerY = 96;
  const needleEndX = centerX + Math.cos(needleAngle) * 58;
  const needleEndY = centerY + Math.sin(needleAngle) * 58;

  return (
    <View accessibilityLabel={`${title}: ${safeLabel} ${formatNumber(value, 2, locale)}%`} accessible style={styles.gaugeWrap}>
      <View style={styles.gaugeStage}>
        <Svg height={size.chart.riskGaugeSvgHeight} width={size.chart.riskGaugeWidth}>
          <Path d="M 34 96 A 86 86 0 0 1 206 96" fill="none" stroke={colors.border.subtle} strokeLinecap="round" strokeWidth={14} />
          <Path d="M 34 96 A 86 86 0 0 1 65 30" fill="none" stroke={colors.status.danger.fg} strokeLinecap="butt" strokeWidth={14} />
          <Path d="M 69 28 A 86 86 0 0 1 102 13" fill="none" stroke={colors.status.warning.fg} strokeLinecap="butt" strokeWidth={14} />
          <Path d="M 108 12 A 86 86 0 0 1 132 12" fill="none" stroke={colors.text.tertiary} strokeLinecap="butt" strokeWidth={14} />
          <Path d="M 138 13 A 86 86 0 0 1 171 28" fill="none" stroke={colors.status.success.fg} strokeLinecap="butt" strokeWidth={14} />
          <Path d="M 175 30 A 86 86 0 0 1 206 96" fill="none" stroke={colors.status.success.fg} strokeLinecap="butt" strokeWidth={14} />
          {[34, 65, 102, 120, 138, 175, 206].map((x, index) => (
            <Line key={`${x}-${index}`} opacity={0.22} stroke={colors.text.tertiary} strokeLinecap="round" strokeWidth={lineWidth.selected} x1={x} x2={x} y1={92} y2={98} />
          ))}
          <Line stroke={colors.text.primary} strokeLinecap="round" strokeWidth={spacing.xs} x1={centerX} x2={needleEndX} y1={centerY} y2={needleEndY} />
          <Circle cx={centerX} cy={centerY} fill={colors.surface.canvas} r={spacing.sm} stroke={colors.text.primary} strokeWidth={lineWidth.selected + lineWidth.strong} />
        </Svg>
        <View style={styles.gaugeLabels}>
          <AppText tone="muted" variant="caption">{riskLabel}</AppText>
          <AppText tone="muted" variant="caption">{safeLabel}</AppText>
        </View>
      </View>
      <AppText variant="subtitle">{title}</AppText>
      <StatusPill compact label={`${safeLabel} · ${formatNumber(value, 2, locale)}%`} tone="success" />
    </View>
  );
}

const styles = StyleSheet.create({
  gaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -spacing.sm,
    width: size.chart.riskGaugeLabelWidth,
  },
  gaugeStage: {
    alignItems: 'center',
    height: size.chart.riskGaugeHeight,
    justifyContent: 'flex-start',
  },
  gaugeWrap: {
    alignItems: 'center',
    gap: spacing.xxs,
    marginTop: spacing.sm,
  },
});
