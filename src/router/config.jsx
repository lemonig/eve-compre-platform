import * as React from "react";
// import menu from "@Utils/menuData";
import { Navigate } from "react-router-dom";
import { RouterAuth } from "./routerAuth"; // 401
import OperateLayout from "@App/layout/lay-operate";
import InfoLayout from "@App/layout/lay-info";
import BodyLayout from "@App/layout/lay-body";
import SetLayout from "@App/layout/lay-set";

// const BodyLayout = React.lazy(() => import("@App/layout/lay-body"));
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
  // {
  //   element: lazyLoad("home"),
  // },
  //综合看板
  {
    // path: "list",
    element: lazyLoad("home-real"),
    index: true,
  },
  {
    path: "dashboard_index",
    element: lazyLoad("home-view"),
  },

  {
    path: "dashboard_resource",
    element: lazyLoad("home-resource"),
  },
  //数据查询
  {
    path: "data_environment",
    element: lazyLoad("data-list"),
  },
  {
    path: "dataBase",
    element: lazyLoad("data-base"),
  },
  {
    path: "data_camera",
    element: lazyLoad("data-video"),
  },
  //信息挡挡
  {
    path: "data",
    element: <InfoLayout />,
    children: [
      {
        path: "info_station", //站点资料
        element: lazyLoad("data-station"),
        index: true,
      },
      {
        path: "info_non-station_air_zone",
        element: lazyLoad("data-info-air"),
      },
      {
        path: "info_non-station_water_zone",
        element: lazyLoad("data-info-water"),
      },
      {
        path: "info_non-station_drink_water_source",
        element: lazyLoad("data-info-drink"),
      },
      {
        path: "info_non-station_company",
        element: lazyLoad("data-info-company"),
      },
      {
        path: "info_non-station_park",
        element: lazyLoad("data-info-park"),
      },
      {
        path: "info_non-station_sensitive_point",
        element: lazyLoad("data-info-sensitive"),
      },
      {
        path: "info_non-station/domestic_pollution_source",
        element: lazyLoad("data-info-domestic"),
      },
    ],
  },
  // 数据运营
  {
    path: "operation_compare",
    element: lazyLoad("operate-compare"),
  },

  // 报警
  {
    path: "operation_alarm",
    element: <OperateLayout />,
    children: [
      {
        path: "alarm_record", //报警记录
        element: lazyLoad("alarm-record"),
        // index: true,
      },
      {
        path: "send_record", //消息记录
        element: lazyLoad("alarm-msg-record"),
      },
      {
        path: "alarm_statis", //报警统计
        element: lazyLoad("alarm-statis"),
      },
      {
        path: "send_statis", //消息统计
        element: lazyLoad("alarm-msg-statis"),
      },
    ],
  },
  {
    path: "operation_report",
    element: lazyLoad("operate-sql"),
  },
  {
    path: "operation_report_batch_export",
    element: lazyLoad("operate-batch-export"),
  },

  {
    path: "operation_report_exception_data",
    element: lazyLoad("operate-except-data"),
  },
  {
    path: "operation_report_export_record",
    element: lazyLoad("operate-export-history"),
  },
  // 数据质量
  {
    path: "quality_audit",
    element: lazyLoad("quality-audit"),
  },
  {
    path: "quality_reverse_status",
    element: lazyLoad("quality_reverse_status"),
  },
  // 数据共享
  {
    path: "share_api",
    element: lazyLoad("share-api"),
  },
  {
    path: "share_log",
    element: lazyLoad("share-log"),
  },
  {
    path: "share_database",
    element: lazyLoad("share-database"),
  },
  // 接入管理
  {
    path: "input_setting",
    element: lazyLoad("input-set"),
  },
  {
    path: "input_hand",
    element: lazyLoad("input-hand"),
  },
  {
    path: "input_log",
    element: lazyLoad("input-log"),
  },
  {
    path: "input_transfer_statis",
    element: lazyLoad("input-statis"),
  },
  // 设置
  {
    path: "setting",
    element: <SetLayout />,
    children: [
      {
        path: "system",
        element: lazyLoad("set-base"),
        index: true,
      },
      {
        path: "user",
        element: lazyLoad("set-user"),
      },
      {
        path: "alarm",
        element: lazyLoad("set-alarm"),
      },
      // 站点
      { path: "station_list", element: lazyLoad("station-list") },
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
        path: "meta_evaluate_plan",
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
        element: lazyLoad("set-msg-company"),
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
      // 报表管理
      {
        path: "report_config",
        element: lazyLoad("set-report-config"),
      },
      {
        path: "report_log",
        element: lazyLoad("set-report-log"),
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
