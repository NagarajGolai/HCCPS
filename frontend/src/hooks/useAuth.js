import { useMemo, useState } from "react";

import { requestOtp, verifyOtp } from "../api/proptechApi";

export function useAuth() {
  const [authState, setAuthState] = useState({
    user: JSON.parse(localStorage.getItem("propverse_user") || "null"),
    loading: false,
    otpLoading: false,
    devOtp: "",
    error: "",
    message: "",
  });

  const isAuthenticated = useMemo(
    () => Boolean(localStorage.getItem("propverse_access_token")),
    [authState.user]
  );

  const initiateOtp = async ({ email, full_name, purpose }) => {
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
  };

  const completeOtpVerification = async (payload) => {
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
        message: response.detail,
      }));
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error?.response?.data?.detail || "Invalid OTP verification attempt.",
      }));
    }
  };

  const logout = () => {
    localStorage.removeItem("propverse_access_token");
    localStorage.removeItem("propverse_refresh_token");
    localStorage.removeItem("propverse_user");
    setAuthState((prev) => ({
      ...prev,
      user: null,
      devOtp: "",
      message: "Session cleared successfully.",
    }));
  };

  return {
    ...authState,
    isAuthenticated,
    initiateOtp,
    completeOtpVerification,
    logout,
  };
}
