import http from '@/api'
import { COMMON_ADMIN_API } from '@/api/axios/servicePort'

/**
 * @name 日志管理
 */
export const LogApi = {
  page: (params: any) => http.post(COMMON_ADMIN_API + '/log/page', params),
  list: (params: any) => http.post(COMMON_ADMIN_API + '/log/list', params)
}
