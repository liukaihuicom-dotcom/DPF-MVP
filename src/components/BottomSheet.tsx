import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, useWindowDimensions, View, type LayoutChangeEvent } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';
import {
  BottomSheetFooter as GorhomBottomSheetFooter,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
  type BottomSheetBackdropProps,
  type BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useProductSettings } from '@/src/settings/ProductSettings';
import { lineWidth, layout, radius, spacing } from '@/src/theme/tokens';

import { ActionButton, type ActionButtonTone, type ActionButtonVariant } from './ActionButton';
import { AppIcon, type AppIconName } from './AppIcon';
import { HeaderIconButton, HeaderIconSlot } from './HeaderIconButton';
import { AppText } from './Typography';

export type BottomSheetAction = {
  accessibilityLabel?: string;
  disabled?: boolean;
  icon?: AppIconName;
  label: string;
  loading?: boolean;
  onPress: () => false | void;
  tone?: ActionButtonTone;
  variant?: ActionButtonVariant;
};

export type BottomSheetHeaderAction = {
  accessibilityLabel: string;
  icon: AppIconName;
  onPress: () => void;
};

export type BottomSheetHeaderOptions = {
  leftAction?: BottomSheetHeaderAction;
  leftIcon?: AppIconName;
  rightAction?: BottomSheetHeaderAction;
  /** @deprecated Use `rightAction` for explicit business actions. */
  onRightPress?: () => void;
  /** @deprecated Use `rightAction.accessibilityLabel`. */
  rightAccessibilityLabel?: string;
  /** @deprecated Use `rightAction.icon`. */
  rightIcon?: AppIconName;
  /** @deprecated Put supporting context in the content area by default. */
  subtitle?: string;
  title: string;
};

export type BottomSheetOptions = {
  content: ReactNode;
  contentSizing?: 'auto' | 'fill';
  footer?: ReactNode | BottomSheetAction[];
  header?: false | BottomSheetHeaderOptions;
  onDismiss?: () => void;
  snapPoints?: Array<string | number>;
  /** @deprecated Use `header.title` or `header: false` so the header mode is explicit. */
  subtitle?: string;
  /** @deprecated Use `header.title` or `header: false` so the header mode is explicit. */
  title?: string;
};

type BottomSheetPresetBaseOptions = Pick<BottomSheetOptions, 'content' | 'contentSizing' | 'footer' | 'onDismiss' | 'snapPoints'>;
type BottomSheetHeaderPresetOptions = BottomSheetPresetBaseOptions & BottomSheetHeaderOptions;

export const bottomSheetPresets = {
  actionMenu(options: BottomSheetPresetBaseOptions): BottomSheetOptions {
    return {
      ...options,
      header: false,
    };
  },
  detail(options: BottomSheetHeaderPresetOptions): BottomSheetOptions {
    const { content, contentSizing, footer, onDismiss, snapPoints, ...header } = options;

    return {
      content,
      contentSizing,
      footer,
      header,
      onDismiss,
      snapPoints,
    };
  },
  selection(options: BottomSheetHeaderPresetOptions): BottomSheetOptions {
    const { content, contentSizing, footer, onDismiss, snapPoints, ...header } = options;

    return {
      content,
      contentSizing,
      footer,
      header,
      onDismiss,
      snapPoints,
    };
  },
};

type BottomSheetContextValue = {
  back: () => void;
  hide: () => void;
  push: (options: BottomSheetOptions) => void;
  show: (options: BottomSheetOptions) => void;
};

const TOP_RESERVED_SPACE = layout.topReservedSpace;
const MAX_PAGE_SHEET_WIDTH = layout.appMaxWidth;
const SHEET_HEADER_HEIGHT = layout.sheetHeaderHeight;

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);
const BottomSheetOptionsContext = createContext<BottomSheetOptions | null>(null);
const BottomSheetStackDepthContext = createContext(0);

export function BottomSheetProvider({ children }: PropsWithChildren) {
  const [stack, setStack] = useState<BottomSheetOptions[]>([]);
  const hide = useCallback(() => {
    setStack((current) => {
      current.at(-1)?.onDismiss?.();
      return [];
    });
  }, []);
  const show = useCallback((nextOptions: BottomSheetOptions) => setStack([nextOptions]), []);
  const push = useCallback((nextOptions: BottomSheetOptions) => setStack((current) => [...current, nextOptions]), []);
  const back = useCallback(() => {
    setStack((current) => (current.length > 1 ? current.slice(0, -1) : []));
  }, []);
  const value = useMemo(() => ({ back, hide, push, show }), [back, hide, push, show]);
  const options = stack.at(-1) ?? null;

  return (
    <BottomSheetContext.Provider value={value}>
      <BottomSheetStackDepthContext.Provider value={stack.length}>
        <BottomSheetOptionsContext.Provider value={options}>
          <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
        </BottomSheetOptionsContext.Provider>
      </BottomSheetStackDepthContext.Provider>
    </BottomSheetContext.Provider>
  );
}

export function useBottomSheet() {
  const context = useContext(BottomSheetContext);

  if (!context) {
    throw new Error('useBottomSheet must be used inside BottomSheetProvider');
  }

  return context;
}

export function GlobalBottomSheetHost() {
  const options = useContext(BottomSheetOptionsContext);
  const stackDepth = useContext(BottomSheetStackDepthContext);
  const { back, hide } = useBottomSheet();
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { locale, colors } = useProductSettings();
  const modalRef = useRef<BottomSheetModal>(null);
  const sheetEntranceProgress = useSharedValue(0);
  const [backdropInteractive, setBackdropInteractive] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);
  const maxHeight = Math.max(1, height - insets.top - TOP_RESERVED_SPACE);
  const sheetWidth = Math.min(width, MAX_PAGE_SHEET_WIDTH);
  const horizontalInset = Math.max(0, (width - sheetWidth) / 2);
  const backdropColor = colors.overlay.backdrop;
  const sheetBackgroundColor = colors.surface.canvas;
  const hasFooter = Boolean(options?.footer);
  const snapPoints = useMemo(() => {
    if (options?.snapPoints?.length) {
      return options.snapPoints;
    }

    return [];
  }, [options?.snapPoints]);
  const hasExplicitSnapPoints = snapPoints.length > 0;
  const maxContentHeight = hasExplicitSnapPoints ? resolveMaxSnapPointHeight(snapPoints, maxHeight) : maxHeight;
  const handleFooterHeightChange = useCallback((nextHeight: number) => {
    setFooterHeight((currentHeight) => (Math.abs(currentHeight - nextHeight) > 1 ? nextHeight : currentHeight));
  }, []);
  const footerComponent = useCallback(
    (props: BottomSheetFooterProps) => (
      options?.footer ? (
        <AppBottomSheetFooter
          {...props}
          backgroundColor={sheetBackgroundColor}
          entranceProgress={sheetEntranceProgress}
          footer={options.footer}
          hide={hide}
          onHeightChange={handleFooterHeightChange}
        />
      ) : null
    ),
    [handleFooterHeightChange, hide, options?.footer, sheetBackgroundColor, sheetEntranceProgress],
  );

  useEffect(() => {
    if (options) {
      setBackdropInteractive(false);
      setFooterHeight(0);
      sheetEntranceProgress.value = 0;
      modalRef.current?.present();
      sheetEntranceProgress.value = withTiming(1, { duration: 220 });
      const timer = setTimeout(() => {
        setBackdropInteractive(true);
      }, 250);

      return () => clearTimeout(timer);
    } else {
      setBackdropInteractive(false);
      sheetEntranceProgress.value = 0;
      modalRef.current?.dismiss();
    }
  }, [options, sheetEntranceProgress]);

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => <AppBottomSheetBackdrop {...props} backgroundColor={backdropColor} />, [backdropColor]);
  if (!options) {
    return null;
  }

  const headerOptions = resolveHeaderOptions(options);

  return (
    <>
      <Pressable
        accessibilityElementsHidden
        accessible={false}
        disabled={!backdropInteractive}
        importantForAccessibility="no-hide-descendants"
        onPress={hide}
        style={StyleSheet.flatten([styles.hostBackdrop, { backgroundColor: backdropColor, height, width }])}
      />
      <BottomSheetModal
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: sheetBackgroundColor }}
        containerStyle={styles.modalContainer}
        detached={false}
        enableContentPanningGesture
        enableDynamicSizing={!hasExplicitSnapPoints}
        enablePanDownToClose
        footerComponent={options.footer ? footerComponent : undefined}
        handleIndicatorStyle={{ backgroundColor: colors.border.default, width: 40 }}
        handleStyle={styles.handle}
        index={0}
        keyboardBlurBehavior="restore"
        maxDynamicContentSize={maxHeight}
        onDismiss={hide}
        ref={modalRef}
        snapPoints={snapPoints}
        style={StyleSheet.flatten([styles.modal, { borderColor: colors.border.subtle, marginLeft: horizontalInset, width: sheetWidth }])}
        topInset={insets.top + TOP_RESERVED_SPACE}>
        {headerOptions ? (
          <BottomSheetHeader
            back={back}
            backgroundColor={sheetBackgroundColor}
            entranceProgress={sheetEntranceProgress}
            header={headerOptions}
            isNested={stackDepth > 1}
            locale={locale}
          />
        ) : null}
        <BottomSheetContent
          backgroundColor={sheetBackgroundColor}
          entranceProgress={sheetEntranceProgress}
          footerHeight={footerHeight}
          hasFooter={Boolean(options.footer)}
          maxHeight={maxContentHeight}>
          {options.content}
        </BottomSheetContent>
      </BottomSheetModal>
    </>
  );
}

function resolveMaxSnapPointHeight(snapPoints: Array<string | number>, maxHeight: number) {
  const resolvedHeights = snapPoints
    .map((snapPoint) => {
      if (typeof snapPoint === 'number') {
        return snapPoint;
      }

      const percentage = snapPoint.endsWith('%') ? Number(snapPoint.slice(0, -1)) : Number.NaN;
      if (Number.isFinite(percentage)) {
        return maxHeight * (percentage / 100);
      }

      return null;
    })
    .filter((height): height is number => typeof height === 'number' && Number.isFinite(height) && height > 0);

  return Math.max(1, Math.min(maxHeight, resolvedHeights.length ? Math.max(...resolvedHeights) : maxHeight));
}

function resolveHeaderOptions(options: BottomSheetOptions): BottomSheetHeaderOptions | null {
  if (options.header === false) {
    return null;
  }

  if (options.header) {
    return options.header;
  }

  return {
    subtitle: options.subtitle,
    title: options.title ?? '',
  };
}

function BottomSheetHeader({
  back,
  backgroundColor,
  entranceProgress,
  header,
  isNested,
  locale,
}: {
  back: () => void;
  backgroundColor: string;
  entranceProgress: SharedValue<number>;
  header: BottomSheetHeaderOptions;
  isNested: boolean;
  locale: string;
}) {
  const entranceStyle = useBottomSheetEntranceStyle(entranceProgress);
  const nestedBackAction: BottomSheetHeaderAction = useMemo(
    () => ({
      accessibilityLabel: locale !== 'zh-CN' ? 'Back' : '返回',
      icon: 'icon.system.back',
      onPress: back,
    }),
    [back, locale],
  );
  const leftAction = isNested ? nestedBackAction : header.leftAction;
  const rightAction = resolveHeaderRightAction(header);

  return (
    <BottomSheetView style={StyleSheet.flatten([styles.header, { backgroundColor }])}>
      <Animated.View style={[styles.headerEntrance, entranceStyle]}>
        <HeaderIconSlot>
          {leftAction ? (
            <HeaderIconButton
              accessibilityLabel={leftAction.accessibilityLabel}
              icon={leftAction.icon}
              onPress={leftAction.onPress}
              tone="default"
            />
          ) : header.leftIcon ? (
            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={styles.decorativeHeaderIcon}>
              <AppIcon name={header.leftIcon} size={layout.headerIconSize} />
            </View>
          ) : null}
        </HeaderIconSlot>
        <View style={styles.headerCopy}>
          <AppText ellipsizeMode="tail" numberOfLines={1} style={styles.headerTitle} variant="title.sheet">
            {header.title}
          </AppText>
        </View>
        <HeaderIconSlot>
          {rightAction ? (
            <HeaderIconButton
              accessibilityLabel={rightAction.accessibilityLabel}
              icon={rightAction.icon}
              onPress={rightAction.onPress}
              tone="default"
            />
          ) : null}
        </HeaderIconSlot>
      </Animated.View>
    </BottomSheetView>
  );
}

function resolveHeaderRightAction(header: BottomSheetHeaderOptions): BottomSheetHeaderAction | undefined {
  if (header.rightAction) {
    return header.rightAction;
  }

  if (header.onRightPress && header.rightIcon && header.rightAccessibilityLabel) {
    return {
      accessibilityLabel: header.rightAccessibilityLabel,
      icon: header.rightIcon,
      onPress: header.onRightPress,
    };
  }

  return undefined;
}

function BottomSheetContent({
  backgroundColor,
  children,
  entranceProgress,
  footerHeight,
  hasFooter,
  maxHeight,
}: {
  backgroundColor: string;
  children: ReactNode;
  entranceProgress: SharedValue<number>;
  footerHeight: number;
  hasFooter: boolean;
  maxHeight: number;
}) {
  const options = useContext(BottomSheetOptionsContext);
  const hasHeader = Boolean(options && resolveHeaderOptions(options));
  const contentSizing = options?.contentSizing ?? 'auto';
  const [contentHeight, setContentHeight] = useState(0);
  const staticContentRef = useRef<View | null>(null);
  const baseContentStyle = StyleSheet.flatten([
    styles.content,
    { backgroundColor },
    contentSizing === 'fill' && styles.contentFill,
    hasHeader && styles.contentWithHeader,
  ]);
  const reservedFooterHeight = hasFooter ? footerHeight : 0;
  const availableContentHeight = Math.max(1, maxHeight - reservedFooterHeight);
  const shouldScroll = contentHeight > availableContentHeight + 1;
  const entranceStyle = useBottomSheetEntranceStyle(entranceProgress);

  useEffect(() => {
    setContentHeight(0);
  }, [children, contentSizing, footerHeight, hasFooter, hasHeader, maxHeight]);

  const updateContentHeight = useCallback((nextHeight: number) => {
    setContentHeight((currentHeight) => (Math.abs(currentHeight - nextHeight) > 1 ? nextHeight : currentHeight));
  }, []);
  const handleStaticContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      updateContentHeight(event.nativeEvent.layout.height);
    },
    [updateContentHeight],
  );
  const staticContentLayoutProps: { onLayout?: (event: LayoutChangeEvent) => void } = Platform.OS === 'web' ? {} : { onLayout: handleStaticContentLayout };

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return undefined;
    }

    const element = staticContentRef.current as unknown as HTMLElement | null;
    if (!element || typeof element.getBoundingClientRect !== 'function') {
      return undefined;
    }

    const updateMeasuredHeight = () => updateContentHeight(element.getBoundingClientRect().height);
    updateMeasuredHeight();

    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver(updateMeasuredHeight);
    observer.observe(element);

    return () => observer.disconnect();
  }, [contentSizing, hasFooter, hasHeader, maxHeight, updateContentHeight]);

  const content = (
    <>
      {hasHeader ? <BottomSheetHeaderSpacer /> : null}
      {children}
    </>
  );

  return shouldScroll ? (
    <BottomSheetScrollView
      enableFooterMarginAdjustment={hasFooter}
      contentContainerStyle={baseContentStyle}
      keyboardShouldPersistTaps="handled"
      onContentSizeChange={(_, nextHeight) => updateContentHeight(nextHeight)}
      showsVerticalScrollIndicator={false}>
      <Animated.View style={entranceStyle}>{content}</Animated.View>
    </BottomSheetScrollView>
  ) : (
    <BottomSheetView enableFooterMarginAdjustment={hasFooter}>
      <Animated.View style={entranceStyle}>
        <View ref={staticContentRef} {...staticContentLayoutProps} style={baseContentStyle}>
          {content}
        </View>
      </Animated.View>
    </BottomSheetView>
  );
}

function useBottomSheetEntranceStyle(entranceProgress: SharedValue<number>) {
  return useAnimatedStyle(
    () => ({
      opacity: interpolate(entranceProgress.value, [0, 0.35, 1], [0, 0.35, 1], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(entranceProgress.value, [0, 1], [18, 0], Extrapolation.CLAMP),
        },
      ],
    }),
    [entranceProgress],
  );
}

function BottomSheetHeaderSpacer() {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={styles.headerSpacer}
    />
  );
}

function AppBottomSheetFooter({
  animatedFooterPosition,
  backgroundColor,
  entranceProgress,
  footer,
  hide,
  onHeightChange,
}: {
  animatedFooterPosition: BottomSheetFooterProps['animatedFooterPosition'];
  backgroundColor: string;
  entranceProgress: SharedValue<number>;
  footer: ReactNode | BottomSheetAction[];
  hide: () => void;
  onHeightChange: (height: number) => void;
}) {
  const insets = useSafeAreaInsets();
  const footerRef = useRef<View | null>(null);
  const footerStyle = StyleSheet.flatten([
    styles.footer,
    {
      backgroundColor,
      paddingBottom: Math.max(insets.bottom, layout.bottomActionArea.paddingBottom),
    },
  ]);
  const handleFooterViewLayout = useCallback(
    (event: LayoutChangeEvent) => {
      onHeightChange(event.nativeEvent.layout.height);
    },
    [onHeightChange],
  );
  const footerLayoutProps: { onLayout?: (event: LayoutChangeEvent) => void } = Platform.OS === 'web' ? {} : { onLayout: handleFooterViewLayout };
  const entranceStyle = useBottomSheetEntranceStyle(entranceProgress);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return undefined;
    }

    const element = footerRef.current as unknown as HTMLElement | null;
    if (!element || typeof element.getBoundingClientRect !== 'function') {
      return undefined;
    }

    const updateMeasuredHeight = () => onHeightChange(element.getBoundingClientRect().height);
    updateMeasuredHeight();

    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver(updateMeasuredHeight);
    observer.observe(element);

    return () => observer.disconnect();
  }, [footer, onHeightChange]);

  if (!Array.isArray(footer)) {
    return (
      <GorhomBottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
        <Animated.View style={entranceStyle}>
          <View ref={footerRef} {...footerLayoutProps} style={footerStyle}>{footer}</View>
        </Animated.View>
      </GorhomBottomSheetFooter>
    );
  }

  return (
    <GorhomBottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
      <Animated.View style={entranceStyle}>
        <View ref={footerRef} {...footerLayoutProps} style={footerStyle}>
          {footer.map((action) => (
            <ActionButton
              accessibilityLabel={action.accessibilityLabel}
              disabled={action.disabled}
              icon={action.icon}
              key={action.label}
              label={action.label}
              loading={action.loading}
              onPress={() => {
                const shouldClose = action.onPress();
                if (shouldClose !== false) {
                  hide();
                }
              }}
              tone={action.tone}
              variant={action.variant}
            />
          ))}
        </View>
      </Animated.View>
    </GorhomBottomSheetFooter>
  );
}

function AppBottomSheetBackdrop({ animatedIndex, backgroundColor }: BottomSheetBackdropProps & {
  backgroundColor: string;
}) {
  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(animatedIndex.value, [-1, 0], [0, 1], Extrapolation.CLAMP),
    }),
    [animatedIndex],
  );

  return (
    <Animated.View
      accessibilityElementsHidden
      accessibilityRole="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={StyleSheet.flatten([styles.backdrop, { backgroundColor }, animatedStyle])}
    />
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    gap: spacing.md,
    padding: layout.screenPaddingX,
    paddingTop: spacing.md,
  },
  contentFill: {
    flexGrow: 1,
  },
  contentWithHeader: {
    paddingTop: 0,
  },
  footer: {
    gap: layout.bottomActionArea.gap,
    paddingHorizontal: layout.bottomActionArea.paddingX,
    paddingTop: layout.bottomActionArea.paddingTop,
  },
  handle: {
    paddingBottom: 5,
    paddingTop: 8,
  },
  hostBackdrop: {
    left: 0,
    position: 'absolute',
    top: 0,
    zIndex: 1000,
  },
  header: {
    backgroundColor: 'transparent',
    height: SHEET_HEADER_HEIGHT,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2,
  },
  headerEntrance: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    height: SHEET_HEADER_HEIGHT,
    paddingHorizontal: layout.screenPaddingX,
    width: '100%',
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  decorativeHeaderIcon: {
    alignItems: 'center',
    height: layout.headerIconButtonSize,
    justifyContent: 'center',
    width: layout.headerIconButtonSize,
  },
  headerTitle: {
    textAlign: 'center',
  },
  headerSpacer: {
    height: SHEET_HEADER_HEIGHT,
  },
  modal: {
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderTopWidth: lineWidth.hairline,
    overflow: 'hidden',
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1001,
  },
});
