import React, { useEffect, useState } from "react";
import LayMenu from "@App/layout/lay-menu";
import StationTree from "@Shared/stationTree";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import { Tabs } from "antd";
import DataTable from "./components/DataTable";

import { handleMenu } from "@Utils/menu";
import { useDispatch, useSelector } from "react-redux";

function DataList() {
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
    console.log(key);
  };
  const onStationChange = (e) => {
    setStationSelect(e);
  };

  const items = [
    {
      key: "1",
      label: `站点数据`,
      children: <DataTable stationMsg={stationSelect} menuMsg={menuSelect} />,
    },
    {
      key: "2",
      label: `单站单参分析`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: "3",
      label: `单站多参分析`,
      children: `Content of Tab Pane 3`,
    },
  ];

  return (
    <>
      <LayMenu
        menuList={dataMenu.children}
        onChange={onMenuChange}
        value={[dataMenu.children[0].children[0].id]}
      />
      <section className="main-content">
        {!!menuSelect.query ? (
          <StationTree query={menuSelect.query} onChange={onStationChange} />
        ) : null}
        <div className="content-wrap">
          <Lbreadcrumb
            data={[
              "数据查询",
              "监测数据",
              `${menuSelect.ptitle}`,
              `${menuSelect.title}`,
            ]}
          />
          <h2 className="satation-name">{stationSelect.title}</h2>
          <Tabs defaultActiveKey="1" items={items} onChange={onTabChange} />
        </div>
      </section>
    </>
  );
}

export default DataList;
