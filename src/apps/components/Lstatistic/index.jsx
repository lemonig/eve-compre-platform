import React from "react";
import { Statistic } from "antd";

function LStatistic({ valueStyle, suffix, title, value }) {
  return (
    <div>
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
