import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 评价指标查询
export function evaluteList(data) {
  return _post({
    url: `/api/evaluateIndex/list`,
    data,
  });
}
// 评价指标添加
export function evaluteAdd(data) {
  return _post({
    url: `/api/evaluateIndex/add`,
    data,
  });
}
// 评价指标更新
export function evaluteUpdate(data) {
  return _post({
    url: `/api/evaluateIndex/update`,
    data,
  });
}
// 评价指标详情
export function evaluteGet(data) {
  return _post({
    url: `/api/evaluateIndex/get`,
    data,
  });
}
// 评价指标详情
export function evaluteDelete(data) {
  return _post({
    url: `/api/evaluateIndex/delete`,
    data,
  });
}
