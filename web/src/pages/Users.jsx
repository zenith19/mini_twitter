import { Box, Typography } from "@mui/material";
import useFetch from "../api/useFetch";
import UserCard from "../components/UserCard";
import FollowButton from "../components/FollowButton";
import { Empty, ErrorMessage, Loading } from "../components/Feedback";

export default function Users() {
  const { data, error, loading, reload } = useFetch("/v1/users?per_page=50");

  return (
    <Box>
      <Typography variant="h6" fontWeight={800} gutterBottom>
        People
      </Typography>

      <ErrorMessage>{error}</ErrorMessage>
      {loading && <Loading />}
      {data?.users?.length === 0 && <Empty>Nobody here yet.</Empty>}

      {data?.users?.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          action={
            <FollowButton
              userId={user.id}
              initiallyFollowing={user.following}
              onChange={reload}
            />
          }
        />
      ))}
    </Box>
  );
}
