import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 园区更新
export function domesticPollutionSourceupdate(data) {
  return _post({
    url: `/api/info/park/update`,
    data,
  });
}
// 园区删除
export function domesticPollutionSourcedelete(data) {
  return _post({
    url: `/api/info/park/delete`,
    data,
  });
}
// 园区查询
export function domesticPollutionSourcelist(data) {
  return _post({
    url: `/api/info/park/list`,
    data,
  });
}
// 园区详情
export function domesticPollutionSourceget(data) {
  return _post({
    url: `/api/info/park/get`,
    data,
  });
}
// 园区添加
export function domesticPollutionSourceadd(data) {
  return _post({
    url: `/api/info/park/add`,
    data,
  });
}
