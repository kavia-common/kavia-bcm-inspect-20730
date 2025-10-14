import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AuthContext from "../../../contexts/AuthContext";

export const Header: React.FC = () => {
  const { user } = useContext(AuthContext)!;
  const showUserInfo = user && (user.name || user.avatar);

  return (
    <AppBar
      color="default"
      position="sticky"
      elevation={0}
      sx={{ background: "#fcfcfc" }}
    >
      <Toolbar>
        <Stack
          direction="row"
          width="100%"
          justifyContent="flex-end"
          alignItems="center"
        >
          {showUserInfo && (
            <Stack direction="row" gap="16px" alignItems="center">
              {user.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
              {user.name && (
                <Typography variant="subtitle2">{user?.name}</Typography>
              )}
            </Stack>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
