<style scoped>
  .result {
    background: lightgreen;
  }
  .ng {
    background: lightcoral;
  }
</style>
<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-card outlined class="px-2">
        <v-row
          v-for="subQuestion in subQuestions"
          :key="subQuestion.no"
          no-gutters
          align="center"
        >
          <v-col cols="6" class="py-2">
            {{ subQuestion.text }}
          </v-col>
          <v-col cols="6" class="py-2">
            <v-select
              v-model="selected[subQuestion.no - 1]"
              :items="subQuestion.choices"
              :readonly="resultFlg"
              item-text="text"
              item-value="no"
              outlined
              dense
              hide-details
              @change="changeItem($event, subQuestion.no)"
            ></v-select>
            <div
              v-if="resultFlg"
              :class="subQuestion.answerFlg ? 'result' : 'ng'"
            >
              {{ showAnswer(subQuestion) }}
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import store from '../store/store'

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    result: {
      type: Array,
      require: false,
      default: undefined,
    },
    resultFlg: {
      type: Boolean,
      require: false,
      default: false,
    }
  },
  data () {
    return {
      answer: [],
      selected: [],
      subQuestions: this.item.sub_questions,
    }
  },
  created() {
    if (!this.result) {
      return
    }
    this.answer = this.result
    this.selected = this.answer.map(data => Number(data.split('-')[1]))
  },
  watch: {
    result() {
      if (!this.result) {
        return
      }
      this.answer = this.result
      this.selected = this.answer.map(data => Number(data.split('-')[1]))
    }
  },
  methods: {
    changeItem(event, no) {
      this.$set(this.answer, no - 1, `${no}-${event}`)
      const data = {
        index: this.index,
        answer: this.answer,
        id: this.item.id
      }
      store.commit('setAnswer', data)
    },
    showAnswer(subQuestion) {
      const answer = this.item.answer
      const targetSubQuestions = answer.find(ans => Number(ans.split('-')[0]) === subQuestion.no)
      if (!targetSubQuestions) {
        return ''
      }
      const targetSubQuestionsNo = targetSubQuestions.split('-')[1]
      const targetAnswer = subQuestion.choices.find(choice => choice.no === Number(targetSubQuestionsNo))

      const target = this.answer[subQuestion.no - 1]
      if (target) {
        const targeNo = target.split('-')[1]
        this.$set(this.subQuestions[subQuestion.no - 1], 'answerFlg', targeNo === targetSubQuestionsNo)
      } else {
        this.$set(this.subQuestions[subQuestion.no - 1], 'answerFlg', false)
      }
      return targetAnswer.text
    }
  }
}
</script>
