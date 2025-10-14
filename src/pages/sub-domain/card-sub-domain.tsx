import { Typography } from "@mui/material";

const SubDomainCard = (props: any) => {
  if (props.hideName) return null;

  return (
    <Typography
      sx={{
        textAlign: "left",
        fontSize: "14px",
        fontWeight: 500,
        color: "#1F2937",
        flex: 1,  // Keep this
      }}
    >
      {props.name}
    </Typography>
  );
};

export default SubDomainCard;