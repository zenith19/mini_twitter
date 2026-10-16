import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import "./CreatePost.css";

const CreatePost = () => {
  const [newPost, setNewPost] = useState({});
  const { register, handleSubmit, errors } = useForm();
  let history = useHistory();
  let loginData = {};
  if (localStorage.getItem("loginData")) {
    loginData = JSON.parse(localStorage.getItem("loginData"));
  }

  let tempPost = {};
  const handleFormSubmit = (data) => {
    if (localStorage.getItem("loginData") === null) {
      history.push("/login");
    }
    tempPost = { ...data, user_id: loginData.id };
    setNewPost(tempPost);
  };

  useEffect(() => {
    if (Object.keys(newPost).length !== 0) {
      axios
        .post("http://localhost:3001/v1/posts", newPost, {
          headers: {
            token: JSON.parse(localStorage.getItem("loginData"))
              .authentication_token,
          },
        })
        .then((response) => {
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [newPost]);
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="CreatePost">
      <div className="form-group">
        <input
          type="text"
          name="title"
          placeholder="Title of Post"
          ref={register({ required: true })}
          className="form-control"
        />
      </div>
      {errors.title && <span>This field is required</span>}
      <div className="form-group">
        <textarea
          type="textarea"
          name="content"
          placeholder="Your Post"
          ref={register({ required: true })}
          className="form-control"
        />
      </div>
      {errors.content && <span>This field is required</span>}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth={true}
      >
        Tweet
      </Button>
    </form>
  );
};

export default CreatePost;
