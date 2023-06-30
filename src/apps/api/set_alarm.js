import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 查询规则类型
export function listRule(data) {
  return _post({
    url: `/api/rule/list`,
    data,
  });
}
// 根据规则类型编码查询规则内容参数
export function getParametersByRuleCode(data) {
  return _post({
    url: `/api/rule/content/getParametersByRuleCode`,
    data,
  });
}
// 添加规则内容
export function addContent(data) {
  return _post({
    url: `/api/rule/content/add`,
    data,
  });
}
// 更新规则内容
export function updateContent(data) {
  return _post({
    url: `/api/rule/content/update`,
    data,
  });
}
// 规则内容删除
export function deleteContent(data) {
  return _post({
    url: `/api/rule/content/delete`,
    data,
  });
}
// 更新规则内容状态
export function statusContent(data) {
  return _post({
    url: `/api/rule/content/status`,
    data,
  });
}
// 查询规则内容
export function pageContent(data) {
  return _post({
    url: `/api/rule/content/page`,
    data,
  });
}
// 根据id查询规则内容
export function getContent(data) {
  return _post({
    url: `/api/rule/content/get`,
    data,
  });
}

export function getAlarmComparisonOperator(data) {
  return _post({
    url: `/api/rule/content/alarmComparisonOperator`,
    data,
  });
}

export function getAlarmDataType(data) {
  return _post({
    url: `/api/rule/content/alarmDataType`,
    data,
  });
}
