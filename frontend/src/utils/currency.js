export const CURRENCIES = {
  USD: { code: "USD", symbol: "$",  rate: 1,     label: "USD", flag: "🇺🇸" },
  INR: { code: "INR", symbol: "₹",  rate: 83,    label: "INR", flag: "🇮🇳" },
  NGN: { code: "NGN", symbol: "₦",  rate: 1550,  label: "NGN", flag: "🇳🇬" },
};

export const convertPrice = (usd, currencyCode) => {
  if (usd == null || isNaN(usd)) return 0;
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  return Math.round(usd * currency.rate);
};

export const formatPrice = (usd, currencyCode) => {
  if (usd == null || isNaN(usd)) return "—";
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const value = convertPrice(usd, currencyCode);
  return `${currency.symbol}${value.toLocaleString("en-US")}`;
};

export const formatPriceCompact = (usd, currencyCode) => {
  if (usd == null || isNaN(usd)) return "—";
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const value = convertPrice(usd, currencyCode);
  if (value >= 1_000_000) return `${currency.symbol}${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000)     return `${currency.symbol}${(value / 1_000).toFixed(1)}K`;
  return `${currency.symbol}${value.toLocaleString("en-US")}`;
};
