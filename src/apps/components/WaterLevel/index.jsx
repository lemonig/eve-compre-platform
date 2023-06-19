import React from "react";

function WaterLevel({ level, color, onClick, style }) {
  return (
    <>
      <span
        className="level_warp"
        style={{ backgroundColor: `${color}`, ...style }}
        onClick={onClick}
      >
        {level}
      </span>
      <style jsx="true">
        {`
          .level_warp {
            border-radius: 4px;
            width: 64px;
            text-align: center;
            line-height: 24px;
            display: inline-block;
          }
        `}
      </style>
    </>
  );
}

export default WaterLevel;
