import React, { useState, useEffect } from "react";
import { Input, Modal, Form, message, Row, Col } from "antd";
import StationSelect from "@Components/StationSelect";
import { stationPage } from "@Api/set_station.js";

import { addGroup, updateGroup, getGroup } from "@Api/set_alarm_station.js";

function GroupCreate({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [stationList, setStationList] = useState([]);

  useEffect(() => {
    if (!!record) {
      getPageData();
    }
    getStationList();
  }, []);
  const getPageData = async () => {
    let { data } = await getGroup({
      id: record.id,
    });
    setTimeout(() => {
      form.setFieldsValue(data);
    }, 0);
  };

  const getStationList = async () => {
    const { data } = await stationPage({
      page: 1,
      size: 10000,
    });
    let idata = data.map((item, idx) => ({
      ...item,
      idx: idx + 1,
      key: item.id,
    }));
    setStationList(idata);
  };

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    // 编辑

    if (record?.id) {
      values.id = record.id;
      let { success, message: msg } = await updateGroup(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      } else {
        message.error(msg);
      }
    } else {
      let { success, message: msg } = await addGroup(values);
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
    <Modal
      title={`${record ? "编辑" : "新建"}站点组`}
      open={open}
      onOk={handleOk}
      onCancel={() => closeModal(false)}
      maskClosable={false}
      confirmLoading={loading}
      width={888}
    >
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        autoComplete="off"
        form={form}
        colon={false}
        layout="vertical"
      >
        <Row>
          <Col span={12}>
            <Form.Item
              label="分组名称"
              name="name"
              rules={[
                {
                  required: true,
                  message: "请选择",
                },
              ]}
            >
              <Input className="width-3" placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注" name="remark">
              <Input className="width-3" placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              name="stationIds"
              wrapperCol={{
                span: 24,
              }}
            >
              <StationSelect options={stationList} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default GroupCreate;
