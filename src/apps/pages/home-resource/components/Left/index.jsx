import React, { useEffect, useState, useRef } from "react";
import { Col, Row, Space, Table, Radio } from "antd";
// api
import {
  chartApiLogTop,
  chartApiLog,
  chartDataTop,
  table as tableApi,
  chartData as chartDataApi,
  pie as pieApi,
  count as countApi,
} from "@Api/dashboard";
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
const colum1 = [
  {
    title: "资源主题",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "资源目录（个）",
    dataIndex: "typeStationNum",
    key: "typeStationNum",
  },
];
const colum2 = [
  {
    title: "资源主题",
    dataIndex: "typeTopicName",
    key: "typeTopicName",
  },
  {
    title: "资源目录",
    dataIndex: "name",
    key: "name",
  },
];
const columsNormal = [
  {
    title: "站点（个）",
    dataIndex: "stationNum",
    key: "stationNum",
  },
  {
    title: "活跃站点（个）",
    dataIndex: "activeStationNum",
    key: "activeStationNum",
  },
  {
    title: "数据总量（万条）",
    dataIndex: "dataNum",
    key: "dataNum",
  },
];

function Left() {
  const [chartdata, setChartdata] = useState(null);
  const [data, setData] = useState(null);
  const [table, setTable] = useState({
    topicType: [],
    typeStation: [],
  });
  const [pie, setPie] = useState([]);
  const [type, setType] = useState("topicType"); // topicType typeStation
  const [type1, setType1] = useState("topicTypeList"); // topicTypeList typeStationList
  const [colums, setColums] = useState(colum1);
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
      let { data } = await countApi();
      setData(data);
    };
    getcount();
  }, []);
  useEffect(() => {
    const getPie = async () => {
      let { data } = await pieApi();
      setPie(data);
      setChartdata(getOption(data));
    };
    getPie();
  }, []);
  useEffect(() => {
    const gettable = async () => {
      let { data } = await tableApi();
      console.log(data);
      setTable(data);
    };
    gettable();
  }, []);

  const getOption = (data) => {
    const option = {
      color: colorList,
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c}个",
      },
      legend: {
        orient: "vertical",
        right: "right",
        top: "middle",
        itemWidth: 10,
        itemHeight: 10,
        itemStyle: {
          borderRadius: "50%", // 小圆点型的图例形状
        },
        icon: "circle",
      },
      series: [
        {
          name: "",
          type: "pie",
          radius: ["45%", "70%"],
          label: false,
          avoidLabelOverlap: false,
          emphasis: {
            label: {
              show: false,
            },
          },
          labelLine: {
            show: false,
          },
          data: data[type].series[0].data,
        },
      ],
    };
    return option;
  };

  const onTypeChange = (e) => {
    setType(e.target.value);
  };
  const onTypeChange1 = (e) => {
    setType1(e.target.value);
    if (e.target.value === "topicTypeList") {
      setColums(colum1);
    } else {
      setColums(colum2);
    }
  };

  useEffect(() => {});

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
            name="dashuju"
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
            title="数据资源主题"
            suffix={<span style={{ fontSize: "12px", color: "#000" }}>个</span>}
          ></Lstatistic>
          <Lstatistic
            value={1}
            valueStyle={{
              color: "#FF6200",
              fontSize: "36px",
            }}
            title="数据资源目录"
            suffix={<span style={{ fontSize: "12px", color: "#000" }}>个</span>}
          ></Lstatistic>
        </div>
      </Card>

      <Card
        style={{ marginBottom: "25px" }}
        title="数据资源分布"
        extra={
          <Radio.Group
            value={type}
            buttonStyle="solid"
            size="small"
            onChange={onTypeChange}
          >
            <Radio.Button value="topicType">资源主题</Radio.Button>
            <Radio.Button value="typeStation">资源目录</Radio.Button>
          </Radio.Group>
        }
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
        title="数据资源分布"
        extra={
          <Radio.Group
            value={type1}
            buttonStyle="solid"
            size="small"
            onChange={onTypeChange1}
          >
            <Radio.Button value="topicTypeList">资源主题</Radio.Button>
            <Radio.Button value="typeStationList">资源目录</Radio.Button>
          </Radio.Group>
        }
      >
        <Table
          size="small"
          dataSource={table[type1]}
          columns={[...colums, ...columsNormal]}
        />
      </Card>
    </div>
  );
}

export default Left;
