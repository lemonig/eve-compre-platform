import React, { useEffect, useState, useMemo } from "react";
import { Input, Tree } from "antd";
import "./index.less";
import { stationTreeAll } from "@Api/util.js";
import stationIcon from "@/assets/image/stationIcon.png";
import stationOffIcon from "@/assets/image/stationOffIcon.png";
import treeIcon from "@/assets/image/treeIcon.png";
import treeOpenIcon from "@/assets/image/treeOpenIcon.png";

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

function StationTree({ query, onChange }) {
  const [currentTab, setCurrentTab] = useState("region");
  const [showTree, setShowTree] = useState(true);
  // const [treeData, setTreeData] = useState({});
  const [activeNode, setActiveNode] = useState("");
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [pageData, setPageData] = useState({
    region: [],
    river: [],
    group: [],
  });

  useEffect(() => {
    getTreeData(query);
  }, [query]);

  const getTreeData = async (query) => {
    let { data } = await stationTreeAll({
      stationType: query,
    });
    // setTreeData(data);
    setPageData(data);
  };

  const titleRender = (nodeData) => {
    return (
      <span className={`titleTemplate`}>
        <span>
          {nodeData.label}&nbsp;
          {nodeData.isStation ? null : (
            <span style={{ color: "#999" }}>({nodeData.stationNum})</span>
          )}
        </span>
      </span>
    );
  };

  const switcherIconRender = (props) => {
    if (props.expanded) {
      return <img src={treeOpenIcon} alt=""></img>;
    } else {
      return <img src={treeIcon} alt=""></img>;
    }
  };
  const treeSelect = (selectedKeys, { node }, e) => {
    if (node.isStation) {
      setActiveNode([node.key]);
      onChange({
        key: node.key || "",
        title: node.label || "",
      });
    } else {
      e.preventDefault();
    }
  };

  const onTreeExpand = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onSearchChange = (e) => {
    const { value } = e.target;
    const newExpandedKeys = pageData[currentTab]
      .map((item) => {
        if (item.label.indexOf(value) > -1) {
          return getParentKey(item.key, pageData[currentTab]);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };
  const treeData = useMemo(() => {
    const loop = (data) =>
      data?.map((item) => {
        const label = item.label;
        const index = label.indexOf(searchValue);
        // const beforeStr = strTitle.substring(0, index);
        // const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {/* {beforeStr} */}
              <span className="site-tree-search-value">{searchValue}</span>
              {/* {afterStr} */}
            </span>
          ) : (
            <span>{label}</span>
          );
        if (item.children) {
          return {
            label,
            key: item.key,
            ...item,
            children: loop(item.children),
          };
        }
        return {
          label,
          ...item,
          key: item.key,
        };
      });
    return loop(pageData[currentTab]);
  }, [searchValue, pageData, currentTab]);
  return (
    <div className={`AllTree_warp ${showTree ? "hasWidth" : ""}`}>
      <div style={{ display: showTree ? `block` : "none" }}>
        <div className="sort">
          {/* 区域2 3 1 */}
          {[
            {
              label: "区域",
              name: "region",
            },
            {
              label: "河流",
              name: "river",
            },
            {
              label: "分组",
              name: "group",
            },
          ].map((item, idx) => (
            <div
              className={currentTab === item.name ? `active` : ""}
              onClick={() => setCurrentTab(item.name)}
              key={item.name}
            >
              {item.label}
            </div>
          ))}
        </div>
        <div className="tree_warp">
          <Input
            type="text"
            placeholder="站点名称"
            onChange={onSearchChange}
          ></Input>
          <div className="station_tree">
            <Tree
              // checkable

              treeData={treeData}
              titleRender={titleRender}
              // icon={treeIconRender}
              showIcon={true}
              switcherIcon={switcherIconRender}
              onSelect={treeSelect}
              selectedKeys={activeNode}
              onExpand={onTreeExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
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
