import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 用户查询
export function userPage(data) {
  return _post({
    url: `/api/user/page`,
    data,
  });
}
// 用户添加
export function userAdd(data) {
  return _post({
    url: `/api/user/add`,
    data,
  });
}
// 用户更新
export function userUpdate(data) {
  return _post({
    url: `/api/user/update`,
    data,
  });
}
// 用户详情
export function userDetail(data) {
  return _post({
    url: `/api/user/get`,
    data,
  });
}
// 用户重置密码
export function userResetPassword(data) {
  return _post({
    url: `/api/user/resetPassword`,
    data,
  });
}
