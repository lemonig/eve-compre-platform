import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 接入管理列表
export function listAccess(data) {
  return _post({
    url: `/api/data/access/list`,
    data,
  });
}
// 接入添加
export function addAccess(data) {
  return _post({
    url: `/api/data/access/add`,
    data,
  });
}
// 接入修改
export function updateAccess(data) {
  return _post({
    url: `/api/data/access/update`,
    data,
  });
}
// 接入删除
export function deleteAccess(data) {
  return _post({
    url: `/api/data/access/delete`,
    data,
  });
}
// 接入detail
export function getAccess(data) {
  return _post({
    url: `/api/data/access/get`,
    data,
  });
}
// 接入日志
export function accessLog(data) {
  return _post({
    url: `/api/data/access/log/page`,
    data,
  });
}
