import request from '@/utils/request'

//获取列表
export function list(params) {
  return request({
    url: '/communitys/',
    method: 'get',
    params: params
  })
}

//获取详情
export function get(id) {
  return request({
    url: '/communitys/'+id,
    method: 'get'
  })
}

//添加
export function save(params) {
  return request({
    url: '/communitys',
    method: 'post',
    params: {
      params
    }
  })
}

//删除
export function del(id) {
  return request({
    url: '/communitys/'+id,
    method: 'delete'
  })
}

//修改
export function update(id,params) {
  return request({
    url: '/communitys/'+id,
    method: 'put',
    params: {
      params
    }
  })
}

