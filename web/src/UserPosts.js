import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Component/Post"
import "./style/UserPosts.css"

const UserPosts = (props) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    axios
      .get(
        "http://localhost:3001/v1/users/" + props.userId + "/posts"
      )
      .then((response) => setPosts(response.data))
      .catch((error) => console.log(error));
  }, [props.userId]);

  return (
    <div className="UserPosts">
        <h6>Posts: </h6>
      {[...posts].reverse().map((post) => (
        <Post key={post.id} item={post} />
      ))}
    </div>
  );
};

export default UserPosts;
