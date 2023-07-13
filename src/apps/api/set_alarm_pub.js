import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 告警站点查询
export function pageStation(data) {
  return _post({
    url: `/api/rule/station/page`,
    data,
  });
}
// 告警站点状态修改
export function statusStation(data) {
  return _post({
    url: `/api/rule/station/status`,
    data,
  });
}

// 告警因子状态
export function listFactor(data) {
  return _post({
    url: `/api/rule/factor/list`,
    data,
  });
}

// 告警因子状态修改
export function statusFactor(data) {
  return _post({
    url: `/api/rule/factor/status`,
    data,
  });
}

// 告警因子状态全部
export function allListFactor(data) {
  return _post({
    url: `/api/rule/factor/all`,
    data,
  });
}
