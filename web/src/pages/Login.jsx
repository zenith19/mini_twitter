import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { errorMessage } from "../api/client";
import { ErrorMessage } from "../components/Feedback";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState(null);

  // The old version called localStorage.clear() during render and fired a
  // POST with an empty body from a useEffect on mount. The request now
  // happens only here, when the form is actually submitted.
  const onSubmit = async (values) => {
    setFormError(null);
    try {
      await login(values);
      navigate(location.state?.from?.pathname ?? "/", { replace: true });
    } catch (error) {
      setFormError(errorMessage(error, "Could not log in."));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ maxWidth: 400 }}>
      <Typography variant="h5" fontWeight={800} gutterBottom>
        Log in
      </Typography>

      {location.state?.expired && !formError && (
        <Alert severity="info" sx={{ my: 2 }}>
          Your session ended. Please log in again.
        </Alert>
      )}

      <ErrorMessage>{formError}</ErrorMessage>

      <Stack spacing={2}>
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
          autoComplete="current-password"
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          {...register("password", { required: "Password is required" })}
        />
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </Stack>

      <Typography variant="body2" sx={{ mt: 2 }}>
        No account? <Link component={RouterLink} to="/signup">Sign up</Link>
      </Typography>
    </Box>
  );
}
