import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/changeLog/getList',
    method: 'post',
    data,
  })
}
export function getList2(data) {
  return request({
    url: '/indexpaper/getList',
    method: 'post',
    data,
  })
}
