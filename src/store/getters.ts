import { GetterTree } from 'vuex'
import { IRootState } from './index'

const getters: GetterTree<IRootState, IRootState> = {
  sidebar: (state) => state.app.sidebar,
  size: (state) => state.app.size,
  themeColor: (state) => state.settings.theme,
  roles: (state) => state.user.roles,
  roleIds: state => (state.user.roles || []).map(role => role.id),
  roleNames: state => (state.user.roles || []).map(role => role.name)
}

export default getters
