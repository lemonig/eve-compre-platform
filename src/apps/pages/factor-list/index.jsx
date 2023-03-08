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
import { factorPage, factorUpdate } from "@Api/set_factor_list.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

function FactorList() {
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

  useEffect(() => {
    getPageData();
  }, [JSON.stringify(pageMsg)]);
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
    let { additional_data, data } = await factorPage({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: values,
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

  const handleStatusChange = async (checked, record) => {
    let { success, message: msg } = await factorUpdate({
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
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "单位",
      dataIndex: "unit",
      key: "unit  ",
    },
    {
      title: "字段编码",
      dataIndex: "showField",
      key: "showField  ",
    },
    {
      title: "国家协议编号",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "业务主题",
      dataIndex: "topicTypeName",
      key: "topicTypeName",
    },
    {
      title: "因子类型",
      dataIndex: "factorTypeName",
      key: "factorTypeName",
    },
    {
      title: "小时修约位数",
      dataIndex: "hourDecimal",
      key: "latestLoginTime",
    },
    {
      title: "均值修约位数",
      dataIndex: "avgDecimal",
      key: "avgDecimal",
    },
    {
      title: "检出上限",
      dataIndex: "validUpside",
      key: "validUpside",
    },
    {
      title: "检出下限",
      dataIndex: "validDownside",
      key: "validDownside",
    },

    {
      title: "启用状态",
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
  return (
    <div className="content-wrap">
      <Lbreadcrumb data={["系统设置", "因子管理", "因子列表"]} />

      {!isModalOpen.form && (
        <>
          <div className="search">
            <Form
              layout="inline"
              form={searchForm}
              onFinish={getPageData}
              autoComplete="off"
            >
              <Form.Item label="" name="name">
                <Input
                  placeholder="因子名称/国家协议编号"
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
        </>
      )}

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

export default FactorList;
