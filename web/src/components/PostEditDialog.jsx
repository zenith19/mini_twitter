import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField,
} from "@mui/material";
import client, { errorMessage } from "../api/client";
import { ErrorMessage } from "./Feedback";

export default function PostEditDialog({ post, open, onClose, onSaved }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { title: post.title, content: post.content } });
  const [formError, setFormError] = useState(null);

  const onSubmit = async (values) => {
    setFormError(null);
    try {
      await client.patch(`/v1/posts/${post.id}`, { post: values });
      onSaved();
      onClose();
    } catch (error) {
      setFormError(errorMessage(error, "Could not save your changes."));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Edit post</DialogTitle>
        <DialogContent>
          <ErrorMessage>{formError}</ErrorMessage>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
              {...register("title", { required: "A title is required" })}
            />
            <TextField
              label="Content"
              multiline
              minRows={3}
              error={Boolean(errors.content)}
              helperText={errors.content?.message}
              {...register("content", { required: "Say something first" })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
