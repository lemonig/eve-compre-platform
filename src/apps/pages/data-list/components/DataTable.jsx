import React, { useState, useEffect } from "react";
import {
  Select,
  Button,
  Table,
  Form,
  Tooltip,
  PageHeader,
  Statistic,
  Modal,
  message,
} from "antd";
import LtimePicker from "@Components/LtimePicker";

function DataTable() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    getPageData();
  }, [JSON.stringify(pageMsg)]);

  const getPageData = () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();
  };

  // 查询
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

  return (
    <div>
      <div className="search">
        <Form layout="inline" form={searchForm} onFinish={search}>
          <Form.Item label="" name="statusList">
            <Select
              style={{ width: 120 }}
              placeholder="确认状态"
              options={[
                {
                  label: "待确认",
                  value: "1",
                },
                {
                  label: "已确认",
                  value: "2",
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="" name="time">
            <LtimePicker />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button>确认</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default DataTable;
