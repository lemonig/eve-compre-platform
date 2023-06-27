import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Select,
  Button,
  Space,
  Table,
  Tag,
  Modal,
  Form,
  message,
  Tooltip,
  Switch,
  Cascader,
  Checkbox,
  Radio,
} from "antd";

import ChartMul from "./ChartMul"; //多轴
import ChartPile from "./ChartPile"; //堆叠
import ChartCoaxial from "./ChartCoaxial"; //同轴

const colorList = [
  "#1C47BF",
  "#DA4688",
  "#14BA87",
  "#DB5230",
  "#9161F3",
  "#1085E5",
  "#A7198C",
  "#1D7733",
  "#432585",
  "#958310",
  "#931515",
  "#FFD666",
  "#BAE637",
  "#73D13D",
  "#5CDBD3",
  "#69C0FF",
  "#85A5FF",
  "#B37FEB",
  "#FF85C0",
  "#A8071A",
  "#AD6800",
  "#5B8C00",
  "#006D75",
  "#0050B3",
];

function Graph({ data, chartModal, compType, loading, originData }) {
  // useEffect(()=>{
  //   if(compType)
  //   sequence
  // },[])
  const getChartDom = () => {
    if (chartModal == 1) {
      return (
        <ChartPile
          data={data}
          loading={loading}
          compType={compType}
          originData={originData}
          colorList={colorList}
        />
      );
    } else if (chartModal == 2) {
      return (
        <ChartCoaxial
          data={data}
          loading={loading}
          compType={compType}
          originData={originData}
          colorList={colorList}
        />
      );
    } else if (chartModal == 3) {
      return (
        <ChartMul
          data={data}
          loading={loading}
          compType={compType}
          originData={originData}
          colorList={colorList}
        />
      );
    }
  };
  return (
    <>
      <div className="search"></div>
      {data ? getChartDom() : null}
    </>
  );
}

export default Graph;
