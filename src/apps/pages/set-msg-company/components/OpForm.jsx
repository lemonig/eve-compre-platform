import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  Space,
  Form,
  message,
  DatePicker,
  Col,
  Row,
  TreeSelect,
  Upload,
} from "antd";
import PageHead from "@Components/PageHead";
import MetaSelect from "@Shared/MetaSelect";
import Map from "@Components/Map";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import { fieldList as fieldListApi } from "@Api/set_meta_field.js";
import { inputTrim } from "@Utils/util";
import { regionList, regionTree } from "@Api/set_region.js";
import { companyupdate, companyadd, companyget } from "@Api/set_msg_company.js";
import { listPark } from "@Api/set_msg_park.js";
import { fileUpload } from "@Api/util.js";

function OpForm({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // 元数据
  const [formField, setFormField] = useState([]);
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
      setFormField(res);
      setTimeout(() => {
        if (!!record) {
          getDetail();
        }
      });
    });
  };

  const getDetail = async () => {
    let { data } = await companyget({
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
    // form.validateFields();
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
      let { success, message: msg } = await companyupdate(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      }
    } else {
      let { success, message: msg } = await companyadd(values);
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
        title={`${record ? "编辑" : "新建"}企业`}
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
                label="企业名称"
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
                label="企业编码"
                name="code"
                getValueFromEvent={inputTrim}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="企业行业类别"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "请选择",
                  },
                ]}
              >
                <MetaSelect dictType="industry_type_1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="企业行业细分类别"
                name="subType"
                rules={[
                  {
                    required: true,
                    message: "请选择",
                  },
                ]}
              >
                <MetaSelect dictType="industry_type_2" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="企业风险等级" name="riskLevel">
                <MetaSelect dictType="company_risk_level" allowClear />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="所属园区" name="parkId">
                <Select
                  placeholder="请选择"
                  fieldNames={{
                    label: "name",
                    value: "id",
                  }}
                  allowClear
                  options={formField[0]}
                  rootClassName="width-3"
                />
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
          <h2 className="second-title">许可证信息</h2>
          <Row>
            <Col span={12}>
              <Form.Item
                label="排污许可证编号"
                name="licenseNumber"
                getValueFromEvent={inputTrim}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="法定代表人"
                name="corpname"
                getValueFromEvent={inputTrim}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="统一社会信用代码"
                name="uscc"
                getValueFromEvent={inputTrim}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="有效期限" name="valcodeTill">
                <DatePicker format="YYYY/MM/DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="发证机关"
                name="issuingAuthority"
                getValueFromEvent={inputTrim}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="发证日期" name="issuingDate">
                <DatePicker format="YYYY/MM/DD" />
              </Form.Item>
            </Col>
          </Row>

          <h2 className="second-title">排污信息</h2>
          <Row>
            <Col span={12}>
              <Form.Item
                label="大气污染物种类"
                name="gasPollutionType"
                getValueFromEvent={inputTrim}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="污染物排放执行标准"
                name="standard"
                getValueFromEvent={inputTrim}
              >
                <Input className="width-3" placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="废水污染物种类"
                name="waterPollutionType"
                getValueFromEvent={inputTrim}
              >
                <Input className="width-3" placeholder="请输入" />
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
