// import React from "react";
// import { useRouterContext, type TitleProps } from "@refinedev/core";
// import Button from "@mui/material/Button";

// import { logo, yariga } from "assets";

// export const Title: React.FC<TitleProps> = ({ collapsed }) => {
//   const { Link } = useRouterContext();

//   return (
//     <Button fullWidth variant="text" disableRipple>
//       <Link to="/">
//         {collapsed ? (
//           <img src="https://digitalt3.com/wp-content/uploads/2025/01/Logo_Calderys_Orange-Noir_2.png" alt="calderys logo" width="28px" />
//         ) : (
//           <img src="https://digitalt3.com/wp-content/uploads/2025/01/Logo_Calderys_Orange-Noir_1.png.webp" alt="calderys" width="140px" />
//         )}
//       </Link>
//     </Button>
//   );
// };

import React from "react";
import { useRouterContext, type TitleProps } from "@refinedev/core";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { Link } = useRouterContext();

  return (
    <Button
      fullWidth
      variant="text"
      disableRipple
      component={Link}
      to="/"
      sx={{
        justifyContent: "center",
        color: "#1e36e8",
        textTransform: "none",
        fontWeight: "bold",
        fontSize: collapsed ? "20px" : "22px",
        letterSpacing: collapsed ? "0px" : "0.5px",
        p: 0,
        "&:hover": { backgroundColor: "transparent" },
      }}
    >
      <Typography
        variant="h6"
        component="span"
        sx={{
          color: "#1e36e8",
          fontWeight: 700,
          fontFamily: "'Poppins', sans-serif",
          fontSize: collapsed ? "24px" : "22px",
          transition: "all 0.2s ease",
        }}
      >
        {collapsed ? "B" : "Biz First"}
      </Typography>
    </Button>
  );
};
