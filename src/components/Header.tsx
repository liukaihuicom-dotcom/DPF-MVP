import { StyleSheet, View } from 'react-native';

import { AppText } from './Typography';

type HeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export function Header({ eyebrow, title, subtitle }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.copy}>
        <AppText tone="dim" variant="eyebrow">
          {eyebrow}
        </AppText>
        <AppText numberOfLines={1} variant="title.pageCompact">
          {title}
        </AppText>
        {subtitle ? (
          <AppText numberOfLines={1} tone="muted" variant="label.helper">
            {subtitle}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingTop: 8,
  },
});
