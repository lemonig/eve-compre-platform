
import { _post, _download } from "@App/server/http";
const basePath = 'undefined'
// 企业查询 
export function companylist(data) {
  return _post({
    url: `/api/info/company/list`,
    data
  })
}
// 企业更新 
export function companyupdate(data) {
  return _post({
    url: `/api/info/company/update`,
    data
  })
}
// 企业删除 
export function companydelete(data) {
  return _post({
    url: `/api/info/company/delete`,
    data
  })
}
// 企业详情 
export function companyget(data) {
  return _post({
    url: `/api/info/company/get`,
    data
  })
}
// 企业添加 
export function companyadd(data) {
  return _post({
    url: `/api/info/company/add`,
    data
  })
}