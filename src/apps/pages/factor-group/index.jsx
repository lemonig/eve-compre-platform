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
import { groupList, groupDelete } from "@Api/set_factor_group.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

function FactorGroup() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState({
    form: false,
    config: false,
  });
  const [operate, setOperate] = useState(null); //正在操作id

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
    let { additional_data, data } = await groupList({
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

  // 删除
  const handleDel = ({ code }) => {
    Modal.confirm({
      title: "确定删除？",
      icon: <ExclamationCircleOutlined />,
      content: "删除后无法恢复",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        let { success, message: msg } = await groupDelete({ id: code });
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
      render: (_, record, index) => index + 1,
    },
    {
      title: "分组名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "分组编码",
      dataIndex: "code",
      key: "code",
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

  return (
    <>
      <div className="content-wrap">
        <Lbreadcrumb data={["系统设置", "因子管理", "因子分组"]} />

        <div className="search">
          <Form
            layout="inline"
            form={searchForm}
            onFinish={getPageData}
            autoComplete="off"
          >
            <Form.Item label="" name="name">
              <Input
                placeholder="分组名称/分组编码"
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
    </>
  );
}

export default FactorGroup;
