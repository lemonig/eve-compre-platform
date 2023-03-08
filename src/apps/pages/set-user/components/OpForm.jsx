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
import { userPage, userDetail, userUpdate, userAdd } from "@Api/set_user.js";
import StationForm from "./StationForm";

function OpForm({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stationId, setStationId] = useState([]);
  const [roleList, setRoleList] = useState([]);

  useEffect(() => {
    getRoleList();
    if (!!record) getPageData();
  }, []);

  const getRoleList = async () => {
    let { data } = await getroleList();
    setRoleList(data);
  };

  const getPageData = async () => {
    let { data } = await userDetail({
      id: record.id,
    });
    form.setFieldsValue(data);
    setStationId(data.stationIdList);
  };

  const onFinish = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    values.stationIdList = stationId;
    setLoading(true);
    // 编辑
    if (record?.id) {
      values.id = record.id;
      let { success, message: msg } = await userUpdate(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      } else {
        message.error(msg);
      }
    } else {
      let { success, message: msg } = await userAdd(values);
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

  let inputwidtg = {
    width: "300px",
  };

  return (
    <>
      <PageHead
        title={`${record ? "编辑" : "新建"}用户`}
        onClick={() => closeModal(false)}
      />
      {open && (
        <div>
          <Form
            name="basic"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 19 }}
            autoComplete="off"
            form={form}
            colon={false}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="用户姓名"
              name="nickname"
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
            <Form.Item
              label="登录账号"
              name="username"
              getValueFromEvent={inputTrim}
              rules={[
                {
                  required: true,
                  message: "请输入",
                },
                {
                  pattern: /^[0-9a-zA-Z]*$/,
                  message: "请输入字母或者数字",
                },
              ]}
            >
              <Input
                style={inputwidtg}
                placeholder="请输入"
                disabled={!!record}
              />
            </Form.Item>
            {!record && (
              <Form.Item
                label="登录密码"
                name="password"
                getValueFromEvent={inputTrim}
                rules={[
                  {
                    required: true,
                    message: "请输入",
                  },
                  {
                    pattern:
                      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/,
                    message: "请输入至少8位，包含字母、数字和特殊字符",
                  },
                ]}
              >
                <Input style={inputwidtg} placeholder="请输入" />
              </Form.Item>
            )}

            <Form.Item label="所属单位" name="company">
              <Input style={inputwidtg} placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="手机号码"
              name="phone"
              rules={[
                {
                  pattern: /^1[3456789]\d{9}$/,
                  message: "请输入正确的手机号",
                },
              ]}
            >
              <Input style={inputwidtg} placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  站点权限 &nbsp;
                  <Tooltip title="允许用户操作的站点">
                    <InfoCircleOutlined />
                  </Tooltip>
                </span>
              }
            >
              <span className="ant-form-text">
                已选择{stationId.length}个站点
              </span>
              <Form.Item name="stationIdList" noStyle>
                <a onClick={() => setIsModalOpen(true)}>选择站点</a>
              </Form.Item>
            </Form.Item>
            <Form.Item label="高级权限" name="roleIdList">
              <Checkbox.Group>
                <Row gutter={24}>
                  {roleList.map((item) => (
                    <Col span={24} key={item.id} style={{ marginTop: "8px" }}>
                      <Checkbox value={item.id}>{item.name}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item label="备注" name="remark">
              <Input.TextArea style={inputwidtg} placeholder="请输入" />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 3,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                保存
              </Button>
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
        </div>
      )}
    </>
  );
}

export default OpForm;
