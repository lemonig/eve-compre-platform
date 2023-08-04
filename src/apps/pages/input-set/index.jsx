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
import { listAccess, deleteAccess } from "@Api/input_set.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { metaList } from "@Api/util.js";
import { inputTrim } from "@Utils/util";

function InputSet() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState({
    form: false,
  });
  const [operate, setOperate] = useState(null); //正在操作id
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState([]);

  useEffect(() => {
    getMetaData();
    getPageData();
  }, []);

  const getMetaData = async () => {
    let { data } = await metaList({
      dictType: "accessType",
    });
    setMeta(data);
  };

  // 查询
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
    setIsModalOpen({
      ...isModalOpen,
      form: true,
    });
  };

  const getPageData = async () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();
    let { additional_data, data } = await listAccess(values);
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

  // 删除
  const handleDel = ({ id }) => {
    Modal.confirm({
      title: "确定删除？",
      icon: <ExclamationCircleOutlined />,
      content: "删除后无法恢复",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        let { success, message: msg } = await deleteAccess({ id });
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
      title: "接入名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "接入类型",
      dataIndex: "accessType",
      key: "accessType  ",
    },
    {
      title: "接入站点（个）",
      dataIndex: "stationNum",
      key: "stationNum  ",
    },
    {
      title: "接入数据",
      dataIndex: "accessDataName",
      key: "accessDataName",
    },
    {
      title: "最近接入时间",
      dataIndex: "latestAccessTime",
      key: "latestAccessTime",
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
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
      ...isModalOpen,
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
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== pageMsg.pagination?.pageSize) {
      setData([]);
    }
  };

  let inputwidtg = {
    width: "180px",
  };

  return (
    <div className="content-wrap">
      <Lbreadcrumb data={["数据接入", "接入管理"]} />

      <>
        <div className="search">
          <Form
            layout="inline"
            form={searchForm}
            onFinish={getPageData}
            autoComplete="off"
          >
            <Form.Item label="接入类型" name="accessTypeList">
              <Select
                style={inputwidtg}
                options={meta}
                placeholder="请选择"
                fieldNames={{
                  label: "dictLabel",
                  value: "dictValue",
                }}
                allowClear
                mode="multiple"
                maxTagCount="responsive"
              />
            </Form.Item>

            <Form.Item label="" name="name" getValueFromEvent={inputTrim}>
              <Input style={inputwidtg} placeholder="站点名称/站点编码" />
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
      </>

      {/* 弹出表单 */}
      {isModalOpen.form && (
        <OpForm
          open={isModalOpen.form}
          closeModal={closeModal}
          record={operate}
        />
      )}
    </div>
  );
}

export default InputSet;
