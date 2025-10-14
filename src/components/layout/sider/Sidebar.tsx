import React, { useState } from "react";
//import type { Sider as DefaultSider } from "@refinedev/mui";

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
import {
  CanAccess,
  type ITreeMenu,
  useIsExistAuthentication,
  useLogout,
  useTitle,
  useTranslate,
  useRouterContext,
  useMenu,
  useRefineContext,
} from "@refinedev/core";

import { Title as DefaultTitle } from "../title";

// Import Lucide React icons
import { 
  LayoutDashboard, 
  BookTemplate, 
  Network, 
  Package, 
  FileText, 
  User 
} from "lucide-react";
import { SvgIcon } from "@mui/material";

// Create wrapper components for Lucide icons to work with Material-UI
const LayoutDashboardIcon = () => <SvgIcon component={LayoutDashboard} />;
const BookTemplateIcon = () => <SvgIcon component={BookTemplate} />;
const NetworkIcon = () => <SvgIcon component={Network} />;
const PackageIcon = () => <SvgIcon component={Package} />;
const FileTextIcon = () => <SvgIcon component={FileText} />;
const UserIcon = () => <SvgIcon component={User} />;

// Custom navigation items - using proper resource names for Refine
const customNavigation = [
  { name: "Dashboard", route: "/", icon: <LayoutDashboardIcon />, resource: "dashboard" },
  { name: "Template", route: "/template", icon: <BookTemplateIcon />, resource: "template" },
  { name: "Capabilities", route: "/capability", icon: <NetworkIcon />, resource: "capability" },
  { name: "Applications", route: "/applications", icon: <PackageIcon />, resource: "applications" },
  { name: "Reports", route: "/reports", icon: <FileTextIcon />, resource: "reports" },
  { name: "Profile", route: "/profile", icon: <UserIcon />, resource: "profile" },
];

type SiderProps = {
  render?: (props: {
    dashboard: React.ReactNode;
    logout: React.ReactNode;
    items: React.ReactNode;
    collapsed: boolean;
  }) => React.ReactNode;
};

export const Sider: React.FC<SiderProps> = ({ render }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [opened, setOpened] = useState(false);

  const drawerWidth = () => {
    if (collapsed) return 64;
    return 240;
  };

  const t = useTranslate();
  const { Link } = useRouterContext();
  const { hasDashboard } = useRefineContext();
  const translate = useTranslate();

  const { menuItems, selectedKey, defaultOpenKeys } = useMenu();
  const isExistAuthentication = useIsExistAuthentication();
  const { mutate: mutateLogout } = useLogout({
    v3LegacyAuthProviderCompatible: true,
  });
  const Title = useTitle();

  const [open, setOpen] = useState<{ [k: string]: any }>({});

  React.useEffect(() => {
    setOpen((previousOpen) => {
      const previousOpenKeys: string[] = Object.keys(previousOpen);
      const uniqueKeys = new Set([...previousOpenKeys, ...defaultOpenKeys]);
      const uniqueKeysRecord = Object.fromEntries(
        Array.from(uniqueKeys.values()).map((key) => [key, true]),
      );
      return uniqueKeysRecord;
    });
  }, [defaultOpenKeys]);

  const RenderToTitle = Title ?? DefaultTitle;

  const handleClick = (key: string) => {
    setOpen({ ...open, [key]: !open[key] });
  };

  const renderTreeView = (tree: ITreeMenu[], selectedKey: string) => {
    return tree.map((item: ITreeMenu) => {
      const { icon, label, route, name, children, parentName } = item;
      const isOpen = open[route || ""] || false;

      const isSelected = route === selectedKey;
      const isNested = !(parentName === undefined);

      if (children.length > 0) {
        return (
          <CanAccess
            key={route}
            resource={name}
            action="list"
            params={{
              resource: item,
            }}
          >
            <div key={route}>
              <Tooltip
                title={label ?? name}
                placement="right"
                disableHoverListener={!collapsed}
                arrow
              >
                <ListItemButton
                  onClick={() => {
                    if (collapsed) {
                      setCollapsed(false);
                      if (!isOpen) {
                        handleClick(route || "");
                      }
                    } else {
                      handleClick(route || "");
                    }
                  }}
                  sx={{
                    pl: isNested ? 4 : 2,
                    justifyContent: "center",
                    "&.Mui-selected": {
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      justifyContent: "center",
                      minWidth: 36,
                      color: "primary.contrastText",
                    }}
                  >
                    {icon ?? <ListOutlined />}
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      noWrap: true,
                      fontSize: "14px",
                      fontWeight: isSelected ? "bold" : "normal",
                    }}
                  />
                  {!collapsed && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </Tooltip>
              {!collapsed && (
                <Collapse in={open[route || ""]} timeout="auto" unmountOnExit>
                  <MuiList component="div" disablePadding>
                    {renderTreeView(children, selectedKey)}
                  </MuiList>
                </Collapse>
              )}
            </div>
          </CanAccess>
        );
      }

      return (
        <CanAccess
          key={route}
          resource={name}
          action="list"
          params={{ resource: item }}
        >
          <Tooltip
            title={label ?? name}
            placement="right"
            disableHoverListener={!collapsed}
            arrow
          >
            <ListItemButton
              component={Link}
              to={route}
              selected={isSelected}
              onClick={() => {
                setOpened(false);
              }}
              sx={{
                pl: isNested ? 4 : 2,
                py: isNested ? 1.25 : 1,
                "&.Mui-selected": {
                  "&:hover": {
                    backgroundColor: isSelected ? "#1e36e8" : "transparent",
                  },
                  backgroundColor: isSelected ? "#475be8" : "transparent",
                },
                justifyContent: "center",
                margin: "6px auto",
                borderRadius: "8px",
                minHeight: "44px",
                width: "90%",
              }}
            >
              <ListItemIcon
                sx={{
                  justifyContent: "center",
                  minWidth: 36,
                  color: isSelected ? "#fff" : "#808191",
                }}
              >
                {icon ?? <ListOutlined />}
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  noWrap: true,
                  fontSize: "14px",
                  fontWeight: isSelected ? "bold" : "normal",
                  color: isSelected ? "#fff" : "#808191",
                  marginLeft: "8px",
                }}
              />
            </ListItemButton>
          </Tooltip>
        </CanAccess>
      );
    });
  };

  // Render custom navigation items - only show if no menuItems from Refine
  const renderCustomNavigation = () => {
    // Don't render custom navigation if we have menu items from Refine
    if (menuItems.length > 0) return null;

    return customNavigation.map((item) => {
      const isSelected = item.route === selectedKey;
      
      return (
        <CanAccess
          key={item.route}
          resource={item.resource}
          action="list"
          params={{ resource: item }}
        >
          <Tooltip
            title={item.name}
            placement="right"
            disableHoverListener={!collapsed}
            arrow
          >
            <ListItemButton
              component={Link}
              to={item.route}
              selected={isSelected}
              onClick={() => {
                setOpened(false);
              }}
              sx={{
                pl: 2,
                py: 1,
                "&.Mui-selected": {
                  "&:hover": {
                    backgroundColor: isSelected ? "#1e36e8" : "transparent",
                  },
                  backgroundColor: isSelected ? "#475be8" : "transparent",
                },
                justifyContent: "center",
                margin: "6px auto",
                borderRadius: "8px",
                minHeight: "44px",
                width: "90%",
              }}
            >
              <ListItemIcon
                sx={{
                  justifyContent: "center",
                  minWidth: 36,
                  color: isSelected ? "#fff" : "#808191",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  noWrap: true,
                  fontSize: "14px",
                  fontWeight: isSelected ? "bold" : "normal",
                  color: isSelected ? "#fff" : "#808191",
                  marginLeft: "8px",
                }}
              />
            </ListItemButton>
          </Tooltip>
        </CanAccess>
      );
    });
  };

  // Only show dashboard if hasDashboard is true AND we're using Refine menu items
  const dashboard = hasDashboard && menuItems.length > 0 ? (
    <CanAccess resource="dashboard" action="list">
      <Tooltip
        title={translate("dashboard.title", "Dashboard")}
        placement="right"
        disableHoverListener={!collapsed}
        arrow
      >
        <ListItemButton
          component={Link}
          to="/"
          selected={selectedKey === "/"}
          onClick={() => {
            setOpened(false);
          }}
          sx={{
            pl: 2,
            py: 1,
            "&.Mui-selected": {
              "&:hover": {
                backgroundColor: selectedKey === "/" ? "#1e36e8" : "transparent",
              },
              backgroundColor: selectedKey === "/" ? "#475be8" : "transparent",
            },
            justifyContent: "center",
            margin: "6px auto",
            borderRadius: "8px",
            minHeight: "44px",
            width: "90%",
          }}
        >
          <ListItemIcon
            sx={{
              justifyContent: "center",
              minWidth: 36,
              color: selectedKey === "/" ? "#fff" : "#808191",
            }}
          >
            <Dashboard />
          </ListItemIcon>
          <ListItemText
            primary={translate("dashboard.title", "Dashboard")}
            primaryTypographyProps={{
              noWrap: true,
              fontSize: "14px",
              fontWeight: selectedKey === "/" ? "bold" : "normal",
              color: selectedKey === "/" ? "#fff" : "#808191",
              marginLeft: "8px",
            }}
          />
        </ListItemButton>
      </Tooltip>
    </CanAccess>
  ) : null;

  const logout = isExistAuthentication && (
    <Tooltip
      title={t("buttons.logout", "Logout")}
      placement="right"
      disableHoverListener={!collapsed}
      arrow
    >
      <ListItemButton
        key="logout"
        onClick={() => mutateLogout()}
        sx={{
          justifyContent: "center",
          margin: "6px auto",
          borderRadius: "8px",
          minHeight: "44px",
          width: "90%",
          mt: 2,
        }}
      >
        <ListItemIcon
          sx={{
            justifyContent: "center",
            minWidth: 36,
            color: "#808191",
          }}
        >
          <Logout />
        </ListItemIcon>
        <ListItemText
          primary={t("buttons.logout", "Logout")}
          primaryTypographyProps={{
            noWrap: true,
            fontSize: "14px",
          }}
        />
      </ListItemButton>
    </Tooltip>
  );

  const items = renderTreeView(menuItems, selectedKey);
  const customItems = renderCustomNavigation();

  const renderSider = () => {
    if (render) {
      return render({
        dashboard,
        logout,
        items,
        collapsed,
      });
    }
    return (
      <>
        {dashboard}
        {customItems}
        {items}
        {logout}
      </>
    );
  };

  const drawer = (
    <MuiList 
      disablePadding 
      sx={{ 
        mt: 1, 
        color: "#808191",
        overflow: "hidden",
      }}
    >
      {renderSider()}
    </MuiList>
  );

  return (
    <>
      <Box
        sx={{
          width: { xs: drawerWidth() },
          display: {
            xs: "none",
            md: "block",
          },
          transition: "width 0.3s ease",
        }}
      />
      <Box
        component="nav"
        sx={{
          position: "fixed",
          zIndex: 1101,
          width: { sm: drawerWidth() },
          display: "flex",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Drawer
          variant="temporary"
          open={opened}
          onClose={() => setOpened(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { sm: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: 256,
              bgcolor: "#FCFCFC",
              overflow: "hidden",
              boxSizing: "border-box",
            },
          }}
        >
          <Box
            sx={{
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              p: 2,
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <RenderToTitle collapsed={false} />
            <Box sx={{ textAlign: "center", mt: 1 }}>
              {/* <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#1a1a1a", margin: 0 }}>
                Bizz First
              </h1> */}
              {/* <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0 0" }}>
                Enterprise Application Management
              </p> */}
            </Box>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              overflowX: "hidden",
              overflowY: "auto",
            }}
          >
            {drawer}
          </Box>
        </Drawer>
        <Drawer
          variant="permanent"
          PaperProps={{ elevation: 0 }}
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              bgcolor: "#FCFCFC",
              overflow: "hidden",
              transition: "width 200ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
              boxSizing: "border-box",
            },
          }}
          open
        >
          <Box
            sx={{
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              p: 2,
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <RenderToTitle collapsed={collapsed} />
            {!collapsed && (
              <Box sx={{ textAlign: "center", mt: 1 }}>
                {/* <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#1a1a1a", margin: 0 }}>
                  Bizz First
                </h1> */}
                {/* <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0 0" }}>
                  Enterprise Application Management
                </p> */}
              </Box>
            )}
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              overflowX: "hidden",
              overflowY: "auto",
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#c1c1c1',
                borderRadius: '2px',
              },
            }}
          >
            {drawer}
          </Box>
          <Button
            sx={{
              background: "#475BE8",
              color: "white",
              textAlign: "center",
              borderRadius: 0,
              borderTop: "1px solid #E5E7EB",
              minHeight: "48px",
              "&:hover": {
                background: "#1e36e8",
              },
            }}
            fullWidth
            size="large"
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </Drawer>
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            position: "fixed",
            top: "16px",
            left: "16px",
            borderRadius: "6px",
            bgcolor: "#475be8",
            zIndex: 1199,
            width: "40px",
            height: "40px",
          }}
        >
          <IconButton
            sx={{ color: "#fff", width: "40px", height: "40px" }}
            onClick={() => setOpened((prev) => !prev)}
          >
            <MenuRounded />
          </IconButton>
        </Box>
      </Box>
    </>
  );
};