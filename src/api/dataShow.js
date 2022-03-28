import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/dataShow/getList',
    method: 'get',
    params,
  })
}

export function doEdit(data) {
  return request({
    url: '/dataShow/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/dataShow/doDelete',
    method: 'post',
    data,
  })
}
