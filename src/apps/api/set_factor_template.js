import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 因子分组删除
export function templateDelete(data) {
  return _post({
    url: `/api/factor/template/delete`,
    data,
  });
}
// 因子模板添加
export function templateAdd(data) {
  return _post({
    url: `/api/factor/template/add`,
    data,
  });
}
// 因子模板更新
export function templateUpdate(data) {
  return _post({
    url: `/api/factor/template/update`,
    data,
  });
}
// 因子模板查询
export function templateList(data) {
  return _post({
    url: `/api/factor/template/list`,
    data,
  });
}
// 因子模板详情
export function templateGet(data) {
  return _post({
    url: `/api/factor/template/get`,
    data,
  });
}
// 因子模板配置更新
export function settingUpdate(data) {
  return _post({
    url: `/api/factor/template/setting/update`,
    data,
  });
}
// 因子模板配置获取
export function settingGet(data) {
  return _post({
    url: `/api/factor/template/setting/get`,
    data,
  });
}
