import React, { useState, useEffect } from "react";
import { Input, Select, Button, Space, Table, Form } from "antd";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import { pageDataShareLog } from "@Api/input_share.js";
import { inputTrim } from "@Utils/util";

function ShareLog() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    getPageData();
  }, [pageMsg.pagination.current, pageMsg.pagination.pageSize]);

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

  const getPageData = async () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();
    let { additional_data, data } = await pageDataShareLog({
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
      title: "调用参数",
      dataIndex: "requestBody",
      key: "requestBody",
    },
    {
      title: "调用ip",
      dataIndex: "requestIp",
      key: "requestIp",
    },
    {
      title: "调用时间",
      dataIndex: "requestTime",
      key: "requestTime",
    },
  ];

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
      <Lbreadcrumb data={["数据共享", "调用日志"]} />

      <>
        <div className="search">
          <Form
            layout="inline"
            form={searchForm}
            onFinish={getPageData}
            autoComplete="off"
          >
            <Form.Item label="" name="name" getValueFromEvent={inputTrim}>
              <Input style={inputwidtg} placeholder="站点名称/站点编码" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
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
    </div>
  );
}

export default ShareLog;
