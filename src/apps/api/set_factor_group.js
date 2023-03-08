import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 因子分组添加
export function groupAdd(data) {
  return _post({
    url: `/api/factor/group/add`,
    data,
  });
}
// 因子分组更新
export function groupUpdate(data) {
  return _post({
    url: `/api/factor/group/update`,
    data,
  });
}
// 因子分组查询
export function groupList(data) {
  return _post({
    url: `/api/factor/group/list`,
    data,
  });
}
// 因子分组shanchu
export function groupDelete(data) {
  return _post({
    url: `/api/factor/group/delete`,
    data,
  });
}
// 因子分组详情
export function groupGet(data) {
  return _post({
    url: `/api/factor/group/get`,
    data,
  });
}
