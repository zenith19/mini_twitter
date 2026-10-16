import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import useFetch from "../api/useFetch";
import UserCard from "../components/UserCard";
import FollowButton from "../components/FollowButton";
import { Empty, ErrorMessage, Loading } from "../components/Feedback";

// One component for both lists. Followers.js and Followings.js used to be
// byte-for-byte copies of each other — and because of that, Followers.js
// still queried the *followings* endpoint and showed the wrong people.
export default function Connections({ kind }) {
  const { userId } = useParams();
  const { data, error, loading, reload } = useFetch(`/v1/users/${userId}/${kind}`);

  const title = kind === "followers" ? "Followers" : "Following";
  const emptyText =
    kind === "followers" ? "No followers yet." : "Not following anyone yet.";

  return (
    <Box>
      <Typography variant="h6" fontWeight={800} gutterBottom>
        {title}
      </Typography>

      <ErrorMessage>{error}</ErrorMessage>
      {loading && <Loading />}
      {data?.users?.length === 0 && <Empty>{emptyText}</Empty>}

      {data?.users?.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          action={
            <FollowButton userId={user.id} initiallyFollowing={user.following} onChange={reload} />
          }
        />
      ))}
    </Box>
  );
}
