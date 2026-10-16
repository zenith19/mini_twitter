import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import useFetch from "../api/useFetch";
import client, { errorMessage } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import PostCard from "../components/PostCard";
import { Empty, ErrorMessage, Loading } from "../components/Feedback";

function Composer({ onCreated }) {
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
      // user_id is no longer sent: the API takes the author from the token.
      await client.post("/v1/posts", { post: values });
      reset();
      // Used to be window.location.reload().
      onCreated();
    } catch (error) {
      setFormError(errorMessage(error, "Could not publish your post."));
    }
  };

  return (
    <Paper variant="outlined" component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      <ErrorMessage>{formError}</ErrorMessage>
      <Stack spacing={1.5}>
        <TextField
          placeholder="Title"
          size="small"
          error={Boolean(errors.title)}
          helperText={errors.title?.message}
          {...register("title", { required: "A title is required" })}
        />
        <TextField
          placeholder="What's happening?"
          multiline
          minRows={2}
          error={Boolean(errors.content)}
          helperText={errors.content?.message}
          {...register("content", { required: "Say something first" })}
        />
        <Box sx={{ textAlign: "right" }}>
          <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ borderRadius: 5, px: 3 }}>
            {isSubmitting ? "Posting…" : "Post"}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function Feed() {
  const { isSignedIn } = useAuth();
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useFetch(`/v1/posts?page=${page}`);

  return (
    <Box>
      {isSignedIn ? (
        <Composer onCreated={() => (page === 1 ? reload() : setPage(1))} />
      ) : (
        <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
          <Typography variant="body2">
            <RouterLink to="/login">Log in</RouterLink> to post, comment and follow.
          </Typography>
        </Paper>
      )}

      <ErrorMessage>{error}</ErrorMessage>
      {loading && <Loading />}

      {data?.posts?.length === 0 && <Empty>No posts yet.</Empty>}
      {data?.posts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {data?.meta && data.meta.total_pages > 1 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
            <Button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Typography variant="body2" color="text.secondary">
              Page {data.meta.current_page} of {data.meta.total_pages}
            </Typography>
            <Button
              disabled={page >= data.meta.total_pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
}
