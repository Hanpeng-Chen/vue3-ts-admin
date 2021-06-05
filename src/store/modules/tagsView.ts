import { RouteRecordName, RouteRecordNormalized, RouteRecordRaw } from 'vue-router'
import { ActionTree, Module, MutationTree } from 'vuex'
import { IRootState } from '../index'

export interface RouteLocationWithFullPath extends RouteRecordNormalized {
  fullPath?: string
}

export interface ITagsViewState {
  visitedViews: RouteLocationWithFullPath[],
  cachedViews: RouteRecordName[]
}

const mutations: MutationTree<ITagsViewState> = {
  ADD_VISITED_VIEW(state, view) {
    // 过滤去重
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push(Object.assign({}, view, {
      title: view.meta.title || 'tag-name'
    }))
  },
  DEL_VISITED_VIEW(state, view) {
    const i = state.visitedViews.indexOf(view)
    if (i > -1) {
      state.visitedViews.splice(i, 1)
    }
  },
  ADD_CACHED_VIEW(state, view) {
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name)
    }
  },
  DEL_CACHED_VIEW (state, view) {
    const i = state.cachedViews.indexOf(view.name)
    if (i > -1) {
      state.cachedViews.splice(i, 1)
    }
  },
  DEL_ALL_VISITED_VIEWS(state) {
    const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
    state.visitedViews = affixTags
  },
  DEL_ALL_CACHED_VIEWS(state) {
    state.cachedViews = []
  },
  DEL_OTHER_VISITED_VIEWS(state, view: RouteRecordRaw) {
    state.visitedViews = state.visitedViews.filter(tag => tag.meta.affix || (tag.path === view.path))
  },
  DEL_OTHER_CACHED_VIEWS(state, view: RouteRecordRaw) {
    state.cachedViews = state.cachedViews.filter(name => name !== view.name)
  }
}

const actions: ActionTree<ITagsViewState, IRootState> = {
  // 添加tags view
  addView({ dispatch }, view: RouteRecordRaw) {
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  // 添加可显示的tags view 添加前commit里需要进行去重过滤
  addVisitedView({ commit }, view: RouteRecordRaw) {
    commit('ADD_VISITED_VIEW', view)
  },
  // 删除tags view
  delView({ dispatch }, view: RouteRecordRaw) {
    return new Promise(resolve => {
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve(null)
    })
  },
  // 从可显示的集合中 删除tags view
  delVisitedView({ commit }, view: RouteRecordRaw) {
    commit('DEL_VISITED_VIEW', view)
  },
  addCachedView({ commit }, view: RouteRecordRaw) {
    commit('ADD_CACHED_VIEW', view)
  },
  delCachedView({ commit }, view: RouteRecordRaw) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view)
      resolve(null)
    })
  },
  delAllViews({ dispatch }) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews')
      dispatch('delAllCachedViews')
      resolve(null)
    })
  },
  delAllVisitedViews({ commit }) {
    commit('DEL_ALL_VISITED_VIEWS')
  },
  delAllCachedViews({ commit }) {
    commit('DEL_ALL_CACHED_VIEWS')
  },
  delOtherViews({ dispatch }, view: RouteRecordRaw) {
    dispatch('delOtherVisitedViews', view)
    dispatch('delOtherCachedViews', view)
  },
  delOtherVisitedViews({ commit }, view: RouteRecordRaw) {
    commit('DEL_OTHER_VISITED_VIEWS', view)
  },
  delOtherCachedViews({ commit }, view: RouteRecordRaw) {
    commit('DEL_OTHER_CACHED_VIEWS', view)
  }
}

const tagsView: Module<ITagsViewState, IRootState> = {
  namespaced: true,
  state: {
    visitedViews: [],
    cachedViews: []
  },
  mutations,
  actions
}

export default tagsView
