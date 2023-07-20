import React, { useEffect, useState, useRef } from "react";
import { Col, Row, Space, Table, Radio, Select } from "antd";
// api
import {
  chartApiLogTop,
  chartApiLog,
  chartDataTop as chartDataTopApi,
  table as tableApi,
  chartData as chartDataApi,
  pie as pieApi,
  count as countApi,
} from "@Api/dashboard";
import { stationPage as stationMetaPage } from "@Api/set_meta_station.js";

import Card from "../Card";
import IconFont from "@Components/IconFont";
import Lstatistic from "@Components/Lstatistic";
import ReactECharts from "echarts-for-react";
import { colorList } from "../util";

function Middle({ countData }) {
  const [chartdata, setChartdata] = useState(null);
  const [chartdata1, setChartdata1] = useState(null);

  const chartRef = useRef(null);
  const [stationTypeList, setStationTypeList] = useState([]);
  const [type, setType] = useState("");

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
      let { data } = await chartDataTopApi({
        stationType: type,
      });
      setChartdata1(getOption1(data));
    };
    if (type) {
      getcount();
    }
  }, [type]);
  useEffect(() => {
    const getChartData = async () => {
      let { data } = await chartDataApi();
      setChartdata(getOption(data));
    };
    getChartData();
  }, []);

  // 获取站点类型
  useEffect(() => {
    const getStationTpeData = async () => {
      let { data } = await stationMetaPage();
      setStationTypeList(data);
      setType(data[0].id);
    };
    getStationTpeData();
  }, []);

  const onTypeChange = (val) => {
    setType(val);
  };

  const getOption = (data) => {
    let { xAxis, yAxis, series } = data;
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
        top: "18%",
        containLabel: true,
      },

      xAxis: [
        {
          type: "category",
          data: xAxis[0].data,
          axisLine: {
            //x轴颜色
            lineStyle: {
              // color: "#fff",
            },
          },
          axisLabel: {
            interval: 0,
            rotate: 60,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "数据增量（万条）",

          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
            },
          },
        },
        {
          type: "value",
          name: "数据总量（万条）",

          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
            },
          },
        },
      ],
      series: series.map((item) => ({
        ...item,
        // barMaxWidth: "30",
      })),
    };
    return option;
  };
  const getOption1 = (data) => {
    const { series, yAxis } = data;
    const option = {
      color: colorList,
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
        top: "15%",
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
          color: "#000",
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
    <div className="home-middle">
      <Card style={{ marginBottom: "25px", height: "34%" }} title="数据接入">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "end",
            padding: "0 10%",
          }}
        >
          <Lstatistic
            value={countData?.dataNum}
            valueStyle={{
              fontSize: "28px",
            }}
            title="数据总量"
            suffix={
              <span style={{ fontSize: "12px", color: "#000" }}>万条</span>
            }
            style={{
              flexBasis: "70%",
            }}
          ></Lstatistic>

          <Lstatistic
            value={countData?.dataYearAddNum}
            valueStyle={{
              fontSize: "12px",
            }}
            title="本年接入"
            suffix={
              <span style={{ fontSize: "12px", color: "#000" }}>万条</span>
            }
          ></Lstatistic>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "end",
            padding: "0 50px",
          }}
        >
          <Lstatistic
            value={countData?.stationNum}
            valueStyle={{
              fontSize: "28px",
            }}
            title="站点总量"
            suffix={<span style={{ fontSize: "12px", color: "#000" }}>个</span>}
            style={{
              flexBasis: "70%",
            }}
          ></Lstatistic>

          <Lstatistic
            value={countData?.stationYearAddNum}
            valueStyle={{
              fontSize: "12px",
            }}
            title="本年接入"
            suffix={<span style={{ fontSize: "12px", color: "#000" }}>个</span>}
          ></Lstatistic>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "end",
            padding: "0 50px",
          }}
        >
          <Lstatistic
            value={countData?.cameraNum}
            valueStyle={{
              fontSize: "28px",
            }}
            title="视频总量"
            suffix={<span style={{ fontSize: "12px", color: "#000" }}>个</span>}
            style={{
              flexBasis: "70%",
            }}
          ></Lstatistic>

          <Lstatistic
            value={countData?.cameraYearAddNum}
            valueStyle={{
              fontSize: "12px",
            }}
            title="本年接入"
            suffix={<span style={{ fontSize: "12px", color: "#000" }}>个</span>}
          ></Lstatistic>
        </div>
      </Card>
      <Card
        style={{ marginBottom: "25px", height: "34%" }}
        title="每月数据增长趋势"
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
        style={{ height: "29%" }}
        title="本月数据增长TOP5"
        extra={
          <Select
            options={stationTypeList}
            placeholder="请选择"
            fieldNames={{
              label: "name",
              value: "id",
            }}
            value={type}
            style={{ width: "120px" }}
            onChange={onTypeChange}
          />
        }
      >
        {chartdata1 && (
          <ReactECharts
            option={chartdata1}
            lazyUpdate={true}
            theme={"theme_name"}
            style={{ height: "150px" }}
            notMerge={true}
            // showLoading={loading}
          />
        )}
      </Card>
    </div>
  );
}

export default Middle;
