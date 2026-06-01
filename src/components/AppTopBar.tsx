import { StyleSheet, View } from 'react-native';

import { useToast } from '@/src/feedback/Toast';
import { impactLight } from '@/src/feedback/haptics';
import {
  handleCancelIntent,
  handleCloseIntent,
  handleGlobalBack,
  safeRouteTargets,
  type LeftAction,
  type NavigationTarget,
} from '@/src/navigation/navigationPolicy';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { layout, lineWidth, spacing } from '@/src/theme/tokens';

import { type AppIconName } from './AppIcon';
import { HeaderIconButton, HeaderIconSlot } from './HeaderIconButton';
import { AppText } from './Typography';

export type AppTopBarAction = {
  icon: AppIconName;
  label: string;
  onPress?: () => void;
};

type AppTopBarProps = {
  actions?: AppTopBarAction[];
  align?: 'left' | 'center';
  back?: boolean;
  backHref?: NavigationTarget;
  closeHref?: NavigationTarget;
  leftAccessibilityLabel?: string;
  leftAction?: LeftAction;
  onLeftPress?: () => void;
  subtitle?: string;
  title: string;
};

export function AppTopBar({
  actions,
  align = 'left',
  back: backProp,
  backHref,
  closeHref,
  leftAccessibilityLabel,
  leftAction,
  onLeftPress,
  subtitle,
  title,
}: AppTopBarProps) {
  const { colors, t } = useProductSettings();
  const toast = useToast();
  const resolvedLeftAction: LeftAction = leftAction ?? (backProp ? 'back' : 'none');
  const hasLeftAction = resolvedLeftAction !== 'none';
  const back = hasLeftAction;
  const showPlaceholder = (label: string) => {
    void impactLight();
    toast.show({
      message: t('top.placeholderMessage'),
      title: t('top.placeholderTitle', { action: label }),
    });
  };
  const resolvedActions =
    actions ??
    (hasLeftAction
      ? [{ icon: 'icon.system.more', label: t('top.more'), onPress: () => showPlaceholder(t('top.more')) }]
      : [
          { icon: 'icon.system.search', label: t('top.search'), onPress: () => showPlaceholder(t('top.search')) },
          { icon: 'icon.notification.bell', label: t('top.notifications'), onPress: () => showPlaceholder(t('top.notifications')) },
          { icon: 'icon.support.headset', label: t('top.support'), onPress: () => showPlaceholder(t('top.support')) },
        ]);

  return (
    <View
      style={StyleSheet.flatten([
        styles.bar,
        { backgroundColor: colors.surface.canvas, borderBottomColor: 'transparent' },
        hasLeftAction && styles.backBar,
        !hasLeftAction && styles.rootBar,
      ])}>
      <HeaderIconSlot style={hasLeftAction ? styles.side : styles.rootSide}>
        {hasLeftAction ? (
          <HeaderIconButton
            accessibilityLabel={leftAccessibilityLabel ?? resolveLeftActionLabel(resolvedLeftAction, t)}
            icon={resolvedLeftAction === 'back' ? 'icon.system.back' : 'icon.system.close'}
            onPress={() => {
              void impactLight();
              if (onLeftPress) {
                onLeftPress();
                return;
              }

              if (resolvedLeftAction === 'back') {
                void handleGlobalBack({ fallback: backHref ?? safeRouteTargets.launch });
                return;
              }

              if (resolvedLeftAction === 'cancel') {
                void handleCancelIntent({ closeTarget: closeHref, fallback: closeHref ?? backHref ?? safeRouteTargets.launch });
                return;
              }

              void handleCloseIntent({ closeTarget: closeHref, fallback: closeHref ?? backHref ?? safeRouteTargets.launch });
            }}
            tone="default"
          />
        ) : null}
      </HeaderIconSlot>

      <View style={StyleSheet.flatten([styles.titleWrap, align === 'center' && styles.titleCenter, !hasLeftAction && styles.rootTitleWrap])}>
        <AppText numberOfLines={hasLeftAction ? 1 : 2} variant={back ? 'title.pageCompact' : 'title.page'}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText numberOfLines={1} tone="muted" variant="label.helper">
            {subtitle}
          </AppText>
        ) : null}
      </View>

      <View style={StyleSheet.flatten([styles.actions, hasLeftAction && styles.side, !hasLeftAction && styles.rootActions])}>
        {resolvedActions.slice(0, hasLeftAction ? 1 : 3).map((action) => (
          <HeaderIconButton
            accessibilityLabel={action.label}
            icon={action.icon}
            key={`${action.icon}-${action.label}`}
            onPress={action.onPress ?? (() => showPlaceholder(action.label))}
            tone="default"
          />
        ))}
      </View>
    </View>
  );
}

function resolveLeftActionLabel(leftAction: LeftAction, t: (key: 'common.cancel' | 'top.back') => string) {
  if (leftAction === 'back') {
    return t('top.back');
  }

  return t('common.cancel');
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    minWidth: 132,
  },
  bar: {
    alignItems: 'center',
    borderBottomWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.sm + spacing.xxs,
    minHeight: 60,
    paddingBottom: spacing.sm + 1,
    paddingHorizontal: layout.topBarPaddingX,
    paddingTop: spacing.sm - 1,
  },
  side: {
    minWidth: 40,
  },
  rootActions: {
    minWidth: 150,
  },
  rootBar: {
    borderBottomWidth: 0,
    minHeight: 64,
    paddingBottom: 6,
    paddingTop: 8,
  },
  backBar: {
    borderBottomWidth: 0,
  },
  rootSide: {
    display: 'none',
  },
  rootTitleWrap: {
    alignItems: 'flex-start',
  },
  titleCenter: {
    alignItems: 'center',
  },
  titleWrap: {
    flex: 1,
    gap: 1,
    minWidth: 0,
  },
});
