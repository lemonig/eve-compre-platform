import React from "react";
import { LeftSquareOutlined } from "@ant-design/icons";
import IconFont from "@Components/IconFont";

function PageHead({ title, onClick }) {
  return (
    <div className="module-title">
      <IconFont
        name="fanhui"
        onClick={onClick}
        style={{ marginRight: "4px", cursor: "pointer" }}
      />

      {title}
    </div>
  );
}

export default PageHead;
