import { getListt } from '@/api/dataShow'

const state = {
  dataShow: [],
}

const mutations = {
  setDataShow(state, dataShow) {
    if (dataShow) {
      state.dataShow = dataShow
    } else {
      state.dataShow = []
    }
  },
}

const actions = {
  setDataShow({ commit }, dataShow) {
    commit('setDataShow', dataShow)
  },
}

export default {
  state,
  mutations,
  actions,
}
