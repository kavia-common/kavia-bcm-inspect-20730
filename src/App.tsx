import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import axios from "axios";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SignIn from "pages/SignIn";
import Upload from "pages/Upload";
import Report from "pages/Report";
import Template from "pages/Template";
import { Layout } from "components/layout";
import { AuthProvider } from "contexts/AuthContext";
import ClientProfilePage from "pages/client-profile";
import { AllCapabilities, Home, MyProfile, DataValidation } from "pages";
import { useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import ResetPassword from "pages/ResetPassword";
import SetNewPassword from "pages/SetNewPassword";
import { DEFAULT_CONFIG } from "config/defaultConfig";

const API_BASE_URL = DEFAULT_CONFIG.server.rest.baseURL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const isSignInPage = location.pathname === "/signin";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const theme = createTheme({
    palette: {
      primary: { main: "#0000ff" },
      secondary: { main: "#000000" },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />

          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/set-new-password" element={<SetNewPassword />} />

            {/* Wrap authenticated routes with Layout */}
            <Route element={<Layout />}>
              {/* Protected routes accessible to both admin and user roles */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/template"
                element={
                  <ProtectedRoute>
                    <Template />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/capability"
                element={
                  <ProtectedRoute>
                    <AllCapabilities isEditable={true} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Report />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-profile"
                element={
                  <ProtectedRoute>
                    <MyProfile />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/data-validation"
                element={
                  <ProtectedRoute>
                    <DataValidation />
                  </ProtectedRoute>
                }
              />

              {/* Admin-only route */}
              <Route
                path="/client-profile"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ClientProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default AppWrapper;
