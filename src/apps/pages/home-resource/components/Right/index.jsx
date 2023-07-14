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

function Right() {
  const [chartdata, setChartdata] = useState(null);
  const [chartdata1, setChartdata1] = useState(null);
  const [data, setData] = useState(null);

  const [pie, setPie] = useState([]);
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
      let { data } = await chartApiLogTop();
      setData(data);
      setChartdata1(getOption1(data));
    };
    if (type) {
      getcount();
    }
  }, [type]);
  useEffect(() => {
    const getChartData = async () => {
      let { data } = await chartApiLog();
      setPie(data);
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
    console.log(val);
    setType(val);
  };

  const getOption = (data) => {
    let { xAxis, yAxis, series } = data;
    const option = {
      color: colorList,
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
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      // legend: {
      //   data: ['2011年', '2012年']
      // },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "0%",
        top: 0,
        containLabel: true,
      },

      xAxis: {
        // type: 'none',
        splitLine: {
          show: true,
          lineStyle: {
            type: "linner",
          },
        },
        axisLine: {
          //x轴颜色
          lineStyle: {
            color: "#fff",
          },
        },
        axisTick: {
          show: false,
        },
        nameTextStyle: {
          color: "#000",
          fontSize: 1,
        },
        // boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: "category",
        axisTick: {
          show: false,
        },
        data: yAxis[0].data,
        axisLine: {
          //x轴颜色
          lineStyle: {},
        },
      },
      series: [
        {
          // name: 'wu',
          type: "bar",
          data: series[0].data,
          itemStyle: {
            normal: {
              color: function (param) {
                return colorList[param.dataIndex];
              },
            },
          },
        },
      ],
    };
    return option;
  };
  return (
    <div className="home-left">
      <Card style={{ marginBottom: "25px" }}>
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
            value={1}
            valueStyle={{
              color: "#FF6200",
              fontSize: "36px",
            }}
            title="数据接口"
            suffix={<span style={{ fontSize: "12px", color: "#000" }}>个</span>}
          ></Lstatistic>
          <Lstatistic
            value={1}
            valueStyle={{
              fontSize: "36px",
            }}
            title="累计调用"
            suffix={<span style={{ fontSize: "12px", color: "#000" }}>个</span>}
          ></Lstatistic>
        </div>
      </Card>

      <Card style={{ marginBottom: "25px" }} title="每月数据调用统计">
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
