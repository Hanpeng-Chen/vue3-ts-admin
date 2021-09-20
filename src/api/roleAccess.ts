import { MenuData } from '@/store/modules/menu'
import { IRole, IRoleAccessList } from '@/store/modules/role'
import request from './config/request'
import { ApiResponse } from './type'

// 根据角色分配权限
export const allocRoleAccess = (id: number, data: number[]): Promise<ApiResponse> => {
  return request.post(`/roleAccess/${id}`, {
    access: data
  })
}

// 根据角色获取权限
export const getRoleAccess = (id: number): Promise<ApiResponse<IRoleAccessList>> => {
  return request.get(`/roleAccess/${id}`)
}

type RolesAccess = MenuData & {
  roles: IRole[]
}

interface ApiRolesAccess {
  access: RolesAccess[]
}
export const getAccessByRoles = (roles: number[]): Promise<ApiResponse<ApiRolesAccess>> => {
  return request.post('/roleAccess/role/access', {
    roles
  })
}
