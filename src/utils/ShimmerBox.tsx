import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const ShimmerBox = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100px",
  backgroundColor: "#e0e0e0",
  backgroundImage:
    "linear-gradient(to right, #e0e0e0 0%, #bcbcbc 50%, #e0e0e0 100%)",
  backgroundSize: "200px 100%",
  backgroundRepeat: "no-repeat",
  animation: "shimmer 1.2s infinite",
  "@keyframes shimmer": {
    "0%": {
      backgroundPosition: "-200px 0",
    },
    "100%": {
      backgroundPosition: "200px 0",
    },
  },
}));
