import React, { useState, useEffect } from "react";
import axios from "axios";
import User from "./Component/User";

const Followers = () => {
  let userId = JSON.parse(localStorage.getItem("loginData")).id;
  let [users, setUsers] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3001/v1/user_followings/" + userId, {
        headers: {
          token: JSON.parse(localStorage.getItem("loginData"))
            .authentication_token,
        }
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => console.log(error));
  }, [userId]);
  return (
    <div>
      {users.map((user) => (
        <User key={user.id} item={user} />
      ))}
    </div>
  );
};

export default Followers;
