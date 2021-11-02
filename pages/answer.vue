<style scoped>
  .correct-answer {
    color: red;
  }
  .incorrect-answer {
    color: blue;
  }
  .answer-no {
    background: lightgray;
  }
  .answer-col {
    border-bottom: 1px solid gray;
  }
</style>
<template>
  <div>
    <v-row no-gutters class="ma-3">
      <v-btn
        color="primary"
        depressed
        to="/"
      >
        トップへ戻る
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        depressed
        :to="{ path: 'analysis', query: { exam: $route.query.exam }}"
      >
        分析する
      </v-btn>
    </v-row>
    <v-card class="ma-3">
      <v-row no-gutters>
        <v-col v-for="item, index in items" :key="item.id" class="answer-col" cols="3">
          <v-row no-gutters>
            <v-col class="answer-no pa-2" cols="6">問題{{ index + 1 }}</v-col>
            <v-col v-if="checkTheAnswer(item) === 1" class="correct-answer pa-2" cols="6">正解</v-col>
            <v-col v-else-if="checkTheAnswer(item) === 2" class="incorrect-answer pa-2" cols="6">不正解</v-col>
            <v-col v-else class="pa-2" cols="6">未解答</v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import store from '../store/store'
import { historyType } from '../constants/constants'
const moment = require('moment')
const UNANSWERED = historyType.UNANSWERED
const CORRECT_ANSWER = historyType.CORRECT_ANSWER
const INCORRECT_ANSWER = historyType.INCORRECT_ANSWER

export default {
  data () {
    return {
      answer: store.state.answer,
      items: []
    }
  },
  created() {
    try {
      this.items = require(`../json/${this.$route.query.exam}`)
    } catch(err) {}
  },
  mounted() {
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
      const storage = JSON.parse(localStorage.getItem('history'))
      if (!storage) {
        localStorage.setItem('history', JSON.stringify([history]))
      } else {
        storage.push(history)
        localStorage.setItem('history', JSON.stringify(storage))
      }
    }
  }
}
</script>
