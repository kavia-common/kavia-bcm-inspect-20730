// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   TextField,
//   Button,
//   Avatar,
//   Typography,
//   Box,
//   Paper,
//   IconButton,
//   CircularProgress,
// } from "@mui/material";
// import { getProfile, updateProfile } from "../services/userService";
// import { UserProfileFormData, UserProfileResponse } from "../interfaces/user";
// import PhotoCamera from "@mui/icons-material/PhotoCamera";
// import { message } from "antd";

// const MyProfile: React.FC = () => {
//   const [profile, setProfile] = useState<UserProfileFormData>({
//     firstName: "",
//     lastName: "",
//     phone_number: "",
//     email: "",
//     role: "",
//     picture: "",
//     gender: "",
//     clientProfileId: "",
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isFetching, setIsFetching] = useState(true);

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       setIsFetching(true);
//       const data: UserProfileResponse = await getProfile();
//       console.log(data);
//       setProfile(data);
//     } catch (error) {
//       handleError(error, "Failed to fetch profile");
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   const handleError = (error: unknown, defaultMessage: string) => {
//     if (error instanceof Error) {
//       message.error(error.message);
//     } else {
//       message.error(defaultMessage);
//     }
//     console.error(error);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setProfile((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files?.length) return;

//     const file = e.target.files[0];
//     const maxSize = 5 * 1024 * 1024; // 5MB limit

//     if (file.size > maxSize) {
//       message.error("Image size should be less than 5MB");
//       return;
//     }

//     // Create FormData object
//     const formData = new FormData();
//     formData.append("picture", file); // Send file directly
//     formData.append("firstName", profile.firstName);
//     formData.append("lastName", profile.lastName);
//     formData.append("phone_number", profile.phone_number);
//     formData.append("gender", profile.gender);

//     try {
//       setIsLoading(true);
//       const response = await updateProfile(formData);
//       console.log(response);

//       if (response) {
//         setProfile(response);
//         setIsEditing(false);
//         message.success("Profile updated successfully");
//       } else {
//         throw new Error("Failed to update profile");
//       }
//     } catch (error) {
//       handleError(error, "Failed to update profile");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const convertFileToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         if (typeof reader.result === "string") {
//           resolve(reader.result);
//         } else {
//           reject(new Error("Failed to convert image"));
//         }
//       };
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleSave = async () => {
//     try {
//       setIsLoading(true);
//       // Convert profile object to FormData
//       const formData = new FormData();
//       Object.entries(profile).forEach(([key, value]) => {
//         if (value !== undefined && value !== null) {
//           formData.append(key, value);
//         }
//       });
//       const response = await updateProfile(formData);
//       console.log(response);
//       if (response) {
//         setProfile(response);
//         setIsEditing(false);
//         message.success("Profile updated successfully");
//       } else {
//         throw new Error("Failed to update profile");
//       }
//     } catch (error) {
//       handleError(error, "Failed to update profile");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isFetching) {
//     return (
//       <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//         <CircularProgress />
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="md" sx={{ mt: 4 }}>
//       <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
//         <Box
//           sx={{
//             height: 100,
//             background: "linear-gradient(to right, #a1c4fd, #c2e9fb)",
//             borderRadius: "8px 8px 0 0",
//           }}
//         />
//         <Box display="flex" alignItems="center" gap={2} sx={{ p: 3 }}>
//           <Box position="relative" display="inline-block">
//             <Avatar
//               src={profile.picture}
//               sx={{ width: 56, height: 56, mt: 0 }}
//             />
//             {isEditing && (
//               <IconButton
//                 component="label"
//                 sx={{
//                   position: "absolute",
//                   bottom: 0,
//                   right: 0,
//                   background: "white",
//                   color: "primary.main",
//                   boxShadow: 1,
//                   width: 32,
//                   height: 32,
//                   "&:hover": {
//                     backgroundColor: "white",
//                   },
//                 }}
//                 disabled={isLoading}
//               >
//                 <PhotoCamera sx={{ fontSize: 16 }} />
//                 <input
//                   type="file"
//                   hidden
//                   accept="image/*"
//                   onChange={handleAvatarChange}
//                 />
//               </IconButton>
//             )}
//           </Box>
//           <Box flexGrow={1}>
//             <Typography variant="h6">
//               {profile.firstName} {profile.lastName}
//             </Typography>
//             <Typography variant="body2" color="textSecondary">
//               {profile.email}
//             </Typography>
//           </Box>
//           <Box sx={{ display: "flex", gap: 1 }}>
//             {isEditing && (
//               <Button
//                 variant="outlined"
//                 onClick={() => setIsEditing(false)}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </Button>
//             )}
//             <Button
//               variant="contained"
//               onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
//               disabled={isLoading}
//             >
//               {/* ... button content ... */}
//             </Button>
//           </Box>
//         </Box>

//         <Box sx={{ p: 2 }}>
//           <TextField
//             fullWidth
//             margin="normal"
//             label="First Name"
//             name="firstName"
//             value={profile.firstName}
//             onChange={handleChange}
//             disabled={!isEditing || isLoading}
//             InputLabelProps={{
//               shrink: true,
//             }}
//             sx={{
//               "& .MuiInputLabel-root": {
//                 background: "#fff",
//                 padding: "0 4px",
//               },
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": {
//                   borderColor: "rgba(0, 0, 0, 0.23)",
//                 },
//                 "&:hover fieldset": {
//                   borderColor: "rgba(0, 0, 0, 0.23)",
//                 },
//                 "&.Mui-focused fieldset": {
//                   borderColor: "primary.main",
//                 },
//               },
//             }}
//           />
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Last Name"
//             name="lastName"
//             value={profile.lastName}
//             onChange={handleChange}
//             disabled={!isEditing || isLoading}
//             InputLabelProps={{
//               shrink: true,
//             }}
//             sx={{
//               "& .MuiInputLabel-root": {
//                 background: "#fff",
//                 padding: "0 4px",
//               },
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": {
//                   borderColor: "rgba(0, 0, 0, 0.23)",
//                 },
//                 "&:hover fieldset": {
//                   borderColor: "rgba(0, 0, 0, 0.23)",
//                 },
//                 "&.Mui-focused fieldset": {
//                   borderColor: "primary.main",
//                 },
//               },
//             }}
//           />
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Email ID"
//             name="email"
//             value={profile.email}
//             onChange={handleChange}
//             disabled
//             InputLabelProps={{
//               shrink: true,
//             }}
//             sx={{
//               "& .MuiInputLabel-root": {
//                 background: "#fff",
//                 padding: "0 4px",
//               },
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": {
//                   borderColor: "rgba(0, 0, 0, 0.23)",
//                 },
//                 "&:hover fieldset": {
//                   borderColor: "rgba(0, 0, 0, 0.23)",
//                 },
//                 "&.Mui-focused fieldset": {
//                   borderColor: "primary.main",
//                 },
//               },
//             }}
//           />
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Phone No"
//             name="phone_number"
//             value={profile.phone_number}
//             onChange={handleChange}
//             disabled={!isEditing || isLoading}
//             InputLabelProps={{
//               shrink: true,
//             }}
//             sx={{
//               "& .MuiInputLabel-root": {
//                 background: "#fff",
//                 padding: "0 4px",
//               },
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": {
//                   borderColor: "rgba(0, 0, 0, 0.23)",
//                 },
//                 "&:hover fieldset": {
//                   borderColor: "rgba(0, 0, 0, 0.23)",
//                 },
//                 "&.Mui-focused fieldset": {
//                   borderColor: "primary.main",
//                 },
//               },
//             }}
//           />
//           <TextField
//             fullWidth
//             margin="normal"
//             label="Role"
//             name="role"
//             value={profile.role}
//             disabled
//             InputLabelProps={{
//               shrink: true,
//             }}
//             sx={{
//               "& .MuiInputLabel-root": {
//                 background: "#fff",
//                 padding: "0 4px",
//               },
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": {
//                   borderColor: "rgba(0, 0, 0, 0.23)",
//                 },
//                 "&:hover fieldset": {
//                   borderColor: "rgba(0, 0, 0, 0.23)",
//                 },
//                 "&.Mui-focused fieldset": {
//                   borderColor: "primary.main",
//                 },
//               },
//             }}
//           />
//         </Box>
//       </Paper>
//     </Container>
//   );
// };

// export default MyProfile;
import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Avatar,
  Typography,
  Box,
  Paper,
  IconButton,
  CircularProgress,
  Grid,
  Divider,
  Chip,
  Fade,
} from "@mui/material";
import { getProfile, updateProfile } from "../services/userService";
import { UserProfileFormData, UserProfileResponse } from "../interfaces/user";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import { message } from "antd";

const MyProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileFormData>({
    firstName: "",
    lastName: "",
    phone_number: "",
    email: "",
    role: "",
    picture: "",
    gender: "",
    clientProfileId: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsFetching(true);
      const data: UserProfileResponse = await getProfile();
      console.log(data);
      setProfile(data);
    } catch (error) {
      handleError(error, "Failed to fetch profile");
    } finally {
      setIsFetching(false);
    }
  };

  const handleError = (error: unknown, defaultMessage: string) => {
    if (error instanceof Error) {
      message.error(error.message);
    } else {
      message.error(defaultMessage);
    }
    console.error(error);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB limit

    if (file.size > maxSize) {
      message.error("Image size should be less than 5MB");
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("picture", file); // Send file directly
    formData.append("firstName", profile.firstName);
    formData.append("lastName", profile.lastName);
    formData.append("phone_number", profile.phone_number);
    formData.append("gender", profile.gender);

    try {
      setIsLoading(true);
      const response = await updateProfile(formData);
      console.log(response);

      if (response) {
        setProfile(response);
        setIsEditing(false);
        message.success("Profile updated successfully");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      handleError(error, "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert image"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Convert profile object to FormData
      const formData = new FormData();
      Object.entries(profile).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      const response = await updateProfile(formData);
      console.log(response);
      if (response) {
        setProfile(response);
        setIsEditing(false);
        message.success("Profile updated successfully");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      handleError(error, "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Box textAlign="center">
          <CircularProgress size={48} thickness={4} sx={{ color: "#008C8C" }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading your profile...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, bgcolor: "#F9FAFB" }}>
      <Fade in timeout={600}>
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3, 
            overflow: "hidden",
            border: "1px solid #E5E7EB",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}
        >
          {/* Header Cover with Teal Gradient */}
          <Box
            sx={{
              height: 200,
              background: "linear-gradient(135deg, #008C8C 0%, #006666 100%)",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "50%",
                background: "linear-gradient(to top, rgba(0,0,0,0.15), transparent)",
              }
            }}
          >
            {/* Action Buttons */}
            <Box
              sx={{
                position: "absolute",
                top: 20,
                right: 20,
                display: "flex",
                gap: 1.5,
                zIndex: 1,
              }}
            >
              {isEditing && (
                <Button
                  variant="contained"
                  startIcon={<CloseIcon />}
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                  sx={{
                    bgcolor: "rgba(249, 250, 251, 0.95)",
                    color: "#1F2937",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    "&:hover": {
                      bgcolor: "#F9FAFB",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                disabled={isLoading}
                sx={{
                  bgcolor: "#A3E635",
                  color: "#1F2937",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(163, 230, 53, 0.3)",
                  "&:hover": {
                    bgcolor: "#A3E635",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(163, 230, 53, 0.4)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {isLoading ? (
                  <CircularProgress size={20} sx={{ color: "#1F2937" }} />
                ) : isEditing ? (
                  "Save Changes"
                ) : (
                  "Edit Profile"
                )}
              </Button>
            </Box>
          </Box>

          {/* Profile Info Section */}
          <Box sx={{ px: { xs: 3, md: 5 }, pb: 4 }}>
            {/* Avatar and Name */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "center", sm: "flex-end" },
                gap: 3,
                mt: -10,
                mb: 4,
              }}
            >
              <Box position="relative">
                <Avatar
                  src={profile.picture}
                  sx={{
                    width: 160,
                    height: 160,
                    border: "6px solid #F9FAFB",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    bgcolor: "grey.200",
                  }}
                >
                  <PersonIcon sx={{ fontSize: 70, color: "grey.500" }} />
                </Avatar>
                {isEditing && (
                  <IconButton
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      bgcolor: "#008C8C",
                      color: "#F9FAFB",
                      boxShadow: "0 4px 12px rgba(0, 140, 140, 0.4)",
                      width: 48,
                      height: 48,
                      "&:hover": {
                        bgcolor: "#006666",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                    disabled={isLoading}
                  >
                    <PhotoCamera sx={{ fontSize: 24 }} />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </IconButton>
                )}
                {isLoading && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "rgba(249, 250, 251, 0.8)",
                      borderRadius: "50%",
                    }}
                  >
                    <CircularProgress size={40} thickness={4} sx={{ color: "#008C8C" }} />
                  </Box>
                )}
              </Box>

              <Box flex={1} textAlign={{ xs: "center", sm: "left" }} sx={{ mb: { sm: 2 } }}>
                <Typography 
                  variant="h3" 
                  fontWeight="700" 
                  sx={{ 
                    mb: 1.5,
                    fontSize: { xs: "2rem", md: "2.5rem" },
                    color: "#1F2937"
                  }}
                >
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Box 
                  sx={{ 
                    display: "flex", 
                    gap: 1.5, 
                    flexWrap: "wrap", 
                    justifyContent: { xs: "center", sm: "flex-start" },
                    alignItems: "center"
                  }}
                >
                  <Chip
                    icon={<EmailIcon sx={{ fontSize: 18 }} />}
                    label={profile.email}
                    sx={{
                      bgcolor: "#F9FAFB",
                      border: "1px solid #E5E7EB",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      height: 36,
                      color: "#1F2937",
                      "& .MuiChip-icon": {
                        color: "#6B7280"
                      }
                    }}
                  />
                  <Chip
                    icon={<BadgeIcon sx={{ fontSize: 18 }} />}
                    label={profile.role || "User"}
                    sx={{
                      bgcolor: "#008C8C",
                      color: "#F9FAFB",
                      fontWeight: 600,
                      height: 36,
                      fontSize: "0.9rem",
                      "& .MuiChip-icon": {
                        color: "#F9FAFB"
                      }
                    }}
                  />
                  {profile.gender && (
                    <Chip
                      label={profile.gender}
                      sx={{
                        border: "1px solid #A3E635",
                        color: "#1F2937",
                        fontWeight: 500,
                        height: 36,
                        fontSize: "0.9rem",
                        bgcolor: "transparent"
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            <Divider sx={{ mb: 4, borderColor: "#E5E7EB" }} />

            {/* Form Section */}
            <Box>
              <Typography 
                variant="h5" 
                fontWeight="600" 
                gutterBottom 
                sx={{ 
                  mb: 3,
                  color: "#1F2937",
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}
              >
                <PersonIcon sx={{ color: "#008C8C" }} />
                Personal Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    disabled={!isEditing || isLoading}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <PersonIcon sx={{ mr: 1.5, color: "#6B7280", fontSize: 22 }} />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: isEditing ? "#FFFFFF" : "#F9FAFB",
                        "&:hover fieldset": {
                          borderColor: isEditing ? "#008C8C" : "#E5E7EB",
                        },
                        "& fieldset": {
                          borderColor: "#E5E7EB",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#008C8C",
                        }
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#008C8C",
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    disabled={!isEditing || isLoading}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <PersonIcon sx={{ mr: 1.5, color: "#6B7280", fontSize: 22 }} />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: isEditing ? "#FFFFFF" : "#F9FAFB",
                        "&:hover fieldset": {
                          borderColor: isEditing ? "#008C8C" : "#E5E7EB",
                        },
                        "& fieldset": {
                          borderColor: "#E5E7EB",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#008C8C",
                        }
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#008C8C",
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email ID"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <EmailIcon sx={{ mr: 1.5, color: "#6B7280", fontSize: 22 }} />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "#F9FAFB",
                        "& fieldset": {
                          borderColor: "#E5E7EB",
                        }
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone No"
                    name="phone_number"
                    value={profile.phone_number}
                    onChange={handleChange}
                    disabled={!isEditing || isLoading}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <PhoneIcon sx={{ mr: 1.5, color: "#6B7280", fontSize: 22 }} />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: isEditing ? "#FFFFFF" : "#F9FAFB",
                        "&:hover fieldset": {
                          borderColor: isEditing ? "#008C8C" : "#E5E7EB",
                        },
                        "& fieldset": {
                          borderColor: "#E5E7EB",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#008C8C",
                        }
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#008C8C",
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    name="role"
                    value={profile.role}
                    disabled
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <BadgeIcon sx={{ mr: 1.5, color: "#6B7280", fontSize: 22 }} />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "#F9FAFB",
                        "& fieldset": {
                          borderColor: "#E5E7EB",
                        }
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default MyProfile;