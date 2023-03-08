import React, { useEffect, useState } from "react";
import {
  Menu,
  Dropdown,
  Avatar,
  Modal,
  Form,
  Input,
  Button,
  Checkbox,
  message,
} from "antd";
import {
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { logout } from "@Api/user";
import { connect } from "react-redux";
import head from "@/assets/image/head.png";
import "./index.less";
import { updateOwnerPassword } from "@Api/user";

function User() {
  const [pwdModalVisible, setPwdModalVisible] = useState(false);
  const [pwdForm] = Form.useForm();
  const [userInfo, setUserInfo] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    setUserInfo(JSON.parse(localStorage.getItem("user")));
  }, []);

  const handlePwsOk = async () => {
    setConfirmLoading(true);
    await pwdForm.validateFields();
    const values = pwdForm.getFieldsValue();
    if (values.new_password1 !== values.new_password2) {
      message.error("两次输入的密码不一致");
      return;
    }
    let { success, message: msg } = await updateOwnerPassword(values);
    if (success) {
      message.success(msg);
    } else {
      message.error(msg);
    }
    setConfirmLoading(false);
    setPwdModalVisible(false);
  };
  let navigate = useNavigate();

  const handlePwsCancel = () => {
    setPwdModalVisible(false);
  };
  const handleModifyPwd = () => {
    setPwdModalVisible(true);
  };

  const loginOut = async () => {
    await logout();
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const items = [
    {
      key: "1",
      label: <a>个人信息</a>,
      icon: <UserOutlined />,
    },
    {
      key: "3",
      label: <a onClick={handleModifyPwd}>修改密码</a>,
      icon: <EditOutlined />,
    },

    {
      key: "4",
      label: <a onClick={loginOut}>退出登录</a>,
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <>
      <Dropdown
        menu={{
          items,
        }}
      >
        <li className="li-outer">
          <Avatar
            style={{ background: "#87d068" }}
            src={head}
            onClick={(e) => e.preventDefault()}
            size="small"
          />
          <span className="user-name">{userInfo?.nickname ?? "xx"}</span>
        </li>
      </Dropdown>
      {/* 修改密码 */}
      <Modal
        title="修改密码"
        open={pwdModalVisible}
        onOk={handlePwsOk}
        onCancel={handlePwsCancel}
        destroyOnClose
        maskClosable={false}
        confirmLoading={confirmLoading}
      >
        <Form
          name="psd"
          preserve={false}
          form={pwdForm}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          autoComplete="off"
        >
          <Form.Item
            label="旧密码"
            name="old_password"
            rules={[{ required: true, message: "请输入旧密码!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="new_password1"
            rules={[
              { required: true, message: "请输入新密码" },
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/,
                message: "请输入至少8位，包含字母、数字和特殊字符",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="new_password2"
            rules={[
              { required: true, message: "请再次输入新密码" },
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/,
                message: "请输入至少8位，包含字母、数字和特殊字符",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default User;
