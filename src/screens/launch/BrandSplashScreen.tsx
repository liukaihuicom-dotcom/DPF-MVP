import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useThemeColors } from '@/src/design-public-assets/copy';
import { layout, size } from '@/src/design-public-assets/tokens';

const LOGO_SIZE = Math.round(size.viewport.appMaxWidth * 0.58);
const INTRO_DURATION_MS = 780;
const HOLD_DURATION_MS = 340;
const REDUCED_MOTION_DELAY_MS = 240;

export default function BrandSplashScreen() {
  const colors = useThemeColors();
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(reducedMotion ? 1 : 0);
  const scale = useSharedValue(reducedMotion ? 1 : 0.96);
  const translateY = useSharedValue(reducedMotion ? 0 : layout.topReservedSpace);

  useEffect(() => {
    if (reducedMotion) {
      const timeout = setTimeout(() => {
        router.replace('/launch');
      }, REDUCED_MOTION_DELAY_MS);

      return () => clearTimeout(timeout);
    }

    opacity.value = withSequence(
      withTiming(1, {
        duration: INTRO_DURATION_MS,
        easing: Easing.out(Easing.cubic),
      }),
      withDelay(
        HOLD_DURATION_MS,
        withTiming(1, {
          duration: 1,
        }),
      ),
    );
    scale.value = withTiming(1, {
      duration: INTRO_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
    translateY.value = withTiming(0, {
      duration: INTRO_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });

    const timeout = setTimeout(() => {
      router.replace('/launch');
    }, INTRO_DURATION_MS + HOLD_DURATION_MS);

    return () => clearTimeout(timeout);
  }, [opacity, reducedMotion, scale, translateY]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <View style={StyleSheet.flatten([styles.screen, { backgroundColor: colors.brand.fg }])}>
      <Animated.View accessible accessibilityLabel="Dupoin" accessibilityRole="image" style={logoStyle}>
        <Image resizeMode="contain" source={require('@/assets/images/dupoin-logo-white.png')} style={styles.logo} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: LOGO_SIZE,
    width: LOGO_SIZE,
  },
  screen: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
