import React, { useState, useEffect } from "react";
import { Select, Button, Space, Table, Form, Cascader, DatePicker } from "antd";
// com
import Lbreadcrumb from "@Components/Lbreadcrumb";
import dayjs from "dayjs";
import { SettingOutlined } from "@ant-design/icons";
import AlarmFiled from "@Components/AlarmFiled";
// api
import { pageAlarm, pageAlarmExport } from "@Api/alarm.js";
import { stationPage as stationMetaPage, topicList } from "@Api/user.js";
import { regionList } from "@Api/set_region.js";
import { allListFactor as listFactor } from "@Api/set_alarm_pub.js";
import { listRule } from "@Api/set_alarm.js";
// util
import { validateQuery } from "@Utils/valid.js";

const { RangePicker } = DatePicker;

const getFormCasData = (data = []) => {
  return data?.map((item) => {
    return item[item.length - 1];
  });
};

function AlarmRecord() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  // 元数据
  const [originOptions, setOriginOptions] = useState([]);
  const [topicOption, setTopicOption] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [visable, setVisable] = useState(false); //因子选择
  const [factorList, setFactorList] = useState([]); //字段选择回调
  const [factorOption, setFactorOption] = useState([]); //报警因子
  const [ruleOption, setRuleOption] = useState([]); //规则类型
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  });

  let normalCol = [
    {
      title: "序号",
      key: "index",
      width: 60,
      dataIndex: "index",
      render: (_, record, idx) =>
        pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
        idx +
        1,
    },
  ];
  useEffect(() => {
    // 元数据获取

    getOriginPage();
    getStationMetaPage();
    getTopicList(); //主题

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
    getFactorList();
    getRuleList();
  }, []);

  useEffect(() => {
    getPageData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);

  const getTopicList = async () => {
    let { data } = await topicList();
    setTopicOption(data);
  };

  const getOriginPage = async () => {
    let { data } = await regionList({
      level: "1",
    });
    let newd = data.map((item) => ({
      ...item,
      isLeaf: false,
    }));
    setOriginOptions(newd);
  };

  const getStationMetaPage = async () => {
    let { data } = await stationMetaPage();
    setStationList(data);
  };

  // 区域
  const loadeReginData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    let { data } = await regionList({
      parentCode: selectedOptions[selectedOptions.length - 1].code,
    });
    if (selectedOptions[selectedOptions.length - 1].level === 3) {
      targetOption.children = data;
    } else {
      let newd = data.map((item) => ({
        ...item,
        isLeaf: false,
      }));
      targetOption.children = newd;
    }
    setOriginOptions([...originOptions]);
  };

  const getPageData = async () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();
    if (!validateQuery(values.time[0], values.time[1])) {
      return;
    }
    values.notificationBeginDate = dayjs(values.time[0]).format("YYYYMMDD");
    values.notificationEndDate = dayjs(values.time[1]).format("YYYYMMDD");
    if ("region" in values) {
      values.region = getFormCasData(values.region);
    }
    let params = {
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: values,
    };
    let { additional_data, data, success } = await pageAlarm(params);
    if (success) {
      let iData = data.map((item, idx) => ({
        ...item,
        idx,
      }));
      setData(iData);
      if (pageMsg.total !== additional_data.pagination.total) {
        setPagemsg({
          ...pageMsg,
          pagination: {
            ...pageMsg.pagination,
            total: additional_data.pagination.total,
          },
        });
      }
    }
    setLoading(false);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    // `dataSource` is useless since `pageSize` changed
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== pageMsg.pagination?.pageSize) {
      setData([]);
    }
  };

  const confirmModal = (data) => {
    setColumns(data);
    setVisable(false);
    setFactorList(data);
  };

  //导出
  const download = async () => {
    setBtnLoading(true);
    let values = searchForm.getFieldsValue();
    if (!validateQuery(values.time[0], values.time[1])) {
      return;
    }
    values.notificationBeginDate = dayjs(values.time[0]).format("YYYYMMDD");
    values.notificationEndDate = dayjs(values.time[1]).format("YYYYMMDD");
    if ("region" in values) {
      values.region = getFormCasData(values.region);
    }
    values.columns = columns.map((item) => item.id);
    let params = {
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: values,
    };
    await pageAlarmExport(params, "报警记录");
    setBtnLoading(false);
  };

  return (
    <div className="content-wrap">
      <Lbreadcrumb data={["当前位置：数据运营", "数据报警", "报警记录"]} />
      <>
        <div className="search">
          <Form
            name="station"
            form={searchForm}
            onFinish={getPageData}
            layout="inline"
            initialValues={{
              time: [dayjs().subtract(1, "month"), dayjs()],
            }}
          >
            <Form.Item label="业务主题" name="topicType">
              <Select
                options={topicOption}
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
            <Form.Item label="站点类型" name="stationType">
              <Select
                options={stationList}
                placeholder="请选择"
                fieldNames={{
                  label: "name",
                  value: "id",
                }}
                style={{ width: "120px" }}
                // onChange={onStationTypeChange}
                mode="multiple"
                maxTagCount="responsive"
                allowClear
              />
            </Form.Item>

            <Form.Item label="行政区" name="region">
              <Cascader
                style={{ width: "120px" }}
                options={originOptions}
                loadData={loadeReginData}
                changeOnSelect
                fieldNames={{
                  label: "name",
                  value: "name",
                }}
                multiple
                maxTagCount="responsive"
              />
            </Form.Item>

            <Form.Item label="报警因子" name="factorId">
              <Select
                style={{ width: 120 }}
                placeholder="报警因子"
                options={factorOption}
                fieldNames={{
                  label: "factorName",
                  value: "factorId",
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
          <SettingOutlined
            onClick={() => setVisable(true)}
            style={{ fontSize: "18px" }}
          />
        </div>
        <Table
          columns={[...normalCol, ...columns]}
          dataSource={data}
          loading={loading}
          rowKey={(record) => record.idx}
          onChange={handleTableChange}
          pagination={{
            ...pageMsg.pagination,
            showSizeChanger: true,
          }}
        ></Table>
      </>

      {/* 弹出表单 */}
      <AlarmFiled
        title={["报警字段", "站点字段"]}
        open={visable}
        closeModal={() => setVisable(false)}
        onOk={confirmModal}
      />
    </div>
  );
}

export default AlarmRecord;
