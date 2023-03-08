import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  Space,
  Table,
  Tag,
  Modal,
  Form,
  message,
  Tooltip,
  Switch,
} from "antd";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import IconFont from "@Components/IconFont";
import OpForm from "./components/OpForm";
import { riverUpdate, riverList } from "@Api/set_rival.js";
import ChildGroup from "./components/ChildGroup";
const { Option } = Select;

function SetMsgRiver() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState({
    modal: false,
    child: false,
  });
  const [operate, setOperate] = useState(null); //正在操作id

  const [data, setData] = useState([]);

  useEffect(() => {
    getPageData();
  }, []);

  const showModal = () => {
    setIsModalOpen({
      ...isModalOpen,
      modal: true,
    });
  };

  const getPageData = async () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();
    let { data } = await riverList(values);
    setData(data);
    setLoading(false);
  };

  // 新建
  const handleAdd = () => {
    setOperate(null);
    setIsModalOpen({
      ...isModalOpen,
      modal: true,
    });
  };
  // 编辑
  const handleEdit = (record) => {
    setOperate(record);
    setIsModalOpen({
      ...isModalOpen,
      modal: true,
    });
  };
  //
  const handleChild = (record) => {
    setOperate(record);
    setIsModalOpen({
      ...isModalOpen,
      child: true,
    });
  };

  const columns = [
    {
      title: "序号",
      key: "index",
      width: 60,
      render: (_, record, index) => index + 1,
    },
    {
      title: "分组名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "分组编码",
      dataIndex: "code",
      key: "code  ",
    },
    {
      title: "站点数量（个）",
      dataIndex: "stationNum",
      key: "stationNum  ",
    },
    {
      title: "子分组（个）",
      dataIndex: "childrenNum",
      key: "childrenNum",
      render: (value, record) => (
        <Space>
          <a onClick={() => handleChild(record)}>{value}</a>
        </Space>
      ),
    },

    {
      title: "操作",
      key: "operation",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleEdit(record)}>删除</a>
        </Space>
      ),
    },
  ];

  //表单回调
  const closeModal = (flag) => {
    // flag 确定还是取消
    setOperate(null);
    setIsModalOpen({
      modal: false,
      child: false,
    });
    if (flag) getPageData();
  };
  return (
    <div className="content-wrap">
      <Lbreadcrumb data={["系统设置", "站点管理", "站点分组"]} />
      {!isModalOpen.modal && !isModalOpen.child && (
        <>
          <div className="search">
            <Form layout="inline" form={searchForm} onFinish={getPageData}>
              <Form.Item label="" name="name">
                <Input
                  placeholder="分组名称/分组编码"
                  className="width-18"
                  // value={searchVal}
                />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button onClick={handleAdd}>新建</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey={(record) => record.id}
          />
        </>
      )}
      {/* 弹出表单 */}
      {isModalOpen.modal && (
        <OpForm
          open={isModalOpen.modal}
          closeModal={closeModal}
          record={operate}
        />
      )}
      {isModalOpen.child && (
        <ChildGroup
          open={isModalOpen.child}
          pcloseModal={closeModal}
          precord={operate}
        />
      )}
    </div>
  );
}

export default SetMsgRiver;
