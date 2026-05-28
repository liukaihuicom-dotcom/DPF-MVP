import { StyleSheet, View, type ViewStyle } from 'react-native';

import { layout } from '@/src/theme/tokens';

import { Metric } from '../Metric';

type MetricClusterItem = {
  caption?: string;
  label: string;
  tone?: 'default' | 'muted' | 'dim' | 'up' | 'down' | 'amber' | 'blue' | 'brand' | 'danger';
  value: string;
};

type MetricClusterProps = {
  items: MetricClusterItem[];
  style?: ViewStyle;
};

export function MetricCluster({ items, style }: MetricClusterProps) {
  return (
    <View style={StyleSheet.flatten([styles.cluster, style])}>
      {items.map((item) => (
        <Metric caption={item.caption} key={item.label} label={item.label} tone={item.tone} value={item.value} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cluster: {
    flexDirection: 'row',
    gap: layout.controlGap,
  },
});
