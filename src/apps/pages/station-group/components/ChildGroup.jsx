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
import OpForm from "./OpForm";
import { groupUpdate, groupList } from "@Api/set_station_group.js";
import PageHead from "@Components/PageHead";
const { Option } = Select;

function ChildGroup({ precord, pcloseModal }) {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operate, setOperate] = useState(null); //正在操作id

  const [data, setData] = useState([]);

  useEffect(() => {
    getPageData();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const getPageData = async () => {
    setLoading(true);
    let { data } = await groupList({
      parentCode: precord.code,
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
  //
  const handleChild = () => {};

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
    setIsModalOpen(false);
    if (flag) getPageData();
  };
  return (
    <div className="content-wrap">
      {!isModalOpen && (
        <>
          <PageHead title={precord.name} onClick={() => pcloseModal(false)} />
          <div className="search">
            <Form layout="inline" form={searchForm} onFinish={getPageData}>
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
      {isModalOpen && (
        <OpForm
          open={isModalOpen}
          closeModal={closeModal}
          record={operate}
          precord={precord}
        />
      )}
    </div>
  );
}

export default ChildGroup;
