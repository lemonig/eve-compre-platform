import React, { useEffect, useState, useMemo } from "react";
import {
  Layout,
  Select,
  Space,
  Radio,
  Checkbox,
  Table,
  Tooltip,
  Button,
  Progress,
} from "antd";
import {
  SettingOutlined,
  WarningFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import "./index.less";

function List({ children, title }) {
  return (
    <div className="list">
      <div className="title">
        <span className="line"></span>
        <div className="title-name">{title}</div>
      </div>
      <div className="main">{children}</div>
    </div>
  );
}

export default List;
