import variables from '@/styles/variables.scss'
import { ActionTree, Module, MutationTree } from 'vuex'
import { IRootState } from '../index'

export interface ISettingsState {
  theme: string;
  originStyle: string;
  tagsView: boolean;
  sidebarLogo: boolean;
}

// 动态key的情况下，根据不同的key约束对应的value
type ValueOf<T> = T[keyof T];
interface ISettings {
  key: keyof ISettingsState; // 约束为ISettingsState中的key
  value: ValueOf<ISettingsState>; // 约束为ISettingsState中value的类型
}

const mutations: MutationTree<ISettingsState> = {
  CHANGE_SETTING(state, { key, value }:ISettings) {
    if (key in state) {
      (state[key] as ValueOf<ISettingsState>) = value
    }
  }
}

const actions: ActionTree<ISettingsState, IRootState> = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

const settings: Module<ISettingsState, IRootState> = {
  namespaced: true,
  state: {
    theme: variables.theme,
    originStyle: '', // 保存element主题样式内容，作为替换模板
    tagsView: true,
    sidebarLogo: true
  },
  mutations,
  actions
}

export default settings
