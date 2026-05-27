import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DEMO_OTP, safeRedirect } from '@/src/auth/authFlow';
import { AuthShell } from '@/src/components/AuthShell';
import { OtpInput, OtpRecoveryActions, useCountdown } from '@/src/components/AuthFlowControls';
import { useToast } from '@/src/feedback/Toast';
import { notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { spacing } from '@/src/theme/tokens';

const MAX_RESENDS = 3;

export default function RegisterPhoneCodeScreen() {
  const params = useLocalSearchParams<{ phone?: string; redirect?: string }>();
  const { t } = useProductSettings();
  const toast = useToast();
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const { reset, secondsLeft } = useCountdown(15);
  const redirect = safeRedirect(typeof params.redirect === 'string' ? params.redirect : undefined);
  const phone = typeof params.phone === 'string' ? params.phone : '';
  const codeError = submitted && code !== DEMO_OTP ? t('auth.verify.errorCodeShort') : '';
  const canResend = secondsLeft === 0 && resendCount < MAX_RESENDS;

  const verifyCode = (next: string) => {
    setCode(next);

    if (next.length < 6) {
      setSubmitted(false);
      return;
    }

    setSubmitted(true);

    if (!phone || next !== DEMO_OTP) {
      void notifyWarning();
      return;
    }

    void notifySuccess();
    router.push(
      `/auth/register-phone?phone=${encodeURIComponent(phone)}&redirect=${encodeURIComponent(String(redirect))}` as never,
    );
  };

  const resendCode = () => {
    if (!canResend) {
      void notifyWarning();
      toast.show({
        message: t('auth.verify.resendTooSoonBody', { time: `00:${String(secondsLeft).padStart(2, '0')}` }),
        title: t('auth.verify.resendTooSoonTitle'),
        tone: 'warning',
      });
      return;
    }

    setCode('');
    setSubmitted(false);
    setResendCount((count) => count + 1);
    reset();
    void notifySuccess();
    toast.show({
      message: t('auth.verify.resendBody', { code: DEMO_OTP }),
      title: t('auth.verify.resendTitle'),
      tone: 'success',
    });
  };

  const openRecoveryHelp = () => {
    void notifyWarning();
    toast.show({
      message: resendCount >= MAX_RESENDS ? t('auth.verify.resendLimitBody') : t('auth.verify.noCodeHelpPhone'),
      title: t('auth.verify.noCode'),
      tone: 'warning',
    });
  };

  return (
    <AuthShell
      backTarget={`/auth/register?redirect=${encodeURIComponent(String(redirect))}`}
      navMode="back"
      progressStep={1}
      subtitle={t('auth.register.phoneCodeSubtitle', { phone })}
      title={t('auth.register.phoneCodeTitle')}>
      <View style={styles.codeStack}>
        <OtpInput autoFocus error={codeError} onChange={verifyCode} value={code} />
        <OtpRecoveryActions
          canResend={canResend}
          changeTargetLabel={t('auth.verify.changePhone')}
          maxResends={MAX_RESENDS}
          onChangeTarget={() => router.replace(`/auth/register?redirect=${encodeURIComponent(String(redirect))}` as never)}
          onOpenHelp={openRecoveryHelp}
          onResend={resendCode}
          resendCount={resendCount}
          secondsLeft={secondsLeft}
        />
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  codeStack: {
    gap: spacing.md,
  },
});
