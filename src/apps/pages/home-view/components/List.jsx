import React from "react";

import "./index.less";

function List({ children, title }) {
  return (
    <div className="home-list">
      <div className="title">
        <div className="title-name">{title}</div>
      </div>
      <div className="main">{children}</div>
    </div>
  );
}

export default List;
