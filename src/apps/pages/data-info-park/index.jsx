import React, { useState, useEffect } from "react";
import { Input, Button, Space, Table, Modal, Form, message } from "antd";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import DrawerDetail from "@Shared/DrawerDetail";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { listPark, deletePark } from "@Api/set_msg_park.js";

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

    let { data } = await listPark({
      name,
    });
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

  // 删除
  const handleDel = ({ id }) => {
    Modal.confirm({
      title: "确定删除？",
      icon: <ExclamationCircleOutlined />,
      content: "删除后无法恢复",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        let { success, message: msg } = await deletePark({ id });
        if (success) {
          message.success(msg);
          setIsModalOpen(false);
          getPageData();
        }
      },
    });
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
      title: "园区名称",
      dataIndex: "name",
      key: "name",
      render: (value, record) => {
        return <a onClick={() => showDetail(record)}>{value}</a>;
      },
    },
    {
      title: "园区编码",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "园区分类",
      dataIndex: "typeName",
      key: "type",
    },
    {
      title: "园区级别",
      dataIndex: "levelName",
      key: "level",
    },
    {
      title: "园区风险等级",
      dataIndex: "riskLevelName",
      key: "riskLevel",
    },
    {
      title: "面积（km2）",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "企业数量（个）",
      dataIndex: "companyCount",
      key: "companyCount",
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
      <Lbreadcrumb data={["系统设置", "信息管理", "园区"]} />
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
      {isModalOpen && (
        <DrawerDetail
          open={isModalOpen}
          closeModal={closeModal}
          record={operate}
        />
      )}
    </div>
  );
}

export default Index;
