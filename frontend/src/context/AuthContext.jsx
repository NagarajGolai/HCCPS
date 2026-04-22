import { createContext, useCallback, useEffect, useState } from "react";
import { requestOtp, verifyOtp } from "../api/proptechApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: JSON.parse(localStorage.getItem("propverse_user") || "null"),
    loading: false,
    otpLoading: false,
    devOtp: "",
    error: "",
    message: "",
    isAuthenticated: Boolean(localStorage.getItem("propverse_access_token")),
  });

  // Sync state on mount and across tabs if needed
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("propverse_access_token");
      const user = JSON.parse(localStorage.getItem("propverse_user") || "null");
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: Boolean(token),
        user: user,
      }));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const initiateOtp = useCallback(async ({ email, full_name, purpose }) => {
    try {
      setAuthState((prev) => ({
        ...prev,
        otpLoading: true,
        error: "",
        message: "",
      }));
      const response = await requestOtp({ email, full_name, purpose });
      setAuthState((prev) => ({
        ...prev,
        otpLoading: false,
        devOtp: response.otp_preview_for_dev,
        message: response.detail,
      }));
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        otpLoading: false,
        error: error?.response?.data?.detail || "Failed to request OTP.",
      }));
    }
  }, []);

  const completeOtpVerification = useCallback(async (payload) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: "", message: "" }));
      const response = await verifyOtp(payload);

      localStorage.setItem("propverse_access_token", response.tokens.access);
      localStorage.setItem("propverse_refresh_token", response.tokens.refresh);
      localStorage.setItem("propverse_user", JSON.stringify(response.user));

      setAuthState((prev) => ({
        ...prev,
        loading: false,
        user: response.user,
        message: response.detail || "Authentication successful",
        isAuthenticated: true,
        error: "",
        devOtp: "",
      }));

      return true;
    } catch (error) {
      const errorMsg =
        error?.response?.data?.detail || "Invalid OTP verification attempt.";
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMsg,
        isAuthenticated: false,
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("propverse_access_token");
    localStorage.removeItem("propverse_refresh_token");
    localStorage.removeItem("propverse_user");
    setAuthState({
      user: null,
      loading: false,
      otpLoading: false,
      devOtp: "",
      message: "Session cleared successfully.",
      isAuthenticated: false,
      error: "",
    });
  }, []);

  const value = {
    ...authState,
    initiateOtp,
    completeOtpVerification,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
