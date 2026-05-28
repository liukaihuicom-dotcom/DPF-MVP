import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { ActionButton } from '@/src/design-public-assets/components';
import { AppIcon } from '@/src/design-public-assets/components';
import { NativePressable } from '@/src/design-public-assets/components';
import { Screen } from '@/src/design-public-assets/components';
import { AppText } from '@/src/design-public-assets/components';
import {
  discoverLayoutDefinitions,
  type DiscoverLayoutItem,
  type DiscoverLayoutViewMode,
} from '@/src/domain/discoverLayout';
import { localizeText } from '@/src/domain/format';
import { impactLight } from '@/src/feedback/haptics';
import { navigateBackOrReplace, safeRouteTargets } from '@/src/navigation/navigationPolicy';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { layout, lineWidth, radius, size, spacing } from '@/src/design-public-assets/tokens';

const viewModes: DiscoverLayoutViewMode[] = ['large', 'medium', 'list'];

export default function DiscoverLayoutScreen() {
  const { discoverLayoutItems, colors, locale, setDiscoverLayoutItems, t } = useProductSettings();
  const [draftItems, setDraftItems] = useState<DiscoverLayoutItem[]>(discoverLayoutItems);
  const modeLabels: Record<DiscoverLayoutViewMode, string> = {
    large: t('discover.layout.mode.large'),
    list: t('discover.layout.mode.list'),
    medium: t('discover.layout.mode.medium'),
  };
  const title = t('discover.layout.title');
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
      contentInsetBottom={spacing.lg + spacing.xxs}
      stickyFooter={
        <View style={styles.footerActions}>
          <ActionButton label={t('common.cancel')} onPress={close} style={styles.footerButton} tone="neutral" variant="outline" />
          <ActionButton label={t('common.save')} onPress={save} style={styles.footerButton} tone="neutral" variant="filled" />
        </View>
      }
      title={title}>
      <View style={StyleSheet.flatten([styles.introCard, { backgroundColor: colors.surface.panel }])}>
        <AppIcon name="icon.system.settings" sizeVariant="sm" />
        <View style={styles.flex}>
          <AppText variant="subtitle">{title}</AppText>
          <AppText numberOfLines={2} tone="muted" variant="caption">
            {t('discover.layout.description')}
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
  const { colors, t } = useProductSettings();
  const dragY = useSharedValue(0);
  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .activateAfterLongPress(size.viewport.discoverLayoutGestureDelayMs)
        .activeCursor('grabbing')
        .runOnJS(true)
        .onChange((event) => {
          dragY.value = event.translationY;
        })
        .onEnd((event) => {
          const step = Math.round(event.translationY / size.viewport.discoverLayoutDragRowHeight);
          dragY.value = 0;
          moveItem(index, index + step);
        }),
    [dragY, index, moveItem],
  );
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dragY.value }],
    zIndex: Math.abs(dragY.value) > spacing.xxs ? size.viewport.discoverLayoutRaisedZIndex : spacing.none,
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
              accessibilityLabel={t('discover.layout.moveUp', { title })}
              disabled={!canMoveUp}
              minTouch={layout.headerIconButtonSize}
              onPress={() => moveItem(index, index - 1)}
              style={StyleSheet.flatten([styles.moveButton, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
              <AppIcon name="icon.system.chevron_down" sizeVariant="xs" style={styles.moveUpIcon} />
            </NativePressable>
            <NativePressable
              accessibilityLabel={t('discover.layout.moveDown', { title })}
              disabled={!canMoveDown}
              minTouch={layout.headerIconButtonSize}
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
                minTouch={layout.headerIconButtonSize}
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
    height: size.control.sm - spacing.xs - spacing.xxs,
    justifyContent: 'center',
    width: size.iconSurface.xs,
  },
  editorList: {
    gap: spacing.sm,
  },
  editorRow: {
    borderRadius: radius.card,
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
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  moveButton: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    height: size.iconSurface.sm,
    justifyContent: 'center',
    width: size.iconSurface.sm,
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
