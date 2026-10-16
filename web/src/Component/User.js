import React from "react";
import "../style/User.css";
import {Link} from "react-router-dom"

const User = (props) => {
  return (
    <Link to={"/users/" + props.item.id}>
      <div className="User">
        <li>User Id: {props.item.id}</li>
        <li>User Name: {props.item.name}</li>
        <li>User Email: {props.item.email}</li>
        <li>User username: {props.item.username}</li>
      </div>
    </Link>
  );
};

export default User;
