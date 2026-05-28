import { PropsWithChildren } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { layout, lineWidth, radius } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/settings/ProductSettings';

export function AppViewport({ children }: PropsWithChildren) {
  const colors = useThemeColors();

  if (Platform.OS !== 'web') {
    return <View style={StyleSheet.flatten([styles.native, { backgroundColor: colors.surface.canvas }])}>{children}</View>;
  }

  return (
    <View style={StyleSheet.flatten([styles.stage, { backgroundColor: colors.surface.subtle }])}>
      <View style={StyleSheet.flatten([styles.phone, { backgroundColor: colors.surface.canvas, borderColor: colors.border.subtle }])}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  phone: {
    borderRadius: radius.sheet,
    borderLeftWidth: lineWidth.hairline,
    borderRightWidth: lineWidth.hairline,
    height: layout.appDeviceHeight,
    maxHeight: '100%',
    overflow: 'hidden',
    position: 'relative',
    width: layout.appDeviceWidth,
  },
  native: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
});
