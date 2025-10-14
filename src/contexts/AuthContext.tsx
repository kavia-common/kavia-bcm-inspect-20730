import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  setNewPassword,
  signIn,
  signOut,
  getStoredTokens,
  isTokenExpired,
  refreshAccessToken,
} from "../services/authService";
import axiosInstance from "services/axiosConfig";
import { DEFAULT_CONFIG } from "../config/defaultConfig";

const API_BASE_URL = DEFAULT_CONFIG.server.rest.baseURL;

type UserRole = "admin" | "user";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  userRole: UserRole | null;
  signIn: (email: string, password: string) => Promise<any>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  hasRole: (role: UserRole) => boolean;
  // hasAnyRole: (roles: UserRole[]) => boolean;
  // hasAllRoles: (roles: UserRole[]) => boolean;
  completeNewPasswordChallenge: (params: {
    session: string;
    email: string;
    newPassword: string;
  }) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [clientProfileId, setClientProfileId] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    signOut();
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    setClientProfileId(null);
    window.location.href = "/signin"; // Redirect to Sign-in
  }, []);
  // const hasRole = (role: UserRole): boolean => userRole === role;

  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return userRole === role;
    },
    [userRole]
  );
  console.log("User Role:", userRole, "Check Role:", hasRole("admin"));
  // const hasAnyRole = useCallback(
  //   (roles: UserRole[]): boolean => {
  //     return roles.some((role) => userRole.includes(role));
  //   },
  //   [userRole]
  // );

  // const hasAllRoles = useCallback(
  //   (roles: UserRole[]): boolean => {
  //     return roles.every((role) => userRole.includes(role));
  //   },
  //   [userRole]
  // );

  const checkAuth = useCallback(async () => {
    try {
      const { accessToken } = getStoredTokens();
      if (!accessToken) {
        setIsAuthenticated(false);
        return false;
      }
      // Make a test request to verify authentication
      await axiosInstance.get(`${API_BASE_URL}auth/health`);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  // useEffect(() => {
  //   const initializeAuth = async () => {
  //     try {
  //       const isAuth = await checkAuth();
  //       setIsAuthenticated(isAuth);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   initializeAuth();
  // }, [checkAuth]);

  // Add this useEffect to check authentication status on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedRole = localStorage.getItem("userRole");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setUserRole(storedRole as UserRole);
          setIsAuthenticated(true);
        }

        const isAuth = await checkAuth();
        console.log(isAuth);
        setIsAuthenticated(isAuth);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, [checkAuth]);

  const handleSignIn = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await signIn(email, password);
      console.log(data);

      // Check for NEW_PASSWORD_REQUIRED challenge
      if (data?.challengeName === "NEW_PASSWORD_REQUIRED") {
        return {
          success: false,
          message: "New password required",
          challengeName: data.challengeName,
          session: data.Session,
        };
      }
      const userData = data.data?.userDetails;
      // console.log(userData);
      const userRole = userData?.UserAttributes?.find(
        (attr: any) => attr.Name === "custom:role"
      )?.Value;
      // console.log(userRole);
      const getuserRole =
        userRole && (userRole === "admin" || userRole === "user")
          ? userRole
          : null;
      // console.log(getuserRole);

      const getclientProfileId = userData?.UserAttributes?.find(
        (attr: any) => attr.Name === "custom:clientProfileId"
      )?.Value;
      setClientProfileId(getclientProfileId);
      setUser(userData);
      setUserRole(getuserRole);
      setIsAuthenticated(true);

      // Persist user data
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userRole", getuserRole || "");
      localStorage.setItem("clientProfileId", getclientProfileId || "");

      return {
        success: true,
        user: data.data?.userDetails,
        roles: userRole,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  if (loading) {
    return null; // or a loading spinner
  }

  const completeNewPasswordChallenge = async ({
    session,
    email,
    newPassword,
  }: {
    session: string;
    email: string;
    newPassword: string;
  }) => {
    try {
      // Implement the API call to complete the new password challenge
      const res = await setNewPassword(session, email, newPassword);

      console.log(res);
      if (res.success) {
        setUser(res?.user);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(res?.user) || "");
        localStorage.setItem("userRole", res?.user?.role || "");
        localStorage.setItem(
          "clientProfileId",
          res?.user?.clientProfileId || ""
        );
      }
      return {
        success: true,
        user: res?.user?.user,
      };
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userRole,
        signIn: handleSignIn,
        logout,
        checkAuth,
        hasRole,
        // hasAnyRole,
        // hasAllRoles,
        completeNewPasswordChallenge,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
