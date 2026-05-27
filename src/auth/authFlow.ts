import type { Href } from 'expo-router';

import type { AuthChannel } from '@/src/domain/types';

type AuthRouteTarget = Extract<Href, string>;

export const DEMO_OTP = '123456';
export const RESEND_SECONDS = 15;

export type AuthIntent = 'login' | 'registerEmail' | 'registerPhone' | 'reset';

export type CountryOption = {
  code: string;
  dialCode: string;
  flag: string;
  name: string;
};

export const countryOptions: CountryOption[] = [
  { code: 'ID', dialCode: '+62', flag: 'ID', name: 'Indonesia' },
  { code: 'SG', dialCode: '+65', flag: 'SG', name: 'Singapore' },
  { code: 'US', dialCode: '+1', flag: 'US', name: 'United States' },
  { code: 'GB', dialCode: '+44', flag: 'GB', name: 'United Kingdom' },
  { code: 'CN', dialCode: '+86', flag: 'CN', name: 'China mainland' },
  { code: 'IN', dialCode: '+91', flag: 'IN', name: 'India' },
  { code: 'FR', dialCode: '+33', flag: 'FR', name: 'France' },
  { code: 'AU', dialCode: '+61', flag: 'AU', name: 'Australia' },
];

export const defaultCountry = countryOptions[0];

export function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value.trim());
}

export function sanitizeOtp(value: string) {
  return value.replace(/\D/g, '').slice(0, 6);
}

export function sanitizePhone(value: string) {
  return value.replace(/[^\d]/g, '').slice(0, 14);
}

export function safeRedirect(value: string | undefined): AuthRouteTarget {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/markets' as AuthRouteTarget;
  }

  return value as AuthRouteTarget;
}

export function buildAuthRoute(
  path: '/auth' | '/auth/register' | '/auth/forgot-password',
  redirect: AuthRouteTarget,
  params?: Record<string, string | undefined>,
): AuthRouteTarget {
  const searchParams = new URLSearchParams({ redirect });

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  return `${path}?${searchParams.toString()}` as AuthRouteTarget;
}

export function maskTarget(channel: AuthChannel, target: string) {
  if (channel === 'phone') {
    return maskDisplayAccount(target, 'phone', target);
  }

  const [name, domain] = target.split('@');
  if (!domain) {
    return target;
  }

  return `${name.slice(0, 2)}***@${domain}`;
}

export function maskDisplayAccount(target: string, channel: AuthChannel, fallback: string) {
  const trimmed = target.trim();

  if (!trimmed) {
    return fallback;
  }

  if (channel === 'phone') {
    const match = trimmed.match(/^(\+\d+)\s*(.*)$/);
    const dialCode = match?.[1] ?? '';
    const digits = (match?.[2] ?? trimmed).replace(/\D/g, '');

    if (digits.length <= 4) {
      return dialCode ? `${dialCode} ${digits}` : digits || fallback;
    }

    return `${dialCode ? `${dialCode} ` : ''}****${digits.slice(-4)}`;
  }

  const [name, domain] = trimmed.split('@');

  if (!domain) {
    return trimmed.length > 2 ? `${trimmed.slice(0, 2)}***` : trimmed;
  }

  return `${name.slice(0, 2)}***@${domain}`;
}

export function resolveDisplayName({ account, channel, fallback, nickname }: { account: string; channel: AuthChannel; fallback: string; nickname: string }) {
  const trimmedNickname = nickname.trim();
  return trimmedNickname || maskDisplayAccount(account, channel, fallback);
}

export function buildAccount(channel: AuthChannel, value: string, dialCode?: string) {
  const trimmed = value.trim();
  return channel === 'phone' ? `${dialCode ?? defaultCountry.dialCode} ${trimmed}` : trimmed;
}

export function getPasswordChecks(password: string) {
  return {
    length: password.length >= 8,
    letterCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
}

export function isStrongPassword(password: string) {
  return Object.values(getPasswordChecks(password)).every(Boolean);
}
