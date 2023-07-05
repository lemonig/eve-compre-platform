import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 数据比对
export function dataCompare(data) {
  return _post({
    url: `/api/data/report/compare`,
    data,
  });
}
export function compareMeta(data) {
  return _post({
    url: `/api/data/report/compare/meta`,
    data,
  });
}
export function compareExport(data, title) {
  return _download({
    url: `/api/data/report/compare/export`,
    data,
    title,
  });
}
