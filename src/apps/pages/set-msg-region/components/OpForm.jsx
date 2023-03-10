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
  PageHeader,
  DatePicker,
  Checkbox,
} from "antd";
import IconFont from "@Components/IconFont";
import { regionAdd, regionUpdate, regionGet } from "@Api/set_region.js";
import { inputTrim } from "@Utils/util";
import { metaList } from "@Api/util.js";

function OpForm({ record, open, closeModal, precord }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    getMetaData();
  }, []);

  const getMetaData = async () => {
    let { data } = await regionGet({
      id: record.id,
    });
    setData(data);
    if (!!record) {
      form.setFieldsValue(record);
    }
  };

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    // 编辑
    if (precord) {
      values.parentCode = precord.code;
    }
    if (record?.id) {
      values.id = record.id;
      let { success, message: msg } = await regionUpdate(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      } else {
        message.error(msg);
      }
    } else {
      let { success, message: msg } = await regionAdd(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      } else {
        message.error(msg);
      }
    }
    // 添加
    setLoading(false);
  };

  return (
    <>
      <Modal
        title={record ? "编辑" : "新建"}
        open={open}
        onOk={handleOk}
        onCancel={() => closeModal(false)}
        maskClosable={false}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          autoComplete="off"
          form={form}
          colon={false}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[
              {
                required: true,
                message: "请输入",
              },
            ]}
            getValueFromEvent={inputTrim}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            label="编码"
            name="code"
            rules={[
              {
                required: true,
                message: "请输入",
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="展示次序" name="orderNum">
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default OpForm;
