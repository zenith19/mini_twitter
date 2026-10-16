import { Link as RouterLink, useParams } from "react-router-dom";
import { Box, Card, Link, Stack, Typography } from "@mui/material";
import useFetch from "../api/useFetch";
import Avatar from "../components/Avatar";
import FollowButton from "../components/FollowButton";
import PostCard from "../components/PostCard";
import { Empty, ErrorMessage, Loading } from "../components/Feedback";

export default function Profile() {
  const { userId } = useParams();
  const profile = useFetch(`/v1/users/${userId}`);
  const posts = useFetch(`/v1/users/${userId}/posts`);

  if (profile.loading) return <Loading />;
  if (profile.error) return <ErrorMessage>{profile.error}</ErrorMessage>;

  const user = profile.data?.user;
  if (!user) return <Empty>No such user.</Empty>;

  return (
    <Box>
      <Card variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar user={user} size={64} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={800}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Link component={RouterLink} to={`/users/${user.id}/followings`} variant="body2">
                Following
              </Link>
              <Link component={RouterLink} to={`/users/${user.id}/followers`} variant="body2">
                Followers
              </Link>
            </Stack>
          </Box>
          {/* The follow state comes from the serializer, so there is no
              separate request and nothing to poll. */}
          <FollowButton
            userId={user.id}
            initiallyFollowing={user.following}
            onChange={profile.reload}
          />
        </Stack>
      </Card>

      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
        Posts
      </Typography>

      <ErrorMessage>{posts.error}</ErrorMessage>
      {posts.loading && <Loading />}
      {posts.data?.posts?.length === 0 && <Empty>No posts yet.</Empty>}
      {posts.data?.posts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Box>
  );
}
