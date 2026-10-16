import { Outlet } from "react-router-dom";
import { Box, Container, Grid } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} sx={{ display: { xs: "none", md: "block" } }}>
            <Box sx={{ position: "sticky", top: 88 }}>
              <Sidebar />
            </Box>
          </Grid>
          <Grid item xs={12} md={9} lg={6}>
            <Outlet />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
