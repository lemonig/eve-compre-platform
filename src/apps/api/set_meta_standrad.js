import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 评价标准查询
export function standardList(data) {
  return _post({
    url: `/api/evaluatePlan/list`,
    data,
  });
}
// 评价标准添加
export function standardAdd(data) {
  return _post({
    url: `/api/evaluatePlan/add`,
    data,
  });
}
// 评价标准更新
export function standardUpdate(data) {
  return _post({
    url: `/api/evaluatePlan/update`,
    data,
  });
}
// 评价标准详情
export function standardGet(data) {
  return _post({
    url: `/api/evaluatePlan/get`,
    data,
  });
}
// 评价标准删除
export function standardDelete(data) {
  return _post({
    url: `/api/evaluatePlan/delete`,
    data,
  });
}
