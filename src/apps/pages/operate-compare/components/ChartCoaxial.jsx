import React, { useState, useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";

function ChartCoaxial({ data, loading, originData, compType, colorList }) {
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
    if (originData.relation) {
      if (compType === "sequence") {
        let { series, legend, xData } = handleSeriedTime();
        drawChart({ series, legend, xData });
      } else if (compType === "avg") {
        let { series, legend, xData } = handleSeriedAvg();
        drawChart({ series, legend, xData });
      }
    }
  }, [data]);

  const handleSeriedTime = () => {
    let legend = [];
    let series = [];
    // 组成series
    for (let i in originData.relation) {
      let factorAll = [
        ...originData.relation[i].factor,
        ...originData.relation[i].evaluateIndex,
      ];
      factorAll.forEach((ele) => {
        legend.push(originData.relation[i].name + "-" + ele.label);
        series.push({
          sid: i,
          fkey: ele.value,
          name: originData.relation[i].name + "-" + ele.label,
          type: "line",
          connectNulls: true,
          data: [],
        });
      });
    }
    // 取值
    data.forEach((item) => {
      series.forEach((jtem) => {
        if (item.station_id == jtem.sid) {
          jtem.data.push({
            unit: jtem.unit,
            value: item[jtem.fkey],
          });
        }
      });
    });

    return {
      series,
      legend,
      xData: originData.dateList,
    };
  };

  const handleSeriedAvg = () => {
    let legend = [];
    let series = [];
    let xData = [];
    // 组成series
    var factorAll = [
      ...originData.avgRelation.factor,
      ...originData.avgRelation.evaluateIndex,
    ];

    factorAll.forEach((ele) => {
      legend.push(ele.label);
      series.push({
        fkey: ele.value,
        name: ele.label,
        type: "line",
        connectNulls: true,
        data: [],
      });
    });
    data.forEach((item) => {
      xData.push(item.name);
      series.forEach((jtem) => {
        jtem.data.push({
          unit: jtem.unit,
          value: item[jtem.fkey],
        });
      });
    });

    return {
      series,
      legend,
      xData,
    };
  };

  const drawChart = ({ series, legend, xData }) => {
    series.map((item, idx) => {
      item.itemStyle = {
        color: colorList[idx],
      };
      item.lineStyle = {
        color: colorList[idx],
      };
    });
    console.log(series);
    console.log(legend);

    console.log(originData.dateList);
    let option = {
      legend: {
        // textStyle: {
        //   color: "#fff",
        // },
        data: legend,
      },
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          let html = `<div>${params[0].axisValue}</div>`;
          params.map((item) => {
            html += `<div>${item.marker} ${item.seriesName}：${
              item.value ? item.value : "--"
            } ${item.data.unit ? item.data.unit : ""}</div>`;
          });
          return html;
        },
      },

      grid: {
        left: "10%",
        right: "10%",
        bottom: "0%",
        containLabel: true,
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: "none",
            title: {
              zoom: "缩放",
              back: "还原",
            },
          },
          saveAsImage: {
            name: `多站点多参数分析-${dayjs(new Date()).format("YYYYMMDD")}`,
            backgroundColor: "#040e20",
            title: "保存",
          },
        },
      },
      xAxis: {
        type: "category",
        data: xData,
        axisLine: {
          //x轴颜色
          // lineStyle: {
          //   color: "#fff",
          // },
          // interval: 100000,
          // showMinLabel: true,
          // showMaxLabel: true,
        },
      },
      yAxis: {
        type: "value",
        // axisLine: {
        //   lineStyle: {
        //     color: "#fff",
        //   },
        // },
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

export default ChartCoaxial;
