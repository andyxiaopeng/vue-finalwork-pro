import request from '@/utils/request'

export function getList2(params) {
  return request({
    url: '/indexpaper/getList',
    method: 'get',
    params,
  })
}

export function doEdit(data) {
  return request({
    url: '/indexpaper/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/indexpaper/doDelete',
    method: 'post',
    data,
  })
}
