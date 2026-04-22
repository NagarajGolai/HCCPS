import { useCallback, useState, useEffect } from "react";

import { requestOtp, verifyOtp } from "../api/proptechApi";

export function useAuth() {
  const [authState, setAuthState] = useState({
    user: JSON.parse(localStorage.getItem("propverse_user") || "null"),
    loading: false,
    otpLoading: false,
    devOtp: "",
    error: "",
    message: "",
    isAuthenticated: Boolean(localStorage.getItem("propverse_access_token")),
  });

  // Ensure isAuthenticated is synced on mount
  useEffect(() => {
    const token = localStorage.getItem("propverse_access_token");
    const user = JSON.parse(localStorage.getItem("propverse_user") || "null");
    setAuthState(prev => ({
      ...prev,
      isAuthenticated: Boolean(token),
      user: user,
    }));
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
      
      // Save tokens and user data to localStorage first
      localStorage.setItem("propverse_access_token", response.tokens.access);
      localStorage.setItem("propverse_refresh_token", response.tokens.refresh);
      localStorage.setItem("propverse_user", JSON.stringify(response.user));
      
      // Update state with authenticated flag - this triggers the useEffect in pages
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        user: response.user,
        message: response.detail || "Authentication successful",
        isAuthenticated: true,
        error: "",
        devOtp: "",
      }));
      
      // Force state update to ensure useEffect catches the change
      return Promise.resolve(true);
    } catch (error) {
      const errorMsg = error?.response?.data?.detail || "Invalid OTP verification attempt.";
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMsg,
        isAuthenticated: false,
      }));
      return Promise.reject(error);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("propverse_access_token");
    localStorage.removeItem("propverse_refresh_token");
    localStorage.removeItem("propverse_user");
    setAuthState((prev) => ({
      ...prev,
      user: null,
      devOtp: "",
      message: "Session cleared successfully.",
      isAuthenticated: false,
      error: "",
    }));
  }, []);

  return {
    user: authState.user,
    loading: authState.loading,
    otpLoading: authState.otpLoading,
    devOtp: authState.devOtp,
    error: authState.error,
    message: authState.message,
    isAuthenticated: authState.isAuthenticated,
    initiateOtp,
    completeOtpVerification,
    logout,
  };
}
