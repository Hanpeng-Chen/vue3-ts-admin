import { createStore, Store, useStore as baseUseStore } from 'vuex'
import app, { IAppState } from '@/store/modules/app'
import createPersistedState from 'vuex-persistedstate'
import getters from './getters'
import { InjectionKey } from 'vue'

export interface IRootState {
  app: IAppState
}

// eslint-disable-next-line symbol-description
export const key: InjectionKey<Store<IRootState>> = Symbol()

// vuex store持久化
const persisteAppState = createPersistedState({
  storage: window.sessionStorage,
  key: 'vuex_app',
  paths: ['app.sidebar.opened'] // 只针对app模块下的sidebar.opened状态持久化
})

export default createStore({
  plugins: [
    persisteAppState
  ],
  getters,
  modules: {
    app
  }
})

// eslint-disable-next-line
export function useStore() {
  return baseUseStore(key)
}
