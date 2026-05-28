import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/design-public-assets/components';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { spacing } from '@/src/design-public-assets/tokens';

export default function NotFoundScreen() {
  const { colors, t } = useProductSettings();

  return (
    <>
      <Stack.Screen options={{ title: t('notFound.title') }} />
      <View style={StyleSheet.flatten([styles.container, { backgroundColor: colors.surface.canvas }])}>
        <AppText variant="title">{t('notFound.title')}</AppText>
        <Link href="/launch" style={styles.link}>
          <AppText tone="brand">{t('notFound.back')}</AppText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl - spacing.xs,
  },
  link: {
    marginTop: spacing.lg - spacing.xxs,
    paddingVertical: spacing.lg - spacing.xxs,
  },
});
