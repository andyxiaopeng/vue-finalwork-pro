const state = {
  arithmeticShow: [],
}

const mutations = {
  setArithmeticShow(state, arithmeticShow) {
    if (arithmeticShow) {
      state.arithmeticShow = arithmeticShow
    } else {
      state.arithmeticShow = []
    }
  },
}

const actions = {
  setArithmeticShow({ commit }, arithmeticShow) {
    commit('setArithmeticShow', arithmeticShow)
  },
}

export default {
  state,
  mutations,
  actions,
}
