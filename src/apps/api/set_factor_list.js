import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 因子添加
export function factorAdd(data) {
  return _post({
    url: `/api/factor/add`,
    data,
  });
}
// 因子更新
export function factorUpdate(data) {
  return _post({
    url: `/api/factor/update`,
    data,
  });
}
// 因子查询
export function factorPage(data) {
  return _post({
    url: `/api/factor/page`,
    data,
  });
}
