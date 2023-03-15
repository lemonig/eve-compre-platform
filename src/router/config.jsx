import * as React from "react";
// import menu from "@Utils/menuData";
import { Navigate } from "react-router-dom";
import { RouterAuth } from "./routerAuth"; // 401
import DataList from "../apps/pages/data-list";
import SetLayout from "../apps/layout/lay-set";
import SetBase from "../apps/pages/set-base";
import Home from "../apps/pages/home";
import SetMetaTheme from "../apps/pages/set-meta-theme";

const BodyLayout = React.lazy(() => import("@App/layout/lay-body"));
const NotFound = React.lazy(() => import("@App/pages-status/404")); // 404
const Noauthory = React.lazy(() => import("@App/pages-status/403")); // 403
const NoAuth = React.lazy(() => import("@App/pages-status/401"));
const Login = React.lazy(() => import("@Pages/login"));
// const LoadPage = React.lazy(() => import("@Pages/load-page"));

const lazyLoad = (moduleName) => {
  if (moduleName === "layout") return;
  const Module = React.lazy(() => import(`@Pages/${moduleName}`));
  return <Module />;
};
const lazyLoadLay = (moduleName) => {
  if (moduleName === "layout") return;
  const Module = React.lazy(() => import(`@App/layout/${moduleName}`));
  return <Module />;
};

const routerList = [
  {
    element: lazyLoad("home"),
    index: true,
  },
  {
    path: "homeReal",
    element: lazyLoad("home-real"),
  },
  {
    path: "homeView",
    element: lazyLoad("home-view"),
  },
  {
    path: "dataList",
    element: lazyLoad("data-list"),
    // children: [
    //   {
    //     path: ":id",
    //     element: lazyLoad("set-user"),
    //   },
    // ],
  },
  {
    path: "dataBase",
    element: lazyLoad("data-base"),
  },
  {
    path: "dataVideo",
    element: lazyLoad("data-video"),
  },
  {
    path: "setting",
    element: lazyLoadLay("lay-set"),
    children: [
      {
        element: lazyLoad("set-base"),
        index: true,
      },
      {
        path: "user",
        element: lazyLoad("set-user"),
      },
      // 站点
      { path: "station", element: lazyLoad("station-list") },
      { path: "station_group", element: lazyLoad("station-group") },
      { path: "station_online", element: lazyLoad("station-online") },
      // 因子
      { path: "factor_list", element: lazyLoad("factor-list") },
      { path: "factor_group", element: lazyLoad("factor-group") },
      { path: "factor_template", element: lazyLoad("factor-template") },
      // 元数据
      {
        path: "meta_topic",
        element: lazyLoad("set-meta-theme"),
      },
      {
        path: "meta_station_type",
        element: lazyLoad("set-meta-station"),
      },
      {
        path: "meta_station_field",
        element: lazyLoad("set-meta-field"),
      },
      {
        path: "meta_evaluate_standard",
        element: lazyLoad("set-meta-standard"),
      },
      {
        path: "meta_evaluate_factor",
        element: lazyLoad("set-meta-evalute"),
      },
      {
        path: "meta_map",
        element: lazyLoad("set-meta-data"),
      },
      // 信息管理
      {
        path: "msg_region",
        element: lazyLoad("set-msg-region"),
      },
      {
        path: "msg_river",
        element: lazyLoad("set-msg-river"),
      },
      {
        path: "msg_company",
        element: lazyLoad("set-msg-region"),
      },
      {
        path: "msg_park",
        element: lazyLoad("set-msg-park"),
      },
      {
        path: "msg_drink_water_source",
        element: lazyLoad("set-msg-drink"),
      },
      {
        path: "msg_air_zone",
        element: lazyLoad("set-msg-air"),
      },
      {
        path: "msg_water_zone",
        element: lazyLoad("set-msg-water"),
      },
      {
        path: "msg_sensitive_point",
        element: lazyLoad("set-msg-sensitive"),
      },
      {
        path: "msg_domestic_pollution_source",
        element: lazyLoad("set-msg-live"),
      },
    ],
  },
];

const config = [
  {
    path: "/login",
    element: (
      <React.Suspense fallback={<>...</>}>
        <Login />,
      </React.Suspense>
    ),
  },
  // {
  //   path: "loading",
  //   element: (
  //     <React.Suspense fallback={<>...</>}>
  //       <LoadPage />,
  //     </React.Suspense>
  //   ),
  // },
  {
    path: "*",
    element: <NotFound />,
  },

  {
    path: "403",
    element: <Noauthory />,
  },
  {
    path: "401",
    element: <NoAuth />,
  },

  {
    path: "/",
    element: (
      <React.Suspense fallback={<>...</>}>
        <RouterAuth>
          <BodyLayout />
        </RouterAuth>
      </React.Suspense>
    ),
    children: routerList,
  },

  // {
  //   path: "/",
  //   element: (
  //     <React.Suspense fallback={<>...</>}>
  //       {/* <RouterAuth> */}
  //       <BodyLayout />
  //       {/* </RouterAuth> */}
  //     </React.Suspense>
  //   ),
  //   children: routerFilter(),
  // },
];
export default config;
