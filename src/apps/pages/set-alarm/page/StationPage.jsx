import React, { useState, useEffect } from "react";
import { Input, Select, Button, Space, Table, message, Switch } from "antd";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import PageHead from "@Components/PageHead";
import SetStationAlarm from "./SetStationAlarm";
import { pageStation, statusStation } from "@Api/set_alarm_pub.js";

const { Option } = Select;

function AlarmStation({ record, open, closePage }) {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operate, setOperate] = useState(null); //正在操作id
  const [searchVal, setSearchVal] = useState("");
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

  const getPageData = async () => {
    setLoading(true);
    let { additional_data, data } = await pageStation({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: searchVal,
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

  // 编辑
  const handleEdit = (record) => {
    setOperate(record);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (checked, record) => {
    record.status = checked ? "1" : "0";

    let { success, message: msg } = await statusStation({ id: record.id });
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
      title: "站点名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "业务主题",
      dataIndex: "topicType",
      key: "topicType",
    },
    {
      title: "站点类型",
      dataIndex: "stationType",
      key: "stationType",
    },

    {
      title: "管控级别",
      dataIndex: "controlLevel",
      key: "controlLevel",
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
      title: "乡镇街道",
      dataIndex: "region4",
      key: "region4",
    },
    {
      title: "建设厂家",
      dataIndex: "buildFactory",
      key: "buildFactory",
    },
    {
      title: "运维厂家",
      dataIndex: "operationFactory",
      key: "operationFactory",
    },
    {
      title: "报警因子",
      dataIndex: "alarmFactor",
      key: "alarmFactor",
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
      title: "操作",
      key: "operation",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>设置</a>
        </Space>
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
  const onNameChange = (event) => {
    setSearchVal(event.target.value);
  };

  return (
    <>
      {!isModalOpen && (
        <div className="content-wrap">
          <Lbreadcrumb data={["系统设置", "数据报警", "报警规则"]} />
          <PageHead title="报警站点" onClick={() => closePage(true)} />
          <div className="search">
            <Space>
              <Input
                placeholder="请输入站点名称"
                className="width-18"
                onChange={onNameChange}
              />
              <Button type="primary" onClick={getPageData}>
                查询
              </Button>
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

      {/* 报警站点 */}
      {isModalOpen && (
        <SetStationAlarm
          open={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          record={operate}
        />
      )}
    </>
  );
}

export default AlarmStation;
