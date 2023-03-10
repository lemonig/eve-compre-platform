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
  DatePicker,
} from "antd";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import IconFont from "@Components/IconFont";
import OpForm from "./components/OpForm";
import { standardList, standardDelete } from "@Api/set_meta_standrad.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

function SetMetaStandard() {
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
    let { data } = await standardList(values);
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

  // 删除
  const handleDel = ({ id }) => {
    Modal.confirm({
      title: "确定删除？",
      icon: <ExclamationCircleOutlined />,
      content: "删除后无法恢复",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        let { success, message: msg } = await standardDelete({ id });
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
      title: "名称",
      dataIndex: "name",
      key: "name  ",
    },

    {
      title: "编码",
      dataIndex: "code",
      key: "code",
    },

    {
      title: "适用评价指标",
      dataIndex: "remark",
      key: "remark",
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
  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  return (
    <div className="content-wrap">
      <Lbreadcrumb data={["系统设置", "元数据管理", "评价标准"]} />
      <div className="search">
        <Form layout="inline" form={searchForm} onFinish={getPageData}>
          {/* <Form.Item label="" name="name">
            <Input placeholder="指标名称/编码" style={{ width: 180 }} />
          </Form.Item> */}
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
      {/* 弹出表单 */}
      {isModalOpen && (
        <OpForm open={isModalOpen} closeModal={closeModal} record={operate} />
      )}
    </div>
  );
}

export default SetMetaStandard;
