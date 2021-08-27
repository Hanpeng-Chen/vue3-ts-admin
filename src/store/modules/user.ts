import { addUser, deleteUser, editUser, getUserInfo, getUsers, login } from '@/api/user'
import { removeToken, setToken } from '@/utils/auth'
import { ActionTree, Module, MutationTree } from 'vuex'
import { IRootState } from '..'

export interface IUserInfo {
  username: string;
  password: string;
}

interface IRole {
  id: number;
  name: string;
  description: string;
}

export interface Profile {
  id: number;
  username: string;
  mobile: string;
  email: string;
  avatar: string;
  description: string;
  isSuper: boolean;
  status: boolean;
  roles: IRole[];
  roleIds?: number[];
}

export interface IUserState {
  token: string;
  userInfo: Profile | null;
  users: Profile[];
  count: number;
  roles: IRole[] | null;
}

// 查询User参数类型
export interface IUserQuery {
  pageNum?: number;
  pageSize?: number;
  username?: string;
  mobile?: string;
  status?: boolean;
}

export type IProfileQuery = Profile & {
  pageNum?: number;
  pageSize?: number;
}

type IMutations = MutationTree<IUserState>

type IActions = ActionTree<IUserState, IRootState>

const state: IUserState = {
  token: '',
  userInfo: null,
  users: [],
  count: 0,
  roles: null
}

const mutations: IMutations = {
  SET_TOKEN(state, token: string) {
    state.token = token
  },
  SET_USER_INFO(state, data: Profile) {
    state.userInfo = data
  },
  SET_USERS(state, data: Profile[]) {
    state.users = data
  },
  SET_COUNT(state, data: number) {
    state.count = data
  },
  SET_ROLES(state, data: IRole[]) {
    state.roles = data
  }
}

const actions: IActions = {
  login({ commit }, userInfo: IUserInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password }).then(response => {
        const { data } = response
        console.log('data', data)
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  logout({ commit, dispatch }) {
    return new Promise<void>((resolve) => {
      commit('SET_TOKEN', '')
      removeToken()
      dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  },
  resetToken({ commit }) {
    return new Promise<void>((resolve) => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },
  getAllUsers({ commit }, params: IUserQuery = {}) {
    return new Promise<void>((resolve, reject) => {
      getUsers(params).then(res => {
        const { data } = res
        commit('SET_USERS', data.users)
        commit('SET_COUNT', data.count)
        resolve()
      }).catch(reject)
    })
  },
  addUser({ dispatch }, data: IProfileQuery) {
    return new Promise<void>((resolve, reject) => {
      const { pageNum, pageSize, ...params } = data
      addUser(params).then(res => {
        if (res.code === 0) {
          dispatch('getAllUsers', {
            pageSize,
            pageNum
          })
        }
        resolve()
      }).catch(reject)
    })
  },
  editUser({ dispatch }, data: IProfileQuery) {
    return new Promise<void>((resolve, reject) => {
      const { pageNum, pageSize, ...params } = data
      editUser(params.id, params).then(res => {
        if (res.code === 0) {
          dispatch('getAllUsers', {
            pageSize,
            pageNum
          })
        }
        resolve()
      }).catch(reject)
    })
  },
  removeUser({ dispatch }, data: IProfileQuery) {
    return new Promise<void>((resolve, reject) => {
      const { pageNum, pageSize, id } = data
      deleteUser(id).then(res => {
        if (res.code === 0) {
          dispatch('getAllUsers', {
            pageNum,
            pageSize
          })
        }
        resolve()
      }).catch(reject)
    })
  },
  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(res => {
        const { data } = res
        const { roles, ...info } = data
        commit('SET_USER_INFO', info)
        commit('SET_ROLES', roles)
        resolve(roles)
      }).catch(reject)
    })
  }
}

const user: Module<IUserState, IRootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default user
