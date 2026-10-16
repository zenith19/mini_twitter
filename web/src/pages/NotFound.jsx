import { Link as RouterLink } from "react-router-dom";
import { Box, Link, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Box sx={{ py: 8, textAlign: "center" }}>
      <Typography variant="h5" fontWeight={800} gutterBottom>
        Page not found
      </Typography>
      <Link component={RouterLink} to="/">
        Back to the feed
      </Link>
    </Box>
  );
}
