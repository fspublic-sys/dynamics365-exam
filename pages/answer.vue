
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
  <v-card class="ma-3">
    <v-row no-gutters>
      <v-col v-for="item, index in items" :key="item.id" class="answer-col" cols="3">
        <v-row no-gutters>
          <v-col class="answer-no pa-2" cols="6">問題{{ index + 1 }}</v-col>
          <v-col v-if="checkTheAnswer(item) === 1" class="correct-answer pa-2" cols="6">正解</v-col>
          <v-col v-else-if="checkTheAnswer(item) === 2" class="incorrect-answer pa-2" cols="6">不正解</v-col>
          <v-col v-else class="pa-2" cols="6">未回答</v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import exam from '../json/exam.json'
import store from '../store/store'
const UNANSWERED = 0
const CORRECT_ANSWER = 1
const INCORRECT_ANSWER = 2

export default {
  data () {
    return {
      answer: store.state.answer,
      items: exam,
    }
  },
  methods: {
    checkTheAnswer(item) {
      const target = this.answer.find(answer => !!answer && answer.id === item.id)
      if (!target) {
        return UNANSWERED
      }
      else if (item.answer.length !== target.answer.length) {
        return INCORRECT_ANSWER
      }
      let answerCheckMode = CORRECT_ANSWER
      for (let i = 0; i < item.answer.length; i++) {
        if (item.answer[i] === target.answer[i]) {
          continue
        } else {
          answerCheckMode = INCORRECT_ANSWER
          break
        }
      }
      return answerCheckMode
    }
  }
}
</script>
