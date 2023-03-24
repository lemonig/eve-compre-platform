import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 单站数据查询
export function queryStation(data) {
  return _post({
    url: `/api/data/station/query`,
    data,
  });
}

// 单站单因子查询
export function oneFactorChart(data) {
  return _post({
    url: `/api/data/station/oneFactorChart`,
    data,
  });
}
// 单站多因子查询
export function multiFactorChart(data) {
  return _post({
    url: `/api/data/station/multiFactorChart`,
    data,
  });
}
// 站点类型下关联数据
export function searchMeta(data) {
  return _post({
    url: `/api/type/station/get/searchMeta`,
    data,
  });
}
// 站点关联因子
export function getFactor(data) {
  return _post({
    url: `/api/station/get/factor`,
    data,
  });
}
// 单站数据导出
export function exportStation(data, title,) {
  return _download({
    url: `/api/data/station/export`,
    data,
    title,
  });
}
// 站点关联指标
export function chartEvaluateIndex(data) {
  return _post({
    url: `/api/station/get/chartEvaluateIndex`,
    data,
  });
}
