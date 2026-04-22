import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CurrencyProvider } from "./context/CurrencyContext";
import { VendorAuthProvider } from "./context/VendorAuthContext";
import { ToastProvider } from "./components/ui/Toast";
import SearchPage from "./pages/SearchPage";
import VendorLoginPage from "./pages/VendorLoginPage";
import VendorDashboardPage from "./pages/VendorDashboardPage";

export default function App() {
  return (
    <CurrencyProvider>
      <VendorAuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/vendor/login" element={<VendorLoginPage />} />
              <Route path="/vendor/dashboard" element={<VendorDashboardPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </VendorAuthProvider>
    </CurrencyProvider>
  );
}
