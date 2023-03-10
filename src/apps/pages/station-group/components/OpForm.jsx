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
import { groupAdd, groupUpdate, groupGet } from "@Api/set_station_group.js";
import StationSelect from "@Components/StationSelect";
import { stationPage } from "@Api/set_station.js";

//precord 父 --> code
function OpForm({ record, open, closeModal, precord }) {
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
    let { data } = await groupGet({
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
    // son or p
    if (precord) {
      values.parentCode = precord.code;
    }
    if (record?.id) {
      values.id = record.id;
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
        title={`${record ? "编辑" : "新建"}分组`}
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
              <Form.Item
                label="分组编码"
                name="code"
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
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="stationIdList"
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
