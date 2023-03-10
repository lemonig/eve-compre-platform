import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 环境空气功能区删除
export function airZonedelete(data) {
  return _post({
    url: `/api/info/airZone/delete`,
    data,
  });
}
// 环境空气功能区详情
export function airZoneget(data) {
  return _post({
    url: `/api/info/airZone/get`,
    data,
  });
}
// 环境空气功能区更新
export function airZoneupdate(data) {
  return _post({
    url: `/api/info/airZone/update`,
    data,
  });
}
// 环境功能区添加
export function airZoneadd(data) {
  return _post({
    url: `/api/info/airZone/add`,
    data,
  });
}
// 环境空气功能区查询
export function airZonelist(data) {
  return _post({
    url: `/api/info/airZone/list`,
    data,
  });
}
