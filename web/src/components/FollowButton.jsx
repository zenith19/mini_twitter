import { useState } from "react";
import { Button } from "@mui/material";
import client, { errorMessage } from "../api/client";
import { useAuth } from "../auth/AuthContext";

// Replaces the old /follow/:id route, whose component called history.push()
// and window.location.reload() from inside its JSX — a reload loop that fired
// a POST on every pass.
export default function FollowButton({ userId, initiallyFollowing, onChange }) {
  const { user, isSignedIn } = useAuth();
  const [following, setFollowing] = useState(Boolean(initiallyFollowing));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (!isSignedIn || user?.id === userId) return null;

  const toggle = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setBusy(true);
    setError(null);
    try {
      if (following) {
        await client.delete(`/v1/follows/${userId}`);
        setFollowing(false);
      } else {
        await client.post("/v1/follows", { following_user_id: userId });
        setFollowing(true);
      }
      onChange?.();
    } catch (err) {
      setError(errorMessage(err, "Could not update follow."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      onClick={toggle}
      disabled={busy}
      variant={following ? "outlined" : "contained"}
      size="small"
      sx={{ borderRadius: 5, textTransform: "none", minWidth: 96 }}
      title={error ?? undefined}
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}
