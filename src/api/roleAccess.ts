import { MenuData } from '@/store/modules/menu'
import { IRole, IRoleAccessList } from '@/store/modules/role'
import request from './config/request'
import { ApiResponse } from './type'

// 根据角色分配权限
export const allocRoleAccess = (id: number, data: number[]): Promise<ApiResponse> => {
  return request.post(`/role_access/${id}`, {
    access: data
  })
}

// 根据角色获取权限
export const getRoleAccess = (id: number): Promise<ApiResponse<IRoleAccessList>> => {
  return request.get(`/role_access/${id}`)
}

type RolesAccess = MenuData & {
  roles: IRole[]
}

interface ApiRolesAccess {
  access: RolesAccess[]
}
export const getAccessByRoles = (roles: number[]): Promise<ApiResponse<ApiRolesAccess>> => {
  return request.post('/role_access/role/access', {
    roles
  })
}
