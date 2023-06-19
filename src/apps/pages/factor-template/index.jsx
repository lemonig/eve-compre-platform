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
import ConfigForm from "./components/ConfigForm";
import {
  templateList,
  templateUpdate,
  templateDelete,
} from "@Api/set_factor_template.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

function FactorTemplate() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState({
    form: false,
    config: false,
  });
  const [operate, setOperate] = useState(null); //正在操作id
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    getPageData();
  }, []);
  // 查询

  const showModal = () => {
    setIsModalOpen({
      ...isModalOpen,
      form: true,
    });
  };

  const getPageData = async () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();
    let { additional_data, data } = await templateList({
      data: values,
    });
    setData(data);
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
  // 配置
  const handleConfig = (record) => {
    setOperate(record);
    setIsModalOpen({
      ...isModalOpen,
      config: true,
    });
  };

  const handleStatusChange = async (checked, record) => {
    record.status = checked ? "1" : "0";

    let { success, message: msg } = await templateUpdate(record);
    if (success) {
      message.success(msg);
      closeModal(true);
    } else {
      message.error(msg);
    }
  };
  // 删除
  const handleDel = ({ code }) => {
    Modal.confirm({
      title: "确定删除？",
      icon: <ExclamationCircleOutlined />,
      content: "删除后无法恢复",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        let { success, message: msg } = await templateDelete({ id: code });
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
      title: "模板名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "因子个数",
      dataIndex: "factorNum",
      key: "factorNum",
    },
    {
      title: "监测因子",
      dataIndex: "factorName",
      key: "factorName  ",
    },

    {
      title: "操作",
      key: "operation",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleConfig(record)}>配置</a>
          <a onClick={() => handleDel(record)}>删除</a>
        </Space>
      ),
    },
  ];

  //表单回调
  const closeModal = (flag) => {
    // flag 确定还是取消
    setIsModalOpen({
      config: false,
      form: false,
    });
    if (flag) getPageData();
  };

  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
  };

  return (
    <>
      <div className="content-wrap">
        <Lbreadcrumb data={["系统设置", "因子管理", "因子模板"]} />

        <div className="search">
          <Form
            layout="inline"
            form={searchForm}
            onFinish={getPageData}
            autoComplete="off"
          >
            <Form.Item label="" name="name">
              <Input
                placeholder="模板名称"
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
          onChange={handleTableChange}
        />
      </div>

      {/* 弹出表单 */}
      {isModalOpen.form && (
        <OpForm
          open={isModalOpen.form}
          closeModal={closeModal}
          record={operate}
        />
      )}
      {isModalOpen.config && (
        <ConfigForm
          open={isModalOpen.config}
          closeModal={closeModal}
          record={operate}
        />
      )}
    </>
  );
}

export default FactorTemplate;
