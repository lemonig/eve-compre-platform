import React from "react";
import LayMenu from "@App/layout/lay-menu";
import StationTree from "@Shared/stationTree";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import { Tabs } from "antd";
import DataTable from "./components/DataTable";

const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: "1",
    label: `Tab 1`,
    children: <DataTable />,
  },
  {
    key: "2",
    label: `Tab 2`,
    children: `Content of Tab Pane 2`,
  },
  {
    key: "3",
    label: `Tab 3`,
    children: `Content of Tab Pane 3`,
  },
];

function DataList() {
  return (
    <>
      <LayMenu />
      <section className="main-content">
        <StationTree />
        <div className="content-wrap">
          <Lbreadcrumb data={["数据查询", "监测数据", "大气环境", "空气站"]} />
          <h2 className="satation-name">半山国家森林</h2>
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
      </section>
    </>
  );
}

export default DataList;
