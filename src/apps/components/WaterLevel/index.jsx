import React from "react";

function WaterLevel({ level, color }) {
  return (
    <>
      <div className="level_warp" style={{ backgroundColor: `${color}` }}>
        {level}
      </div>
      <style jsx="true">
        {`
          .level_warp {
            border-radius: 4px;
            width: 64px;
            text-align: center;
            line-height: 24px;
          }
        `}
      </style>
    </>
  );
}

export default WaterLevel;
