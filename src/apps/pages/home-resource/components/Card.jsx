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
import { findMinFrequent, tableIndex } from "@Utils/util";
import "./index.less";

function Card(props) {
  const { title, onClick, extra, children, style } = props;
  return (
    <div className="home-resource-card" onClick={onClick} style={style}>
      {title ? (
        <div className="top">
          <div className="head">
            <div>{title}</div>
            <div>{extra}</div>
          </div>
        </div>
      ) : null}

      <div className="bottom">{children}</div>
    </div>
  );
}

export default Card;
