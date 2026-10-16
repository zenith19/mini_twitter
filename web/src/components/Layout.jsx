import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box, Container, Drawer, Grid } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  // Below the md breakpoint the sidebar is hidden, so without this drawer
  // there is no way to reach People, Following or Followers on a phone.
  const closeNav = () => setNavOpen(false);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header onMenuClick={() => setNavOpen(true)} />

      <Drawer
        open={navOpen}
        onClose={closeNav}
        // Closing on navigation: the route change is what dismisses it.
        key={location.pathname}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", md: "none" } }}
        PaperProps={{ sx: { width: 240, pt: 1 } }}
      >
        <Box onClick={closeNav}>
          <Sidebar />
        </Box>
      </Drawer>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid item md={3} sx={{ display: { xs: "none", md: "block" } }}>
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
