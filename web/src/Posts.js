import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Component/Post";
import CreatePost from "./CreatePost";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/v1/posts")
      .then((response) => setPosts(response.data))
      .catch((error) => console.log(error));
  }, []);

  let reverseArr = [...posts].reverse();

  return (
    <div>
      <CreatePost />
      {reverseArr.map((post) => (
        <Post key={post.id} item={post} />
      ))}
    </div>
  );
};

export default Posts;
