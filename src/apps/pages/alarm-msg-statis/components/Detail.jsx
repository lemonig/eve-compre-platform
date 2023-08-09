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
  PageHeader,
  DatePicker,
  Checkbox,
} from "antd";
import dayjs from "dayjs";

import {
  queryStation,
  searchMeta,
  oneFactorChart,
  chartEvaluateIndex,
} from "@Api/data-list.js";
import { logDayStat } from "@Api/alarm_statis.js";
import ReactECharts from "echarts-for-react";
import { formatePickTime } from "@Utils/util";

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

const lineSeries = [
  {
    type: 'line',
    name: "日质控未通过",
    key: 'ALM20220901',
    dataIndex: 'ALM20220901',
    data: []
  },
  {
    type: 'line',
    name: "电导率过低",
    key: 'ALM20220902',
    dataIndex: 'ALM20220902',
    data: []
  },
  {
    data: [],
    type: 'line',
    name: "零值",
    dataIndex: 'ALM20220903',
    key: 'ALM20220903',
  },
  {
    data: [],
    type: 'line',
    name: "负值",
    dataIndex: 'ALM20220904',
    key: 'ALM20220904',
  },
  {
    data: [],
    type: 'line',
    name: "连续值",
    key: 'ALM20220905',
    dataIndex: 'ALM20220905',
  },
  {
    data: [],
    type: 'line',
    name: "离群",
    key: 'ALM20220906',
    dataIndex: 'ALM20220906',
  },
  {
    data: [],
    type: 'line',
    name: "超限值",
    key: 'ALM20220907',
    dataIndex: 'ALM20220907',
  },
  {
    data: [],
    type: 'line',
    name: "疑似站点离线",
    key: 'ALM20220908',
    dataIndex: 'ALM20220908',
  },
  {
    data: [],
    type: 'line',
    name: "氨氮异常",
    key: 'ALM20220909',
    dataIndex: 'ALM20220909',
  },
  {
    data: [],
    type: 'line',
    name: "水质超标",
    key: 'ALM20220910',
    dataIndex: 'ALM20220910',
  },
  {
    data: [],
    type: 'line',
    name: "仪器故障",
    key: 'ALM20220911',
    dataIndex: 'ALM20220911',
  },
  {
    data: [],
    type: 'line',
    name: "空气质量超标",
    key: 'ALM20220912',
    dataIndex: 'ALM20220912',
  },
  {
    data: [],
    type: 'line',
    name: "PM2.5与PM10倒挂",
    key: 'ALM20220913',
    dataIndex: 'ALM20220913',
  },
];

function Detail({
  open,
  closeModal,
  searchData,
  tableRow
}) {
  console.log(tableRow);
  console.log(searchData);
  const handleOk = async () => { };
  const [loading, setLoading] = useState(false);
  const [chartdata, setChartdata] = useState(null);
  const [chartdata1, setChartdata1] = useState(null);

  const chartRef = useRef(null);
  const chartRef1 = useRef(null);
  useEffect(() => {
    const chart = chartRef.current && chartRef.current.getEchartsInstance();
    const chart1 = chartRef1.current && chartRef.current.getEchartsInstance();
    const handleResize = () => {
      chart && chart.resize();
      chart1 && chart1.resize();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [chartRef, chartRef1]);


  useEffect(() => {
    getPageData()
  }, [])

  const getPageData = async () => {
    setLoading(true);
    let params = JSON.parse(JSON.stringify(searchData))
    params.notificationBeginDate = dayjs(params.time[0]).format("YYYYMMDD");
    params.notificationEndDate = dayjs(params.time[1]).format("YYYYMMDD");
    params.topicType = [params.topicType]
    params.wechatGroupName = tableRow.wechatGroupName
    let { data, success, message } = await logDayStat(params);
    if (success) {
      let xData = data.map(item => item.datatime)
      let res = getOption({ data, xData });
      let res1 = getOption1({ data, xData });
      setChartdata(res);
      setChartdata1(res1);
    }

    setLoading(false);
  };

  // 柱状
  const getOption1 = ({ data, xData }) => {

    const option = {
      title: {
        text: '每日消息统计',
        left: 'center'
      },
      color: colorList,
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "20%",
        containLabel: true,
      },

      tooltip: {
        trigger: "axis",
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: "none",
            title: {
              zoom: "区域缩放",
              back: "区域还原",
            },
          },
          saveAsImage: {
            title: "保存为图片",
            name: `${tableRow.wechatGroupName}每日消息统计`,
          },

        },
      },

      xAxis: {
        type: "category",
        boundaryGap: false,
        data: xData,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: data.map((item) => item.count),
          type: 'bar'
        }
      ]
    };
    return option;
  };

  // 折线
  const getOption = ({ data, xData }) => {
    lineSeries.forEach(item => {
      data.forEach(jtem => {
        item.data.push(jtem[item.dataIndex])
      })
    })
    const option = {

      title: {
        text: '报警趋势统计',
        left: 'center',
      },
      color: colorList,
      legend: {
        top: "6%",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: "none",
            title: {
              zoom: "区域缩放",
              back: "区域还原",
            },
          },
          saveAsImage: {
            title: "保存为图片",
            name: `${tableRow.wechatGroupName}报警趋势统计`,
          },

        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },

      xAxis: {
        type: "category",
        data: xData,
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

      series: lineSeries,
    };
    return option;
  };

  return (
    <div>
      <Modal
        title={tableRow.wechatGroupName}
        open={open}
        onOk={handleOk}
        onCancel={() => closeModal(false)}
        maskClosable={false}
        confirmLoading={loading}
        footer={null}
        width={1200}
      >
        {chartdata1 ? (
          <>

            <ReactECharts
              option={chartdata1}
              lazyUpdate={true}
              theme={"theme_name"}
              style={{ height: "300px" }}
              ref={chartRef1}
              notMerge={true}
              showLoading={loading}
            />
          </>
        ) : null}

        {chartdata ? (
          <>
            <ReactECharts
              option={chartdata}
              lazyUpdate={true}
              theme={"theme_name"}
              style={{ height: "300px" }}
              ref={chartRef}
              notMerge={true}
              showLoading={loading}
            />
          </>
        ) : null}
      </Modal>
      <style jsx="true">
        {`
          .trendChart_title {
            text-align: center;
            line-height: 50px;
            background: #f1f3f5;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 20px;
            border-radius: 3px;
          }

        `}
      </style>
    </div>
  );
}

export default Detail;
