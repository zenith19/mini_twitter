import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Comments from "./Comments";
import CreateComment from "./CreateComment";

const FullPost = (props) => {
  const [post, setPost] = useState({});
  let { postId } = useParams();
  useEffect(() => {
    axios
      .get("http://localhost:3001/v1/posts/" + postId)
      .then((response) => setPost(response.data))
      .catch((error) => console.log(error));
  }, [postId]);
  return (
    <div>
      <li>Post Id: {post.id}</li>
      <li>Post Name: {post.title}</li>
      <li>Posts Body: {post.content}</li>
      <li>User Id: {post.user_id}</li>
      <Comments postId={post.id} />
      <CreateComment postId={postId} />
    </div>
  );
};

export default FullPost;
