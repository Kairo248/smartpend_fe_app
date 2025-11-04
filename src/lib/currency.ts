// Currency utility functions for SpendSmart

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£' },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  SEK: { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  NZD: { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
};

export const DEFAULT_CURRENCY = 'ZAR';

export function getCurrencySymbol(currencyCode: string): string {
  return CURRENCIES[currencyCode]?.symbol || currencyCode;
}

export function getCurrencyName(currencyCode: string): string {
  return CURRENCIES[currencyCode]?.name || currencyCode;
}

export function formatAmount(
  amount: number,
  currencyCode: string = DEFAULT_CURRENCY,
  showSymbol: boolean = true
): string {
  const symbol = getCurrencySymbol(currencyCode);
  const absAmount = Math.abs(amount);
  const formattedAmount = absAmount.toFixed(2);
  const isNegative = amount < 0;
  
  if (!showSymbol) {
    return isNegative ? `-${formattedAmount}` : formattedAmount;
  }

  // For South African Rand, put symbol before amount (R 100.00)
  // For other currencies, follow their convention
  let result: string;
  switch (currencyCode) {
    case 'ZAR':
      result = `R ${formattedAmount}`;
      break;
    case 'USD':
    case 'CAD':
    case 'AUD':
    case 'NZD':
      result = `${symbol}${formattedAmount}`;
      break;
    case 'EUR':
    case 'GBP':
      result = `${symbol}${formattedAmount}`;
      break;
    case 'JPY':
    case 'CNY':
      result = `${symbol}${formattedAmount}`;
      break;
    case 'SEK':
      result = `${formattedAmount} ${symbol}`;
      break;
    case 'CHF':
      result = `${symbol} ${formattedAmount}`;
      break;
    default:
      result = `${symbol} ${formattedAmount}`;
  }
  
  return isNegative ? `-${result}` : result;
}

export function getAllCurrencies(): CurrencyInfo[] {
  return Object.values(CURRENCIES);
}

export function isValidCurrency(currencyCode: string): boolean {
  return currencyCode in CURRENCIES;
}