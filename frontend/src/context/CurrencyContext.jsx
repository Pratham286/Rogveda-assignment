import { createContext, useContext, useState } from "react";
import { CURRENCIES } from "../utils/currency";

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("USD");

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencies: Object.keys(CURRENCIES) }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be inside CurrencyProvider");
  return ctx;
};
