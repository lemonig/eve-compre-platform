import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Form,
  message,
  DatePicker,
  Col,
  Row,
  Upload,
  InputNumber,
} from "antd";
import PageHead from "@Components/PageHead";
import MetaSelect from "@Shared/MetaSelect";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import { inputTrim } from "@Utils/util";

import {
  domesticPollutionSourceget,
  domesticPollutionSourceupdate,
  domesticPollutionSourceadd,
} from "@Api/set_msg_live_msg.js";
import { fileUpload } from "@Api/util.js";

function OpForm({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // 元数据

  useEffect(() => {
    getFormFeild();
  }, []);

  /*****表格数据****/
  const getFormFeild = async () => {
    Promise.all([]).then((res) => {
      setTimeout(() => {
        if (!!record) {
          getDetail();
        }
      });
    });
  };

  const getDetail = async () => {
    let { data } = await domesticPollutionSourceget({
      id: record.id,
    });
    if (data.year) {
      data.year = dayjs(data.year);
    }
    data.attachment = data.attachment.map((item) => ({
      ...item,
      name: item.originalFilename,
    }));
    form.setFieldsValue(data);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onFinish = async () => {
    let res = await form.validateFields();
    const values = form.getFieldsValue();

    if (values.year) {
      values.year = dayjs(values.year).format("YYYY");
    }

    setLoading(true);
    // 编辑
    if (record?.id) {
      values.id = record.id;
      let { success, message: msg } = await domesticPollutionSourceupdate(
        values
      );
      if (success) {
        message.success(msg);
        closeModal(true);
      }
    } else {
      let { success, message: msg } = await domesticPollutionSourceadd(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      }
    }
    // 添加
    setLoading(false);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const customRequest = async ({ file, onSuccess, onError, data }) => {
    const formData = new FormData();
    formData.append("file", file);
    let headers = {
      "Content-Type":
        "multipart/form-data; boundary=----WebKitFormBoundaryGMA3AgU3lRxaQE0K",
    };
    const res = await fileUpload(formData, headers);
    res.data.name = res.data.originalFilename;
    let attachment = form.getFieldValue("attachment");
    attachment.splice(attachment.length - 1, 1, res.data);
    form.setFieldsValue({
      attachment: attachment,
    });
    onSuccess();
  };

  return (
    <>
      <PageHead
        title={`${record ? "编辑" : "新建"}生活信息库`}
        onClick={() => closeModal(false)}
      />

      {open && (
        <Form
          name="basic"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          autoComplete="off"
          form={form}
          colon={false}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <h2 className="second-title">基本信息</h2>
          <Row>
            <Col span={12}>
              <Form.Item
                label="名称"
                name="name"
                getValueFromEvent={inputTrim}
                rules={[
                  {
                    required: true,
                    message: "请输入",
                  },
                ]}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="生活源类型"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "请选择",
                  },
                ]}
              >
                <MetaSelect dictType="domestic_pollution_source_type" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="年"
                name="year"
                rules={[
                  {
                    required: true,
                    message: "请选择",
                  },
                ]}
              >
                <DatePicker format="YYYY年" picker="year" />
              </Form.Item>
            </Col>
          </Row>
          <h2 className="second-title">生活能源消费量</h2>
          <Row>
            <Col span={12}>
              <Form.Item label="生活煤炭">
                <Form.Item name="coal" noStyle>
                  <InputNumber min={0} max={99999999} />
                </Form.Item>
                <span
                  className="ant-form-text"
                  style={{
                    marginLeft: 8,
                  }}
                >
                  万吨
                </span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="生活天然气">
                <Form.Item name="gas" noStyle>
                  <InputNumber min={0} max={99999999} />
                </Form.Item>
                <span
                  className="ant-form-text"
                  style={{
                    marginLeft: 8,
                  }}
                >
                  万吨
                </span>
              </Form.Item>
            </Col>
          </Row>
          <h2 className="second-title">水污染物排放量</h2>
          <Row>
            <Col span={12}>
              <Form.Item label="化学需氧量">
                <Form.Item name="cod" noStyle>
                  <InputNumber min={0} max={99999999} />
                </Form.Item>
                <span
                  className="ant-form-text"
                  style={{
                    marginLeft: 8,
                  }}
                >
                  万吨
                </span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="氨氮">
                <Form.Item name="nh3n" noStyle>
                  <InputNumber min={0} max={99999999} />
                </Form.Item>
                <span
                  className="ant-form-text"
                  style={{
                    marginLeft: 8,
                  }}
                >
                  万吨
                </span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="总氮">
                <Form.Item name="tn" noStyle>
                  <InputNumber min={0} max={99999999} />
                </Form.Item>
                <span
                  className="ant-form-text"
                  style={{
                    marginLeft: 8,
                  }}
                >
                  万吨
                </span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="总磷
"
              >
                <Form.Item name="tp" noStyle>
                  <InputNumber min={0} max={99999999} />
                </Form.Item>
                <span
                  className="ant-form-text"
                  style={{
                    marginLeft: 8,
                  }}
                >
                  万吨
                </span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="五日生化需氧量">
                <Form.Item name="bod" noStyle>
                  <InputNumber min={0} max={99999999} />
                </Form.Item>
                <span
                  className="ant-form-text"
                  style={{
                    marginLeft: 8,
                  }}
                >
                  万吨
                </span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="动植物油
"
              >
                <Form.Item name="oil" noStyle>
                  <InputNumber min={0} max={99999999} />
                </Form.Item>
                <span
                  className="ant-form-text"
                  style={{
                    marginLeft: 8,
                  }}
                >
                  万吨
                </span>
              </Form.Item>
            </Col>
          </Row>
          <h2 className="second-title">大气污染物排放量</h2>
          <Row>
            <Col span={12}>
              <Form.Item label="二氧化硫">
                <Form.Item name="so2" noStyle>
                  <InputNumber min={0} max={99999999} />
                </Form.Item>
                <span
                  className="ant-form-text"
                  style={{
                    marginLeft: 8,
                  }}
                >
                  万吨
                </span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="氮氧化物
"
              >
                <Form.Item name="nox" noStyle>
                  <InputNumber min={0} max={99999999} />
                </Form.Item>
                <span
                  className="ant-form-text"
                  style={{
                    marginLeft: 8,
                  }}
                >
                  万吨
                </span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="颗粒物">
                <Form.Item name="pm" noStyle>
                  <InputNumber min={0} max={99999999} />
                </Form.Item>
                <span
                  className="ant-form-text"
                  style={{
                    marginLeft: 8,
                  }}
                >
                  万吨
                </span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="挥发性有机物

"
              >
                <Form.Item name="voc" noStyle>
                  <InputNumber min={0} max={99999999} />
                </Form.Item>
                <span
                  className="ant-form-text"
                  style={{
                    marginLeft: 8,
                  }}
                >
                  万吨
                </span>
              </Form.Item>
            </Col>
          </Row>

          <h2 className="second-title">其他</h2>
          <Row>
            <Col span={12}>
              <Form.Item label="备注" name="remark">
                <Input.TextArea className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="attachment"
                label="附件"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="最多上传十个附件"
              >
                <Upload
                  name="file"
                  customRequest={customRequest}
                  listType="text"
                >
                  <Button icon={<UploadOutlined />}> 上传附件</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label=" ">
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
}

export default OpForm;
