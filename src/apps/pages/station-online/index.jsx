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
import { CheckCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import IconFont from "@Components/IconFont";
import OpForm from "./components/OpForm";
import { onlinePage } from "@Api/set_station_online.js";
import { topicList } from "@Api/set_meta_theme.js";
import { regionList } from "@Api/set_region.js";
import { riverList } from "@Api/set_rival.js";
import { metaBatchList } from "@Api/util.js";
import { stationPage as stationMetaPage } from "@Api/set_meta_station.js";
import { frequenceList } from "@Utils/data";
const { SHOW_CHILD } = Cascader;
const { Option } = Select;

function StationOnline() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operate, setOperate] = useState(null); //正在操作id
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); //表格选中key
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
    getPageData();
  }, [JSON.stringify(pageMsg)]);

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
        setFilterData(res);
      }
    );
    getOriginPage();
    getRiverPage();
  }, []);

  const search = () => {
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
    let { additional_data, data } = await onlinePage({
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

  // 新建
  const handleSet = () => {
    setOperate(null);
    setIsModalOpen(true);
  };
  // 编辑
  const handleEdit = (record) => {
    setOperate(record);
    setIsModalOpen(true);
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
      title: "业务主题",
      dataIndex: "businessTypeName",
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
      title: "站点名称",
      dataIndex: "name",
      key: "name  ",
    },
    {
      title: "站点编码",
      dataIndex: "code",
      key: "code  ",
    },
    {
      title: "网络状态",
      dataIndex: "isOnline",
      key: "isOnline",
      filters: [
        {
          text: "在线",
          value: true,
        },
        {
          text: "离线",
          value: false,
        },
      ],
      render: (value) => {
        return value ? (
          <Space>
            在线
            <CheckCircleOutlined
              style={{ color: "#52CC6F", fontSize: "14px" }}
            />
          </Space>
        ) : (
          <Space>
            离线
            <QuestionCircleOutlined />
          </Space>
        );
      },
    },
    {
      title: "区域",
      dataIndex: "regionName",
      key: "regionName",
    },
    {
      title: "流域",
      dataIndex: "riverName",
      key: "riverName",
    },

    {
      title: "最近活动",
      dataIndex: "lastActiveTime",
      key: "lastActiveTime",
    },
    {
      title: "检查频率",
      dataIndex: "checkFrequency",
      key: "checkFrequency",
      filters: frequenceList,
      // onFilter: (value, record) => record.checkFrequency === value,
      render: (value) => (value > 60 ? `${value / 60}小时` : `${value}分钟`),
    },

    {
      title: "操作",
      key: "operation",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>编辑</a>
        </Space>
      ),
    },
  ];

  //表单回调
  const closeModal = (flag) => {
    // flag 确定还是取消
    setIsModalOpen(false);
    if (flag) {
      getPageData();
      setSelectedRowKeys([]);
    }
  };

  // 表格选中
  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    // setSelecteTable(selectedRows);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      pagination,
      filters,
      ...sorter,
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

  return (
    <div className="content-wrap">
      <Lbreadcrumb data={["系统设置", "站点管理", "在线设置"]} />

      <>
        <div className="search">
          <Form layout="inline" form={searchForm} onFinish={getPageData}>
            <Form.Item label="" name="name">
              <Input
                placeholder="站点名称/编码"
                className="width-18"
                // value={searchVal}
              />
            </Form.Item>
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
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button onClick={handleSet}>设置</Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={pageMsg.pagination}
          rowKey={(record) => record.id}
          onChange={handleTableChange}
          rowSelection={rowSelection}
        />
      </>
      {/* 弹出表单 */}
      {isModalOpen && (
        <OpForm
          open={isModalOpen}
          closeModal={closeModal}
          record={operate ? operate : selectedRowKeys}
        />
      )}
    </div>
  );
}

export default StationOnline;
