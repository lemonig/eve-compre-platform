import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 流域添加
export function riverAdd(data) {
  return _post({
    url: `/api/river/add`,
    data,
  });
}
// 流域更新
export function riverUpdate(data) {
  return _post({
    url: `/api/river/update`,
    data,
  });
}
// 流域查询
export function riverList(data) {
  return _post({
    url: `/api/river/list`,
    data,
  });
}
// 流域详情
export function riverGet(data) {
  return _post({
    url: `/api/river/get`,
    data,
  });
}
// 流域删除
export function riverDelete(data) {
  return _post({
    url: `/api/river/delete`,
    data,
  });
}
// 流域树结构
export function riverTree(data) {
  return _post({
    url: `/api/river/tree`,
    data,
  });
}
