import React, { useState, useEffect } from "react";
import { Input, Button, Space, Table, Modal, Form, message } from "antd";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import {
  domesticPollutionSourcelist,
  domesticPollutionSourceupdate,
} from "@Api/set_msg_live_msg.js";
import { metaList } from "@Api/util.js";

function Index() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operate, setOperate] = useState(null); //正在操作id
  const [data, setData] = useState([]);
  const [detail, setDetail] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [meta, setMeta] = useState([]);
  const [year, setYear] = useState([]);

  useEffect(() => {
    const getMetaData = async () => {
      let { data } = await metaList({
        dictType: "domestic_pollution_source_type",
      });
      let nd = data.map((item) => ({
        value: item.dictValue,
        text: item.dictLabel,
      }));
      setMeta(nd);
    };
    getMetaData();
  }, []);

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

    let { data } = await domesticPollutionSourcelist({
      name,
    });
    console.log([...new Set(data.map((obj) => obj.year))]);
    setYear([...new Set(data.map((obj) => obj.year))]);

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

  // 详情
  const showDetail = (record) => {
    setOperate(record);
    setIsModalOpen(true);
    const getDetail = async () => {
      // let { data } = await stationInfo({
      //   id: record.id,
      // });
      setDetail(data);
    };
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
        let { success, message: msg } = await domesticPollutionSourceupdate({
          id,
        });
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
      title: "生活源名称",
      dataIndex: "name",
      key: "name",
      render: (value, record) => {
        return <a onClick={() => showDetail(record)}>{value}</a>;
      },
    },
    {
      title: "生活源类型",
      dataIndex: "typeName",
      key: "type",
      filters: meta,
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "年",
      dataIndex: "year",
      key: "year",
      filters: year.map((item) => ({ text: item, value: item })),
      onFilter: (value, record) => record.year === value,
    },

    {
      title: "生活煤炭（万吨）",
      dataIndex: "coal",
      key: "coal",
    },

    {
      title: "生活天然气（万吨）",
      dataIndex: "gas",
      key: "gas",
    },
    {
      title: "化学需氧量（万吨）",
      dataIndex: "cod",
      key: "cod",
    },
    {
      title: "氨氮（万吨）",
      dataIndex: "nh3n",
      key: "nh3n",
    },
    {
      title: "总氮（万吨）",
      dataIndex: "tn",
      key: "tn",
    },
    {
      title: "总磷（万吨）",
      dataIndex: "tp",
      key: "tp",
    },
    {
      title: "五日生化需氧量（万吨）",
      dataIndex: "bod",
      key: "bod",
    },
    {
      title: "动植物油（万吨）",
      dataIndex: "oil",
      key: "oil",
    },

    {
      title: "二氧化硫（万吨）",
      dataIndex: "so2",
      key: "so2",
    },
    {
      title: "氮氧化物（万吨）",
      dataIndex: "nox",
      key: "nox",
    },
    {
      title: "颗粒物（万吨）",
      dataIndex: "pm",
      key: "pm",
    },
    {
      title: "挥发性有机物（万吨）",
      dataIndex: "voc",
      key: "voc",
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

  //导出
  const download = async () => {
    setBtnLoading(true);
    try {
      // await pageAlarmLogExport({}, "消息记录");
    } catch (error) {}
    setBtnLoading(false);
  };
  return (
    <div className="content-wrap">
      <Lbreadcrumb data={["系统设置", "信息管理", "生活源信息库"]} />
      {!isModalOpen && (
        <>
          <div className="search">
            <div></div>
            <Space>
              <span>共计：30</span>
              <Button loading={btnLoading} onClick={download}>
                导出
              </Button>
            </Space>
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
    </div>
  );
}

export default Index;
