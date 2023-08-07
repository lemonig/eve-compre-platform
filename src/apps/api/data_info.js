
import { _post, _download } from "@App/server/http";
const basePath = 'undefined'
// 站点资料 
export function stationPage(data) {
  return _post({
    url: `/api/user/station/page`,
    data
  })
}
// 站点详情 
export function stationInfo(data) {
  return _post({
    url: `/api/user/station/info`,
    data
  })
}
// 站点详情 
export function stationPageExport(data, title) {
  return _download({
    url: `/api/user/station/export`,
    data,
    title
  })
}