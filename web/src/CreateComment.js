import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import "./CreatePost.css";
import { useHistory } from "react-router-dom";

const CreateComment = (props) => {
  const [newComment, setNewComment] = useState({});
  const { register, handleSubmit, errors } = useForm();
  let history = useHistory();
  let loginData = {};
  if (localStorage.getItem("loginData")) {
    loginData = JSON.parse(localStorage.getItem("loginData"));
  }

  let tempComment = {};
  const handleFormSubmit = (data) => {
    if (localStorage.getItem("loginData") === null) {
      history.replace("/login");
    }
    tempComment = { ...data, post_id: props.postId, user_id: loginData.id };
    setNewComment(tempComment);
  };

  useEffect(() => {
    if (Object.keys(newComment).length !== 0) {
      axios
        .post("http://localhost:3001/v1/comments", newComment, {
          headers: {
            token: JSON.parse(localStorage.getItem("loginData"))
              .authentication_token,
          }
        })
        .then((response) => {
          console.log(response);
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [newComment]);
  return (
    <div>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="CreatePost">
        <div className="form-group">
          <textarea
            type="textarea"
            name="content"
            placeholder="Your Comment"
            ref={register({ required: true })}
            className="form-control"
          />
        </div>
        {errors.content && <span>This field is required</span>}
        <button type="submit" className="btn btn-primary btn-lg btn-block">
          Comment
        </button>
      </form>
    </div>
  );
};

export default CreateComment;
