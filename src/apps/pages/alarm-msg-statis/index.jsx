import React, { useState, useEffect, useRef } from "react";
import {
  Select,
  Button,
  Space,
  Table,
  Form,
  message,
  DatePicker
} from "antd";
// com
import Lbreadcrumb from "@Components/Lbreadcrumb";
import IconFont from "@Components/IconFont";
import dayjs from "dayjs";
// api

import { stationPage as stationMetaPage, topicList } from "@Api/user.js";

import { listRule } from "@Api/set_alarm.js";
import { allListFactor as listFactor } from "@Api/set_alarm_pub.js";
import { logStat, logExport } from "@Api/alarm_statis.js";
// util
import { formatePickTime } from "@Utils/util";
import { validateQuery } from "@Utils/valid.js";
import Detail from "./components/Detail";
const { RangePicker } = DatePicker;
const { Option } = Select;

const getFormCasData = (data = []) => {
  return data?.map((item) => {
    return item[item.length - 1];
  });
};


const pageSize = 10;

const columsList = [
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
]



const DynamicTableHeader = ({ columns }) => {
  return columns.map((column) => (
    <Table.Column
      title={column.title}
      dataIndex={column.dataIndex}
      key={column.key}
    />
  ));
};

function AlarmMsgStatis() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // 元数据
  const [themeList, setThemeList] = useState([]); //业务主题
  const [stationList, setStationList] = useState([]);


  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [factorOption, setFactorOption] = useState([]); //报警因子
  const themeId = Form.useWatch("topicType", searchForm);
  const [ruleOption, setRuleOption] = useState([]); //规则类型

  const [visable, setVisable] = useState(false)
  const [tableRow, setTableRow] = useState(null)
  const [columns, setClumns] = useState(columsList)
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    // 元数据获取


    // getStationMetaPage();
    getTopicListAsync()
    getFactorList()
    getRuleList()
  }, []);

  const getTopicListAsync = async () => {
    let { data } = await topicList();
    searchForm.setFieldsValue({
      topicType: data[0].id
    })
    setThemeList(data)
    getPageData()
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
  const normalColumns = [
    {
      title: "序号",
      key: "index",
      width: 60,
      render: (_, record, idx) =>
        pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
        idx +
        1,
    },
    {
      title: "群聊名称",
      key: "wechatGroupName",
      dataIndex: "wechatGroupName",
      render: (text, record, index) => <a onClick={() => showDetail(record)}>{text}</a>
    },
    {
      title: "报警总数",
      dataIndex: 'count',
      key: 'count', sorter: (a, b) => a.count - b.count,
    },

  ];


  const showDetail = (record) => {
    setVisable(true)
    setTableRow(record)
  }
  useEffect(() => {
    console.log(themeId);
    const getStationMetaPage = async () => {
      let { data } = await stationMetaPage({
        topicType: themeId
      });
      setStationList(data);
      searchForm.setFieldsValue({
        stationType: []
      })
    };
    if (themeId) {
      getStationMetaPage()
    }
  }, [themeId])



  const getPageData = async () => {
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
    values.topicType = values.topicType ? [values.topicType] : undefined

    let { additional_data, data, success } = await logStat(values);
    if (success) {
      let iData = data.map((item, idx) => ({
        ...item,
        idx,
      }));
      if (values.ruleCode && values.ruleCode.length > 0) {
        let res = columsList.map(item => {
          if (
            values.ruleCode.findIndex(ele => ele === item.dataIndex) !== -1
          ) {
            return item
          }
        }).filter(Boolean)
        setClumns(res)
      } else {
        setClumns(columsList)
      }
      setData(iData);
    }
    setLoading(false);
  };

  //表单回调
  const closeModal = (flag) => {
    // flag 确定还是取消
    setVisable(false)
  };

  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    // `dataSource` is useless since `pageSize` changed
    if (pagination) {
      setPagemsg({
        pagination,
        filters,
        ...sorter,
      });
    }
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

    await logExport(values, "消息统计");
    setBtnLoading(false);
  };


  return (
    <div className="content-wrap">
      <Lbreadcrumb data={["当前位置：数据运营", "数据报警", "消息统计"]} />
      <>
        <div className="search">
          <Form
            name="station"
            form={searchForm}
            onFinish={getPageData}
            layout="inline"
            initialValues={{
              time: [dayjs().subtract(1, 'month'), dayjs()]
            }}
          >
            <Form.Item label="业务主题" name="topicType">
              <Select
                className="width-3"
                placeholder="请选择"
                fieldNames={{
                  label: "name",
                  value: "id",
                }}
                options={themeList}
                style={{ width: "120px" }}

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
                <Button loading={btnLoading} onClick={download}>
                  导出
                </Button>
              </Space>
            </Form.Item>

          </Form>

        </div>
        {/* <ReactECharts
          option={chartdata}
          lazyUpdate={true}
          theme={"theme_name"}
          style={{ height: "200px" }}
          ref={chartRef}
          notMerge={true}
        showLoading={loading}
        /> */}

        <Table
          columns={[...normalColumns, ...columns]}
          dataSource={data}
          loading={loading}
          rowKey={(record) => record.idx}
          onChange={handleTableChange}
          pagination={{ pageSize }}
        ></Table>


      </>
      {visable && (
        <Detail
          open={visable}
          closeModal={closeModal}
          tableRow={tableRow}
          searchData={searchForm.getFieldsValue()}
        />
      )}
    </div>
  );
}

export default AlarmMsgStatis;
