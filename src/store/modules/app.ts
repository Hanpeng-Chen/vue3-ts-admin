import { Size } from '@/plugins/element'
import { ActionTree, Module, MutationTree } from 'vuex'
import { IRootState } from '../index'

export interface IAppState {
  sidebar: { // 定义sidebar相关状态
    opened: boolean
  },
  size: Size
}

const mutations: MutationTree<IAppState> = {
  TOGGLE_SIDEBAR(state) {
    state.sidebar.opened = !state.sidebar.opened
  },
  SET_SIZE(state, size: Size) {
    state.size = size
  }
}

const actions: ActionTree<IAppState, IRootState> = {
  toggleSidebar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  setSize({ commit }, size: Size) {
    commit('SET_SIZE', size)
  }
}

const app: Module<IAppState, IRootState> = {
  namespaced: true,
  state: {
    sidebar: {
      opened: true
    },
    size: 'medium'
  },
  mutations,
  actions
}

export default app
