import { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { lineWidth, layout, radius, size, spacing } from '@/src/theme/tokens';

import { AppIcon, type AppIconName } from '../AppIcon';
import { Card } from '../Card';
import { IconSurface, type IconSurfaceTone } from '../IconSurface';
import { NativePressable } from '../NativePressable';
import { StatusPill, type StatusPillTone } from '../StatusPill';
import { AppText, type AppTextTone } from '../Typography';

type FinancialHeroMetric = {
  label: string;
  value: string;
};

type FinancialHeroInsight = {
  icon?: AppIconName;
  label: string;
  tone: StatusPillTone;
  value: string;
};

type FinancialHeroCardProps = {
  body?: string;
  eyebrow: string;
  icon: AppIconName;
  insights?: FinancialHeroInsight[];
  metrics?: FinancialHeroMetric[];
  statusLabel?: string;
  statusTone?: StatusPillTone;
  title: string;
};

export function FinancialHeroCard({
  body,
  eyebrow,
  icon,
  insights,
  metrics,
  statusLabel,
  statusTone = 'neutral',
  title,
}: FinancialHeroCardProps) {
  const colors = useThemeColors();

  return (
    <Card highlight>
      <View style={styles.heroStack}>
        <View style={styles.heroHeader}>
          <IconSurface icon={icon} sizeVariant="lg" tone="info" />
          <View style={styles.flex}>
            <AppText tone="muted" variant="eyebrow">{eyebrow}</AppText>
            <AppText variant="title">{title}</AppText>
          </View>
          {statusLabel ? <StatusPill compact label={statusLabel} tone={statusTone} /> : null}
        </View>
        {body ? <AppText tone="muted" variant="caption">{body}</AppText> : null}
        {metrics?.length ? (
          <View style={StyleSheet.flatten([styles.heroMetricGrid, { borderTopColor: colors.border.subtle }])}>
            {metrics.map((item) => (
              <View key={item.label} style={styles.metricCell}>
                <AppText tone="muted" variant="caption">{item.label}</AppText>
                <AppText adjustsFontSizeToFit numberOfLines={1} variant="subtitle">{item.value}</AppText>
              </View>
            ))}
          </View>
        ) : null}
        {insights?.length ? (
          <View style={styles.insightGrid}>
            {insights.map((item) => (
              <View key={item.label} style={styles.insightCell}>
                <StatusPill compact icon={item.icon} label={item.label} tone={item.tone} />
                <AppText adjustsFontSizeToFit numberOfLines={1} variant="subtitle">{item.value}</AppText>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </Card>
  );
}

type FinancialRiskBannerProps = {
  body: string;
  icon?: AppIconName;
  title: string;
  visible?: boolean;
};

export function FinancialRiskBanner({ body, icon = 'icon.security.risk_shield', title, visible = true }: FinancialRiskBannerProps) {
  const colors = useThemeColors();

  if (!visible) {
    return null;
  }

  return (
    <View style={StyleSheet.flatten([styles.riskBanner, { backgroundColor: colors.surface.subtle }])}>
      <AppIcon tone="amber" name={icon} sizeVariant="sm" />
      <View style={styles.flex}>
        <AppText variant="caption">{title}</AppText>
        <AppText tone="muted" variant="caption">{body}</AppText>
      </View>
    </View>
  );
}

export function FinancialFormFlow({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={StyleSheet.flatten([styles.formFlow, style])}>{children}</View>;
}

type FinancialSelectFieldProps = {
  error?: string;
  helperText?: string;
  icon: AppIconName;
  label: string;
  onPress: () => void;
  rightSlot?: ReactNode;
  value: string;
};

export function FinancialSelectField({ error, helperText, icon, label, onPress, rightSlot, value }: FinancialSelectFieldProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.fieldWrap}>
      <NativePressable
        accessibilityLabel={label}
        accessibilityRole="button"
        minTouch={layout.financialPattern.fieldMinTouch}
        onPress={onPress}
        style={StyleSheet.flatten([styles.selectField, { backgroundColor: colors.surface.panel, borderColor: error ? colors.status.danger.fg : colors.border.default }])}>
        <IconSurface icon={icon} sizeVariant="sm" />
        <View style={styles.flex}>
          <AppText numberOfLines={1} tone="muted" variant="eyebrow">{label}</AppText>
          <AppText numberOfLines={1} variant="body">{value}</AppText>
        </View>
        {rightSlot}
        <AppIcon name="icon.system.chevron_down" sizeVariant="xs" />
      </NativePressable>
      <FinancialFieldMessage error={error} helperText={helperText} />
    </View>
  );
}

function FinancialFieldMessage({ error, helperText }: { error?: string; helperText?: string }) {
  if (error) {
    return <AppText style={styles.fieldHelper} tone="danger" variant="caption">{error}</AppText>;
  }

  if (helperText) {
    return <AppText style={styles.fieldHelper} tone="muted" variant="caption">{helperText}</AppText>;
  }

  return null;
}

type FinancialMethodRowProps = {
  disabled?: boolean;
  helper: string;
  icon: AppIconName;
  label: string;
  onPress: () => void;
  selected: boolean;
  statusLabel: string;
  statusTone: StatusPillTone;
};

export function FinancialMethodRow({
  disabled,
  helper,
  icon,
  label,
  onPress,
  selected,
  statusLabel,
  statusTone,
}: FinancialMethodRowProps) {
  const colors = useThemeColors();
  const borderWidth = selected ? lineWidth.selected : lineWidth.hairline;
  const paddingOffset = borderWidth - lineWidth.hairline;

  return (
    <NativePressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      minTouch={layout.financialPattern.methodRowMinTouch}
      onPress={onPress}
      style={StyleSheet.flatten([
        styles.methodRow,
        {
          backgroundColor: colors.surface.panel,
          borderColor: selected ? colors.text.primary : colors.border.subtle,
          borderWidth,
          padding: layout.financialPattern.methodRowPadding - paddingOffset,
        },
        disabled && { opacity: layout.financialPattern.disabledOpacity },
      ])}>
      <IconSurface background={disabled ? 'hidden' : 'visible'} icon={icon} sizeVariant="sm" tone="neutral" />
      <View style={styles.flex}>
        <View style={styles.methodRowTop}>
          <AppText numberOfLines={1} tone={disabled ? 'dim' : 'default'} variant="subtitle">{label}</AppText>
          <StatusPill compact label={statusLabel} tone={statusTone} />
        </View>
        <AppText numberOfLines={2} tone="muted" variant="caption">{helper}</AppText>
      </View>
      <AppIcon name={selected ? 'icon.status.verified' : 'icon.system.chevron_right'} sizeVariant="xs" tone={selected ? 'success' : 'tertiary'} />
    </NativePressable>
  );
}

type FinancialAmountStageProps = {
  children: ReactNode;
  error?: string;
  icon: AppIconName;
  label: string;
  statusLabel: string;
};

export function FinancialAmountStage({ children, error, icon, label, statusLabel }: FinancialAmountStageProps) {
  const colors = useThemeColors();

  return (
    <View style={StyleSheet.flatten([styles.amountStage, { backgroundColor: colors.surface.raised }])}>
      <View style={styles.amountStageHeader}>
        <IconSurface icon={icon} sizeVariant="xs" />
        <View style={styles.flex}>
          <AppText numberOfLines={1} tone="muted" variant="eyebrow">{label}</AppText>
        </View>
        <StatusPill compact label={statusLabel} tone="neutral" />
      </View>
      {children}
    </View>
  );
}

type FinancialTransactionRowProps = {
  accessibilityLabel: string;
  amount: string;
  amountTone: AppTextTone;
  icon: AppIconName;
  meta: string;
  onPress: () => void;
  showDivider?: boolean;
  statusLabel: string;
  statusTone: StatusPillTone;
  surfaceTone: IconSurfaceTone;
  title: string;
};

export function FinancialTransactionRow({
  accessibilityLabel,
  amount,
  amountTone,
  icon,
  meta,
  onPress,
  showDivider,
  statusLabel,
  statusTone,
  surfaceTone,
  title,
}: FinancialTransactionRowProps) {
  const colors = useThemeColors();

  return (
    <NativePressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      minTouch={layout.financialPattern.transactionRowMinTouch}
      onPress={onPress}
      style={StyleSheet.flatten([styles.transactionRow, showDivider && { borderBottomColor: colors.border.subtle, borderBottomWidth: lineWidth.hairline }])}>
      <IconSurface icon={icon} sizeVariant="sm" tone={surfaceTone} />
      <View style={styles.flex}>
        <AppText numberOfLines={1} variant="subtitle">{title}</AppText>
        <AppText numberOfLines={1} tone="muted" variant="caption">{meta}</AppText>
      </View>
      <View style={styles.transactionSide}>
        <AppText adjustsFontSizeToFit numberOfLines={1} tone={amountTone} variant="subtitle">{amount}</AppText>
        <StatusPill compact label={statusLabel} tone={statusTone} />
      </View>
      <AppIcon name="icon.system.chevron_right" size={layout.menuDisclosureIconSize} tone="tertiary" />
    </NativePressable>
  );
}

const styles = StyleSheet.create({
  amountStage: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    gap: layout.financialPattern.amountStageGap,
    paddingHorizontal: layout.cardPaddingX,
    paddingVertical: layout.cardPaddingY,
  },
  amountStageHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: layout.controlGap,
  },
  fieldHelper: {
    paddingLeft: layout.formFieldTextInset,
  },
  fieldWrap: {
    gap: layout.fieldGap,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  formFlow: {
    gap: layout.financialPattern.formFlowGap,
  },
  heroHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: layout.financialPattern.heroGap,
  },
  heroMetricGrid: {
    borderTopWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: layout.financialPattern.heroGap,
    marginTop: layout.financialPattern.heroGap,
    paddingTop: layout.financialPattern.heroGap,
  },
  heroStack: {
    gap: layout.financialPattern.heroGap,
  },
  insightCell: {
    flex: 1,
    gap: layout.financialPattern.heroDataGap,
    minWidth: 0,
  },
  insightGrid: {
    flexDirection: 'row',
    gap: layout.financialPattern.heroGap,
  },
  methodRow: {
    alignItems: 'center',
    borderRadius: radius.card,
    flexDirection: 'row',
    gap: layout.financialPattern.methodRowGap,
  },
  methodRowTop: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.inlineGap,
  },
  metricCell: {
    flex: 1,
    gap: layout.financialPattern.heroDataGap,
    minWidth: 0,
  },
  riskBanner: {
    alignItems: 'flex-start',
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    flexDirection: 'row',
    gap: layout.financialPattern.riskGap,
    padding: layout.financialPattern.riskPadding,
  },
  selectField: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: lineWidth.strong,
    flexDirection: 'row',
    gap: layout.financialPattern.fieldGap,
    minHeight: layout.financialPattern.fieldMinTouch,
    paddingHorizontal: layout.formFieldTextInset,
    paddingVertical: layout.financialPattern.fieldPaddingY,
  },
  transactionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: layout.financialPattern.transactionRowGap,
    paddingHorizontal: spacing.none,
    paddingVertical: layout.listRowPaddingY,
  },
  transactionSide: {
    alignItems: 'flex-end',
    gap: layout.financialPattern.heroDataGap,
    minWidth: size.viewport.detailSideMinWidth,
  },
});
