import { getAllMenus } from '@/api/menu'
import { getAccessByRoles } from '@/api/roleAccess'
import generateMenuTree from '@/utils/generateMenuTree'
import generateTree from '@/utils/generateTree'
import { ActionTree, Module, MutationTree } from 'vuex'
import { IRootState } from '..'

/* eslint-disable camelcase */
export interface MenuData {
  id: number;
  title: string;
  path: string;
  name: string;
  icon: string;
  parent_id: number | string;
  sort_id: number;
}

export interface ITreeItemData extends MenuData {
  children?: ITreeItemData[];
}

export interface IMenuState {
  menuTreeData: Array<ITreeItemData>; // 树形菜单数据
  menuList: Array<MenuData>; // 原始菜单列表数据
  authMenuTreeData: Array<ITreeItemData>; // 树形菜单数据
  authMenuList: Array<MenuData>; // 原始菜单列表数据
}

type IMutations = MutationTree<IMenuState>

type IActions = ActionTree<IMenuState, IRootState>

const state: IMenuState = {
  menuTreeData: [],
  menuList: [],
  authMenuTreeData: [],
  authMenuList: []
}

const mutations: IMutations = {
  SET_MENU_LIST(state, data: IMenuState['menuList']) {
    state.menuList = data
  },
  SET_MENU_TREE_DATA(state, data: IMenuState['menuTreeData']) {
    state.menuTreeData = data
  },
  SET_AUTH_MENU_LIST(state, data: IMenuState['authMenuList']) {
    state.authMenuList = data
  },
  SET_AUTH_MENU_TREE_DATA(state, data: IMenuState['authMenuTreeData']) {
    state.authMenuTreeData = data
  }
}

const actions: IActions = {
  getAllMenuList({ dispatch, commit }) {
    return new Promise<MenuData[]>((resolve, reject) => {
      getAllMenus().then(res => {
        const { data } = res
        dispatch('generateTreeData', [...data])
        commit('SET_MENU_LIST', data)
        resolve([...data])
      }).catch(reject)
    })
  },
  generateTreeData({ commit }, data: IMenuState['menuList']) {
    const treeData = generateTree(data)
    commit('SET_MENU_TREE_DATA', treeData)
  },
  generateAuthTreeData({ commit }, data: IMenuState['menuList']) {
    const treeData = generateMenuTree(data)
    commit('SET_AUTH_MENU_TREE_DATA', treeData)
  },
  getAllMenuListByAdmin({ dispatch, commit }) {
    return new Promise<MenuData[]>((resolve, reject) => {
      getAllMenus().then(res => {
        const { data } = res
        dispatch('generateAuthTreeData', [...data])
        commit('SET_AUTH_MENU_LIST', data)
        resolve([...data])
      }).catch(reject)
    })
  },
  getAccessByRoles({ dispatch, commit }, roles: number[]) {
    return new Promise<MenuData[]>((resolve, reject) => {
      getAccessByRoles(roles).then(res => {
        const { access } = res.data
        dispatch('generateAuthTreeData', [...access])
        commit('SET_AUTH_MENU_LIST', access)
        resolve([...access])
      }).catch(reject)
    })
  }
}

const menu: Module<IMenuState, IRootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default menu
