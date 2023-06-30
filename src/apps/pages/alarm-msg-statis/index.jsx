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
} from "antd";
// com
import Lbreadcrumb from "@Components/Lbreadcrumb";
import IconFont from "@Components/IconFont";
import dayjs from "dayjs";
import LtimePicker from "@Components/LtimePicker";
import { SettingOutlined, WarningFilled } from "@ant-design/icons";
import FiledSelect from "@Components/FiledSelect";
import WaterLevel from "@Components/WaterLevel";
// api
import { reportTime, reportTimeMeta } from "@Api/operate_time_report.js";
import { stationPage as stationMetaPage } from "@Api/user.js";
import { regionList } from "@Api/set_region.js";
import { riverList } from "@Api/set_rival.js";
import { searchMeta } from "@Api/data-list.js";
// util
import { formatePickTime } from "@Utils/util";

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

function AlarmMsgStatis() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState({
    form: false,
  });
  const [operate, setOperate] = useState(null); //正在操作id

  // 元数据
  const [originOptions, setOriginOptions] = useState([]);
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
  useEffect(() => {
    // 元数据获取

    getOriginPage();
    getRiverPage();
    getStationMetaPage();
  }, []);

  useEffect(() => {
    if (!!stationTypeValue) {
      getMetaData();
    }
  }, [stationTypeValue, riverValue, regionValue]);

  useEffect(() => {
    if (factorList.length > 0) {
      getPageData();
    }
  }, [JSON.stringify(factorList)]);

  let normalCol = [
    {
      title: "序号",
      key: "index",
      width: 50,
      dataIndex: "index",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
  ];

  const getMetaData = async () => {
    let values = searchForm.getFieldsValue();
    if ("region" in values) {
      values.region = getFormCasData(values.region);
    }
    if ("river" in values) {
      values.river = getFormCasData(values.river);
    }

    let param = {
      stationType: values.stationType,
      river: values.river,
      region: values.region,
    };

    let { data, success } = await reportTimeMeta(param);
    if (success) {
      data.factor.forEach((element) => {
        element.checked = true;
      });

      setMetaData(data);
      searchForm.setFieldsValue({
        dataSource: data.dataSource[0].value,
        time: {
          startTime: dayjs().subtract(1, "month"),
          endTime: dayjs(),
          type: data.computeDataLevel[0].value,
        },
      });
    }
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
  const getRiverPage = async () => {
    let { data } = await riverList({
      level: "1",
    });
    let newd = data.map((item) => ({
      ...item,
      isLeaf: false,
    }));
    setRiverOptions(newd);
  };

  const getStationMetaPage = async () => {
    let { data } = await stationMetaPage();
    setStationList(data);
    setStationType(data[0]);
    searchForm.setFieldsValue({
      stationType: data[0].id,
    });
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

  // 河流
  const loadRiverData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    let { data } = await riverList({
      parentCode: selectedOptions[selectedOptions.length - 1].code,
    });
    if (selectedOptions[selectedOptions.length - 1].level === 2) {
      targetOption.children = data;
    } else {
      let newd = data.map((item) => ({
        ...item,
        isLeaf: false,
      }));
      targetOption.children = newd;
    }
    setRiverOptions([...riverOptions]);
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
    values.beginTime = formatePickTime(values.time.type, values.time.startTime);
    values.endTime = formatePickTime(values.time.type, values.time.endTime);
    values.timeType = values.time.type;
    values.showFieldList = factorList;

    if ("region" in values) {
      values.region = getFormCasData(values.region);
    }
    if ("river" in values) {
      values.river = getFormCasData(values.river);
    }

    let { additional_data, data, success } = await reportTime(values);
    if (success) {
      let iData = data.map((item, idx) => ({
        ...item,
        idx,
      }));
      setData(iData);

      let newCol = additional_data.columnList.map((item) => ({
        title: item.label,
        dataIndex: item.key,
        key: item.key,
        render: (value) => tableRender(value),
        width: 60,
        sorter: sortSelf(item),
      }));

      setColumns([...newCol]);
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
    setVisable(false);
    setFactorList(data);
  };

  return (
    <div className="content-wrap">
      <Lbreadcrumb data={["当前位置：数据运营", "报表统计", "时间报表"]} />
      <>
        <div className="search">
          {!!stationType && (
            <Form
              name="station"
              form={searchForm}
              onFinish={getPageData}
              layout="inline"
            >
              <Form.Item label="站点类型" name="stationType">
                <Select
                  options={stationList}
                  placeholder="请选择"
                  fieldNames={{
                    label: "name",
                    value: "id",
                  }}
                  style={{ width: "120px" }}
                  onChange={onStationTypeChange}
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
              {stationType.showRiver && (
                <Form.Item label="河流" name="river">
                  <Cascader
                    style={{ width: "120px" }}
                    options={riverOptions}
                    loadData={loadRiverData}
                    changeOnSelect
                    fieldNames={{
                      label: "name",
                      value: "code",
                    }}
                    multiple
                    maxTagCount="responsive"
                  />
                </Form.Item>
              )}

              <Form.Item label="" name="dataSource">
                <Select
                  style={{ width: 120 }}
                  placeholder="数据来源"
                  options={metaData?.dataSource}
                />
              </Form.Item>
              <Form.Item label="" name="time">
                <LtimePicker options={metaData?.computeDataLevel} />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button loading={loading}>导出</Button>
                </Space>
              </Form.Item>
              <Form.Item>
                <Checkbox>热图</Checkbox>
              </Form.Item>
            </Form>
          )}
          <SettingOutlined
            onClick={() => setVisable(true)}
            style={{ fontSize: "18px" }}
          />
        </div>
        {columns.length > 0 && (
          <Table
            columns={[...normalCol, ...columns]}
            dataSource={data}
            loading={loading}
            rowKey={(record) => record.idx}
            onChange={handleTableChange}
            pagination={{ pageSize }}
          ></Table>
        )}
      </>

      {/* 弹出表单 */}
      {metaData?.stationField.length ? (
        <FiledSelect
          title={["站点属性", "评价因子", "监测因子"]}
          options1={metaData?.stationField}
          options2={metaData?.evaluateIndex}
          options3={metaData.factor}
          open={visable}
          closeModal={() => setVisable(false)}
          onOk={confirmModal}
        />
      ) : null}
    </div>
  );
}

export default AlarmMsgStatis;
