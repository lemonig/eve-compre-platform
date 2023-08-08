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
  Switch,
  Cascader,
  Checkbox,
  DatePicker
} from "antd";
// com
import Lbreadcrumb from "@Components/Lbreadcrumb";
import IconFont from "@Components/IconFont";
import dayjs from "dayjs";
import LtimePicker from "@Components/LtimePicker";
import { SettingOutlined, WarningFilled } from "@ant-design/icons";
import ReactECharts from "echarts-for-react";
// api

import { alarmStatis, alarmStatisexport } from "@Api/alarm_statis.js";
import { stationPage as stationMetaPage, topicList } from "@Api/user.js";

import { listRule } from "@Api/set_alarm.js";
import { allListFactor as listFactor } from "@Api/set_alarm_pub.js";

// util
import { formatePickTime } from "@Utils/util";
import { validateQuery } from "@Utils/valid.js";

const { RangePicker } = DatePicker;

const getFormCasData = (data = []) => {
  return data?.map((item) => {
    return item[item.length - 1];
  });
};



const pageSize = 10;

function AlarmStatis() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [operate, setOperate] = useState(null); //正在操作id

  // 元数据
  const [themeList, setThemeList] = useState([]); //业务主题
  const [stationList, setStationList] = useState([]);


  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [factorOption, setFactorOption] = useState([]); //报警因子
  const themeId = Form.useWatch("topicType", searchForm);
  const [ruleOption, setRuleOption] = useState([]); //规则类型


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
    // 元数据获取
    getTopicListAsync()
    getFactorList()
    getRuleList()
    getPageData()

  }, []);




  const getTopicListAsync = async () => {
    let { data } = await topicList();
    setThemeList(data)
  };

  //报警因子
  const getFactorList = async () => {
    let { data } = await listFactor();
    setFactorOption(data);
  };

  // 规则
  const getRuleList = async () => {
    let { data: data1 } = await listRule();
    setRuleOption(data1);
  };


  const columns = [
    {
      title: "序号",
      key: "index",
      width: 60,
      dataIndex: "index",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "行政区",
      dataIndex: 'statType',
      key: 'statType',
    },
    {
      title: "报警总数",
      dataIndex: 'count',
      key: 'count', sorter: (a, b) => a.count - b.count,
    },
    {
      title: "日质控未通过",
      key: 'ALM20220901',
      dataIndex: 'ALM20220901', sorter: (a, b) => a.ALM20220901 - b.ALM20220901,
    },
    {
      title: "电导率过低",
      key: 'ALM20220902',
      dataIndex: 'ALM20220902', sorter: (a, b) => a.ALM20220902 - b.ALM20220902,
    },
    {
      title: "零值",
      dataIndex: 'ALM20220903',
      key: 'ALM20220903', sorter: (a, b) => a.ALM20220903 - b.ALM20220903,
    },
    {
      title: "负值",
      dataIndex: 'ALM20220904',
      key: 'ALM20220904', sorter: (a, b) => a.ALM20220904 - b.ALM20220904,
    },
    {
      title: "连续值",
      key: 'ALM20220905',
      dataIndex: 'ALM20220905', sorter: (a, b) => a.ALM20220905 - b.ALM20220905,
    },
    {
      title: "离群",
      key: 'ALM20220906',
      dataIndex: 'ALM20220906', sorter: (a, b) => a.ALM20220906 - b.ALM20220906,
    },
    {
      title: "超限值",
      key: 'ALM20220907',
      dataIndex: 'ALM20220907', sorter: (a, b) => a.ALM20220907 - b.ALM20220907,
    },
    {
      title: "疑似站点离线",
      key: 'ALM20220908',
      dataIndex: 'ALM20220908', sorter: (a, b) => a.ALM20220908 - b.ALM20220908,
    },
    {
      title: "氨氮异常",
      key: 'ALM20220909',
      dataIndex: 'ALM20220909', sorter: (a, b) => a.ALM20220909 - b.ALM20220909,
    },
    {
      title: "水质超标",
      key: 'ALM20220910',
      dataIndex: 'ALM20220910', sorter: (a, b) => a.ALM20220910 - b.ALM20220910,
    },
    {
      title: "仪器故障",
      key: 'ALM20220911',
      dataIndex: 'ALM20220911', sorter: (a, b) => a.ALM20220911 - b.ALM20220911,
    },
    {
      title: "空气质量超标",
      key: 'ALM20220912',
      dataIndex: 'ALM20220912',
      sorter: (a, b) => a.ALM20220912 - b.ALM20220912,
    },
    {
      title: "PM2.5与PM10倒挂",
      key: 'ALM20220913',
      dataIndex: 'ALM20220913',
      sorter: (a, b) => a.ALM20220913 - b.ALM20220913,
    },
  ];


  useEffect(() => {
    console.log(themeId);
    const getStationMetaPage = async () => {
      let { data } = await stationMetaPage({
        topicType: themeId
      });
      setStationList(data);
    };
    if (themeId) {
      getStationMetaPage()
    }
  }, [themeId])



  const sortSelf = (item) => {
    if (item.isDigital) {
      return (a, b) => a[item.key].value - b[item.key].value;
    } else {
      return false;
    }
  };

  const getPageData = async () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();
    if (!values.time) {
      message.info("开始日期或结束日期不能为空");
      return false;
    }
    if (!validateQuery(values.time[0], values.time[1])) {
      return;
    }
    values.notificationBeginDate = dayjs(values.time[0]).format("YYYYMMDD");
    values.notificationEndDate = dayjs(values.time[1]).format("YYYYMMDD");
    values.topicType = [values.topicType]
    let { data, success } = await alarmStatis(values);
    if (success) {
      let iData = data.map((item, idx) => ({
        ...item,
        idx,
      }));
      setData(iData);
      let option = getOption(data)
      setChartdata(option)
    }
    setLoading(false);
  };




  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    // `dataSource` is useless since `pageSize` changed
    setCurrentPage(pagination.current);
  };

  // 柱状
  const getOption = (data) => {
    const option = {
      title: {
        text: '报警统计',
        left: 'center'
      },
      // title: '报警统计',
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "20%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        formatter: function (params, ticket) {
          let html = `<div>${params[0].axisValue}</div>`;
          let unit = ''
          params.map((item) => {
            if (item.value || item.value === 0) {
              html += `<div>${item.marker} ${item.seriesName}：${item.value} ${unit ?? ""
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
            name: ``,
          },

        },
      },

      xAxis: {
        type: "category",
        // boundaryGap: false,
        data: data.map(item => item.statType),
      },
      yAxis: {
        type: "value",
      },
      series: {
        type: 'bar',
        data: data.map((item) => {
          return item.count;
        }),
      }
    };
    return option;
  };

  //导出
  const download = async () => {
    let values = searchForm.getFieldsValue();
    if (!values.time) {
      message.info("开始日期或结束日期不能为空");
      return false;
    }
    if (!validateQuery(values.time[0], values.time[1])) {
      return;
    }
    values.notificationBeginDate = dayjs(values.time[0]).format("YYYYMMDD");
    values.notificationEndDate = dayjs(values.time[1]).format("YYYYMMDD");
    values.topicType = [values.topicType]
    setBtnLoading(true);

    await alarmStatisexport(values, "报警统计");
    setBtnLoading(false);
  };

  return (
    <div className="content-wrap">
      <Lbreadcrumb data={["当前位置：数据运营", "数据报警", "报警统计"]} />
      <>
        <div className="search">
          <Form
            name="station"
            form={searchForm}
            onFinish={getPageData}
            layout="inline"
            initialValues={{
              statType: 'region',
              time: [dayjs().subtract(1, 'month'), dayjs()]
            }}
          >
            <Form.Item label="统计纬度" name="statType">
              <Select
                className="width-3"
                placeholder="请选择"
                options={[
                  {
                    label: '行政区',
                    value: 'region'
                  },
                  {
                    label: '站点类型',
                    value: 'station_type'
                  },
                  {
                    label: '站点',
                    value: 'station'
                  },
                  {
                    label: '因子',
                    value: 'factor'
                  },
                  {
                    label: '运维厂家',
                    value: 'operationFactory'
                  },
                ]}
                style={{ width: "120px" }}
              />

            </Form.Item>
            <Form.Item label="业务主题" name="topicType">
              <Select
                className="width-3"
                placeholder="请选择"
                fieldNames={{
                  label: "name",
                  value: "id",
                }}
                value={themeId}
                options={themeList}
                style={{ width: "120px" }}
              // mode="multiple"
              // maxTagCount="responsive"
              // allowClear
              />

            </Form.Item>
            <Form.Item label="站点类型" name="stationType">
              <Select
                options={stationList}
                placeholder="请选择"
                fieldNames={{
                  label: "name",
                  value: "id",
                }}
                style={{ width: "120px" }}
                mode="multiple"
                maxTagCount="responsive"
                allowClear
              />
            </Form.Item>
            <Form.Item label="报警因子" name="factorName">
              <Select
                style={{ width: 120 }}
                placeholder="报警因子"
                options={factorOption}
                fieldNames={{
                  label: "factorName",
                  value: "factorName",
                }}
                mode="multiple"
                maxTagCount="responsive"
                allowClear
              />
            </Form.Item>
            <Form.Item label="规则类型" name="ruleCode">
              <Select
                style={{ width: 120 }}
                placeholder="规则类型"
                options={ruleOption}
                fieldNames={{
                  label: "name",
                  value: "code",
                }}
                mode="multiple"
                maxTagCount="responsive"
                allowClear
              />
            </Form.Item>

            <Form.Item label="报警时间" name="time">
              <RangePicker />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button loading={loading}>导出</Button>
              </Space>
            </Form.Item>

          </Form>

        </div>
        {
          chartdata && <ReactECharts
            option={chartdata}
            lazyUpdate={true}
            theme={"theme_name"}
            style={{ height: "300px" }}
            ref={chartRef}
            notMerge={true}
            showLoading={loading}
          />
        }
        <div style={{ textAlign: 'right' }}>

          <Button loading={btnLoading} onClick={download}>
            导出
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey={(record) => record.idx}
          onChange={handleTableChange}
          pagination={false}
        ></Table>
      </>
    </div>
  );
}

export default AlarmStatis;
