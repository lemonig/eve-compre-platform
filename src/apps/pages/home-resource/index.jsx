import React, { useEffect, useState, useRef } from "react";
import Left from "./components/Left";
import Right from "./components/Right";
import Middle from "./components/Middle";
import "./index.less";
import { count as countApi } from "@Api/dashboard";

function HomeResource() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getcount = async () => {
      let { data } = await countApi();
      setData(data);
    };
    getcount();
  }, []);

  return (
    <div className="content-wrap home-resource">
      <Left countData={data}></Left>
      <Middle countData={data}></Middle>
      <Right countData={data}></Right>
    </div>
  );
}

export default HomeResource;
