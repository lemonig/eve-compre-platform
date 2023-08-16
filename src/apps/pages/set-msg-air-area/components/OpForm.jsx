import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Form,
  message,
  Col,
  Row,
  TreeSelect,
  Upload,
  InputNumber,
} from "antd";
import PageHead from "@Components/PageHead";
import MetaSelect from "@Shared/MetaSelect";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import { fieldList as fieldListApi } from "@Api/set_meta_field.js";
import { inputTrim } from "@Utils/util";
import { regionList, regionTree } from "@Api/set_region.js";
import { riverTree } from "@Api/set_rival.js";
import { waterZonelist } from "@Api/set_msg_river_area.js";
import {
  airZoneget,
  airZoneupdate,
  airZoneadd,
} from "@Api/set_msg_air_area.js";
import { fileUpload } from "@Api/util.js";

function OpForm({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // 元数据
  const [originOptions, setOriginOptions] = useState([]);

  useEffect(() => {
    getFormFeild();
  }, []);

  /*****表格数据****/
  const getFormFeild = async () => {
    const getOriginPage = async () => {
      let { data } = await regionTree();
      setOriginOptions(data);
    };
    //3 水环境功能去
    const getwaterZonelist = async () => {
      let { data } = await waterZonelist();
      return data;
    };

    getOriginPage();

    Promise.all([getwaterZonelist()]).then((res) => {
      setTimeout(() => {
        if (!!record) {
          getDetail();
        }
      });
    });
  };

  const getDetail = async () => {
    let { data } = await airZoneget({
      id: record.id,
    });

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

    if (values.intakeDate) {
      values.intakeDate = dayjs(values.intakeDate).format("YYYY-MM-DD");
    }

    setLoading(true);
    // 编辑
    if (record?.id) {
      values.id = record.id;
      let { success, message: msg } = await airZoneupdate(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      }
    } else {
      let { success, message: msg } = await airZoneadd(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      }
    }
    // 添加
    setLoading(false);
  };

  let inputwidtg = {
    width: "300px",
  };

  const treeDropdownRender = (data) => {
    const data1 = data.map((item) => {
      if (item.children && item.children.length) {
        item.selectable = false;
        treeDropdownRender(item.children);
      }
      return item;
    });
    return data1;
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
        title={`${record ? "编辑" : "新建"}功能区`}
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
                label="功能区名称"
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
                label="功能区编码"
                name="code"
                getValueFromEvent={inputTrim}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="功能区分类"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "请选择",
                  },
                ]}
              >
                <MetaSelect dictType="function_zone_air_type" />
              </Form.Item>
            </Col>
          </Row>
          <h2 className="second-title">位置信息</h2>
          <Row>
            <Col span={12}>
              <Form.Item
                label="区域"
                name="regionCode"
                rules={[
                  {
                    required: true,
                    message: "请输入",
                  },
                ]}
              >
                <TreeSelect
                  treeData={treeDropdownRender(originOptions)}
                  fieldNames={{
                    label: "label",
                    value: "id",
                  }}
                  style={inputwidtg}
                  placeholder="请选择"
                />
              </Form.Item>
            </Col>
          </Row>
          <h2 className="second-title">功能区范围</h2>
          <Row>
            <Col span={12}>
              <Form.Item
                label="范围"
                name="range"
                getValueFromEvent={inputTrim}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="面积">
                <Form.Item name="area" noStyle>
                  <InputNumber min={0} max={99999999} />
                </Form.Item>
                <span
                  className="ant-form-text"
                  style={{
                    marginLeft: 8,
                  }}
                >
                  k㎡
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
