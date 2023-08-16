import React, { useState, useEffect } from "react";
import { Input, Button, Space, Table, Modal, Form, message } from "antd";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import OpForm from "./components/OpForm";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { waterZonelist, waterZonedelete } from "@Api/set_msg_river_area.js";

function Index() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);

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

  const getPageData = async () => {
    setLoading(true);
    let { name } = searchForm.getFieldsValue();

    let { data } = await waterZonelist({
      name,
    });
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
        let { success, message: msg } = await waterZonedelete({ id });
        if (success) {
          message.success(msg);
          setIsModalOpen(false);
          getPageData();
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
      title: "一级功能区名称",
      dataIndex: "parentName",
      key: "parentName",
    },
    {
      title: "一级功能区编码",
      dataIndex: "parentCode",
      key: "parentCode",
    },
    {
      title: "一级功能区分类",
      dataIndex: "parentTypeName",
      key: "parentType  ",
    },
    {
      title: "二级功能区名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "二级功能区编码",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "二级功能区分类",
      dataIndex: "typeName",
      key: "type",
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
      title: "河流",
      dataIndex: "river3",
      key: "river3",
    },
    {
      title: "范围",
      dataIndex: "range",
      key: "range",
    },
    {
      title: "起始断面",
      dataIndex: "initialSection",
      key: "initialSection",
    },
    {
      title: "终止断面",
      dataIndex: "terminalSection",
      key: "terminalSection",
    },
    {
      title: "长度（km）",
      dataIndex: "length",
      key: "length",
    },
    {
      title: "面积（km2)",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "是否国家级功能区",
      dataIndex: "isCuntryLevel",
      key: "isCuntryLevel",
      render: (val) => (val ? "是" : "否"),
    },
    {
      title: "水质目标",
      dataIndex: "waterQualityLevel",
      key: "waterQualityLevel",
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
    console.log(filters);
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
      <Lbreadcrumb data={["系统设置", "信息管理", "地表水环境功能区"]} />
      {!isModalOpen && (
        <>
          <div className="search">
            <Form
              layout="inline"
              form={searchForm}
              onFinish={search}
              autoComplete="off"
            >
              <Form.Item label="" name="name">
                <Input placeholder="功能区名称/编码" className="width-18" />
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

export default Index;
