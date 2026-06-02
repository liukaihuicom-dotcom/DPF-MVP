import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { layout, lineWidth, radius, size, spacing } from '@/src/theme/tokens';

import { AppIcon } from '../AppIcon';
import { ProfileAvatar, getProfileAvatarUri, profileAvatarOptions, type ProfileAvatarId } from '../ProfileAvatar';
import { TextField } from '../TextField';
import { AppText } from '../Typography';

export function ProfileEditSheetContent() {
  const { colors, profileAvatarId, profileNickname, setProfileAvatarId, setProfileNickname, t } = useProductSettings();
  const chooseAvatar = (nextId: ProfileAvatarId) => {
    void impactLight();
    setProfileAvatarId(nextId);
  };
  const updateNickname = (value: string) => {
    setProfileNickname(value.slice(0, 24).trim());
  };

  return (
    <View style={styles.profileEditSheet}>
      <View style={styles.profileEditHero}>
        <ProfileAvatar id={profileAvatarId} size={size.icon.display} />
        <View style={styles.flex}>
          <AppText variant="subtitle">{profileNickname.trim() || t('auth.profile.noNickname')}</AppText>
          <AppText tone="muted" variant="caption">
            {t('discover.profile.edit.description')}
          </AppText>
        </View>
      </View>
      <TextField
        label={t('auth.profile.nickname')}
        onChangeText={updateNickname}
        placeholder={t('auth.profile.nicknamePlaceholder')}
        value={profileNickname}
      />
      <ScrollView contentContainerStyle={styles.avatarRail} horizontal showsHorizontalScrollIndicator={false}>
        {profileAvatarOptions.map((option) => {
          const selected = option.id === profileAvatarId;

          return (
            <Pressable
              accessibilityLabel={t('discover.profile.edit.chooseAvatar', { name: option.name })}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={option.id}
              onPress={() => chooseAvatar(option.id)}
              style={StyleSheet.flatten([
                styles.avatarRailItem,
                {
                  backgroundColor: colors.surface.panel,
                  borderColor: selected ? colors.text.primary : colors.border.subtle,
                },
              ])}>
              <ProfileAvatar id={option.id} selected={selected} size={size.control.sm - spacing.xs} />
              <AppText numberOfLines={1} tone={selected ? 'default' : 'muted'} variant="caption">
                {option.name}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function ManagerChatSheet() {
  const { colors, t } = useProductSettings();
  const messages = [
    {
      body: t('discover.profile.manager.messageIntro'),
      side: 'manager',
    },
    {
      body: t('discover.profile.manager.messageUser'),
      side: 'user',
    },
    {
      body: t('discover.profile.manager.messageSync'),
      side: 'manager',
    },
  ] as const;

  return (
    <View style={styles.managerChatSheet}>
      <View style={StyleSheet.flatten([styles.managerChatProfile, { backgroundColor: colors.surface.panel }])}>
        <ProfileAvatar id="alex" size={layout.touchTargetMin} />
        <View style={styles.flex}>
          <AppText variant="subtitle">{t('discover.profile.manager.name')}</AppText>
          <AppText tone="muted" variant="body.secondary">
            {t('discover.profile.manager.status')}
          </AppText>
        </View>
      </View>
      <View style={styles.managerMessageList}>
        {messages.map((message, index) => {
          const isUser = message.side === 'user';

          return (
            <View
              key={`${message.side}-${index}`}
              style={StyleSheet.flatten([
                styles.managerMessageRow,
                isUser && styles.managerMessageRowUser,
              ])}>
              <View
                style={StyleSheet.flatten([
                  styles.managerMessageBubble,
                  { backgroundColor: isUser ? colors.brand.fg : colors.surface.panel },
                ])}>
                <AppText tone={isUser ? 'panel' : 'default'} variant="body.secondary">
                  {message.body}
                </AppText>
              </View>
            </View>
          );
        })}
      </View>
      <View style={StyleSheet.flatten([styles.managerComposer, { backgroundColor: colors.surface.panel }])}>
        <AppText tone="muted" variant="body.secondary">
          {t('discover.profile.manager.composerState')}
        </AppText>
        <AppIcon name="icon.notification.feedback" size={layout.menuDisclosureIconSize} styleVariant="fill" tone="tertiary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarRail: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xxs,
    paddingRight: spacing.lg,
  },
  avatarRailItem: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.xs + spacing.xxs,
    minHeight: layout.touchTargetMin + spacing.xxs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + lineWidth.strong,
  },
  flex: {
    flex: 1,
    gap: spacing.xxs + lineWidth.strong,
    minWidth: 0,
  },
  managerChatProfile: {
    alignItems: 'center',
    borderRadius: radius.card,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  managerChatSheet: {
    gap: spacing.lg,
    paddingTop: spacing.xs,
  },
  managerComposer: {
    alignItems: 'center',
    borderRadius: radius.full,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    minHeight: size.control.md,
    paddingHorizontal: spacing.lg,
  },
  managerMessageBubble: {
    borderRadius: radius.card,
    maxWidth: '84%',
    padding: spacing.md,
  },
  managerMessageList: {
    gap: spacing.sm,
  },
  managerMessageRow: {
    alignItems: 'flex-start',
  },
  managerMessageRowUser: {
    alignItems: 'flex-end',
  },
  profileEditHero: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  profileEditSheet: {
    gap: spacing.lg,
  },
});
