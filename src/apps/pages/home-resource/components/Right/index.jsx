import React, { useEffect, useState, useRef } from "react";
// api
import { chartApiLogTop, chartApiLog } from "@Api/dashboard";

import Card from "../Card";
import IconFont from "@Components/IconFont";
import Lstatistic from "@Components/Lstatistic";
import ReactECharts from "echarts-for-react";
import { colorList } from "../util";

function Right({ countData }) {
  const [chartdata, setChartdata] = useState(null);
  const [chartdata1, setChartdata1] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = chartRef.current && chartRef.current.getEchartsInstance();
    const handleResize = () => {
      chart && chart.resize();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [chartRef]);

  useEffect(() => {
    const getcount = async () => {
      let { data } = await chartApiLogTop();
      setChartdata1(getOption1(data));
    };

    getcount();
  }, []);
  useEffect(() => {
    const getChartData = async () => {
      let { data } = await chartApiLog();
      setChartdata(getOption(data));
    };
    getChartData();
  }, []);

  const getOption = (data) => {
    let { xAxis, series } = data;
    const option = {
      color: colorList,
      legend: {
        top: "top",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "0%",
        top: "14%",
        containLabel: true,
      },

      xAxis: {
        type: "category",
        data: xAxis[0].data,
        axisLabel: {
          interval: 0,
          rotate: 60,
        },
      },

      yAxis: {
        type: "value",
        name: "",
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
          },
        },
      },

      series: series.map((item) => ({
        ...item,
      })),
    };
    return option;
  };
  const getOption1 = (data) => {
    const { series, yAxis } = data;
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        top: "top",
      },

      grid: {
        left: "3%",
        right: "4%",
        bottom: "0%",
        top: "10%",
        containLabel: true,
      },

      xAxis: {
        splitLine: {
          show: true,
          lineStyle: {
            type: "linner",
          },
        },
        axisTick: {
          show: false,
        },
        nameTextStyle: {
          fontSize: 1,
        },
      },
      yAxis: {
        type: "category",
        axisTick: {
          show: false,
        },
        data: yAxis[0].data,
      },
      series: series.map((item) => ({
        ...item,
      })),
    };
    return option;
  };
  return (
    <div className="home-right">
      <Card style={{ marginBottom: "25px", height: "14%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <IconFont
            name="yunshangchuan_o"
            size={76}
            color="#00C7FF"
            style={{ fontWeight: "bold" }}
          ></IconFont>
          <Lstatistic
            value={countData?.interfaceNum}
            valueStyle={{
              color: "#FF6200",
              fontSize: "36px",
            }}
            title="数据接口"
            suffix={<span style={{ fontSize: "12px", color: "#000" }}>个</span>}
          ></Lstatistic>
          <Lstatistic
            value={countData?.interfaceInvokeNum}
            valueStyle={{
              fontSize: "36px",
            }}
            title="累计调用"
            suffix={<span style={{ fontSize: "12px", color: "#000" }}>次</span>}
          ></Lstatistic>
        </div>
      </Card>

      <Card
        style={{ marginBottom: "25px", height: "34%" }}
        title="每月数据调用统计"
      >
        {chartdata && (
          <ReactECharts
            option={chartdata}
            lazyUpdate={true}
            theme={"theme_name"}
            style={{ height: "200px" }}
            ref={chartRef}
            notMerge={true}
            // showLoading={loading}
          />
        )}
      </Card>
      <Card
        title="数据调用TOP10"
        style={{
          height: "49%",
        }}
      >
        {chartdata1 && (
          <ReactECharts
            option={chartdata1}
            lazyUpdate={true}
            theme={"theme_name"}
            style={{ height: "200px" }}
            notMerge={true}
            // showLoading={loading}
          />
        )}
      </Card>
    </div>
  );
}

export default Right;
