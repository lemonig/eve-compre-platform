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
import { fieldUpdate, fieldList, fieldDelete } from "@Api/set_meta_field.js";
import { ExclamationCircleOutlined, SettingOutlined } from "@ant-design/icons";
import PageHead from "@Components/PageHead";
import GroupCreate from "../components/GroupCreate";

const { Option } = Select;

function AlarmStation({ record, open, closePage }) {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operate, setOperate] = useState(null); //正在操作id

  const [data, setData] = useState([]);

  const [page, setPage] = useState({
    rGroup: false,
    sGroup: false,
    station: false,
  });

  useEffect(() => {
    getPageData();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const getPageData = async () => {
    setLoading(true);
    let values = searchForm.getFieldsValue();
    let { data } = await fieldList(values);
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
        let { success, message: msg } = await fieldDelete({ id });
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

    let { success, message: msg } = await fieldUpdate(record);
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
      render: (_, record, index) => index + 1,
    },

    {
      title: "站点名称",
      dataIndex: "fieldGroupName",
      key: "fieldGroupName",
    },
    {
      title: "业务主题",
      dataIndex: "fieldGroupName",
      key: "fieldGroupName",
    },
    {
      title: "    站点类型",
      dataIndex: "fieldGroupName",
      key: "fieldGroupName",
    },

    {
      title: "管控级别",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "省份",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "城市",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "区县",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "乡镇街道",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "建设厂家",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "运维厂家",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "报警因子",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "是否启用",
      dataIndex: "isCommon",
      key: "isCommon",
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
          <a onClick={() => handleDel(record)}>设置</a>
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

  const openPage = (flag) => {
    if (flag === "rGroup") {
      setPage({
        rGroup: true,
        sGroup: false,
        station: false,
      });
    } else if (flag === "sGroup") {
      setPage({
        rGroup: false,
        sGroup: true,
        station: false,
      });
    } else if (flag === "station") {
      setPage({
        rGroup: false,
        sGroup: false,
        station: true,
      });
    } else {
      setPage({
        rGroup: false,
        sGroup: false,
        station: false,
      });
    }
  };

  return (
    <>
      <div className="content-wrap">
        <Lbreadcrumb data={["系统设置", "数据报警", "报警规则"]} />
        <PageHead title="报警站点" onClick={() => closePage(true)} />
        <div className="search">
          <Input
            placeholder="请输入站点名称"
            className="width-18"
            // value={searchVal}
          />
          <Button type="primary" onClick={handleAdd}>
            创建规则
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey={(record) => record.id}
        />
      </div>

      {/* 弹出表单 */}
      {isModalOpen && (
        <GroupCreate
          open={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          // record={operate}
        />
      )}
    </>
  );
}

export default AlarmStation;