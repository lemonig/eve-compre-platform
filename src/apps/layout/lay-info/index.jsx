import React from "react";
import LayMenu from "../lay-menu";
import { NavLink, Link, Outlet } from "react-router-dom";

import { handleMenu } from "@Utils/menu";
import { useDispatch, useSelector } from "react-redux";
import IconFont from "@Components/IconFont";

function InfoLayout() {
  const menu = useSelector((state) => state.menu);
  // let newM = menu.map((item) => ({
  //   ...item,
  //   icone: <IconFont name={item.icon} size={16}></IconFont>,
  // }));
  const menuTree = menu ? handleMenu(menu) : [];
  let operateMenu = menuTree[1].children.find(
    (ele) => ele.component === "lay-info"
  );
  return (
    <>
      <LayMenu menuList={operateMenu.children} />
      <section className="main-content">
        <Outlet />
      </section>
    </>
  );
}

export default InfoLayout;
