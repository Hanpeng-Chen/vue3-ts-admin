import { ActionTree, Module, MutationTree } from 'vuex'
import { IRootState } from '../index'

export interface IAppState {
  sidebar: { // 定义sidebar相关状态
    opened: boolean
  }
}

const mutations: MutationTree<IAppState> = {
  TOGGLE_SIDEBAR(state) {
    state.sidebar.opened = !state.sidebar.opened
  }
}

const actions: ActionTree<IAppState, IRootState> = {
  toggleSidebar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  }
}

const app: Module<IAppState, IRootState> = {
  namespaced: true,
  state: {
    sidebar: {
      opened: true
    }
  },
  mutations,
  actions
}

export default app
