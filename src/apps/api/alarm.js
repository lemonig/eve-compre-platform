//数据告警
import { _post, _download } from "@App/server/http";
export function pageAlarm(data) {
  return _post({
    url: `/api/alarm/data/page`,
    data,
  });
}
