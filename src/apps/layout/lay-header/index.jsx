import React, { useState, useEffect } from "react";
import IconFont from "@Components/IconFont";
import { fullScreen, exitScreen, isFullScreen } from "../../core/fullScreen";
import {
  NavLink,
  Link,
  Outlet,
  useNavigate,
  useResolvedPath,
  useMatch,
} from "react-router-dom";
import { Avatar, Image, Badge, Menu, Dropdown, Space } from "antd";
import User from "./use";
import "./index.less";
import { useDispatch, useSelector } from "react-redux";
import { handleMenu } from "@Utils/menu";

const Header = ({ message }) => {
  const [fullOrno, setfullOrno] = useState(true);
  const menus = useSelector((state) => state.menu);
  const platform = useSelector((state) => state.platform);
  const menuTree = menus ? handleMenu(menus) : [];
  const [activeMenu, setActiveMenu] = useState({});
  let navigate = useNavigate();
  let resolvedPath = useResolvedPath();
  useEffect(() => {
    function getLastPid(menu) {
      if (menu.pid === "0") {
        return menu.id;
      }
      let res = menus.find((item) => item.id === menu.pid);
      return getLastPid(res);
    }
    if (resolvedPath.pathname == "/setting") {
      setActiveMenu("");
    } else {
      let res = menus.find((item) => item.path === resolvedPath.pathname);
      if (res) {
        setActiveMenu(getLastPid(res));
      }
    }
  }, [resolvedPath.pathname]);

  const screenClick = () => {
    if (!isFullScreen()) {
      fullScreen();
      setfullOrno(false);
    } else {
      exitScreen();
      setfullOrno(true);
    }
  };

  let activeStyle = {
    background: "#07357b",
  };
  let activeStyleSon = {
    color: "#0B49B0",
  };

  const createCSubMenu = (jtem) => {
    const res = jtem?.map((jtem) => {
      return {
        key: jtem.id,
        label: (
          <NavLink
            to={jtem.path}
            style={({ isActive }) => (isActive ? activeStyleSon : undefined)}
          >
            <span style={{ marginLeft: "4px", fontSize: "12px" }}>
              {jtem.label}{" "}
            </span>
          </NavLink>
        ),
      };
    });
    return { items: res };
  };
  const creatMenu = () =>
    menuTree.map((item) => (
      <React.Fragment key={item.id}>
        {item.label === "系统设置" ? (
          <NavLink
            to={item.path}
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            {/* 手工注册样式 */}
            <li className="li-outer">
              {/* {item.icon} */}
              <IconFont name={item.icon} size="16" color="#fff" />
              <span style={{ marginLeft: "4px" }}>{item.label} </span>
            </li>
          </NavLink>
        ) : (
          item.children && (
            <Dropdown placement="bottom" menu={createCSubMenu(item.children)}>
              <li
                className={`li-outer ${
                  activeMenu === item.id ? "activeStyle" : undefined
                }`}
              >
                {/* {item.icon} */}
                <IconFont name={item.icon} size="16" color="#fff" />
                <span style={{ marginLeft: "4px" }}>{item.label} </span>
              </li>
            </Dropdown>
          )
        )}
      </React.Fragment>
    ));

  const handleGotoComment = () => {
    navigate("comment");
  };
  const gotoWeChart = () => {
    window.location.href =
      "https://work.weixin.qq.com/kfid/kfc032962d5866cf9d5";
  };
  return (
    <div className="page-title">
      <div className="title">
        {/* <img width={25} src={biaoti} alt="" /> */}
        {/* <div className="logo"> */}
        {/* <IconFont name="crm" size="24"></IconFont> */}
        {platform.header_logo ? (
          <img src={platform.header_logo} alt="logo" height={32} />
        ) : null}
        {/* </div> */}
        <span style={{ fontSize: "16px", marginLeft: "8px" }}>
          {platform.header_name ?? "生态环境数据集成平台"}
        </span>
      </div>
      {/* <div className="title-wrap"></div> */}
      <div className="head-right">
        <ul className="head-ul">
          {/* 消息 */}
          {/* <li
              className="li-outer"
              style={{ marginRight: "25px" }}
              onClick={handleGotoComment}
            >
              <Badge count={message.value}>
                <IconFont name="lingdang" size="24" />
              </Badge>
            </li> */}
          {creatMenu()}
          <a
            href="https://work.weixin.qq.com/kfid/kfc032962d5866cf9d5"
            target="_blank"
            rel="noreferrer"
          >
            <li className="li-outer">
              <IconFont name={"kefu"} size="16" color="#fff" />
              <span style={{ marginLeft: "4px" }}>客服</span>
            </li>
          </a>
          <User></User>
        </ul>
      </div>
    </div>
  );
};

export default Header;
