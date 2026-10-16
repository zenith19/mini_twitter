import React from "react";
import { Switch, Route } from "react-router-dom";
import Users from "../Users";
import Posts from "../Posts";
import FullPost from "../FullPost";
import Profile from "../Profile";
import SignUp from "../Signup";
import Login from "../Login";
import Logout from "../Logout";
import Followings from "../Followings";
import Followers from "../Followers";
import Follow from "../Follow";

const Body = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/users">
          <Users />
        </Route>
        <Route exact path="/">
          <Posts />
        </Route>
        <Route exact path="/posts/:postId">
          <FullPost />
        </Route>
        <Route exact path="/users/:userId">
          <Profile />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/logout">
          <Logout />
        </Route>
        <Route exact path="/followings">
          <Followings />
        </Route>
        <Route exact path="/followers">
          <Followers />
        </Route>
        <Route exact path="/follow/:followingUserId">
          <Follow />
        </Route>
      </Switch>
    </div>
  );
};

export default Body;
