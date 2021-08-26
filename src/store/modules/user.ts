import { login } from '@/api/user'
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
  }
}

const user: Module<IUserState, IRootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default user
