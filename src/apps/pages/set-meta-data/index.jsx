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
import {
  metadataTypeUpdate,
  metadataTypePage,
  metadataTypeDelete,
} from "@Api/set_meta_data.js";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import SetMetaDataConfig from "../set-meta-data-config";

const { Option } = Select;

function SetMetaData() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState({
    modal: false,
    config: false,
  });
  const [operate, setOperate] = useState(null); //正在操作id
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    getPageData();
  }, [JSON.stringify(pageMsg)]);
  // 查询
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
  const showModal = () => {
    setIsModalOpen({
      ...isModalOpen,
      modal: true,
    });
  };

  const getPageData = async () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();
    let { additional_data, data } = await metadataTypePage({
      page: pageMsg.pagination.current,
      size: pageMsg.pagination.pageSize,
      data: values,
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

  // 删除
  const handleDel = ({ id }) => {
    Modal.confirm({
      title: "确定删除？",
      icon: <ExclamationCircleOutlined />,
      content: "删除后无法恢复",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        let { success, message: msg } = await metadataTypeDelete({ id });
        if (success) {
          message.success(msg);
          setIsModalOpen({
            ...isModalOpen,
            modal: false,
          });
          getPageData();
        } else {
          message.error(msg);
        }
      },
    });
  };

  // 编辑
  const handleConfig = (record) => {
    setOperate(record);
    setIsModalOpen({
      ...isModalOpen,
      config: true,
    });
  };

  const handleStatusChange = async (checked, record) => {
    record.status = checked ? "1" : "0";

    let { success, message: msg } = await metadataTypeUpdate(record);
    if (success) {
      message.success(msg);
      closeModal(true);
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
      title: "名称",
      dataIndex: "name",
      key: "name  ",
    },
    {
      title: "编码",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
    },

    {
      title: "展示次序",
      dataIndex: "orderNum",
      key: "orderNum",
    },

    {
      title: "操作",
      key: "operation",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleConfig(record)}>配置</a>
          <a onClick={() => handleDel(record)}>删除</a>
        </Space>
      ),
    },
  ];

  //表单回调
  const closeModal = (flag) => {
    // flag 确定还是取消
    setIsModalOpen({
      modal: false,
      config: false,
    });
    if (flag) getPageData();
  };
  const handleTableChange = (pagination, filters, sorter) => {
    // if filters not changed, don't update pagination.current
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
    <>
      {!isModalOpen.config && (
        <div className="content-wrap">
          <Lbreadcrumb data={["系统设置", "元数据管理", "业务元数据"]} />
          <div className="search">
            <Form layout="inline" form={searchForm} onFinish={getPageData}>
              <Form.Item label="" name="name">
                <Input
                  placeholder="业务元数据名称/编码"
                  style={{ width: 180 }}
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
            pagination={pageMsg.pagination}
            onChange={handleTableChange}
          />
          {/* 弹出表单 */}
          {isModalOpen.modal && (
            <OpForm
              open={isModalOpen.modal}
              closeModal={closeModal}
              record={operate}
            />
          )}
        </div>
      )}

      {/* 配置 */}
      {isModalOpen.config && (
        <SetMetaDataConfig
          configOpen={isModalOpen.config}
          configModal={closeModal}
          configData={operate}
        />
      )}
    </>
  );
}

export default SetMetaData;
