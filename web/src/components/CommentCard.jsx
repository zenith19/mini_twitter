import { Box, Divider, Stack, Typography } from "@mui/material";
import Avatar from "./Avatar";
import { relativeTime } from "../lib/time";

export default function CommentCard({ comment }) {
  return (
    <Box>
      <Stack direction="row" spacing={1.5} sx={{ py: 1.5 }} alignItems="flex-start">
        <Avatar user={comment.user} size={32} />
        <Box sx={{ minWidth: 0 }}>
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
        </Box>
      </Stack>
      <Divider />
    </Box>
  );
}
