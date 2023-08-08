import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 元数据单个获取
export function metaList(data) {
  return _post({
    url: `/api/metadata/list`,
    data,
  });
}
// 元数据批量获取
export function metaBatchList(data) {
  return _post({
    url: `/api/metadata/batchList`,
    data,
  });
}
// 站点分组树
export function stationTreeG(data) {
  return _post({
    url: `/api/station/group/tree`,
    data,
  });
}
// 站点区域树
export function stationTreeA(data) {
  return _post({
    url: `/api/user/region/tree`,
    data,
  });
}
// 站点流域树
export function stationTreeR(data) {
  return _post({
    url: `/api/user/river/tree`,
    data,
  });
}
// 站点流域树
export function stationTreeAll(data) {
  return _post({
    url: `/api/user/all/tree`,
    data,
  });
}
// 图片上传
export function imgUpload(data) {
  return _post({
    url: `/api/upload/picture`,
    data,
  });
}
// 文件上传
export function fileUpload(data, headers) {
  return _post({
    url: `/api/upload/file`,
    data,
    headers
  });
}
// 角色权限列表
export function roleList(data) {
  return _post({
    url: `/api/role/list`,
    data,
  });
}
