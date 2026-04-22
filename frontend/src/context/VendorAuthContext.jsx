import { createContext, useContext, useState, useEffect } from "react";

const VendorAuthContext = createContext(null);

export const VendorAuthProvider = ({ children }) => {
  const [vendor, setVendor] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("vendorToken");
    const stored = localStorage.getItem("vendorInfo");
    if (token && stored) {
      try { setVendor(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setReady(true);
  }, []);

  const login = (vendorInfo, token) => {
    localStorage.setItem("vendorToken", token);
    localStorage.setItem("vendorInfo", JSON.stringify(vendorInfo));
    setVendor(vendorInfo);
  };

  const logout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorInfo");
    setVendor(null);
  };

  return (
    <VendorAuthContext.Provider value={{ vendor, login, logout, ready, isLoggedIn: !!vendor }}>
      {children}
    </VendorAuthContext.Provider>
  );
};

export const useVendorAuth = () => {
  const ctx = useContext(VendorAuthContext);
  if (!ctx) throw new Error("useVendorAuth must be inside VendorAuthProvider");
  return ctx;
};
