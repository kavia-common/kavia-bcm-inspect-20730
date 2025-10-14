import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

const GridItem = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    minHeight: "75px",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));

export default GridItem;
