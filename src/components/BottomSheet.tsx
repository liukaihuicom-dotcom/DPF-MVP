import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Platform, BackHandler, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
  useBottomSheetTimingConfigs,
  type BottomSheetBackdropProps,
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

export type BottomSheetHeightMode = 'adaptive' | 'fixed' | 'fullscreen';

export type BottomSheetOptions = {
  content: ReactNode;
  contentPadding?: 'card' | 'flush' | 'plain';
  /** @deprecated Use `heightMode` for new sheet layout decisions. `fill` is treated as fixed-height compatibility. */
  contentSizing?: 'auto' | 'fill';
  footer?: ReactNode | BottomSheetAction[];
  header?: false | BottomSheetHeaderOptions;
  heightMode?: BottomSheetHeightMode;
  onDismiss?: () => void;
  sheetSurface?: 'canvas' | 'panel';
  /** @deprecated Explicit snap points are treated as fixed-height compatibility. Prefer `heightMode`. */
  snapPoints?: Array<string | number>;
  /** @deprecated Use `header.title` or `header: false` so the header mode is explicit. */
  subtitle?: string;
  /** @deprecated Use `header.title` or `header: false` so the header mode is explicit. */
  title?: string;
};

type BottomSheetPresetBaseOptions = Pick<BottomSheetOptions, 'content' | 'contentPadding' | 'contentSizing' | 'footer' | 'heightMode' | 'onDismiss' | 'sheetSurface' | 'snapPoints'>;
type BottomSheetHeaderPresetOptions = BottomSheetPresetBaseOptions & BottomSheetHeaderOptions;

export const bottomSheetPresets = {
  actionMenu(options: BottomSheetPresetBaseOptions): BottomSheetOptions {
    return {
      ...options,
      header: false,
      heightMode: options.heightMode ?? resolvePresetHeightMode(options),
    };
  },
  detail(options: BottomSheetHeaderPresetOptions): BottomSheetOptions {
    const { content, contentSizing, footer, heightMode, onDismiss, sheetSurface, snapPoints, ...header } = options;

    return {
      content,
      contentSizing,
      footer,
      header,
      heightMode: heightMode ?? resolvePresetHeightMode(options),
      onDismiss,
      sheetSurface,
      snapPoints,
    };
  },
  selection(options: BottomSheetHeaderPresetOptions): BottomSheetOptions {
    const { content, contentSizing, footer, heightMode, onDismiss, sheetSurface, snapPoints, ...header } = options;

    return {
      content,
      contentSizing: contentSizing ?? 'fill',
      footer,
      header,
      heightMode: heightMode ?? 'fixed',
      onDismiss,
      sheetSurface: sheetSurface ?? 'panel',
      snapPoints,
    };
  },
};

function resolvePresetHeightMode(options: Pick<BottomSheetOptions, 'contentSizing' | 'heightMode' | 'snapPoints'>): BottomSheetHeightMode {
  if (options.heightMode) {
    return options.heightMode;
  }

  if (options.snapPoints?.length || options.contentSizing === 'fill') {
    return 'fixed';
  }

  return 'adaptive';
}

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

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);
const BottomSheetOptionsContext = createContext<BottomSheetOptions | null>(null);
const BottomSheetStackDepthContext = createContext(0);
const BottomSheetClosingContext = createContext(false);
const BottomSheetNativeDismissContext = createContext<(() => void) | null>(null);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function BottomSheetProvider({ children }: PropsWithChildren) {
  const [stack, setStack] = useState<BottomSheetOptions[]>([]);
  const [closingStack, setClosingStack] = useState<BottomSheetOptions[] | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stackRef = useRef<BottomSheetOptions[]>([]);
  const closingStackRef = useRef<BottomSheetOptions[] | null>(null);
  const pendingCloseStackRef = useRef<BottomSheetOptions[]>([]);
  stackRef.current = stack;
  closingStackRef.current = closingStack;

  const finishClose = useCallback((nextStack: BottomSheetOptions[] = [], dismissedStack?: BottomSheetOptions[]) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    dismissedStack?.at(-1)?.onDismiss?.();
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

    stackRef.current = nextStack;
    closingStackRef.current = currentStack;
    pendingCloseStackRef.current = nextStack;
    setClosingStack(currentStack);
    closeTimerRef.current = setTimeout(() => finishClose(nextStack, currentStack), SHEET_CLOSE_CLEANUP_DELAY);
  }, [finishClose]);

  const handleNativeDismiss = useCallback(() => {
    const currentClosingStack = closingStackRef.current;

    if (currentClosingStack) {
      finishClose(pendingCloseStackRef.current, currentClosingStack);
      return;
    }

    finishClose([], stackRef.current);
  }, [finishClose]);

  useEffect(() => () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
  }, []);

  const closeModal = useCallback((nextStack: BottomSheetOptions[] = []) => {
    const current = stackRef.current;
    if (!current.length) {
      return;
    }

    scheduleClose(current, nextStack);
    setStack(nextStack);
  }, [scheduleClose]);
  const hide = useCallback(() => {
    closeModal();
  }, [closeModal]);
  const show = useCallback((nextOptions: BottomSheetOptions) => {
    dismissActiveKeyboard();
    finishClose();
    stackRef.current = [nextOptions];
    setStack([nextOptions]);
  }, [finishClose]);
  const push = useCallback((nextOptions: BottomSheetOptions) => {
    dismissActiveKeyboard();
    stackRef.current = [...stackRef.current, nextOptions];
    setStack((current) => [...current, nextOptions]);
  }, []);
  const back = useCallback(() => {
    const current = stackRef.current;
    if (!current.length) {
      return;
    }

    closeModal(current.length > 1 ? current.slice(0, -1) : []);
  }, [closeModal]);
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
  const backdropProgress = useSharedValue(0);
  const sheetAnimationConfigs = useBottomSheetTimingConfigs(SHEET_ANIMATION_CONFIG);
  const [backdropInteractive, setBackdropInteractive] = useState(false);
  const optionsRef = useRef(options);
  const maxAvailableHeight = Math.max(1, height - insets.top - TOP_RESERVED_SPACE);
  const maxSheetHeight = Math.max(1, Math.min(maxAvailableHeight, height * 0.9));
  const sheetWidth = Math.min(width, MAX_PAGE_SHEET_WIDTH);
  const horizontalInset = Math.max(0, (width - sheetWidth) / 2);
  const backdropColor = colors.overlay.backdrop;
  const sheetBackgroundColor = options?.sheetSurface === 'panel' ? colors.surface.panel : colors.surface.canvas;
  const heightMode = options ? resolveHeightMode(options) : 'adaptive';
  const snapPoints = useMemo(() => {
    if (options?.snapPoints?.length) {
      return options.snapPoints;
    }

    return [];
  }, [options?.snapPoints]);
  const hasExplicitSnapPoints = snapPoints.length > 0;
  const fixedPanelHeight = heightMode === 'fullscreen'
    ? height
    : hasExplicitSnapPoints
      ? resolveMaxSnapPointHeight(snapPoints, maxSheetHeight)
      : maxSheetHeight;
  const resolvedSnapPoints = useMemo(() => {
    if (heightMode === 'adaptive') {
      return snapPoints;
    }

    return hasExplicitSnapPoints ? snapPoints : [fixedPanelHeight];
  }, [fixedPanelHeight, hasExplicitSnapPoints, heightMode, snapPoints]);
  const dismissModal = useCallback(() => {
    modalRef.current?.dismiss();
  }, []);
  const hostBackdropStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(backdropProgress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
    }),
    [backdropProgress],
  );

  useEffect(() => {
    const wasOpen = Boolean(optionsRef.current);
    optionsRef.current = options;

    if (options && !isClosing) {
      setBackdropInteractive(false);
      backdropProgress.value = 0;
      modalRef.current?.present();
      backdropProgress.value = withTiming(1, SHEET_ANIMATION_CONFIG);
      const timer = setTimeout(() => {
        setBackdropInteractive(true);
      }, SHEET_ANIMATION_DURATION);

      return () => clearTimeout(timer);
    } else if ((options && isClosing) || wasOpen) {
      setBackdropInteractive(false);
      backdropProgress.value = withTiming(0, SHEET_ANIMATION_CONFIG);
      dismissModal();
    }
  }, [backdropProgress, dismissModal, isClosing, options]);

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => <AppBottomSheetBackdrop {...props} backgroundColor={backdropColor} />, [backdropColor]);
  const handleSheetAnimate = useCallback((_fromIndex: number, toIndex: number) => {
    if (toIndex < 0 && options && !isClosing) {
      hide();
    }
  }, [hide, isClosing, options]);

  if (!options) {
    return null;
  }

  const headerOptions = resolveHeaderOptions(options);
  const panelStyle = StyleSheet.flatten([
    styles.panel,
    { backgroundColor: sheetBackgroundColor },
    heightMode === 'adaptive' && { maxHeight: maxSheetHeight },
    heightMode === 'fixed' && { height: fixedPanelHeight, maxHeight: maxSheetHeight },
    heightMode === 'fullscreen' && { height, maxHeight: height },
  ]);

  return (
    <>
      <AnimatedPressable
        accessibilityElementsHidden
        accessible={false}
        disabled={!backdropInteractive}
        importantForAccessibility="no-hide-descendants"
        onPress={hide}
        style={[styles.hostBackdrop, { backgroundColor: backdropColor, height, width }, hostBackdropStyle]}
      />
      <BottomSheetModal
        animationConfigs={sheetAnimationConfigs}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: sheetBackgroundColor }}
        containerStyle={styles.modalContainer}
        detached={false}
        enableContentPanningGesture
        enableDynamicSizing={heightMode === 'adaptive'}
        enablePanDownToClose
        handleComponent={heightMode === 'fullscreen' ? null : undefined}
        handleIndicatorStyle={{ backgroundColor: colors.border.default, width: size.sheet.handleWidth }}
        handleStyle={styles.handle}
        index={0}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        maxDynamicContentSize={heightMode === 'fullscreen' ? height : maxSheetHeight}
        onAnimate={handleSheetAnimate}
        onDismiss={handleNativeDismiss ?? hide}
        ref={modalRef}
        snapPoints={resolvedSnapPoints}
        style={StyleSheet.flatten([
          styles.modal,
          { borderColor: colors.border.subtle, marginLeft: heightMode === 'fullscreen' ? 0 : horizontalInset, width: heightMode === 'fullscreen' ? width : sheetWidth },
          heightMode === 'fullscreen' && styles.modalFullscreen,
        ])}
        topInset={heightMode === 'fullscreen' ? 0 : insets.top + TOP_RESERVED_SPACE}>
        <BottomSheetView style={panelStyle}>
          {headerOptions ? (
            <BottomSheetHeader
              back={back}
              backgroundColor={sheetBackgroundColor}
              header={headerOptions}
              isNested={stackDepth > 1}
              locale={locale}
            />
          ) : null}
          <BottomSheetContent
            contentPadding={options.contentPadding ?? 'card'}
            contentSizing={options.contentSizing ?? 'auto'}
            heightMode={heightMode}>
            {options.content}
          </BottomSheetContent>
          {options.footer ? (
            <AppBottomSheetFooter
              backgroundColor={sheetBackgroundColor}
              footer={options.footer}
              hide={hide}
            />
          ) : null}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}

function resolveHeightMode(options: BottomSheetOptions): BottomSheetHeightMode {
  return options.heightMode ?? resolvePresetHeightMode(options);
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
  header,
  isNested,
  locale,
}: {
  back: () => void;
  backgroundColor: string;
  header: BottomSheetHeaderOptions;
  isNested: boolean;
  locale: string;
}) {
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
    <View style={StyleSheet.flatten([styles.header, { backgroundColor }])}>
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
    </View>
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
  children,
  contentPadding,
  contentSizing,
  heightMode,
}: {
  children: ReactNode;
  contentPadding: NonNullable<BottomSheetOptions['contentPadding']>;
  contentSizing: NonNullable<BottomSheetOptions['contentSizing']>;
  heightMode: BottomSheetHeightMode;
}) {
  const contentFrameStyle = StyleSheet.flatten([
    styles.contentFrame,
    heightMode === 'adaptive' ? styles.contentFrameAdaptive : styles.contentFrameFixed,
  ]);
  const contentInnerStyle = StyleSheet.flatten([
    styles.contentInner,
    contentPadding === 'plain' && styles.contentPlain,
    contentPadding === 'flush' && styles.contentFlush,
    (contentSizing === 'fill' || heightMode !== 'adaptive') && styles.contentInnerFill,
  ]);

  return (
    <BottomSheetScrollView
      contentContainerStyle={contentInnerStyle}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={contentFrameStyle}>
      {children}
    </BottomSheetScrollView>
  );
}

function AppBottomSheetFooter({
  backgroundColor,
  footer,
  hide,
}: {
  backgroundColor: string;
  footer: ReactNode | BottomSheetAction[];
  hide: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [pressedActionKey, setPressedActionKey] = useState<string | null>(null);
  const footerStyle = StyleSheet.flatten([
    styles.footer,
    {
      backgroundColor,
      paddingBottom: layout.bottomActionArea.paddingBottom + insets.bottom,
    },
  ]);

  useEffect(() => {
    setPressedActionKey(null);
  }, [footer]);

  if (!Array.isArray(footer)) {
    return <View style={footerStyle}>{footer}</View>;
  }

  return (
    <View style={footerStyle}>
      {footer.map((action) => (
        <ActionButton
          accessibilityLabel={action.accessibilityLabel}
          disabled={action.disabled || pressedActionKey !== null}
          icon={action.icon}
          key={action.label}
          label={action.label}
          loading={action.loading}
          onPress={() => {
            if (pressedActionKey !== null) {
              return;
            }

            setPressedActionKey(action.label);
            const shouldClose = action.onPress();
            if (shouldClose !== false) {
              hide();
            } else {
              setPressedActionKey(null);
            }
          }}
          style={styles.footerAction}
          tone={action.tone}
          variant={action.variant ?? 'filled'}
        />
      ))}
    </View>
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
  contentFrame: {
    minHeight: 0,
  },
  contentFrameAdaptive: {
    flexGrow: 0,
    flexShrink: 1,
  },
  contentFrameFixed: {
    flex: 1,
  },
  contentInner: {
    gap: spacing.md,
    paddingHorizontal: layout.contentCardPaddingX,
    paddingBottom: layout.contentCardPaddingX,
    paddingTop: spacing.md,
  },
  contentInnerFill: {
    flexGrow: 1,
  },
  contentFlush: {
    paddingHorizontal: spacing.none,
  },
  contentPlain: {
    paddingHorizontal: layout.sheetContentPaddingX,
  },
  footer: {
    flexGrow: 0,
    flexShrink: 0,
    gap: layout.bottomActionArea.gap,
    paddingHorizontal: layout.bottomActionArea.paddingX,
    paddingTop: layout.bottomActionArea.paddingTop,
  },
  footerAction: {
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
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    flexGrow: 0,
    flexShrink: 0,
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
  modal: {
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderTopWidth: lineWidth.hairline,
    overflow: 'hidden',
  },
  modalFullscreen: {
    borderTopLeftRadius: radius.none,
    borderTopRightRadius: radius.none,
    borderTopWidth: lineWidth.none,
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: zIndex.bottomSheet,
  },
  panel: {
    flexDirection: 'column',
    overflow: 'hidden',
    width: '100%',
  },
});
