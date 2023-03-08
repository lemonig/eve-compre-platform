import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 在线配置更新
export function onlineUpdate(data) {
  return _post({
    url: `/api/station/online/update`,
    data,
  });
}
// 在线站点查询
export function onlinePage(data) {
  return _post({
    url: `/api/station/online/page`,
    data,
  });
}
