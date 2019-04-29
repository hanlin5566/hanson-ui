import request from '@/utils/request'

export function getEnums(enumName) {
  return request({
    url: '/enums',
    method: 'get',
    params: {
      enumName
    }
  })
}
