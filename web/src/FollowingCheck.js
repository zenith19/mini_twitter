import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const FollowingCheck = (props) => {
  let followingUsers = [];
  const [followingUserIds, setFollowingUserIds] = useState([]);
  useEffect(() => {
    axios
      .get(
        "http://localhost:3001/v1/user_followings/" +
          JSON.parse(localStorage.getItem("loginData")).id
      )
      .then((response) => {
        followingUsers.push(...response.data);
        let tempUserIds = [];
        followingUsers.map((user) => tempUserIds.push(user.id));
        setFollowingUserIds(tempUserIds);
      })
      .catch((error) => console.log(error));
  }, [followingUsers]);

  return (
    <div className="Follow">
      {followingUserIds.includes(parseInt(props.userId)) ? (
        "Following"
      ) : (
        <Link to={"/follow/" + props.userId}>Follow</Link>
      )}
    </div>
  );
};

export default FollowingCheck;
