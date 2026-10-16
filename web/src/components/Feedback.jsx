import { Alert, Box, CircularProgress } from "@mui/material";

export function Loading({ label = "Loading…" }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }} role="status" aria-label={label}>
      <CircularProgress size={28} />
    </Box>
  );
}

export function ErrorMessage({ children }) {
  if (!children) return null;
  return (
    <Alert severity="error" sx={{ my: 2 }}>
      {children}
    </Alert>
  );
}

export function Empty({ children }) {
  return (
    <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>{children}</Box>
  );
}
