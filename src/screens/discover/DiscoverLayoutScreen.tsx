import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { ActionButton } from '@/src/components/ActionButton';
import { AppIcon } from '@/src/components/AppIcon';
import { NativePressable } from '@/src/components/NativePressable';
import { Screen } from '@/src/components/Screen';
import { AppText } from '@/src/components/Typography';
import {
  discoverLayoutDefinitions,
  type DiscoverLayoutItem,
  type DiscoverLayoutViewMode,
} from '@/src/domain/discoverLayout';
import { localizeText } from '@/src/domain/format';
import { impactLight } from '@/src/feedback/haptics';
import { navigateBackOrReplace, safeRouteTargets } from '@/src/navigation/navigationPolicy';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { lineWidth, radius, spacing } from '@/src/theme/tokens';

const DRAG_ROW_HEIGHT = 118;
const viewModes: DiscoverLayoutViewMode[] = ['large', 'medium', 'list'];

export default function DiscoverLayoutScreen() {
  const { discoverLayoutItems, locale, colors, setDiscoverLayoutItems } = useProductSettings();
  const [draftItems, setDraftItems] = useState<DiscoverLayoutItem[]>(discoverLayoutItems);
  const modeLabels: Record<DiscoverLayoutViewMode, string> = {
    large: locale !== 'zh-CN' ? 'Large' : '大卡',
    list: locale !== 'zh-CN' ? 'List' : '列表',
    medium: locale !== 'zh-CN' ? 'Medium' : '中卡',
  };
  const title = locale !== 'zh-CN' ? 'Layout Settings' : '布局设置';
  const close = () => {
    navigateBackOrReplace(safeRouteTargets.discover);
  };
  const save = () => {
    setDiscoverLayoutItems(draftItems);
    void impactLight();
    close();
  };
  const moveItem = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= draftItems.length) {
      return;
    }

    setDraftItems((current) => {
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    void impactLight();
  };
  const updateViewMode = (id: DiscoverLayoutItem['id'], viewMode: DiscoverLayoutViewMode) => {
    setDraftItems((current) => current.map((item) => (item.id === id ? { ...item, viewMode } : item)));
    void impactLight();
  };

  return (
    <Screen
      back
      backHref="/discover"
      contentInsetBottom={18}
      stickyFooter={
        <View style={styles.footerActions}>
          <ActionButton label={locale !== 'zh-CN' ? 'Cancel' : '取消'} onPress={close} style={StyleSheet.flatten([styles.footerButton, { backgroundColor: colors.surface.subtle }])} tone="neutral" />
          <ActionButton label={locale !== 'zh-CN' ? 'Save' : '保存'} onPress={save} style={styles.footerButton} tone="neutral" />
        </View>
      }
      title={title}>
      <View style={StyleSheet.flatten([styles.introCard, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
        <AppIcon name="icon.system.settings" sizeVariant="sm" />
        <View style={styles.flex}>
          <AppText variant="subtitle">{title}</AppText>
          <AppText numberOfLines={2} tone="muted" variant="caption">
            {locale !== 'zh-CN' ? 'Drag to reorder modules, then choose how each one appears on Discover.' : '拖动模块调整顺序，并设置每个内容项在发现页的展示方式。'}
          </AppText>
        </View>
      </View>

      <View style={styles.editorList}>
        {draftItems.map((item, index) => {
          const definition = discoverLayoutDefinitions.find((candidate) => candidate.id === item.id);

          if (!definition) {
            return null;
          }

          return (
            <LayoutEditorRow
              canMoveDown={index < draftItems.length - 1}
              canMoveUp={index > 0}
              index={index}
              item={item}
              key={item.id}
              modeLabels={modeLabels}
              moveItem={moveItem}
              onViewModeChange={updateViewMode}
              title={localizeText(definition.title, locale)}
            />
          );
        })}
      </View>
    </Screen>
  );
}

function LayoutEditorRow({
  canMoveDown,
  canMoveUp,
  index,
  item,
  modeLabels,
  moveItem,
  onViewModeChange,
  title,
}: {
  canMoveDown: boolean;
  canMoveUp: boolean;
  index: number;
  item: DiscoverLayoutItem;
  modeLabels: Record<DiscoverLayoutViewMode, string>;
  moveItem: (fromIndex: number, toIndex: number) => void;
  onViewModeChange: (id: DiscoverLayoutItem['id'], viewMode: DiscoverLayoutViewMode) => void;
  title: string;
}) {
  const { colors } = useProductSettings();
  const dragY = useSharedValue(0);
  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .activateAfterLongPress(120)
        .activeCursor('grabbing')
        .runOnJS(true)
        .onChange((event) => {
          dragY.value = event.translationY;
        })
        .onEnd((event) => {
          const step = Math.round(event.translationY / DRAG_ROW_HEIGHT);
          dragY.value = 0;
          moveItem(index, index + step);
        }),
    [dragY, index, moveItem],
  );
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dragY.value }],
    zIndex: Math.abs(dragY.value) > 2 ? 20 : 0,
  }));

  return (
    <GestureDetector gesture={gesture} touchAction="none">
      <Animated.View
        style={[
          styles.editorRow,
          { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle },
          animatedStyle,
        ]}>
        <View style={styles.editorRowHeader}>
          <View style={styles.dragHandle}>
            <AppIcon name="icon.system.more" sizeVariant="sm" />
          </View>
          <View style={styles.flex}>
            <AppText numberOfLines={1} variant="subtitle">
              {title}
            </AppText>
            <AppText tone="muted" variant="caption">
              {modeLabels[item.viewMode]}
            </AppText>
          </View>
          <View style={styles.moveButtons}>
            <NativePressable
              accessibilityLabel={`${title} move up`}
              disabled={!canMoveUp}
              minTouch={32}
              onPress={() => moveItem(index, index - 1)}
              style={StyleSheet.flatten([styles.moveButton, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
              <AppIcon name="icon.system.chevron_down" sizeVariant="xs" style={styles.moveUpIcon} />
            </NativePressable>
            <NativePressable
              accessibilityLabel={`${title} move down`}
              disabled={!canMoveDown}
              minTouch={32}
              onPress={() => moveItem(index, index + 1)}
              style={StyleSheet.flatten([styles.moveButton, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
              <AppIcon name="icon.system.chevron_down" sizeVariant="xs" />
            </NativePressable>
          </View>
        </View>
        <View style={StyleSheet.flatten([styles.segment, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
          {viewModes.map((mode) => {
            const selected = item.viewMode === mode;

            return (
              <NativePressable
                accessibilityLabel={`${title} ${modeLabels[mode]}`}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={mode}
                minTouch={36}
                onPress={() => onViewModeChange(item.id, mode)}
                style={StyleSheet.flatten([
                  styles.segmentButton,
                  selected && { borderColor: colors.text.primary },
                ])}>
                <AppText numberOfLines={1} tone={selected ? 'default' : 'muted'} variant="caption">
                  {modeLabels[mode]}
                </AppText>
              </NativePressable>
            );
          })}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  dragHandle: {
    alignItems: 'center',
    height: 34,
    justifyContent: 'center',
    width: 28,
  },
  editorList: {
    gap: spacing.sm,
  },
  editorRow: {
    borderRadius: radius.lg,
    borderWidth: lineWidth.none,
    gap: spacing.md,
    padding: spacing.md,
  },
  editorRowHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  footerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  footerButton: {
    flex: 1,
  },
  introCard: {
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: lineWidth.none,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  moveButton: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  moveButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  moveUpIcon: {
    transform: [{ rotate: '180deg' }],
  },
  segment: {
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
  },
  segmentButton: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.selected,
    borderColor: 'transparent',
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
});
