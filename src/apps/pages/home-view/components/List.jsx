import React from "react";

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
