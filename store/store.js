import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    answer: [],
  },
  mutations: {
    setAnswer(state, data) {
      state.answer[data.index] = data
    },
    resetAnswer(state) {
      state.answer = []
    }
  }
})

export default store