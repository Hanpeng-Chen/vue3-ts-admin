import { IRole, IRoleState } from '@/store/modules/role'
import request from './config/request'
import { ApiResponse } from './type'

export interface RoleParams {
  pageNum: number;
  pageSize: number;
}

export const getRoles = (params = { pageNum: 0, pageSize: 10 }): Promise<ApiResponse<IRoleState>> => {
  return request.get('/role', {
    params
  })
}

export const deleteRole = (id: number): Promise<ApiResponse> => {
  return request.delete(`/role/${id}`)
}

export const addRole = (data: IRole): Promise<ApiResponse> => {
  return request.post('/role', data)
}

export const editRole = (id: number, data: IRole): Promise<ApiResponse> => {
  return request.put(`/role/${id}`, data)
}
