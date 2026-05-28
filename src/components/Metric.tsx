import { StyleSheet, View } from 'react-native';

import { layout, size } from '@/src/theme/tokens';

import { AppText } from './Typography';

type MetricProps = {
  label: string;
  value: string;
  tone?: 'default' | 'muted' | 'dim' | 'up' | 'down' | 'amber' | 'blue' | 'brand' | 'danger';
  caption?: string;
};

export function Metric({ label, value, tone = 'default', caption }: MetricProps) {
  return (
    <View style={styles.metric}>
      <AppText tone="dim" variant="caption">
        {label}
      </AppText>
      <AppText adjustsFontSizeToFit numberOfLines={1} tone={tone} variant="number">
        {value}
      </AppText>
      {caption ? (
        <AppText numberOfLines={1} tone="muted" variant="caption">
          {caption}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  metric: {
    flex: 1,
    gap: layout.metricGap,
    minWidth: size.metric.minWidth,
  },
});
