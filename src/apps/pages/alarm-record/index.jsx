import React, { useState, useEffect } from "react";
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
  DatePicker,
} from "antd";
// com
import Lbreadcrumb from "@Components/Lbreadcrumb";
import IconFont from "@Components/IconFont";
import dayjs from "dayjs";
import LtimePicker from "@Components/LtimePicker";
import { SettingOutlined, WarningFilled } from "@ant-design/icons";
import AlarmFiled from "@Components/AlarmFiled";
import WaterLevel from "@Components/WaterLevel";
// api
import { pageAlarm } from "@Api/alarm.js";
import { stationPage as stationMetaPage, topicList } from "@Api/user.js";
import { regionList } from "@Api/set_region.js";
import { riverList } from "@Api/set_rival.js";
import { searchMeta } from "@Api/data-list.js";
import { allListFactor as listFactor } from "@Api/set_alarm_pub.js";
import { listRule } from "@Api/set_alarm.js";
// util
import { formatePickTime, formPickTime } from "@Utils/util";
const { RangePicker } = DatePicker;
const { Option } = Select;

const getFormCasData = (data = []) => {
  return data?.map((item) => {
    return item[item.length - 1];
  });
};

function tableRender(value) {
  if (value.divColor) {
    return <WaterLevel level={value.value} color={value.divColor}></WaterLevel>;
  } else if (value.color) {
    return (
      <Tooltip title={"超标"}>
        <span
          style={{
            color: "#F82504",
            fontWeight: "bold",
          }}
        >
          {value.value}
        </span>
      </Tooltip>
    );
  } else if (value.tips) {
    return (
      <>
        <span>{value.value}</span>
        &nbsp;
        <Tooltip title={value.tips}>
          <WarningFilled style={{ color: "#F82504" }} />
        </Tooltip>
      </>
    );
  } else {
    return value.value;
  }
}

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

function AlarmRecord() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState({
    form: false,
  });
  const [operate, setOperate] = useState(null); //正在操作id

  // 元数据
  const [originOptions, setOriginOptions] = useState([]);
  const [topicOption, setTopicOption] = useState([]);
  const [riverOptions, setRiverOptions] = useState([]);
  const [stationList, setStationList] = useState([]);
  const regionValue = Form.useWatch("region", searchForm);
  const riverValue = Form.useWatch("river", searchForm);
  const stationTypeValue = Form.useWatch("stationType", searchForm);
  const [metaData, setMetaData] = useState({
    computeDataLevel: [],
    dataSource: [],
    stationField: [],
    evaluateIndex: [],
    factor: [],
  });
  const [columns, setColumns] = useState([]);
  const [stationType, setStationType] = useState();
  const [data, setData] = useState([]);
  const [visable, setVisable] = useState(false); //因子选择
  const [factorList, setFactorList] = useState([]); //字段选择回调
  const [currentPage, setCurrentPage] = useState(1);
  const [factorOption, setFactorOption] = useState([]); //报警因子
  const [ruleOption, setRuleOption] = useState([]); //规则类型

  let normalCol = [
    {
      title: "序号",
      key: "index",
      width: 60,
      dataIndex: "index",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
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

  const onStationTypeChange = (id) => {
    let findRes = stationList.find((item) => item.id === id);
    setStationType(findRes);
  };

  const showModal = () => {
    setIsModalOpen({
      ...isModalOpen,
      form: true,
    });
  };

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
    console.log(values);
    values.notificationBeginDate = values.time[0];
    values.notificationEndDate = values.time[1];

    if ("region" in values) {
      values.region = getFormCasData(values.region);
    }

    let { data, success } = await pageAlarm(values);
    if (success) {
      let iData = data.map((item, idx) => ({
        ...item,
        idx,
      }));
      setData(iData);

      // let newCol = additional_data.columnList.map((item) => ({
      //   title: item.label,
      //   dataIndex: item.key,
      //   key: item.key,
      //   render: (value) => tableRender(value),
      //   width: 60,
      //   sorter: sortSelf(item),
      // }));

      // setColumns([...newCol]);
    }
    setLoading(false);
  };

  // 新建
  const handleAdd = () => {
    setOperate(null);
    setIsModalOpen({
      ...isModalOpen,
      form: true,
    });
  };
  // 编辑
  const handleEdit = (record) => {
    setOperate(record);
    setIsModalOpen({
      ...isModalOpen,
      form: true,
    });
  };

  //表单回调
  const closeModal = (flag) => {
    // flag 确定还是取消
    setIsModalOpen({
      ...isModalOpen,
      form: false,
    });
    if (flag) getPageData();
  };

  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    // `dataSource` is useless since `pageSize` changed
    setCurrentPage(pagination.current);
  };

  const confirmModal = (data) => {
    console.log(data);
    setColumns(data);
    setVisable(false);
    setFactorList(data);
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
                <Button loading={loading}>导出</Button>
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
          pagination={{ pageSize }}
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
