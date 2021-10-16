import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    answer: [],
    examFile: ''
  },
  mutations: {
    setAnswer(state, data) {
      state.answer[data.index] = data
    },
    setExamFile(state, data) {
      state.examFile = data
    }
  }
})

export default store