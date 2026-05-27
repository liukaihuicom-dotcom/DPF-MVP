import { StyleSheet, View } from 'react-native';

import { navigateBackOrReplace, safeRouteTargets, type NavigationTarget } from '@/src/navigation/navigationPolicy';
import { useThemeColors } from '@/src/settings/ProductSettings';

import { AppText } from './Typography';
import { HeaderIconButton } from './HeaderIconButton';

type BackBarProps = {
  backHref?: NavigationTarget;
  label: string;
};

export function BackBar({ backHref = safeRouteTargets.launch, label }: BackBarProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.bar}>
      <HeaderIconButton
        accessibilityLabel={label}
        icon="icon.system.back"
        onPress={() => navigateBackOrReplace(backHref)}
        tone="default"
      />
      <AppText numberOfLines={1} variant="title.pageCompact">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingTop: 8,
  },
});
