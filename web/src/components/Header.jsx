import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AppBar, Box, Button, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "./Avatar";
import { useAuth } from "../auth/AuthContext";

export default function Header({ onMenuClick }) {
  const { user, isSignedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar>
        <IconButton
          onClick={onMenuClick}
          edge="start"
          aria-label="Open navigation"
          sx={{ mr: 1, display: { xs: "inline-flex", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          component={RouterLink}
          to="/"
          variant="h6"
          fontWeight={800}
          sx={{ color: "primary.main", textDecoration: "none" }}
        >
          mini twitter
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {isSignedIn ? (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack
              component={RouterLink}
              to={`/users/${user.id}`}
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ textDecoration: "none", color: "text.primary" }}
            >
              <Avatar user={user} size={32} />
              <Box sx={{ minWidth: 0, maxWidth: { xs: 110, sm: "none" } }}>
                <Typography variant="body2" fontWeight={700} lineHeight={1.1} noWrap>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                  @{user.username}
                </Typography>
              </Box>
            </Stack>
            <Button onClick={handleLogout} size="small" sx={{ textTransform: "none" }}>
              Log out
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to="/login" size="small" sx={{ textTransform: "none" }}>
              Log in
            </Button>
            <Button
              component={RouterLink}
              to="/signup"
              size="small"
              variant="contained"
              sx={{ textTransform: "none", borderRadius: 5 }}
            >
              Sign up
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}
