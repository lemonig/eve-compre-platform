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

function Card({
  title,
  title1,
  title2,
  data,
  onClick,
  color = "rgba(16, 16, 16, 1)",
}) {
  return (
    <div className="card" onClick={onClick}>
      <div className="top">
        <div>{title}</div>
        <div>{data?.datatime}</div>
      </div>
      <div className="bottom">
        <div className="left">
          <div className="left-1">
            <Space direction="vertical" align="center">
              <p style={{ fontSize: "16px" }}>{title1}</p>
              <p style={{ fontSize: "14px" }}>
                <span className="font" style={{ color: color }}>
                  {data?.leftNum}
                </span>{" "}
                个
              </p>
            </Space>
          </div>
          <div className="left-2">
            <Space direction="vertical" align="center">
              {title2 ? (
                <>
                  <p style={{ fontSize: "16px" }}>{title2}</p>
                  <p style={{ fontSize: "14px" }}>
                    <span className="font">{data?.rightNum}</span> 个
                  </p>
                </>
              ) : null}
            </Space>
          </div>
        </div>
        {data?.rate || data.rate === 0 ? (
          <div className="right">
            <Progress
              type="circle"
              percent={data.rate}
              size={80}
              strokeColor="#00c7ff"
              format={(percent) => (
                <div style={{ textAlign: "center", fontSize: "14px" }}>
                  <span style={{ fontWeight: "bold" }}>{`${percent}%`}</span>
                  <br />
                  在线率
                </div>
              )}
              strokeWidth={10}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Card;
