import React, { useEffect, useState, useRef } from "react";
import { Table, Radio } from "antd";
// api
import { table as tableApi, pie as pieApi } from "@Api/dashboard";
import Card from "../Card";
import IconFont from "@Components/IconFont";
import Lstatistic from "@Components/Lstatistic";
import ReactECharts from "echarts-for-react";
import { colorList } from "../util";

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

function Left({ countData } = {}) {
  const [chartdata, setChartdata] = useState(null);
  const [table, setTable] = useState({
    topicType: [],
    typeStation: [],
  });
  const [pie, setPie] = useState();
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
    const getPie = async () => {
      let { data } = await pieApi();
      setPie(data);
      setChartdata(getOption(data["topicType"]));
    };
    getPie();
  }, []);
  useEffect(() => {
    const gettable = async () => {
      let { data } = await tableApi();
      setTable(data);
    };
    gettable();
  }, []);

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

  useEffect(() => {
    if (pie) {
      setChartdata(getOption(pie[type]));
    }
  }, [type]);

  const getOption = (data) => {
    const sum = data.series[0].data.reduce(
      (accumulator, data) => accumulator + data.value,
      0
    );
    const option = {
      color: colorList,
      tooltip: {
        trigger: "item",
        formatter: "{b}:{d}%",
      },
      grid: {
        left: "0%",
        right: "4%",
        bottom: "0%",
        containLabel: false,
      },

      legend: {
        orient: "vertical",
        right: "10%",
        top: "middle",
        itemWidth: 10,
        itemHeight: 10,
        itemStyle: {
          borderRadius: "50%", // 小圆点型的图例形状
        },
        icon: "circle",
        formatter: function (name) {
          let singleData = data.series[0].data.filter(function (item) {
            return item.name === name;
          });
          return (
            name + "   " + ((singleData[0].value / sum) * 100).toFixed(2) + "%"
          );
        },
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
          left: "0%",
          right: "40%",
          data: data.series[0].data,
        },
      ],
    };
    return option;
  };

  return (
    <div className="home-left">
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
            name="dashuju"
            size={76}
            color="#00C7FF"
            style={{ fontWeight: "bold" }}
          ></IconFont>
          <Lstatistic
            value={countData?.typeTopicNum}
            valueStyle={{
              color: "#FF6200",
              fontSize: "36px",
            }}
            title="数据资源主题"
            suffix={<span style={{ fontSize: "12px", color: "#000" }}>个</span>}
          ></Lstatistic>
          <Lstatistic
            value={countData?.typeStationNum}
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
        style={{ marginBottom: "25px", height: "34%" }}
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
        title="数据资源统计"
        style={{ marginBottom: "25px", height: "49%" }}
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
