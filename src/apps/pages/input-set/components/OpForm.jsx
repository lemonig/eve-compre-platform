import React, { useState, useEffect } from "react";
import { Input, Select, Button, Modal, Form, message } from "antd";

import { inputTrim } from "@Utils/util";
import { updateAccess, addAccess, getAccess } from "@Api/input_set.js";
import StationForm from "./StationForm";
import { metaList } from "@Api/util.js";

function OpForm({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stationId, setStationId] = useState([]);
  const [meta, setMeta] = useState([]);

  useEffect(() => {
    const getMetaData = async () => {
      let { data } = await metaList({
        dictType: "accessType",
      });
      return data;
    };
    const getMetaData1 = async () => {
      let { data } = await metaList({
        dictType: "accessData",
      });
      return data;
    };

    Promise.all([getMetaData(), getMetaData1()]).then((res) => {
      setMeta(res);
      // if (!!record) {
      //   form.setFieldsValue(record);
      // }
    });

    if (!!record) getPageData();
  }, []);

  const getPageData = async () => {
    let { data } = await getAccess({
      id: record.id,
    });
    form.setFieldsValue(data);
    setStationId(data.stationIdList);
  };

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    values.stationIdList = stationId;
    setLoading(true);
    // 编辑
    if (record?.id) {
      values.id = record.id;
      let { success, message: msg } = await updateAccess(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      } else {
        message.error(msg);
      }
    } else {
      let { success, message: msg } = await addAccess(values);
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
  const stationFormOk = (val) => {
    setStationId(val);
    setIsModalOpen(false);
  };
  const stationFormCancel = () => {
    setIsModalOpen(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  let inputwidth = {
    width: "180px",
  };
  const validatFactor = () => {
    if (stationId.length === 0) {
      return Promise.reject(new Error("请选择"));
    }
    return Promise.resolve();
  };

  return (
    <>
      <Modal
        title={record ? "编辑接入" : "新建接入"}
        open={open}
        onOk={handleOk}
        onCancel={() => closeModal(false)}
        maskClosable={false}
        confirmLoading={loading}
      >
        <Form
          name="basic"
          autoComplete="off"
          form={form}
          colon={false}
          layout="vertical"
        >
          <Form.Item
            label="接入名称"
            name="name"
            getValueFromEvent={inputTrim}
            rules={[
              {
                required: true,
                message: "请输入",
              },
            ]}
          >
            <Input style={inputwidth} placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label="接入类型"
            name="accessType"
            rules={[
              {
                required: true,
                message: "请选择",
              },
            ]}
          >
            <Select
              className="width-3"
              options={meta[0]}
              placeholder="请选择"
              fieldNames={{
                label: "dictLabel",
                value: "dictValue",
              }}
            />
          </Form.Item>

          <Form.Item required label={<span>接入站点 &nbsp;</span>}>
            <span className="ant-form-text">
              已选择{stationId.length}个站点
            </span>
            <Form.Item
              name="stationIdList"
              noStyle
              rules={[
                {
                  validator: validatFactor,
                },
              ]}
            >
              <a onClick={() => setIsModalOpen(true)}>选择站点</a>
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="接入数据"
            name="accessData"
            rules={[
              {
                required: true,
                message: "请选择",
              },
            ]}
          >
            <Select
              className="width-3"
              options={meta[1]}
              placeholder="请选择"
              fieldNames={{
                label: "dictLabel",
                value: "dictValue",
              }}
            />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="请输入" />
          </Form.Item>
        </Form>
        {/* 弹出表单 */}
        {isModalOpen && (
          <StationForm
            open={isModalOpen}
            onOK={stationFormOk}
            onCancel={stationFormCancel}
            list={stationId}
          />
        )}
      </Modal>
    </>
  );
}

export default OpForm;
