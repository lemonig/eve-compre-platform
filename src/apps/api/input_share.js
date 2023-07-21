import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 用户获取接口token
export function generateToken(data) {
  return _post({
    url: `/api/dataShare/generateToken`,
    data,
  });
}
// 解析API文档
export function evalApiDataShare(data) {
  return _post({
    url: `/api/dataShare/evalApi`,
    data,
  });
}
// 文档
export function shareDoc(data) {
  return _post({
    url: `/api/dataShare/doc`,
    data,
  });
}
// 用户附件-站点
export function stationDataShare(data) {
  return _post({
    url: `/api/dataShare/extra/station`,
    data,
  });
}
// 用户附件-因子
export function factorDataShare(data) {
  return _post({
    url: `/api/dataShare/extra/factor`,
    data,
  });
}
// 调用日志
export function pageDataShareLog(data) {
  return _post({
    url: `/api/dataShare/log/page`,
    data,
  });
}
