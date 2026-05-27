import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { lineWidth, radius, size, spacing } from '@/src/theme/tokens';
import { ActionButton } from '@/src/components/ActionButton';
import { AuthLink, AuthShell } from '@/src/components/AuthShell';
import { IconSurface } from '@/src/components/IconSurface';
import { NativePressable } from '@/src/components/NativePressable';
import { AppIcon, type AppIconName } from '@/src/components/AppIcon';
import { AppText } from '@/src/components/Typography';
import { dupoinOnboardingSteps } from '@/src/domain/dupoinMvp';
import { localizeText } from '@/src/domain/format';
import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';

export default function OnboardingScreen() {
  const { locale, colors, t } = useProductSettings();
  const steps = [
    ['icon.account.add_user', t('onboarding.step.account'), t('onboarding.step.accountHint')],
    ['icon.security.risk_shield', t('onboarding.step.risk'), t('onboarding.step.riskHint')],
    ['icon.navigation.function_center', t('onboarding.step.workspace'), t('onboarding.step.workspaceHint')],
  ] as const;
  const quickChoices = [
    ['icon.trading.order_ticket', t('onboarding.choice.trader'), t('onboarding.choice.traderHint')],
    ['icon.ib.network', t('onboarding.choice.partner'), t('onboarding.choice.partnerHint')],
  ] as const;

  return (
    <AuthShell
      footer={
        <View style={styles.footerActions}>
          <ActionButton accessibilityLabel={t('onboarding.primaryCta')} label={t('onboarding.primaryCta')} onPress={() => router.push('/auth/register')} tone="brand" />
          <ActionButton accessibilityLabel={t('onboarding.secondaryCta')} label={t('onboarding.secondaryCta')} onPress={() => router.push('/auth')} tone="neutral" />
        </View>
      }
      kicker={t('onboarding.kicker')}
      navMode="close"
      step={t('onboarding.stepLabel')}
      subtitle={t('onboarding.subtitle')}
      title={t('onboarding.title')}>
      <View style={StyleSheet.flatten([styles.heroPanel, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
        <View style={styles.heroRow}>
          <IconSurface icon="icon.market.global" sizeVariant="md" tone="neutral" />
          <View style={styles.flex}>
            <AppText variant="subtitle">{t('onboarding.heroTitle')}</AppText>
            <AppText numberOfLines={3} tone="muted" variant="caption">
              {t('onboarding.heroBody')}
            </AppText>
          </View>
        </View>
        <View style={styles.stepRail}>
          {steps.map(([icon, title, hint], index) => (
            <View key={title} style={styles.stepRow}>
              <View style={StyleSheet.flatten([styles.stepIndex, { backgroundColor: index === 0 ? colors.brand.fg : colors.surface.subtle }])}>
                <AppIcon name={icon as AppIconName} sizeVariant="xs" tone={index === 0 ? 'white' : undefined} />
              </View>
              <View style={styles.flex}>
                <AppText variant="body">{title}</AppText>
                <AppText numberOfLines={2} tone="muted" variant="caption">
                  {hint}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={StyleSheet.flatten([styles.activationPanel, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
        <View style={styles.activationHeader}>
          <View style={styles.flex}>
            <AppText variant="subtitle">{t('onboarding.activation.title')}</AppText>
            <AppText tone="muted" variant="caption">
              {t('onboarding.activation.subtitle')}
            </AppText>
          </View>
          <ActionButton
            label={t('onboarding.activation.cta')}
            onPress={() => router.push('/auth/register')}
            style={styles.smallButton}
            tone="brand"
          />
        </View>
        <View style={styles.activationSteps}>
          {dupoinOnboardingSteps.map((step, index) => (
            <View key={step.id} style={styles.activationStepRow}>
              <View style={StyleSheet.flatten([styles.activationStepMark, { backgroundColor: index < 2 ? colors.market.down.fg : colors.brand.fg }])}>
                <AppText tone="white" variant="eyebrow">
                  {index + 1}
                </AppText>
              </View>
              <View style={styles.flex}>
                <AppText variant="body">{localizeText(step.label, locale)}</AppText>
                <AppText tone={index < 2 ? 'down' : 'brand'} variant="caption">
                  {localizeText(step.state, locale)}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.choiceGrid}>
        {quickChoices.map(([icon, title, hint]) => (
          <NativePressable
            accessibilityRole="button"
            key={title}
            minTouch={88}
            onPress={() => {
              void impactLight();
              router.push('/auth/register');
            }}
            style={StyleSheet.flatten([styles.choiceCard, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
            <IconSurface icon={icon as AppIconName} sizeVariant="xs" />
            <AppText variant="body">{title}</AppText>
            <AppText numberOfLines={3} tone="muted" variant="caption">
              {hint}
            </AppText>
          </NativePressable>
        ))}
      </View>

      <View style={StyleSheet.flatten([styles.notice, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
        <AppIcon name="icon.risk.info" sizeVariant="xs" />
        <AppText numberOfLines={3} tone="muted" variant="caption">
          {t('onboarding.notice')}
        </AppText>
      </View>

      <View style={styles.centerLink}>
        <AuthLink label={t('onboarding.forgotPassword')} onPress={() => router.push('/auth/forgot-password')} />
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  activationHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  activationPanel: {
    borderRadius: radius.xl,
    borderWidth: lineWidth.none,
    gap: radius.lg,
    padding: radius.lg,
  },
  activationStepMark: {
    alignItems: 'center',
    borderRadius: radius.full,
    height: size.tag.smMinHeight,
    justifyContent: 'center',
    width: size.tag.smMinHeight,
  },
  activationStepRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: radius.md - spacing.xxs,
  },
  activationSteps: {
    gap: spacing.md - 1,
  },
  centerLink: {
    alignItems: 'center',
  },
  choiceCard: {
    borderRadius: radius.md,
    borderWidth: lineWidth.none,
    flex: 1,
    gap: spacing.sm,
    minWidth: 0,
    padding: spacing.md,
  },
  choiceGrid: {
    flexDirection: 'row',
    gap: radius.md - spacing.xxs,
  },
  flex: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  footerActions: {
    gap: radius.md - spacing.xxs,
  },
  heroPanel: {
    borderRadius: radius.xl,
    borderWidth: lineWidth.none,
    gap: spacing.lg,
    padding: radius.lg,
  },
  heroRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  notice: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: lineWidth.none,
    flexDirection: 'row',
    gap: radius.md - spacing.xxs,
    padding: spacing.md,
  },
  smallButton: {
    minHeight: size.tag.chipMinHeight + spacing.xxs,
    paddingHorizontal: radius.lg,
    paddingVertical: spacing.sm,
  },
  stepIndex: {
    alignItems: 'center',
    borderRadius: radius.full,
    height: size.tag.mdMinHeight,
    justifyContent: 'center',
    width: size.tag.mdMinHeight,
  },
  stepRail: {
    gap: spacing.md,
  },
  stepRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: radius.md - spacing.xxs,
  },
});
