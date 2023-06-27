import React, { useState, useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";

function ChartPile({
  data,
  loading,
  originData,
  compType,
  colorList,
  chartPart,
}) {
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
    let grid = [];
    let xAxis = [];
    let yAxis = [];
    series.map((item, idx, arr) => {
      item.xAxisIndex = idx;
      item.yAxisIndex = idx;
      item.hoverAnimation = true;
      grid.push({
        left: "10%",
        right: "10%",
        top: `${
          idx * Math.ceil((100 - (arr.length - 1) * 2) / arr.length) +
          (idx == 0 ? 1 : 2)
        }%`,
        height: `${Math.floor((100 - (arr.length - 1) * 5) / arr.length)}%`,
      });
      xAxis.push({
        gridIndex: idx,
        type: "category",
        scale: true,
        axisLabel: {
          show: idx === arr.length - 1 ? true : false,
          fontSize: 10,
        },
        axisTick: {
          alignWithLabel: true,
        },
        splitLine: {
          show: false,
        },
        data: xData, //x轴时间的数据
      });

      yAxis.push({
        type: "value",
        name: item.name,
        nameLocation: "center",
        gridIndex: idx,
        nameGap: 50,
        nameTextStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        axisLabel: {
          fontSize: 12,
        },

        scale: false,
        boundaryGap: [0, "100%"],
        splitLine: {
          show: false,
        },
        splitNumber: 4,
      });
    });
    const option = {
      color: colorList, // 配置数据颜色
      grid: grid,
      toolbox: toolbox,
      tooltip: tooltip,
      legend: {
        show: true,
        x: "center",
        y: "0",
        data: legend,
        textStyle: {
          fontSize: 12,
        },
      },
      axisPointer: {
        link: { xAxisIndex: "all" },
      },
      xAxis: xAxis,
      yAxis: yAxis,
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: series.map((_, i) => i),
        },
      ],
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
        style={{ height: `${50 + chartOption.series.length * 150}px` }}
        ref={chartRef}
        notMerge={true}
        showLoading={loading}
      />
    )
  );
}

export default ChartPile;
