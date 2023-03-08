import { Button, Result } from "antd";
import React from "react";
import { logout } from "@Api/user";
const loginOut = async () => {
  await logout();
  localStorage.clear();
  window.location.href = window.location.origin;
};

const Noauthory = () => (
  <Result
    status="403"
    title="403"
    subTitle="无登录权限"
    extra={
      <Button type="primary" onClick={loginOut}>
        首页
      </Button>
    }
  />
);
export default Noauthory;
