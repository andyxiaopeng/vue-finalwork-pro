import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/arithmeticShow/getList',
    method: 'get',
    params,
  })
}

export function doEdit(data) {
  return request({
    url: '/arithmeticShow/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/arithmeticShow/doDelete',
    method: 'post',
    data,
  })
}
