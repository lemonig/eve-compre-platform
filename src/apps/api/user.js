import { _post } from "@App/server/http";
// 用户
export function dbLogin(data) {
  return _post({
    url: `/api/doLogin`,
    data,
  });
}
//  登录 当前用户信息
export function owner(params) {
  return _post({
    url: "/api/user/owner",
    data: params,
  });
}
// 菜单
export function menuList(data) {
  return _post({
    url: `/api/user/owner/menuList`,
    data,
  });
}

export function logout(params) {
  return _post({
    url: "/api/logout",
    data: params,
  });
}
// 修改密码
export function updateOwnerPassword(params) {
  return _post({
    url: "/api/user/updateOwnerPassword",
    data: params,
  });
}

// 用户所属站点类型
export function stationPage(data) {
  return _post({
    url: `/api/user/type/station`,
    data,
  });
}
