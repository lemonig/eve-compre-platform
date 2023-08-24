import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Space,
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
import { inputTrim } from "@Utils/util";
import { regionTree } from "@Api/set_region.js";
import { listPark, getPark, updatePark, addPark } from "@Api/set_msg_park.js";
import { fileUpload } from "@Api/util.js";

function OpForm({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // 元数据
  const [originOptions, setOriginOptions] = useState([]);
  const [showMapVis, setShowMapVis] = useState(false);

  useEffect(() => {
    getFormFeild();
  }, []);

  /*****表格数据****/
  const getFormFeild = async () => {
    const getOriginPage = async () => {
      let { data } = await regionTree();
      setOriginOptions(data);
    };
    //0公司
    const getListPark = async () => {
      let { data } = await listPark();
      return data;
    };

    getOriginPage();

    Promise.all([getListPark()]).then((res) => {
      setTimeout(() => {
        if (!!record) {
          getDetail();
        }
      });
    });
  };

  const getDetail = async () => {
    let { data } = await getPark({
      id: record.id,
    });

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

    setLoading(true);
    // 编辑
    if (record?.id) {
      values.id = record.id;
      let { success, message: msg } = await updatePark(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      }
    } else {
      let { success, message: msg } = await addPark(values);
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
        title={`${record ? "编辑" : "新建"}园区`}
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
                label="园区名称"
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
                label="园区编码"
                name="code"
                getValueFromEvent={inputTrim}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="园区分类"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "请选择",
                  },
                ]}
              >
                <MetaSelect dictType="park_type" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="园区级别"
                name="level"
                rules={[
                  {
                    required: true,
                    message: "请选择",
                  },
                ]}
              >
                <MetaSelect dictType="park_level" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="园区风险等级" name="riskLevel">
                <MetaSelect dictType="park_risk_level" allowClear />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="联系人"
                name="emergencyContact"
                getValueFromEvent={inputTrim}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="联系电话"
                name="emergencyCall"
                getValueFromEvent={inputTrim}
                rules={[
                  {
                    pattern: /^1[3456789]\d{9}$/,
                    message: "请输入正确电话号码",
                  },
                ]}
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

            <Col span={12}>
              <Form.Item label="公司数量">
                <Form.Item name="companyCount" noStyle>
                  <InputNumber min={0} max={99999999} />
                </Form.Item>
                <span
                  className="ant-form-text"
                  style={{
                    marginLeft: 8,
                  }}
                >
                  个
                </span>
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
                label="地址"
                name="address"
                getValueFromEvent={inputTrim}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="经度"
                name="longitude"
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
              <Form.Item label="纬度" getValueFromEvent={inputTrim} required>
                <Space>
                  <Form.Item
                    name="latitude"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "请输入",
                      },
                    ]}
                  >
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Button onClick={getPosition}>地图选址</Button>
                </Space>
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
