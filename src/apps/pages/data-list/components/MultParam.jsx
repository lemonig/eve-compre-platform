import React, { useState, useEffect, useRef } from "react";
import { Select, Button, Form, Spin, Checkbox } from "antd";
import LtimePicker from "@Components/LtimePicker";
import {
  searchMeta,
  multiFactorChart,
  chartEvaluateIndex,
} from "@Api/data-list.js";
import dayjs from "dayjs";
import { formatePickTime, formPickTime } from "@Utils/util";
import "./index.less";

import ReactECharts from "echarts-for-react";
import { validateQuery } from "@Utils/valid.js";

function MultParam({ menuMsg, stationMsg, metaData, evaluteList }) {
  const [searchForm] = Form.useForm();
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
    if (evaluteList.length) {
      let filed = [];
      evaluteList.forEach((item, idx) => {
        if (idx < 10) {
          filed.push(item.value);
        }
      });
      searchForm.setFieldsValue({
        showFieldList: filed,
      });
      initFormVal();
    }
  }, [evaluteList]);

  const initFormVal = () => {
    if (metaData.dataSource.length) {
      searchForm.setFieldsValue({
        dataSource: metaData.dataSource[0].value,
        time: formPickTime(metaData.computeDataLevel[0].value),

        multiY: false,
      });
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

    let params = {
      ...values,
      beginTime: values.startTime,
      endTime: values.endTime,
      timeType: values.time.type,
      dataSource: values.dataSource,
      stationId: stationMsg.key,
      compareList: values.compareList ? [values.compareList] : undefined,
    };
    let { data } = await multiFactorChart(params);
    if (data.series.length) {
      let res = getOption(data);
      setChartdata({ ...res });
    }

    setLoading(false);
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
        top: "10%",
        containLabel: true,
      },
      legend: {
        ...legend,
        top: 0,
      },
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          let html = `<div>${params[0].axisValue}</div>`;
          params.map((item) => {
            if (item.value || item.value === 0) {
              html += `<div>${item.marker} ${item.seriesName}：${item.value} ${item.data.unit}</div>`;
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

  const chartLegendSelected = (params) => {
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
          onFinish={getPageData}
          initialValues={{
            dataSource: metaData.dataSource[0].value,
            time: formPickTime(metaData.computeDataLevel[0].value),
          }}
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
            <LtimePicker options={metaData?.computeDataLevel} />
          </Form.Item>
          <Form.Item label="" name="showFieldList">
            <Select
              style={{ width: 120 }}
              options={[...evaluteList]}
              placeholder="请选择"
              allowClear
              mode="multiple"
              maxTagCount="responsive"
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
              // lazyUpdate={true}
              theme={"theme_name"}
              onChartReady={onChartReadyCallback}
              style={{ width: "100%", height: "500px" }}
              onEvents={EventsDict}
              ref={chartRef}
              showLoading={loading}
              // opts={{ renderer: "svg" }}
              notMerge={true}
            />
          </Spin>
        </>
      ) : null}
    </div>
  );
}

export default MultParam;
