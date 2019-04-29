import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/buildings',
    method: 'get',
    params: params
  })
}

export function save(params) {
  return request({
    url: '/admin/IDealer/saveDealer',
    method: 'post',
    data: params
  })
}

export function del(id) {
  return request({
    url: '/admin/IDealer/deleteDealer/' + id,
    method: 'delete'
  })
}

export function get(id) {
  return request({
    url: '/admin/IDealer/' + id,
    method: 'get'
  })
}

export function getAllPermissionDealer(name) {
  return request({
    url: '/admin/IDealer/allPermissionDealer',
    method: 'get',
    params: {
      dealerName: name
    }
  })
}

export function getAllDealer(name) {
  return request({
    url: '/admin/IDealer/allValidDealer',
    method: 'get',
    params: {
      dealerName: name
    }
  })
}
