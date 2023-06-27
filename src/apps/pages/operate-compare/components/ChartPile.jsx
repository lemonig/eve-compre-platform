import React, { useState, useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";

function ChartPile({ data, loading, originData, compType, colorList }) {
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
    console.log(series);
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
          (idx == 0 ? 0.7 : 2)
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
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: "none",
            title: {
              zoom: "区域缩放",
              back: "区域还原",
            },
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

      tooltip: {
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
      },

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
