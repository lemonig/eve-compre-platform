import React, { useState, useEffect } from "react";
import { Space, Table, Tag, Form, message, Tooltip, Switch } from "antd";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import PageHead from "@Components/PageHead";
import { statusFactor, listFactor } from "@Api/set_alarm_pub.js";

function SetStationAlarm({ record, open, closeModal }) {
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
  }, []);

  const getPageData = async () => {
    setLoading(true);
    let { data } = await listFactor({
      stationId: record.stationId,
    });
    setData(data);
    setLoading(false);
  };

  const handleStatusChange = async (checked, record) => {
    record.status = checked ? "1" : "0";
    let { success, message: msg } = await statusFactor({ id: record.id });
    if (success) {
      message.success(msg);
      setData([...data]);
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
      title: "因子名称",
      dataIndex: "factorName",
      key: "factorName",
    },
    {
      title: "单位",
      dataIndex: "unit",
      key: "unit",
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
  ];

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
        <Lbreadcrumb data={["数据运营", "数据报警", "报警规则"]} />
        <PageHead title={record.name ?? ""} onClick={() => closeModal()} />

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey={(record) => record.id}
          pagination={pageMsg.pagination}
          onChange={handleTableChange}
        />
      </div>
    </>
  );
}

export default SetStationAlarm;
