import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { PUSH_LOADING, SHIFT_LOADING } from "@Store/features/loadSlice";
import "./index.less";

const Loading = ({ id }) => {
  const [widthPro, setWidthPro] = useState(100);
  let loadStyle = { width: widthPro + "%" };
  const { showLoading, loadType, loadText } = useSelector(
    (state) => state.load
  );
  return (
    <div>
      {showLoading ? (
        <div id={id} className="loading" style={loadStyle}></div>
      ) : null}
      {showLoading && loadType == "full" ? (
        <section className="full-load">
          <div className="text">{loadText}</div>
          <div className="load">
            <div>L</div>
            <div>O</div>
            <div>A</div>
            <div>D</div>
            <div>I</div>
            <div>N</div>
            <div>G</div>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default Loading;
