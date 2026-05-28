import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { layout, lineWidth, radius, size, spacing, zIndex } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/settings/ProductSettings';
import { shadows } from '@/src/theme/colors';

import { AppText, type AppTextTone } from '../components/Typography';

type ToastTone = 'danger' | 'default' | 'success' | 'warning';

type ToastPayload = {
  message?: string;
  title: string;
  tone?: ToastTone;
};

type ToastContextValue = {
  show: (payload: ToastPayload) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const colors = useThemeColors();
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    setToast(null);
  }, []);

  const show = useCallback(
    (payload: ToastPayload) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      setToast({ tone: 'default', ...payload });

      timer.current = setTimeout(hide, 2400);
    },
    [hide],
  );

  const value = useMemo(() => ({ show }), [show]);

  const tone = toast?.tone ?? 'default';
  const toneText: AppTextTone = tone === 'success' ? 'success' : tone === 'warning' ? 'amber' : tone === 'danger' ? 'danger' : 'brand';
  const toneColor =
    tone === 'success' ? colors.status.success.fg : tone === 'warning' ? colors.status.warning.fg : tone === 'danger' ? colors.status.danger.fg : colors.brand.fg;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <View
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          pointerEvents="box-none"
          style={styles.host}>
          <View
            style={StyleSheet.flatten([
              styles.toast,
              {
                backgroundColor: colors.surface.raised,
                borderColor: colors.border.default,
              },
              shadows.toast,
            ])}>
            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={StyleSheet.flatten([
                styles.icon,
                {
                  backgroundColor: `${toneColor}18`,
                  borderColor: `${toneColor}66`,
                },
              ])}>
              <AppText tone={toneText} variant="label.status">
                {tone === 'success' ? '✓' : tone === 'danger' ? '!' : tone === 'warning' ? '!' : 'i'}
              </AppText>
            </View>
            <View style={{ flex: 1, gap: 2, minWidth: 0 }}>
              <AppText numberOfLines={1} variant="body.primary">
                {toast.title}
              </AppText>
              {toast.message ? (
                <AppText numberOfLines={2} tone="muted" variant="label.helper">
                  {toast.message}
                </AppText>
              ) : null}
            </View>
          </View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  host: {
    alignItems: 'center',
    left: spacing.none,
    paddingHorizontal: layout.contentCardPaddingX,
    paddingTop: spacing.lg + spacing.xxs,
    position: 'absolute',
    right: spacing.none,
    top: spacing.none,
    zIndex: zIndex.toast,
  },
  icon: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    height: size.surface.toastIconBox,
    justifyContent: 'center',
    width: size.surface.toastIconBox,
  },
  toast: {
    alignItems: 'center',
    borderRadius: radius.xl,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.sm,
    maxWidth: size.viewport.toastMaxWidth,
    minHeight: size.surface.toastMinHeight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xxs,
    width: '100%',
  },
});

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    return {
      show: () => undefined,
    };
  }

  return context;
}
