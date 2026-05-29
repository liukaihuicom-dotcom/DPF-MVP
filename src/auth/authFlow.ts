import type { Href } from 'expo-router';
import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js/min';

import type { AuthChannel } from '@/src/domain/types';

type AuthRouteTarget = Extract<Href, string>;

export const DEMO_OTP = '123456';
export const RESEND_SECONDS = 15;

export type AuthIntent = 'login' | 'registerEmail' | 'registerPhone' | 'reset';

export type CountryOption = {
  code: CountryCode;
  dialCode: string;
  flag: string;
  name: string;
};

export type PhoneValidationResult = {
  countryCode: CountryCode;
  e164: string;
  nationalNumber: string;
  valid: boolean;
};

export const countryOptions: CountryOption[] = [
  { code: 'ID', dialCode: '+62', flag: 'ID', name: 'Indonesia' },
  { code: 'SG', dialCode: '+65', flag: 'SG', name: 'Singapore' },
  { code: 'MY', dialCode: '+60', flag: 'MY', name: 'Malaysia' },
  { code: 'TH', dialCode: '+66', flag: 'TH', name: 'Thailand' },
  { code: 'VN', dialCode: '+84', flag: 'VN', name: 'Vietnam' },
  { code: 'PH', dialCode: '+63', flag: 'PH', name: 'Philippines' },
  { code: 'BN', dialCode: '+673', flag: 'BN', name: 'Brunei Darussalam' },
  { code: 'KH', dialCode: '+855', flag: 'KH', name: 'Cambodia' },
  { code: 'LA', dialCode: '+856', flag: 'LA', name: 'Laos' },
  { code: 'MM', dialCode: '+95', flag: 'MM', name: 'Myanmar' },
  { code: 'AU', dialCode: '+61', flag: 'AU', name: 'Australia' },
  { code: 'NZ', dialCode: '+64', flag: 'NZ', name: 'New Zealand' },
  { code: 'US', dialCode: '+1', flag: 'US', name: 'United States' },
  { code: 'CA', dialCode: '+1', flag: 'CA', name: 'Canada' },
  { code: 'GB', dialCode: '+44', flag: 'GB', name: 'United Kingdom' },
  { code: 'IE', dialCode: '+353', flag: 'IE', name: 'Ireland' },
  { code: 'CN', dialCode: '+86', flag: 'CN', name: 'China mainland' },
  { code: 'HK', dialCode: '+852', flag: 'HK', name: 'Hong Kong SAR' },
  { code: 'MO', dialCode: '+853', flag: 'MO', name: 'Macao SAR' },
  { code: 'TW', dialCode: '+886', flag: 'TW', name: 'Taiwan' },
  { code: 'JP', dialCode: '+81', flag: 'JP', name: 'Japan' },
  { code: 'KR', dialCode: '+82', flag: 'KR', name: 'South Korea' },
  { code: 'IN', dialCode: '+91', flag: 'IN', name: 'India' },
  { code: 'PK', dialCode: '+92', flag: 'PK', name: 'Pakistan' },
  { code: 'BD', dialCode: '+880', flag: 'BD', name: 'Bangladesh' },
  { code: 'LK', dialCode: '+94', flag: 'LK', name: 'Sri Lanka' },
  { code: 'NP', dialCode: '+977', flag: 'NP', name: 'Nepal' },
  { code: 'MV', dialCode: '+960', flag: 'MV', name: 'Maldives' },
  { code: 'MN', dialCode: '+976', flag: 'MN', name: 'Mongolia' },
  { code: 'AE', dialCode: '+971', flag: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', dialCode: '+966', flag: 'SA', name: 'Saudi Arabia' },
  { code: 'QA', dialCode: '+974', flag: 'QA', name: 'Qatar' },
  { code: 'KW', dialCode: '+965', flag: 'KW', name: 'Kuwait' },
  { code: 'BH', dialCode: '+973', flag: 'BH', name: 'Bahrain' },
  { code: 'OM', dialCode: '+968', flag: 'OM', name: 'Oman' },
  { code: 'JO', dialCode: '+962', flag: 'JO', name: 'Jordan' },
  { code: 'LB', dialCode: '+961', flag: 'LB', name: 'Lebanon' },
  { code: 'IL', dialCode: '+972', flag: 'IL', name: 'Israel' },
  { code: 'PS', dialCode: '+970', flag: 'PS', name: 'Palestine' },
  { code: 'TR', dialCode: '+90', flag: 'TR', name: 'Turkey' },
  { code: 'DE', dialCode: '+49', flag: 'DE', name: 'Germany' },
  { code: 'FR', dialCode: '+33', flag: 'FR', name: 'France' },
  { code: 'IT', dialCode: '+39', flag: 'IT', name: 'Italy' },
  { code: 'ES', dialCode: '+34', flag: 'ES', name: 'Spain' },
  { code: 'PT', dialCode: '+351', flag: 'PT', name: 'Portugal' },
  { code: 'NL', dialCode: '+31', flag: 'NL', name: 'Netherlands' },
  { code: 'BE', dialCode: '+32', flag: 'BE', name: 'Belgium' },
  { code: 'LU', dialCode: '+352', flag: 'LU', name: 'Luxembourg' },
  { code: 'CH', dialCode: '+41', flag: 'CH', name: 'Switzerland' },
  { code: 'AT', dialCode: '+43', flag: 'AT', name: 'Austria' },
  { code: 'SE', dialCode: '+46', flag: 'SE', name: 'Sweden' },
  { code: 'NO', dialCode: '+47', flag: 'NO', name: 'Norway' },
  { code: 'DK', dialCode: '+45', flag: 'DK', name: 'Denmark' },
  { code: 'FI', dialCode: '+358', flag: 'FI', name: 'Finland' },
  { code: 'IS', dialCode: '+354', flag: 'IS', name: 'Iceland' },
  { code: 'PL', dialCode: '+48', flag: 'PL', name: 'Poland' },
  { code: 'CZ', dialCode: '+420', flag: 'CZ', name: 'Czech Republic' },
  { code: 'SK', dialCode: '+421', flag: 'SK', name: 'Slovakia' },
  { code: 'HU', dialCode: '+36', flag: 'HU', name: 'Hungary' },
  { code: 'RO', dialCode: '+40', flag: 'RO', name: 'Romania' },
  { code: 'BG', dialCode: '+359', flag: 'BG', name: 'Bulgaria' },
  { code: 'GR', dialCode: '+30', flag: 'GR', name: 'Greece' },
  { code: 'CY', dialCode: '+357', flag: 'CY', name: 'Cyprus' },
  { code: 'MT', dialCode: '+356', flag: 'MT', name: 'Malta' },
  { code: 'EE', dialCode: '+372', flag: 'EE', name: 'Estonia' },
  { code: 'LV', dialCode: '+371', flag: 'LV', name: 'Latvia' },
  { code: 'LT', dialCode: '+370', flag: 'LT', name: 'Lithuania' },
  { code: 'SI', dialCode: '+386', flag: 'SI', name: 'Slovenia' },
  { code: 'HR', dialCode: '+385', flag: 'HR', name: 'Croatia' },
  { code: 'RS', dialCode: '+381', flag: 'RS', name: 'Serbia' },
  { code: 'BA', dialCode: '+387', flag: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'ME', dialCode: '+382', flag: 'ME', name: 'Montenegro' },
  { code: 'MK', dialCode: '+389', flag: 'MK', name: 'North Macedonia' },
  { code: 'AL', dialCode: '+355', flag: 'AL', name: 'Albania' },
  { code: 'RU', dialCode: '+7', flag: 'RU', name: 'Russia' },
  { code: 'UA', dialCode: '+380', flag: 'UA', name: 'Ukraine' },
  { code: 'BY', dialCode: '+375', flag: 'BY', name: 'Belarus' },
  { code: 'MD', dialCode: '+373', flag: 'MD', name: 'Moldova' },
  { code: 'GE', dialCode: '+995', flag: 'GE', name: 'Georgia' },
  { code: 'AM', dialCode: '+374', flag: 'AM', name: 'Armenia' },
  { code: 'AZ', dialCode: '+994', flag: 'AZ', name: 'Azerbaijan' },
  { code: 'KZ', dialCode: '+7', flag: 'KZ', name: 'Kazakhstan' },
  { code: 'UZ', dialCode: '+998', flag: 'UZ', name: 'Uzbekistan' },
  { code: 'KG', dialCode: '+996', flag: 'KG', name: 'Kyrgyzstan' },
  { code: 'TJ', dialCode: '+992', flag: 'TJ', name: 'Tajikistan' },
  { code: 'TM', dialCode: '+993', flag: 'TM', name: 'Turkmenistan' },
  { code: 'BR', dialCode: '+55', flag: 'BR', name: 'Brazil' },
  { code: 'MX', dialCode: '+52', flag: 'MX', name: 'Mexico' },
  { code: 'AR', dialCode: '+54', flag: 'AR', name: 'Argentina' },
  { code: 'CL', dialCode: '+56', flag: 'CL', name: 'Chile' },
  { code: 'CO', dialCode: '+57', flag: 'CO', name: 'Colombia' },
  { code: 'PE', dialCode: '+51', flag: 'PE', name: 'Peru' },
  { code: 'EC', dialCode: '+593', flag: 'EC', name: 'Ecuador' },
  { code: 'UY', dialCode: '+598', flag: 'UY', name: 'Uruguay' },
  { code: 'PY', dialCode: '+595', flag: 'PY', name: 'Paraguay' },
  { code: 'BO', dialCode: '+591', flag: 'BO', name: 'Bolivia' },
  { code: 'VE', dialCode: '+58', flag: 'VE', name: 'Venezuela' },
  { code: 'CR', dialCode: '+506', flag: 'CR', name: 'Costa Rica' },
  { code: 'PA', dialCode: '+507', flag: 'PA', name: 'Panama' },
  { code: 'GT', dialCode: '+502', flag: 'GT', name: 'Guatemala' },
  { code: 'DO', dialCode: '+1', flag: 'DO', name: 'Dominican Republic' },
  { code: 'PR', dialCode: '+1', flag: 'PR', name: 'Puerto Rico' },
  { code: 'JM', dialCode: '+1', flag: 'JM', name: 'Jamaica' },
  { code: 'BS', dialCode: '+1', flag: 'BS', name: 'Bahamas' },
  { code: 'BB', dialCode: '+1', flag: 'BB', name: 'Barbados' },
  { code: 'TT', dialCode: '+1', flag: 'TT', name: 'Trinidad and Tobago' },
  { code: 'CU', dialCode: '+53', flag: 'CU', name: 'Cuba' },
  { code: 'ZA', dialCode: '+27', flag: 'ZA', name: 'South Africa' },
  { code: 'NG', dialCode: '+234', flag: 'NG', name: 'Nigeria' },
  { code: 'KE', dialCode: '+254', flag: 'KE', name: 'Kenya' },
  { code: 'GH', dialCode: '+233', flag: 'GH', name: 'Ghana' },
  { code: 'TZ', dialCode: '+255', flag: 'TZ', name: 'Tanzania' },
  { code: 'UG', dialCode: '+256', flag: 'UG', name: 'Uganda' },
  { code: 'RW', dialCode: '+250', flag: 'RW', name: 'Rwanda' },
  { code: 'ET', dialCode: '+251', flag: 'ET', name: 'Ethiopia' },
  { code: 'CI', dialCode: '+225', flag: 'CI', name: "Cote d'Ivoire" },
  { code: 'SN', dialCode: '+221', flag: 'SN', name: 'Senegal' },
  { code: 'CM', dialCode: '+237', flag: 'CM', name: 'Cameroon' },
  { code: 'EG', dialCode: '+20', flag: 'EG', name: 'Egypt' },
  { code: 'MA', dialCode: '+212', flag: 'MA', name: 'Morocco' },
  { code: 'DZ', dialCode: '+213', flag: 'DZ', name: 'Algeria' },
  { code: 'TN', dialCode: '+216', flag: 'TN', name: 'Tunisia' },
  { code: 'AO', dialCode: '+244', flag: 'AO', name: 'Angola' },
  { code: 'MZ', dialCode: '+258', flag: 'MZ', name: 'Mozambique' },
  { code: 'ZM', dialCode: '+260', flag: 'ZM', name: 'Zambia' },
  { code: 'ZW', dialCode: '+263', flag: 'ZW', name: 'Zimbabwe' },
  { code: 'BW', dialCode: '+267', flag: 'BW', name: 'Botswana' },
  { code: 'MU', dialCode: '+230', flag: 'MU', name: 'Mauritius' },
];

export const defaultCountry = countryOptions[0];

export function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value.trim());
}

export function sanitizeOtp(value: string) {
  return value.replace(/\D/g, '').slice(0, 6);
}

export function sanitizePhone(value: string) {
  return value.replace(/[^\d]/g, '').slice(0, 17);
}

export function validatePhoneNumber(value: string, country: CountryOption): PhoneValidationResult {
  const nationalNumber = sanitizePhone(value);
  const parsed = parsePhoneNumberFromString(nationalNumber, country.code);
  const e164 = parsed?.number ?? '';
  const valid = Boolean(parsed?.isValid() && parsed.country === country.code && e164.startsWith(country.dialCode));

  return {
    countryCode: country.code,
    e164,
    nationalNumber,
    valid,
  };
}

export function formatPhoneAccount(value: string, country: CountryOption) {
  const result = validatePhoneNumber(value, country);
  return result.valid ? result.e164 : '';
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
  return channel === 'phone' ? normalizePhoneAccount(trimmed, dialCode) : trimmed;
}

function normalizePhoneAccount(value: string, dialCode = defaultCountry.dialCode) {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  if (trimmed.startsWith('+')) {
    const digits = sanitizePhone(trimmed);
    return digits ? `+${digits}` : trimmed;
  }

  const digits = sanitizePhone(trimmed);
  return digits ? `${dialCode}${digits}` : trimmed;
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
