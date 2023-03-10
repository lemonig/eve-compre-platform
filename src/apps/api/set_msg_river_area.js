import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 环境地表水功能区更新
export function waterZoneupdate(data) {
  return _post({
    url: `/api/info/waterZone/update`,
    data,
  });
}
// 环境地表水功能区添加
export function waterZoneadd(data) {
  return _post({
    url: `/api/info/waterZone/add`,
    data,
  });
}
// 环境地表水功能区详情
export function waterZoneget(data) {
  return _post({
    url: `/api/info/waterZone/get`,
    data,
  });
}
// 环境地表水功能区删除
export function waterZonedelete(data) {
  return _post({
    url: `/api/info/waterZone/delete`,
    data,
  });
}
// 环境空气功能区查询
export function waterZonelist(data) {
  return _post({
    url: `/api/info/waterZone/list`,
    data,
  });
}
