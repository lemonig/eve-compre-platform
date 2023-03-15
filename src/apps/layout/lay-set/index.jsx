import React from "react";
import LayMenu from "../lay-menu";
import { NavLink, Link, Outlet } from "react-router-dom";

import { handleMenu } from "@Utils/menu";
import { useDispatch, useSelector } from "react-redux";
import IconFont from "@Components/IconFont";

function SetLayout() {
  const menu = useSelector((state) => state.menu);
  // let newM = menu.map((item) => ({
  //   ...item,
  //   icone: <IconFont name={item.icon} size={16}></IconFont>,
  // }));
  const menuTree = menu ? handleMenu(menu) : [];
  let settingMenu = menuTree.find((ele) => ele.component === "lay-set");
  return (
    <>
      <LayMenu menuList={settingMenu.children} />
      <section className="main-content">
        <Outlet />
      </section>
    </>
  );
}

export default SetLayout;
