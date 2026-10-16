import React from "react";
import { Link } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";

const Sidebar = () => {
  return (
    <div>
      <div>
        <Nav vertical>
          <NavItem>
            <Link to="/">Home</Link>
          </NavItem>
          <NavItem>
            <Link to="/users">Users List</Link>
          </NavItem>
          {localStorage.getItem("loginData") === null && (
            <NavItem>
              <Link to="/signup">Sign Up</Link>
            </NavItem>
          )}
          {localStorage.getItem("loginData") === null && (
            <NavItem>
              <Link to="/login">Log in</Link>
            </NavItem>
          )}
          {localStorage.getItem("loginData") !== null && (
            <NavItem>
              <Link to="/followings">Following</Link>
            </NavItem>
          )}
          {localStorage.getItem("loginData") !== null && (
            <NavItem>
              <Link to="/followers">Followers</Link>
            </NavItem>
          )}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
