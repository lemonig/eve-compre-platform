import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 业务主题查询
export function topicList(data) {
  return _post({
    url: `/api/type/topic/list`,
    data,
  });
}
// 业务主题添加
export function topicAdd(data) {
  return _post({
    url: `/api/type/topic/add`,
    data,
  });
}
// 业务主题更新
export function topicUpdate(data) {
  return _post({
    url: `/api/type/topic/update`,
    data,
  });
}
// 业务主题详情
export function topicGet(data) {
  return _post({
    url: `/api/type/topic/get`,
    data,
  });
}
