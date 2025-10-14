import React, { useState, useEffect } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Modal,
  Box,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import { CustomButton } from "components";
import { MenuProps } from "interfaces/common";
import { patchEndpoint, deleteEndpoint, fetchCorecapability } from "apis";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

type EditCapabilityProps = {
  open?: boolean;
  onClose?: () => void;
  capabilityName: string;
  label: string;
  onSave?: (name: string) => void;
  color?: string;
  editEndpoint?: string;
  deleteEndpointCall?: string;
  menuStyle?: object;
  useCustomEditDialog?: boolean;
  useCustomDeleteDialog?: boolean;
  onDelete?: () => void;
};

const CustomMenu: React.FC<MenuProps & EditCapabilityProps> = ({
  anchorEl,
  onClose,
  onDelete,
  onOpen,
  onEdit,
  onSave,
  capabilityName,
  label,
  color,
  editEndpoint,
  deleteEndpointCall,
  menuStyle,
  useCustomEditDialog = false,
  useCustomDeleteDialog = false,
}) => {
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [name, setName] = useState<string>(capabilityName ?? "");

  const handleEditOpen = () => {
    if (useCustomEditDialog) {
      onEdit(); // Custom edit behavior
      onClose();
    } else {
      setEditOpen(true);
      onClose();
    }
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleSave = async () => {
    try {
      if (!editEndpoint) {
        console.error("Edit endpoint is missing");
        return;
      }
      const response = await patchEndpoint(editEndpoint, JSON.stringify({ name }));
      console.log("Patch response:", response); // Debug the response
      if (!response.ok) {
        throw new Error(`Failed to edit ${label}: ${response.statusText}`);
      }
      if (onSave) {
        onSave(name);
      }
      console.log(`Saved ${label} name:`, name);
      setEditOpen(false);
      window.location.reload();

    } catch (error) {
      console.error(`Error saving ${label}:`, error);
    }
    
  };

  const confirmDelete = async () => {
    if (!deleteEndpointCall) {
      console.error("Delete endpoint is missing");
      return;
    }

    try {
      const response = await deleteEndpoint(deleteEndpointCall);
      if (!response.ok) {
        throw new Error(`Failed to delete ${label}: ${response.statusText}`);
      }

      // Notify parent component about the deletion
      if (onDelete) onDelete();
      console.log(`Confirmed deletion of ${label}:`, name);
      window.location.reload();

    } catch (error) {
      console.error(`Error deleting ${label}:`, error);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDeleteOpen = () => {
    if (useCustomDeleteDialog) {
      onDelete(); // Custom delete behavior
      onClose();
    } else {
      setIsDeleteDialogOpen(true);
      onClose();
    }
  };

  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
  };

  useEffect(() => {
    setName(capabilityName); // Update name when capabilityName changes
  }, [capabilityName]);

  return (
    <>
      <IconButton
        onClick={onOpen}
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 2,
          ...menuStyle,
        }}
      >
        <MoreVertIcon sx={{ fontSize: 20, color: color }} />
      </IconButton>

      <Menu
        sx={{ opacity: 0.8 }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        <MenuItem onClick={handleEditOpen}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
      </Menu>

      {/* Modal for editing capability */}
      <Modal open={isEditOpen} onClose={handleEditClose}>
        <Box sx={modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Edit {label} Information</Typography>
            <IconButton onClick={handleEditClose} sx={{ color: "black" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Edit {label} name<span style={{ color: "red" }}> *</span>
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 2, fontSize: "12px" }}>
            Include min. 40 characters to make it more interesting
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            color="secondary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              "&:focus": {
                backgroundColor: "blue",
              },
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <CustomButton
              title="Cancel"
              backgroundColor="transparent"
              color="rgba(0, 0, 0, 0.87)"
              handleClick={handleEditClose}
            />
            <CustomButton
              title="Save"
              backgroundColor="#1976d2"
              color="white"
              handleClick={handleSave}
            />
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the {label} "{capabilityName}"? 
            <DialogContentText sx={{ color: "warning.main" }}>
              All items associated with this will be permanently deleted.
            </DialogContentText>
            <DialogContentText sx={{ color: "red" }}>
              This action cannot be undone.
            </DialogContentText>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton
            title="Cancel"
            handleClick={handleDeleteClose}
            backgroundColor="#1976d2"
            color="#fff"
          />
          <CustomButton
            title="Delete"
            handleClick={confirmDelete}
            color="white"
            backgroundColor="red"
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomMenu;


