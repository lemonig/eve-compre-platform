import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 基础设置获取
export function settingGet(data) {
  return _post({
    url: `/api/setting/get`,
    data,
  });
}
// 基础设置更新
export function settingUpdate(data) {
  return _post({
    url: `/api/setting/update`,
    data,
  });
}
