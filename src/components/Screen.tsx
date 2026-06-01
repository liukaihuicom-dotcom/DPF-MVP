import { PropsWithChildren, ReactNode } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { lineWidth, layout, spacing } from '@/src/theme/tokens';
import type { LeftAction, NavigationContract, NavigationTarget } from '@/src/navigation/navigationPolicy';

import { AppTopBar, type AppTopBarAction } from './AppTopBar';
import { useKeyboardVisible } from './layout/useKeyboardVisible';

type ScreenProps = PropsWithChildren<{
  align?: 'left' | 'center';
  back?: boolean;
  backHref?: NavigationTarget;
  closeHref?: NavigationTarget;
  contentBottomPadding?: 'default' | 'none';
  contentInsetBottom?: number;
  contentPadding?: 'card' | 'default' | 'flush' | 'plain';
  dismissKeyboardOnTap?: boolean;
  keyboardAware?: boolean;
  leftAction?: LeftAction;
  leftAccessibilityLabel?: string;
  navigationContract?: NavigationContract;
  onLeftPress?: () => void;
  overlay?: ReactNode;
  rightActions?: AppTopBarAction[];
  scroll?: boolean;
  subtitle?: string;
  stickyFooterBackground?: 'page' | 'surface';
  stickyFooter?: ReactNode;
  title?: string;
  topBar?: ReactNode;
}>;

export function Screen({
  align,
  back,
  backHref,
  children,
  closeHref,
  contentInsetBottom = 0,
  contentPadding = 'default',
  dismissKeyboardOnTap,
  keyboardAware,
  leftAccessibilityLabel,
  leftAction,
  navigationContract,
  onLeftPress,
  overlay,
  rightActions,
  scroll = true,
  stickyFooterBackground = 'surface',
  stickyFooter,
  subtitle,
  title,
  topBar,
}: ScreenProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const keyboardVisible = useKeyboardVisible(keyboardAware);
  const resolvedLeftAction = navigationContract?.leftAction ?? leftAction;
  const header = topBar ?? (title ? (
    <AppTopBar
      actions={rightActions}
      align={align}
      back={back}
      backHref={backHref}
      closeHref={closeHref}
      leftAccessibilityLabel={leftAccessibilityLabel}
      leftAction={resolvedLeftAction}
      onLeftPress={onLeftPress}
      subtitle={subtitle}
      title={title}
    />
  ) : null);
  const compactFooterForKeyboard = keyboardVisible;
  const bottomActionInset = compactFooterForKeyboard ? layout.bottomActionArea.keyboardContentInset : layout.bottomActionArea.contentInset;
  const bottomActionPadding = compactFooterForKeyboard ? layout.bottomActionArea.keyboardPaddingBottom : layout.bottomActionArea.paddingBottom;
  const screenContentBottomPadding = layout.screenBottomPadding + insets.bottom;
  const baseBottomPadding = stickyFooter ? bottomActionInset : screenContentBottomPadding;
  const bottomPadding = baseBottomPadding + contentInsetBottom;
  const contentHorizontalPadding = contentPadding === 'plain' ? layout.contentPlainPaddingX : layout.contentCardPaddingX;
  const stickyFooterBackgroundColor = stickyFooterBackground === 'page' ? colors.surface.canvas : colors.surface.raised;
  const wrapDismiss = (node: ReactNode) =>
    dismissKeyboardOnTap ? (
      <Pressable accessible={false} onPress={Keyboard.dismiss} style={styles.flex}>
        {node}
      </Pressable>
    ) : (
      node
    );

  const body = !scroll ? (
    <View style={StyleSheet.flatten([styles.body, { backgroundColor: colors.surface.canvas }])}>{children}</View>
  ) : (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        contentPadding === 'flush' && styles.contentFlush,
        contentPadding !== 'flush' && { paddingHorizontal: contentHorizontalPadding },
        { paddingBottom: bottomPadding },
      ]}
      contentInsetAdjustmentBehavior="never"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={StyleSheet.flatten([styles.body, { backgroundColor: colors.surface.canvas }])}>
      {children}
    </ScrollView>
  );

  const content = (
    <View style={StyleSheet.flatten([styles.safe, { backgroundColor: colors.surface.canvas }])}>
      <SafeAreaView edges={['top']} style={styles.flex}>
        {header}
        {wrapDismiss(body)}
        {stickyFooter ? (
          <SafeAreaView edges={compactFooterForKeyboard ? [] : ['bottom']} style={StyleSheet.flatten([styles.footerSafe, { backgroundColor: stickyFooterBackgroundColor, borderTopColor: colors.border.subtle }])}>
            <View style={StyleSheet.flatten([styles.footer, { paddingBottom: bottomActionPadding }])}>{stickyFooter}</View>
          </SafeAreaView>
        ) : null}
      </SafeAreaView>
      {overlay}
    </View>
  );

  if (keyboardAware) {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    position: 'relative',
  },
  body: {
    flex: 1,
  },
  content: {
    gap: layout.screenGap,
    paddingHorizontal: layout.contentCardPaddingX,
    paddingTop: spacing.xs,
  },
  contentFlush: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  flex: {
    flex: 1,
  },
  footer: {
    gap: layout.bottomActionArea.gap,
    paddingHorizontal: layout.bottomActionArea.paddingX,
    paddingTop: layout.bottomActionArea.paddingTop,
  },
  footerSafe: {
    borderTopWidth: lineWidth.hairline,
  },
});
