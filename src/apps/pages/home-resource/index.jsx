import React from "react";
import Left from "./components/Left";
import Right from "./components/Right";
import Middle from "./components/Middle";
import "./index.less";

function HomeResource() {
  return (
    <div className="content-wrap home-resource">
      <Left></Left>
      <Middle></Middle>
      <Right></Right>
    </div>
  );
}

export default HomeResource;
