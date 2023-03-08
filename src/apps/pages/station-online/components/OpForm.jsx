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
  Row,
  Col,
} from "antd";
import IconFont from "@Components/IconFont";
import { stationAdd, onlineUpdate } from "@Api/set_station_online.js";
import StationSelect from "@Components/StationSelect";
import { stationPage } from "@Api/set_station.js";

function OpForm({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [stationList, setStationList] = useState([]);

  useEffect(() => {
    getStationList();
    if (!!record) {
      form.setFieldsValue(record);
    }
  }, []);

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

  const frequenceList = [
    {
      label: "10分钟",
      value: 10,
    },

    {
      label: "3小时",
      value: 180,
    },
    {
      label: "6小时",
      value: 360,
    },
    {
      label: "24小时",
      value: 1440,
    },
  ];

  const onFrequenceChange = () => {};

  return (
    <>
      <Modal
        title="设置"
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
                  style={{ width: "300px" }}
                  onChange={onFrequenceChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="idList"
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
    </>
  );
}

export default OpForm;
