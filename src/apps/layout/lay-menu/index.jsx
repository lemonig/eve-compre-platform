// 此方法放在componet

import React, { useState, useEffect } from "react";

import { Layout, Menu } from "antd";
import "./index.less";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useResolvedPath } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;

function LayMenu({ menuList }) {
  const [selectedKeys, setSelectedKeys] = useState([""]);
  const [openKeys, setOpenKeys] = useState([""]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let resolvedPath = useResolvedPath();
  const menu = useSelector((state) => state.menu);
  useEffect(() => {
    let res = menu.find((item) => item.path === resolvedPath.pathname);
    setSelectedKeys([res.id]);
    setOpenKeys([res.pid]);
  }, []);

  useEffect(() => {
    console.log(resolvedPath);
    let res = menu.find((item) => item.path === resolvedPath.pathname);
    console.log(res);
    if (res) {
      setSelectedKeys([res.id]);
    }
  }, [resolvedPath.pathname]);

  const handleMenuClick = ({ item, key, keyPath, selectedKeys }) => {
    setSelectedKeys(key);
    navigate(item.props.path);
  };
  const handleOpen = (openKeys) => {
    setOpenKeys(openKeys);
  };

  return (
    <div
      className="menu-warp"
      style={{
        background: "rgb(250,251,252)",
      }}
    >
      <Sider
        collapsible
        theme="light"
        style={{ height: "100%", background: "rgb(250,251,252)" }}
      >
        <div className="menu">
          <Menu
            theme="light"
            openKeys={openKeys}
            selectedKeys={selectedKeys}
            mode="inline"
            items={menuList}
            style={{
              // color: "#fff",
              background: "rgb(250,251,252)",
              overflow: "hidden auto",
            }}
            onSelect={handleMenuClick}
            onOpenChange={handleOpen}
          />
        </div>
      </Sider>
    </div>
  );
}

export default LayMenu;
