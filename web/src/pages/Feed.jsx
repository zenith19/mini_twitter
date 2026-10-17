import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box, Button, Divider, Paper, Stack, Tab, Tabs, TextField, Typography,
} from "@mui/material";
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
  const [tab, setTab] = useState("following");
  const [page, setPage] = useState(1);

  // Signed-out visitors only have the public list. Signed-in users default to
  // their own timeline — until this existed, following somebody changed a
  // button label and nothing else.
  const showingTimeline = isSignedIn && tab === "following";
  const path = showingTimeline ? `/v1/timeline?page=${page}` : `/v1/posts?page=${page}`;
  const { data, error, loading, reload } = useFetch(path);

  const changeTab = (_event, value) => {
    setTab(value);
    setPage(1);
  };

  const refresh = () => (page === 1 ? reload() : setPage(1));

  return (
    <Box>
      {isSignedIn ? (
        <Composer onCreated={refresh} />
      ) : (
        <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
          <Typography variant="body2">
            <RouterLink to="/login">Log in</RouterLink> to post, comment and follow.
          </Typography>
        </Paper>
      )}

      {isSignedIn && (
        <Tabs value={tab} onChange={changeTab} sx={{ mb: 1 }}>
          <Tab value="following" label="Following" sx={{ textTransform: "none" }} />
          <Tab value="everyone" label="Everyone" sx={{ textTransform: "none" }} />
        </Tabs>
      )}

      <ErrorMessage>{error}</ErrorMessage>
      {loading && <Loading />}

      {data?.posts?.length === 0 &&
        (showingTimeline ? (
          <Empty>
            Your timeline is empty. Find people to follow on the{" "}
            <RouterLink to="/users">People</RouterLink> page, or switch to Everyone.
          </Empty>
        ) : (
          <Empty>No posts yet.</Empty>
        ))}

      {data?.posts?.map((post) => (
        <PostCard key={post.id} post={post} onChanged={refresh} />
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
