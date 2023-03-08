import { Button, Result } from "antd";
import React from "react";

const back = () => {
  // window.location.history.back();
};

const NoAuth = () => (
  <Result
    status="401"
    title="401"
    subTitle="对不起, 您无权限访问该页面."
    extra={
      <Button type="primary" onClick={back}>
        返回
      </Button>
    }
  />
);
export default NoAuth;
