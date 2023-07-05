import React, { useState, useEffect } from "react";
import { Space, Table, Form, Button } from "antd";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import { exportRecord } from "@Api/operate_time_report.js";
import PageHead from "@Components/PageHead";

function OperateExportHistory({ isRouter = true, closeModal }) {
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
  }, [JSON.stringify(pageMsg.pagination.current, pageMsg.pagination.pageSize)]);

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
    let { data, additional_data } = await exportRecord({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
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
      title: "文件名",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "状态",
      dataIndex: "statusName",
      key: "statusName",
    },

    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },

    {
      title: "操作",
      key: "operation",
      fixed: "right",
      render: (_, record) => {
        if (record.status == "0") {
          return "-";
        } else if (record.status == "1") {
          return <a href={record.fileUrl}>下载</a>;
        } else {
          return (
            <a style={{ cursor: "not-allowed", color: "rgba(0,0,0,0.24)" }}>
              下载
            </a>
          );
        }
      },
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

  return (
    <div className="content-wrap">
      {isRouter ? <Lbreadcrumb data={["数据运营", "导出记录"]} /> : null}
      <div className="search">
        {!isRouter ? (
          <PageHead title="返回" onClick={() => closeModal(true)} />
        ) : (
          <div></div>
        )}
        <Button type="default" onClick={search}>
          刷新
        </Button>
      </div>
      <p style={{ marginBottom: "15px" }}>
        导出的文件只存储3天，失效文件无法下载
      </p>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={pageMsg.pagination}
        onChange={onTableChange}
      />
    </div>
  );
}

export default OperateExportHistory;
