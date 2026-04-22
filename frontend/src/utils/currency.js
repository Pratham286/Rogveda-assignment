export const CURRENCIES = {
  USD: { code: "USD", symbol: "$",  rate: 1,     label: "USD" },
  INR: { code: "INR", symbol: "₹",  rate: 83,    label: "INR" },
  NGN: { code: "NGN", symbol: "₦",  rate: 1550,  label: "NGN" },
};

export const convertPrice = (usd, currencyCode) => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  return Math.round(usd * currency.rate);
};

export const formatPrice = (usd, currencyCode) => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const value = convertPrice(usd, currencyCode);
  return `${currency.symbol}${value.toLocaleString()}`;
};
