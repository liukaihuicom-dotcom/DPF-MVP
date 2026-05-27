import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, type ErrorBoundaryProps, useNavigationContainerRef, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppViewport } from '@/src/components/AppViewport';
import { BottomSheetProvider, GlobalBottomSheetHost } from '@/src/components/BottomSheet';
import { ProductControlPanel } from '@/src/components/ProductControlPanel';
import { AppText } from '@/src/components/Typography';
import { ToastProvider } from '@/src/feedback/Toast';
import { ProductSettingsProvider, useProductSettings } from '@/src/settings/ProductSettings';
import { BrokerProvider } from '@/src/state/BrokerStore';
import { layout, spacing } from '@/src/theme/tokens';

SplashScreen.setOptions({
  duration: 300,
  fade: true,
});
SplashScreen.preventAutoHideAsync();

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <ProductSettingsProvider>
      <RootErrorBoundaryContent {...props} />
    </ProductSettingsProvider>
  );
}

function RootErrorBoundaryContent({ error, retry }: ErrorBoundaryProps) {
  const { colors } = useProductSettings();

  return (
    <View style={[styles.errorContainer, { backgroundColor: colors.surface.canvas }]}>
      <View style={[styles.errorPanel, { backgroundColor: colors.surface.panel, borderColor: colors.border.default }]}>
        <AppText variant="title">Something went wrong</AppText>
        <AppText tone="muted" variant="body.secondary">
          {error.message}
        </AppText>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void retry();
          }}
          style={({ pressed }) => [
            styles.retryButton,
            {
              backgroundColor: pressed ? colors.brand.active : colors.brand.fg,
            },
          ]}>
          <AppText tone="white" variant="caption">
            Retry
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ProductSettingsProvider>
          <RootLayoutNav />
        </ProductSettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const { authStatus, colors, pinGateStatus, pinStatus, resolvedThemeMode } = useProductSettings();
  const pathname = usePathname();
  const navigationRef = useNavigationContainerRef();
  const router = useRouter();
  const navigationTheme = resolvedThemeMode === 'lightBroker' ? DefaultTheme : DarkTheme;

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(pathname === '/brand-splash' ? colors.brand.fg : colors.surface.canvas);
  }, [colors.surface.canvas, colors.brand.fg, pathname]);

  useEffect(() => {
    if (!navigationRef.isReady()) {
      return;
    }

    const isPublicRoute =
      pathname === '/' ||
      pathname === '/brand-splash' ||
      pathname === '/launch' ||
      pathname === '/discover' ||
      pathname === '/quick' ||
      pathname === '/auth' ||
      pathname === '/auth/register' ||
      pathname === '/auth/register-email-code' ||
      pathname === '/auth/register-phone' ||
      pathname === '/auth/register-phone-code' ||
      pathname === '/auth/register-password' ||
      pathname === '/auth/forgot-password' ||
      pathname === '/auth/pin-setup';

    if (authStatus === 'guest' && !isPublicRoute) {
      router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (authStatus === 'signedIn' && pinStatus === 'set' && pinGateStatus === 'locked' && pathname !== '/auth/pin-setup') {
      router.replace(`/auth/pin-setup?mode=unlock&redirect=${encodeURIComponent(pathname)}`);
    }
  }, [authStatus, navigationRef, pathname, pinGateStatus, pinStatus, router]);

  return (
    <ThemeProvider
      value={{
        ...navigationTheme,
        colors: {
          ...navigationTheme.colors,
          background: colors.surface.canvas,
          border: colors.border.default,
          card: colors.surface.panel,
          primary: colors.brand.fg,
          text: colors.text.primary,
        },
      }}>
      <BrokerProvider>
        <ToastProvider>
          <BottomSheetProvider>
            <AppViewport>
              <Stack
                screenOptions={{
                  contentStyle: { backgroundColor: colors.surface.canvas },
                  headerShown: false,
                }}>
                <Stack.Screen name="index" />
                <Stack.Screen
                  name="brand-splash"
                  options={{
                    contentStyle: { backgroundColor: colors.brand.fg },
                  }}
                />
                <Stack.Screen name="launch" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="auth/onboarding" />
                <Stack.Screen name="auth/index" />
                <Stack.Screen name="auth/register" />
                <Stack.Screen name="auth/register-email-code" />
                <Stack.Screen name="auth/register-phone" />
                <Stack.Screen name="auth/register-phone-code" />
                <Stack.Screen name="auth/register-password" />
                <Stack.Screen name="auth/verify" />
                <Stack.Screen name="auth/forgot-password" />
                <Stack.Screen name="auth/pin-setup" />
                <Stack.Screen name="instrument/[id]" />
                <Stack.Screen
                  name="order/[id]"
                  options={{
                    animation: 'fade',
                    contentStyle: { backgroundColor: 'transparent' },
                    presentation: 'transparentModal',
                  }}
                />
                <Stack.Screen name="client/[id]" />
                <Stack.Screen name="partner/client-orders" />
                <Stack.Screen name="partner/commission" />
                <Stack.Screen name="account-basic/[id]" />
                <Stack.Screen name="account-balance/[id]" />
                <Stack.Screen name="account-details/[id]" />
                <Stack.Screen name="account-orders/[id]" />
                <Stack.Screen name="appearance" />
                <Stack.Screen name="settings/index" />
                <Stack.Screen name="settings/security-log" />
                <Stack.Screen
                  name="discover-layout"
                  options={{
                    animation: 'fade',
                    contentStyle: { backgroundColor: 'transparent' },
                    presentation: 'transparentModal',
                  }}
                />
              </Stack>
            </AppViewport>
            <GlobalBottomSheetHost />
            <ProductControlPanel />
          </BottomSheetProvider>
        </ToastProvider>
      </BrokerProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  errorPanel: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
    marginHorizontal: 'auto',
    maxWidth: layout.appMaxWidth,
    paddingHorizontal: layout.cardPaddingX,
    paddingVertical: layout.cardPaddingY,
    width: '100%',
  },
  retryButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 8,
    minHeight: layout.touchTargetMin,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  root: {
    flex: 1,
  },
});
