import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 区域添加
export function regionAdd(data) {
  return _post({
    url: `/api/region/add`,
    data,
  });
}
// 区域更新
export function regionUpdate(data) {
  return _post({
    url: `/api/region/update`,
    data,
  });
}
// 区域查询
export function regionList(data) {
  return _post({
    url: `/api/region/list`,
    data,
  });
}
// 区域树结构
export function regionTree(data) {
  return _post({
    url: `/api/region/tree`,
    data,
  });
}
// 区域详情
export function regionGet(data) {
  return _post({
    url: `/api/region/get`,
    data,
  });
}
// 区域删除
export function regionDelete(data) {
  return _post({
    url: `/api/region/delete`,
    data,
  });
}
