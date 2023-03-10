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
import { onlineUpdate } from "@Api/set_station_online.js";
import { frequenceList } from "@Utils/data";

function OpForm({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!Array.isArray(record)) {
      form.setFieldsValue({
        checkFrequency: record.checkFrequency,
      });
    }
  }, []);

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    // 编辑
    values.idList = Array.isArray(record) ? record : [record.id];
    let { success, message: msg } = await onlineUpdate(values);
    if (success) {
      message.success(msg);
      closeModal(true);
    } else {
      message.error(msg);
    }

    // 添加
    setLoading(false);
  };

  return (
    <>
      <Modal
        title="设置"
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
          {Array.isArray(record) ? null : (
            <Form.Item label="站点名称" name="">
              <span>{record.name}</span>
            </Form.Item>
          )}

          <Form.Item
            label="检查频率"
            name="checkFrequency"
            rules={[
              {
                required: true,
                message: "请选择",
              },
            ]}
          >
            <Select
              options={frequenceList}
              placeholder="请选择"
              fieldNames={{
                label: "text",
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default OpForm;
