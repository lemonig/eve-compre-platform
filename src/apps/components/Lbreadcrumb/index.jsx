import React from "react";
import { Breadcrumb } from "antd";

function MyBreadcrumb({ data }) {
  return (
    <div style={{ padding: "0px 24px 16px 0" }}>
      <Breadcrumb>
        {data.map((item, idx) => (
          <Breadcrumb.Item key={idx}>{item}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
}

export default MyBreadcrumb;
