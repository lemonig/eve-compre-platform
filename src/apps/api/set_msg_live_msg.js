import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 生活源信息添加
export function domesticPollutionSourceadd(data) {
  return _post({
    url: `/api/info/domesticPollutionSource/add`,
    data,
  });
}
// 生活源信息删除
export function domesticPollutionSourcedelete(data) {
  return _post({
    url: `/api/info/domesticPollutionSource/delete`,
    data,
  });
}
// 生活源信息更新
export function domesticPollutionSourceupdate(data) {
  return _post({
    url: `/api/info/domesticPollutionSource/update`,
    data,
  });
}
// 生活源信息查询
export function domesticPollutionSourcelist(data) {
  return _post({
    url: `/api/info/domesticPollutionSource/list`,
    data,
  });
}
// 生活源信息详情
export function domesticPollutionSourceget(data) {
  return _post({
    url: `/api/info/domesticPollutionSource/get`,
    data,
  });
}
