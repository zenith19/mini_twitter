import React from "react";
import { Link } from "react-router-dom";
import "../style/Post.css";

const Post = (props) => {
  return (
    <Link to={"/posts/" + props.item.id}>
      <div className="Post">
        <li>Post Id: {props.item.id}</li>
        <li>Post Name: {props.item.title}</li>
        <li>Posts Body: {props.item.content}</li>
        <li>User Id {props.item.user_id}</li>
      </div>
    </Link>
  );
};

export default Post;
