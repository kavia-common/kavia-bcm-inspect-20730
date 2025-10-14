import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Grid,
  Typography,
  Avatar,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Delete, PersonOutline } from "@mui/icons-material";
import { deleteUser, getUsers, inviteUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { clientService } from "../services/clientService";
import { message } from "antd";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { GetUsers } from "interfaces/user";

interface ClientProfile {
  name: string;
  contactEmail: string;
  location: string;
  contactNumber: string;
  companyName: string;
  headOfficeLocation: string;
  clientName: string;
  emailAddress: string;
  picture?: string;
}

interface User {
  Attributes: any;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface InviteUserData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

interface FormErrors {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const ClientProfilePage: React.FC = () => {
  const [clientProfileId, setClientProfileId] = useState(() =>
    localStorage.getItem("clientProfileId")
  );
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (clientProfileId) {
      localStorage.setItem("clientProfileId", clientProfileId);
    }
  }, [clientProfileId]);

  if (!clientProfileId) {
    throw new Error("clientProfileId is missing from localStorage");
  }

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [profile, setProfile] = useState<ClientProfile>({
    name: "",
    contactEmail: "",
    location: "",
    contactNumber: "",
    companyName: "",
    headOfficeLocation: "",
    clientName: "",
    emailAddress: "",
    picture: "",
  });

  const [users, setUsers] = useState<GetUsers[]>([]);
  const [inviteUserData, setInviteUserData] = useState<InviteUserData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "User",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (clientProfileId) fetchClientProfile(clientProfileId);
  }, [clientProfileId]);

  const fetchClientProfile = async (clientProfileId: string) => {
    try {
      setIsLoading(true);
      const [profileData, usersData] = await Promise.all([
        clientService.getClientProfile(clientProfileId),
        getUsers(clientProfileId),
      ]);
      setProfile(profileData);
      setProfilePicture(profileData.picture || "");
      setUsers(usersData);
    } catch (error) {
      message.error("Failed to fetch client profile");
      console.error("Error fetching client profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileEdit = async () => {
    if (isEditing) {
      try {
        setIsLoading(true);
        await clientService.updateClientProfile(clientProfileId, {
          ...profile,
          picture: profilePicture,
        });
        message.success("Profile updated successfully");
        setIsEditing(false);
      } catch (error) {
        message.error("Failed to update profile");
        console.error("Error updating profile:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleProfileChange = (
    e: ChangeEvent<{ name: string; value: string }>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log("=== Avatar Upload Debug Start ===");

    if (!e.target.files?.length) {
      console.log("No files selected, returning early");
      return;
    }

    const file = e.target.files[0];
    console.log("Selected file:", {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    });

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.log("File too large - rejected");
      message.error("Image size should be less than 5MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      message.error(
        "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
      );
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("picture", file);
      formData.append("name", profile.name || "");
      formData.append("contactEmail", profile.contactEmail || "");
      formData.append("location", profile.location || "");
      formData.append("contactNumber", profile.contactNumber || "");

      console.log("FormData created with all profile fields:");
      console.log("- Has picture key:", formData.has("picture"));
      console.log("- Has name key:", formData.has("name"));
      console.log("- Has contactEmail key:", formData.has("contactEmail"));

      const pictureEntry = formData.get("picture");
      console.log("- Picture value:", pictureEntry);

      if (pictureEntry instanceof File) {
        console.log(
          `  File details: name=${pictureEntry.name}, size=${pictureEntry.size}, type=${pictureEntry.type}`
        );
      }

      console.log("Uploading to client profile ID:", clientProfileId);

      const response = await clientService.uploadClientProfilePicture(
        clientProfileId,
        formData
      );

      console.log("Upload response:", response);

      if (response && response.pictureUrl) {
        console.log("Upload successful, new picture URL:", response.pictureUrl);
        setProfilePicture(response.pictureUrl);
        setProfile((prev) => ({ ...prev, picture: response.pictureUrl }));
        message.success("Profile picture updated successfully");
      } else {
        console.log("Upload failed - no pictureUrl in response");
        console.log(
          "Response keys:",
          response ? Object.keys(response) : "null response"
        );
        throw new Error("Upload response missing pictureUrl");
      }
    } catch (error: any) {
      console.error("=== Upload Error Details ===");
      console.error("Error:", error);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request made but no response:", error.request);
      } else {
        console.error("Error message:", error.message);
      }

      let errorMessage = "Failed to upload profile picture";

      if (error.response?.status === 400) {
        errorMessage = "Invalid file format or corrupted file";
      } else if (error.response?.status === 413) {
        errorMessage = "File too large";
      } else if (error.response?.status === 401) {
        errorMessage = "Authentication failed";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      message.error(errorMessage);
    } finally {
      setIsLoading(false);
      console.log("=== Avatar Upload Debug End ===");

      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
    };

    let isValid = true;

    if (!inviteUserData.firstName.trim()) {
      errors.firstName = "First name is required";
      isValid = false;
    }

    if (!inviteUserData.lastName.trim()) {
      errors.lastName = "Last name is required";
      isValid = false;
    }

    if (!inviteUserData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(inviteUserData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!inviteUserData.role) {
      errors.role = "Role is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInviteUserChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInviteUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const inviteNewUser = async () => {
    if (isSubmitting) return;

    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields correctly",
        severity: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const requestBody = {
        ...inviteUserData,
        clientProfileId: clientProfileId ?? "",
        role: "user",
        picture: "underfied",
        gender: "not_specified",
        phone_number: "+919812918200",
      };

      await inviteUser(requestBody);
      const existingUsers = await getUsers(clientProfileId);
      setUsers(existingUsers);

      setSnackbar({
        open: true,
        message: "User invited successfully",
        severity: "success",
      });

      handleDialogClose();
    } catch (error: any) {
      console.error("Error inviting user:", error);
      setSnackbar({
        open: true,
        message: error.message ? error.message : "Failed to invite user",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setInviteUserData({
      firstName: "",
      lastName: "",
      email: "",
      role: "User",
    });
    setFormErrors({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleDeleteUser = async (email: string) => {
    try {
      setIsLoading(true);
      await deleteUser(email);
      setUsers(
        users.filter((user) => {
          const subAttr = user.Attributes.find((attr) => attr.Name === "email");
          return subAttr?.Value !== email;
        })
      );
      setSnackbar({
        open: true,
        message: "User deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete user",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: 3 }}>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box position="relative" display="inline-block">
                <Avatar
                  src={profilePicture}
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "#f4511e",
                    fontSize: "2rem",
                  }}
                >
                  {profile.name?.charAt(0) || "C"}
                </Avatar>
                {isEditing && (
                  <IconButton
                    color="primary"
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      background: "white",
                    }}
                    disabled={isLoading}
                  >
                    <PhotoCamera />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </IconButton>
                )}
                {isLoading && (
                  <CircularProgress
                    size={24}
                    sx={{ position: "absolute", top: 0, left: 0 }}
                  />
                )}
              </Box>
              <Box>
                <Typography variant="h5">{profile.name}</Typography>
                <Typography color="textSecondary">
                  {profile.contactEmail}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              {isEditing && (
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleProfileEdit}
                disabled={isLoading}
              >
                {isEditing ? "Save" : "Edit"}
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Client Name"
                name="clientName"
                value={profile.name}
                onChange={handleProfileChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={profile.location}
                onChange={handleProfileChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="emailAddress"
                value={profile.contactEmail}
                onChange={handleProfileChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contactNumber"
                value={profile.contactNumber}
                onChange={handleProfileChange}
                disabled={!isEditing}
              />
            </Grid>
          </Grid>

          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6">Invite members to join you</Typography>
                <Typography variant="body2" color="textSecondary">
                  Join this free Workspace
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => setIsDialogOpen(true)}
                disabled={isLoading}
              >
                Add new user
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Email Id</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users
                    .filter((user) => {
                      const userAttributes = Object.fromEntries(
                        user.Attributes.map((attr: any) => [
                          attr.Name,
                          attr.Value,
                        ])
                      );
                      return (
                        userAttributes["custom:role"]?.toLowerCase() !== "admin"
                      );
                    })
                    .map((user, index) => {
                      const userAttributes = Object.fromEntries(
                        user.Attributes.map((attr: any) => [
                          attr.Name,
                          attr.Value,
                        ])
                      );

                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <PersonOutline />
                              {userAttributes["given_name"] || "N/A"}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {userAttributes["family_name"] || "N/A"}
                          </TableCell>
                          <TableCell sx={{ color: "#2196f3" }}>
                            {userAttributes["email"] || "N/A"}
                          </TableCell>
                          <TableCell>
                            {userAttributes["custom:role"] || "N/A"}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              aria-label="delete"
                              onClick={() =>
                                handleDeleteUser(userAttributes["email"])
                              }
                              disabled={isLoading}
                              sx={{
                                color: "error.main",
                                "&:hover": {
                                  backgroundColor: "error.light",
                                },
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Invite User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="firstName"
                label="First Name"
                value={inviteUserData.firstName}
                onChange={handleInviteUserChange}
                fullWidth
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="lastName"
                label="Last Name"
                value={inviteUserData.lastName}
                onChange={handleInviteUserChange}
                fullWidth
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email ID"
                type="email"
                value={inviteUserData.email}
                onChange={handleInviteUserChange}
                fullWidth
                error={!!formErrors.email}
                helperText={formErrors.email}
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            color="secondary"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={inviteNewUser}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? "Sending Invite..." : "Send Invite"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientProfilePage;
