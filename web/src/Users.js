import React, { useState, useEffect } from "react";
import axios from "axios";
import User from "./Component/User";
import "./style/Users.css"

const Users = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3001/v1/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.log(error));
  },[]);
  return (
    <div className="Users">
      {users.map((user) => (
        <User key={user.id} item={user} />
      ))}
    </div>
  );
};

export default Users;
