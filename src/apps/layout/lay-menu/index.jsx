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
  RightOutlined,
  PieChartOutlined,
  LeftOutlined,
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
  console.log("----", menuList);
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
    <>
      <div
        className="menu-warp"
        style={{
          background: "rgb(250,251,252)",
        }}
      >
        <Sider
          theme="light"
          style={{
            height: "100%",
            background: "rgb(250,251,252)",
            paddingRight: "16px",
            boxSizing: "border-box",
          }}
          trigger={null}
          collapsible
          collapsed={collapsed}
          collapsedWidth={20}
          // onCollapse={(value) => setCollapsed(value)}
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
        <div className="collapse-wrap">
          <div className="divert-line"></div>
          <div>
            <Button
              type="default"
              onClick={toggleCollapsed}
              style={{}}
              shape="circle"
              size="small"
            >
              {collapsed ? <RightOutlined /> : <LeftOutlined />}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LayMenu;
