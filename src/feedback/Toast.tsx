import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';

import { lineWidth } from '@/src/theme/tokens';
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
          style={{
            alignItems: 'center',
            left: 0,
            paddingHorizontal: 14,
            paddingTop: 18,
            pointerEvents: 'box-none',
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 90,
          }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: colors.surface.raised,
              borderColor: colors.border.default,
              borderRadius: 16,
              borderWidth: lineWidth.hairline,
              flexDirection: 'row',
              gap: 10,
              maxWidth: 420,
              minHeight: 52,
              paddingHorizontal: 12,
              paddingVertical: 10,
              width: '100%',
              ...shadows.toast,
            }}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: `${toneColor}18`,
                borderColor: `${toneColor}66`,
                borderRadius: 999,
                borderWidth: lineWidth.hairline,
                height: 26,
                justifyContent: 'center',
                width: 26,
              }}>
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

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    return {
      show: () => undefined,
    };
  }

  return context;
}
