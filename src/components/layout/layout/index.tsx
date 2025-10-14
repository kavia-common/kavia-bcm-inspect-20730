import React from "react";
import Box from "@mui/material/Box";
import Dashboard from "@mui/icons-material/Dashboard";
import { useLocation, matchPath, Outlet } from "react-router-dom";
import { HiTemplate } from "react-icons/hi";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { Sider as DefaultSider, SiderProps } from "../sider";
import type { MenuItem } from "../../../interfaces/common";
import { Header as DefaultHeader } from "../header";

interface LayoutProps {
  Sider?: React.ComponentType<SiderProps>;
  Header?: React.ComponentType;
  Footer?: React.ComponentType;
  OffLayoutArea?: React.ComponentType;
  children?: React.ReactNode;
}

const defaultMenuItems: MenuItem[] = [
  {
    name: "template",
    label: "Template",
    icon: <HiTemplate style={{ fontSize: "25px" }} />,
    path: "/template",
  },
  {
    name: "capability",
    label: "Capability",
    icon: <BusinessCenterIcon />,
    path: "/capability",
  },
  {
    name: "inventory",
    label: "Mapping",
    icon: <InboxOutlinedIcon />,
    path: "/inventory",
  },
  {
    name: "data-validation",
    label: "Data Validation",
    icon: <AnalyticsIcon />,
    path: "/data-validation",
  },
  {
    name: "reports",
    label: "Reports",
    icon: <AssessmentIcon />,
    path: "/reports",
  },
  {
    name: "my-profile",
    label: "My Profile",
    icon: <AccountCircleOutlined />,
    path: "/my-profile",
  },
  {
    name: "client-profile",
    label: "Client Profile",
    icon: <BusinessCenterIcon />,
    path: "/client-profile",
  },
];

export const Layout: React.FC<LayoutProps> = ({
  Sider,
  Header,
  Footer,
  OffLayoutArea,
  children,
}) => {
  const SiderToRender = Sider ?? DefaultSider;
  const HeaderToRender = Header ?? DefaultHeader;
  const location = useLocation();

  // Log the current path for debugging
  console.log("Current Pathname:", location.pathname);

  const isSignInPage = !!matchPath("/signin", location.pathname);
  console.log("isSignInPage", isSignInPage);

  const userRole = localStorage.getItem("userRole");
  // Role-based filtering of the menu items
  const filteredMenuItems = defaultMenuItems.filter((item) => {
    if (item.name === "client-profile" && userRole !== "admin") {
      return false; // Hide this menu item if the user is not an admin
    }
    return true;
  });

  return (
    <Box display="flex" flexDirection="row">
      {/* Conditionally render Sider if not on /signin */}
      {!isSignInPage && <SiderToRender items={filteredMenuItems} />}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: "100vh",
        }}
      >
        {/* Conditionally render Header if not on /signin */}
        {/* {!isSignInPage && <HeaderToRender />} */}
        <Box
          component="main"
          sx={{
            p: { xs: 1, md: 2, lg: 3 },
            flexGrow: 1,
            bgcolor: (theme) => theme.palette.background.default,
          }}
        >
          <Outlet /> {/* Replace {children} with <Outlet /> */}
          {children}
        </Box>
        {Footer && <Footer />}
      </Box>
      {OffLayoutArea && <OffLayoutArea />}
    </Box>
  );
};
