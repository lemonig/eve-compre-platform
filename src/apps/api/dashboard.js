import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 综合看板-实时列表
export function realtime(data) {
  return _post({
    url: `/api/data/dashboard/realtime`,
    data,
  });
}
// 实时列表关联数据
export function meta(data) {
  return _post({
    url: `/api/data/dashboard/realtime/meta`,
    data,
  });
}
// 监控看板
export function summary(data) {
  return _post({
    url: `/api/data/dashboard/summary`,
    data,
  });
}
// 数据资源统计页面
export function count(data) {
  return _post({
    url: `/api/data/dashboard/resource/count`,
    data,
  });
}
// 数据资源分布
export function pie(data) {
  return _post({
    url: `/api/data/dashboard/resource/pie`,
    data,
  });
}
// 数据资源统计
export function table(data) {
  return _post({
    url: `/api/data/dashboard/resource/table`,
    data,
  });
}
// 每月数据增长趋势
export function chartData(data) {
  return _post({
    url: `/api/data/dashboard/resource/chartData`,
    data,
  });
}
// 本月数据增长TOP5
export function chartDataTop(data) {
  return _post({
    url: `/api/data/dashboard/resource/chartDataTop`,
    data,
  });
}
export function chartApiLog(data) {
  return _post({
    url: `/api/data/dashboard/resource/chartApiLog`,
    data,
  });
}
export function chartApiLogTop(data) {
  return _post({
    url: `/api/data/dashboard/resource/chartApiLogTop`,
    data,
  });
}
