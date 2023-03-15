import React from "react";
import LayMenu from "../lay-menu";
import { NavLink, Link, Outlet } from "react-router-dom";

import { handleMenu } from "@Utils/menu";
import { useDispatch, useSelector } from "react-redux";

function SetLayout() {
  const menu = useSelector((state) => state.menu);
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
