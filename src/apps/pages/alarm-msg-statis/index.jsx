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
  const statType = Form.useWatch("statType", searchForm);
  const [ruleOption, setRuleOption] = useState([]); //规则类型
  const [visable, setVisable] = useState(false)
  const [tableRow, setTableRow] = useState(null)
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

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

  const normalColumns1 = [
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
      title: "站点名称",
      key: "stationName",
      dataIndex: "stationName",
      render: (text, record, index) => <a onClick={() => showDetail(record)}>{text}</a>
    },
    {
      title: "站点类型",
      dataIndex: 'stationType',
      key: 'stationType',
    },
    {
      title: "超标联系人",
      dataIndex: 'exceededContact',
      key: 'exceededContact',
    },
    {
      title: "运维联系人",
      dataIndex: 'operationContact',
      key: 'operationContact',
    },
    {
      title: "消息总数",
      dataIndex: 'count',
      key: 'count',
      sorter: (a, b) => a.count - b.count,
    },
  ];

  const [columns, setClumns] = useState(normalColumns1)



  useEffect(() => {
    // 元数据获取
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


  const showDetail = (record) => {
    setVisable(true)
    setTableRow(record)
  }
  useEffect(() => {
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
      if (values.statType === 'station') {
        setClumns(normalColumns1)
      } else {
        setClumns(normalColumns)
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
              time: [dayjs().subtract(1, 'month'), dayjs()],
              statType: 'station'
            }}
          >
            <Form.Item label="统计纬度" name="statType">
              <Select
                className="width-3"
                placeholder="请选择"
                options={[

                  {
                    label: '站点',
                    value: "station"
                  },
                  {
                    label: '微信群',
                    value: "wechatGroupName"
                  },
                ]}
                style={{ width: "120px" }}
              />

            </Form.Item>


            {
              statType == 'station' ? <>  <Form.Item label="业务主题" name="topicType">
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
                </Form.Item> </> : null
            }

            <Form.Item label="报警时间" name="time">
              <RangePicker />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                {/* <Button loading={btnLoading} onClick={download}>
                  导出
                </Button> */}
              </Space>
            </Form.Item>

          </Form>

        </div>
        {
          statType === 'station' ?
            <Table
              dataSource={data}
              loading={loading}
              rowKey={(record) => record.idx}
              onChange={handleTableChange}
              pagination={{ pageSize }}
              columns={columns}
            >

            </Table>
            :
            <Table
              columns={columns}
              dataSource={data}
              loading={loading}
              rowKey={(record) => record.idx}
              onChange={handleTableChange}
              pagination={{ pageSize }}
            >

            </Table>
        }

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
