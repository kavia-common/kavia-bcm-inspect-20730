import React, { useState } from "react";
import { Box } from "@mui/material";
import CustomMenu from "components/common/CustomMenu";
import zIndex from "@mui/material/styles/zIndex";

type WrappedComponentProps = {
  name: string;
};

function withMenu<T extends WrappedComponentProps>(
  WrappedComponent: React.ComponentType<T>,
  label: string,
  color: string,
  editEndpoint: string,
  deleteEndpoint: string,
  onSave?: () => void
) {
  return function EnhancedComponent(props: T) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [capabilityName, setCapabilityName] = useState(props.name);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    const handleEdit = (newName: string) => {
      setCapabilityName(newName);
console.log("Capability name edited:", newName);
    };

    const handleDelete = () => {
console.log("Capability deleted:", capabilityName);
      handleMenuClose();
    };

    return (
      <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
      <WrappedComponent {...props} />

      {/* Menu Icon Wrapper: vertically centered */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          right: 8,            // distance from the right edge
          transform: "translateY(-50%)", // vertical center
        }}
      >{/*
        <CustomMenu
          anchorEl={anchorEl}
          onOpen={handleMenuOpen}
          onClose={handleMenuClose}
          onEdit={() => handleEdit(capabilityName)}
          onDelete={() => {
            handleDelete();
            onSave && onSave();
          }}
          capabilityName={capabilityName}
          label={label}
          color={color}
          onSave={(name) => {
            handleEdit(name);
            onSave && onSave();
          }}
          editEndpoint={editEndpoint}
          deleteEndpointCall={deleteEndpoint}
          menuStyle={{ left: "90%", paddingX: 1 }}
        />*/}
      </Box>
    </Box>
    );
  };
}

export default withMenu;
