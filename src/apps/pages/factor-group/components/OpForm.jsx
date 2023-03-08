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
  Spin,
} from "antd";
import IconFont from "@Components/IconFont";
import FactorSelect from "@Components/FactorSelect";
import PageHead from "@Components/PageHead";
import { roleList as getroleList } from "@Api/util.js";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import { inputTrim } from "@Utils/util";

import StationSelect from "@Components/StationSelect";
import { groupGet, groupUpdate, groupAdd } from "@Api/set_factor_group.js";

function OpForm({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stationId, setStationId] = useState([]);
  const [roleList, setRoleList] = useState([]);

  useEffect(() => {
    getRoleList();
    if (!!record) {
      getPageData();
    } else {
      setLoading(false);
    }
  }, []);

  const getRoleList = async () => {
    let { data } = await getroleList();
    setRoleList(data);
  };

  const getPageData = async () => {
    let { data } = await groupGet({
      id: record.code,
    });
    form.setFieldsValue(data);
    setLoading(false);
  };

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setConfirmLoading(true);
    // 编辑
    if (record?.code) {
      values.id = record.code;
      let { success, message: msg } = await groupUpdate(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      } else {
        message.error(msg);
      }
    } else {
      let { success, message: msg } = await groupAdd(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      } else {
        message.error(msg);
      }
    }
    // 添加
    setConfirmLoading(false);
  };
  const stationCallback = (val) => {
    setStationId(val);
    setIsModalOpen(false);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  let inputwidtg = {
    width: "300px",
  };

  return (
    <>
      <Modal
        title={`${record ? "编辑" : "新建"}因子分组`}
        open={open}
        onOk={handleOk}
        onCancel={() => closeModal(false)}
        maskClosable={false}
        width={860}
        confirmLoading={confirmLoading}
      >
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <Spin></Spin>
          </div>
        ) : (
          <div>
            <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
              autoComplete="off"
              form={form}
              colon={false}
              layout="inline"
            >
              <Form.Item
                label="分组名称"
                name="name"
                getValueFromEvent={inputTrim}
                rules={[
                  {
                    required: true,
                    message: "请输入",
                  },
                ]}
              >
                <Input style={inputwidtg} placeholder="请输入" />
              </Form.Item>
              <Form.Item
                label="分组编码"
                name="code"
                getValueFromEvent={inputTrim}
                rules={[
                  {
                    required: true,
                    message: "请输入",
                  },
                ]}
              >
                <Input style={inputwidtg} placeholder="请输入" />
              </Form.Item>
              <Form.Item
                name="factorIdList"
                wrapperCol={{
                  span: 24,
                }}
                style={{
                  width: "100%",
                }}
              >
                <FactorSelect />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </>
  );
}

export default OpForm;
