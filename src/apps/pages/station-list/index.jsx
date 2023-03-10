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
} from "antd";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import IconFont from "@Components/IconFont";
import OpForm from "./components/OpForm";
import { stationUpdate, stationPage, stationDelete } from "@Api/set_station.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { topicList } from "@Api/set_meta_theme.js";
import { regionList } from "@Api/set_region.js";
import { riverList } from "@Api/set_rival.js";
import {
  stationPage as stationMetaPage,
  stationGet as stationMetaGet,
} from "@Api/set_meta_station.js";
import { metaBatchList } from "@Api/util.js";
const { SHOW_CHILD } = Cascader;

const { Option } = Select;

function StationList() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operate, setOperate] = useState(null); //正在操作id

  const [filterData, setFilterData] = useState([[], [], []]);
  const [data, setData] = useState([]);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [originOptions, setOriginOptions] = useState([]);
  const [riverOptions, setRiverOptions] = useState([]);

  useEffect(() => {
    // 元数据
    const getTopicList = async () => {
      let { data } = await topicList();
      return data.map((item) => ({
        text: item.name,
        value: item.id,
      }));
    };

    const getStationTpeData = async () => {
      let { data } = await stationMetaPage();
      return data.map((item) => ({
        text: item.name,
        value: item.id,
      }));
    };

    const getOther = async () => {
      let { data } = await metaBatchList({
        dictTypeList: ["control_level", "station_status", "monitoring_means"],
      });
      let ndata1 = data.control_level.map((item) => ({
        text: item.dictLabel,
        value: item.dictValue,
      }));
      let ndata2 = data.station_status.map((item) => ({
        text: item.dictLabel,
        value: item.dictValue,
      }));
      let ndata3 = data.monitoring_means.map((item) => ({
        text: item.dictLabel,
        value: item.dictValue,
      }));
      return [ndata1, ndata2, ndata3];
    };

    Promise.all([getTopicList(), getStationTpeData(), getOther()]).then(
      (res) => {
        console.log(res);
        setFilterData(res);
      }
    );
    getOriginPage();
    getRiverPage();
  }, []);
  useEffect(() => {
    getPageData();
  }, [JSON.stringify(pageMsg)]);

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
  const search = () => {
    // FIXME 第一页会不触发hooks,故分开
    if (pageMsg.pagination.current === 1) {
      getPageData();
    } else {
      setPagemsg({
        ...pageMsg,
        pagination: {
          ...pageMsg.pagination,
          current: 1,
        },
      });
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const getFormCasData = (data = []) => {
    return data?.map((item) => {
      return item[item.length - 1];
    });
  };

  const getPageData = async () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();
    if ("region" in values) {
      values.region = getFormCasData(values.region);
    }
    if ("river" in values) {
      values.river = getFormCasData(values.river);
    }
    let { data, additional_data } = await stationPage({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        ...values,
        ...pageMsg.filters,
      },
    });
    setData(data);
    setLoading(false);
    setPagemsg({
      ...pageMsg,
      pagination: {
        ...pageMsg.pagination,
        total: additional_data.pagination.total,
      },
    });
  };

  // q区域
  const onReginChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };
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
  const onRiverChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };
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
  // 新建
  const handleAdd = () => {
    setOperate(null);
    setIsModalOpen(true);
  };
  // 编辑
  const handleEdit = (record) => {
    setOperate(record);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (checked, record) => {
    record.status = checked ? "1" : "0";

    let { success, message: msg } = await stationUpdate(record);
    if (success) {
      message.success(msg);
      closeModal(true);
    } else {
      message.error(msg);
    }
  };

  // 删除
  const handleDel = ({ id }) => {
    Modal.confirm({
      title: "确定删除？",
      icon: <ExclamationCircleOutlined />,
      content: "删除后无法恢复",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        let { success, message: msg } = await stationDelete({ id });
        if (success) {
          message.success(msg);
          setIsModalOpen(false);
          getPageData();
        } else {
          message.error(msg);
        }
      },
    });
  };

  const columns = [
    {
      title: "序号",
      key: "index",
      width: 60,
      render: (_, record, index) =>
        pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
        index +
        1,
    },
    {
      title: "站点名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "业务主题",
      dataIndex: "topicTypeName",
      key: "topicType",
      filters: filterData[0],
    },
    {
      title: "站点类型",
      dataIndex: "stationTypeName",
      key: "stationType",
      filters: filterData[1],
    },
    {
      title: "管控级别",
      dataIndex: "controlLevelName",
      key: "controlLevel",
      filters: filterData[2][0],
    },
    {
      title: "站点编码",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "运行状态",
      dataIndex: "status",
      key: "status",
      render: (value, record) => (!!Number(value) ? "启用" : "停用"),
      filters: filterData[2][1],
    },
    {
      title: "监测手段",
      dataIndex: "monitoringMeans",
      key: "monitoringMeans",
      render: (value, record) => (!!Number(value) ? "自动" : "手工"),
      filters: filterData[2][2],
    },

    {
      title: "省份",
      dataIndex: "region1",
      key: "region1",
    },
    {
      title: "城市",
      dataIndex: "region2",
      key: "region2",
    },
    {
      title: "区县",
      dataIndex: "region3",
      key: "region3",
    },
    {
      title: "乡镇街道",
      dataIndex: "region4",
      key: "region4",
    },

    {
      title: "因子模板",
      dataIndex: "factorTemplateName",
      key: "factorTemplateId",
    },

    {
      title: "操作",
      key: "operation",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleDel(record)}>删除</a>
        </Space>
      ),
    },
  ];

  //表单回调
  const closeModal = (flag) => {
    // flag 确定还是取消
    setIsModalOpen(false);
    if (flag) getPageData();
  };

  const onTableChange = (pagination, filters, sorter, extra) => {
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
  return (
    <div className="content-wrap">
      <Lbreadcrumb data={["系统设置", "站点管理", "站点列表"]} />
      {!isModalOpen && (
        <>
          <div className="search">
            <Form
              layout="inline"
              form={searchForm}
              onFinish={search}
              autoComplete="off"
            >
              <Form.Item label="行政区" name="region">
                <Cascader
                  style={{ width: "180px" }}
                  options={originOptions}
                  loadData={loadeReginData}
                  onChange={onReginChange}
                  changeOnSelect
                  fieldNames={{
                    label: "name",
                    value: "code",
                  }}
                  multiple
                  maxTagCount="responsive"
                  showCheckedStrategy={SHOW_CHILD}
                  placeholder="请选择"
                />
              </Form.Item>
              <Form.Item label="河流" name="river">
                <Cascader
                  style={{ width: "180px" }}
                  options={riverOptions}
                  loadData={loadRiverData}
                  onChange={onRiverChange}
                  changeOnSelect
                  fieldNames={{
                    label: "name",
                    value: "code",
                  }}
                  multiple
                  maxTagCount="responsive"
                  showCheckedStrategy={SHOW_CHILD}
                  placeholder="请选择"
                />
              </Form.Item>
              <Form.Item label="" name="name">
                <Input
                  placeholder="站点名称/编码"
                  className="width-18"
                  // value={searchVal}
                />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button onClick={handleAdd}>新建</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey={(record) => record.id}
            pagination={pageMsg.pagination}
            onChange={onTableChange}
          />
        </>
      )}
      {/* 弹出表单 */}
      {isModalOpen && (
        <OpForm open={isModalOpen} closeModal={closeModal} record={operate} />
      )}
    </div>
  );
}

export default StationList;
