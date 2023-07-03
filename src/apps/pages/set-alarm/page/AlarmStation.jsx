import React, { useState, useEffect } from "react";
import {
  Select,
  Button,
  Space,
  Table,
  Modal,
  Form,
  message,
  Tooltip,
  Switch,
} from "antd";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import PageHead from "@Components/PageHead";
import GroupCreate from "../components/GroupCreate";

import { deleteGroup, statusGroup, pageGroup } from "@Api/set_alarm_station.js";

function AlarmStation({ record, open, closePage }) {
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
  }, [JSON.stringify(pageMsg.pagination.current, pageMsg.pagination.pageSize)]);

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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const getPageData = async () => {
    setLoading(true);
    let { additional_data, data } = await pageGroup({
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
        let { success, message: msg } = await deleteGroup({ id });
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
  const handleStatusChange = async (checked, record) => {
    record.status = checked ? "1" : "0";

    let { success, message: msg } = await statusGroup({ id: record.id });
    if (success) {
      message.success(msg);
      setData([...data]);
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
      title: "站点组名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "站点数",
      dataIndex: "stationNum",
      key: "stationNum",
    },
    {
      title: "规则组数",
      dataIndex: "ruleGroupNum",
      key: "ruleGroupNum  ",
      render: (value, record) => (
        <Tooltip title={record.ruleGroupTip}>{value}</Tooltip>
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
      title: "备注",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "创建时间",
      dataIndex: "gmtCreate",
      key: "gmtCreate",
    },
    {
      title: "修改时间",
      dataIndex: "gmtModify",
      key: "gmtModify",
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
        <Lbreadcrumb data={["系统设置", "数据报警", "报警规则"]} />
        <PageHead title={"报警站点组"} onClick={() => closePage(true)} />
        <div className="search">
          <Button type="primary" onClick={handleAdd}>
            创建站点组
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey={(record) => record.id}
          pagination={pageMsg.pagination}
          onChange={handleTableChange}
        />
      </div>

      {/* 弹出表单 */}
      {isModalOpen && (
        <GroupCreate
          open={isModalOpen}
          closeModal={closeModal}
          record={operate}
        />
      )}
    </>
  );
}

export default AlarmStation;
