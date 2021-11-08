<template>
  <div>
    <AnalysisPage v-if="completed" />
  </div>
</template>

<script>
import store from '../store/store'
import { historyType } from '../constants/constants'
import AnalysisPage from '~/components/AnalysisPage.vue'
const moment = require('moment')
const UNANSWERED = historyType.UNANSWERED
const CORRECT_ANSWER = historyType.CORRECT_ANSWER
const INCORRECT_ANSWER = historyType.INCORRECT_ANSWER

export default {
  components: { AnalysisPage },
  data () {
    return {
      answer: store.state.answer,
      completed: false,
      items: []
    }
  },
  created() {
    try {
      this.items = require(`../json/${this.$route.query.exam}`)
    } catch(err) {}
  },
  mounted() {
    this.completed = false
    if (!this.answer.length) {
      this.completed = true
      return
    }
    const now = moment().format('YYYY-MM-DD HH:mm:ss')
    const history = {
      [now]: [[], [], []]
    }
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      const check = this.checkTheAnswer(item)
      if (check === INCORRECT_ANSWER) {
        const target = this.answer.find(answer => !!answer && answer.id === item.id)
        history[now][check].push({
          id: item.id,
          answer: target.answer
        })
      } else {
        history[now][check].push(item.id)
      }
    }
    this.setHistory(history)
    store.commit('resetAnswer')
    this.completed = true
  },
  methods: {
    checkTheAnswer(item) {
      let answerCheckMode
      const target = this.answer.find(answer => !!answer && answer.id === item.id)
      if (!target) {
        answerCheckMode = UNANSWERED
      }
      else if (item.answer.length !== target.answer.length) {
        answerCheckMode = INCORRECT_ANSWER
      }
      if (answerCheckMode === undefined) {
        answerCheckMode = CORRECT_ANSWER
        for (let i = 0; i < item.answer.length; i++) {
          if (item.answer[i] === target.answer[i]) {
            continue
          } else {
            answerCheckMode = INCORRECT_ANSWER
            break
          }
        }
      }
      return answerCheckMode
    },
    setHistory(history) {
      const storage = JSON.parse(localStorage.getItem(`history-${this.$route.query.exam}`))
      if (!storage) {
        localStorage.setItem(`history-${this.$route.query.exam}`, JSON.stringify([history]))
      } else {
        storage.push(history)
        localStorage.setItem(`history-${this.$route.query.exam}`, JSON.stringify(storage))
      }
    }
  }
}
</script>
