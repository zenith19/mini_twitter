import { Link as RouterLink } from "react-router-dom";
import { Box, Card, CardActionArea, Chip, Stack, Typography } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import Avatar from "./Avatar";
import { relativeTime } from "../lib/time";

// The feed used to render "Post Id: 3 / Post Name: … / User Id 5" as a
// bulleted list, with no author name and no timestamp.
export default function PostCard({ post }) {
  return (
    <Card variant="outlined" sx={{ mb: 1.5, borderRadius: 2 }}>
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

            <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 0.5 }}>
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
    </Card>
  );
}
