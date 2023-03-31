import React, { useState, useEffect } from "react";
import {
  Select,
  Button,
  Table,
  Form,
  Tooltip,
  PageHeader,
  Statistic,
  Modal,
  message,
  Space,
  Spin,
  Radio,
  Checkbox,
} from "antd";
import LtimePicker from "@Components/LtimePicker";
import LcheckBox from "@Components/LcheckBox";
import {
  queryStation,
  searchMeta,
  multiFactorChart,
  chartEvaluateIndex,
} from "@Api/data-list.js";
import dayjs from "dayjs";
import { formatePickTime } from "@Utils/util";
import "./index.less";
import CompareTime from "./CompareTime";

import ReactECharts from "echarts-for-react";

function MultParam({ menuMsg, stationMsg, facList }) {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [metaData, setMetaData] = useState({
    computeDataLevel: [],
    dataSource: [],
    stationField: [],
    evaluateIndex: [],
  });
  const [compareVal, setCompareVal] = useState(null);
  const [timeType, setTimeType] = useState("");
  const [chartdata, setChartdata] = useState(null);
  const [evaluteList, setEvaluteList] = useState([]);

  useEffect(() => {
    if ((menuMsg.query, stationMsg.key)) {
      console.log("menu - change");
      getMetaData();
    }
  }, [menuMsg.query]);

  useEffect(() => {
    const getEvaluteData = async () => {
      let { data, success } = await chartEvaluateIndex({
        id: stationMsg.key,
      });
      if (success) {
        setEvaluteList(data);
      }
    };
    getEvaluteData();
  }, [stationMsg.key]);

  const getMetaData = async () => {
    let { data, success } = await searchMeta({
      id: menuMsg.query,
    });
    if (success) {
      console.log(facList);
      setMetaData(data);
      searchForm.setFieldsValue({
        dataSource: data.dataSource[0].value,
        time: {
          startTime: dayjs().subtract(1, "month"),
          endTime: dayjs(),
          type: data.computeDataLevel[0].value,
        },
      });
      setTimeType(data.computeDataLevel[0].value);
      getPageData();
    }
  };

  const getPageData = async () => {
    let values = searchForm.getFieldsValue();
    console.log(values);
    if (!values.dataSource || !values.time) {
      return;
    }
    setLoading(true);
    values.startTime = formatePickTime(values.time.type, values.time.startTime);
    values.endTime = formatePickTime(values.time.type, values.time.endTime);

    let params = {
      ...values,
      beginTime: values.startTime,
      endTime: values.endTime,
      timeType: values.time.type,
      dataSource: values.dataSource,
      stationId: stationMsg.key,
      showFieldList: facList.map((item) => item.value),
      compareList: values.compareList ? [values.compareList] : undefined,
    };
    let { data } = await multiFactorChart(params);
    setLoading(false);
    let isMultiY = values.multiY;

    let res = getOption(data);
    // console.log(res);
    setChartdata({ ...res });
  };

  const search = () => {
    getPageData();
  };

  const getOption = ({ extraData, legend, series, xAxis, title, yAxis }) => {
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

    let list = series.map((item, idx) => {
      let unit = extraData[idx]["unit"];
      return {
        ...item,
        data: item.data.map((jtem) => {
          return {
            value: jtem,
            unit,
          };
        }),
      };
    });
    const option = {
      color: colorList,
      grid: {
        width: "auto",
        left: "8%",
        right: "8%",
        bottom: "0%",
        top: "20%",
        containLabel: true,
      },
      legend: legend,
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          let html = `<div>${params[0].axisValue}</div>`;
          params.forEach((item) => {
            if (typeof item.value === "number") {
              html += `<div>${item.marker} ${item.seriesName}：${item.value} ${
                item.data.unit ? item.data.unit : ""
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
            name: `${stationMsg.title}-${title.text}`,
          },
          dataView: {
            show: true,
            title: "数据视图",
            lang: ["数据视图", "关闭", "刷新"],
          },
          magicType: {
            show: true,
            type: ["line", "bar", "stack"],
            title: ["折线图", "柱状图", "堆叠"],
          },
        },
      },

      xAxis: xAxis,
      yAxis: yAxis,
      series: list,
    };
    return option;
  };

  const onChartReadyCallback = () => {};

  const onCompareChange = (e) => {
    setCompareVal(e);
  };
  const onTimepickerChange = (e) => {
    setTimeType(e.type);
  };
  const chartLegendSelected = (params) => {
    console.log(params);
    chartdata.legend.selected = params.selected;
    let values = searchForm.getFieldsValue();
    if (!values.multiY)
      chartdata.yAxis.forEach((i) => (i.show = params.selected[i.name]));
    setChartdata({ ...chartdata });
  };
  const EventsDict = {
    legendselectchanged: chartLegendSelected,
  };

  return (
    <div>
      <div className="search">
        <Form
          layout="inline"
          form={searchForm}
          onFinish={search}
          initialValues={{}}
          colon={false}
        >
          <Form.Item label="" name="dataSource">
            <Select
              style={{ width: 120 }}
              placeholder="数据来源"
              options={metaData?.dataSource}
            />
          </Form.Item>
          <Form.Item label="" name="time">
            <LtimePicker
              options={metaData?.computeDataLevel}
              onChange={onTimepickerChange}
            />
          </Form.Item>

          <Form.Item label="同轴" name="multiY" valuePropName="checked">
            <Checkbox></Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
      </div>
      {chartdata ? (
        <>
          <div className="trendChart_title">多参数变化趋势分析图</div>
          <Spin spinning={loading}>
            <ReactECharts
              option={chartdata}
              lazyUpdate={true}
              theme={"theme_name"}
              onChartReady={onChartReadyCallback}
              style={{ height: "500px" }}
              onEvents={EventsDict}
            />
          </Spin>
        </>
      ) : null}
    </div>
  );
}

export default MultParam;
