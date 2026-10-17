import { useState } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import Avatar from "./Avatar";
import OwnerMenu from "./OwnerMenu";
import ConfirmDialog from "./ConfirmDialog";
import { ErrorMessage } from "./Feedback";
import client, { errorMessage } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { relativeTime } from "../lib/time";

export default function CommentCard({ comment, onChanged }) {
  const { user } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const isOwner = user?.id === comment.user?.id;

  const destroy = async () => {
    setBusy(true);
    setError(null);
    try {
      await client.delete(`/v1/comments/${comment.id}`);
      setConfirming(false);
      onChanged?.();
    } catch (err) {
      setError(errorMessage(err, "Could not delete this reply."));
      setConfirming(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" spacing={1.5} sx={{ py: 1.5 }} alignItems="flex-start">
        <Avatar user={comment.user} size={32} />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" spacing={0.75} alignItems="baseline" flexWrap="wrap">
            <Typography variant="subtitle2" fontWeight={700}>
              {comment.user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{comment.user?.username} · {relativeTime(comment.created_at)}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {comment.content}
          </Typography>
          <ErrorMessage>{error}</ErrorMessage>
        </Box>
        {isOwner && (
          <OwnerMenu label="Reply actions" onDelete={() => setConfirming(true)} />
        )}
      </Stack>
      <Divider />

      <ConfirmDialog
        open={confirming}
        busy={busy}
        title="Delete this reply?"
        body="This cannot be undone."
        onConfirm={destroy}
        onClose={() => setConfirming(false)}
      />
    </Box>
  );
}
