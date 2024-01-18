import Card from "@mui/material/Card";
import Wallet from "./Wallet.tsx";
import Box from "@mui/material/Box";

const Nav = () => {
  return (
    <Card
      sx={{
        background: "#000",
        height: "100vh",
      }}
    >
      <Box my={6}>
        <Wallet />
      </Box>
    </Card>
  );
};

export default Nav;
