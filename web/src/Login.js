import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

const Login = () => {
  const { register, handleSubmit, errors } = useForm();
  const [login, setLogin] = useState({});
  let history = useHistory();
  const handleFormSubmit = (data) => {
    setLogin(data);
  };
  localStorage.clear();
  useEffect(() => {
    axios
      .post("http://localhost:3001/v1/sessions", login)
      .then((response) => {
        if ("authentication_token" in response.data) {
          localStorage.setItem("loginData", JSON.stringify(response.data));
          history.replace("/");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [history, login]);
  return (
    <div>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="Signup">
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
        <button type="submit" className="btn btn-primary btn-lg btn-block">
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
