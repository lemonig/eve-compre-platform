import React, { useState } from "react";
import { Input, Tree } from "antd";
import "./index.less";

const treeData = [
  {
    title: "parent 1",
    key: "0-0",
    children: [
      {
        title: "parent 1-0",
        key: "0-0-0",
        disabled: true,
        children: [
          {
            title: "leaf",
            key: "0-0-0-0",
            disableCheckbox: true,
          },
          {
            title: "leaf",
            key: "0-0-0-1",
          },
        ],
      },
      {
        title: "parent 1-1",
        key: "0-0-1",
        children: [
          {
            title: (
              <span
                style={{
                  color: "#1890ff",
                }}
              >
                sss
              </span>
            ),
            key: "0-0-1-0",
          },
        ],
      },
    ],
  },
];
function StationTree() {
  const [currentTab, setCurrentTab] = useState(1);
  const [showTree, setShowTree] = useState(true);

  return (
    <div className={`AllTree_warp ${showTree ? "hasWidth" : ""}`}>
      <div style={{ display: showTree ? `block` : "none" }}>
        <div className="sort">
          {["区域", "河流", "分组"].map((item, idx) => (
            <div
              className={currentTab === idx ? `active` : ""}
              onClick={() => setCurrentTab(idx)}
              key={idx}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="tree_warp">
          <Input type="text" placeholder="站点名称"></Input>
          <div className="station_tree">
            <Tree
              checkable
              defaultExpandedKeys={["0-0-0", "0-0-1"]}
              defaultSelectedKeys={["0-0-0", "0-0-1"]}
              defaultCheckedKeys={["0-0-0", "0-0-1"]}
              treeData={treeData}
            />
          </div>
        </div>
      </div>
      <i
        className={`foldIcon   ${showTree ? "canOpen" : ""} `}
        onClick={() => setShowTree(!showTree)}
      ></i>
    </div>
  );
}

export default StationTree;
