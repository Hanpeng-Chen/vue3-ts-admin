import { createStore, Store, useStore as baseUseStore } from 'vuex'
import app, { IAppState } from '@/store/modules/app'
import createPersistedState from 'vuex-persistedstate'
import getters from './getters'
import { InjectionKey } from 'vue'
import tagsView, { ITagsViewState } from '@/store/modules/tagsView'
import settings, { ISettingsState } from './modules/settings'
import user, { IUserState } from './modules/user'
import role, { IRoleState } from './modules/role'
import menu, { IMenuState } from './modules/menu'
import permission, { IPermissionState } from './modules/permission'

export interface IRootState {
  app: IAppState,
  user: IUserState,
  tagsView: ITagsViewState,
  settings: ISettingsState,
  role: IRoleState,
  menu: IMenuState,
  permission: IPermissionState
}

// eslint-disable-next-line symbol-description
export const key: InjectionKey<Store<IRootState>> = Symbol()

// vuex store持久化
const persisteAppState = createPersistedState({
  storage: window.sessionStorage,
  key: 'vuex_app',
  paths: ['app.sidebar.opened', 'app.size'] // 只针对app模块下的sidebar.opened状态持久化
})

const persisteSettingsState = createPersistedState({
  storage: window.sessionStorage,
  key: 'vuex_settings',
  paths: ['settings.theme', 'settings.originStyle', 'settings.tagsView', 'settings.sidebarLogo']
})

export default createStore({
  plugins: [
    persisteAppState,
    persisteSettingsState
  ],
  getters,
  modules: {
    app,
    user,
    tagsView,
    settings,
    role,
    menu,
    permission
  }
})

// eslint-disable-next-line
export function useStore() {
  return baseUseStore(key)
}
