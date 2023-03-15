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
import { queryStation, searchMeta } from "@Api/data-list.js";
import FiledSelect from "@Components/FiledSelect";
import dayjs from "dayjs";

function DataTable({ stationMsg, menuMsg }) {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [metaData, setMetaData] = useState({
    computeDataLevel: [],
    dataSource: [],
  });

  useEffect(() => {}, []);
  useEffect(() => {
    if (stationMsg.key) {
      getPageData();
      getMetaData();
    }
  }, [
    JSON.stringify(pageMsg),
    JSON.stringify(stationMsg),
    JSON.stringify(menuMsg),
  ]);

  const getMetaData = async () => {
    let { data } = await searchMeta({
      id: menuMsg.key,
    });
    setMetaData(data);
  };

  const getPageData = async () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();
    console.log(values);
    let { additional_data, data } = await queryStation({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: {
        beginTime: "2023-02-19 00:00:00",
        endTime: "2023-02-21 00:00:00",
        timeType: "mm",
        dataSource: "1",
        stationId: 1,
        showFieldList: ["f_5", "f_6", "f_1"],
      },
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
    let newCol = additional_data.columnList.map((item) => {
      return {
        title: item.label,
        dataIndex: item.key,
        key: item.key,
      };
    });
    setColumns(newCol);
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
    <div>
      <div className="search">
        <Form
          layout="inline"
          form={searchForm}
          onFinish={search}
          initialValues={{
            time: {
              startTime: dayjs().subtract(1, "month"),
              endTime: dayjs(),
            },
          }}
        >
          <Form.Item label="" name="statusList">
            <Select
              style={{ width: 120 }}
              placeholder="确认状态"
              options={metaData?.dataSource}
            />
          </Form.Item>
          <Form.Item label="" name="time">
            <LtimePicker options={metaData?.computeDataLevel} />
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
        <FiledSelect />
      </div>
      {columns.length ? (
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey={(record) => record.id}
          pagination={pageMsg.pagination}
          onChange={handleTableChange}
        />
      ) : null}
    </div>
  );
}

export default DataTable;
