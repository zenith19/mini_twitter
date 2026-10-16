import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Feed from "./pages/Feed";
import PostDetail from "./pages/PostDetail";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import Connections from "./pages/Connections";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import { useAuth } from "./auth/AuthContext";

// Redirects the old /followings and /followers routes, which assumed the
// signed-in user, to the canonical per-user URLs.
function MyConnections({ kind }) {
  const { user, isSignedIn } = useAuth();
  if (!isSignedIn) return <Navigate to="/login" replace />;
  return <Navigate to={`/users/${user.id}/${kind}`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Feed />} />
        <Route path="posts/:postId" element={<PostDetail />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:userId" element={<Profile />} />
        <Route path="users/:userId/followings" element={<Connections kind="followings" />} />
        <Route path="users/:userId/followers" element={<Connections kind="followers" />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        <Route path="followings" element={<MyConnections kind="followings" />} />
        <Route path="followers" element={<MyConnections kind="followers" />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
