import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  Space,
  Table,
  Modal,
  Form,
  message,
  Cascader,
} from "antd";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import { airZonedelete, airZonelist } from "@Api/set_msg_air_area.js";

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
    let { data } = await airZonelist({
      name,
    });
    setData(data);
    setLoading(false);
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
      title: "功能区名称",
      dataIndex: "name",
      key: "name",
      render: (value, record) => {
        return <a onClick={() => showDetail(record)}>{value}</a>;
      },
    },
    {
      title: "功能区编码",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "功能区分类",
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
      title: "范围",
      dataIndex: "range",
      key: "range",
    },
    {
      title: "面积（km2）",
      dataIndex: "area",
      key: "area",
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
      <Lbreadcrumb data={["系统设置", "信息管理", "空气质量功能区"]} />
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
