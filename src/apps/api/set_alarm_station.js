import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 创建站点组
export function addGroup(data) {
  return _post({
    url: `/api/station/group/add`,
    data,
  });
}
// 更新站点组
export function updateGroup(data) {
  return _post({
    url: `/api/station/group/update`,
    data,
  });
}
// 根据id查询站点组信息
export function getGroup(data) {
  return _post({
    url: `/api/station/group/get`,
    data,
  });
}
// 删除站点组
export function deleteGroup(data) {
  return _post({
    url: `/api/station/group/delete`,
    data,
  });
}
// 修改站点组状态
export function statusGroup(data) {
  return _post({
    url: `/api/station/group/status`,
    data,
  });
}
// 站点组查询
export function pageGroup(data) {
  return _post({
    url: `/api/station/group/page`,
    data,
  });
}
