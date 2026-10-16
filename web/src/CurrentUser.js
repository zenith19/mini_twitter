import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./style/CurrentUser.css";

const CurrentUser = () => {
  const [currentUser, setCurrentUser] = useState({});
  const loginData = JSON.parse(localStorage.getItem("loginData"));
  useEffect(() => {
    axios
      .get("http://localhost:3001/v1/users/" + loginData.id)
      .then((response) => setCurrentUser(response.data))
      .catch((error) => console.log(error));
  }, [loginData.id]);

  return (
    <div className="CurrentUser">
      <Link to={"/users/" + loginData.id}>
        <div>
          {currentUser.name} {" @"}
          {currentUser.username}
        </div>
      </Link>
      <Link to="/logout">Log Out</Link>
    </div>
  );
};

export default CurrentUser;
