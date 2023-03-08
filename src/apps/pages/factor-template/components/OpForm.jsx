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
import Lbreadcrumb from "@Components/Lbreadcrumb";
import { inputTrim } from "@Utils/util";

import StationSelect from "@Components/StationSelect";
import {
  templateGet,
  templateUpdate,
  templateAdd,
} from "@Api/set_factor_template.js";
import { standardList, standardDelete } from "@Api/set_meta_standrad.js";

function OpForm({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [confirmLoading, setConfrimLoading] = useState(false);

  const [standList, setStandardList] = useState([]);

  useEffect(() => {
    if (!!record) {
      getPageData();
    } else {
      setLoading(false);
    }
    getRoleList();
  }, []);

  const getRoleList = async () => {
    let { data: meatdata } = await standardList();

    setStandardList(meatdata);
  };

  const getPageData = async () => {
    let { data } = await templateGet({
      id: record.code,
    });
    form.setFieldsValue(data);
    setLoading(false);
  };

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setConfrimLoading(true);
    // 编辑
    if (record) {
      values.id = record.code;
      let { success, message: msg } = await templateUpdate(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      } else {
        message.error(msg);
      }
    } else {
      let { success, message: msg } = await templateAdd(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      } else {
        message.error(msg);
      }
    }
    // 添加
    setConfrimLoading(false);
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
        title={`${record ? "编辑" : "新建"}因子模板`}
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
                label="模板名称"
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
                label="评价标准"
                name="evaluatePlan"
                rules={[
                  {
                    required: true,
                    message: "请选择",
                  },
                ]}
              >
                <Select
                  options={standList}
                  placeholder="请选择"
                  style={inputwidtg}
                  fieldNames={{
                    label: "name",
                    value: "id",
                  }}
                  allowClear
                  mode="multiple"
                  maxTagCount="responsive"
                />
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
