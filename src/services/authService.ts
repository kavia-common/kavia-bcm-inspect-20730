import axios from "axios";
import axiosInstance from "./axiosConfig";
import { DEFAULT_CONFIG } from "../config/defaultConfig";
import { Lollipop } from "lucide-react";

const API_BASE_URL = DEFAULT_CONFIG.server.rest.baseURL;
// const TOKEN_EXPIRY_BUFFER = 30 * 1000; // 5 minutes in milliseconds

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshTokenExpiresIn?: number;
}
const TOKEN_EXPIRY_BUFFER = 30 * 1000;
export const getTokenExpiration = (token: string): number => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log(payload.exp * 1000);
    return payload.exp * 1000;
  } catch {
    return 0;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const expiration = getTokenExpiration(token);
  return Date.now() + TOKEN_EXPIRY_BUFFER >= expiration;
};

const storeTokens = (tokenData: TokenData) => {
  localStorage.setItem("token", tokenData.accessToken);
  localStorage.setItem("refreshToken", tokenData.refreshToken);
  localStorage.setItem(
    "tokenExpiration",
    String(getTokenExpiration(tokenData.accessToken))
  );
  // Store only if refreshTokenExpiresIn is defined, else remove the key
  if (tokenData.refreshTokenExpiresIn !== undefined) {
    localStorage.setItem(
      "refreshTokenExpiresIn",
      String(tokenData.refreshTokenExpiresIn)
    );
  }
};

export const getStoredTokens = () => {
  console.log(localStorage.getItem("token"));
  console.log(localStorage.getItem("refreshToken"));
  console.log(localStorage.getItem("tokenExpiration"));
  return {
    accessToken: localStorage.getItem("token") || "",
    refreshToken: localStorage.getItem("refreshToken") || "",
    expiration: Number(localStorage.getItem("tokenExpiration")),
    refreshTokenExpiresIn: Number(
      localStorage.getItem("refreshTokenExpiresIn")
    ),
  };
};

export const refreshAccessToken = async (): Promise<string> => {
  try {
    const { refreshToken } = getStoredTokens();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(`${API_BASE_URL}auth/refresh-token`, {
      refreshToken,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Token refresh failed");
    }

    const tokenData: TokenData = {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken || refreshToken, // Use new refresh token if provided
      expiresIn: response.data.expiresIn,
    };

    storeTokens(tokenData);
    return tokenData.accessToken;
  } catch (error) {
    console.error("Token refresh error:", error);
    signOut(); // Clear tokens on refresh failure
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}auth/signin`, {
      email,
      password,
    });

    // Handle NEW_PASSWORD_REQUIRED case
    if (response.data?.ChallengeName === "NEW_PASSWORD_REQUIRED") {
      return {
        data: {
          success: false,
          challengeName: "NEW_PASSWORD_REQUIRED",
          Session: response.data?.session,
          message: "New password required",
        },
      };
    }

    if (!response.data.success) {
      throw new Error(response.data.message || "Login failed");
    }

    const tokenData: TokenData = {
      accessToken: response.data.data?.accessToken || "",
      refreshToken: response.data.data?.refreshToken || "",
      expiresIn: response.data.data?.expiresIn || 3600,
      refreshTokenExpiresIn: response.data.data?.refreshTokenExpiresIn,
    };

    storeTokens(tokenData);
    return { data: response?.data, token: tokenData.accessToken };
  } catch (error) {
    console.error("Sign-in error:", error);
    throw error;
  }
};

export const signOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("tokenExpiration");
  localStorage.removeItem("refreshTokenExpiresIn");
  // Clear stored data
  localStorage.removeItem("user");
  localStorage.removeItem("userRole");
  localStorage.removeItem("clientProfileId");
};

export const forgotPassword = async (
  email: string
): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}auth/forgot-password`,
      {
        email,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message ||
          "Failed to process forgot password request"
      );
    }
    throw new Error("Failed to process forgot password request");
  }
};

export const resetPassword = async (
  email: string,
  verificationCode: string,
  newPassword: string
): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}auth/reset-password`,
      {
        email,
        verificationCode,
        newPassword,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Failed to reset password"
      );
    }
    throw new Error("Failed to reset password");
  }
};

export const setNewPassword = async (
  session: string,
  email: string,
  newPassword: string
): Promise<{
  user: any;
  message: string;
  success: boolean;
  data: any;
}> => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}auth/set-new-password`,
      {
        email,
        session,
        newPassword,
      }
    );
    console.log(response.data);
    // const token = response.data.data?.accessToken || "";
    const tokenData: TokenData = {
      accessToken: response.data.data?.accessToken || "",
      refreshToken: response.data.data?.refreshToken || "",
      expiresIn: response.data.data?.expiresIn || 3600,
      refreshTokenExpiresIn: response.data.data?.refreshTokenExpiresIn,
    };

    storeTokens(tokenData);

    let userData = null;
    if (response.data) {
      const getUser = await axiosInstance.get(`${API_BASE_URL}auth/user`);
      console.log(getUser.data);
      userData = getUser.data;
    }
    return {
      ...response.data,
      user: userData?.user,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Failed to reset password"
      );
    }
    throw new Error("Failed to reset password");
  }
};

export const verifyEmail = async (
  email: string
): Promise<{ message: string; success: boolean }> => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}auth/verify-email`,
      {
        email,
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Failed to reset password"
      );
    }
    throw new Error("Failed to reset password");
  }
};
