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
import { riverList, riverDelete, riverUpdate } from "@Api/set_rival.js";
import ChildGroup1 from "./components/ChildGroup1";

import { ExclamationCircleOutlined } from "@ant-design/icons";
const { Option } = Select;

function SetMsgRiver() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState({
    modal: false,
    child: false,
  });
  const [operate, setOperate] = useState(null); //正在操作id

  const [data, setData] = useState([]);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = async () => {
    setLoading(true);
    let { data } = await riverList({
      level: "1",
    });
    setData(data);
    setLoading(false);
  };

  // 新建
  const handleAdd = () => {
    setOperate(null);
    setIsModalOpen({
      ...isModalOpen,
      modal: true,
    });
  };
  // 编辑
  const handleEdit = (record) => {
    setOperate(record);
    setIsModalOpen({
      ...isModalOpen,
      modal: true,
    });
  };
  //
  const handleChild = (record) => {
    setOperate(record);
    setIsModalOpen({
      ...isModalOpen,
      child: true,
    });
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
        let { success, message: msg } = await riverDelete({ id });
        if (success) {
          message.success(msg);
          setIsModalOpen({
            ...isModalOpen,
            modal: false,
          });
          getPageData();
        } else {
          message.error(msg);
        }
      },
    });
  };

  const handleStatusChange = async (checked, record) => {
    let { success, message: msg } = await riverUpdate({
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
      render: (_, record, index) =>
        pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
        index +
        1,
    },
    {
      title: "级别  ",
      dataIndex: "levelName",
      key: "levelName",
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "编码",
      dataIndex: "code",
      key: "code  ",
    },

    {
      title: "下级水体",
      dataIndex: "childrenNum",
      key: "childrenNum",
      render: (value, record) => (
        <Space>
          <a onClick={() => handleChild(record)}>{value}</a>
        </Space>
      ),
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
          <a onClick={() => handleDel(record)}>删除</a>
        </Space>
      ),
    },
  ];
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
  //表单回调
  const closeModal = (flag) => {
    // flag 确定还是取消
    setOperate(null);
    setIsModalOpen({
      modal: false,
      child: false,
    });
    if (flag) getPageData();
  };
  return (
    <div className="content-wrap">
      <Lbreadcrumb data={["系统设置", "信息管理", "水体"]} />
      {!isModalOpen.child && (
        <>
          <div className="search">
            <Form layout="inline" form={searchForm} onFinish={getPageData}>
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
      {isModalOpen.modal && (
        <OpForm
          open={isModalOpen.modal}
          closeModal={closeModal}
          record={operate}
        />
      )}
      {isModalOpen.child && (
        <ChildGroup1
          open={isModalOpen.child}
          pcloseModal={closeModal}
          precord={operate}
        />
      )}
    </div>
  );
}

export default SetMsgRiver;
