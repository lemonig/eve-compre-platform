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
import dayjs from "dayjs";

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
const toolbox = {
  feature: {
    dataZoom: {
      yAxisIndex: "none",
      title: {
        zoom: "区域缩放",
        back: "区域还原",
      },
    },

    magicType: {
      show: true,
      type: ["line", "bar"],
      title: ["折线图", "柱状图"],
    },
    saveAsImage: {
      name: `数据对比-${dayjs(new Date()).format("YYYYMMDD")}`,
      title: "保存",
    },
  },
};

const tooltip = {
  trigger: "axis",
  formatter: function (params) {
    let html = `<div>${params[0].axisValue}</div>`;
    params.map((item) => {
      // if (item.value || item.value === 0) {
      html += `<div>${item.marker} ${item.seriesName}：${
        item.value ? item.value : "--"
      } ${item.data.unit ? item.data.unit : ""}</div>`;
      // }
    });
    return html;
  },
};
function Graph({ data, chartModal, compType, loading, originData }) {
  const [chart, setChart] = useState();

  // useEffect(() => {
  //   if (originData.relation) {
  //     if (compType === "sequence") {
  //       let { series, legend, xData } =  handleSeriedTime();
  //       setChart({ series, legend, xData, toolbox, tooltip });
  //     } else if (compType === "avg") {
  //       let { series, legend, xData } = handleSeriedAvg();
  //       setChart({ series, legend, xData, toolbox, tooltip });
  //     }
  //   }
  // }, [data]);

  useEffect(() => {
    if (originData.relation) {
      let { series, legend, xData } =
        compType === "sequence" ? handleSeriedTime() : handleSeriedAvg();
      setChart({ series, legend, xData, toolbox, tooltip });
    }
  }, [data]);

  const handleSeriedTime = () => {
    let legend = [];
    let series = [];
    // 组成series
    for (let i in originData.relation) {
      let factorAll = [
        ...originData.relation[i].factor,
        ...originData.relation[i].evaluateIndex,
      ];
      factorAll.forEach((ele) => {
        legend.push(originData.relation[i].name + "-" + ele.label);
        series.push({
          sid: i,
          fkey: ele.value,
          name: originData.relation[i].name + "-" + ele.label,
          type: "line",
          connectNulls: true,
          data: [],
        });
      });
    }
    // 取值
    data.forEach((item) => {
      series.forEach((jtem) => {
        if (item.station_id == jtem.sid) {
          jtem.data.push({
            unit: jtem.unit,
            value: item[jtem.fkey],
          });
        }
      });
    });

    return {
      series,
      legend,
      xData: originData.dateList,
    };
  };

  const handleSeriedAvg = () => {
    let legend = [];
    let series = [];
    let xData = [];
    // 组成series
    var factorAll = [
      ...originData.avgRelation.factor,
      ...originData.avgRelation.evaluateIndex,
    ];

    factorAll.forEach((ele) => {
      legend.push(ele.label);
      series.push({
        fkey: ele.value,
        name: ele.label,
        type: "line",
        connectNulls: true,
        data: [],
      });
    });
    data.forEach((item) => {
      xData.push(item.name);
      series.forEach((jtem) => {
        jtem.data.push({
          unit: jtem.unit,
          value: item[jtem.fkey],
        });
      });
    });

    return {
      series,
      legend,
      xData,
    };
  };

  const getChartDom = () => {
    if (chartModal == 1) {
      return (
        <ChartPile
          data={data}
          loading={loading}
          compType={compType}
          originData={originData}
          colorList={colorList}
          chartPart={chart}
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
          chartPart={chart}
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
          chartPart={chart}
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
