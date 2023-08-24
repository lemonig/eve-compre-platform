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
import ReactECharts from "echarts-for-react";
import { formatePickTime } from "@Utils/util";
import "./index.less";

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

function ChartModel({
  open,
  closeModal,
  station = {
    name: {},
    time: {},
  },
  factor,
  timeType,
}) {
  const handleOk = async () => {};
  const [loading, setLoading] = useState(false);
  const [chartdata, setChartdata] = useState(null);

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
    if (!factor.id) {
      return;
    }
    getPageData();
  }, [JSON.stringify(factor)]);

  const getPageData = async () => {
    setLoading(true);

    let params = {
      beginTime: formatePickTime(
        timeType,
        dayjs(station.time.value).subtract(7, "days")
      ),
      endTime: formatePickTime(timeType, dayjs(station.time.value)),
      timeType: timeType,
      dataSource: "1",
      stationId: station.name.id,
      showFieldList: [factor.id],
    };
    let { data, success, message } = await oneFactorChart(params);
    let res = getOption(data);
    setChartdata({ ...res });
    setLoading(false);
  };

  const getOption = ({ legend, series, xAxis, title, extraData }) => {
    let xData = xAxis[0].data;

    const option = {
      color: colorList,
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "20%",
        containLabel: true,
      },
      legend: legend,
      tooltip: {
        trigger: "axis",
        formatter: function (params, ticket) {
          let html = `<div>${params[0].axisValue}</div>`;
          let unit = extraData[0].unit;
          params.map((item) => {
            if (item.value || item.value === 0) {
              html += `<div>${item.marker} ${item.seriesName}：${item.value} ${
                unit ?? ""
              }</div>`;
            }
          });
          return html;
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
            name: `${station.name.value}-${title.text}`,
          },
          dataView: {
            show: true,
            title: "数据视图",
            lang: ["数据视图", "关闭", "刷新"],
          },
          magicType: {
            show: true,
            type: ["line", "bar"],
            title: ["折线图", "柱状图"],
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
      series: series.map((item) => {
        delete item.xAxisIndex;
        return item;
      }),
    };
    return option;
  };

  return (
    <div>
      <Modal
        title={station.name.value}
        open={open}
        onOk={handleOk}
        onCancel={() => closeModal(false)}
        maskClosable={false}
        confirmLoading={loading}
        footer={null}
        width={1200}
      >
        {chartdata ? (
          <>
            <div className="trendChart_title">
              {chartdata?.series[0].name}变化趋势图
            </div>
            {/* <Spin spinning={loading}> */}
            <ReactECharts
              option={chartdata}
              // lazyUpdate={true}
              theme={"theme_name"}
              style={{ height: "500px" }}
              ref={chartRef}
              notMerge={true}
              showLoading={loading}
            />
            {/* </Spin> */}
          </>
        ) : null}
      </Modal>
    </div>
  );
}

export default ChartModel;
