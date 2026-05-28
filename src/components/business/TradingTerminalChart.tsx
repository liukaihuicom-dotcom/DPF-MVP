import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Polygon, Polyline, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { AppIcon, type AppIconName } from '@/src/components/AppIcon';
import { useModalStack } from '@/src/components/ModalStack';
import { NativePressable } from '@/src/components/NativePressable';
import { SegmentedTabs } from '@/src/components/SegmentedTabs';
import { AppText } from '@/src/components/Typography';
import { formatNumber, formatPrice } from '@/src/domain/format';
import type { Instrument, InstrumentCandle, InstrumentChartTimeframe } from '@/src/domain/types';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { layout, lineWidth, radius, size, spacing, typography } from '@/src/theme/tokens';

export type TradingTerminalChartState = 'default' | 'loading' | 'empty' | 'error' | 'quote_stale' | 'market_closed' | 'restricted';

type ChartType = 'candles' | 'line' | 'area';
type IndicatorKey = 'ma' | 'ema' | 'boll' | 'rsi' | 'macd' | 'volume';
type DrawingTool = 'trend' | 'horizontal' | 'vertical' | 'rectangle' | 'fibonacci';

type DrawingShape = {
  endIndex: number;
  endPrice: number;
  id: string;
  startIndex: number;
  startPrice: number;
  tool: DrawingTool;
};

type TradingTerminalChartProps = {
  instrument: Instrument;
  initialTimeframe?: InstrumentChartTimeframe;
  state?: TradingTerminalChartState;
};

const chartTypeOptions: { labelKey: 'chart.type.candles' | 'chart.type.line' | 'chart.type.area'; value: ChartType }[] = [
  { labelKey: 'chart.type.candles', value: 'candles' },
  { labelKey: 'chart.type.line', value: 'line' },
  { labelKey: 'chart.type.area', value: 'area' },
];

const timeframeOptions: InstrumentChartTimeframe[] = ['1m', '5m', '15m', '30m', '1H', '4H', '1D', '1W'];
const indicatorOptions: { icon: AppIconName; key: IndicatorKey; labelKey: TranslationChartKey }[] = [
  { icon: 'icon.trading.market', key: 'ma', labelKey: 'chart.indicator.ma' },
  { icon: 'icon.trading.market', key: 'ema', labelKey: 'chart.indicator.ema' },
  { icon: 'icon.trading.market', key: 'boll', labelKey: 'chart.indicator.boll' },
  { icon: 'icon.trading.market', key: 'rsi', labelKey: 'chart.indicator.rsi' },
  { icon: 'icon.trading.market', key: 'macd', labelKey: 'chart.indicator.macd' },
  { icon: 'icon.trading.volume', key: 'volume', labelKey: 'chart.indicator.volume' },
];
const drawingToolOptions: { icon: AppIconName; key: DrawingTool; labelKey: TranslationChartKey }[] = [
  { icon: 'icon.trading.market', key: 'trend', labelKey: 'chart.tool.trend' },
  { icon: 'icon.system.more', key: 'horizontal', labelKey: 'chart.tool.horizontal' },
  { icon: 'icon.system.more', key: 'vertical', labelKey: 'chart.tool.vertical' },
  { icon: 'icon.trading.order_ticket', key: 'rectangle', labelKey: 'chart.tool.rectangle' },
  { icon: 'icon.system.settings', key: 'fibonacci', labelKey: 'chart.tool.fibonacci' },
];

type TranslationChartKey =
  | 'chart.action.clear'
  | 'chart.action.delete'
  | 'chart.action.exitFullscreen'
  | 'chart.action.fullscreen'
  | 'chart.action.reset'
  | 'chart.drawing.none'
  | 'chart.drawing.selected'
  | 'chart.indicator.boll'
  | 'chart.indicator.ema'
  | 'chart.indicator.ma'
  | 'chart.indicator.macd'
  | 'chart.indicator.rsi'
  | 'chart.indicator.volume'
  | 'chart.label.ask'
  | 'chart.label.bid'
  | 'chart.label.current'
  | 'chart.label.high'
  | 'chart.label.low'
  | 'chart.label.ohlcv'
  | 'chart.label.time'
  | 'chart.section.drawings'
  | 'chart.section.indicators'
  | 'chart.state.empty.body'
  | 'chart.state.empty.title'
  | 'chart.state.error.body'
  | 'chart.state.error.title'
  | 'chart.state.loading.body'
  | 'chart.state.loading.title'
  | 'chart.state.marketClosed.body'
  | 'chart.state.marketClosed.title'
  | 'chart.state.quoteStale.body'
  | 'chart.state.quoteStale.title'
  | 'chart.state.restricted.body'
  | 'chart.state.restricted.title'
  | 'chart.tool.fibonacci'
  | 'chart.tool.horizontal'
  | 'chart.tool.rectangle'
  | 'chart.tool.trend'
  | 'chart.tool.vertical'
  | 'chart.type.area'
  | 'chart.type.candles'
  | 'chart.type.line';

export function TradingTerminalChart({ initialTimeframe = '1m', instrument, state }: TradingTerminalChartProps) {
  const modalStack = useModalStack();
  const openFullscreen = () => {
    modalStack.presentFullScreen({
      content: (
        <TradingTerminalSurface
          fullscreen
          initialTimeframe={initialTimeframe}
          instrument={instrument}
          onRequestClose={modalStack.dismiss}
          state={state}
        />
      ),
      title: instrument.symbol,
    });
  };

  return (
    <TradingTerminalSurface fullscreen={false} initialTimeframe={initialTimeframe} instrument={instrument} onRequestFullscreen={openFullscreen} state={state} />
  );
}

function TradingTerminalSurface({
  fullscreen,
  initialTimeframe,
  instrument,
  onRequestClose,
  onRequestFullscreen,
  state,
}: {
  fullscreen: boolean;
  initialTimeframe: InstrumentChartTimeframe;
  instrument: Instrument;
  onRequestClose?: () => void;
  onRequestFullscreen?: () => void;
  state?: TradingTerminalChartState;
}) {
  const { colors, locale, t } = useProductSettings();
  const { width } = useWindowDimensions();
  const [chartType, setChartType] = useState<ChartType>('candles');
  const [timeframe, setTimeframe] = useState<InstrumentChartTimeframe>(initialTimeframe);
  const candles = instrument.candlesByTimeframe[timeframe] ?? [];
  const [visibleCount, setVisibleCount] = useState(Math.min(size.chart.detailSeriesLookback, Math.max(candles.length, spacing.xxl)));
  const [visibleStart, setVisibleStart] = useState(Math.max(candles.length - visibleCount, spacing.none));
  const [crosshairIndex, setCrosshairIndex] = useState<number | null>(candles.length > 0 ? candles.length - 1 : null);
  const [indicators, setIndicators] = useState<Record<IndicatorKey, boolean>>({
    boll: false,
    ema: false,
    ma: true,
    macd: false,
    rsi: false,
    volume: true,
  });
  const [activeTool, setActiveTool] = useState<DrawingTool>('trend');
  const [drawings, setDrawings] = useState<DrawingShape[]>([]);
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(null);
  const panOffset = useSharedValue<number>(spacing.none);
  const resolvedState = resolveChartState(instrument, candles, state);
  const widthInset = fullscreen ? spacing.lg : spacing.none;
  const chartWidth = Math.min(Math.max(width - widthInset * 2, size.viewport.chartCompactMinHeight), size.viewport.appDeviceWidth - spacing.lg * 2);
  const chartHeight = fullscreen ? size.chart.instrumentTrendHeight + size.viewport.chartCompactMinHeight : size.chart.instrumentTrendHeight + size.chart.instrumentVolumeHeight;
  const priceAxisWidth = size.chart.instrumentAxisLabelWidth;
  const plotWidth = Math.max(chartWidth - priceAxisWidth, size.viewport.chartCompactMinHeight);
  const volumeHeight = indicators.volume ? size.chart.instrumentVolumeHeight : spacing.none;
  const bottomAxisHeight = spacing.xl + spacing.sm;
  const topPad = spacing.lg;
  const plotHeight = Math.max(chartHeight - topPad - bottomAxisHeight - volumeHeight - spacing.md, size.viewport.chartCompactMinHeight);
  const visibleCandles = useMemo(() => candles.slice(visibleStart, visibleStart + visibleCount), [candles, visibleCount, visibleStart]);
  const scale = useMemo(() => buildPriceScale(visibleCandles, instrument), [instrument, visibleCandles]);
  const chartMetrics = useMemo(
    () => ({
      bottomAxisHeight,
      chartHeight,
      chartWidth,
      plotHeight,
      plotWidth,
      priceAxisWidth,
      topPad,
      volumeHeight,
    }),
    [bottomAxisHeight, chartHeight, chartWidth, plotHeight, plotWidth, priceAxisWidth, topPad, volumeHeight],
  );

  useEffect(() => {
    const nextVisibleCount = Math.min(size.chart.detailSeriesLookback, Math.max(candles.length, spacing.xxl));
    setVisibleCount(nextVisibleCount);
    setVisibleStart(Math.max(candles.length - nextVisibleCount, spacing.none));
    setCrosshairIndex(candles.length > 0 ? candles.length - 1 : null);
  }, [candles.length, timeframe]);

  const animatedChartStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: panOffset.value }],
  }));

  const updateCrosshairFromX = (x: number) => {
    const index = xToGlobalIndex(x, plotWidth, visibleCandles.length, visibleStart);
    setCrosshairIndex(clamp(index, spacing.none, Math.max(candles.length - 1, spacing.none)));
  };

  const handleChartTap = (x: number, y: number) => {
    const nextIndex = xToGlobalIndex(x, plotWidth, visibleCandles.length, visibleStart);
    const nextPrice = yToPrice(y, scale, topPad, plotHeight);

    if (selectedDrawingId) {
      setDrawings((items) =>
        items.map((item) =>
          item.id === selectedDrawingId
            ? {
                ...item,
                endIndex: nextIndex,
                endPrice: nextPrice,
              }
            : item,
        ),
      );
      return;
    }

    const span = Math.max(Math.round(visibleCount / (spacing.sm + spacing.xxs)), lineWidth.selected);
    const nextDrawing = createDrawingShape(activeTool, nextIndex, nextPrice, span, instrument.pipSize);
    setDrawings((items) => [...items, nextDrawing]);
    setSelectedDrawingId(nextDrawing.id);
    setCrosshairIndex(clamp(nextIndex, spacing.none, Math.max(candles.length - 1, spacing.none)));
  };

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .onChange((event) => {
          panOffset.value = event.translationX * spacing.xxs;
        })
        .onEnd((event) => {
          const candleWidth = plotWidth / Math.max(visibleCount, lineWidth.strong);
          const shift = Math.round(-event.translationX / Math.max(candleWidth, lineWidth.strong));
          setVisibleStart((current) => clamp(current + shift, spacing.none, Math.max(candles.length - visibleCount, spacing.none)));
          panOffset.value = spacing.none;
        }),
    [candles.length, panOffset, plotWidth, visibleCount],
  );
  const pinchGesture = useMemo(
    () =>
      Gesture.Pinch()
        .runOnJS(true)
        .onEnd((event) => {
          const zoomIn = event.scale > 1;
          const nextCount = clamp(visibleCount + (zoomIn ? -spacing.lg : spacing.lg), spacing.lg + spacing.xxs, Math.min(candles.length || size.chart.detailSeriesLookback, size.chart.detailSeriesLookback + spacing.xxl));
          setVisibleCount(nextCount);
          setVisibleStart((current) => clamp(current + Math.round((visibleCount - nextCount) / lineWidth.selected), spacing.none, Math.max(candles.length - nextCount, spacing.none)));
        }),
    [candles.length, visibleCount],
  );
  const longPressGesture = useMemo(
    () =>
      Gesture.LongPress()
        .minDuration(size.viewport.discoverLayoutGestureDelayMs + size.viewport.discoverLayoutGestureDelayMs)
        .runOnJS(true)
        .onStart((event) => updateCrosshairFromX(event.x)),
    [plotWidth, visibleCandles.length, visibleStart],
  );
  const tapGesture = useMemo(
    () =>
      Gesture.Tap()
        .runOnJS(true)
        .onStart((event) => handleChartTap(event.x, event.y)),
    [activeTool, plotHeight, plotWidth, scale.max, scale.min, selectedDrawingId, visibleCandles.length, visibleCount, visibleStart],
  );
  const composedGesture = useMemo(() => Gesture.Simultaneous(panGesture, pinchGesture, longPressGesture, tapGesture), [longPressGesture, panGesture, pinchGesture, tapGesture]);
  const selectedCandle = crosshairIndex === null ? visibleCandles[visibleCandles.length - 1] : candles[crosshairIndex] ?? visibleCandles[visibleCandles.length - 1];
  const statusMessage = resolvedState === 'default' ? null : resolveStateCopy(resolvedState);

  return (
    <View style={StyleSheet.flatten([styles.surface, fullscreen && styles.fullscreenSurface, { backgroundColor: colors.surface.panel }])}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <AppText numberOfLines={1} variant="title.pageCompact">
            {instrument.symbol}
          </AppText>
          <AppText numberOfLines={1} tone="muted" variant="label.helper">
            {t('chart.label.ohlcv')} · {timeframe}
          </AppText>
        </View>
        <NativePressable
          accessibilityLabel={t(fullscreen ? 'chart.action.exitFullscreen' : 'chart.action.fullscreen')}
          minTouch={layout.touchTargetMin}
          onPress={fullscreen ? onRequestClose : onRequestFullscreen}
          style={StyleSheet.flatten([styles.iconButton, { backgroundColor: colors.surface.subtle }])}>
          <AppIcon name={fullscreen ? 'icon.system.close' : 'icon.system.more'} sizeVariant="xs" tone="tertiary" />
        </NativePressable>
      </View>

      {statusMessage ? (
        <View style={StyleSheet.flatten([styles.statusBanner, { backgroundColor: colors.status.warning.bg }])}>
          <AppText tone="amber" variant="label.control">
            {t(statusMessage.title)}
          </AppText>
          <AppText tone="muted" variant="caption">
            {t(statusMessage.body)}
          </AppText>
        </View>
      ) : null}

      <SegmentedTabs
        equalWidth
        items={chartTypeOptions.map((item) => ({ label: t(item.labelKey), value: item.value }))}
        onValueChange={(nextType) => setChartType(nextType)}
        value={chartType}
      />
      <SegmentedTabs
        containerStyle={styles.timeframeTabs}
        equalWidth={false}
        items={timeframeOptions.map((item) => ({ label: item, value: item }))}
        onValueChange={(nextTimeframe) => setTimeframe(nextTimeframe)}
        scrollable
        value={timeframe}
      />

      {resolvedState === 'loading' || resolvedState === 'empty' || resolvedState === 'error' || resolvedState === 'restricted' ? (
        <View style={styles.statePanel}>
          <AppIcon name={resolvedState === 'restricted' ? 'icon.status.rejected' : 'icon.trading.market'} sizeVariant="lg" tone={resolvedState === 'restricted' ? 'danger' : 'tertiary'} />
          <AppText variant="title.pageCompact">{t(resolveStateCopy(resolvedState).title)}</AppText>
          <AppText style={styles.stateText} tone="muted" variant="body.secondary">
            {t(resolveStateCopy(resolvedState).body)}
          </AppText>
        </View>
      ) : (
        <>
          <GestureDetector gesture={composedGesture} touchAction="none">
            <Animated.View style={[styles.chartShell, animatedChartStyle]}>
              <Svg height={chartHeight} width={chartWidth}>
                <Defs>
                  <LinearGradient id={`terminal-area-${instrument.id}`} x1="0" x2="0" y1="0" y2="1">
                    <Stop offset="0" stopColor={colors.brand.fg} stopOpacity={0.24} />
                    <Stop offset="1" stopColor={colors.brand.fg} stopOpacity={0.02} />
                  </LinearGradient>
                </Defs>
                <ChartGrid metrics={chartMetrics} />
                <PriceAxisLabels instrument={instrument} metrics={chartMetrics} scale={scale} />
                <TimeAxis candles={visibleCandles} locale={locale} metrics={chartMetrics} />
                <BidAskLines instrument={instrument} metrics={chartMetrics} scale={scale} />
                <CurrentPriceLine instrument={instrument} metrics={chartMetrics} scale={scale} />
                <HighLowMarkers instrument={instrument} metrics={chartMetrics} scale={scale} visibleCandles={visibleCandles} visibleStart={visibleStart} />
                <PrimarySeries
                  candles={candles}
                  chartType={chartType}
                  instrument={instrument}
                  metrics={chartMetrics}
                  scale={scale}
                  visibleCandles={visibleCandles}
                  visibleStart={visibleStart}
                />
                <IndicatorSeries candles={candles} indicators={indicators} instrument={instrument} metrics={chartMetrics} scale={scale} visibleStart={visibleStart} visibleCandles={visibleCandles} />
                <DrawingOverlay drawings={drawings} instrument={instrument} metrics={chartMetrics} scale={scale} selectedDrawingId={selectedDrawingId} visibleCount={visibleCandles.length} visibleStart={visibleStart} />
                {indicators.volume ? <VolumeBars metrics={chartMetrics} visibleCandles={visibleCandles} /> : null}
                {selectedCandle ? <Crosshair candle={selectedCandle} instrument={instrument} metrics={chartMetrics} scale={scale} visibleCandles={visibleCandles} visibleStart={visibleStart} /> : null}
              </Svg>
            </Animated.View>
          </GestureDetector>

          {selectedCandle ? <OhlcvPanel candle={selectedCandle} instrument={instrument} /> : null}

          <View style={styles.toolbarHeader}>
            <AppText tone="dim" variant="eyebrow">
              {t('chart.section.indicators')}
            </AppText>
            <View style={styles.toolbarActions}>
              <ToolChip active icon="icon.wallet.withdrawal" label={t('chart.action.reset')} onPress={() => resetView(candles, setVisibleStart, setVisibleCount, setCrosshairIndex)} />
            </View>
          </View>
          <ScrollView contentContainerStyle={styles.chipRow} horizontal showsHorizontalScrollIndicator={false}>
            {indicatorOptions.map((item) => (
              <ToolChip
                active={indicators[item.key]}
                icon={item.icon}
                key={item.key}
                label={t(item.labelKey)}
                onPress={() => setIndicators((current) => ({ ...current, [item.key]: !current[item.key] }))}
              />
            ))}
          </ScrollView>

          <View style={styles.toolbarHeader}>
            <AppText tone="dim" variant="eyebrow">
              {t('chart.section.drawings')}
            </AppText>
            <View style={styles.toolbarActions}>
              <ToolChip active={Boolean(selectedDrawingId)} icon="icon.system.delete" label={t('chart.action.delete')} onPress={() => deleteSelectedDrawing(selectedDrawingId, setDrawings, setSelectedDrawingId)} />
              <ToolChip active={drawings.length > 0} icon="icon.system.close" label={t('chart.action.clear')} onPress={() => clearDrawings(setDrawings, setSelectedDrawingId)} />
            </View>
          </View>
          <ScrollView contentContainerStyle={styles.chipRow} horizontal showsHorizontalScrollIndicator={false}>
            {drawingToolOptions.map((item) => (
              <ToolChip active={activeTool === item.key} icon={item.icon} key={item.key} label={t(item.labelKey)} onPress={() => setActiveTool(item.key)} />
            ))}
          </ScrollView>
          <ScrollView contentContainerStyle={styles.drawingRow} horizontal showsHorizontalScrollIndicator={false}>
            {drawings.length === 0 ? (
              <AppText tone="muted" variant="caption">
                {t('chart.drawing.none')}
              </AppText>
            ) : (
              drawings.map((item, index) => (
                <ToolChip
                  active={selectedDrawingId === item.id}
                  icon={drawingToolOptions.find((tool) => tool.key === item.tool)?.icon ?? 'icon.trading.market'}
                  key={item.id}
                  label={t('chart.drawing.selected', { index: index + 1 })}
                  onPress={() => setSelectedDrawingId(item.id)}
                />
              ))
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

function ChartGrid({ metrics }: { metrics: ChartMetrics }) {
  const { colors } = useProductSettings();
  const horizontalLines = [metrics.topPad, metrics.topPad + metrics.plotHeight / lineWidth.selected, metrics.topPad + metrics.plotHeight];
  const verticalLines = [metrics.plotWidth / 3, (metrics.plotWidth / 3) * 2];

  return (
    <>
      {horizontalLines.map((y) => (
        <Line key={`h-${y}`} stroke={colors.border.subtle} strokeOpacity={0.82} strokeWidth={lineWidth.hairline} x1={0} x2={metrics.plotWidth} y1={y} y2={y} />
      ))}
      {verticalLines.map((x) => (
        <Line key={`v-${x}`} stroke={colors.border.subtle} strokeOpacity={0.5} strokeWidth={lineWidth.hairline} x1={x} x2={x} y1={metrics.topPad} y2={metrics.topPad + metrics.plotHeight} />
      ))}
      <Line stroke={colors.border.default} strokeWidth={lineWidth.hairline} x1={metrics.plotWidth} x2={metrics.plotWidth} y1={metrics.topPad} y2={metrics.chartHeight - metrics.bottomAxisHeight} />
    </>
  );
}

function PrimarySeries({
  candles,
  chartType,
  instrument,
  metrics,
  scale,
  visibleCandles,
  visibleStart,
}: {
  candles: InstrumentCandle[];
  chartType: ChartType;
  instrument: Instrument;
  metrics: ChartMetrics;
  scale: PriceScale;
  visibleCandles: InstrumentCandle[];
  visibleStart: number;
}) {
  const { colors } = useProductSettings();
  const closePoints = visibleCandles.map((candle, index) => pointForCandle(index, candle.close, visibleCandles.length, metrics, scale));
  const linePath = buildLinePath(closePoints);

  if (chartType === 'line' || chartType === 'area') {
    const areaPath = `${linePath} L ${closePoints[closePoints.length - 1]?.x ?? 0} ${metrics.topPad + metrics.plotHeight} L ${closePoints[0]?.x ?? 0} ${metrics.topPad + metrics.plotHeight} Z`;
    return (
      <>
        {chartType === 'area' ? <Path d={areaPath} fill={`url(#terminal-area-${instrument.id})`} /> : null}
        <Path d={linePath} fill="none" stroke={colors.brand.fg} strokeLinejoin="round" strokeWidth={lineWidth.selected} />
      </>
    );
  }

  const candleWidth = Math.max(metrics.plotWidth / Math.max(visibleCandles.length, lineWidth.strong) - spacing.xxs, lineWidth.selected + lineWidth.strong);

  return (
    <>
      {visibleCandles.map((candle, index) => {
        const x = xForIndex(index, visibleCandles.length, metrics);
        const openY = priceToY(candle.open, scale, metrics.topPad, metrics.plotHeight);
        const closeY = priceToY(candle.close, scale, metrics.topPad, metrics.plotHeight);
        const highY = priceToY(candle.high, scale, metrics.topPad, metrics.plotHeight);
        const lowY = priceToY(candle.low, scale, metrics.topPad, metrics.plotHeight);
        const isUp = candle.close >= candle.open;
        const fill = isUp ? colors.market.up.fg : colors.market.down.fg;
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(Math.abs(closeY - openY), lineWidth.selected);

        return (
          <Svg key={`${candles[visibleStart + index]?.time ?? index}-candle`}>
            <Line stroke={fill} strokeWidth={lineWidth.strong} x1={x} x2={x} y1={highY} y2={lowY} />
            <Rect fill={isUp ? colors.surface.panel : fill} height={bodyHeight} stroke={fill} strokeWidth={lineWidth.strong} width={candleWidth} x={x - candleWidth / 2} y={bodyTop} />
          </Svg>
        );
      })}
    </>
  );
}

function IndicatorSeries({
  candles,
  indicators,
  instrument,
  metrics,
  scale,
  visibleCandles,
  visibleStart,
}: {
  candles: InstrumentCandle[];
  indicators: Record<IndicatorKey, boolean>;
  instrument: Instrument;
  metrics: ChartMetrics;
  scale: PriceScale;
  visibleCandles: InstrumentCandle[];
  visibleStart: number;
}) {
  const { colors } = useProductSettings();
  const ma = useMemo(() => calculateSma(candles, spacing.sm + lineWidth.strong), [candles]);
  const ema = useMemo(() => calculateEma(candles, spacing.sm + lineWidth.strong), [candles]);
  const boll = useMemo(() => calculateBoll(candles, spacing.lg + spacing.xs), [candles]);
  const rsi = useMemo(() => calculateOscillator(candles, spacing.lg), [candles]);
  const macd = useMemo(() => calculateOscillator(candles, spacing.xs + spacing.xs), [candles]);

  return (
    <>
      {indicators.ma ? <Path d={seriesPath(ma.slice(visibleStart, visibleStart + visibleCandles.length), visibleCandles.length, metrics, scale)} fill="none" stroke={colors.chart.categorical[0]} strokeWidth={lineWidth.strong} /> : null}
      {indicators.ema ? <Path d={seriesPath(ema.slice(visibleStart, visibleStart + visibleCandles.length), visibleCandles.length, metrics, scale)} fill="none" stroke={colors.chart.categorical[1]} strokeWidth={lineWidth.strong} /> : null}
      {indicators.boll ? (
        <>
          <Path d={seriesPath(boll.upper.slice(visibleStart, visibleStart + visibleCandles.length), visibleCandles.length, metrics, scale)} fill="none" stroke={colors.chart.categorical[2]} strokeDasharray={`${spacing.xs} ${spacing.xs}`} strokeWidth={lineWidth.strong} />
          <Path d={seriesPath(boll.lower.slice(visibleStart, visibleStart + visibleCandles.length), visibleCandles.length, metrics, scale)} fill="none" stroke={colors.chart.categorical[2]} strokeDasharray={`${spacing.xs} ${spacing.xs}`} strokeWidth={lineWidth.strong} />
        </>
      ) : null}
      {indicators.rsi ? <OscillatorPath color={colors.chart.categorical[3]} metrics={metrics} values={rsi.slice(visibleStart, visibleStart + visibleCandles.length)} /> : null}
      {indicators.macd ? <OscillatorPath color={colors.chart.categorical[4]} metrics={metrics} values={macd.slice(visibleStart, visibleStart + visibleCandles.length)} /> : null}
      {indicators.ma || indicators.ema || indicators.boll || indicators.rsi || indicators.macd ? (
        <SvgText fill={colors.text.tertiary} fontSize={typography.microLabel.fontSize} x={spacing.sm} y={metrics.topPad - spacing.xs}>
          {instrument.symbol} MA/EMA/BOLL/RSI/MACD
        </SvgText>
      ) : null}
    </>
  );
}

function OscillatorPath({ color, metrics, values }: { color: string; metrics: ChartMetrics; values: number[] }) {
  const panelTop = metrics.topPad + metrics.plotHeight - size.chart.instrumentVolumeHeight;
  const panelHeight = size.chart.instrumentVolumeHeight - spacing.md;
  const points = values.map((value, index) => {
    const x = xForIndex(index, values.length, metrics);
    const y = panelTop + panelHeight - (value / 100) * panelHeight;
    return { x, y };
  });

  return <Path d={buildLinePath(points)} fill="none" opacity={0.82} stroke={color} strokeWidth={lineWidth.strong} />;
}

function VolumeBars({ metrics, visibleCandles }: { metrics: ChartMetrics; visibleCandles: InstrumentCandle[] }) {
  const { colors } = useProductSettings();
  const maxVolume = Math.max(...visibleCandles.map((candle) => candle.volume), lineWidth.strong);
  const barWidth = Math.max(metrics.plotWidth / Math.max(visibleCandles.length, lineWidth.strong) - spacing.xxs, lineWidth.selected);
  const baseY = metrics.topPad + metrics.plotHeight + spacing.sm + metrics.volumeHeight;

  return (
    <>
      {visibleCandles.map((candle, index) => {
        const height = Math.max((candle.volume / maxVolume) * metrics.volumeHeight, lineWidth.selected);
        const x = xForIndex(index, visibleCandles.length, metrics) - barWidth / 2;
        const y = baseY - height;
        const fill = candle.close >= candle.open ? colors.market.up.fg : colors.market.down.fg;
        return <Rect fill={fill} height={height} key={`${candle.time}-volume`} opacity={0.42} rx={lineWidth.selected} width={barWidth} x={x} y={y} />;
      })}
    </>
  );
}

function PriceAxisLabels({ instrument, metrics, scale }: { instrument: Instrument; metrics: ChartMetrics; scale: PriceScale }) {
  const { colors } = useProductSettings();
  const labels = [scale.max, (scale.max + scale.min) / 2, scale.min];

  return (
    <>
      {labels.map((label) => (
        <SvgText fill={colors.text.tertiary} fontSize={typography.microLabel.fontSize} key={label} x={metrics.plotWidth + spacing.xs} y={priceToY(label, scale, metrics.topPad, metrics.plotHeight) + spacing.xs}>
          {formatPrice(instrument, label)}
        </SvgText>
      ))}
    </>
  );
}

function TimeAxis({ candles, locale, metrics }: { candles: InstrumentCandle[]; locale: string; metrics: ChartMetrics }) {
  const { colors, t } = useProductSettings();
  const labels = [candles[0], candles[Math.floor(candles.length / 2)], candles[candles.length - 1]].filter(Boolean);
  const formatter = new Intl.DateTimeFormat(locale, { day: '2-digit', hour: '2-digit', minute: '2-digit', month: '2-digit' });

  return (
    <>
      {labels.map((candle, index) => {
        const x = index === 0 ? spacing.xs : index === 1 ? metrics.plotWidth / 2 - spacing.xl : metrics.plotWidth - size.chart.instrumentAxisLabelWidth;
        return (
          <SvgText fill={colors.text.tertiary} fontSize={typography.microLabel.fontSize} key={candle.time} x={x} y={metrics.chartHeight - spacing.sm}>
            {index === 1 ? t('chart.label.time') : formatter.format(new Date(candle.time))}
          </SvgText>
        );
      })}
    </>
  );
}

function BidAskLines({ instrument, metrics, scale }: { instrument: Instrument; metrics: ChartMetrics; scale: PriceScale }) {
  const { colors, t } = useProductSettings();
  return (
    <>
      <ReferenceLine label={`${t('chart.label.bid')} ${formatPrice(instrument, instrument.bid)}`} metrics={metrics} scale={scale} tone={colors.market.down.fg} value={instrument.bid} />
      <ReferenceLine label={`${t('chart.label.ask')} ${formatPrice(instrument, instrument.ask)}`} metrics={metrics} scale={scale} tone={colors.market.up.fg} value={instrument.ask} />
    </>
  );
}

function CurrentPriceLine({ instrument, metrics, scale }: { instrument: Instrument; metrics: ChartMetrics; scale: PriceScale }) {
  const { colors, t } = useProductSettings();
  return <ReferenceLine label={`${t('chart.label.current')} ${formatPrice(instrument, (instrument.bid + instrument.ask) / 2)}`} metrics={metrics} scale={scale} tone={colors.brand.fg} value={(instrument.bid + instrument.ask) / 2} />;
}

function ReferenceLine({ label, metrics, scale, tone, value }: { label: string; metrics: ChartMetrics; scale: PriceScale; tone: string; value: number }) {
  const y = priceToY(value, scale, metrics.topPad, metrics.plotHeight);

  return (
    <>
      <Line stroke={tone} strokeDasharray={`${spacing.xs} ${spacing.xs}`} strokeOpacity={0.72} strokeWidth={lineWidth.hairline} x1={0} x2={metrics.plotWidth} y1={y} y2={y} />
      <SvgText fill={tone} fontSize={typography.microLabel.fontSize} x={metrics.plotWidth + spacing.xs} y={y - spacing.xs}>
        {label}
      </SvgText>
    </>
  );
}

function HighLowMarkers({
  instrument,
  metrics,
  scale,
  visibleCandles,
  visibleStart,
}: {
  instrument: Instrument;
  metrics: ChartMetrics;
  scale: PriceScale;
  visibleCandles: InstrumentCandle[];
  visibleStart: number;
}) {
  const { colors, t } = useProductSettings();
  if (visibleCandles.length === 0) {
    return null;
  }
  const high = visibleCandles.reduce<{ candle: InstrumentCandle; index: number }>((result, candle, index) => (candle.high > result.candle.high ? { candle, index } : result), { candle: visibleCandles[0], index: spacing.none });
  const low = visibleCandles.reduce<{ candle: InstrumentCandle; index: number }>((result, candle, index) => (candle.low < result.candle.low ? { candle, index } : result), { candle: visibleCandles[0], index: spacing.none });

  return (
    <>
      <MarkerLabel color={colors.status.success.fg} index={high.index + visibleStart} label={`${t('chart.label.high')} ${formatPrice(instrument, high.candle.high)}`} metrics={metrics} price={high.candle.high} scale={scale} visibleCount={visibleCandles.length} visibleStart={visibleStart} />
      <MarkerLabel color={colors.status.danger.fg} index={low.index + visibleStart} label={`${t('chart.label.low')} ${formatPrice(instrument, low.candle.low)}`} metrics={metrics} price={low.candle.low} scale={scale} visibleCount={visibleCandles.length} visibleStart={visibleStart} />
    </>
  );
}

function MarkerLabel({ color, index, label, metrics, price, scale, visibleCount, visibleStart }: { color: string; index: number; label: string; metrics: ChartMetrics; price: number; scale: PriceScale; visibleCount: number; visibleStart: number }) {
  const x = xForGlobalIndex(index, visibleStart, visibleCount, metrics);
  const y = priceToY(price, scale, metrics.topPad, metrics.plotHeight);

  return (
    <>
      <Line stroke={color} strokeWidth={lineWidth.selected} x1={Math.max(spacing.none, x - spacing.lg)} x2={x + spacing.lg} y1={y} y2={y} />
      <SvgText fill={color} fontSize={typography.microLabel.fontSize} x={Math.min(x + spacing.xs, metrics.plotWidth - size.chart.instrumentAxisLabelWidth)} y={y - spacing.xs}>
        {label}
      </SvgText>
    </>
  );
}

function Crosshair({ candle, instrument, metrics, scale, visibleCandles, visibleStart }: { candle: InstrumentCandle; instrument: Instrument; metrics: ChartMetrics; scale: PriceScale; visibleCandles: InstrumentCandle[]; visibleStart: number }) {
  const { colors } = useProductSettings();
  const globalIndex = Math.max(visibleStart, visibleStart + visibleCandles.findIndex((item) => item.time === candle.time));
  const x = xForGlobalIndex(globalIndex, visibleStart, visibleCandles.length, metrics);
  const y = priceToY(candle.close, scale, metrics.topPad, metrics.plotHeight);

  return (
    <>
      <Line stroke={colors.text.tertiary} strokeDasharray={`${spacing.xs} ${spacing.xs}`} strokeOpacity={0.78} strokeWidth={lineWidth.hairline} x1={x} x2={x} y1={metrics.topPad} y2={metrics.topPad + metrics.plotHeight + metrics.volumeHeight} />
      <Line stroke={colors.text.tertiary} strokeDasharray={`${spacing.xs} ${spacing.xs}`} strokeOpacity={0.78} strokeWidth={lineWidth.hairline} x1={0} x2={metrics.plotWidth} y1={y} y2={y} />
      <Circle cx={x} cy={y} fill={colors.surface.panel} r={spacing.xs + lineWidth.strong} stroke={colors.brand.fg} strokeWidth={lineWidth.strong} />
      <SvgText fill={colors.text.secondary} fontSize={typography.microLabel.fontSize} x={metrics.plotWidth + spacing.xs} y={y + spacing.xs}>
        {formatPrice(instrument, candle.close)}
      </SvgText>
    </>
  );
}

function DrawingOverlay({
  drawings,
  metrics,
  scale,
  selectedDrawingId,
  visibleCount,
  visibleStart,
}: {
  drawings: DrawingShape[];
  instrument: Instrument;
  metrics: ChartMetrics;
  scale: PriceScale;
  selectedDrawingId: string | null;
  visibleCount: number;
  visibleStart: number;
}) {
  const { colors } = useProductSettings();

  return (
    <>
      {drawings.map((drawing) => {
        const color = selectedDrawingId === drawing.id ? colors.brand.fg : colors.text.tertiary;
        const startX = xForGlobalIndex(drawing.startIndex, visibleStart, visibleCount, metrics);
        const endX = xForGlobalIndex(drawing.endIndex, visibleStart, visibleCount, metrics);
        const startY = priceToY(drawing.startPrice, scale, metrics.topPad, metrics.plotHeight);
        const endY = priceToY(drawing.endPrice, scale, metrics.topPad, metrics.plotHeight);

        if (drawing.tool === 'horizontal') {
          return <Line key={drawing.id} stroke={color} strokeWidth={lineWidth.selected} x1={0} x2={metrics.plotWidth} y1={startY} y2={startY} />;
        }

        if (drawing.tool === 'vertical') {
          return <Line key={drawing.id} stroke={color} strokeWidth={lineWidth.selected} x1={startX} x2={startX} y1={metrics.topPad} y2={metrics.topPad + metrics.plotHeight} />;
        }

        if (drawing.tool === 'rectangle') {
          return <Rect fill={colors.overlay.brand.subtle} height={Math.abs(endY - startY)} key={drawing.id} stroke={color} strokeWidth={lineWidth.strong} width={Math.abs(endX - startX)} x={Math.min(startX, endX)} y={Math.min(startY, endY)} />;
        }

        if (drawing.tool === 'fibonacci') {
          const yLevels = [0, 0.236, 0.382, 0.5, 0.618, 1].map((ratio) => startY + (endY - startY) * ratio);
          return (
            <Svg key={drawing.id}>
              {yLevels.map((y, index) => (
                <Line key={`${drawing.id}-${index}`} stroke={color} strokeOpacity={index === 0 || index === yLevels.length - 1 ? 0.95 : 0.5} strokeWidth={lineWidth.strong} x1={Math.min(startX, endX)} x2={Math.max(startX, endX)} y1={y} y2={y} />
              ))}
            </Svg>
          );
        }

        return <Line key={drawing.id} stroke={color} strokeWidth={lineWidth.selected} x1={startX} x2={endX} y1={startY} y2={endY} />;
      })}
    </>
  );
}

function OhlcvPanel({ candle, instrument }: { candle: InstrumentCandle; instrument: Instrument }) {
  const { colors, locale, t } = useProductSettings();
  const formatter = new Intl.DateTimeFormat(locale, { day: '2-digit', hour: '2-digit', minute: '2-digit', month: '2-digit' });
  const values = [
    ['O', formatPrice(instrument, candle.open)],
    ['H', formatPrice(instrument, candle.high)],
    ['L', formatPrice(instrument, candle.low)],
    ['C', formatPrice(instrument, candle.close)],
    ['V', formatNumber(candle.volume, 0, locale)],
  ];

  return (
    <View style={StyleSheet.flatten([styles.ohlcvPanel, { backgroundColor: colors.surface.subtle }])}>
      <AppText numberOfLines={1} tone="dim" variant="caption">
        {t('chart.label.time')} {formatter.format(new Date(candle.time))}
      </AppText>
      <View style={styles.ohlcvValues}>
        {values.map(([label, value]) => (
          <View key={label} style={styles.ohlcvItem}>
            <AppText tone="dim" variant="label.minimum">
              {label}
            </AppText>
            <AppText numberOfLines={1} variant="label.default">
              {value}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

function ToolChip({ active, icon, label, onPress }: { active: boolean; icon: AppIconName; label: string; onPress?: () => void }) {
  const { colors } = useProductSettings();

  return (
    <NativePressable
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      minTouch={layout.touchTargetMin}
      onPress={onPress}
      style={StyleSheet.flatten([
        styles.toolChip,
        {
          backgroundColor: active ? colors.brand.bg : colors.surface.subtle,
          borderColor: active ? colors.brand.border : colors.border.subtle,
        },
      ])}>
      <AppIcon name={icon} sizeVariant="xs" tone={active ? 'up' : 'tertiary'} />
      <AppText numberOfLines={1} tone={active ? 'brand' : 'muted'} variant="label.minimum">
        {label}
      </AppText>
    </NativePressable>
  );
}

type ChartMetrics = {
  bottomAxisHeight: number;
  chartHeight: number;
  chartWidth: number;
  plotHeight: number;
  plotWidth: number;
  priceAxisWidth: number;
  topPad: number;
  volumeHeight: number;
};

type PriceScale = {
  max: number;
  min: number;
};

function buildPriceScale(candles: InstrumentCandle[], instrument: Instrument): PriceScale {
  const values = candles.length > 0 ? candles.flatMap((candle) => [candle.high, candle.low]) : [instrument.dayHigh, instrument.dayLow, instrument.bid, instrument.ask];
  const max = Math.max(...values, instrument.bid, instrument.ask);
  const min = Math.min(...values, instrument.bid, instrument.ask);
  const padding = Math.max((max - min) * 0.12, instrument.pipSize * spacing.xl);

  return {
    max: max + padding,
    min: Math.max(instrument.pipSize, min - padding),
  };
}

function priceToY(value: number, scale: PriceScale, topPad: number, plotHeight: number) {
  const range = scale.max - scale.min || lineWidth.strong;
  return topPad + plotHeight - ((value - scale.min) / range) * plotHeight;
}

function yToPrice(y: number, scale: PriceScale, topPad: number, plotHeight: number) {
  const range = scale.max - scale.min || lineWidth.strong;
  const progress = clamp((y - topPad) / Math.max(plotHeight, lineWidth.strong), spacing.none, lineWidth.strong);
  return scale.max - progress * range;
}

function xForIndex(index: number, count: number, metrics: ChartMetrics) {
  return (index / Math.max(count - 1, lineWidth.strong)) * metrics.plotWidth;
}

function xForGlobalIndex(index: number, visibleStart: number, visibleCount: number, metrics: ChartMetrics) {
  return xForIndex(index - visibleStart, visibleCount, metrics);
}

function xToGlobalIndex(x: number, plotWidth: number, visibleCount: number, visibleStart: number) {
  const localIndex = Math.round((clamp(x, spacing.none, plotWidth) / Math.max(plotWidth, lineWidth.strong)) * Math.max(visibleCount - 1, spacing.none));
  return visibleStart + localIndex;
}

function pointForCandle(index: number, price: number, count: number, metrics: ChartMetrics, scale: PriceScale) {
  return {
    x: xForIndex(index, count, metrics),
    y: priceToY(price, scale, metrics.topPad, metrics.plotHeight),
  };
}

function buildLinePath(points: { x: number; y: number }[]) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
}

function seriesPath(values: number[], count: number, metrics: ChartMetrics, scale: PriceScale) {
  return buildLinePath(values.map((value, index) => pointForCandle(index, value, count, metrics, scale)));
}

function calculateSma(candles: InstrumentCandle[], period: number) {
  return candles.map((_, index) => {
    const source = candles.slice(Math.max(spacing.none, index - period + lineWidth.strong), index + lineWidth.strong);
    return source.reduce<number>((sum, candle) => sum + candle.close, spacing.none) / source.length;
  });
}

function calculateEma(candles: InstrumentCandle[], period: number) {
  const multiplier = lineWidth.selected / (period + lineWidth.strong);
  return candles.reduce<number[]>((values, candle, index) => {
    values[index] = index === 0 ? candle.close : candle.close * multiplier + values[index - 1] * (lineWidth.strong - multiplier);
    return values;
  }, []);
}

function calculateBoll(candles: InstrumentCandle[], period: number) {
  const middle = calculateSma(candles, period);
  const upper = candles.map((_, index) => {
    const source = candles.slice(Math.max(spacing.none, index - period + lineWidth.strong), index + lineWidth.strong);
    const mean = middle[index];
    const deviation = Math.sqrt(source.reduce<number>((sum, candle) => sum + (candle.close - mean) ** lineWidth.selected, spacing.none) / source.length);
    return mean + deviation * lineWidth.selected;
  });
  const lower = candles.map((_, index) => {
    const source = candles.slice(Math.max(spacing.none, index - period + lineWidth.strong), index + lineWidth.strong);
    const mean = middle[index];
    const deviation = Math.sqrt(source.reduce<number>((sum, candle) => sum + (candle.close - mean) ** lineWidth.selected, spacing.none) / source.length);
    return mean - deviation * lineWidth.selected;
  });

  return { lower, middle, upper };
}

function calculateOscillator(candles: InstrumentCandle[], period: number) {
  return candles.map((candle, index) => {
    const previous = candles[Math.max(index - period, spacing.none)] ?? candle;
    const change = candle.close - previous.close;
    const normalized = 50 + (change / Math.max(Math.abs(previous.close) * 0.01, lineWidth.strong)) * 50;
    return clamp(normalized, spacing.none, 100);
  });
}

function createDrawingShape(tool: DrawingTool, index: number, price: number, span: number, pipSize: number): DrawingShape {
  return {
    endIndex: index + span,
    endPrice: tool === 'horizontal' || tool === 'vertical' ? price : price + pipSize * span,
    id: `${tool}-${Date.now()}`,
    startIndex: index,
    startPrice: price,
    tool,
  };
}

function deleteSelectedDrawing(selectedDrawingId: string | null, setDrawings: (updater: (items: DrawingShape[]) => DrawingShape[]) => void, setSelectedDrawingId: (value: string | null) => void) {
  if (!selectedDrawingId) {
    return;
  }
  setDrawings((items) => items.filter((item) => item.id !== selectedDrawingId));
  setSelectedDrawingId(null);
}

function clearDrawings(setDrawings: (items: DrawingShape[]) => void, setSelectedDrawingId: (value: string | null) => void) {
  setDrawings([]);
  setSelectedDrawingId(null);
}

function resetView(candles: InstrumentCandle[], setVisibleStart: (value: number) => void, setVisibleCount: (value: number) => void, setCrosshairIndex: (value: number | null) => void) {
  const nextVisibleCount = Math.min(size.chart.detailSeriesLookback, Math.max(candles.length, spacing.xxl));
  setVisibleCount(nextVisibleCount);
  setVisibleStart(Math.max(candles.length - nextVisibleCount, spacing.none));
  setCrosshairIndex(candles.length > 0 ? candles.length - 1 : null);
}

function resolveChartState(instrument: Instrument, candles: InstrumentCandle[], state?: TradingTerminalChartState): TradingTerminalChartState {
  if (state && state !== 'default') {
    return state;
  }

  if (instrument.marketStatus === 'restricted' || instrument.quoteStatus === 'restricted') {
    return 'restricted';
  }

  if (candles.length === 0) {
    return 'empty';
  }

  if (instrument.marketStatus === 'closed' || instrument.quoteStatus === 'closed') {
    return 'market_closed';
  }

  if (instrument.quoteStatus === 'stale' || instrument.quoteStatus === 'delayed') {
    return 'quote_stale';
  }

  return 'default';
}

function resolveStateCopy(state: TradingTerminalChartState) {
  const map: Record<TradingTerminalChartState, { body: TranslationChartKey; title: TranslationChartKey }> = {
    default: { body: 'chart.state.loading.body', title: 'chart.state.loading.title' },
    empty: { body: 'chart.state.empty.body', title: 'chart.state.empty.title' },
    error: { body: 'chart.state.error.body', title: 'chart.state.error.title' },
    loading: { body: 'chart.state.loading.body', title: 'chart.state.loading.title' },
    market_closed: { body: 'chart.state.marketClosed.body', title: 'chart.state.marketClosed.title' },
    quote_stale: { body: 'chart.state.quoteStale.body', title: 'chart.state.quoteStale.title' },
    restricted: { body: 'chart.state.restricted.body', title: 'chart.state.restricted.title' },
  };

  return map[state];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const styles = StyleSheet.create({
  chartShell: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    overflow: 'hidden',
  },
  chipRow: {
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  drawingRow: {
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: layout.touchTargetMin,
    paddingRight: spacing.sm,
  },
  fullscreenSurface: {
    borderRadius: radius.none,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: layout.cardPaddingX,
    paddingTop: spacing.xl,
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: spacing.none,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: radius.full,
    justifyContent: 'center',
  },
  ohlcvItem: {
    gap: spacing.xxs,
    minWidth: layout.touchTargetMin,
  },
  ohlcvPanel: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    gap: spacing.sm,
    padding: spacing.md,
  },
  ohlcvValues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statePanel: {
    alignItems: 'center',
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    gap: spacing.sm,
    minHeight: size.chart.instrumentTrendHeight,
    justifyContent: 'center',
    paddingHorizontal: layout.cardPaddingX,
    paddingVertical: layout.cardPaddingY,
  },
  stateText: {
    textAlign: 'center',
  },
  statusBanner: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    gap: spacing.xs,
    padding: spacing.md,
  },
  surface: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  timeframeTabs: {
    minHeight: size.tab.pillMinHeight,
  },
  toolbarActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  toolbarHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  toolChip: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
});
