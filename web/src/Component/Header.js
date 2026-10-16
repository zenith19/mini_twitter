import React from "react";
import CurrentUser from "../CurrentUser";
import { AppBar, Typography, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  toolbar: {
    minHeight: 90,
    flex: 1,
    paddingTop: 5
  },
});

const Header = () => {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography>Mini Twitter</Typography>
        <div className={classes.toolbar}>
          {localStorage.getItem("loginData") !== null && <CurrentUser />}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
