import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/arithmeticTrain/getList',
    method: 'get',
    params,
  })
}

export function doEdit(data) {
  return request({
    url: '/arithmeticTrain/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/arithmeticTrain/doDelete',
    method: 'post',
    data,
  })
}
