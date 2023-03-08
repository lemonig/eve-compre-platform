import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 站点分组添加
export function groupAdd(data) {
  return _post({
    url: `/api/group/add`,
    data,
  });
}
// 站点分组更新
export function groupUpdate(data) {
  return _post({
    url: `/api/group/update`,
    data,
  });
}
// 站点分组查询
export function groupList(data) {
  return _post({
    url: `/api/group/list`,
    data,
  });
}
// 站点分组删除
export function groupDelete(data) {
  return _post({
    url: `/api/group/delete`,
    data,
  });
}
// 站点分组详情
export function groupGet(data) {
  return _post({
    url: `/api/group/get`,
    data,
  });
}
// 站点分组树结构
export function groupTree(data) {
  return _post({
    url: `/api/group/tree`,
    data,
  });
}
