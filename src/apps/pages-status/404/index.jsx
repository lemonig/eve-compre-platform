import { Button, Result } from "antd";
import React from "react";

const back = () => {
  window.location.history.back();
};
const NotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="对不起, 您访问的页面不存在."
    extra={
      <Button type="primary" onClick={back}>
        返回首页
      </Button>
    }
  />
);
export default NotFound;
