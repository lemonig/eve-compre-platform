import React from "react";
import Header from "../lay-header";
// import LayMenu from "../lay-menu";
import { NavLink, Link, Outlet } from "react-router-dom";
import { Breadcrumb, Layout, Menu } from "antd";
import "./index.less";
import { useDispatch, useSelector } from "react-redux";

const { Content, Footer, Sider } = Layout;

function BodyLayout() {
  const platform = useSelector((state) => state.platform);

  return (
    <>
      {/* 头部 */}
      <Header />
      <section
        className={`body-flex ${platform.footer_message ? "has-footer" : "'"}`}
      >
        {/* 主体内容 */}
        {/* <section className="body-main-content"> */}
        {/* <div id="default_content_warp"> */}
        <Outlet />
        {/* </div> */}
        {/* </section> */}
      </section>
      <div className="content-footer">{platform.footer_message}</div>
    </>
  );
}

export default BodyLayout;
