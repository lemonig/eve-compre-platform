import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Affix, message } from "antd";
import "./index.less";
import pic_login_side from "@/assets/image/login-side.png";

import { useNavigate, useParams } from "react-router-dom";
import { dbLogin, owner } from "@Api/user";

import { useDispatch, useSelector } from "react-redux";
import { SET_USER } from "@Store/features/userSlice";
import { getMenuData } from "@Store/features/menulistSlice";
import { SET_PLATFORM } from "@Store/features/platformSlice";
import menu from "../../utils/menuData";
import { handleMenu } from "@Utils/menu";
import { inputTrim } from "@Utils/util";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { settingGet, settingUpdate } from "@Api/set_base.js";

function Login() {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const [isCodeLogin, setIsCodeLogin] = useState(true);
  const [data, setData] = useState({
    footer_message: "",
    company_name: "",
    company_name_simple: "",
    header_logo: "",
    header_name: "",
  });

  useEffect(() => {
    getPageData();
  }, []);
  const getPageData = async () => {
    let { data } = await settingGet();
    dispatch(SET_PLATFORM(data));
    setData(data);
  };

  const onFinish = async (values) => {
    let { message: msg, success, data } = await dbLogin(values);
    if (success) {
      localStorage.setItem("token", data.access_token);
      getUserInfo();
      getMenuList();
    } else {
      message.error(msg);
    }
  };

  const getUserInfo = async () => {
    let { message: msg, success, data } = await owner();
    if (success) {
      dispatch(SET_USER(data));
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      message.error(msg);
    }
  };

  const getMenuList = async () => {
    // await dispatch(getMenuData());
    localStorage.setItem("menuList", JSON.stringify(menu));
    let menuTree = handleMenu(menu);
    localStorage.setItem("menuTree", JSON.stringify(menuTree));
    navigate("/", { replace: true });
  };
  const onFinishFailed = (errorInfo) => {};

  const handleLoginState = () => {
    setIsCodeLogin(!isCodeLogin);
  };

  const hanldeCodeLogin = () => {
    window.open(
      "https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=wwe0ae2b8c21cd865f&agentid=1000035&redirect_uri=http://one.greandata.com:8000/loading",
      "",
      "width=600,height=600,left=10, top=10,toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes"
    );
    return false;
  };

  return (
    <div className="login_outer">
      <div className="login_warp">
        <div>
          <img src={pic_login_side} alt="登录" />
        </div>
        <div className="form_warp">
          <h2>欢迎登录</h2>
          {isCodeLogin ? (
            <Form
              name="basic"
              labelCol={{
                span: 0,
              }}
              wrapperCol={{
                span: 24,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                name="username"
                getValueFromEvent={inputTrim}
                rules={[
                  {
                    required: true,
                    message: "请输入",
                  },
                ]}
              >
                <Input
                  placeholder="账号"
                  prefix={
                    <UserOutlined style={{ color: "rgba(0,0,0,0.25)" }} />
                  }
                />
              </Form.Item>

              <Form.Item
                label=""
                name="password"
                getValueFromEvent={inputTrim}
                rules={[
                  {
                    required: true,
                    message: "请输入",
                  },
                ]}
              >
                <Input.Password
                  placeholder="密码"
                  prefix={
                    <LockOutlined style={{ color: "rgba(0,0,0,0.25)" }} />
                  }
                />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 0,
                  span: 24,
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: "100%",
                    borderRadius: "20px",
                    marginTop: "20px",
                  }}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <div id="wx_reg" ref="wx_reg"></div>
          )}

          {/* <div style={{ width: "100%", textAlign: "center" }}>
            <a
              href={`https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=wwe0ae2b8c21cd865f&agentid=1000035&redirect_uri=http://one.greandata.com:8000/loading`}
            >
              切换登录方式
            </a>
          </div> */}
        </div>
      </div>
      <div className="footer">{data.footer_message}</div>
    </div>
  );
}

export default Login;
