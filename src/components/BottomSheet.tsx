import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Platform, BackHandler, Pressable, StyleSheet, useWindowDimensions, View, type LayoutChangeEvent } from 'react-native';
import Animated, { Easing, Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';
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
import { lineWidth, layout, motion, radius, size, spacing, zIndex } from '@/src/theme/tokens';

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
  contentPadding?: 'card' | 'flush' | 'plain';
  contentSizing?: 'auto' | 'fill';
  footer?: ReactNode | BottomSheetAction[];
  header?: false | BottomSheetHeaderOptions;
  onDismiss?: () => void;
  sheetSurface?: 'canvas' | 'panel';
  snapPoints?: Array<string | number>;
  /** @deprecated Use `header.title` or `header: false` so the header mode is explicit. */
  subtitle?: string;
  /** @deprecated Use `header.title` or `header: false` so the header mode is explicit. */
  title?: string;
};

type BottomSheetPresetBaseOptions = Pick<BottomSheetOptions, 'content' | 'contentPadding' | 'contentSizing' | 'footer' | 'onDismiss' | 'sheetSurface' | 'snapPoints'>;
type BottomSheetHeaderPresetOptions = BottomSheetPresetBaseOptions & BottomSheetHeaderOptions;

export const bottomSheetPresets = {
  actionMenu(options: BottomSheetPresetBaseOptions): BottomSheetOptions {
    return {
      ...options,
      header: false,
    };
  },
  detail(options: BottomSheetHeaderPresetOptions): BottomSheetOptions {
    const { content, contentSizing, footer, onDismiss, sheetSurface, snapPoints, ...header } = options;

    return {
      content,
      contentSizing,
      footer,
      header,
      onDismiss,
      sheetSurface,
      snapPoints,
    };
  },
  selection(options: BottomSheetHeaderPresetOptions): BottomSheetOptions {
    const { content, contentSizing, footer, onDismiss, sheetSurface, snapPoints, ...header } = options;

    return {
      content,
      contentSizing: contentSizing ?? 'fill',
      footer,
      header,
      onDismiss,
      sheetSurface,
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
const SHEET_ANIMATION_DURATION = motion.overlay.standardMs;
const SHEET_CLOSE_CLEANUP_DELAY = motion.overlay.cleanupDelayMs;
const SHEET_ANIMATION_CONFIG = {
  duration: SHEET_ANIMATION_DURATION,
  easing: Easing.out(Easing.cubic),
};
const ESTIMATED_FOOTER_HEIGHT = layout.bottomActionArea.contentInset;

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);
const BottomSheetOptionsContext = createContext<BottomSheetOptions | null>(null);
const BottomSheetStackDepthContext = createContext(0);
const BottomSheetClosingContext = createContext(false);
const BottomSheetNativeDismissContext = createContext<(() => void) | null>(null);

export function BottomSheetProvider({ children }: PropsWithChildren) {
  const [stack, setStack] = useState<BottomSheetOptions[]>([]);
  const [closingStack, setClosingStack] = useState<BottomSheetOptions[] | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stackRef = useRef<BottomSheetOptions[]>([]);
  const closingStackRef = useRef<BottomSheetOptions[] | null>(null);
  const pendingCloseStackRef = useRef<BottomSheetOptions[]>([]);
  stackRef.current = stack;
  closingStackRef.current = closingStack;

  const finishClose = useCallback((nextStack: BottomSheetOptions[] = []) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    stackRef.current = nextStack;
    closingStackRef.current = null;
    pendingCloseStackRef.current = [];
    setStack(nextStack);
    setClosingStack(null);
  }, []);

  const scheduleClose = useCallback((currentStack: BottomSheetOptions[], nextStack: BottomSheetOptions[] = []) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    currentStack.at(-1)?.onDismiss?.();
    stackRef.current = nextStack;
    closingStackRef.current = currentStack;
    pendingCloseStackRef.current = nextStack;
    setClosingStack(currentStack);
    closeTimerRef.current = setTimeout(() => finishClose(nextStack), SHEET_CLOSE_CLEANUP_DELAY);
  }, [finishClose]);

  const handleNativeDismiss = useCallback(() => {
    const currentClosingStack = closingStackRef.current;

    if (currentClosingStack) {
      finishClose(pendingCloseStackRef.current);
      return;
    }

    stackRef.current.at(-1)?.onDismiss?.();
    finishClose();
  }, [finishClose]);

  useEffect(() => () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
  }, []);

  const hide = useCallback(() => {
    setStack((current) => {
      if (!current.length) {
        return current;
      }

      scheduleClose(current);
      return [];
    });
  }, [scheduleClose]);
  const show = useCallback((nextOptions: BottomSheetOptions) => {
    dismissActiveKeyboard();
    finishClose();
    stackRef.current = [nextOptions];
    setStack([nextOptions]);
  }, []);
  const push = useCallback((nextOptions: BottomSheetOptions) => {
    dismissActiveKeyboard();
    stackRef.current = [...stackRef.current, nextOptions];
    setStack((current) => [...current, nextOptions]);
  }, []);
  const back = useCallback(() => {
    setStack((current) => {
      if (!current.length) {
        return current;
      }

      const nextStack = current.length > 1 ? current.slice(0, -1) : [];
      scheduleClose(current, nextStack);
      return nextStack;
    });
  }, [scheduleClose]);
  const value = useMemo(() => ({ back, hide, push, show }), [back, hide, push, show]);
  const visibleStack = closingStack ?? stack;
  const options = visibleStack.at(-1) ?? null;

  useEffect(() => {
    if (Platform.OS === 'web' || stack.length === 0) {
      return undefined;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      back();
      return true;
    });

    return () => subscription.remove();
  }, [back, stack.length]);

  return (
    <BottomSheetContext.Provider value={value}>
      <BottomSheetNativeDismissContext.Provider value={handleNativeDismiss}>
        <BottomSheetStackDepthContext.Provider value={visibleStack.length}>
          <BottomSheetOptionsContext.Provider value={options}>
            <BottomSheetClosingContext.Provider value={Boolean(closingStack)}>
              <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
            </BottomSheetClosingContext.Provider>
          </BottomSheetOptionsContext.Provider>
        </BottomSheetStackDepthContext.Provider>
      </BottomSheetNativeDismissContext.Provider>
    </BottomSheetContext.Provider>
  );
}

function dismissActiveKeyboard() {
  Keyboard.dismiss();

  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return;
  }

  const activeElement = document.activeElement;
  if (activeElement instanceof HTMLElement) {
    activeElement.blur();
  }
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
  const isClosing = useContext(BottomSheetClosingContext);
  const handleNativeDismiss = useContext(BottomSheetNativeDismissContext);
  const { back, hide } = useBottomSheet();
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { locale, colors } = useProductSettings();
  const modalRef = useRef<BottomSheetModal>(null);
  const sheetEntranceProgress = useSharedValue(0);
  const [backdropInteractive, setBackdropInteractive] = useState(false);
  const [footerHeight, setFooterHeight] = useState<number>(ESTIMATED_FOOTER_HEIGHT);
  const optionsRef = useRef(options);
  const maxHeight = Math.max(1, height - insets.top - TOP_RESERVED_SPACE);
  const sheetWidth = Math.min(width, MAX_PAGE_SHEET_WIDTH);
  const horizontalInset = Math.max(0, (width - sheetWidth) / 2);
  const backdropColor = colors.overlay.backdrop;
  const sheetBackgroundColor = options?.sheetSurface === 'panel' ? colors.surface.panel : colors.surface.canvas;
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
  const dismissModal = useCallback(() => {
    modalRef.current?.dismiss();
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
          interactive={backdropInteractive}
          onHeightChange={handleFooterHeightChange}
        />
      ) : null
    ),
    [backdropInteractive, handleFooterHeightChange, hide, options?.footer, sheetBackgroundColor, sheetEntranceProgress],
  );

  useEffect(() => {
    const wasOpen = Boolean(optionsRef.current);
    optionsRef.current = options;

    if (options && !isClosing) {
      setBackdropInteractive(false);
      setFooterHeight(ESTIMATED_FOOTER_HEIGHT);
      sheetEntranceProgress.value = 0;
      modalRef.current?.present();
      sheetEntranceProgress.value = withTiming(1, SHEET_ANIMATION_CONFIG);
      const timer = setTimeout(() => {
        setBackdropInteractive(true);
      }, SHEET_ANIMATION_DURATION);

      return () => clearTimeout(timer);
    } else if ((options && isClosing) || wasOpen) {
      setBackdropInteractive(false);
      sheetEntranceProgress.value = withTiming(0, SHEET_ANIMATION_CONFIG);
      dismissModal();
    }
  }, [dismissModal, isClosing, options, sheetEntranceProgress]);

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
        handleIndicatorStyle={{ backgroundColor: colors.border.default, width: size.sheet.handleWidth }}
        handleStyle={styles.handle}
        index={0}
        keyboardBlurBehavior="restore"
        maxDynamicContentSize={maxHeight}
        onDismiss={handleNativeDismiss ?? hide}
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
  const contentPadding = options?.contentPadding ?? 'card';
  const [contentHeight, setContentHeight] = useState(0);
  const staticContentRef = useRef<View | null>(null);
  const baseContentStyle = StyleSheet.flatten([
    styles.content,
    { backgroundColor },
    contentPadding === 'plain' && styles.contentPlain,
    contentPadding === 'flush' && styles.contentFlush,
    contentSizing === 'fill' && styles.contentFill,
    hasHeader && styles.contentWithHeader,
  ]);
  const reservedFooterHeight = hasFooter ? Math.max(footerHeight, ESTIMATED_FOOTER_HEIGHT) : 0;
  const availableContentHeight = Math.max(1, maxHeight - reservedFooterHeight);
  const shouldScroll = contentSizing === 'fill' || contentHeight > availableContentHeight + 1;
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
      contentContainerStyle={StyleSheet.flatten([baseContentStyle, hasFooter && styles.contentWithFooterReadingGap])}
      keyboardShouldPersistTaps="handled"
      onContentSizeChange={(_, nextHeight) => updateContentHeight(nextHeight)}
      showsVerticalScrollIndicator={false}>
      <Animated.View style={entranceStyle}>{content}</Animated.View>
    </BottomSheetScrollView>
  ) : (
    <BottomSheetView enableFooterMarginAdjustment={hasFooter}>
      <Animated.View style={entranceStyle}>
        <View
          ref={staticContentRef}
          {...staticContentLayoutProps}
          style={StyleSheet.flatten([baseContentStyle, hasFooter && styles.contentWithFooterReadingGap])}>
          {content}
        </View>
      </Animated.View>
    </BottomSheetView>
  );
}

function useBottomSheetEntranceStyle(entranceProgress: SharedValue<number>) {
  return useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: interpolate(entranceProgress.value, [0, 1], [18, 0], Extrapolation.CLAMP),
        },
      ],
    }),
    [entranceProgress],
  );
}

function useBottomSheetFooterEntranceStyle(entranceProgress: SharedValue<number>, hiddenOffset = layout.bottomActionArea.contentInset) {
  return useAnimatedStyle(
    () => ({
      opacity: interpolate(entranceProgress.value, [0, 0.35, 1], [0, 0.35, 1], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(entranceProgress.value, [0, 1], [hiddenOffset, 0], Extrapolation.CLAMP),
        },
      ],
    }),
    [entranceProgress, hiddenOffset],
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
  interactive,
  onHeightChange,
}: {
  animatedFooterPosition: BottomSheetFooterProps['animatedFooterPosition'];
  backgroundColor: string;
  entranceProgress: SharedValue<number>;
  footer: ReactNode | BottomSheetAction[];
  hide: () => void;
  interactive: boolean;
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
  const entranceStyle = useBottomSheetFooterEntranceStyle(entranceProgress);
  const footerPointerEvents = interactive ? 'auto' : 'none';

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
        <Animated.View pointerEvents={footerPointerEvents} style={[styles.footerEntrance, entranceStyle]}>
          <View ref={footerRef} {...footerLayoutProps} style={footerStyle}>{footer}</View>
        </Animated.View>
      </GorhomBottomSheetFooter>
    );
  }

  return (
    <GorhomBottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
      <Animated.View pointerEvents={footerPointerEvents} style={[styles.footerEntrance, entranceStyle]}>
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
              variant={action.variant ?? 'filled'}
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
    paddingHorizontal: layout.contentCardPaddingX,
    paddingBottom: layout.contentCardPaddingX,
    paddingTop: spacing.md,
  },
  contentWithFooterReadingGap: {
    paddingBottom: layout.bottomActionArea.contentInset,
  },
  contentFill: {
    flexGrow: 1,
  },
  contentFlush: {
    paddingHorizontal: spacing.none,
  },
  contentPlain: {
    paddingHorizontal: layout.contentPlainPaddingX,
  },
  contentWithHeader: {
    paddingTop: 0,
  },
  footer: {
    gap: layout.bottomActionArea.gap,
    paddingHorizontal: layout.bottomActionArea.paddingX,
    paddingTop: layout.bottomActionArea.paddingTop,
  },
  footerEntrance: {
    width: '100%',
  },
  handle: {
    paddingBottom: layout.sheetHandlePaddingBottom,
    paddingTop: layout.sheetHandlePaddingTop,
  },
  hostBackdrop: {
    left: 0,
    position: 'absolute',
    top: 0,
    zIndex: zIndex.bottomSheetBackdrop,
  },
  header: {
    backgroundColor: 'transparent',
    height: SHEET_HEADER_HEIGHT,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: zIndex.raised,
  },
  headerEntrance: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    height: SHEET_HEADER_HEIGHT,
    paddingHorizontal: layout.topBarPaddingX,
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
    zIndex: zIndex.bottomSheet,
  },
});
