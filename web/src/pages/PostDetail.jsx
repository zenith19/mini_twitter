import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Card, Paper, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import useFetch from "../api/useFetch";
import client, { errorMessage } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import Avatar from "../components/Avatar";
import CommentCard from "../components/CommentCard";
import { Empty, ErrorMessage, Loading } from "../components/Feedback";
import { relativeTime } from "../lib/time";

function CommentComposer({ postId, onCreated }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [formError, setFormError] = useState(null);

  const onSubmit = async (values) => {
    setFormError(null);
    try {
      await client.post("/v1/comments", {
        comment: { content: values.content, post_id: postId },
      });
      reset();
      onCreated();
    } catch (error) {
      setFormError(errorMessage(error, "Could not post your comment."));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <ErrorMessage>{formError}</ErrorMessage>
      <Stack spacing={1.5}>
        <TextField
          placeholder="Write a reply…"
          multiline
          minRows={2}
          error={Boolean(errors.content)}
          helperText={errors.content?.message}
          {...register("content", { required: "Write something first" })}
        />
        <Box sx={{ textAlign: "right" }}>
          <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ borderRadius: 5 }}>
            {isSubmitting ? "Replying…" : "Reply"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default function PostDetail() {
  const { postId } = useParams();
  const { isSignedIn } = useAuth();
  const post = useFetch(`/v1/posts/${postId}`);
  const comments = useFetch(`/v1/posts/${postId}/comments`);

  if (post.loading) return <Loading />;
  if (post.error) return <ErrorMessage>{post.error}</ErrorMessage>;

  const item = post.data?.post;
  if (!item) return <Empty>This post does not exist.</Empty>;

  return (
    <Box>
      <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Stack direction="row" spacing={1.5}>
          <Avatar user={item.user} />
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>
              {item.user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{item.user?.username} · {relativeTime(item.created_at)}
            </Typography>
          </Box>
        </Stack>

        <Typography variant="h6" fontWeight={700} sx={{ mt: 2 }}>
          {item.title}
        </Typography>
        <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>{item.content}</Typography>
      </Card>

      <Paper variant="outlined" sx={{ p: 2, mt: 2, borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Replies
        </Typography>

        <ErrorMessage>{comments.error}</ErrorMessage>
        {comments.loading && <Loading />}
        {comments.data?.comments?.length === 0 && <Empty>No replies yet.</Empty>}
        {comments.data?.comments?.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}

        {isSignedIn ? (
          <CommentComposer postId={item.id} onCreated={comments.reload} />
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Log in to reply.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
