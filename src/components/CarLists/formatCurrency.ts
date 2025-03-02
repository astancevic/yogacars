import { useMemo } from 'react';

export function useFormatCurrency(amount: string | number) {
  return useMemo(() => formatCurrency(amount), [amount]);
}

export function formatCurrency(amount: string | number) {
  const value = parseFloat(amount?.toString());

  if (isNaN(value)) {
    return `$0`;
  }

  const num = formatNumber(value);

  return `$${num.substring(0, num.length - 2)}`;
}

export function formatNumber(number: number, decimals: number = 1) {
  let value = number?.toFixed(decimals === 0 ? 1 : decimals).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

  if (decimals === 0) {
    value = value?.substring(0, value.length - 2);
  }

  return value;
}
