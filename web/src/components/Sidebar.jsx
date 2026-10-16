import { NavLink } from "react-router-dom";
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";
import { useAuth } from "../auth/AuthContext";

function NavItem({ to, icon, label }) {
  return (
    <ListItemButton
      component={NavLink}
      to={to}
      end
      sx={{
        borderRadius: 5,
        mb: 0.5,
        "&.active": { fontWeight: 700, bgcolor: "action.selected" },
      }}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
}

export default function Sidebar() {
  const { isSignedIn, user } = useAuth();

  return (
    <List component="nav" aria-label="Main navigation">
      <NavItem to="/" icon={<HomeIcon />} label="Home" />
      <NavItem to="/users" icon={<PeopleIcon />} label="People" />
      {isSignedIn && (
        <>
          <NavItem to={`/users/${user.id}/followings`} icon={<PersonAddIcon />} label="Following" />
          <NavItem to={`/users/${user.id}/followers`} icon={<GroupIcon />} label="Followers" />
        </>
      )}
    </List>
  );
}
