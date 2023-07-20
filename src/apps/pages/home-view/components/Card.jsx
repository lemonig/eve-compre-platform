import React from "react";
import { Space, Progress } from "antd";
import "./index.less";

function Card({
  title,
  title1,
  title2,
  rightUnit,
  data,
  onClick,
  color = "rgba(16, 16, 16, 1)",
  circleName = "在线率",
} = {}) {
  return (
    <div className="home-card" onClick={onClick}>
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
                    <span className="font">{data?.rightNum}</span> {rightUnit}
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
              strokeColor="#2684ff"
              format={(percent) => (
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "14px",
                    color: "#172b4d",
                  }}
                >
                  <span>{`${percent}%`}</span>
                  <br />
                  {circleName}
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
