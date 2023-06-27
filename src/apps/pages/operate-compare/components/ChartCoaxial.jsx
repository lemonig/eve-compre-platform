import React, { useState, useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";

function ChartCoaxial({
  data,
  loading,
  originData,
  compType,
  colorList,
  chartPart,
} = {}) {
  const chartRef = useRef(null);
  const [chartOption, setChartOption] = useState();
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
    if (chartPart) {
      drawChart(JSON.parse(JSON.stringify(chartPart)));
    }
  }, [chartPart]);

  const drawChart = ({ series, legend, xData, toolbox, tooltip }) => {
    series.map((item, idx) => {
      item.itemStyle = {
        color: colorList[idx],
      };
      item.lineStyle = {
        color: colorList[idx],
      };
    });
    let option = {
      legend: {
        data: legend,
      },
      tooltip: tooltip,
      grid: {
        left: "10%",
        right: "10%",
        bottom: "0%",
        containLabel: true,
      },
      toolbox: toolbox,
      xAxis: {
        type: "category",
        data: xData,
      },
      yAxis: {
        type: "value",
        nameTextStyle: {
          fontSize: "14px",
        },
      },
      series: series,
    };

    setChartOption(option);
  };
  return (
    chartOption && (
      <ReactECharts
        option={chartOption}
        lazyUpdate={true}
        theme={"theme_name"}
        style={{ height: "500px" }}
        ref={chartRef}
        notMerge={true}
        showLoading={loading}
      />
    )
  );
}

export default ChartCoaxial;
