// import React, { useState, useEffect } from "react";
// import {
//   Menu,
//   MenuItem,
//   IconButton,
//   Modal,
//   Box,
//   Typography,
//   TextField,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import CloseIcon from "@mui/icons-material/Close";
// import { CustomButton } from "components";
// import { MenuProps } from "interfaces/common";
// import { patchEndpoint, deleteEndpoint, fetchCorecapability } from "apis";

// const modalStyle = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 500,
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: 2,
// };

// type EditCapabilityProps = {
//   open?: boolean;
//   onClose?: () => void;
//   capabilityName: string;
//   label: string;
//   onSave?: (name: string) => void;
//   color?: string;
//   editEndpoint?: string;
//   deleteEndpointCall?: string;
//   menuStyle?: object;
//   useCustomEditDialog?: boolean;
//   useCustomDeleteDialog?: boolean;
//   onDelete?: () => void;
// };

// const CustomMenu: React.FC<MenuProps & EditCapabilityProps> = ({
//   anchorEl,
//   onClose,
//   onDelete,
//   onOpen,
//   onEdit,
//   onSave,
//   capabilityName,
//   label,
//   color,
//   editEndpoint,
//   deleteEndpointCall,
//   menuStyle,
//   useCustomEditDialog = false,
//   useCustomDeleteDialog = false,
// }) => {
//   const [isEditOpen, setEditOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [name, setName] = useState<string>(capabilityName ?? "");

//   const handleEditOpen = () => {
//     if (useCustomEditDialog) {
//       onEdit(); // Custom edit behavior
//       onClose();
//     } else {
//       setEditOpen(true);
//       onClose();
//     }
//   };

//   const handleEditClose = () => {
//     setEditOpen(false);
//   };

//   const handleSave = async () => {
//     try {
//       if (!editEndpoint) {
//         console.error("Edit endpoint is missing");
//         return;
//       }
//       const response = await patchEndpoint(editEndpoint, JSON.stringify({ name }));
//       console.log("Patch response:", response); // Debug the response
//       if (!response.ok) {
//         throw new Error(`Failed to edit ${label}: ${response.statusText}`);
//       }
//       if (onSave) {
//         onSave(name);
//       }
//       console.log(`Saved ${label} name:`, name);
//       setEditOpen(false);
//       window.location.reload();

//     } catch (error) {
//       console.error(`Error saving ${label}:`, error);
//     }
    
//   };

//   const confirmDelete = async () => {
//     if (!deleteEndpointCall) {
//       console.error("Delete endpoint is missing");
//       return;
//     }

//     try {
//       const response = await deleteEndpoint(deleteEndpointCall);
//       if (!response.ok) {
//         throw new Error(`Failed to delete ${label}: ${response.statusText}`);
//       }

//       // Notify parent component about the deletion
//       if (onDelete) onDelete();
//       console.log(`Confirmed deletion of ${label}:`, name);
//       window.location.reload();

//     } catch (error) {
//       console.error(`Error deleting ${label}:`, error);
//     } finally {
//       setIsDeleteDialogOpen(false);
//     }
//   };

//   const handleDeleteOpen = () => {
//     if (useCustomDeleteDialog) {
//       onDelete(); // Custom delete behavior
//       onClose();
//     } else {
//       setIsDeleteDialogOpen(true);
//       onClose();
//     }
//   };

//   const handleDeleteClose = () => {
//     setIsDeleteDialogOpen(false);
//   };

//   useEffect(() => {
//     setName(capabilityName); // Update name when capabilityName changes
//   }, [capabilityName]);

//   return (
//     <>
//       <IconButton
//         onClick={onOpen}
//         sx={{
//           position: "absolute",
//           top: 0,
//           right: 0,
//           zIndex: 2,
//           ...menuStyle,
//         }}
//       >
//         <MoreVertIcon sx={{ fontSize: 20, color: color }} />
//       </IconButton>

//       <Menu
//         sx={{ opacity: 0.8 }}
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={onClose}
//       >
//         <MenuItem onClick={handleEditOpen}>Edit</MenuItem>
//         <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
//       </Menu>

//       {/* Modal for editing capability */}
//       <Modal open={isEditOpen} onClose={handleEditClose}>
//         <Box sx={modalStyle}>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <Typography variant="h6">Edit {label} Information</Typography>
//             <IconButton onClick={handleEditClose} sx={{ color: "black" }}>
//               <CloseIcon />
//             </IconButton>
//           </Box>
//           <Typography variant="body2" sx={{ mt: 2 }}>
//             Edit {label} name<span style={{ color: "red" }}> *</span>
//           </Typography>
//           <Typography variant="body1" color="textSecondary" sx={{ mb: 2, fontSize: "12px" }}>
//             Include min. 40 characters to make it more interesting
//           </Typography>
//           <TextField
//             fullWidth
//             variant="outlined"
//             color="secondary"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             sx={{
//               "&:focus": {
//                 backgroundColor: "blue",
//               },
//             }}
//           />
//           <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
//             <CustomButton
//               title="Cancel"
//               backgroundColor="transparent"
//               color="rgba(0, 0, 0, 0.87)"
//               handleClick={handleEditClose}
//             />
//             <CustomButton
//               title="Save"
//               backgroundColor="#1976d2"
//               color="white"
//               handleClick={handleSave}
//             />
//           </Box>
//         </Box>
//       </Modal>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={isDeleteDialogOpen}
//         onClose={handleDeleteClose}
//         aria-labelledby="delete-dialog-title"
//         aria-describedby="delete-dialog-description"
//       >
//         <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="delete-dialog-description">
//             Are you sure you want to delete the {label} "{capabilityName}"? 
//             <DialogContentText sx={{ color: "warning.main" }}>
//               All items associated with this will be permanently deleted.
//             </DialogContentText>
//             <DialogContentText sx={{ color: "red" }}>
//               This action cannot be undone.
//             </DialogContentText>
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <CustomButton
//             title="Cancel"
//             handleClick={handleDeleteClose}
//             backgroundColor="#1976d2"
//             color="#fff"
//           />
//           <CustomButton
//             title="Delete"
//             handleClick={confirmDelete}
//             color="white"
//             backgroundColor="red"
//           />
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default CustomMenu;


// import React, { useState, useEffect } from "react";
// import {
//   Menu,
//   MenuItem,
//   IconButton,
//   Modal,
//   Box,
//   Typography,
//   TextField,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import CloseIcon from "@mui/icons-material/Close";
// import { CustomButton } from "components";
// import { MenuProps } from "interfaces/common";
// import { patchEndpoint, deleteEndpoint, fetchCorecapability } from "apis";

// const modalStyle = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 500,
//   bgcolor: "#F9FAFB",
//   boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
//   p: 4,
//   borderRadius: 3,
//   border: "1px solid #E5E7EB",
// };

// type EditCapabilityProps = {
//   open?: boolean;
//   onClose?: () => void;
//   capabilityName: string;
//   label: string;
//   onSave?: (name: string) => void;
//   color?: string;
//   editEndpoint?: string;
//   deleteEndpointCall?: string;
//   menuStyle?: object;
//   useCustomEditDialog?: boolean;
//   useCustomDeleteDialog?: boolean;
//   onDelete?: () => void;
// };

// const CustomMenu: React.FC<MenuProps & EditCapabilityProps> = ({
//   anchorEl,
//   onClose,
//   onDelete,
//   onOpen,
//   onEdit,
//   onSave,
//   capabilityName,
//   label,
//   color,
//   editEndpoint,
//   deleteEndpointCall,
//   menuStyle,
//   useCustomEditDialog = false,
//   useCustomDeleteDialog = false,
// }) => {
//   const [isEditOpen, setEditOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [name, setName] = useState<string>(capabilityName ?? "");

//   const handleEditOpen = () => {
//     if (useCustomEditDialog) {
//       onEdit(); // Custom edit behavior
//       onClose();
//     } else {
//       setEditOpen(true);
//       onClose();
//     }
//   };

//   const handleEditClose = () => {
//     setEditOpen(false);
//   };

//   const handleSave = async () => {
//     try {
//       if (!editEndpoint) {
//         console.error("Edit endpoint is missing");
//         return;
//       }
//       const response = await patchEndpoint(editEndpoint, JSON.stringify({ name }));
//       console.log("Patch response:", response); // Debug the response
//       if (!response.ok) {
//         throw new Error(`Failed to edit ${label}: ${response.statusText}`);
//       }
//       if (onSave) {
//         onSave(name);
//       }
//       console.log(`Saved ${label} name:`, name);
//       setEditOpen(false);
//       window.location.reload();

//     } catch (error) {
//       console.error(`Error saving ${label}:`, error);
//     }
    
//   };

//   const confirmDelete = async () => {
//     if (!deleteEndpointCall) {
//       console.error("Delete endpoint is missing");
//       return;
//     }

//     try {
//       const response = await deleteEndpoint(deleteEndpointCall);
//       if (!response.ok) {
//         throw new Error(`Failed to delete ${label}: ${response.statusText}`);
//       }

//       // Notify parent component about the deletion
//       if (onDelete) onDelete();
//       console.log(`Confirmed deletion of ${label}:`, name);
//       window.location.reload();

//     } catch (error) {
//       console.error(`Error deleting ${label}:`, error);
//     } finally {
//       setIsDeleteDialogOpen(false);
//     }
//   };

//   const handleDeleteOpen = () => {
//     if (useCustomDeleteDialog) {
//       onDelete(); // Custom delete behavior
//       onClose();
//     } else {
//       setIsDeleteDialogOpen(true);
//       onClose();
//     }
//   };

//   const handleDeleteClose = () => {
//     setIsDeleteDialogOpen(false);
//   };

//   useEffect(() => {
//     setName(capabilityName); // Update name when capabilityName changes
//   }, [capabilityName]);

//   return (
//     <>
//       <IconButton
//         onClick={onOpen}
//         sx={{
//           position: "absolute",
//           top: 0,
//           right: 0,
//           zIndex: 2,
//           transition: "all 0.2s ease",
//           "&:hover": {
//             backgroundColor: "rgba(0, 140, 140, 0.08)",
//           },
//           ...menuStyle,
//         }}
//       >
//         <MoreVertIcon sx={{ fontSize: 20, color: color || "#6B7280" }} />
//       </IconButton>

//       <Menu
//         sx={{ 
//           "& .MuiPaper-root": {
//             borderRadius: 2,
//             boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
//             border: "1px solid #E5E7EB",
//           }
//         }}
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={onClose}
//       >
//         <MenuItem 
//           onClick={handleEditOpen}
//           sx={{
//             color: "#1F2937",
//             fontSize: "0.9375rem",
//             "&:hover": {
//               backgroundColor: "rgba(0, 140, 140, 0.08)",
//               color: "#008C8C",
//             },
//           }}
//         >
//           Edit
//         </MenuItem>
//         <MenuItem 
//           onClick={handleDeleteOpen}
//           sx={{
//             color: "#1F2937",
//             fontSize: "0.9375rem",
//             "&:hover": {
//               backgroundColor: "rgba(239, 68, 68, 0.08)",
//               color: "#EF4444",
//             },
//           }}
//         >
//           Delete
//         </MenuItem>
//       </Menu>

//       {/* Modal for editing capability */}
//       <Modal open={isEditOpen} onClose={handleEditClose}>
//         <Box sx={modalStyle}>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <Typography 
//               variant="h6"
//               sx={{
//                 color: "#1F2937",
//                 fontWeight: 700,
//                 fontSize: "1.25rem",
//               }}
//             >
//               Edit {label} Information
//             </Typography>
//             <IconButton 
//               onClick={handleEditClose} 
//               sx={{ 
//                 color: "#6B7280",
//                 "&:hover": {
//                   backgroundColor: "rgba(0, 140, 140, 0.08)",
//                   color: "#008C8C",
//                 },
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </Box>
//           <Typography 
//             variant="body2" 
//             sx={{ 
//               mt: 3,
//               color: "#1F2937",
//               fontWeight: 600,
//               fontSize: "0.875rem",
//             }}
//           >
//             Edit {label} name<span style={{ color: "#EF4444" }}> *</span>
//           </Typography>
//           <Typography 
//             variant="body1" 
//             sx={{ 
//               mb: 2, 
//               fontSize: "0.75rem",
//               color: "#6B7280",
//               mt: 0.5,
//             }}
//           >
//             Include min. 40 characters to make it more interesting
//           </Typography>
//           <TextField
//             fullWidth
//             variant="outlined"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             sx={{
//               "& .MuiOutlinedInput-root": {
//                 backgroundColor: "#FFFFFF",
//                 borderRadius: "10px",
//                 "& fieldset": {
//                   borderColor: "#E5E7EB",
//                   borderWidth: "2px",
//                 },
//                 "&:hover fieldset": {
//                   borderColor: "#008C8C",
//                 },
//                 "&.Mui-focused fieldset": {
//                   borderColor: "#008C8C",
//                   borderWidth: "2px",
//                 },
//               },
//               "& .MuiInputBase-input": {
//                 color: "#1F2937",
//                 fontSize: "0.9375rem",
//               },
//             }}
//           />
//           <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
//             <CustomButton
//               title="Cancel"
//               backgroundColor="transparent"
//               color="#1F2937"
//               handleClick={handleEditClose}
//               sx={{
//                 border: "2px solid #E5E7EB",
//                 borderRadius: "10px",
//                 fontWeight: 600,
//                 "&:hover": {
//                   backgroundColor: "rgba(0, 0, 0, 0.04)",
//                   borderColor: "#008C8C",
//                   color: "#008C8C",
//                 },
//               }}
//             />
//             <CustomButton
//               title="Save"
//               backgroundColor="#008C8C"
//               color="#F9FAFB"
//               handleClick={handleSave}
//               sx={{
//                 borderRadius: "10px",
//                 fontWeight: 600,
//                 boxShadow: "0 2px 8px rgba(0, 140, 140, 0.3)",
//                 "&:hover": {
//                   backgroundColor: "#007070",
//                   boxShadow: "0 4px 12px rgba(0, 140, 140, 0.4)",
//                 },
//               }}
//             />
//           </Box>
//         </Box>
//       </Modal>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={isDeleteDialogOpen}
//         onClose={handleDeleteClose}
//         aria-labelledby="delete-dialog-title"
//         aria-describedby="delete-dialog-description"
//         PaperProps={{
//           sx: {
//             borderRadius: 3,
//             boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
//             border: "1px solid #E5E7EB",
//             backgroundColor: "#F9FAFB",
//           }
//         }}
//       >
//         <DialogTitle 
//           id="delete-dialog-title"
//           sx={{
//             color: "#1F2937",
//             fontWeight: 700,
//             fontSize: "1.25rem",
//             borderBottom: "1px solid #E5E7EB",
//             pb: 2,
//           }}
//         >
//           Confirm Deletion
//         </DialogTitle>
//         <DialogContent sx={{ pt: 3 }}>
//           <DialogContentText 
//             id="delete-dialog-description"
//             sx={{
//               color: "#1F2937",
//               fontSize: "0.9375rem",
//               mb: 2,
//             }}
//           >
//             Are you sure you want to delete the {label} "{capabilityName}"?
//           </DialogContentText>
//           <DialogContentText 
//             sx={{ 
//               color: "#F59E0B",
//               fontSize: "0.875rem",
//               fontWeight: 500,
//               mb: 1,
//             }}
//           >
//             All items associated with this will be permanently deleted.
//           </DialogContentText>
//           <DialogContentText 
//             sx={{ 
//               color: "#EF4444",
//               fontSize: "0.875rem",
//               fontWeight: 600,
//             }}
//           >
//             This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions sx={{ p: 3, pt: 2, borderTop: "1px solid #E5E7EB" }}>
//           <CustomButton
//             title="Cancel"
//             handleClick={handleDeleteClose}
//             backgroundColor="transparent"
//             color="#1F2937"
//             sx={{
//               border: "2px solid #E5E7EB",
//               borderRadius: "10px",
//               fontWeight: 600,
//               px: 3,
//               "&:hover": {
//                 backgroundColor: "rgba(0, 0, 0, 0.04)",
//                 borderColor: "#008C8C",
//                 color: "#008C8C",
//               },
//             }}
//           />
//           <CustomButton
//             title="Delete"
//             handleClick={confirmDelete}
//             color="#FFFFFF"
//             backgroundColor="#EF4444"
//             sx={{
//               borderRadius: "10px",
//               fontWeight: 600,
//               px: 3,
//               boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
//               "&:hover": {
//                 backgroundColor: "#DC2626",
//                 boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
//               },
//             }}
//           />
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default CustomMenu;

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
  bgcolor: "#F9FAFB",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  p: 4,
  borderRadius: 3,
  border: "1px solid #E5E7EB",
};

const darkColors = [
  "#1B263B", "#0D1B2A", "#2C3E50", "#4A235A",
  "#1B4F72", "#145A32", "#78281F", "#424242",
  "#303F9F", "#00695C"
];

type EditCapabilityProps = {
  open?: boolean;
  onClose?: () => void;
  capabilityName: string;
  label: string;
  onSave?: (name: string, color?: string) => void;
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
  const [selectedColor, setSelectedColor] = useState<string>(color ?? "#008C8C");

  const handleEditOpen = () => {
    if (useCustomEditDialog) {
      onEdit(); // Custom edit behavior
      onClose();
    } else {
      setEditOpen(true);
      onClose();
    }
  };

  const handleEditClose = () => setEditOpen(false);

  const handleSave = async () => {
    try {
      if (!editEndpoint) {
        console.error("Edit endpoint is missing");
        return;
      }

      // Only add color if Business Capability
      const payload =
        label === "Business Capability"
          ? { name, color: selectedColor }
          : { name };

      const response = await patchEndpoint(editEndpoint, JSON.stringify(payload));
      console.log("Patch response:", response); // Debug

      if (!response.ok) {
        throw new Error(`Failed to edit ${label}: ${response.statusText}`);
      }

      if (onSave) {
        onSave(name, label === "Business Capability" ? selectedColor : undefined);
      }

      setEditOpen(false);
      window.location.reload(); // Auto-refresh after save
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
      if (onDelete) onDelete();
      setIsDeleteDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(`Error deleting ${label}:`, error);
    }
  };

  const handleDeleteOpen = () => {
    if (useCustomDeleteDialog) {
      onDelete();
      onClose();
    } else {
      setIsDeleteDialogOpen(true);
      onClose();
    }
  };

  const handleDeleteClose = () => setIsDeleteDialogOpen(false);

  useEffect(() => {
    setName(capabilityName);
    setSelectedColor(color ?? "#008C8C");
  }, [capabilityName, color]);

  return (
    <>
      <IconButton
        onClick={onOpen}
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 2,
          transition: "all 0.2s ease",
          "&:hover": { backgroundColor: "rgba(0, 140, 140, 0.08)" },
          ...menuStyle,
        }}
      >
        <MoreVertIcon sx={{ fontSize: 20, color: color || "#6B7280" }} />
      </IconButton>

      <Menu
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 2,
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            border: "1px solid #E5E7EB",
          },
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        <MenuItem
          onClick={handleEditOpen}
          sx={{
            color: "#1F2937",
            fontSize: "0.9375rem",
            "&:hover": { backgroundColor: "rgba(0, 140, 140, 0.08)", color: "#008C8C" },
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={handleDeleteOpen}
          sx={{
            color: "#1F2937",
            fontSize: "0.9375rem",
            "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.08)", color: "#EF4444" },
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      {/* Modal for editing capability */}
      <Modal open={isEditOpen} onClose={handleEditClose}>
        <Box sx={modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ color: "#1F2937", fontWeight: 700, fontSize: "1.25rem" }}>
              Edit {label} Information
            </Typography>
            <IconButton
              onClick={handleEditClose}
              sx={{ color: "#6B7280", "&:hover": { backgroundColor: "rgba(0,140,140,0.08)", color: "#008C8C" } }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, color: "#1F2937", fontWeight: 600, fontSize: "0.875rem" }}>
            Edit {label} name<span style={{ color: "#EF4444" }}> *</span>
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, fontSize: "0.75rem", color: "#6B7280", mt: 0.5 }}>
            Include min. 40 characters to make it more interesting
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                "& fieldset": { borderColor: "#E5E7EB", borderWidth: "2px" },
                "&:hover fieldset": { borderColor: "#008C8C" },
                "&.Mui-focused fieldset": { borderColor: "#008C8C", borderWidth: "2px" },
              },
              "& .MuiInputBase-input": { color: "#1F2937", fontSize: "0.9375rem" },
            }}
          />

          {/* Color picker ONLY for Business Capability */}
          {label === "Business Capability" && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937", mb: 2, fontSize: "14px" }}>
                Choose Card Color <span style={{ color: "#6B7280", fontWeight: 400, fontSize: "13px" }}>(Dark tones recommended)</span>
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, padding: 2.5, backgroundColor: "#FFFFFF", borderRadius: 2, border: "1px solid #E5E7EB" }}>
                {darkColors.map((c) => (
                  <Box
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "8px",
                      backgroundColor: c,
                      cursor: "pointer",
                      border: selectedColor === c ? "3px solid #A3E635" : "2px solid #E5E7EB",
                      boxShadow: selectedColor === c ? "0 0 0 4px rgba(163,230,53,0.15), 0 4px 12px rgba(0,0,0,0.15)" : "0 2px 4px rgba(0,0,0,0.08)",
                      transition: "all 0.2s ease",
                      position: "relative",
                      "&:hover": { transform: "scale(1.06)", boxShadow: "0 6px 18px rgba(0,0,0,0.18)", zIndex: 1 },
                      "&::after": selectedColor === c ? { content: '"✓"', position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#FFFFFF", fontSize: "18px", fontWeight: "bold", textShadow: "0 1px 3px rgba(0,0,0,0.3)" } : {},
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <CustomButton
              title="Cancel"
              backgroundColor="transparent"
              color="#1F2937"
              handleClick={handleEditClose}
              sx={{
                border: "2px solid #E5E7EB",
                borderRadius: "10px",
                fontWeight: 600,
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)", borderColor: "#008C8C", color: "#008C8C" },
              }}
            />
            <CustomButton
              title="Save"
              backgroundColor="#008C8C"
              color="#F9FAFB"
              handleClick={handleSave}
              sx={{
                borderRadius: "10px",
                fontWeight: 600,
                boxShadow: "0 2px 8px rgba(0, 140, 140, 0.3)",
                "&:hover": { backgroundColor: "#007070", boxShadow: "0 4px 12px rgba(0,140,140,0.4)" },
              }}
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
        PaperProps={{ sx: { borderRadius: 3, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" } }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ color: "#1F2937", fontWeight: 700, fontSize: "1.25rem", borderBottom: "1px solid #E5E7EB", pb: 2 }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText id="delete-dialog-description" sx={{ color: "#1F2937", fontSize: "0.9375rem", mb: 2 }}>
            Are you sure you want to delete the {label} "{capabilityName}"?
          </DialogContentText>
          <DialogContentText sx={{ color: "#F59E0B", fontSize: "0.875rem", fontWeight: 500, mb: 1 }}>
            All items associated with this will be permanently deleted.
          </DialogContentText>
          <DialogContentText sx={{ color: "#EF4444", fontSize: "0.875rem", fontWeight: 600 }}>
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, borderTop: "1px solid #E5E7EB" }}>
          <CustomButton
            title="Cancel"
            handleClick={handleDeleteClose}
            backgroundColor="transparent"
            color="#1F2937"
            sx={{ border: "2px solid #E5E7EB", borderRadius: "10px", fontWeight: 600, px: 3, "&:hover": { backgroundColor: "rgba(0,0,0,0.04)", borderColor: "#008C8C", color: "#008C8C" } }}
          />
          <CustomButton
            title="Delete"
            handleClick={confirmDelete}
            color="#FFFFFF"
            backgroundColor="#EF4444"
            sx={{ borderRadius: "10px", fontWeight: 600, px: 3, boxShadow: "0 2px 8px rgba(239,68,68,0.3)", "&:hover": { backgroundColor: "#DC2626", boxShadow: "0 4px 12px rgba(239,68,68,0.4)" } }}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomMenu;
