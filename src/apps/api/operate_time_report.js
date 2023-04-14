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
export function batchExport(data) {
  return _post({
    url: `/api/data/report/batchExport`,
    data,
  });
}
// 批量导出因子
export function batchExportMeta(data) {
  return _post({
    url: `/api/data/report/batchExport/meta`,
    data,
  });
}
