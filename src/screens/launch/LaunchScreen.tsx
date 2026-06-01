import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton } from '@/src/design-public-assets/components';
import { AppText } from '@/src/design-public-assets/components';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { radius, size, spacing } from '@/src/design-public-assets/tokens';

const TITLE_ENTER_DURATION_MS = 620;
const TITLE_ENTER_DELAY_MS = 110;
const SUBTITLE_ENTER_DELAY_MS = 220;

export default function LaunchScreen() {
  const { colors, t } = useProductSettings();
  const reducedMotion = useReducedMotion();
  const titleOpacity = useSharedValue(reducedMotion ? 1 : 0);
  const titleTranslateY = useSharedValue(reducedMotion ? 0 : spacing.lg);
  const subtitleOpacity = useSharedValue(reducedMotion ? 1 : 0);
  const subtitleTranslateY = useSharedValue(reducedMotion ? 0 : spacing.md);

  useEffect(() => {
    if (reducedMotion) {
      titleOpacity.value = 1;
      titleTranslateY.value = 0;
      subtitleOpacity.value = 1;
      subtitleTranslateY.value = 0;
      return;
    }

    titleOpacity.value = withDelay(TITLE_ENTER_DELAY_MS, withTiming(1, {
      duration: TITLE_ENTER_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    }));
    titleTranslateY.value = withDelay(TITLE_ENTER_DELAY_MS, withTiming(0, {
      duration: TITLE_ENTER_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    }));
    subtitleOpacity.value = withDelay(SUBTITLE_ENTER_DELAY_MS, withTiming(1, {
      duration: TITLE_ENTER_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    }));
    subtitleTranslateY.value = withDelay(SUBTITLE_ENTER_DELAY_MS, withTiming(0, {
      duration: TITLE_ENTER_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    }));
  }, [reducedMotion, subtitleOpacity, subtitleTranslateY, titleOpacity, titleTranslateY]);

  const titleEnterStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));
  const subtitleEnterStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  return (
    <SafeAreaView edges={['top', 'bottom']} style={StyleSheet.flatten([styles.safe, { backgroundColor: colors.surface.raised }])}>
      <View style={styles.screen}>
        <View style={styles.visualStage}>
          <View style={styles.brandHalo}>
            <Image accessibilityLabel="Dupoin" resizeMode="contain" source={require('@/assets/images/dupoin-logo.png')} style={styles.brandLogo} />
          </View>
        </View>

        <View style={styles.content}>
          <Animated.View style={titleEnterStyle}>
            <AppText numberOfLines={3} style={styles.title} variant="quote">
              {t('launch.title')}
            </AppText>
          </Animated.View>
          <Animated.View style={subtitleEnterStyle}>
            <AppText numberOfLines={2} style={styles.subtitle} tone="muted" variant="bodyLg">
              {t('launch.subtitle')}
            </AppText>
          </Animated.View>
        </View>

        <View style={styles.actions}>
          <ActionButton label={t('launch.login')} onPress={() => router.push('/auth')} sizePreset="lg" tone="brand" variant="outline" />
          <ActionButton label={t('launch.register')} onPress={() => router.replace('/auth/register')} sizePreset="lg" tone="brand" variant="filled" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
    marginTop: 'auto',
    width: '100%',
  },
  brandHalo: {
    alignItems: 'center',
    aspectRatio: 1,
    borderRadius: radius.full,
    justifyContent: 'center',
    overflow: 'hidden',
    width: '54%',
  },
  brandLogo: {
    height: '100%',
    width: '100%',
  },
  content: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
    marginTop: spacing.xxl,
    width: '100%',
  },
  safe: {
    flex: 1,
  },
  screen: {
    alignItems: 'center',
    flex: 1,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  subtitle: {
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
  },
  visualStage: {
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
    maxHeight: size.viewport.launchVisualMaxHeight,
    minHeight: size.viewport.launchVisualMinHeight + spacing.xxl,
    width: '100%',
  },
});
