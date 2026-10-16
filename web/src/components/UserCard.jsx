import { Link as RouterLink } from "react-router-dom";
import { Box, Card, CardActionArea, Stack, Typography } from "@mui/material";
import Avatar from "./Avatar";

export default function UserCard({ user, action }) {
  return (
    <Card variant="outlined" sx={{ mb: 1, borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" sx={{ pr: 2 }}>
        <CardActionArea component={RouterLink} to={`/users/${user.id}`} sx={{ p: 2 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar user={user} />
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{user.username}
              </Typography>
            </Box>
          </Stack>
        </CardActionArea>
        {action}
      </Stack>
    </Card>
  );
}
