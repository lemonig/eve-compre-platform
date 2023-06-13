import React, { useEffect, useState } from "react";
import LayMenu from "@App/layout/lay-menu";
import StationTree from "@Shared/stationTree";

import { handleMenu } from "@Utils/menu";
import { useDispatch, useSelector } from "react-redux";

import { getFactor } from "@Api/data-list.js";

function HomeReal() {
  const [menuSelect, setMenuSelect] = useState({
    title: "",
    key: "",
    query: "",
    ptitle: "",
  });

  const [stationSelect, setStationSelect] = useState({
    title: "",
    key: "",
  });

  const [activeKey, setActiveKey] = useState("1");
  const [facList, setfacList] = useState([]); //因子

  useEffect(() => {
    setMenuSelect({
      key: dataMenu.children[0].children[0].id,
      title: dataMenu.children[0].children[0].title,
      query: dataMenu.children[0].children[0].query,
      ptitle: dataMenu.children[0].title,
    });
  }, []);

  const menu = useSelector((state) => state.menu);
  const menuTree = menu ? handleMenu(menu) : [];

  let dataMenu = menuTree
    .find((ele) => ele.label === "数据查询")
    .children.find((ele) => ele.label === "监测数据");

  dataMenu.children.forEach((element) => {
    element.type = "group";
  });

  const onMenuChange = ({ key, title, query, ptitle }) => {
    setMenuSelect({
      title,
      key: key[0],
      query,
      ptitle,
    });
  };

  const onTabChange = (key) => {
    setActiveKey(key);
  };

  const onStationChange = (e) => {
    setStationSelect(e);
  };
  useEffect(() => {
    if (stationSelect.key) {
      console.log("station - change");
      const getFactorData = async () => {
        let { data } = await getFactor({
          id: stationSelect.key,
        });
        data?.forEach((item) => {
          item.checked = true;
        });
        // console.log(data);
        setfacList(data);
      };
      getFactorData();
    }
  }, [stationSelect.key]);

  return (
    <>
      <section className="main-content">
        {!!menuSelect.query ? (
          <StationTree query={menuSelect.query} onChange={onStationChange} />
        ) : null}
        <div className="content-wrap"></div>
      </section>
    </>
  );
}

export default HomeReal;
