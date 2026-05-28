import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DEMO_OTP, isValidEmail, safeRedirect } from '@/src/auth/authFlow';
import { AuthShell } from '@/src/design-public-assets/components';
import { OtpInput, OtpRecoveryActions, useCountdown } from '@/src/design-public-assets/components';
import { useToast } from '@/src/feedback/Toast';
import { notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import type { NavigationTarget } from '@/src/navigation/navigationPolicy';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { spacing } from '@/src/design-public-assets/tokens';

const MAX_RESENDS = 3;

export default function RegisterEmailCodeScreen() {
  const params = useLocalSearchParams<{ email?: string; phone?: string; redirect?: string }>();
  const { t } = useProductSettings();
  const toast = useToast();
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const { reset, secondsLeft } = useCountdown(15);
  const redirect = safeRedirect(typeof params.redirect === 'string' ? params.redirect : undefined);
  const email = typeof params.email === 'string' ? params.email : '';
  const phone = typeof params.phone === 'string' ? params.phone : '';
  const codeError = submitted && code !== DEMO_OTP ? t('auth.verify.errorCodeShort') : '';
  const canResend = secondsLeft === 0 && resendCount < MAX_RESENDS;
  const emailStepTarget = `/auth/register-phone?phone=${encodeURIComponent(phone)}&redirect=${encodeURIComponent(String(redirect))}` as NavigationTarget;
  const phoneStepTarget = `/auth/register?redirect=${encodeURIComponent(String(redirect))}` as NavigationTarget;

  useEffect(() => {
    if (!phone) {
      router.replace(phoneStepTarget as never);
    }
  }, [phone, phoneStepTarget]);

  const verifyCode = (next: string) => {
    setCode(next);

    if (next.length < 6) {
      setSubmitted(false);
      return;
    }

    setSubmitted(true);

    if (!phone) {
      void notifyWarning();
      router.replace(phoneStepTarget as never);
      return;
    }

    if (!isValidEmail(email) || next !== DEMO_OTP) {
      void notifyWarning();
      return;
    }

    void notifySuccess();
    router.push(
      `/auth/register-password?phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(String(redirect))}` as never,
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
      message: resendCount >= MAX_RESENDS ? t('auth.verify.resendLimitBody') : t('auth.verify.noCodeHelpEmail'),
      title: t('auth.verify.noCode'),
      tone: 'warning',
    });
  };

  return (
    <AuthShell
      backTarget={emailStepTarget}
      navMode="back"
      progressStep={2}
      subtitle={t('auth.register.emailCodeSubtitle', { email })}
      title={t('auth.register.emailCodeTitle')}>
      <View style={styles.codeStack}>
        <OtpInput autoFocus error={codeError} onChange={verifyCode} value={code} />
        <OtpRecoveryActions
          canResend={canResend}
          changeTargetLabel={t('auth.verify.changeEmail')}
          maxResends={MAX_RESENDS}
          onChangeTarget={() => router.replace(emailStepTarget as never)}
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
