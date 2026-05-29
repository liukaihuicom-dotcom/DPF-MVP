import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DEMO_OTP, buildAccount, buildAuthRoute, defaultCountry, formatPhoneAccount, isStrongPassword, isValidEmail, safeRedirect, sanitizePhone, validatePhoneNumber } from '@/src/auth/authFlow';
import { ActionButton } from '@/src/design-public-assets/components';
import { AuthDescriptionAction, AuthLink, AuthShell, AuthTextField } from '@/src/design-public-assets/components';
import { AuthErrorSheet, CountryPhoneField, OtpInput, PasswordRuleList, useCountdown } from '@/src/design-public-assets/components';
import { AppText } from '@/src/design-public-assets/components';
import type { AuthChannel } from '@/src/domain/types';
import { notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { navigateBackOrReplace } from '@/src/navigation/navigationPolicy';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { spacing } from '@/src/design-public-assets/tokens';

type ResetStep = 'account' | 'code' | 'password';

export default function ForgotPasswordScreen() {
  const params = useLocalSearchParams<{ redirect?: string }>();
  const { setLastLoginAccount, setLastLoginChannel, t } = useProductSettings();
  const [step, setStep] = useState<ResetStep>('account');
  const [channel, setChannel] = useState<AuthChannel>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState(defaultCountry);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const { reset, secondsLeft } = useCountdown(15);
  const redirect = safeRedirect(typeof params.redirect === 'string' ? params.redirect : undefined);
  const phoneValidation = validatePhoneNumber(phone, country);
  const account = channel === 'email' ? buildAccount('email', email) : formatPhoneAccount(phone, country);
  const accountValid = channel === 'email' ? isValidEmail(email) : phoneValidation.valid;
  const passwordValid = isStrongPassword(password);
  const confirmValid = password === confirmPassword && confirmPassword.length > 0;
  const accountError = submitted && !accountValid ? (channel === 'email' ? t('auth.error.email') : t('auth.error.phone')) : '';
  const codeError = submitted && code !== DEMO_OTP ? t('auth.verify.errorCodeShort') : '';
  const passwordError = submitted && !passwordValid ? t('auth.error.passwordStrong') : '';
  const confirmTouched = confirmPassword.length > 0;
  const confirmError = passwordValid && (submitted || confirmTouched) && !confirmValid ? t('auth.error.confirmPassword') : '';
  const canContinue = step === 'account' ? accountValid : passwordValid && confirmValid;
  const resetProgressStep = step === 'account' ? 1 : step === 'code' ? 2 : 3;

  const submit = () => {
    setSubmitted(true);

    if (step === 'account') {
      if (!accountValid) {
        void notifyWarning();
        setErrorOpen(true);
        return;
      }

      setSubmitted(false);
      setStep('code');
      return;
    }

    if (!passwordValid || !confirmValid) {
      void notifyWarning();
      setErrorOpen(true);
      return;
    }

    setLastLoginAccount(account);
    setLastLoginChannel(channel);
    void notifySuccess();
    router.replace(`${buildAuthRoute('/auth', redirect)}&account=${encodeURIComponent(account)}&channel=${channel}` as never);
  };

  const switchChannel = () => {
    setChannel((value) => (value === 'email' ? 'phone' : 'email'));
    setSubmitted(false);
  };
  const accountSubtitle =
    channel === 'email' ? t('auth.reset.emailSubtitle') : t('auth.reset.phoneSubtitle');
  const handleBack = () => {
    if (step === 'password') {
      setStep('code');
      setSubmitted(false);
      return;
    }

    if (step === 'code') {
      setStep('account');
      setCode('');
      setSubmitted(false);
      return;
    }

    navigateBackOrReplace(buildAuthRoute('/auth', redirect));
  };

  const verifyCode = (next: string) => {
    setCode(next);

    if (next.length < 6) {
      setSubmitted(false);
      return;
    }

    setSubmitted(true);

    if (next !== DEMO_OTP) {
      void notifyWarning();
      return;
    }

    void notifySuccess();
    setSubmitted(false);
    setStep('password');
  };

  return (
    <AuthShell
      descriptionAction={
        step === 'account' ? (
          <AuthDescriptionAction
            actionLabel={channel === 'email' ? t('auth.reset.usePhoneAction') : t('auth.reset.useEmailAction')}
            label={t('auth.reset.switchChannelPrefix')}
            onPress={switchChannel}
          />
        ) : null
      }
      footer={step === 'code' ? null : <ActionButton disabled={!canContinue} label={step === 'password' ? t('auth.reset.finish') : t('auth.action.continue')} onPress={submit} tone="brand" variant="filled" />}
      navMode="back"
      onBackPress={handleBack}
      progressStep={resetProgressStep}
      progressTotal={3}
      subtitle={step === 'account' ? accountSubtitle : step === 'code' ? t('auth.reset.codeSubtitle', { account }) : t('auth.reset.passwordSubtitle')}
      title={step === 'account' ? t('auth.reset.title') : step === 'code' ? t('auth.verify.titleShort') : t('auth.reset.passwordTitle')}>
      {step === 'account' ? (
        <>
          {channel === 'email' ? (
            <AuthTextField
              autoFocus
              autoComplete="email"
              error={accountError}
              keyboardType="email-address"
              label={t('auth.email')}
              onChangeText={setEmail}
              placeholder={t('auth.emailPlaceholder')}
              textContentType="emailAddress"
              value={email}
            />
          ) : (
            <CountryPhoneField
              autoFocus
              country={country}
              error={accountError}
              onChangeCountry={setCountry}
              onChangePhone={(value) => setPhone(sanitizePhone(value))}
              phone={phone}
            />
          )}
        </>
      ) : null}

      {step === 'code' ? (
        <View style={styles.codeStack}>
          <OtpInput autoFocus error={codeError} onChange={verifyCode} value={code} />
          {secondsLeft > 0 ? (
            <AppText tone="muted" variant="caption">
              {t('auth.verify.resendCountdownV2', { time: `00:${String(secondsLeft).padStart(2, '0')}` })}
            </AppText>
          ) : (
            <AuthLink
              label={t('auth.verify.noCode')}
              onPress={() => {
                setCode('');
                setSubmitted(false);
                reset();
              }}
            />
          )}
        </View>
      ) : null}

      {step === 'password' ? (
        <>
          <View style={styles.passwordGroup}>
            <AuthTextField
              autoFocus
              autoComplete="new-password"
              error={passwordError}
              label={t('auth.password.new')}
              onChangeText={setPassword}
              placeholder={t('auth.password.newPlaceholder')}
              secureTextEntry
              textContentType="newPassword"
              value={password}
            />
            <PasswordRuleList password={password} />
          </View>
          <AuthTextField
            autoComplete="new-password"
            error={confirmError}
            label={t('auth.confirmPassword')}
            onChangeText={setConfirmPassword}
            placeholder={t('auth.confirmPasswordPlaceholder')}
            secureTextEntry
            textContentType="newPassword"
            value={confirmPassword}
          />
        </>
      ) : null}

      <AuthErrorSheet body={t('auth.error.fixFields')} onClose={() => setErrorOpen(false)} open={errorOpen} title={t('auth.reset.blocked')} />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  codeStack: {
    gap: spacing.md,
  },
  passwordGroup: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
});
