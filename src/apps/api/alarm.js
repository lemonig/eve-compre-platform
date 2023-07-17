//数据告警
import { _post, _download } from "@App/server/http";
export function pageAlarm(data) {
  return _post({
    url: `/api/alarm/data/page`,
    data,
  });
}
//数据告警导出
export function pageAlarmExport(data, title) {
  return _download({
    url: `/api/alarm/data/export`,
    data,
    title,
  });
}
