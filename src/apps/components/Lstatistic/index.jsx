import React from "react";
import { Statistic } from "antd";

function LStatistic({ valueStyle, suffix, title, value, style }) {
  return (
    <div style={style}>
      <Statistic value={value} suffix={suffix} valueStyle={valueStyle} />
      <div className={`title`}>{title}</div>
      <style jsx="true">
        {`
          .title {
            font-size: 12px;
          }
        `}
      </style>
    </div>
  );
}

export default LStatistic;
