import React, { useEffect, useState, useMemo } from "react";
import { Input, Tree } from "antd";
import "../stationTree/index.less";
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

function StationTreeMul({ query, onChange }) {
  const [currentTab, setCurrentTab] = useState("region");
  const [showTree, setShowTree] = useState(false);
  const [treeData1, setTreeData1] = useState([]); //区域
  const [treeData2, setTreeData2] = useState([]); //河流
  const [treeData3, setTreeData3] = useState([]); //分组
  const [activeNode, setActiveNode] = useState("");
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const [checkKey1, setCheckKey1] = useState([]);

  const [pageDataTit, setPageDataTit] = useState([]);
  useEffect(() => {
    if (query) {
      getTreeData(query);
    }
  }, [query]);

  const getTreeData = async (query) => {
    setTreeData1([]);
    let { data } = await stationTreeAll({
      stationType: query,
    });
    let title = [];
    if (data.region) {
      setTreeData1(loop(data.region)); //初始化
      let initCheckList = initCheck(data.region);
      setCheckKey1(initCheckList);
      onChange(initCheckList);
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

  function initCheck(arr) {
    let res = [];
    const innerFun = (arr) => {
      arr.forEach((item) => {
        if (item.isStation) {
          res.push(item.id);
        } else if (item.children.length) {
          innerFun(item.children);
        }
      });
    };
    innerFun(arr);
    return res;
  }

  // 树循环
  let flag = true; //第一次递归
  function loop(data) {
    if (!data) {
      return null;
    }
    let newTree = [];
    newTree = data?.map((item, idx) => {
      const label = item.label;
      if (item.children) {
        if (idx === 0 && item.isStation && flag) {
          //默认选中
          flag = false;
        }
        return {
          ...item,
          label,
          key: item.id,
          children: loop(item.children),
        };
      }
      return {
        ...item,
        label,
        key: item.id,
      };
    });
    return newTree;
  }

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

  // useEffect(() => {
  //   let filterTree = loop(pageData[currentTab]);
  // }, [searchValue, pageData]);
  const filterStation = (arr) => {
    let res = [];
    const innerFun = (arr) => {
      arr.forEach((item) => {
        if (item.isStation) {
          res.push(item.id);
        }
      });
    };
    innerFun(arr);
    return res;
  };

  const onCheck = (checkedKeys, info) => {
    let stationIdArr = filterStation(info.checkedNodes);
    setCheckKey1(checkedKeys);
    onChange(stationIdArr);
  };

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
                blockNode
                checkable
                onCheck={onCheck}
                treeData={treeData1}
                titleRender={titleRender}
                showIcon={true}
                switcherIcon={switcherIconRender}
                // selectedKeys={activeNode}
                onExpand={onTreeExpand}
                expandedKeys={expandedKeys}
                defaultExpandAll
                selectable={false}
                checkedKeys={checkKey1}
                // autoExpandParent={true}
                // showLine={{
                //   showLeafIcon: true,
                // }}

                // autoExpandParent={autoExpandParent}
              />
            ) : null}
            {treeData2.length && currentTab === "river" ? (
              <Tree
                blockNode
                checkable
                treeData={treeData2}
                titleRender={titleRender}
                showIcon={true}
                switcherIcon={switcherIconRender}
                onCheck={onCheck}
                selectable={false}
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
                blockNode
                checkable
                onCheck={onCheck}
                treeData={treeData3}
                titleRender={titleRender}
                showIcon={true}
                switcherIcon={switcherIconRender}
                selectable={false}
                defaultExpandAll
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

export default StationTreeMul;
