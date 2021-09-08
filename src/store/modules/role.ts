import { addRole, deleteRole, editRole, getRoles, RoleParams } from '@/api/role'
import { ActionTree, Module, MutationTree } from 'vuex'
import { IRootState } from '..'

/* eslint-disable camelcase */
export interface IRoleAccess {
  id: number;
  role_id: number;
  access_id: number;
}

export type IRoleAccessList = IRoleAccess[]

export interface IRole {
  id: number;
  name: string;
  description: string;
  is_default: boolean;
  createAt: string;
  updateAt: string;
}

export interface IRoleState {
  roles: IRole[];
  count: number;
}

// mutation类型
type IMutations = MutationTree<IRoleState>

// action类型
type IActions = ActionTree<IRoleState, IRootState>

const state: IRoleState = {
  roles: [],
  count: 0
}

const mutations: IMutations = {
  SET_ROLES(state, data: IRoleState['roles']) {
    state.roles = data
  },
  SET_COUNT(state, count: number) {
    state.count = count
  }
}

type ActionRoleParams = IRole & {
  pageSize: number,
  pageNum: number
}

const actions: IActions = {
  getRoles({ commit }, params: RoleParams) {
    return new Promise<void>((resolve, reject) => {
      getRoles(params).then(res => {
        const { data } = res
        commit('SET_ROLES', data.roles)
        commit('SET_COUNT', data.count)
        resolve()
      }).catch(reject)
    })
  },
  addRole({ dispatch }, data: ActionRoleParams) {
    return new Promise<void>((resolve, reject) => {
      const { pageNum, pageSize, ...params } = data
      addRole(params).then(res => {
        if (res.code === 0) {
          dispatch('getRoles', {
            pageSize,
            pageNum
          })
        }
        resolve()
      }).catch(reject)
    })
  },
  editRole({ dispatch }, data: ActionRoleParams) {
    return new Promise<void>((resolve, reject) => {
      const { pageNum, pageSize, ...params } = data
      editRole(params.id, params).then(res => {
        if (res.code === 0) {
          dispatch('getRoles', {
            pageNum,
            pageSize
          })
        }
        resolve()
      }).catch(reject)
    })
  },
  deleteRole({ dispatch }, data: ActionRoleParams) {
    return new Promise<void>((resolve, reject) => {
      const { pageSize, pageNum, id } = data
      deleteRole(id).then(res => {
        if (res.code === 0) {
          dispatch('getRoles', {
            pageNum,
            pageSize
          })
        }
        resolve()
      }).catch(reject)
    })
  }
}

const role: Module<IRoleState, IRootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default role
