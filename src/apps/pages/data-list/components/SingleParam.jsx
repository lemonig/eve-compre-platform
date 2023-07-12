import React, { useState, useEffect, useRef } from "react";
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
  oneFactorChart,
  chartEvaluateIndex,
} from "@Api/data-list.js";
import dayjs from "dayjs";
import { formatePickTime, formPickTime } from "@Utils/util";
import "./index.less";
import CompareTime from "./CompareTime";

import ReactECharts from "echarts-for-react";
import { validateQuery } from "@Utils/valid.js";

function SingleParam({ menuMsg, stationMsg, metaData, evaluteList }) {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [compareVal, setCompareVal] = useState(null);
  const [timeType, setTimeType] = useState("");
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
    if (evaluteList.length) {
      initFormVal();
    }
  }, [evaluteList]);

  const initFormVal = () => {
    if (metaData.dataSource.length) {
      searchForm.setFieldsValue({
        dataSource: metaData.dataSource[0].value,
        time: formPickTime(metaData.computeDataLevel[0].value),

        showFieldList: evaluteList[0].value,
        compareList: undefined,
      });
      setCompareVal(null);
    }
    getPageData(); //站点切换后 因子切换 查询条件置空 刷新
  };

  const getPageData = async () => {
    let values = searchForm.getFieldsValue();
    if (
      !validateQuery(
        values.time.startTime,
        values.time.endTime,
        values.time.type
      )
    ) {
      return;
    }
    if (!values.dataSource || !values.time) {
      return;
    }
    setLoading(true);
    values.startTime = formatePickTime(values.time.type, values.time.startTime);
    values.endTime = formatePickTime(values.time.type, values.time.endTime);
    if (values.compareTime?.startTime) {
      values.compareBeginTime = formatePickTime(
        values.time.type,
        values.compareTime.startTime
      );
    }
    if (values.compareTime?.endTime) {
      values.compareEndTime = formatePickTime(
        values.time.type,
        values.compareTime.endTime
      );
    }
    let params = {
      ...values,
      beginTime: values.startTime,
      endTime: values.endTime,
      timeType: values.time.type,
      dataSource: values.dataSource,
      stationId: stationMsg.key,
      showFieldList: [values.showFieldList],
      compareList: values.compareList ? [values.compareList] : undefined,
    };
    let { data, success, message } = await oneFactorChart(params);
    let res = getOption(data);
    setChartdata({ ...res });
    setLoading(false);
  };

  const search = () => {
    getPageData();
  };

  const getOption = ({ legend, series, xAxis, title, extraData }) => {
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
            name: `${stationMsg.title}-${title.text}`,
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

  const onChartReadyCallback = () => {};

  const onCompareChange = (e) => {
    setCompareVal(e);
  };
  const onTimepickerChange = (e) => {
    setTimeType(e.type);
  };

  return (
    <div>
      <div className="search">
        <Form
          layout="inline"
          form={searchForm}
          onFinish={search}
          initialValues={{
            dataSource: metaData.dataSource[0].value,
            time: formPickTime(metaData.computeDataLevel[0].value),
            showFieldList: evaluteList[0].value,
          }}
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
          <Form.Item label="" name="showFieldList">
            <Select
              style={{ width: 120 }}
              options={[...evaluteList]}
              placeholder="请选择"
            />
          </Form.Item>
          <Form.Item label="" name="compareList">
            <LcheckBox
              options={[
                {
                  label: "环比",
                  value: "2",
                },
                {
                  label: "同比",
                  value: "1",
                },
                {
                  label: "自定义",
                  value: "3",
                },
              ]}
              onChange={onCompareChange}
            />
          </Form.Item>
          {compareVal === "3" ? (
            <Form.Item label="" name="compareTime">
              <CompareTime type={timeType} />
            </Form.Item>
          ) : null}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
      </div>
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
            onChartReady={onChartReadyCallback}
            style={{ height: "500px" }}
            ref={chartRef}
            notMerge={true}
            showLoading={loading}
          />
          {/* </Spin> */}
        </>
      ) : null}
    </div>
  );
}

export default SingleParam;
// option （必需，对象）：echarts 选项配置，可以查看https://echarts.apache.org/option.html#title。
// notMerge （可选，对象）：不合并数据，默认为false
// lazyUpdate （可选，对象）：延迟更新数据，默认为false
// style （可选，对象）：在style的echarts股利。object, 默认为 {height: ‘300px’}
// className （可选，字符串）：在class的echarts股利。您可以通过类名设置图表的 css 样式。
// theme （可选，字符串）：该themeecharts的。string，应该registerTheme在使用之前
// loadingOption 可选，对象）：
// showLoading （可选，布尔值，默认值：false）
// onEvents （可选，数组（字符串=>函数））
// opts （可选，对象）
