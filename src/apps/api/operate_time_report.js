import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 时间报表
export function reportTime(data) {
  return _post({
    url: `/api/data/report/time`,
    data,
  });
}
// 时间报表
export function reportTimeMeta(data) {
  return _post({
    url: `/api/data/report/time/meta`,
    data,
  });
}
// 批量导出
export function batchExport(data, title) {
  return _post({
    url: `/api/data/report/batchExport`,
    data,
    title,
  });
}
// 批量导出因子
export function batchExportMeta(data) {
  return _post({
    url: `/api/data/report/batchExport/meta`,
    data,
  });
}

export function dashboardRealtime(data) {
  return _post({
    url: `/api/data/dashboard/realtime`,
    data,
  });
}
export function realtimeMeta(data) {
  return _post({
    url: `/api/data/dashboard/realtime/meta`,
    data,
  });
}
//导出记录
export function exportRecord(data) {
  return _post({
    url: `/api/user/exportRecord/page`,
    data,
  });
}
