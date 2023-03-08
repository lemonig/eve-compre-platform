import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 站点添加
export function stationAdd(data) {
  return _post({
    url: `/api/station/add`,
    data,
  });
}
// 站点详情
export function stationGet(data) {
  return _post({
    url: `/api/station/get`,
    data,
  });
}
// 站点删除
export function stationDelete(data) {
  return _post({
    url: `/api/station/delete`,
    data,
  });
}
// 站点更新
export function stationUpdate(data) {
  return _post({
    url: `/api/station/update`,
    data,
  });
}
// 站点查询
export function stationPage(data) {
  return _post({
    url: `/api/station/page`,
    data,
  });
}
