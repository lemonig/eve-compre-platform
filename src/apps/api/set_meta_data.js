import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 元数据查询
export function metadataTypePage(data) {
  return _post({
    url: `/api/metadata/type/page`,
    data,
  });
}
// 元数据添加
export function metadataTypeAdd(data) {
  return _post({
    url: `/api/metadata/type/add`,
    data,
  });
}
// 元数据更新
export function metadataTypeUpdate(data) {
  return _post({
    url: `/api/metadata/type/update`,
    data,
  });
}
// 元数据更新
export function metadataTypeDelete(data) {
  return _post({
    url: `/api/metadata/type/delete`,
    data,
  });
}
// 元数据选项添加
export function metadataAdd(data) {
  return _post({
    url: `/api/metadata/add`,
    data,
  });
}
// 元数据选项更新
export function metadataUpdate(data) {
  return _post({
    url: `/api/metadata/update`,
    data,
  });
}
// 元数据选项查询
export function metadataPage(data) {
  return _post({
    url: `/api/metadata/page`,
    data,
  });
}
// 元数据选项删除
export function metadataDelete(data) {
  return _post({
    url: `/api/metadata/delete`,
    data,
  });
}
