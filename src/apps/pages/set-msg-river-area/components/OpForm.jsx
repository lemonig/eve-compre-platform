import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
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
import Map from "@Components/Map";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";

import { fieldList as fieldListApi } from "@Api/set_meta_field.js";
import { inputTrim } from "@Utils/util";

import { riverTree } from "@Api/set_rival.js";
import { regionList, regionTree } from "@Api/set_region.js";
import {
  waterZoneget,
  waterZoneadd,
  waterZoneupdate,
} from "@Api/set_msg_river_area.js";
import { fileUpload } from "@Api/util.js";

function OpForm({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // 元数据
  const [originOptions, setOriginOptions] = useState([]);
  const [riverOptions, setRiverOptions] = useState([]);
  const [showMapVis, setShowMapVis] = useState(false);

  useEffect(() => {
    getFormFeild();
  }, []);

  /*****表格数据****/
  const getFormFeild = async () => {
    const getRiverPage = async () => {
      let { data } = await riverTree();

      setRiverOptions(data);
    };
    const getOriginPage = async () => {
      let { data } = await regionTree();
      setOriginOptions(data);
    };
    getRiverPage();
    getOriginPage();

    Promise.all([]).then((res) => {
      setTimeout(() => {
        if (!!record) {
          getDetail();
        }
      });
    });
  };

  const getDetail = async () => {
    let { data } = await waterZoneget({
      id: record.id,
    });
    data.valcodeTill = dayjs(data.valcodeTill);
    data.issuingDate = dayjs(data.issuingDate);
    data.attachment = data.attachment.map((item) => ({
      ...item,
      name: item.originalFilename,
    }));
    form.setFieldsValue(data);
  };

  /*******地图*******/
  const getPosition = () => {
    setShowMapVis(true);
  };

  //地图回调
  const closeMapModal = (flag) => {
    setShowMapVis(false);
    // if (flag) ();
  };
  const mapConfirm = (value) => {
    form.setFieldsValue({
      longitude: value.lng,
      latitude: value.lat,
    });
    setShowMapVis(false);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onFinish = async () => {
    let res = await form.validateFields();
    const values = form.getFieldsValue();

    if (values.issuingDate) {
      values.issuingDate = dayjs(values.issuingDate).format("YYYY-MM-DD");
    }
    if (values.valcodeTill) {
      values.valcodeTill = dayjs(values.valcodeTill).format("YYYY-MM-DD");
    }
    setLoading(true);
    // 编辑
    if (record?.id) {
      values.id = record.id;
      let { success, message: msg } = await waterZoneupdate(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      }
    } else {
      let { success, message: msg } = await waterZoneadd(values);
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
        title={`${record ? "编辑" : "新建"}地表水环境功能区`}
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
                label="一级功能区名称"
                name="parentName"
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
                label="一级功能区编码"
                name="parentCode"
                getValueFromEvent={inputTrim}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="一级功能区分类"
                name="parentType"
                rules={[
                  {
                    required: true,
                    message: "请选择",
                  },
                ]}
              >
                <MetaSelect dictType="function_zone_type_water_1_type" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="二级功能区名称"
                name="name"
                getValueFromEvent={inputTrim}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="二级功能区编码"
                name="code"
                getValueFromEvent={inputTrim}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="二级功能区分类" name="type">
                <MetaSelect dictType="function_zone_type_water_2_type" />
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
                  // dropdownRender={treeDropdownRender}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="河流"
                name="riverCode"
                rules={[
                  {
                    required: true,
                    message: "请输入",
                  },
                ]}
              >
                <TreeSelect
                  treeData={treeDropdownRender(riverOptions)}
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
                label="
                范围"
                name="range"
                getValueFromEvent={inputTrim}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="
                起始断面"
                name="initialSection"
                getValueFromEvent={inputTrim}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="
                终止断面"
                name="terminalSection"
                getValueFromEvent={inputTrim}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="长度">
                <Form.Item name="length" noStyle>
                  <InputNumber min={0} max={99999999} />
                </Form.Item>
                <span
                  className="ant-form-text"
                  style={{
                    marginLeft: 8,
                  }}
                >
                  km
                </span>
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
          <h2 className="second-title">控制级别</h2>

          <Row>
            <Col span={12}>
              <Form.Item label="是否国家级保护区" name="isCuntryLevel">
                <Select
                  options={[
                    {
                      label: "是",
                      value: true,
                    },
                    {
                      label: "否",
                      value: false,
                    },
                  ]}
                  placeholder="请选择"
                  allowClear
                  className="width-3"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="水质目标" name="waterQualityLevel">
                <MetaSelect dictType="water_quality_level" />
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

      {/* 地图 */}
      {showMapVis ? (
        <Map
          open={showMapVis}
          closeModal={closeMapModal}
          confirm={mapConfirm}
          value={{
            lat: form.getFieldValue("latitude"),
            lng: form.getFieldValue("longitude"),
          }}
        />
      ) : null}
    </>
  );
}

export default OpForm;
