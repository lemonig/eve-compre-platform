import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 饮用水源删除
export function drinkWaterSourcedelete(data) {
  return _post({
    url: `/api/info/drinkWaterSource/delete`,
    data,
  });
}
// 饮用水源查询
export function drinkWaterSourcelist(data) {
  return _post({
    url: `/api/info/drinkWaterSource/list`,
    data,
  });
}
// 饮用水源更新
export function drinkWaterSourceupdate(data) {
  return _post({
    url: `/api/info/drinkWaterSource/update`,
    data,
  });
}
// 饮用水源详情
export function drinkWaterSourceget(data) {
  return _post({
    url: `/api/info/drinkWaterSource/get`,
    data,
  });
}
// 饮用水源添加
export function drinkWaterSourceadd(data) {
  return _post({
    url: `/api/info/drinkWaterSource/add`,
    data,
  });
}
