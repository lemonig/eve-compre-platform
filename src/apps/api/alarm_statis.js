
import { _post, _download } from "@App/server/http";
const basePath = 'undefined'
// 告警统计 
export function alarmStatis(data) {
  return _post({
    url: `/api/alarm/data/stat`,
    data
  })
}
// 告警统计导出 
export function alarmStatisexport(data, title) {
  return _download({
    url: `/api/alarm/data/stat/export`,
    data,
    title
  })
}

// 消息统计 
export function logStat(data) {
  return _post({
    url: `/api/alarm/log/stat`,
    data
  })
}
// 消息统计导出 
export function logExport(data, title) {
  return _download({
    url: `/api/alarm/log/stat/export`,
    data,
    title
  })
}