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
  const menu = useSelector((state) => state.menu);
  const platform = useSelector((state) => state.platform);
  const menuTree = menu ? handleMenu(menu) : [];
  const [activeMenu, setActiveMenu] = useState({});
  let navigate = useNavigate();
  let resolvedPath = useResolvedPath();
  useEffect(() => {
    if (resolvedPath.pathname == "/setting") {
      setActiveMenu("");
    } else {
      let res = menu.find((item) => item.path === resolvedPath.pathname);
      if (res) {
        let res1 = menu.find((item) => item.id === res.pid);
        setActiveMenu(res1.id);
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
        {item.children && item.label !== "????????????" ? (
          <Dropdown placement="bottom" menu={createCSubMenu(item.children)}>
            <li
              className={`li-outer ${
                activeMenu === item.id ? "activeStyle" : undefined
              }`}
            >
              {item.icon}
              {/* <IconFont name={item.icon} size="16" color="#fff" /> */}
              <span style={{ marginLeft: "4px" }}>{item.label} </span>
            </li>
          </Dropdown>
        ) : (
          <NavLink
            to={item.path}
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            {/* ?????????????????? */}
            <li className="li-outer">
              {item.icon}
              {/* <IconFont name={item.icon} size="16" color="#fff" /> */}
              <span style={{ marginLeft: "4px" }}>{item.label} </span>
            </li>
          </NavLink>
        )}
      </React.Fragment>
    ));

  const handleGotoComment = () => {
    navigate("comment");
  };

  return (
    <div className="page-title">
      <div className="title">
        {/* <img width={25} src={biaoti} alt="" /> */}
        {/* <div className="logo"> */}
        {/* <IconFont name="crm" size="24"></IconFont> */}
        <img src={platform.header_logo} alt="logo" height={32} />
        {/* </div> */}
        <span style={{ fontSize: "16px", marginLeft: "8px" }}>
          {platform.header_name ?? "??????????????????????????????"}
        </span>
      </div>
      {/* <div className="title-wrap"></div> */}
      <div className="head-right">
        <ul className="head-ul">
          {/* ?????? */}
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

          <User></User>
        </ul>
      </div>
    </div>
  );
};

export default Header;
