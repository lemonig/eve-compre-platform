import React, { useState, useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";

function ChartMul({
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

  const drawChart = ({ series, legend, xData, toolbox }) => {
    const tooltip = {
      trigger: "axis",
      formatter: function (params) {
        let html = `<div>${params[0].axisValue}</div>`;
        params.map((item) => {
          // if (item.value || item.value === 0) {
          html += `<div>${item.marker} ${item.seriesName}：${
            item.value ? item.value : "--"
          } ${item.data.unit ? item.data.unit : ""}</div>`;
          // }
        });
        return html;
      },
    };
    let legendSelected = {};
    // Y轴
    let yAxisData = [];
    series.map((item, index) => {
      //单独处理Yindex
      item.color = colorList[index];
      item.yAxisIndex = index;
      item.color = colorList[index];
      let obj = {
        name: item.name,
        type: "value",
        show: true,
        splitNumber: 6,
        position: index % 2 == 0 ? "right" : "left",
        offset:
          (index + 1) % 2 == 0
            ? ((index + 1) / 2 - 1) * 100
            : ((index + 1) / 2 - 0.5) * 100,
        axisLabel: {
          formatter: function (value) {
            return value.toFixed(2);
          },
          color: item.color,
        },
        axisLine: {
          show: true,

          lineStyle: {
            color: item.color,
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
          },
        },
        nameTextStyle: {
          fontSize: "14px",
        },
      };
      yAxisData.push(obj);
    });

    let option = {
      legend: {
        data: legend,
        selected: legendSelected,
      },

      grid: {
        top: "15%",
        left: "15%",
        right: "15%",
        bottom: "0%",
        containLabel: true,
      },
      toolbox: toolbox,
      tooltip: tooltip,
      xAxis: {
        type: "category",
        data: xData,
        axisLine: {
          //x轴颜色

          interval: 100000,
          showMinLabel: true,
          showMaxLabel: true,
        },
      },
      yAxis: yAxisData,
      series: series,
    };
    // this.chartLine.on("legendselectchanged", (params) => {
    //   option.legend.selected = params.selected;
    //   option.yAxis.map((i) => {
    //     {
    //       let name = i.name;
    //       if (!params.selected[name]) {
    //         i.show = false;
    //       } else {
    //         i.show = true;
    //       }
    //     }
    //   });
    //   this.chartLine.setOption(option, true);
    // });
    setChartOption(option);
  };
  return (
    chartOption && (
      <ReactECharts
        option={chartOption}
        // lazyUpdate={true}
        theme={"theme_name"}
        style={{ height: "500px" }}
        ref={chartRef}
        notMerge={true}
        showLoading={loading}
      />
    )
  );
}

export default ChartMul;
