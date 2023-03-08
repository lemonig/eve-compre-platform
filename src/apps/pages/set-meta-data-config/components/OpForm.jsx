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
import { metadataAdd, metadataUpdate } from "@Api/set_meta_data.js";
import { inputTrim } from "@Utils/util";

function OpForm({ record, open, closeModal, dictType }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!!record) {
      form.setFieldsValue(record);
    }
  }, []);

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    values.dictType = dictType;
    // 编辑
    if (record?.id) {
      values.id = record.id;
      let { success, message: msg } = await metadataUpdate(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      } else {
        message.error(msg);
      }
    } else {
      let { success, message: msg } = await metadataAdd(values);
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
            name="dictLabel"
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

          <Form.Item label="编码" name="dictCode" getValueFromEvent={inputTrim}>
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label="数据值"
            name="dictValue"
            rules={[
              {
                required: true,
                message: "请输入",
              },
            ]}
          >
            <Input getValueFromEvent={inputTrim} placeholder="请输入" />
          </Form.Item>
          <Form.Item
            label="启用状态"
            name="status"
            rules={[
              {
                required: true,
                message: "请选择",
              },
            ]}
          >
            <Select
              options={[
                {
                  label: "是",
                  value: "1",
                },
                {
                  label: "否",
                  value: "0",
                },
              ]}
              placeholder="请选择"
            />
          </Form.Item>
          <Form.Item label="展示次序" name="orderNum">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default OpForm;
