import type { Locale } from '@/src/i18n/translations';
import type { Direction, Instrument, LocalizedText } from './types';

export function formatMoney(value: number, currency = 'USD', digits = 2, locale: Locale = 'zh-CN') {
  return normalizeCurrencySymbol(new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value), currency);
}

export function formatCompactMoney(value: number, currency = 'USD', locale: Locale = 'zh-CN') {
  return normalizeCurrencySymbol(new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value), currency);
}

function normalizeCurrencySymbol(value: string, currency: string) {
  return currency.toUpperCase() === 'USD' ? value.replace('US$', '$') : value;
}

export function formatNumber(value: number, digits = 2, locale: Locale = 'zh-CN') {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPrice(instrument: Instrument, value: number) {
  const digits = instrument.pipSize >= 0.01 ? 3 : 5;
  return value.toFixed(digits);
}

export function formatPercent(value: number, digits = 2) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(digits)}%`;
}

export function formatVolumeMillions(value: number, locale: Locale = 'zh-CN') {
  return `${formatNumber(value / 1_000_000, 1, locale)}M`;
}

export function localizeText(text: (Partial<Record<Locale, string>> & Pick<LocalizedText, 'en-US' | 'zh-CN'>) | string, locale: Locale) {
  return typeof text === 'string' ? text : text[locale] ?? text[locale === 'zh-CN' ? 'en-US' : 'zh-CN'];
}

export function directionLabel(direction: Direction, locale: Locale = 'zh-CN') {
  if (locale === 'id-ID') {
    return direction === 'buy' ? 'Beli' : 'Jual';
  }

  if (locale !== 'zh-CN') {
    return direction === 'buy' ? 'Buy' : 'Sell';
  }

  return direction === 'buy' ? '买入' : '卖出';
}

export function orderTypeLabel(type: 'market' | 'limit' | 'stop', locale: Locale = 'zh-CN') {
  if (locale === 'id-ID') {
    if (type === 'market') {
      return 'Market';
    }

    return type === 'limit' ? 'Limit' : 'Stop';
  }

  if (locale !== 'zh-CN') {
    if (type === 'market') {
      return 'Market';
    }

    return type === 'limit' ? 'Limit' : 'Stop';
  }

  if (type === 'market') {
    return '市价';
  }

  return type === 'limit' ? '限价' : '止损';
}

export function statusLabel(status: string, locale: Locale = 'zh-CN') {
  const labels: Record<Locale, Record<string, string>> = {
    'en-US': {
      active: 'Active',
      cancelled: 'Cancelled',
      closed: 'Closed',
      completed: 'Completed',
      dormant: 'Dormant',
      filled: 'Filled',
      funded: 'Funded',
      invited: 'Invited',
      pending: 'Pending',
      rejected: 'Rejected',
      reviewing: 'Reviewing',
      settled: 'Settled',
    },
    'zh-CN': {
      active: '活跃',
      cancelled: '已取消',
      closed: '已平仓',
      completed: '已完成',
      dormant: '沉睡',
      filled: '已成交',
      funded: '已入金',
      invited: '已邀请',
      pending: '待处理',
      rejected: '已拒绝',
      reviewing: '审核中',
      settled: '已结算',
    },
    'id-ID': {
      active: 'Aktif',
      cancelled: 'Dibatalkan',
      closed: 'Ditutup',
      completed: 'Selesai',
      dormant: 'Tidak aktif',
      filled: 'Tereksekusi',
      funded: 'Didanai',
      invited: 'Diundang',
      pending: 'Menunggu',
      rejected: 'Ditolak',
      reviewing: 'Ditinjau',
      settled: 'Diselesaikan',
    },
  };

  return labels[locale][status] ?? status;
}
