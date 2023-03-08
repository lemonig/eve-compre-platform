import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 站点字段列表
export function fieldList(data) {
  return _post({
    url: `/api/station/field/list`,
    data,
  });
}
// 站点字段添加
export function fieldAdd(data) {
  return _post({
    url: `/api/station/field/add`,
    data,
  });
}
// 站点字段更新
export function fieldUpdate(data) {
  return _post({
    url: `/api/station/field/update`,
    data,
  });
}
// 站点字段删除
export function fieldDelete(data) {
  return _post({
    url: `/api/station/field/delete`,
    data,
  });
}
// 站点字段详情
export function fieldGet(data) {
  return _post({
    url: `/api/station/field/get`,
    data,
  });
}
