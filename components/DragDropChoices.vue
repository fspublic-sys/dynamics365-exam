<style scoped>
  .choice-card {
    width: 50%;
  }
  .answer-area {
    height: 100%;
  }
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
      <v-card
        outlined
        class="choice_card"
      >
        <v-data-table
          :headers="choicesHeaders"
          :items="item.choices"
          hide-default-footer
        >
          <template v-slot:item.text="props">
            <div :id="props.item.no" :draggable="!item.resultFlg" @dragstart="dragstart(props.item)">{{ props.item.text }}</div>
          </template>
        </v-data-table>
      </v-card>
      <v-card
        outlined
        class="mt-3"
      >
        <v-data-table
          :headers="questionsHeaders"
          :items="subQuestions"
          hide-default-footer
        >
          <template v-slot:item.answer="props">
            <v-row
              no-gutters
              align="center"
              class="answer-area"
              @dragover="dragover"
              @drop="drop(props)"
            >
              <v-col cols="12">{{ props.item.answer }}</v-col>
              <v-col
                v-if="item.resultFlg"
                cols="12"
                :class="props.item.answerFlg ? 'result' : 'ng'"
              >{{ showAnswer(props) }}</v-col>
            </v-row>
          </template>
        </v-data-table>
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
    }
  },
  data () {
    return {
      answer: [],
      subQuestions: this.item.sub_questions,
      choicesHeaders: [
        {
          text: '選択肢',
          align: 'start',
          value: 'text',
          sortable: false
        }
      ],
      questionsHeaders: [
        {
          text: '問題',
          align: 'start',
          value: 'text',
          sortable: false
        },
        {
          text: '解答',
          align: 'start',
          value: 'answer',
          width: '30%',
          sortable: false
        }
      ],
      dragItem: {},
    }
  },
  created() {
    if (!this.result) {
      return
    }
    const answer = this.result
    for (let i = 0; i < answer.length; i++) {
      const answerNo = Number(answer[i].split('-')[1])
      const coice = this.item.choices.find(coice => coice.no === answerNo)
      this.$set(this.subQuestions[i], 'answer', coice.text)
    }
  },
  methods: {
    dragstart(item) {
      this.dragItem = item
    },
    dragover(event) {
      event.preventDefault()
    },
    drop(props) {
      this.$set(this.subQuestions[props.index], 'answer', this.dragItem.text)
      this.answer[props.index] = `${props.item.no}-${this.dragItem.no}`
      const data = {
        index: this.index,
        answer: this.answer,
        id: this.item.id
      }
      store.commit('setAnswer', data)
    },
    showAnswer(props) {
      const answer = this.item.answer
      const targetChoicesNo = answer[props.item.no - 1].split('-')[1]
      const targetAnswer = this.item.choices.find(choice => choice.no === Number(targetChoicesNo))
      this.$set(this.subQuestions[props.index], 'answerFlg', props.item.answer === targetAnswer.text)
      return targetAnswer.text
    }
  }
}
</script>
