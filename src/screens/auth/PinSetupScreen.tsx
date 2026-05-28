import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { safeRedirect } from '@/src/auth/authFlow';
import { AuthErrorDialog } from '@/src/design-public-assets/components';
import { AuthLanguageAction } from '@/src/design-public-assets/components';
import { AppIcon } from '@/src/design-public-assets/components';
import { HeaderIconSlot } from '@/src/design-public-assets/components';
import { NativePressable } from '@/src/design-public-assets/components';
import { AppText } from '@/src/design-public-assets/components';
import { notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { layout, lineWidth, radius, size, spacing } from '@/src/design-public-assets/tokens';

const pinLength = 6;
const keypadItems = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'empty', '0', 'delete'] as const;

export default function PinSetupScreen() {
  const params = useLocalSearchParams<{ mode?: string; redirect?: string }>();
  const { localPinCode, colors, pinGateStatus, resolvedThemeMode, setAuthStatus, setLocalPinCode, setPinGateStatus, setPinStatus, t } = useProductSettings();
  const flowMode = params.mode === 'unlock' && localPinCode.length === pinLength ? 'unlock' : 'setup';
  const [phase, setPhase] = useState<'create' | 'confirm' | 'unlock'>(flowMode === 'unlock' ? 'unlock' : 'create');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [unlockPin, setUnlockPin] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);
  const redirect = safeRedirect(typeof params.redirect === 'string' ? params.redirect : undefined);
  const currentValue = phase === 'create' ? pin : phase === 'confirm' ? confirmPin : unlockPin;
  const backgroundColor = resolvedThemeMode === 'lightBroker' ? colors.surface.panel : colors.surface.canvas;
  const shouldBypassUnlock = params.mode === 'unlock' && pinGateStatus !== 'locked';

  const prompt = useMemo(
    () => ({
      hint: phase === 'create' ? t('auth.pin.keyboardHint') : phase === 'confirm' ? t('auth.pin.confirmSubtitle') : t('auth.pin.unlockHint'),
      subtitle: phase === 'create' ? t('auth.pin.localCheckSubtitle') : phase === 'confirm' ? t('auth.pin.confirmSubtitle') : t('auth.pin.unlockSubtitle'),
      title: phase === 'create' ? t('auth.pin.title') : phase === 'confirm' ? t('auth.pin.confirmTitle') : t('auth.pin.unlockTitle'),
    }),
    [phase, t],
  );

  useEffect(() => {
    if (currentValue.length !== pinLength) {
      return undefined;
    }

    const timer = setTimeout(() => {
      completePinEntry();
    }, 120);

    return () => clearTimeout(timer);
  }, [currentValue]);

  const updateCurrentValue = (nextValue: string) => {
    if (phase === 'create') {
      setPin(nextValue);
      return;
    }

    if (phase === 'confirm') {
      setConfirmPin(nextValue);
      return;
    }

    setUnlockPin(nextValue);
  };

  const pressDigit = (digit: string) => {
    if (currentValue.length >= pinLength) {
      return;
    }

    updateCurrentValue(`${currentValue}${digit}`);
  };

  const deleteDigit = () => {
    updateCurrentValue(currentValue.slice(0, -1));
  };

  const completePinEntry = () => {
    if (phase === 'unlock') {
      if (unlockPin !== localPinCode) {
        void notifyWarning();
        setErrorOpen(true);
        setUnlockPin('');
        return;
      }

      setPinStatus('set');
      setPinGateStatus('unlocked');
      setAuthStatus('signedIn');
      void notifySuccess();
      router.replace(redirect);
      return;
    }

    if (phase === 'create') {
      setPhase('confirm');
      setConfirmPin('');
      return;
    }

    if (confirmPin !== pin) {
      void notifyWarning();
      setErrorOpen(true);
      setConfirmPin('');
      return;
    }

    setLocalPinCode(pin);
    setPinStatus('set');
    setPinGateStatus('unlocked');
    setAuthStatus('signedIn');
    void notifySuccess();
    router.replace(redirect);
  };

  const skipPinSetup = () => {
    setLocalPinCode('');
    setPinStatus('skipped');
    setPinGateStatus('unlocked');
    setAuthStatus('signedIn');
    router.replace(redirect);
  };

  if (shouldBypassUnlock) {
    return <Redirect href={redirect} />;
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={StyleSheet.flatten([styles.safe, { backgroundColor }])}>
      <View style={styles.screen}>
        <View style={styles.topBar}>
          <HeaderIconSlot />
          <View style={styles.topActions}>
            {flowMode === 'setup' ? (
              <NativePressable accessibilityLabel={t('auth.pin.skip')} accessibilityRole="button" minTouch={size.touch.min} onPress={skipPinSetup} style={styles.skipButton}>
                <AppText style={styles.skipText} tone="dim" variant="label.control">
                  {t('auth.pin.skip')}
                </AppText>
              </NativePressable>
            ) : null}
            <AuthLanguageAction />
          </View>
        </View>

        <View style={styles.header}>
          <AppText style={styles.title} variant="pageTitle">
            {prompt.title}
          </AppText>
          <AppText numberOfLines={2} style={styles.subtitle} tone="muted" variant="bodyMd">
            {prompt.subtitle}
          </AppText>
        </View>

        <View style={styles.pinStatusBlock}>
          <View accessibilityLabel={`${currentValue.length}/${pinLength}`} accessibilityRole="text" style={styles.pinDots}>
            {Array.from({ length: pinLength }, (_, index) => {
              const filled = index < currentValue.length;

              return <View key={index} style={StyleSheet.flatten([styles.pinDot, { backgroundColor: filled ? colors.text.primary : colors.border.default }])} />;
            })}
          </View>

          <AppText numberOfLines={2} style={styles.helper} tone="muted" variant="titleSm">
            {prompt.hint}
          </AppText>
        </View>

        <View style={styles.keypad}>
          {keypadItems.map((item) => {
            if (item === 'empty') {
              return <View key={item} style={styles.key} />;
            }

            if (item === 'delete') {
              return (
                <NativePressable
                  accessibilityLabel={t('auth.pin.deleteDigit')}
                  disabled={currentValue.length === 0}
                  key={item}
                  minTouch={64}
                  onPress={deleteDigit}
                  pressedStyle={styles.keyPressed}
                  style={StyleSheet.flatten([styles.key, styles.keyButton, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
                  <AppIcon name="icon.system.back" sizeVariant="md" />
                </NativePressable>
              );
            }

            return (
              <NativePressable
                accessibilityLabel={item}
                key={item}
                minTouch={64}
                onPress={() => pressDigit(item)}
                pressedStyle={styles.keyPressed}
                style={StyleSheet.flatten([styles.key, styles.keyButton, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
                <AppText style={styles.keyText} variant="displayLg">
                  {item}
                </AppText>
              </NativePressable>
            );
          })}
        </View>
      </View>

      <AuthErrorDialog body={phase === 'unlock' ? t('auth.pin.errorUnlock') : phase === 'create' ? t('auth.pin.errorLength') : t('auth.pin.errorMatch')} onClose={() => setErrorOpen(false)} open={errorOpen} title={t('auth.pin.blocked')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: size.touch.min,
    paddingHorizontal: spacing.none,
  },
  skipText: {
    textDecorationLine: 'underline',
  },
  header: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  helper: {
    textAlign: 'center',
  },
  key: {
    alignItems: 'center',
    aspectRatio: 1.42,
    flexBasis: '31%',
    justifyContent: 'center',
  },
  keyButton: {
    borderRadius: radius.lg,
    borderWidth: lineWidth.strong,
  },
  keypad: {
    alignContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
    marginTop: spacing.none,
    paddingBottom: spacing.md,
    width: '100%',
  },
  keyPressed: {
    opacity: 0.7,
  },
  keyText: {
    textAlign: 'center',
  },
  pinDot: {
    borderRadius: radius.full,
    height: spacing.md,
    width: spacing.md,
  },
  pinDots: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
  },
  pinStatusBlock: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.lg,
    justifyContent: 'center',
    minHeight: layout.sheetTradeHeaderMinHeight + layout.sheetHeaderHeight,
  },
  safe: {
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingX,
  },
  subtitle: {
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: layout.sheetHeaderHeight,
    paddingVertical: spacing.sm,
  },
  topActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
});
