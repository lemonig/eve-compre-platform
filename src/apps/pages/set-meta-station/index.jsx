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
} from "antd";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import IconFont from "@Components/IconFont";
import OpForm from "./components/OpForm";
import { stationUpdate, stationPage } from "@Api/set_meta_station.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { Option } = Select;

function SetMetaStaion() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operate, setOperate] = useState(null); //正在操作id

  const [data, setData] = useState([]);

  useEffect(() => {
    getPageData();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const getPageData = async () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();
    let { data } = await stationPage(values);
    setData(data);
    setLoading(false);
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
    let { success, message: msg } = await stationUpdate({
      id: record.id,
      status: checked ? "1" : "0",
    });
    if (success) {
      message.success(msg);
      closeModal(true);
    } else {
      message.error(msg);
    }
  };

  const columns = [
    {
      title: "序号",
      key: "index",
      width: 60,
      render: (_, record, index) => index + 1,
    },
    {
      title: "业务主题",
      dataIndex: "topicTypeName",
      key: "topicTypeName",
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name  ",
    },
    {
      title: "英文名",
      dataIndex: "enName",
      key: "enName  ",
    },
    {
      title: "编码",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "数据表",
      dataIndex: "tableName",
      key: "tableName",
    },
    {
      title: "数据频次",
      dataIndex: "dataFrequency",
      key: "dataFrequency",
    },
    {
      title: "是否汇聚数据",
      dataIndex: "needComputeData",
      key: "needComputeData",
      render: (value, record) => (value ? "是" : "否"),
    },
    {
      title: "汇聚级别",
      dataIndex: "computeDataLevel",
      key: "computeDataLevel",
    },
    {
      title: "评价指标",
      dataIndex: "evaluationIndex",
      key: "evaluationIndex",
    },
    {
      title: "站点属性字段",
      dataIndex: "stationFieldNum",
      key: "stationFieldNum",
    },

    {
      title: "是否启用",
      dataIndex: "status",
      key: "status",
      render: (value, record) => (
        <Switch
          checked={!!Number(value)}
          onChange={(checked) => handleStatusChange(checked, record)}
        />
      ),
    },
    {
      title: "展示次序",
      dataIndex: "orderNum",
      key: "orderNum",
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
    if (flag) getPageData();
  };
  return (
    <div className="content-wrap">
      <Lbreadcrumb data={["系统设置", "元数据管理", "站点类型"]} />
      {!isModalOpen && (
        <>
          <div className="search">
            <Form layout="inline" form={searchForm} onFinish={getPageData}>
              <Form.Item label="" name="name">
                <Input
                  placeholder="站点类型名称/编码"
                  style={{ width: 180 }}
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

export default SetMetaStaion;
