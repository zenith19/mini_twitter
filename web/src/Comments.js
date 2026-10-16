import React, { useState, useEffect } from "react";
import Comment from "./Component/Comment";
import axios from "axios";
import "./style/Comments.css"

const Comments = (props) => {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    axios
      .get(
        "http://localhost:3001/v1/posts/" +
          props.postId +
          "/comments"
      )
      .then((response) => setComments(response.data))
      .catch((error) => console.log(error));
  },[props.postId]);
  return (
    <div className="Comments">
      <h6>Comments</h6>
      {[...comments].reverse().map((comment) => (
        <Comment key={comment.id} item={comment} />
      ))}
    </div>
  );
};

export default Comments;
