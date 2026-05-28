import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Line, Path, Polyline, Rect, Stop } from 'react-native-svg';

import { formatPrice } from '@/src/domain/format';
import type { Instrument } from '@/src/domain/types';
import { useThemeColors } from '@/src/settings/ProductSettings';
import { lineWidth, radius, size, spacing, typography } from '@/src/theme/tokens';

import { AppText } from '../Typography';

type AccountClosedPnlTrendChartProps = {
  realizedPnl: number;
  series?: {
    color: string;
    values: number[];
  }[];
  totalColor?: string;
  totalValues?: number[];
};

type InstrumentDetailTrendChartProps = {
  color: string;
  instrument: Instrument;
  rangeEndLabel: string;
  rangeStartLabel: string;
  values: number[];
  width: number;
};

type InstrumentVolumeBarsProps = {
  color: string;
  values: number[];
  width: number;
};

type FundingTrendBarPoint = {
  deposit: number;
  label: string;
  withdrawal: number;
};

type FundingTrendBarsProps = {
  points: FundingTrendBarPoint[];
};

export function AccountClosedPnlTrendChart({ realizedPnl, series, totalColor, totalValues }: AccountClosedPnlTrendChartProps) {
  const colors = useThemeColors();
  const width = 292;
  const height = size.chart.accountClosedPnlHeight - spacing.sm - spacing.xxs;
  const chartTotal = realizedPnl === 0 ? 100 : realizedPnl;
  const resolvedTotalValues = totalValues ?? buildSeries(chartTotal, [0, 0.2, 0.08, 0.48, 0.36, 0.68, 0.58, 0.86, 1]);
  const resolvedSeries = series ?? [
    { color: colors.text.tertiary, values: buildSeries(chartTotal * 0.44, [0, 0.12, 0.04, 0.26, 0.2, 0.38, 0.34, 0.5, 0.62]) },
    { color: colors.border.default, values: buildSeries(chartTotal * -0.18, [0, -0.08, -0.02, -0.16, -0.1, -0.22, -0.18, -0.28, -0.34]) },
  ];
  const allValues = [...resolvedTotalValues, ...resolvedSeries.flatMap((item) => item.values)];

  return (
    <View accessibilityLabel="Closed P/L trend chart" accessible style={styles.performanceChart}>
      <Svg height={height} width={width}>
        {resolvedSeries.map((item, index) => (
          <Polyline
            fill="none"
            key={`symbol-${index}`}
            opacity={0.55}
            points={pointsForSeries(item.values, allValues, width, height)}
            stroke={item.color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={lineWidth.selected}
          />
        ))}
        <Polyline
          fill="none"
          points={pointsForSeries(resolvedTotalValues, allValues, width, height)}
          stroke={totalColor ?? colors.brand.fg}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={spacing.xs}
        />
      </Svg>
    </View>
  );
}

export function InstrumentDetailTrendChart({ color, instrument, rangeEndLabel, rangeStartLabel, values, width }: InstrumentDetailTrendChartProps) {
  const colors = useThemeColors();
  const height = size.chart.instrumentTrendHeight;
  const axisWidth = size.chart.instrumentAxisLabelGap;
  const chartWidth = width - axisWidth;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = Math.max((max - min) * 0.12, instrument.pipSize * spacing.sm);
  const scaleMin = min - padding;
  const scaleMax = max + padding;
  const range = scaleMax - scaleMin || 1;
  const topPad = radius.lg;
  const bottomPad = size.chart.instrumentBottomInset;
  const plotHeight = height - topPad - bottomPad;
  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * chartWidth;
    const y = topPad + plotHeight - ((value - scaleMin) / range) * plotHeight;

    return { x, y };
  });
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - bottomPad} L 0 ${height - bottomPad} Z`;
  const gridY = [topPad, topPad + plotHeight * 0.5, topPad + plotHeight];
  const labels = [scaleMax, (scaleMax + scaleMin) / 2, scaleMin];
  const gradientId = `detail-chart-${instrument.id}`;

  return (
    <View accessibilityLabel={`${instrument.symbol} trend chart`} accessible style={StyleSheet.flatten([styles.chartFrame, { width }])}>
      <Svg height={height} width={width}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={0.36} />
            <Stop offset="1" stopColor={color} stopOpacity={0.02} />
          </LinearGradient>
        </Defs>
        {gridY.map((y) => (
          <Line key={`grid-${y}`} stroke={colors.border.subtle} strokeOpacity={0.9} strokeWidth={lineWidth.strong} x1={0} x2={chartWidth} y1={y} y2={y} />
        ))}
        <Line stroke={colors.border.subtle} strokeOpacity={0.9} strokeWidth={lineWidth.strong} x1={chartWidth * 0.66} x2={chartWidth * 0.66} y1={topPad} y2={height - bottomPad} />
        <Path d={areaPath} fill={`url(#${gradientId})`} />
        <Path d={linePath} fill="none" stroke={color} strokeLinejoin="round" strokeWidth={lineWidth.selected + lineWidth.default + lineWidth.strong} />
      </Svg>
      <View style={styles.axisLabels}>
        {labels.map((label) => (
          <AppText key={label} style={styles.axisText} tone="muted">
            {formatPrice(instrument, label)}
          </AppText>
        ))}
      </View>
      <View style={StyleSheet.flatten([styles.chartBaseline, { backgroundColor: colors.text.tertiary }])} />
      <View style={styles.monthLabels}>
        <AppText style={styles.monthLabel} tone="muted">{rangeStartLabel}</AppText>
        <AppText style={styles.monthLabel} tone="muted">{rangeEndLabel}</AppText>
      </View>
    </View>
  );
}

export function InstrumentVolumeBars({ color, values, width }: InstrumentVolumeBarsProps) {
  const colors = useThemeColors();
  const height = size.chart.instrumentVolumeHeight;
  const barGap = spacing.xs + spacing.xxs;
  const barCount = Math.min(values.length, 40);
  const source = values.slice(-barCount);
  const chartWidth = width - size.chart.instrumentAxisLabelGap - spacing.xs;
  const barWidth = Math.max((chartWidth - barGap * (source.length - 1)) / source.length, lineWidth.selected);
  const deltas = source.map((value, index) => Math.abs(value - (source[index - 1] ?? value)));
  const maxDelta = Math.max(...deltas, 1);

  return (
    <View accessibilityLabel="Volume trend bars" accessible style={StyleSheet.flatten([styles.volumeWrap, { width }])}>
      <Svg height={height} width={chartWidth}>
        {source.map((_, index) => {
          const delta = deltas[index];
          const barHeight = spacing.xs + (delta / maxDelta) * 30;
          const x = index * (barWidth + barGap);

          return <Rect fill={index % 7 === 0 ? color : colors.text.tertiary} height={barHeight} key={`bar-${index}`} opacity={0.78} rx={barWidth / 2} width={barWidth} x={x} y={height - barHeight - 6} />;
        })}
      </Svg>
    </View>
  );
}

export function FundingTrendBars({ points }: FundingTrendBarsProps) {
  const colors = useThemeColors();
  const maxValue = Math.max(...points.flatMap((point) => [point.deposit, point.withdrawal]), 1);

  return (
    <View style={styles.fundingChartWrap}>
      <View style={styles.fundingChartGrid}>
        {[0, 1, 2].map((line) => (
          <View key={line} style={StyleSheet.flatten([styles.fundingGridLine, { backgroundColor: colors.border.subtle }])} />
        ))}
      </View>
      <View style={styles.fundingChartColumns}>
        {points.map((point) => (
          <View key={point.label} style={styles.fundingChartColumn}>
            <View style={styles.fundingBarPair}>
              <View
                style={StyleSheet.flatten([
                  styles.fundingChartBar,
                  { backgroundColor: colors.status.success.fg, height: resolveFundingBarHeight(point.deposit, maxValue) },
                ])}
              />
              <View
                style={StyleSheet.flatten([
                  styles.fundingChartBar,
                  { backgroundColor: colors.status.warning.fg, height: resolveFundingBarHeight(point.withdrawal, maxValue) },
                ])}
              />
            </View>
            <AppText numberOfLines={1} tone="dim" variant="caption">
              {point.label}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

function buildSeries(total: number, factors: number[]) {
  return factors.map((factor) => total * factor);
}

function pointsForSeries(values: number[], allValues: number[], width: number, height: number) {
  const min = Math.min(...allValues, 0);
  const max = Math.max(...allValues, 0);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');
}

function resolveFundingBarHeight(value: number, maxValue: number) {
  const maxHeight = size.chart.fundingBarMaxHeight;
  const minHeight = spacing.xs + spacing.xxs;

  if (value <= 0) {
    return minHeight;
  }

  return Math.max(minHeight, (value / maxValue) * maxHeight);
}

const styles = StyleSheet.create({
  axisLabels: {
    gap: size.chart.instrumentAxisLabelGap,
    position: 'absolute',
    right: 0,
    top: spacing.md,
    width: size.chart.instrumentAxisLabelWidth,
  },
  axisText: {
    ...typography.captionSm,
  },
  chartBaseline: {
    bottom: size.chart.instrumentBottomInset,
    height: lineWidth.hairline,
    left: 0,
    opacity: 0.7,
    position: 'absolute',
    right: size.chart.instrumentAxisLabelGap,
  },
  chartFrame: {
    borderWidth: lineWidth.none,
    height: size.chart.instrumentTrendHeight,
    marginTop: spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  fundingBarPair: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.xs,
    height: size.chart.fundingTrendHeight,
  },
  fundingChartBar: {
    borderRadius: radius.xs,
    width: size.chart.fundingBarWidth,
  },
  fundingChartColumn: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
    justifyContent: 'flex-end',
  },
  fundingChartColumns: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: size.chart.fundingTrendHeight + size.chart.fundingLabelInset,
  },
  fundingChartGrid: {
    bottom: size.chart.fundingGridBottomInset,
    justifyContent: 'space-between',
    left: 0,
    position: 'absolute',
    right: 0,
    top: spacing.xs,
  },
  fundingChartWrap: {
    minHeight: size.chart.fundingTrendHeight + size.chart.fundingChartInset,
    position: 'relative',
  },
  fundingGridLine: {
    height: lineWidth.hairline,
  },
  monthLabel: {
    ...typography.captionSm,
  },
  monthLabels: {
    bottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: spacing.md,
    position: 'absolute',
    right: 86,
  },
  performanceChart: {
    alignItems: 'center',
    height: size.chart.accountClosedPnlHeight,
    justifyContent: 'center',
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  volumeWrap: {
    alignItems: 'flex-start',
    height: size.chart.instrumentVolumeHeight,
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
});
