import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  let loginData = JSON.parse(localStorage.getItem("loginData"));
  let history = useHistory();
  useEffect(() => {
    axios
      .delete("http://localhost:3001/v1/sessions/" + loginData.id, {
        headers: {
          token: loginData.authentication_token
        }
      })
      .then((response)=>{
        console.log(response);
        localStorage.clear();
        history.replace("/");
        window.location.reload();
      })
      .catch((error) => console.log(error));
  });

  return (<div>Logging out....</div>);
};

export default Logout;
