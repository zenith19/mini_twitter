import React, { useEffect } from "react";
import "./Follow.css";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";

const Follow = () => {
  let { followingUserId } = useParams();
  let history = useHistory();
  let user_following = {
    user_id: JSON.parse(localStorage.getItem("loginData")).id,
    following_user_id: parseInt(followingUserId),
  };
  console.log(user_following);
  useEffect(() => {
    axios
      .post("http://localhost:3001/v1/user_followings", user_following, {
        headers: {
          token: JSON.parse(localStorage.getItem("loginData"))
            .authentication_token,
        }
      })
      .then((response) => response.data)
      .catch((error) => console.log(error));
  }, [user_following]);
  return (
    <div>
      Following...
      {history.push("/users/" + followingUserId)}
      {window.location.reload()}
    </div>
  );
};

export default Follow;
