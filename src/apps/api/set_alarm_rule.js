import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 创建规则组
export function addGroup(data) {
  return _post({
    url: `/api/rule/group/add`,
    data,
  });
}
// 更新规则组
export function updateGroup(data) {
  return _post({
    url: `/api/rule/group/update`,
    data,
  });
}
// 删除规则组
export function deleteGroup(data) {
  return _post({
    url: `/api/rule/group/delete`,
    data,
  });
}
// 更新规则组状态
export function statusGroup(data) {
  return _post({
    url: `/api/rule/group/status`,
    data,
  });
}
// 更新短息通知状态
export function smsStatusGroup(data) {
  return _post({
    url: `/api/rule/group/sms/status`,
    data,
  });
}
// 更新微信通知状态
export function wxStatusGroup(data) {
  return _post({
    url: `/api/rule/group/wx/status`,
    data,
  });
}
// 规则组查询
export function pageGroup(data) {
  return _post({
    url: `/api/rule/group/page`,
    data,
  });
}
// 更具规则组id查询
export function getGroup(data) {
  return _post({
    url: `/api/rule/group/get`,
    data,
  });
}
