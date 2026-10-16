import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { errorMessage } from "../api/client";
import { ErrorMessage } from "../components/Feedback";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);

  const onSubmit = async (values) => {
    setFormError(null);
    try {
      // Signing up now also signs you in: the API returns a token, so there
      // is no reason to bounce the user to the login form.
      await signup(values);
      navigate("/", { replace: true });
    } catch (error) {
      setFormError(errorMessage(error, "Could not create your account."));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ maxWidth: 400 }}>
      <Typography variant="h5" fontWeight={800} gutterBottom>
        Create your account
      </Typography>

      <ErrorMessage>{formError}</ErrorMessage>

      <Stack spacing={2}>
        <TextField
          label="Name"
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          {...register("name", { required: "Name is required" })}
        />
        <TextField
          label="Username"
          error={Boolean(errors.username)}
          helperText={errors.username?.message ?? "Letters, numbers and underscores"}
          {...register("username", {
            required: "Username is required",
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: "Letters, numbers and underscores only",
            },
          })}
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...register("email", { required: "Email is required" })}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          error={Boolean(errors.password)}
          helperText={errors.password?.message ?? "At least 6 characters"}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "At least 6 characters" },
          })}
        />
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : "Sign up"}
        </Button>
      </Stack>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account? <Link component={RouterLink} to="/login">Log in</Link>
      </Typography>
    </Box>
  );
}
