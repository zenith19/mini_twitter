import { Avatar as MuiAvatar } from "@mui/material";

// Deterministic colour per user so avatars stay stable between renders.
const COLORS = ["#1d9bf0", "#7856ff", "#00ba7c", "#f91880", "#ff7a00", "#536471"];

export default function Avatar({ user, size = 40 }) {
  const name = user?.name ?? "?";
  const index = (user?.id ?? 0) % COLORS.length;

  return (
    <MuiAvatar
      sx={{ width: size, height: size, bgcolor: COLORS[index], fontSize: size / 2.5 }}
      aria-hidden="true"
    >
      {name.charAt(0).toUpperCase()}
    </MuiAvatar>
  );
}
