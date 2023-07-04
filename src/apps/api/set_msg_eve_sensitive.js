import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 环境敏感点详情
export function sensitivePointget(data) {
  return _post({
    url: `/api/info/sensitivePoint/get`,
    data,
  });
}
// 环境敏感点更新
export function sensitivePointupdate(data) {
  return _post({
    url: `/api/info/sensitivePoint/update`,
    data,
  });
}
// 环境敏感点查询
export function sensitivePointlist(data) {
  return _post({
    url: `/api/info/sensitivePoint/list`,
    data,
  });
}
// 环境敏感点删除
export function sensitivePointdelete(data) {
  return _post({
    url: `/api/info/sensitivePoint/delete`,
    data,
  });
}
// 环境敏感点添加
export function sensitivePointadd(data) {
  return _post({
    url: `/api/info/sensitivePoint/add`,
    data,
  });
}
