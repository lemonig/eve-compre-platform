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

const titleIn = {
  region: "区域",
  river: "河流",
  group: "分组",
};

function StationTree({ query, onChange }) {
  const [currentTab, setCurrentTab] = useState("region");
  const [showTree, setShowTree] = useState(true);
  const [treeData1, setTreeData1] = useState([]); //区域
  const [treeData2, setTreeData2] = useState([]); //河流
  const [treeData3, setTreeData3] = useState([]); //分组
  const [activeNode, setActiveNode] = useState("");
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const [pageDataTit, setPageDataTit] = useState([]);

  useEffect(() => {
    setExpandedKeys([]);
    setTreeData1([]);
    getTreeData(query);
  }, [query]);

  const getTreeData = async (query) => {
    let { data } = await stationTreeAll({
      stationType: query,
    });
    let title = [];
    if (data.region) {
      setTreeData1(loop(data.region)); //初始化
      setExpandedKeys(expendkey);
      title.push({
        label: "区域",
        name: "region",
      });
    }
    if (data.river) {
      setTreeData2(data.river);
      title.push({
        label: "河流",
        name: "river",
      });
    }
    if (data.group) {
      setTreeData3(data.group);
      title.push({
        label: "分组",
        name: "group",
      });
    }

    setCurrentTab(title[0].name);
    setPageDataTit(title);
  };
  // 树循环
  let flag = true; //第一次递归
  const expendkey = [];
  const loop = (data) => {
    if (!data) {
      return null;
    }
    let newTree = [];
    newTree = data?.map((item, idx) => {
      const label = item.label;
      // if (item.stationNum === 0) {
      //   return [];
      // }
      // 展开树
      if (idx === 0 && !item.isStation && flag) {
        expendkey.push(item.key);
      }
      if (item.children) {
        if (idx === 0 && item.isStation && flag) {
          //默认选中
          flag = false;
          setActiveNode([item.key]);
          onChange({
            key: item.id || "",
            title: item.label || "",
          });
        }
        return {
          ...item,
          label,
          key: item.key,
          children: loop(item.children),
        };
      }
      return {
        ...item,
        label,
        key: item.key,
      };
    });
    // newTree = newTree.filter((ele) => {
    //   return Object.prototype.toString.call(ele) === "[object Object]";
    // });
    return newTree;
  };

  const titleRender = (nodeData) => {
    return (
      <span className={`titleTemplate`}>
        <span>
          {nodeData.isStation ? (
            nodeData.isConnected ? (
              <img className="imgStyle" src={stationIcon} alt="x"></img>
            ) : (
              <img className="imgStyle" src={stationOffIcon} alt="x"></img>
            )
          ) : null}
          {nodeData.label}&nbsp;
          {nodeData.isStation ? null : (
            <span style={{ color: "#999" }}>({nodeData.stationNum})</span>
          )}
        </span>
      </span>
    );
  };

  const switcherIconRender = (props) => {
    if (props.isStation) {
      if (props.isConnected) {
        return <img className="imgStyle" src={stationIcon} alt="x"></img>;
      } else {
        return <img src={stationOffIcon} alt="x"></img>;
      }
    } else {
      if (props.expanded) {
        return <img src={treeOpenIcon} alt=""></img>;
      } else {
        return <img src={treeIcon} alt=""></img>;
      }
    }
  };
  const treeSelect = (selectedKeys, { node }, e) => {
    if (node.isStation) {
      setActiveNode([node.key]);
      onChange({
        key: node.id || "",
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
    // treeData1.map(item)

    // const newExpandedKeys = pageData[currentTab]
    //   .map((item) => {
    //     if (item.label.indexOf(value) > -1) {
    //       return getParentKey(item.key, pageData[currentTab]);
    //     }
    //     return null;
    //   })
    //   .filter((item, i, self) => item && self.indexOf(item) === i);
    // setExpandedKeys(newExpandedKeys);
    // setSearchValue(value);
    // setAutoExpandParent(true);
  };

  //过滤数据
  const filterStation = (nodes, keyword) => {
    let filterFn = function (node) {
      if (!node.is_station) {
        return true;
      } else {
        if (node.title.indexOf(keyword) > -1) {
          return true;
        } else {
          return false;
        }
      }
    };
    if (!nodes.length) {
      return [];
    }
    let newNodes = [];
    for (let node of nodes) {
      // 以下只需要考虑自身的节点满足条件即可,不用带上父节点
      if (filterFn(node)) {
        newNodes.push(node);
        node.children = this.filterStation(
          node.children ? node.children : [],
          keyword
        );
      }
    }
    return newNodes;
  };

  // useEffect(() => {
  //   let filterTree = loop(pageData[currentTab]);
  // }, [searchValue, pageData]);
  return (
    <div className={`AllTree_warp ${showTree ? "hasWidth" : ""}`}>
      <div
        style={{ width: showTree ? `240px` : "0px" }}
        className="all-tree-wrap"
      >
        <div className="sort">
          {/* 区域2 3 1 */}
          {pageDataTit.map((item, idx) => {
            return (
              <div
                className={currentTab === item.name ? `active` : ""}
                onClick={() => setCurrentTab(item.name)}
                key={item.name}
              >
                {item.label}
              </div>
            );
          })}
        </div>
        <div className="tree_warp">
          <Input
            type="text"
            placeholder="站点名称"
            onChange={onSearchChange}
          ></Input>
          <div className="station_tree">
            {treeData1.length && currentTab === "region" ? (
              <Tree
                // checkable
                treeData={treeData1}
                titleRender={titleRender}
                showIcon={true}
                switcherIcon={switcherIconRender}
                onSelect={treeSelect}
                selectedKeys={activeNode}
                onExpand={onTreeExpand}
                expandedKeys={expandedKeys}
                defaultExpandAll
                // autoExpandParent={true}
                // showLine={{
                //   showLeafIcon: true,
                // }}

                // autoExpandParent={autoExpandParent}
              />
            ) : null}
            {treeData2.length && currentTab === "river" ? (
              <Tree
                // checkable
                treeData={treeData2}
                titleRender={titleRender}
                showIcon={true}
                switcherIcon={switcherIconRender}
                onSelect={treeSelect}
                // selectedKeys={activeNode}
                // onExpand={onTreeExpand}
                // expandedKeys={expandedKeys}
                // defaultExpandAll
                // autoExpandParent={true}
                // showLine={{
                //   showLeafIcon: true,
                // }}

                // autoExpandParent={autoExpandParent}
              />
            ) : null}
            {treeData3.length && currentTab === "group" ? (
              <Tree
                // checkable
                treeData={treeData3}
                titleRender={titleRender}
                showIcon={true}
                switcherIcon={switcherIconRender}
                onSelect={treeSelect}
                // selectedKeys={activeNode}
                // onExpand={onTreeExpand}
                // expandedKeys={expandedKeys}
                // autoExpandParent={true}
                // showLine={{
                //   showLeafIcon: true,
                // }}

                // autoExpandParent={autoExpandParent}
              />
            ) : null}
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
