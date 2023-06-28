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

// 用户站点关联信息
export function userRelation(data) {
  return _post({
    url: `/api/user/station/relation`,
    data,
  });
}

// 用户相关站点主题
export function topicList(data) {
  return _post({
    url: `/api/user/type/topic`,
    data,
  });
}
// 用户相关站点20
export function userStation(data) {
  return _post({
    url: `/api/user/station`,
    data,
  });
}
// 用户相关河流
export function userRiver(data) {
  return _post({
    url: `/api/user/river`,
    data,
  });
}
// 用户相关区域
export function userRegion(data) {
  return _post({
    url: `/api/user/region`,
    data,
  });
}
