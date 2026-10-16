import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import "./style/Signup.css";
import axios from "axios";

const Signup = () => {
  const { register, handleSubmit, errors } = useForm();
  const [newUser, setNewUser] = useState({});
  let history = useHistory();
  let tempData = {};
  const handleFormSubmit = (data) => {
    tempData = { ...data };
    console.log(tempData);
    setNewUser(tempData);
  };
  useEffect(() => {
    if (Object.keys(newUser).length !== 0) {
      axios
        .post("http://localhost:3001/v1/users", newUser)
        .then((response) => {
          console.log(response);
          history.replace("/");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [history, newUser]);
  return (
    <div>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="Signup">
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Name"
            ref={register({ required: true })}
            className="form-control"
          />
        </div>
        {errors.name && <span>This field is required</span>}
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            ref={register({ required: true })}
            className="form-control"
          />
        </div>
        {errors.email && <span>This field is required</span>}
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            ref={register({ required: true })}
            className="form-control"
            autoComplete="true"
          />
        </div>
        {errors.password && <span>This field is required</span>}
        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="UserName"
            ref={register({ required: true })}
            className="form-control"
          />
        </div>
        {errors.username && <span>This field is required</span>}
        <button type="submit" className="btn btn-primary btn-lg btn-block">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
