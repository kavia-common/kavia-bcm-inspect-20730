import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MuiList from "@mui/material/List";
import ListOutlined from "@mui/icons-material/ListOutlined";
import Logout from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import MenuRounded from "@mui/icons-material/MenuRounded";
import Dashboard from "@mui/icons-material/Dashboard";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import { HiTemplate } from "react-icons/hi";

import AuthContext from "../../../contexts/AuthContext";
import { MenuItem } from "../../../interfaces/common";
import { Link as RouterLink } from "react-router-dom";

import logoLight from "../../../assets/images/logo-light@2x.png";
import iconLight from "../../../assets/images/Icon-light@2x.png";

export interface SiderProps {
  render?: (props: {
    dashboard: React.ReactNode;
    logout: React.ReactNode;
    items: React.ReactNode;
    collapsed: boolean;
  }) => React.ReactNode;
  items?: MenuItem[];
}

export const Sider: React.FC<SiderProps> = ({ render, items: menuItems }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [opened, setOpened] = useState(false);

  const drawerWidth = collapsed ? 64 : 200;

  const location = useLocation();
  const { logout: authLogout, isAuthenticated, hasRole } =
    useContext(AuthContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  const selectedKey = location.pathname;

  const [open, setOpen] = useState<{ [k: string]: boolean }>({});

  const handleClick = (key: string) => {
    setOpen({ ...open, [key]: !open[key] });
  };

    const renderLogo = (collapsed: boolean) => (
    <Button
      fullWidth
      variant="text"
      disableRipple
      component={RouterLink}
      to="/"
      sx={{
        justifyContent: "center",
        color: "#008C8C",
        textTransform: "none",
        fontWeight: "bold",
        fontSize: collapsed ? "20px" : "22px",
        p: 0,
        "&:hover": { backgroundColor: "transparent" },
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: collapsed ? 0 : 12,
          color: "#008C8C",
          fontWeight: 700,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* Image: icon when collapsed, full logo when expanded */}
        <img
          src={collapsed ? iconLight : logoLight}
          // use srcSet if you have 1x and 2x variants; here we assume the file is 2x, but keeps size consistent
          srcSet={`${collapsed ? iconLight : logoLight} 2x`}
          alt="Biz First"
          style={{
            display: "block",
            width: collapsed ? 36 : 140, // tweak sizes as you like
            height: "auto",
            objectFit: "contain",
          }}
        />
      </span>
    </Button>
  );

  const renderTreeView = (tree: MenuItem[], selectedKey: string) =>
    tree.map((item: MenuItem) => {
      const { icon, label, path: route, children = [] } = item;
      const isOpen = open[route || ""] || false;
      const isSelected = route === selectedKey;

      if (children.length > 0) {
        return (
          <div key={route}>
            <Tooltip
              title={label}
              placement="right"
              disableHoverListener={!collapsed}
              arrow
            >
              <ListItemButton
                onClick={() => {
                  if (collapsed) setCollapsed(false);
                  handleClick(route || "");
                }}
                sx={{
                  pl: 2,
                  justifyContent: "center",
                  "&.Mui-selected": { backgroundColor: "transparent" },
                }}
              >
                <ListItemIcon
                  sx={{ justifyContent: "center", minWidth: 36, color: "#6B7280" }}
                >
                  {icon ?? <ListOutlined />}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    noWrap: true,
                    fontSize: "16px",
                    fontWeight: isSelected ? "bold" : "normal",
                    color: "#1F2937",
                  }}
                />
                {!collapsed && (isOpen ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </Tooltip>
            {!collapsed && (
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <MuiList component="div" disablePadding>
                  {renderTreeView(children, selectedKey)}
                </MuiList>
              </Collapse>
            )}
          </div>
        );
      }

      return (
        <Tooltip
          key={route}
          title={label}
          placement="right"
          disableHoverListener={!collapsed}
          arrow
        >
          <ListItemButton
  component={Link}
  to={route}
  selected={isSelected}
  onClick={() => setOpened(false)}
  sx={{
    pl: 2,
    py: 1,
    margin: "10px auto",
    borderRadius: "12px",
    minHeight: "56px",
    width: "90%",
    transition: "all 0.25s ease",
    "&.Mui-selected": {
      backgroundColor: "#008C8C",
      "& .MuiListItemIcon-root, & .MuiTypography-root": {
        color: "#F9FAFB",
      },
      "&:hover": {
        backgroundColor: "#006666", // darker teal when selected & hovered
        boxShadow: "0 0 6px rgba(0, 102, 102, 0.4)",
      },
    },
    "&:hover": {
      backgroundColor: "rgba(0, 140, 140, 0.15)", // normal hover (unselected)
      transform: "translateX(2px)",
    },
  }}
>
            <ListItemIcon
              sx={{
                justifyContent: "center",
                minWidth: 36,
                color: isSelected ? "#F9FAFB" : "#6B7280",
              }}
            >
              {icon ?? <ListOutlined />}
            </ListItemIcon>
            <ListItemText
              primary={label}
              primaryTypographyProps={{
                noWrap: true,
                fontSize: "16px",
                fontWeight: isSelected ? 600 : "normal",
                color: isSelected ? "#F9FAFB" : "#1F2937",
                marginLeft: "10px",
              }}
            />
          </ListItemButton>
        </Tooltip>
      );
    });

  const dashboard = (
    <Tooltip title="Dashboard" placement="right" disableHoverListener={!collapsed} arrow>
      <ListItemButton
  component={Link}
  to="/"
  selected={selectedKey === "/"}
  sx={{
    pl: 2,
    py: 1,
    margin: "10px auto",
    borderRadius: "12px",
    minHeight: "56px",
    width: "90%",
    justifyContent: "center",
    transition: "all 0.25s ease",
    "&.Mui-selected": {
      backgroundColor: "#008C8C",
      "& .MuiListItemIcon-root, & .MuiTypography-root": {
        color: "#F9FAFB",
      },
      "&:hover": {
        backgroundColor: "#006666", // darker teal when selected & hovered
        boxShadow: "0 0 6px rgba(0, 102, 102, 0.4)",
      },
    },
    "&:hover": {
      backgroundColor: "rgba(0, 140, 140, 0.15)", // normal hover (unselected)
      transform: "translateX(2px)",
    },
  }}
>
        <ListItemIcon sx={{
                justifyContent: "center",
                minWidth: 36,
              }}>
          <Dashboard />
        </ListItemIcon>
        <ListItemText
          primary="Dashboard"
          primaryTypographyProps={{ noWrap: true,
            fontSize: "16px",
            marginLeft: "10px",}}
        />
      </ListItemButton>
    </Tooltip>
  );

  const logoutButton = isAuthenticated && (
    <Tooltip title="Logout" placement="right" disableHoverListener={!collapsed} arrow>
      <ListItemButton
        onClick={() => authLogout()}
        sx={{
          justifyContent: "center",
          margin: "10px auto",
          borderRadius: "12px",
          minHeight: "56px",
          width: "90%",
          "&:hover": { backgroundColor: "rgba(239,68,68,0.08)" },
        }}
      >
        <ListItemIcon sx={{ justifyContent: "center", minWidth: 36, color: "#EF4444" }}>
          <Logout />
        </ListItemIcon>
        <ListItemText
          primary="Logout"
          primaryTypographyProps={{ noWrap: true, fontSize: "16px", color: "#1F2937" }}
        />
      </ListItemButton>
    </Tooltip>
  );

  const defaultMenuItems: MenuItem[] = [
    { name: "template", label: "Template", icon: <HiTemplate style={{ fontSize: 25 }} />, path: "/template" },
    { name: "capability", label: "Capability", icon: <BusinessCenterIcon />, path: "/capability" },
    { name: "inventory", label: "Mapping", icon: <InboxOutlinedIcon />, path: "/inventory" },
    { name: "reports", label: "Reports", icon: <AssessmentIcon />, path: "/reports" },
    { name: "data-validation", label: "Data Validation", icon: <AssessmentIcon />, path: "/data-validation" },
    { name: "my-profile", label: "My Profile", icon: <AccountCircleOutlined />, path: "/my-profile" },
    ...(hasRole("admin")
      ? [{ name: "client-profile", label: "Client Profile", icon: <BusinessCenterIcon />, path: "/client-profile" }]
      : []),
  ];

  const items = renderTreeView(menuItems || defaultMenuItems, selectedKey);

  const renderSider = () =>
    render ? render({ dashboard, logout: logoutButton, items, collapsed }) : <>
      {dashboard}
      {items}
      {logoutButton}
    </>;

  const drawerContent = <MuiList disablePadding sx={{ mt: 1, color: "#6B7280", overflow: "hidden" }}>{renderSider()}</MuiList>;

  return (
    <>
      {/* Empty Box for spacing */}
      <Box sx={{ width: drawerWidth, display: { xs: "none", md: "block" }, transition: "width 0.3s ease" }} />

      {/* Navigation */}
      <Box component="nav" sx={{ position: "fixed", zIndex: 999, width: drawerWidth, display: "flex" }}>
        {/* Temporary drawer for mobile */}
        <Drawer
          variant="temporary"
          open={opened}
          onClose={() => setOpened(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { sm: "block", md: "none" },
            "& .MuiDrawer-paper": { width: 256, bgcolor: "#F9FAFB", borderRight: "1px solid #E5E7EB" },
          }}
        >
          <Box sx={{ height: 64, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #E5E7EB", backgroundColor: "#fff" }}>
            {renderLogo(false)}
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>{drawerContent}</Box>
        </Drawer>

        {/* Permanent drawer for desktop */}
        <Drawer
          variant="permanent"
          PaperProps={{ elevation: 0 }}
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              bgcolor: "#F9FAFB",
              overflow: "hidden",
              transition: "width 0.2s ease",
              borderRight: "1px solid #E5E7EB",
            },
          }}
          open
        >
          <Box sx={{ height: 64, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #E5E7EB", backgroundColor: "#fff" }}>
            {renderLogo(collapsed)}
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              overflowX: "hidden",
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-track": { background: "#F9FAFB" },
              "&::-webkit-scrollbar-thumb": { background: "#D1D5DB", borderRadius: 3, "&:hover": { background: "#9CA3AF" } },
            }}
          >
            {drawerContent}
          </Box>
          <Button
            fullWidth
            size="large"
            onClick={() => setCollapsed((prev) => !prev)}
            sx={{
              background: "#008C8C",
              color: "#F9FAFB",
              borderRadius: 0,
              borderTop: "1px solid #E5E7EB",
              minHeight: 48,
              fontWeight: 600,
              "&:hover": { background: "#007070" },
              transition: "all 0.2s ease",
            }}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </Drawer>

        {/* Mobile menu toggle */}
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            position: "fixed",
            top: 16,
            left: 16,
            borderRadius: "8px",
            bgcolor: "#008C8C",
            zIndex: 1199,
            width: 40,
            height: 40,
          }}
        >
          <IconButton
            sx={{ color: "#F9FAFB", width: "100%", height: "100%", "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" } }}
            onClick={() => setOpened((prev) => !prev)}
          >
            <MenuRounded />
          </IconButton>
        </Box>
      </Box>
    </>
  );
};
