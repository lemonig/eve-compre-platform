// 此方法放在componet

import React, { useState, useEffect } from "react";

import { Layout, Menu, Button } from "antd";
import "./index.less";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useResolvedPath } from "react-router-dom";
import IconFont from "@Components/IconFont";
import {
  AppstoreOutlined,
  ContainerOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
const { Header, Content, Footer, Sider } = Layout;

function LayMenu({ menuList, onChange, value = [] }) {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let resolvedPath = useResolvedPath();
  const menu = useSelector((state) => state.menu);
  useEffect(() => {
    if (value.length > 0) {
      setSelectedKeys(value);
    } else {
      let res = menu.find((item) => item.path === resolvedPath.pathname);
      setSelectedKeys([res.id]);
      setOpenKeys([res.pid]);
    }
  }, [JSON.stringify(value)]);

  // useEffect(() => {
  //   console.log(resolvedPath);
  //   let res = menu.find((item) => item.path === resolvedPath.pathname);
  //   if (res) {
  //     setSelectedKeys([res.id]);
  //   }
  // }, [resolvedPath.pathname]);

  menuList.map((item) => {
    item.icon = <IconFont name={item.icon} size={16}></IconFont>;
  });
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const handleMenuClick = ({ item, key, keyPath, selectedKeys }) => {
    if (onChange) {
      let findMenu = menu.find((ele) => ele.id === item.props.pid);
      onChange({
        key,
        title: item.props.title,
        ptitle: findMenu.title,
        query: item.props.query,
      });
    }
    setSelectedKeys(selectedKeys);
    if (item.props.path) {
      navigate(item.props.path);
    }
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
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          marginBottom: 16,
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Sider
        theme="light"
        style={{ height: "100%", background: "rgb(250,251,252)" }}
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={0}
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
