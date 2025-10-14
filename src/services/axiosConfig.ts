import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {
  getStoredTokens,
  refreshAccessToken,
  signOut,
  getTokenExpiration,
} from "./authService";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

/**
 * Checks if a token is expired
 */
const TOKEN_EXPIRY_BUFFER = 30 * 1000;
const isTokenExpired = (expiration: number): boolean => {
  const te = Date.now() + TOKEN_EXPIRY_BUFFER;
  console.log(te);
  console.log(expiration);
  console.log(expiration - te);
  console.log(`expiration:`, Date.now() + TOKEN_EXPIRY_BUFFER >= expiration);
  return Date.now() + TOKEN_EXPIRY_BUFFER >= expiration;
};

// Request interceptor - handles token management and refresh
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const tokens = await getStoredTokens();
    console.log(
      `tokens: ${JSON.stringify(tokens.expiration)}`,
      tokens.refreshTokenExpiresIn
    );
    if (!tokens?.accessToken) {
      return config;
    }

    // Check refresh token expiration (5 days)
    // if (
    //   tokens.refreshTokenExpiresIn
    //   &&
    //   isTokenExpired(tokens.refreshTokenExpiresIn)
    // ) {
    //   signOut(); // Redirect to sign-in when refresh token expires
    //   throw new Error("Refresh token expired");
    // }

    // Check access token expiration (1 day)
    if (tokens.expiration && isTokenExpired(tokens.expiration)) {
      try {
        const newToken = await refreshAccessToken();
        if (!newToken) {
          throw new Error("Failed to refresh token");
        }
        config.headers.Authorization = `Bearer ${newToken}`;
        return config;
      } catch (error) {
        signOut();
        throw error;
      }
    }

    // Add token to request
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Simple response interceptor - handles 401 errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      signOut(); // Redirect to sign-in on unauthorized access
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
