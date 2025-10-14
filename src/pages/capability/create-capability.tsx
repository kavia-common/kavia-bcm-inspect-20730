import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import CustomButton from "components/common/CustomButton";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { IResourceComponentsProps, useCreate } from "@refinedev/core";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  bgcolor: "background.paper",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  p: 0,
  borderRadius: 3,
  border: "1px solid #E5E7EB",
  overflow: "hidden",
};

type CreateCapabilityProps = {
  open: boolean;
  onClose: () => void;
  capabilityName?: string;
  label: string;
  clickHandler: any;
};

type CombinedProps = IResourceComponentsProps<any, any> & CreateCapabilityProps;

const darkColors = [
  "#1B263B",
  "#0D1B2A",
  "#2C3E50",
  "#4A235A",
  "#1B4F72",
  "#145A32",
  "#78281F",
  "#424242",
  "#303F9F",
  "#00695C",
];

const CreateCapability: React.FC<CombinedProps> = ({
  open = true,
  onClose = () => {},
  capabilityName = "",
  label,
  clickHandler,
}) => {
  const [name, setName] = useState<string>(capabilityName);
  const [selectedColor, setSelectedColor] = useState<string>("#1976d2"); // default

  const { mutate } = useCreate();

  useEffect(() => {
    setName(capabilityName);
  }, [capabilityName]);

  const handleSave = async () => {
    try {
      await clickHandler(
        { name, color: selectedColor },
        () => {
          setName("");
          setSelectedColor("#1976d2");
          onClose();
        }
      );
    } catch (error) {
      console.error("Error creating capability:", error);
      alert("Failed to create capability. Please try again.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #008C8C 0%, #006666 100%)",
            color: "#F9FAFB",
            padding: "24px 32px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(135deg, transparent 0%, rgba(163, 230, 53, 0.15) 100%)",
              pointerEvents: "none",
            },
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 5,
                  height: 32,
                  backgroundColor: "#A3E635",
                  borderRadius: 1,
                  boxShadow: "0 0 20px rgba(163, 230, 53, 0.6)",
                }}
              />
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                  textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                Add New {label}
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
              sx={{
                color: "#F9FAFB",
                backgroundColor: "rgba(249, 250, 251, 0.1)",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "rgba(249, 250, 251, 0.2)",
                  transform: "rotate(90deg)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box
          sx={{
            padding: "32px",
            backgroundColor: "#F9FAFB",
            borderTop: "3px solid #A3E635",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#1F2937",
              marginBottom: 1,
              fontSize: "15px",
              fontWeight: 500,
            }}
          >
            Add new {label} information to expand your capability map
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#6B7280",
              marginBottom: 3,
              fontSize: "13px",
            }}
          >
            Include min. 40 characters to make it more descriptive and meaningful
          </Typography>

          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#1F2937",
                marginBottom: 1,
                fontSize: "14px",
              }}
            >
              {label} Name
              <span style={{ color: "#EF4444", marginLeft: "4px" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={`Enter ${label.toLowerCase()} name`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#E5E7EB",
                    borderWidth: "1.5px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#008C8C",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#008C8C",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#1F2937",
                  fontSize: "14px",
                },
                "&:hover": {
                  backgroundColor: "#FAFBFC",
                },
              }}
            />
          </Box>

          {/* Color Selector */}
          {label.toLowerCase().includes("capability") && (
            <Box mt={3}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#1F2937",
                  marginBottom: 2,
                  fontSize: "14px",
                }}
              >
                Choose Card Color
                <span style={{ color: "#6B7280", marginLeft: "8px", fontWeight: 400, fontSize: "13px" }}>
                  (Dark tones recommended)
                </span>
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.5,
                  padding: 2.5,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 2,
                  border: "1px solid #E5E7EB",
                }}
              >
                {darkColors.map((color) => (
                  <Box
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "8px",
                      backgroundColor: color,
                      cursor: "pointer",
                      border:
                        selectedColor === color
                          ? "3px solid #A3E635"
                          : "2px solid #E5E7EB",
                      boxShadow:
                        selectedColor === color
                          ? "0 0 0 4px rgba(163, 230, 53, 0.15), 0 4px 12px rgba(0, 0, 0, 0.15)"
                          : "0 2px 4px rgba(0, 0, 0, 0.08)",
                      transition: "all 0.2s ease",
                      position: "relative",
                      "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                        zIndex: 1,
                      },
                      "&::after":
                        selectedColor === color
                          ? {
                              content: '"✓"',
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              color: "#FFFFFF",
                              fontSize: "18px",
                              fontWeight: "bold",
                              textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                            }
                          : {},
                    }}
                  />
                ))}
              </Box>
              {selectedColor && (
                <Box
                  sx={{
                    marginTop: 2,
                    padding: 2,
                    backgroundColor: "rgba(0, 140, 140, 0.08)",
                    borderRadius: 2,
                    border: "1px solid rgba(0, 140, 140, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "6px",
                      backgroundColor: selectedColor,
                      border: "2px solid #FFFFFF",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#1F2937",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      Selected Color
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6B7280",
                        fontSize: "12px",
                        fontFamily: "monospace",
                      }}
                    >
                      {selectedColor}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            padding: "20px 32px",
            backgroundColor: "#FFFFFF",
            borderTop: "1px solid #E5E7EB",
          }}
        >
          <CustomButton
            title="Cancel"
            backgroundColor="transparent"
            color="#1F2937"
            handleClick={onClose}
            sx={{
              color: "#1F2937",
              borderColor: "#D1D5DB",
              border: "1.5px solid #D1D5DB",
              padding: "10px 24px",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
              width: "48%",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#1F2937",
                color: "#FFFFFF",
                borderColor: "#1F2937",
                transform: "translateY(-1px)",
              },
            }}
          />
          <CustomButton
            handleClick={handleSave}
            backgroundColor="#008C8C"
            color="white"
            title="Save"
            icon={<SaveIcon />}
            sx={{
              backgroundColor: "#008C8C",
              color: "white",
              padding: "10px 24px",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
              width: "48%",
              boxShadow: "0 2px 8px rgba(0, 140, 140, 0.25)",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#006666",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0, 140, 140, 0.35)",
              },
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateCapability;