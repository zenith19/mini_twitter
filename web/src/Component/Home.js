import React from "react";
import Sidebar from "./Sidebar";
import Body from "./Body";
import Header from "./Header";
import Grid from "@material-ui/core/Grid";

const Home = () => {
  return (
    <Grid container direction="column">
      <Grid item>
        <Header />
      </Grid>
      <Grid container direction="row" justify="center" alignItems="top">
        <Grid item xs={2} />
        <Grid item xs={1}>
          <Sidebar />
        </Grid>
        <Grid item xs={6}>
          <Body />
        </Grid>
        <Grid item xs={3} />
      </Grid>
    </Grid>
  );
};

export default Home;
