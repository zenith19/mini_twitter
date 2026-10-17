import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Card, CardActionArea, Chip, Stack, Typography } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import Avatar from "./Avatar";
import OwnerMenu from "./OwnerMenu";
import ConfirmDialog from "./ConfirmDialog";
import PostEditDialog from "./PostEditDialog";
import { ErrorMessage } from "./Feedback";
import client, { errorMessage } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { relativeTime } from "../lib/time";

// The feed used to render "Post Id: 3 / Post Name: … / User Id 5" as a
// bulleted list, with no author name and no timestamp.
export default function PostCard({ post, onChanged }) {
  const { user } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const isOwner = user?.id === post.user?.id;

  const destroy = async () => {
    setBusy(true);
    setError(null);
    try {
      await client.delete(`/v1/posts/${post.id}`);
      setConfirming(false);
      onChanged?.();
    } catch (err) {
      setError(errorMessage(err, "Could not delete this post."));
      setConfirming(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 1.5, borderRadius: 2, position: "relative" }}>
      {isOwner && (
        <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
          <OwnerMenu onEdit={() => setEditing(true)} onDelete={() => setConfirming(true)} />
        </Box>
      )}

      <CardActionArea component={RouterLink} to={`/posts/${post.id}`} sx={{ p: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Avatar user={post.user} />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Stack direction="row" spacing={0.75} alignItems="baseline" flexWrap="wrap">
              <Typography variant="subtitle2" fontWeight={700}>
                {post.user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{post.user?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                · {relativeTime(post.created_at)}
              </Typography>
            </Stack>

            <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 0.5, pr: isOwner ? 4 : 0 }}>
              {post.title}
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ whiteSpace: "pre-wrap" }}>
              {post.content}
            </Typography>

            <Chip
              icon={<ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />}
              label={post.comments_count ?? 0}
              size="small"
              variant="outlined"
              sx={{ mt: 1.5, border: "none" }}
            />
          </Box>
        </Stack>
      </CardActionArea>

      {error && <Box sx={{ px: 2, pb: 1 }}><ErrorMessage>{error}</ErrorMessage></Box>}

      <ConfirmDialog
        open={confirming}
        busy={busy}
        title="Delete this post?"
        body="This also removes its replies. This cannot be undone."
        onConfirm={destroy}
        onClose={() => setConfirming(false)}
      />

      {editing && (
        <PostEditDialog
          post={post}
          open={editing}
          onClose={() => setEditing(false)}
          onSaved={() => onChanged?.()}
        />
      )}
    </Card>
  );
}
