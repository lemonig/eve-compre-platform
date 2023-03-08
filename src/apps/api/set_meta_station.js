import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 站点类型查询
export function stationPage(data) {
  return _post({
    url: `/api/type/station/list`,
    data,
  });
}
// 站点类型添加
export function stationAdd(data) {
  return _post({
    url: `/api/type/station/add`,
    data,
  });
}
// 站点类型添加
export function stationUpdate(data) {
  return _post({
    url: `/api/type/station/update`,
    data,
  });
}
// 站点类型详情
export function stationGet(data) {
  return _post({
    url: `/api/type/station/get`,
    data,
  });
}
