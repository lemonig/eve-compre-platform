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
import {
  standardAdd,
  standardUpdate,
  standardGet,
} from "@Api/set_meta_standrad.js";
import { evaluteList } from "@Api/set_meta_evalute.js";

import { inputTrim } from "@Utils/util";

function OpForm({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [evelute, setEvalute] = useState([]);

  useEffect(() => {
    getDetail();
    getEvaluteList();
  }, []);

  const getDetail = async () => {
    let { data } = await standardGet({
      id: record.id,
    });
    form.setFieldsValue(data);
  };
  const getEvaluteList = async () => {
    let { data } = await evaluteList();
    setEvalute(data);
  };

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    // 编辑
    if (record?.id) {
      values.id = record.id;
      let { success, message: msg } = await standardUpdate(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      } else {
        message.error(msg);
      }
    } else {
      let { success, message: msg } = await standardAdd(values);
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
        title={record ? "编辑评价标准" : "新建评价标准"}
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
            label="标准名称"
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
          <Form.Item label="适用评价指标" name="evaluateIndexIdList">
            <Select
              options={evelute}
              placeholder="请选择"
              fieldNames={{
                label: "name",
                value: "id",
              }}
              allowClear
              mode="multiple"
              maxTagCount="responsive"
            />
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
