import React, { useState, useEffect } from "react";
import {
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
import { ExclamationCircleOutlined, SettingOutlined } from "@ant-design/icons";
//interface
import {
  deleteGroup,
  pageGroup,
  statusGroup,
  smsStatusGroup,
  wxStatusGroup,
} from "@Api/set_alarm_rule.js";
//page
import AlarmGroup from "./page/AlarmGroup";
import AlarmStation from "./page/AlarmStation";
import StationPage from "./page/StationPage";
import AlarmGroupDetail from "./page/AlarmGroupDetail";

function SetAlarm() {
  const [loading, setLoading] = useState(false);
  const [operate, setOperate] = useState(null); //正在操作id
  const [data, setData] = useState([]);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [page, setPage] = useState({
    rGroup: false,
    sGroup: false,
    station: false,
    rules: false,
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

  const getPageData = async () => {
    setLoading(true);
    let { data, additional_data } = await pageGroup({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
    });
    setData(data);
    setLoading(false);
    if (pageMsg.total !== additional_data.pagination.total) {
      setPagemsg({
        ...pageMsg,
        pagination: {
          ...pageMsg.pagination,
          total: additional_data.pagination.total,
        },
      });
    }
  };

  // 编辑
  const handleEdit = (record) => {
    setOperate(record);
    openPage("rGroup", record);
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
          search();
        } else {
          message.error(msg);
        }
      },
    });
  };

  const handleStatusChange = async (checked, record) => {
    record.status = checked ? "1" : "0";
    let { success, message: msg } = await statusGroup(record);
    if (success) {
      message.success(msg);
    }
    console.log(data);
    setData([...data]);
  };

  const handleStatusChangewx = async (checked, record) => {
    record.status = checked ? "1" : "0";
    let { success, message: msg } = await wxStatusGroup(record);
    if (success) {
      message.success(msg);
    }
    setData([...data]);
  };

  const handleStatusChangesms = async (checked, record) => {
    record.status = checked ? "1" : "0";
    let { success, message: msg } = await smsStatusGroup(record);
    if (success) {
      message.success(msg);
    }

    setData([...data]);
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
      title: "规则组名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "规则数",
      dataIndex: "ruleNum",
      key: "ruleNum",
      render: (value, record) => (
        <a onClick={() => openPage("rules", record)}>{value}</a>
      ),
    },

    {
      title: "应用站点数",
      dataIndex: "stationNum",
      key: "stationNum",
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
      title: "短信通知",
      dataIndex: "enableSmsNotification",
      key: "enableSmsNotification",
      render: (value, record) => (
        <Switch
          disabled={!Number(record.status)}
          checked={!!Number(value)}
          onChange={(checked) => handleStatusChangesms(checked, record)}
        />
      ),
    },
    {
      title: "微信通知",
      dataIndex: "enableWxNotification",
      key: "enableWxNotification",
      render: (value, record) => (
        <Switch
          disabled={!Number(record.status)}
          checked={!!Number(value)}
          onChange={(checked) => handleStatusChangewx(checked, record)}
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
          <a onClick={() => handleDel(record)}>删除</a>
        </Space>
      ),
    },
  ];

  const closePage = (flag) => {
    // flag 确定还是取消
    setPage({
      rGroup: false,
      sGroup: false,
      station: false,
      rules: false,
    });
    if (flag) getPageData();
    setOperate(null); //清空操作项
  };
  const openPage = (flag, record) => {
    if (flag === "rGroup") {
      setPage({
        rGroup: true,
        sGroup: false,
        station: false,
        rules: false,
      });
      setOperate(record);
    } else if (flag === "sGroup") {
      setPage({
        rGroup: false,
        sGroup: true,
        station: false,
        rules: false,
      });
    } else if (flag === "station") {
      setPage({
        rGroup: false,
        sGroup: false,
        station: true,
        rules: false,
      });
    } else if (flag === "rules") {
      setPage({
        rGroup: false,
        sGroup: false,
        station: false,
        rules: true,
      });
      setOperate(record);
    } else {
      setPage({
        rGroup: false,
        sGroup: false,
        station: false,
        rules: false,
      });
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
    setPagemsg({
      ...pageMsg,
      pagination: {
        ...pagination,
      },
      filters,
      ...sorter,
    });
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== pageMsg.pagination?.pageSize) {
      setData([]);
    }
  };

  return (
    <>
      {!page.rGroup && !page.sGroup && !page.station && !page.rules && (
        <div className="content-wrap">
          <Lbreadcrumb data={["系统设置", "数据报警", "报警规则"]} />
          <div className="search">
            <Button type="primary" onClick={() => openPage("rGroup")}>
              创建规则组
            </Button>
            <Space>
              <a onClick={() => openPage("sGroup")}>
                <SettingOutlined />
                报警站点组管理
              </a>
              <a onClick={() => openPage("station")}>
                <SettingOutlined />
                报警站点管理
              </a>
            </Space>
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
      )}

      {/* 规则组 */}
      {page.rGroup && (
        <AlarmGroup open={page.rGroup} closePage={closePage} record={operate} />
      )}
      {page.sGroup && (
        <AlarmStation
          open={page.sGroup}
          closePage={closePage}
          record={operate}
        />
      )}
      {page.station && (
        <StationPage
          open={page.station}
          closePage={closePage}
          record={operate}
        />
      )}
      {page.rules && (
        <AlarmGroupDetail
          open={page.rules}
          closePage={closePage}
          record={operate}
        />
      )}
    </>
  );
}

export default SetAlarm;
