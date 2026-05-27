import { StyleSheet, View } from 'react-native';

import { useToast } from '@/src/feedback/Toast';
import { impactLight } from '@/src/feedback/haptics';
import { navigateBackOrReplace, safeRouteTargets, type NavigationTarget } from '@/src/navigation/navigationPolicy';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { lineWidth } from '@/src/theme/tokens';

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
  subtitle?: string;
  title: string;
};

export function AppTopBar({ actions, align = 'left', back, backHref, subtitle, title }: AppTopBarProps) {
  const { colors, t } = useProductSettings();
  const toast = useToast();
  const showPlaceholder = (label: string) => {
    void impactLight();
    toast.show({
      message: t('top.placeholderMessage'),
      title: t('top.placeholderTitle', { action: label }),
    });
  };
  const resolvedActions =
    actions ??
    (back
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
        back && styles.backBar,
        !back && styles.rootBar,
      ])}>
      <HeaderIconSlot style={back ? styles.side : styles.rootSide}>
        {back ? (
          <HeaderIconButton
            accessibilityLabel={t('top.back')}
            icon="icon.system.back"
            onPress={() => {
              void impactLight();
              navigateBackOrReplace(backHref ?? safeRouteTargets.launch);
            }}
            tone="default"
          />
        ) : null}
      </HeaderIconSlot>

      <View style={StyleSheet.flatten([styles.titleWrap, align === 'center' && styles.titleCenter, !back && styles.rootTitleWrap])}>
        <AppText numberOfLines={back ? 1 : 2} variant={back ? 'title.pageCompact' : 'title.page'}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText numberOfLines={1} tone="muted" variant="label.helper">
            {subtitle}
          </AppText>
        ) : null}
      </View>

      <View style={StyleSheet.flatten([styles.actions, back && styles.side, !back && styles.rootActions])}>
        {resolvedActions.slice(0, back ? 1 : 3).map((action) => (
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

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    minWidth: 132,
  },
  bar: {
    alignItems: 'center',
    borderBottomWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: 10,
    minHeight: 60,
    paddingBottom: 9,
    paddingHorizontal: 16,
    paddingTop: 7,
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
