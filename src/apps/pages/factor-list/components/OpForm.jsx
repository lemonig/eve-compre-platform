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
import PageHead from "@Components/PageHead";
import { roleList as getroleList } from "@Api/util.js";
import Lbreadcrumb from "@Components/Lbreadcrumb";
import { inputTrim } from "@Utils/util";
import {
  StarOutlined,
  StarFilled,
  LeftSquareOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import StationSelect from "@Components/StationSelect";
import { factorPage, factorUpdate, factorAdd } from "@Api/set_factor_list.js";
import { topicList } from "@Api/set_meta_theme.js";

function OpForm({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stationId, setStationId] = useState([]);
  const [themeList, setThemeList] = useState([]);

  form.setFieldsValue(record);
  useEffect(() => {
    getThemeList();
  }, []);

  const getThemeList = async () => {
    let { data } = await topicList();
    setThemeList(data);
  };

  const getPageData = async () => {
    let { data } = await factorPage({
      id: record.id,
    });
    form.setFieldsValue(data);
    setStationId(data.stationIdList);
  };

  const onFinish = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    // 编辑
    if (record?.id) {
      values.id = record.id;
      let { success, message: msg } = await factorUpdate(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      } else {
        message.error(msg);
      }
    } else {
      let { success, message: msg } = await factorAdd(values);
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
  const stationCallback = (val) => {
    setStationId(val);
    setIsModalOpen(false);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  let inputwidtg = {
    width: "300px",
  };

  return (
    <>
      <PageHead
        title={`${record ? "编辑" : "新建"}因子`}
        onClick={() => closeModal(false)}
      />
      {open && (
        <div className="content-wrap">
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            autoComplete="off"
            form={form}
            colon={false}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
              factorType: "1",
            }}
          >
            <h2 className="second-title ">基本信息</h2>
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
                  <Input style={inputwidtg} placeholder="请输入" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="单位"
                  name="unit"
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
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="字段编码"
                  name="showField"
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
              </Col>
              <Col span={12}>
                <Form.Item
                  label="国家协议编号"
                  name="code"
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
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="业务主题 "
                  name="topicType"
                  rules={[
                    {
                      required: true,
                      message: "请输入",
                    },
                  ]}
                >
                  <Select
                    className="width-3"
                    style={inputwidtg}
                    options={themeList}
                    placeholder="请选择"
                    fieldNames={{
                      label: "name",
                      value: "id",
                    }}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="因子类型"
                  name="factorType"
                  rules={[
                    {
                      required: true,
                      message: "请输入",
                    },
                  ]}
                >
                  <Select
                    disabled
                    className="width-3"
                    style={inputwidtg}
                    options={[
                      {
                        label: "内置",
                        value: "0",
                      },
                      {
                        label: " 自定义",
                        value: "1",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="小时修约位数"
                  name="hourDecimal"
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
              </Col>
              <Col span={12}>
                <Form.Item
                  label="均值修约位数"
                  name="avgDecimal"
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
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="页面顺序"
                  name="orderNum"
                  getValueFromEvent={inputTrim}
                >
                  <Input style={inputwidtg} placeholder="请输入" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="默认参与评价"
                  valuePropName="checked"
                  name="needEvaluation"
                >
                  <Checkbox>
                    启用后，该因子系统默认属性为参与质量等级评价
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>

            <h2 className="second-title ">检出限范围</h2>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="检出上限"
                  name="validUpside"
                  getValueFromEvent={inputTrim}
                >
                  <Input style={inputwidtg} placeholder="请输入" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="检出下限"
                  name="validDownside"
                  getValueFromEvent={inputTrim}
                  rules={[]}
                >
                  <Input style={inputwidtg} placeholder="请输入" />
                </Form.Item>
              </Col>
            </Row>

            <h2 className="second-title ">每日上报条数</h2>
            <Row>
              <Col span={12}>
                <Form.Item label="默认每日上报数据条数">
                  <Form.Item name="dailyCount" noStyle>
                    <Input style={inputwidtg} placeholder="请输入" />
                  </Form.Item>
                  <span className="ant-form-text" style={{ marginLeft: 8 }}>
                    天/条
                  </span>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item wrapperCol={{ offset: 3, span: 19 }}>
                  <Button type="primary" htmlType="submit">
                    保存
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          {/* 弹出表单 */}
          {isModalOpen && (
            <StationSelect
              open={isModalOpen}
              callback={stationCallback}
              list={stationId}
            />
          )}
        </div>
      )}
    </>
  );
}

export default OpForm;
